/**
 * RASS Sync Validator
 *
 * Usage:
 *   node scripts/rass-sync-validator.js [global]
 *
 * Checks consistency between:
 *   - sdd-profiles/*.json (source of truth)
 *   - runtime/runtime.generated.json (resolved runtime)
 *   - opencode.json agent models (what OpenCode actually uses)
 *
 * Pass "global" to validate ~/.config/opencode/ instead of REASP/.opencode/.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HOME = process.env.USERPROFILE || process.env.HOME || os.homedir();
const MODE = process.argv[2]?.toLowerCase() === 'global' ? 'global' : 'repo';
const BASE_DIR = MODE === 'global'
  ? path.join(HOME, '.config', 'opencode')
  : path.resolve(__dirname, '..', '.opencode');

const GLOBAL_DIR = path.join(HOME, '.config', 'opencode');
const REPO_DIR = path.resolve(__dirname, '..', '.opencode');

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function resolveAgentModels(mp) {
  if (!mp) return {};
  const defaultConfig = mp.default || {};
  const models = {};

  const primaryModel =
    mp.orchestrator?.primary ||
    mp.init?.primary ||
    mp.explore?.primary ||
    defaultConfig.primary ||
    'unknown';

  models['ryou-orchestrator'] = primaryModel;
  models['ryou-efi-planner'] = primaryModel;

  models.planner = mp.propose?.primary || defaultConfig.primary || 'unknown';
  models.builder = mp.apply?.primary || defaultConfig.primary || 'unknown';
  models.architect = mp.design?.primary || defaultConfig.primary || 'unknown';
  models.reviewer = mp.verify?.primary || defaultConfig.primary || 'unknown';
  models.debugger = mp.verify?.primary || defaultConfig.primary || 'unknown';
  models.documentation = mp.archive?.primary || defaultConfig.primary || 'unknown';

  return models;
}

function resolveRuntime(mp) {
  if (!mp) return null;
  const phases = mp.phases || [];
  const defaultConfig = mp.default || {};
  const strategy = mp.model_strategy || 'per-phase';
  const resolvedPhases = {};
  for (const phase of phases) {
    const phaseConfig = strategy === 'single' ? defaultConfig : (mp[phase] || defaultConfig);
    if (phaseConfig) {
      resolvedPhases[phase] = {
        model: phaseConfig.primary,
        effort: phaseConfig.effort || defaultConfig.effort || 'medium',
        fallbacks: phaseConfig.fallbacks || [],
      };
    }
  }
  return {
    active_modeprofile: mp.name || 'unknown',
    enabled_phases: phases,
    model_strategy: strategy,
    phases: resolvedPhases,
  };
}

function formatDiff(label, expected, actual) {
  return `  ❌ ${label}\n      expected: ${expected}\n      actual:   ${actual}`;
}

function validateProfile(profileName) {
  const issues = [];
  const mp = readJson(path.join(BASE_DIR, 'sdd-profiles', `${profileName}.json`));
  const runtime = readJson(path.join(BASE_DIR, 'runtime', 'runtime.generated.json'));
  const opencode = readJson(path.join(BASE_DIR, 'opencode.json')) || {};

  if (!mp) {
    issues.push(`Profile '${profileName}' not found in ${BASE_DIR}`);
    return issues;
  }

  // 1. runtime vs profile
  if (runtime) {
    const expectedRuntime = resolveRuntime(mp);
    if (JSON.stringify(runtime.enabled_phases) !== JSON.stringify(expectedRuntime.enabled_phases)) {
      issues.push(formatDiff('runtime.enabled_phases', JSON.stringify(expectedRuntime.enabled_phases), JSON.stringify(runtime.enabled_phases)));
    }
    if (runtime.model_strategy !== expectedRuntime.model_strategy) {
      issues.push(formatDiff('runtime.model_strategy', expectedRuntime.model_strategy, runtime.model_strategy));
    }
    if (JSON.stringify(runtime.phases) !== JSON.stringify(expectedRuntime.phases)) {
      issues.push(formatDiff('runtime.phases', JSON.stringify(expectedRuntime.phases, null, 2), JSON.stringify(runtime.phases, null, 2)));
    }
  } else {
    issues.push('runtime/runtime.generated.json not found');
  }

  // 2. opencode.json agent models vs profile (only if opencode.json exists)
  if (Object.keys(opencode).length === 0) {
    if (MODE === 'global') {
      issues.push('opencode.json not found');
    }
    // In repo mode this is expected; the live config lives in ~/.config/opencode/opencode.json
  } else if (opencode.agent) {
    const expectedAgents = resolveAgentModels(mp);
    for (const [agentName, expectedModel] of Object.entries(expectedAgents)) {
      const actualModel = opencode.agent[agentName]?.model;
      if (actualModel !== expectedModel) {
        issues.push(formatDiff(`opencode.json agent.${agentName}.model`, expectedModel, actualModel || 'missing'));
      }
    }

    // root model should match default.primary or orchestrator primary
    const expectedRoot = mp.default?.primary || mp.orchestrator?.primary || 'unknown';
    if (opencode.model !== expectedRoot) {
      issues.push(formatDiff('opencode.json model', expectedRoot, opencode.model || 'missing'));
    }
  } else {
    issues.push('opencode.json has no agent section');
  }

  return issues;
}

function validateRepoGlobalSync() {
  const issues = [];
  const profileDir = path.join(BASE_DIR, 'sdd-profiles');
  if (!fs.existsSync(profileDir)) {
    issues.push(`Profile directory not found: ${profileDir}`);
    return issues;
  }

  const otherBase = MODE === 'global' ? REPO_DIR : GLOBAL_DIR;
  const otherLabel = MODE === 'global' ? 'repo' : 'global';

  for (const file of fs.readdirSync(profileDir).filter(f => f.endsWith('.json'))) {
    const local = readJson(path.join(BASE_DIR, 'sdd-profiles', file));
    const remote = readJson(path.join(otherBase, 'sdd-profiles', file));
    if (!remote) {
      issues.push(`  ❌ ${file} exists in ${MODE} but not in ${otherLabel}`);
    } else if (JSON.stringify(local) !== JSON.stringify(remote)) {
      issues.push(`  ❌ ${file} differs between ${MODE} and ${otherLabel}`);
    }
  }

  return issues;
}

// ─── Main ───────────────────────────────────────────────────────────────────

console.log(`Validating RASS sync in: ${BASE_DIR}\n`);

const currentProfile = readJson(path.join(BASE_DIR, 'runtime', 'current-modeprofile.json'))?.modeprofile || 'ryougo';
console.log(`Active ModeProfile: ${currentProfile}\n`);

const profileIssues = validateProfile(currentProfile);
if (profileIssues.length === 0) {
  console.log('✅ Profile / runtime / opencode.json are consistent.');
} else {
  console.log('❌ Inconsistencies found:');
  for (const issue of profileIssues) {
    console.log(issue);
  }
}

console.log('\nRepo ↔ Global sync check:');
const syncIssues = validateRepoGlobalSync();
if (syncIssues.length === 0) {
  console.log('✅ Repo and global sdd-profiles are in sync.');
} else {
  console.log('❌ Differences found:');
  for (const issue of syncIssues) {
    console.log(issue);
  }
}

const totalIssues = profileIssues.length + syncIssues.length;
if (totalIssues > 0) {
  console.log(`\n${totalIssues} issue(s) found. Run \`node scripts/sync-reasp.js push\` or use rass_setup(action="validate") to heal.`);
  process.exit(1);
} else {
  console.log('\nAll checks passed.');
}
