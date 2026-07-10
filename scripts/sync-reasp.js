/**
 * REASP Config Sync
 *
 * Usage:
 *   node scripts/sync-reasp.js push   — Copy REASP/.opencode/ -> ~/.config/opencode/
 *   node scripts/sync-reasp.js pull   — Copy ~/.config/opencode/ RASS files -> REASP/.opencode/
 *
 * Keeps the development repo and the live OpenCode installation in sync.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_DIR = path.resolve(__dirname, '..');
const REPO_OPENCODE_DIR = path.join(REPO_DIR, '.opencode');
const HOME = process.env.USERPROFILE || process.env.HOME || os.homedir();
const GLOBAL_OPENCODE_DIR = path.join(HOME, '.config', 'opencode');

const DIRS_TO_SYNC = ['sdd-profiles', 'phases', 'runtime', 'agents', 'rules', 'skills', 'refi'];
const FILES_TO_SYNC = ['sdd.config.json', 'reasp.config.json', 'plugin.js', 'tui.js', 'rass-core.js', 'package.json'];

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function copyDirRecursiveSync(source, target, onFileCopied = null) {
  if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
  for (const file of fs.readdirSync(source)) {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyDirRecursiveSync(curSource, curTarget, onFileCopied);
    } else {
      fs.copyFileSync(curSource, curTarget);
      if (onFileCopied) onFileCopied(curSource, curTarget);
    }
  }
}

function syncPush() {
  console.log(`Pushing REASP config from ${REPO_OPENCODE_DIR}`);
  console.log(`                     to ${GLOBAL_OPENCODE_DIR}\n`);

  if (!fs.existsSync(GLOBAL_OPENCODE_DIR)) {
    fs.mkdirSync(GLOBAL_OPENCODE_DIR, { recursive: true });
  }

  for (const dir of DIRS_TO_SYNC) {
    const src = path.join(REPO_OPENCODE_DIR, dir);
    const dest = path.join(GLOBAL_OPENCODE_DIR, dir);
    if (fs.existsSync(src)) {
      copyDirRecursiveSync(src, dest);
      console.log(`  [dir]  ${dir}`);
    }
  }

  for (const file of FILES_TO_SYNC) {
    const src = path.join(REPO_OPENCODE_DIR, file);
    const dest = path.join(GLOBAL_OPENCODE_DIR, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`  [file] ${file}`);
    }
  }

  // Refresh runtime/agents from the active ModeProfile after push
  const rassCorePath = path.join(GLOBAL_OPENCODE_DIR, 'rass-core.js');
  if (fs.existsSync(rassCorePath)) {
    import(pathToFileURL(rassCorePath).href)
      .then((mod) => {
        const current = mod.getCurrentModeProfile?.() || 'ryougo';
        const result = mod.refreshAllFromModeProfile?.(current);
        if (result) {
          console.log('\nRefreshed from ModeProfile:', current);
          if (result.changes?.length) {
            for (const c of result.changes) console.log(`  - ${c}`);
          } else {
            console.log('  - No changes needed');
          }
        }
      })
      .catch((err) => {
        console.error('\nWarning: could not refresh after push:', err.message);
      });
  }
}

function syncPull() {
  console.log(`Pulling REASP config from ${GLOBAL_OPENCODE_DIR}`);
  console.log(`                     to ${REPO_OPENCODE_DIR}\n`);

  if (!fs.existsSync(GLOBAL_OPENCODE_DIR)) {
    console.error('Global OpenCode config directory does not exist.');
    process.exit(1);
  }

  if (!fs.existsSync(REPO_OPENCODE_DIR)) {
    fs.mkdirSync(REPO_OPENCODE_DIR, { recursive: true });
  }

  for (const dir of DIRS_TO_SYNC) {
    const src = path.join(GLOBAL_OPENCODE_DIR, dir);
    const dest = path.join(REPO_OPENCODE_DIR, dir);
    if (fs.existsSync(src)) {
      copyDirRecursiveSync(src, dest);
      console.log(`  [dir]  ${dir}`);
    }
  }

  for (const file of FILES_TO_SYNC) {
    const src = path.join(GLOBAL_OPENCODE_DIR, file);
    const dest = path.join(REPO_OPENCODE_DIR, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`  [file] ${file}`);
    }
  }
}

const command = process.argv[2]?.toLowerCase();

if (command === 'push') {
  syncPush();
} else if (command === 'pull') {
  syncPull();
} else {
  console.log('REASP Config Sync');
  console.log('Usage: node scripts/sync-reasp.js [push|pull]');
  console.log('');
  console.log('  push  — Copy REASP/.opencode/ to ~/.config/opencode/');
  console.log('  pull  — Copy ~/.config/opencode/ RASS files to REASP/.opencode/');
  process.exit(1);
}
