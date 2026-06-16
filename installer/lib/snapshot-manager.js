/**
 * REASP Installer — Snapshot manager.
 *
 * Creates, restores, lists, and deletes per-agent configuration snapshots
 * under `~/.reasp/snapshots/<agent-id>/<timestamp>-<slug>/`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { TARGETS } from './targets/index.js';
import { detectAgent } from './detect.js';
import { REASP_CLI_VERSION } from './constants.js';
import { getSnapshotsDir, ensureReaspDirs } from './config-manager.js';
import {
  countFilesAndSize,
  generateSnapshotId,
  sanitizeSlug,
  atomicReplaceDirectory,
  checkDiskSpace,
} from './safety.js';

// Re-export slug helper so callers can normalize snapshot names directly.
export { sanitizeSlug };

/** Return the directory that stores snapshots for a specific agent. */
export function getAgentSnapshotsDir(ctx, agentId) {
  return path.join(getSnapshotsDir(ctx), agentId);
}

/** Return the directory for a specific snapshot. */
export function getSnapshotDir(ctx, agentId, snapshotId) {
  return path.join(getAgentSnapshotsDir(ctx, agentId), snapshotId);
}

/**
 * List snapshots.
 *
 * If `agentId` is provided, only snapshots for that agent are returned.
 * Otherwise all agent snapshots are returned.
 *
 * @returns {Array<object>} Metadata objects from `snapshot.json`.
 */
export function listSnapshots(ctx, agentId) {
  const snapshotsDir = getSnapshotsDir(ctx);
  if (!fs.existsSync(snapshotsDir)) return [];

  const agentIds = agentId ? [agentId] : fs.readdirSync(snapshotsDir);
  const results = [];

  for (const id of agentIds) {
    const agentDir = path.join(snapshotsDir, id);
    if (!fs.existsSync(agentDir) || !fs.statSync(agentDir).isDirectory()) continue;

    const entries = fs.readdirSync(agentDir);
    for (const entry of entries) {
      const snapshotDir = path.join(agentDir, entry);
      const metadataPath = path.join(snapshotDir, 'snapshot.json');
      if (!fs.existsSync(metadataPath)) continue;

      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        results.push(metadata);
      } catch {
        // Skip corrupt metadata files.
      }
    }
  }

  // Newest first.
  return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Create a new snapshot for the given agent.
 *
 * @param {object} ctx
 * @param {string} agentId
 * @param {string} name Human-readable snapshot name
 * @param {string} [note] Optional note
 * @returns {{success:boolean, metadata?:object, message?:string}}
 */
export function createSnapshot(ctx, agentId, name, note) {
  const target = TARGETS[agentId];
  if (!target) {
    return { success: false, message: `Unknown agent target: ${agentId}` };
  }

  const sourceDir = target.getGlobalDir(ctx);
  if (!fs.existsSync(sourceDir)) {
    return { success: false, message: `Source directory does not exist: ${sourceDir}` };
  }

  ensureReaspDirs(ctx);

  const agentDir = getAgentSnapshotsDir(ctx, agentId);
  if (!fs.existsSync(agentDir)) {
    fs.mkdirSync(agentDir, { recursive: true });
  }

  const now = new Date();
  const baseSlug = sanitizeSlug(name);
  const snapshotId = resolveUniqueSnapshotId(agentDir, now, baseSlug);
  const snapshotDir = path.join(agentDir, snapshotId);
  const dataDir = path.join(snapshotDir, 'data');

  // Best-effort disk space guard.
  const spaceCheck = checkDiskSpace(sourceDir, dataDir);
  if (!spaceCheck.ok && !ctx.force) {
    return {
      success: false,
      message: `Not enough disk space for snapshot (needs ${formatBytes(spaceCheck.needed)}, available ${formatBytes(spaceCheck.available)}). Use --force to proceed anyway.`,
    };
  }

  // Copy the entire agent config directory.
  fs.cpSync(sourceDir, dataDir, { recursive: true, dereference: false });

  // Integrity check: ensure data directory exists.
  if (!fs.existsSync(dataDir)) {
    return { success: false, message: 'Snapshot data directory was not created' };
  }

  // Compute size and file count from the copied data.
  const { fileCount, sizeBytes } = countFilesAndSize(dataDir);

  const detected = detectAgent(agentId);
  const metadata = {
    id: snapshotId,
    name: String(name || baseSlug).trim(),
    agentId,
    agentDisplayName: target.displayName,
    createdAt: now.toISOString(),
    sourcePath: sourceDir,
    dataPath: dataDir,
    reaspVersion: REASP_CLI_VERSION,
    agentVersion: detected?.version || 'unknown',
    sizeBytes,
    fileCount,
    note: note || '',
  };

  fs.writeFileSync(path.join(snapshotDir, 'snapshot.json'), JSON.stringify(metadata, null, 2), 'utf8');

  return { success: true, metadata };
}

