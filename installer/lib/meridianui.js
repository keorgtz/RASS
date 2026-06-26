/**
 * REASP Installer — MeridianUI global installer.
 *
 * Copies the .MeridianUI/ directory from the repo root to the user's home
 * directory (~/.MeridianUI/) on both Windows and Linux/macOS.
 *
 * This runs as a shared pre-install step, once per `reasp install` invocation,
 * regardless of which agent targets are selected.
 */

import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT } from './constants.js';

/** Path to the MeridianUI source inside the REASP repo. */
export function getMeridianUISourceDir() {
  return path.join(REPO_ROOT, '.MeridianUI');
}

/** Path to the MeridianUI global install destination on the current OS. */
export function getMeridianUIDestDir(homeDir) {
  return path.join(homeDir, '.MeridianUI');
}

/**
 * Returns true when the source directory contains real content beyond a
 * .gitkeep placeholder.
 */
function hasRealContent(sourceDir) {
  if (!fs.existsSync(sourceDir)) return false;
  const entries = fs.readdirSync(sourceDir).filter((f) => f !== '.gitkeep');
  return entries.length > 0;
}

/**
 * Install MeridianUI from the repo to the user's home directory.
 *
 * @param {object} ctx
 * @param {string} ctx.homeDir   - Resolved home directory of the current user.
 * @param {boolean} [ctx.dryRun] - When true, log intent without writing.
 * @param {Function} [ctx.log]   - Optional logger with .info(), .warn(), .success(), .error().
 * @returns {{ installed: boolean, reason?: string, destDir?: string }}
 */
export async function installMeridianUI(ctx) {
  const log = ctx.log || {
    info: (m) => console.log(m),
    warn: (m) => console.warn(m),
    success: (m) => console.log(m),
    error: (m) => console.error(m),
  };

  const sourceDir = getMeridianUISourceDir();
  const destDir = getMeridianUIDestDir(ctx.homeDir);

  if (!hasRealContent(sourceDir)) {
    log.warn(
      '⚠  .MeridianUI/ is empty or not yet populated in the repo — skipping MeridianUI install.\n' +
        '   Add your MeridianUI content to .MeridianUI/ and re-run `reasp install`.'
    );
    return { installed: false, reason: 'empty-source' };
  }

  if (ctx.dryRun) {
    log.info(`[dry-run] Would copy .MeridianUI/ → ${destDir}`);
    return { installed: false, reason: 'dry-run' };
  }

  try {
    await fs.promises.cp(sourceDir, destDir, { recursive: true });
    log.success(`✓ MeridianUI installed → ${destDir}`);
    return { installed: true, destDir };
  } catch (err) {
    log.error(`✗ MeridianUI install failed: ${err.message}`);
    return { installed: false, reason: 'copy-error', error: err };
  }
}
