/**
 * REASP Installer — Safety helpers for snapshot operations.
 *
 * Provides filesystem size counting, best-effort process detection,
 * snapshot id generation, and atomic-ish directory restore.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

/**
 * Recursively count files and total bytes under a directory.
 *
 * @returns {{fileCount:number, sizeBytes:number}}
 */
export function countFilesAndSize(dirPath) {
  let fileCount = 0;
  let sizeBytes = 0;

  if (!fs.existsSync(dirPath)) {
    return { fileCount, sizeBytes };
  }

  const stack = [dirPath];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile() || entry.isSymbolicLink()) {
        fileCount++;
        try {
          const stat = fs.statSync(fullPath);
          sizeBytes += stat.size;
        } catch {
          // Ignore files we cannot stat (permissions, broken symlinks).
        }
      }
    }
  }

  return { fileCount, sizeBytes };
}

/**
 * Best-effort check whether an agent process is currently running.
 *
 * This is intentionally conservative: it returns `false` when detection
 * is unavailable or fails, so callers must pair it with explicit user
 * confirmation before destructive operations.
 *
 * @param {string} agentId
 * @returns {boolean}
 */
export function isAgentProcessRunning(agentId) {
  const processNames = getAgentProcessNames(agentId);
  if (processNames.length === 0) return false;

  try {
    if (process.platform === 'win32') {
      const output = execSync('tasklist /FO CSV /NH', { stdio: 'pipe', encoding: 'utf8', timeout: 5000 });
      const lowerOutput = output.toLowerCase();
      return processNames.some((name) => lowerOutput.includes(name.toLowerCase()));
    } else {
      const output = execSync('ps -eo comm=', { stdio: 'pipe', encoding: 'utf8', timeout: 5000 });
      const lines = output.split('\n').map((line) => line.trim().toLowerCase());
      return processNames.some((name) => lines.some((line) => line.includes(name.toLowerCase())));
    }
  } catch {
    return false;
  }
}

function getAgentProcessNames(agentId) {
  switch (agentId) {
    case 'opencode':
      return ['opencode', 'opencode-ai', 'opencode.exe'];
    case 'claude-code':
      return ['claude', 'claude-code', 'claude.exe'];
    case 'antigravity':
      return ['antigravity', 'antigravity.exe'];
    case 'gemini':
      return ['gemini', 'gemini.exe'];
    case 'codex':
      return ['codex', 'codex.exe'];
    default:
      return [];
  }
}

/**
 * Generate a filesystem-safe snapshot identifier.
 *
 * Format: `<ISO8601-UTC-without-colons>-<slug>`
 * Example: `2026-06-15T230000Z-clean`
 *
 * @param {Date} date
 * @param {string} slug
 * @returns {string}
 */
export function generateSnapshotId(date, slug) {
  const sanitizedSlug = sanitizeSlug(slug);
  const timestamp = date.toISOString().replace(/\.\d{3}Z$/, 'Z').replace(/:/g, '');
  return `${timestamp}-${sanitizedSlug}`;
}

/**
 * Sanitize a user-provided snapshot name into a filesystem-safe slug.
 *
 * Rules:
 * - Lowercase
 * - Replace spaces and special characters with a single dash
 * - Trim leading/trailing dashes
 * - Empty input falls back to `snapshot`
 *
 * @param {string} name
 * @returns {string}
 */
export function sanitizeSlug(name) {
  const input = String(name || '').trim().toLowerCase();
  const slug = input
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'snapshot';
}

/**
 * Best-effort disk space check before copying data to a destination.
 *
 * Returns `ok: false` when the estimated needed space would consume more
 * than 90% of the available free space. Returns `ok: true` when the check
 * cannot be performed so the CLI stays usable on all platforms.
 *
 * @param {string} sourceDir
 * @param {string} destDir
 * @returns {{ok:boolean, available?:number, needed?:number, usageRatio?:number}}
 */
export function checkDiskSpace(sourceDir, destDir) {
  try {
    const { sizeBytes: needed } = countFilesAndSize(sourceDir);
    if (needed === 0) return { ok: true };

    let checkDir = destDir;
    while (!fs.existsSync(checkDir)) {
      const parent = path.dirname(checkDir);
      if (parent === checkDir) break;
      checkDir = parent;
    }

    if (!fs.existsSync(checkDir)) return { ok: true };

    if (typeof fs.statfsSync === 'function') {
      const fsStat = fs.statfsSync(checkDir);
      const available = fsStat.bavail * fsStat.bsize;
      const usageRatio = needed / (available || 1);
      return { ok: usageRatio < 0.9, available, needed, usageRatio };
    }
  } catch {
    // Best-effort: ignore errors.
  }
  return { ok: true };
}

/**
 * Atomically-ish replace `liveDir` with the contents of `newDir`.
 *
 * 1. Copies `newDir` to a temp directory next to `liveDir`.
 * 2. Renames `liveDir` to a backup path.
 * 3. Renames the temp directory to `liveDir`.
 * 4. Removes the backup on success.
 *
 * On failure, the backup is moved back to `liveDir` if possible.
 *
 * @param {string} liveDir
 * @param {string} newDir
 * @returns {{success:boolean}}
 */
export function atomicReplaceDirectory(liveDir, newDir) {
  const tempOld = `${liveDir}.reasp-temp-old`;
  const tempNew = `${liveDir}.reasp-temp-new`;

  // Ensure the parent directory exists.
  const parentDir = path.dirname(liveDir);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }

  // Copy new content into the temp directory.
  fs.cpSync(newDir, tempNew, { recursive: true, dereference: false });

  try {
    if (fs.existsSync(liveDir)) {
      fs.renameSync(liveDir, tempOld);
    }
    fs.renameSync(tempNew, liveDir);
  } catch (err) {
    // Attempt to roll back if we created a backup.
    try {
      if (fs.existsSync(tempOld) && !fs.existsSync(liveDir)) {
        fs.renameSync(tempOld, liveDir);
      }
      if (fs.existsSync(tempNew)) {
        fs.rmSync(tempNew, { recursive: true, force: true });
      }
    } catch {
      // Rollback failed; surface the original error.
    }
    throw err;
  }

  // Cleanup backup on success.
  try {
    if (fs.existsSync(tempOld)) {
      fs.rmSync(tempOld, { recursive: true, force: true });
    }
  } catch {
    // Non-fatal: backup left behind for manual recovery.
  }

  return { success: true };
}