/**
 * Restore a snapshot over the agent's live global directory.
 *
 * The current live directory is backed up automatically by
 * `atomicReplaceDirectory` and removed on success.
 *
 * @returns {{success:boolean, message?:string}}
 */
export function restoreSnapshot(ctx, agentId, snapshotId) {
  const target = TARGETS[agentId];
  if (!target) {
    return { success: false, message: `Unknown agent target: ${agentId}` };
  }

  const snapshotDir = getSnapshotDir(ctx, agentId, snapshotId);
  const metadataPath = path.join(snapshotDir, 'snapshot.json');

  if (!fs.existsSync(metadataPath)) {
    return { success: false, message: `Snapshot not found: ${snapshotId}` };
  }

  let metadata;
  try {
    metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  } catch {
    return { success: false, message: `Corrupt snapshot metadata: ${snapshotId}` };
  }

  const dataDir = path.join(snapshotDir, 'data');
  if (!fs.existsSync(dataDir)) {
    return { success: false, message: `Snapshot data missing: ${dataDir}` };
  }

  const targetDir = target.getGlobalDir(ctx);

  // Always back up the current live state before restoring, so the user can
  // undo an accidental restore.
  const liveBackupName = `auto-restore-backup-${Date.now()}`;
  const liveBackup = createSnapshot(ctx, agentId, liveBackupName, 'Automatic backup before restore');
  if (!liveBackup.success) {
    return { success: false, message: `Could not create safety backup: ${liveBackup.message}` };
  }

  atomicReplaceDirectory(targetDir, dataDir);

  return { success: true, message: `Restored ${snapshotId} to ${targetDir}` };
}

/**
 * Delete a snapshot permanently.
 *
 * @returns {{success:boolean, message?:string}}
 */
export function deleteSnapshot(ctx, agentId, snapshotId) {
  const snapshotDir = getSnapshotDir(ctx, agentId, snapshotId);
  if (!fs.existsSync(snapshotDir)) {
    return { success: false, message: `Snapshot not found: ${snapshotId}` };
  }

  fs.rmSync(snapshotDir, { recursive: true, force: true });
  return { success: true, message: `Deleted snapshot ${snapshotId}` };
}

/**
 * Purge old snapshots for an agent, keeping only the newest `keep` snapshots.
 *
 * @param {object} ctx
 * @param {string} agentId
 * @param {number} keep Number of snapshots to keep
 * @returns {{success:boolean, deleted:string[], message?:string}}
 */
export function purgeSnapshots(ctx, agentId, keep) {
  if (typeof keep !== 'number' || !Number.isFinite(keep) || keep < 0) {
    return { success: false, message: `Invalid keep value: ${keep}` };
  }

  const all = listSnapshots(ctx, agentId);
  if (all.length <= keep) {
    return { success: true, deleted: [], message: 'No snapshots to purge' };
  }

  // listSnapshots returns newest first; delete everything after index keep-1.
  const toDelete = all.slice(keep);
  const deleted = [];

  for (const snapshot of toDelete) {
    const result = deleteSnapshot(ctx, agentId, snapshot.id);
    if (result.success) {
      deleted.push(snapshot.id);
    }
  }

  return {
    success: true,
    deleted,
    message: `Purged ${deleted.length} snapshot(s); kept ${keep}.`,
  };
}

/**
 * Format a byte count into a human-readable string.
 *
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  const n = Number(bytes);
  if (!Number.isFinite(n) || n < 0) return '0 B';
  if (n === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.min(Math.floor(Math.log(n) / Math.log(k)), units.length - 1);
  const value = n / Math.pow(k, i);

  // Avoid trailing zeros when the value is a whole number.
  const formatted = Number.isInteger(value) ? value.toString() : value.toFixed(2);
  return `${formatted} ${units[i]}`;
}

function resolveUniqueSnapshotId(agentDir, date, baseSlug) {
  let candidateId = generateSnapshotId(date, baseSlug);
  let counter = 2;

  while (fs.existsSync(path.join(agentDir, candidateId))) {
    const slugWithCounter = `${baseSlug}-${counter}`;
    candidateId = generateSnapshotId(date, slugWithCounter);
    counter++;
  }

  return candidateId;
}
