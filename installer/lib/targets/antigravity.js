/**
 * REASP Installer — Antigravity CLI target adapter (experimental).
 *
 * Antigravity's configuration format is the least documented of the supported
 * targets. This adapter uses the conventional path:
 *   ~/.antigravity/instructions.md
 *
 * You can override the instructions file via the ANTIGRAVITY_CONFIG_PATH
 * environment variable.
 *
 * TODO(verify): Verify the actual configuration file and format expected by
 * Antigravity CLI. Until confirmed, this adapter is marked experimental.
 */

import path from 'node:path';
import { getHomeDir } from '../constants.js';
import {
  detectForAdapter,
  installInstructionsFile,
  uninstallInstructionsFile,
  isReaspInstalled,
} from './_instructions.js';

export const id = 'antigravity';
export const displayName = 'Antigravity CLI';
export const capabilities = {
  agents: false,
  plugins: false,
  slashCommands: false,
  mcp: false,
  instructions: true,
  permissions: false,
  models: false,
};

function resolveConfigPath(ctx = {}) {
  if (process.env.ANTIGRAVITY_CONFIG_PATH) {
    return process.env.ANTIGRAVITY_CONFIG_PATH;
  }
  return path.join(getGlobalDir(ctx), 'instructions.md');
}

export function getGlobalDir(ctx = {}) {
  if (process.env.ANTIGRAVITY_CONFIG_PATH) {
    return path.dirname(process.env.ANTIGRAVITY_CONFIG_PATH);
  }
  return ctx.globalDir || path.join(ctx.homeDir || getHomeDir(), '.antigravity');
}

export function detect(ctx = {}) {
  return detectForAdapter(id);
}

export function isInstalled(ctx = {}) {
  return isReaspInstalled(resolveConfigPath(ctx));
}

export function install(ctx, bundle) {
  return installInstructionsFile(ctx, bundle, resolveConfigPath(ctx));
}

export function uninstall(ctx) {
  return uninstallInstructionsFile(ctx, resolveConfigPath(ctx));
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
