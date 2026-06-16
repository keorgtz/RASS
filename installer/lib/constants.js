/**
 * REASP Installer — Shared constants and cross-platform helpers.
 *
 * This file is the single source of truth for canonical paths,
 * supported agent targets, and default configuration values.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Absolute path to the canonical REASP assets inside `.opencode/`. */
export const SOURCE_DIR = path.resolve(__dirname, '../../.opencode');

/** REASP CLI semantic version. */
export const REASP_CLI_VERSION = '1.0.0';

/** Default maximum number of snapshots kept per agent (0 = unlimited). */
export const DEFAULT_MAX_SNAPSHOTS_PER_AGENT = 0;

/** Default SDD ModeProfile used when the user does not choose one. */
export const DEFAULT_MODEPROFILE = 'ryouset';

/** Default REASP workflow agent. */
export const DEFAULT_WORKFLOW = 'ryou-orchestrator';

/** Canonical source directories and files copied by the OpenCode adapter. */
export const REASP_ASSETS = {
  dirsToCopy: ['sdd-profiles', 'phases', 'runtime', 'agents', 'rules', 'skills', 'refi'],
  filesToCopy: ['sdd.config.json', 'reasp.config.json', 'plugin.js', 'tui.js', 'rass-core.js', 'package.json'],
};

/**
 * Supported AI agent targets.
 *
 * `capabilities` declares which REASP concepts the target can express natively.
 * Adapters must degrade gracefully when a capability is `false`.
 */
export const AGENT_TARGETS = [
  {
    id: 'opencode',
    displayName: 'OpenCode',
    defaultEnabled: true,
    capabilities: {
      agents: true,
      plugins: true,
      slashCommands: true,
      mcp: true,
      instructions: true,
      permissions: true,
      models: true,
    },
  },
  {
    id: 'claude-code',
    displayName: 'Claude Code',
    defaultEnabled: false,
    capabilities: {
      agents: false,
      plugins: false,
      slashCommands: false,
      mcp: false,
      instructions: true,
      permissions: false,
      models: false,
    },
  },
  {
    id: 'antigravity',
    displayName: 'Antigravity CLI',
    defaultEnabled: false,
    capabilities: {
      agents: false,
      plugins: false,
      slashCommands: false,
      mcp: false,
      instructions: true,
      permissions: false,
      models: false,
    },
  },
  {
    id: 'gemini',
    displayName: 'Gemini CLI',
    defaultEnabled: false,
    capabilities: {
      agents: false,
      plugins: false,
      slashCommands: false,
      mcp: false,
      instructions: true,
      permissions: false,
      models: false,
    },
  },
  {
    id: 'codex',
    displayName: 'Codex',
    defaultEnabled: false,
    capabilities: {
      agents: false,
      plugins: false,
      slashCommands: false,
      mcp: false,
      instructions: true,
      permissions: false,
      models: false,
    },
  },
];

/** Human-readable descriptions for capability flags (used by TUI / help). */
export const CAPABILITY_DESCRIPTIONS = {
  agents: 'Native agent definitions',
  plugins: 'Native plugin / extension system',
  slashCommands: 'Custom slash commands',
  mcp: 'MCP server support',
  instructions: 'System / project instructions',
  permissions: 'Fine-grained permission model',
  models: 'Per-agent model routing',
};

/**
 * Return the user's home directory across platforms.
 * Falls back to `os.homedir()` when environment variables are missing.
 */
export function getHomeDir() {
  return process.env.USERPROFILE || process.env.HOME || os.homedir();
}

/** Canonical REASP global state directory (`~/.reasp`). */
export const REASP_DIR = path.join(getHomeDir(), '.reasp');

/** Canonical REASP global configuration file path. */
export const REASP_CONFIG_PATH = path.join(REASP_DIR, 'config.json');

/** Canonical directory where agent snapshots are stored. */
export const SNAPSHOTS_DIR = path.join(REASP_DIR, 'snapshots');

/**
 * Resolve the default OpenCode global configuration directory.
 * OpenCode uses `~/.config/opencode` on all supported platforms.
 */
export function getGlobalOpenCodeDir() {
  return path.join(getHomeDir(), '.config', 'opencode');
}
