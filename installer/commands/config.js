/**
 * REASP Installer — Global config subcommand handler.
 *
 * Parses `reasp config [options]` and updates `~/.reasp/config.json`.
 */

import { loadReaspConfig, saveReaspConfig } from '../lib/config-manager.js';
import { printSuccess, printError, printInfo, printHeader, THEME } from '../lib/tui.js';

function buildContext() {
  return {
    homeDir: process.env.USERPROFILE || process.env.HOME,
  };
}

function printConfig(config) {
  printHeader('REASP Configuration');
  console.log(`  ${THEME.dim('version:')}                    ${config.version}`);
  console.log(`  ${THEME.dim('snapshotsDir:')}               ${config.snapshotsDir}`);
  console.log(`  ${THEME.dim('autoSnapshotBeforeInstall:')}  ${config.autoSnapshotBeforeInstall}`);
  console.log(`  ${THEME.dim('autoSnapshotBeforeUninstall:')}${config.autoSnapshotBeforeUninstall}`);
  console.log(`  ${THEME.dim('maxSnapshotsPerAgent:')}       ${config.maxSnapshotsPerAgent === 0 ? 'unlimited' : config.maxSnapshotsPerAgent}`);
}

function parseBoolean(value) {
  const text = String(value).toLowerCase().trim();
  if (text === 'true' || text === '1' || text === 'yes' || text === 'on') return true;
  if (text === 'false' || text === '0' || text === 'no' || text === 'off') return false;
  return null;
}

export default async function cmdConfig(args, flags) {
  const ctx = buildContext();
  let config = loadReaspConfig(ctx);
  let updated = false;

  if (flags['snapshots-dir']) {
    config.snapshotsDir = String(flags['snapshots-dir']);
    updated = true;
  }

  if (flags['auto-snapshot-before-install'] !== undefined) {
    const value = parseBoolean(flags['auto-snapshot-before-install']);
    if (value === null) {
      printError('Invalid boolean value for --auto-snapshot-before-install');
      process.exit(1);
    }
    config.autoSnapshotBeforeInstall = value;
    updated = true;
  }

  if (flags['auto-snapshot-before-uninstall'] !== undefined) {
    const value = parseBoolean(flags['auto-snapshot-before-uninstall']);
    if (value === null) {
      printError('Invalid boolean value for --auto-snapshot-before-uninstall');
      process.exit(1);
    }
    config.autoSnapshotBeforeUninstall = value;
    updated = true;
  }

  if (flags['max-snapshots-per-agent'] !== undefined) {
    const n = Number(flags['max-snapshots-per-agent']);
    if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) {
      printError('Invalid number for --max-snapshots-per-agent');
      process.exit(1);
    }
    config.maxSnapshotsPerAgent = n;
    updated = true;
  }

  if (updated) {
    config = saveReaspConfig(ctx, config);
    printSuccess('Configuration updated');
  }

  printConfig(config);
}
