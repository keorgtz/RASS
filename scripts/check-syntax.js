#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const targets = [
  'installer/index.js',
  'installer/lib',
  'installer/lib/targets',
  'installer/commands',
  'installer/scripts',
];

function collectJsFiles(entry) {
  const fullPath = path.join(repoRoot, entry);
  if (!fs.existsSync(fullPath)) return [];
  const stat = fs.lstatSync(fullPath);
  if (stat.isFile()) return fullPath.endsWith('.js') ? [fullPath] : [];
  if (!stat.isDirectory()) return [];

  return fs.readdirSync(fullPath)
    .filter((name) => name.endsWith('.js'))
    .map((name) => path.join(fullPath, name));
}

const files = targets.flatMap(collectJsFiles);
let failed = false;

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (result.status !== 0) failed = true;
}

process.exit(failed ? 1 : 0);
