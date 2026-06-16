/**
 * REASP Installer — Agent detection module.
 *
 * Discovers installed AI agents by trying their CLI commands first,
 * then falling back to known filesystem paths. Results are cached
 * for the lifetime of the process.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { AGENT_TARGETS, getHomeDir } from './constants.js';
import { findOpenCodeCommand } from './targets/opencode.js';

let detectionCache = null;

/**
 * Run a CLI command and return trimmed stdout.
 * Returns `null` if the command fails or is not found.
 */
function safeExecVersion(command) {
  try {
    const output = execSync(command, { stdio: 'pipe', encoding: 'utf8', timeout: 5000 });
    return output.trim() || 'unknown';
  } catch {
    return null;
  }
}

/**
 * Check whether any of the given filesystem paths exist.
 * Glob patterns (`*`) are expanded one level deep.
 */
function findExistingPath(paths) {
  for (const p of paths) {
    if (p.includes('*')) {
      const dir = path.dirname(p);
      const base = path.basename(p);
      if (!fs.existsSync(dir)) continue;
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        if (base === '*' || entry === base) {
          const candidate = path.join(dir, entry);
          if (fs.existsSync(candidate)) return candidate;
        }
      }
    } else if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}

const DETECTORS = {
  opencode: (home) => {
    const cmd = findOpenCodeCommand();
    let version = null;
    if (cmd) {
      version = safeExecVersion(`${cmd} --version`) || 'unknown';
    }
    const globalDir = path.join(home, '.config', 'opencode');
    const detectedBy = cmd ? 'cli' : fs.existsSync(globalDir) ? 'filesystem' : null;
    return {
      installed: !!cmd || fs.existsSync(globalDir),
      version,
      path: cmd || globalDir,
      detectedBy,
    };
  },

  'claude-code': (home) => {
    const cmdVersion = safeExecVersion('claude --version');
    const fsPath = findExistingPath([
      path.join(home, '.claude'),
      path.join(home, '.claude', 'settings.json'),
      path.join(home, '.claude', 'CLAUDE.md'),
      '/usr/local/bin/claude',
      '/usr/bin/claude',
      path.join(home, '.local', 'bin', 'claude'),
    ]);
    return {
      installed: !!cmdVersion || !!fsPath,
      version: cmdVersion,
      path: cmdVersion ? 'claude' : fsPath,
      detectedBy: cmdVersion ? 'cli' : fsPath ? 'filesystem' : null,
    };
  },

  antigravity: (home) => {
    const cmdVersion = safeExecVersion('antigravity --version');
    const fsPath = findExistingPath([
      path.join(home, '.antigravity'),
      path.join(home, '.antigravity', 'config.json'),
      path.join(home, '.local', 'bin', 'antigravity'),
      '/usr/local/bin/antigravity',
      '/usr/bin/antigravity',
    ]);
    return {
      installed: !!cmdVersion || !!fsPath,
      version: cmdVersion,
      path: cmdVersion ? 'antigravity' : fsPath,
      detectedBy: cmdVersion ? 'cli' : fsPath ? 'filesystem' : null,
    };
  },

  gemini: (home) => {
    const cmdVersion = safeExecVersion('gemini --version');
    const fsPath = findExistingPath([
      path.join(home, '.gemini'),
      path.join(home, '.gemini', 'config.json'),
      path.join(home, '.gemini', 'instructions.md'),
      path.join(home, '.local', 'bin', 'gemini'),
      '/usr/local/bin/gemini',
      '/usr/bin/gemini',
    ]);
    return {
      installed: !!cmdVersion || !!fsPath,
      version: cmdVersion,
      path: cmdVersion ? 'gemini' : fsPath,
      detectedBy: cmdVersion ? 'cli' : fsPath ? 'filesystem' : null,
    };
  },

  codex: (home) => {
    const cmdVersion = safeExecVersion('codex --version');
    const fsPath = findExistingPath([
      path.join(home, '.codex'),
      path.join(home, '.codex', 'config.json'),
      path.join(home, '.codex', 'instructions.md'),
      path.join(home, '.local', 'bin', 'codex'),
      '/usr/local/bin/codex',
      '/usr/bin/codex',
    ]);
    return {
      installed: !!cmdVersion || !!fsPath,
      version: cmdVersion,
      path: cmdVersion ? 'codex' : fsPath,
      detectedBy: cmdVersion ? 'cli' : fsPath ? 'filesystem' : null,
    };
  },
};

/**
 * Detect all supported agents.
 *
 * @returns {Array<{id:string, displayName:string, installed:boolean, version:string|null, path:string|null, detectedBy:string|null}>}
 */
export function detectAllAgents() {
  if (detectionCache) return detectionCache;

  const home = getHomeDir();
  const results = AGENT_TARGETS.map((target) => {
    const detector = DETECTORS[target.id];
    const detected = detector ? detector(home) : { installed: false, version: null, path: null, detectedBy: null };
    return {
      id: target.id,
      displayName: target.displayName,
      installed: detected.installed,
      version: detected.version,
      path: detected.path,
      detectedBy: detected.detectedBy,
    };
  });

  detectionCache = results;
  return results;
}

/**
 * Clear the in-process detection cache (useful for tests).
 */
export function clearDetectionCache() {
  detectionCache = null;
}

/**
 * Detect a single agent by id.
 */
export function detectAgent(agentId) {
  return detectAllAgents().find((a) => a.id === agentId);
}
