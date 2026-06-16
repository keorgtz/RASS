/**
 * REASP Installer — Global configuration manager.
 *
 * Loads and persists `~/.reasp/config.json`, which controls snapshot
 * storage location and snapshot lifecycle defaults.
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  getHomeDir,
  REASP_DIR,
  REASP_CONFIG_PATH,
  SNAPSHOTS_DIR,
  REASP_CLI_VERSION,
  DEFAULT_MAX_SNAPSHOTS_PER_AGENT,
} from './constants.js';

function resolveHome(ctx = {}) {
  return ctx.homeDir || getHomeDir();
}

/** Return the active REASP global state directory. */
export function getReaspDir(ctx = {}) {
  return ctx.reaspDir || path.join(resolveHome(ctx), '.reasp');
}

/** Return the active REASP configuration file path. */
export function getReaspConfigPath(ctx = {}) {
  return ctx.reaspConfigPath || path.join(getReaspDir(ctx), 'config.json');
}

/**
 * Return the configured snapshots directory.
 * Honors `config.snapshotsDir` when present, otherwise falls back to
 * `~/.reasp/snapshots`.
 */
export function getSnapshotsDir(ctx = {}) {
  const config = loadReaspConfig(ctx);
  return config.snapshotsDir || path.join(getReaspDir(ctx), 'snapshots');
}

/** Ensure that REASP global directories exist on disk. */
export function ensureReaspDirs(ctx = {}) {
  const reaspDir = getReaspDir(ctx);
  const snapshotsDir = getSnapshotsDir(ctx);

  if (!fs.existsSync(reaspDir)) {
    fs.mkdirSync(reaspDir, { recursive: true });
  }
  if (!fs.existsSync(snapshotsDir)) {
    fs.mkdirSync(snapshotsDir, { recursive: true });
  }

  return { reaspDir, snapshotsDir };
}

/**
 * Load REASP global configuration, creating a default file if none exists.
 */
export function loadReaspConfig(ctx = {}) {
  const configPath = getReaspConfigPath(ctx);

  if (fs.existsSync(configPath)) {
    try {
      const raw = fs.readFileSync(configPath, 'utf8');
      const parsed = JSON.parse(raw);
      return normalizeConfig(parsed, ctx);
    } catch (err) {
      // If the file is corrupt, fall back to defaults so the CLI stays usable.
      console.warn(`[reasp] Warning: could not read ${configPath}, using defaults.`);
    }
  }

  return buildDefaultConfig(ctx);
}

/**
 * Persist REASP global configuration atomically (write + rename).
 */
export function saveReaspConfig(ctx = {}, config) {
  ensureReaspDirs(ctx);
  const configPath = getReaspConfigPath(ctx);
  const normalized = normalizeConfig(config, ctx);
  const tempPath = `${configPath}.tmp`;

  fs.writeFileSync(tempPath, JSON.stringify(normalized, null, 2), 'utf8');
  fs.renameSync(tempPath, configPath);

  return normalized;
}

function buildDefaultConfig(ctx = {}) {
  const reaspDir = getReaspDir(ctx);
  return {
    version: REASP_CLI_VERSION,
    snapshotsDir: path.join(reaspDir, 'snapshots'),
    autoSnapshotBeforeInstall: true,
    autoSnapshotBeforeUninstall: true,
    maxSnapshotsPerAgent: DEFAULT_MAX_SNAPSHOTS_PER_AGENT,
  };
}

function normalizeConfig(config, ctx = {}) {
  const defaults = buildDefaultConfig(ctx);
  return {
    version: config?.version ?? defaults.version,
    snapshotsDir: config?.snapshotsDir ?? defaults.snapshotsDir,
    autoSnapshotBeforeInstall: config?.autoSnapshotBeforeInstall ?? defaults.autoSnapshotBeforeInstall,
    autoSnapshotBeforeUninstall: config?.autoSnapshotBeforeUninstall ?? defaults.autoSnapshotBeforeUninstall,
    maxSnapshotsPerAgent: normalizeMaxSnapshots(config?.maxSnapshotsPerAgent),
  };
}

function normalizeMaxSnapshots(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return DEFAULT_MAX_SNAPSHOTS_PER_AGENT;
  return Math.floor(n);
}
