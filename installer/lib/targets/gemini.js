/**
 * REASP Installer — Gemini CLI target adapter.
 *
 * Writes REASP configuration to the global Gemini instructions file:
 *   ~/.gemini/instructions.md
 *
 * TODO(verify): Confirm whether Gemini CLI reads ~/.gemini/instructions.md as
 * system instructions or if it expects a different file/key in config.json.
 */

import path from 'node:path';
import { getHomeDir } from '../constants.js';
import {
  detectForAdapter,
  installInstructionsFile,
  uninstallInstructionsFile,
  isReaspInstalled,
} from './_instructions.js';

export const id = 'gemini';
export const displayName = 'Gemini CLI';
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
  return ctx.globalDir || path.join(ctx.homeDir || getHomeDir(), '.gemini');
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
