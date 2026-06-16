/**
 * REASP Installer — Codex target adapter.
 *
 * Writes REASP configuration to the global Codex instructions file:
 *   ~/.codex/instructions.md
 *
 * TODO(verify): Confirm the exact filename/location Codex uses for system
 * instructions. Some Codex distributions may prefer ~/.codex/config.json; this
 * adapter falls back to the most common markdown convention.
 */

import path from 'node:path';
import { getHomeDir } from '../constants.js';
import {
  detectForAdapter,
  installInstructionsFile,
  uninstallInstructionsFile,
  isReaspInstalled,
} from './_instructions.js';

export const id = 'codex';
export const displayName = 'Codex';
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
  return ctx.globalDir || path.join(ctx.homeDir || getHomeDir(), '.codex');
}

export function getConfigPath(ctx = {}) {
  return path.join(getGlobalDir(ctx), 'instructions.md');
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
