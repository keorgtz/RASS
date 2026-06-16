/**
 * REASP Installer — Claude Code target adapter.
 *
 * Writes REASP configuration to the global Claude Code instructions file:
 *   ~/.claude/CLAUDE.md
 *
 * TODO(verify): Confirm that Claude Code loads ~/.claude/CLAUDE.md automatically
 * as its system instructions. Optional ~/.claude/settings.json support is not
 * implemented because model routing is conveyed inside the instructions block.
 */

import path from 'node:path';
import { getHomeDir } from '../constants.js';
import {
  detectForAdapter,
  installInstructionsFile,
  uninstallInstructionsFile,
  isReaspInstalled,
} from './_instructions.js';

export const id = 'claude-code';
export const displayName = 'Claude Code';
export const capabilities = {
  agents: false,
  plugins: false,
  slashCommands: false,
  mcp: false,
  instructions: true,
  permissions: false,
  models: false,
};

export function getGlobalDir(ctx = {}) {
  return ctx.globalDir || path.join(ctx.homeDir || getHomeDir(), '.claude');
}

export function getConfigPath(ctx = {}) {
  return path.join(getGlobalDir(ctx), 'CLAUDE.md');
}

export function detect(ctx = {}) {
  return detectForAdapter(id);
}

export function isInstalled(ctx = {}) {
  return isReaspInstalled(getConfigPath(ctx));
}

export function install(ctx, bundle) {
  return installInstructionsFile(ctx, bundle, getConfigPath(ctx));
}

export function uninstall(ctx) {
  return uninstallInstructionsFile(ctx, getConfigPath(ctx));
}

export default {
  id,
  displayName,
  capabilities,
  detect,
  getGlobalDir,
  isInstalled,
  install,
  uninstall,
};
