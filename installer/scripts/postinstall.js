#!/usr/bin/env node

/**
 * REASP npm postinstall diagnostics.
 *
 * Windows can have an older standalone install in `C:\Program Files\REASP`
 * before the npm global prefix in PATH. In that case `npm install -g .`
 * succeeds, but `reasp` still executes the old shim. This script detects that
 * drift and, when possible, updates the legacy standalone directory too.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, '../..');
const IS_WINDOWS = process.platform === 'win32';

function log(message) {
  console.log(`[reasp-cli] ${message}`);
}

function warn(message) {
  console.warn(`[reasp-cli] WARNING: ${message}`);
}

function copyDirRecursiveSync(source, target) {
  if (!fs.existsSync(source)) return;
  if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source)) {
    const src = path.join(source, entry);
    const dest = path.join(target, entry);
    const stat = fs.lstatSync(src);
    if (stat.isDirectory()) {
      copyDirRecursiveSync(src, dest);
    } else if (stat.isFile()) {
      fs.copyFileSync(src, dest);
    }
  }
}

function removeIfExists(filePath) {
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath, { recursive: true, force: true });
  }
}

function syncStandaloneInstall(standaloneDir) {
  const entries = [
    'installer',
    'scripts',
    '.opencode',
    '.MeridianUI',
    'README.md',
    'LICENSE.md',
    'REASP-Guide.html',
    'GIT-GITHUB-GUIDE.html',
    'package.json',
  ];

  for (const entry of entries) {
    const src = path.join(PACKAGE_ROOT, entry);
    const dest = path.join(standaloneDir, entry);
    if (!fs.existsSync(src)) continue;
    removeIfExists(dest);
    if (fs.lstatSync(src).isDirectory()) {
      copyDirRecursiveSync(src, dest);
    } else {
      fs.copyFileSync(src, dest);
    }
  }
}

function findCommandCandidates(name) {
  const pathEnv = process.env.PATH || '';
  const pathExt = IS_WINDOWS ? ['.ps1', '.cmd', '.bat', '.exe', ''] : [''];
  const candidates = [];
  for (const dir of pathEnv.split(path.delimiter).filter(Boolean)) {
    for (const ext of pathExt) {
      const candidate = path.join(dir, `${name}${ext}`);
      if (fs.existsSync(candidate)) candidates.push(path.resolve(candidate));
    }
  }
  return candidates;
}

function isExpectedNpmShim(candidate) {
  const prefix = process.env.npm_config_prefix;
  if (!prefix) return false;
  const relative = path.relative(path.resolve(prefix), candidate);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}

function main() {
  if (!IS_WINDOWS) return;

  const candidates = findCommandCandidates('reasp');
  const first = candidates[0];
  if (!first || isExpectedNpmShim(first)) return;

  const standaloneDir = path.dirname(first);
  const standaloneIndex = path.join(standaloneDir, 'installer', 'index.js');
  if (!fs.existsSync(standaloneIndex)) return;

  warn(`'reasp' in PATH resolves to '${first}' before the npm global shim.`);
  warn(`npm installed the new CLI at '${process.env.npm_config_prefix || 'npm global prefix'}', but Windows will execute the earlier shim first.`);

  try {
    syncStandaloneInstall(standaloneDir);
    log(`Updated legacy standalone REASP installation at '${standaloneDir}'.`);
  } catch (err) {
    warn(`Could not update '${standaloneDir}': ${err.message}`);
    warn('Run PowerShell as Administrator and execute `npm install -g .` again, or move the npm global prefix before the legacy REASP directory in PATH.');
  }
}

main();
