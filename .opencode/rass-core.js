/**
 * RASS Core — Ryou Adaptive SDD System
 * Core logic for unified ModeProfile management and runtime generation.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Helpers ────────────────────────────────────────────────────────────────

function readJson(filePath) {
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function writeJson(filePath, data) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// ─── Paths ──────────────────────────────────────────────────────────────────

function getModeProfilesDir() { return join(__dirname, 'sdd-profiles'); }
function getRuntimeDir() { return join(__dirname, 'runtime'); }

function getHomeDir() {
  return process.env.USERPROFILE || process.env.HOME || os.homedir();
}

function getGlobalConfigPath() {
  return join(getHomeDir(), '.config', 'opencode', 'opencode.json');
}

/**
 * REASP config path. The global location (`~/.config/opencode/reasp.config.json`)
 * is the runtime source of truth because OpenCode reads it on startup. The repo
 * copy (`.opencode/reasp.config.json`) is kept in sync via `scripts/sync-reasp.js`.
 */
function getReaspConfigPath() {
  return join(getHomeDir(), '.config', 'opencode', 'reasp.config.json');
}

function getModeProfilePath(name) { return join(getModeProfilesDir(), `${name}.json`); }
function getCurrentModeProfilePath() { return join(getRuntimeDir(), 'current-modeprofile.json'); }
function getRuntimePath() { return join(getRuntimeDir(), 'runtime.generated.json'); }
function getConfigPath() { return join(__dirname, 'sdd.config.json'); }

function readOpenCodeConfig(configPath = getGlobalConfigPath()) {
  return readJson(configPath) || {};
}

function writeOpenCodeConfig(configPath = getGlobalConfigPath(), data = {}) {
  writeJson(configPath, data);
}

// ─── ModeProfiles ───────────────────────────────────────────────────────────

/**
 * List all available SDD ModeProfiles.
 * @returns {Array<{id: string, name: string, description: string, phases: string[], model_strategy: string, default: object}>}
 */
export function listModeProfiles() {
  const dir = getModeProfilesDir();
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const id = f.replace('.json', '');
      const data = readJson(join(dir, f));
      if (!data) return null;
      return {
        id,
        name: data.name || id,
        description: data.description || '',
        phases: data.phases || [],
        model_strategy: data.model_strategy || 'per-phase',
        default: data.default || {},
      };
    })
    .filter(Boolean);
}

/**
 * Get a specific ModeProfile by name.
 * @param {string} name
 * @returns {object|null}
 */
export function getModeProfile(name) {
  return readJson(getModeProfilePath(name));
}

/**
 * Resolve the model that should be assigned to each Ryou agent from a ModeProfile.
 * Primary agents follow a fallback chain: orchestrator → init → explore → default.
 * @param {string|object} modeProfile - ModeProfile name or ModeProfile object
 * @returns {object} Map of agent names to model IDs
 */
export function resolveAgentModels(modeProfile) {
  const mp = typeof modeProfile === 'string' ? getModeProfile(modeProfile) : modeProfile;
  if (!mp) return { ...DEFAULT_AGENT_MODELS };

  const defaultConfig = mp.default || {};
  const models = { ...DEFAULT_AGENT_MODELS };

  // Primary agents: orchestrator phase is the canonical source, but fall back
  // through init/explore/default so short pipelines (e.g. fast) still work.
  const primaryModel =
    mp.orchestrator?.primary ||
    mp.init?.primary ||
    mp.explore?.primary ||
    defaultConfig.primary ||
    DEFAULT_AGENT_MODELS['ryou-orchestrator'];

  models['ryou-orchestrator'] = primaryModel;
  models['ryou-efi-planner'] = primaryModel;

  // Subagent mapping
  if (mp.propose?.primary || defaultConfig.primary) {
    models.planner = mp.propose?.primary || defaultConfig.primary;
  }
  if (mp.apply?.primary || defaultConfig.primary) {
    models.builder = mp.apply?.primary || defaultConfig.primary;
  }
  if (mp.design?.primary || defaultConfig.primary) {
    models.architect = mp.design?.primary || defaultConfig.primary;
  }
  if (mp.verify?.primary || defaultConfig.primary) {
    models.reviewer = mp.verify?.primary || defaultConfig.primary;
    models.debugger = mp.verify?.primary || defaultConfig.primary;
  }
  if (mp.archive?.primary || defaultConfig.primary) {
    models.documentation = mp.archive?.primary || defaultConfig.primary;
  }

  return models;
}

/**
 * Resolve the model for a single Ryou agent from a specific ModeProfile.
 * Uses the phase mapping appropriate to each agent role.
 * @param {string} agentName
 * @param {string|object} modeProfile - ModeProfile name or ModeProfile object
 * @returns {string|null}
 */
export function resolveAgentModel(agentName, modeProfile) {
  const mp = typeof modeProfile === 'string' ? getModeProfile(modeProfile) : modeProfile;
  if (!mp) return null;

  const defaultConfig = mp.default || {};
  switch (agentName) {
    case 'ryou-orchestrator':
    case 'ryou-efi-planner':
      return mp.orchestrator?.primary || mp.init?.primary || mp.explore?.primary || defaultConfig.primary || null;
    case 'planner':
      return mp.propose?.primary || defaultConfig.primary || null;
    case 'builder':
      return mp.apply?.primary || defaultConfig.primary || null;
    case 'architect':
      return mp.design?.primary || defaultConfig.primary || null;
    case 'reviewer':
    case 'debugger':
      return mp.verify?.primary || defaultConfig.primary || null;
    case 'documentation':
      return mp.archive?.primary || defaultConfig.primary || null;
    default:
      return defaultConfig.primary || null;
  }
}

/**
 * Generate the resolved runtime configuration from a ModeProfile.
 * @param {string|object} modeProfile
 * @returns {object|null}
 */
export function resolveRuntime(modeProfile) {
  const mp = typeof modeProfile === 'string' ? getModeProfile(modeProfile) : modeProfile;
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

/**
 * Synchronize Ryou agent models with the active ModeProfile configuration.
 * Maps ModeProfile phases to agent roles and updates opencode.json.
 * @param {string} modeProfileName
 * @param {string} [configPath]
 * @returns {boolean} true if sync succeeded
 */
export function syncAgentsWithModeProfile(modeProfileName, configPath = getGlobalConfigPath()) {
  const agentModels = resolveAgentModels(modeProfileName);

  if (!existsSync(configPath)) return false;

  let config;
  try {
    config = JSON.parse(readFileSync(configPath, 'utf8'));
  } catch {
    return false;
  }

  if (!config.agent) return false;

  for (const [agentName, modelId] of Object.entries(agentModels)) {
    if (config.agent[agentName]) {
      config.agent[agentName].model = modelId;
    }
  }

  try {
    writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    return true;
  } catch {
    return false;
  }
}

/**
 * Refresh runtime and agent models from the active ModeProfile.
 * This is the single entry point used to eliminate drift.
 * @param {string} [modeProfileName]
 * @returns {{runtime: object|null, agents: object|null, changes: string[]}}
 */
export function refreshAllFromModeProfile(modeProfileName = getCurrentModeProfile() || 'ryougo') {
  const changes = [];

  const mp = getModeProfile(modeProfileName);
  if (!mp) return { runtime: null, agents: null, changes: [`ModeProfile '${modeProfileName}' not found`] };

  // 1. Regenerate runtime
  const runtime = resolveRuntime(mp);
  if (runtime) {
    runtime.generated_at = new Date().toISOString();
    writeJson(getRuntimePath(), runtime);
    changes.push(`Regenerated runtime for '${modeProfileName}'`);
  }

  // 2. Sync agent models in opencode.json
  const agents = resolveAgentModels(mp);
  const configPath = getGlobalConfigPath();
  if (existsSync(configPath)) {
    let config;
    try {
      config = JSON.parse(readFileSync(configPath, 'utf8'));
    } catch {
      config = null;
    }

    if (config) {
      if (!config.agent) config.agent = {};

      for (const [agentName, modelId] of Object.entries(agents)) {
        if (!config.agent[agentName]) {
          // Agent missing — create from template if available, else minimal
          const template = RYOU_AGENTS[agentName];
          config.agent[agentName] = template ? { ...template, model: modelId } : { model: modelId };
          changes.push(`Created agent '${agentName}' -> ${modelId}`);
        } else if (config.agent[agentName].model !== modelId) {
          const old = config.agent[agentName].model;
          config.agent[agentName].model = modelId;
          changes.push(`Updated agent '${agentName}' model: ${old} -> ${modelId}`);
        }
      }

      // Sync root model / small_model from ModeProfile
      const defaultPrimary = mp.default?.primary;
      if (defaultPrimary) {
        if (config.model !== defaultPrimary) {
          changes.push(`Updated root model: ${config.model || 'unset'} -> ${defaultPrimary}`);
          config.model = defaultPrimary;
        }
        // small_model follows archive phase (documentation) if available, otherwise first fallback
        const smallModelCandidate = mp.archive?.primary ||
          (Array.isArray(mp.default.fallbacks) ? mp.default.fallbacks[0] : null) ||
          'opencode-go/deepseek-v4-flash';
        if (config.small_model !== smallModelCandidate) {
          changes.push(`Updated small_model: ${config.small_model || 'unset'} -> ${smallModelCandidate}`);
          config.small_model = smallModelCandidate;
        }
      }

      try {
        writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
      } catch (err) {
        changes.push(`ERROR writing opencode.json: ${err.message}`);
      }
    }
  }

  // 3. Keep REASP config aligned with the single active ModeProfile.
  const reasp = getReaspConfig();
  const hadAgentProfiles = !!reasp.agent_modeprofiles;
  reasp.default_modeprofile = modeProfileName;
  delete reasp.agent_modeprofiles;
  writeReaspConfig(reasp);
  if (hadAgentProfiles) changes.push('Removed agent-specific ModeProfiles from REASP config');

  return { runtime, agents, changes };
}

/**
 * Check whether runtime.generated.json is in sync with its ModeProfile.
 * @param {string} [modeProfileName]
 * @returns {boolean}
 */
export function isRuntimeInSync(modeProfileName = getCurrentModeProfile() || 'ryougo') {
  const mp = getModeProfile(modeProfileName);
  if (!mp) return false;

  const runtime = readJson(getRuntimePath());
  if (!runtime) return false;

  const expected = resolveRuntime(mp);
  if (!expected) return false;

  return JSON.stringify(runtime.enabled_phases) === JSON.stringify(expected.enabled_phases) &&
    runtime.model_strategy === expected.model_strategy &&
    JSON.stringify(runtime.phases) === JSON.stringify(expected.phases);
}

/**
 * Switch to a different SDD ModeProfile.
 * Also synchronizes agent models with the new ModeProfile configuration.
 * @param {string} name
 * @returns {object}
 */
export function switchModeProfile(name) {
  const mp = getModeProfile(name);
  if (!mp) throw new Error(`ModeProfile '${name}' not found. Available: ${listModeProfiles().map(m => m.id).join(', ')}`);
  writeJson(getCurrentModeProfilePath(), { modeprofile: name });
  const reasp = getReaspConfig();
  reasp.default_modeprofile = name;
  delete reasp.agent_modeprofiles;
  writeReaspConfig(reasp);
  refreshAllFromModeProfile(name);
  return mp;
}

/**
 * Create a new SDD ModeProfile.
 * @param {string} name - ModeProfile identifier
 * @param {object} config - ModeProfile configuration with phases, model_strategy, default, and per-phase overrides
 */
export function createModeProfile(name, config) {
  const modeProfileData = {
    name: config.name || name.charAt(0).toUpperCase() + name.slice(1).replace(/[-_]/g, ' '),
    description: config.description || '',
    phases: config.phases || [],
    model_strategy: config.model_strategy || 'per-phase',
    default: config.default || {},
    ...config,
  };
  writeJson(getModeProfilePath(name), modeProfileData);
  return modeProfileData;
}

/**
 * Update an existing SDD ModeProfile.
 * @param {string} name - ModeProfile identifier
 * @param {object} updates - Partial updates to merge
 * @returns {object}
 */
export function updateModeProfile(name, updates) {
  const existing = readJson(getModeProfilePath(name));
  if (!existing) throw new Error(`ModeProfile '${name}' not found`);

  const merged = {
    ...existing,
    ...(updates.name && { name: updates.name }),
    ...(updates.description !== undefined && { description: updates.description }),
    ...(updates.phases && { phases: updates.phases }),
    ...(updates.model_strategy && { model_strategy: updates.model_strategy }),
    ...(updates.default && { default: updates.default }),
  };

  // Merge per-phase overrides
  for (const phase of AVAILABLE_PHASES) {
    if (updates[phase]) {
      merged[phase] = updates[phase];
    } else if (updates.removePhases && updates.removePhases.includes(phase) && existing[phase]) {
      delete merged[phase];
    }
  }

  writeJson(getModeProfilePath(name), merged);

  // If this is the active profile, refresh runtime and agents automatically
  const current = getCurrentModeProfile();
  if (current === name) {
    refreshAllFromModeProfile(name);
  }

  return merged;
}

/**
 * Delete an SDD ModeProfile.
 * @param {string} name
 */
export function deleteModeProfile(name) {
  const filePath = getModeProfilePath(name);
  if (existsSync(filePath)) {
    unlinkSync(filePath);
  }
}

// ─── Runtime ────────────────────────────────────────────────────────────────

/**
 * Get the current active ModeProfile name.
 * @returns {string|null}
 */
export function getCurrentModeProfile() {
  const data = readJson(getCurrentModeProfilePath());
  return data?.modeprofile || null;
}

/**
 * Generate the runtime configuration from the current ModeProfile.
 * Writes runtime.generated.json and returns the result.
 * @returns {object|null}
 */
export function generateRuntime() {
  const currentName = getCurrentModeProfile() || 'ryougo';
  const mp = getModeProfile(currentName);
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

  const runtime = {
    active_modeprofile: currentName,
    enabled_phases: phases,
    model_strategy: strategy,
    phases: resolvedPhases,
    generated_at: new Date().toISOString(),
  };

  writeJson(getRuntimePath(), runtime);
  return runtime;
}

/**
 * Get the full RASS status: current ModeProfile and resolved runtime.
 * Automatically refreshes runtime/agents if drift is detected.
 * @returns {object}
 */
export function getStatus() {
  const currentName = getCurrentModeProfile();
  const mp = currentName ? getModeProfile(currentName) : null;

  // Auto-heal drift between ModeProfile and runtime/opencode.json
  if (currentName && mp && !isRuntimeInSync(currentName)) {
    refreshAllFromModeProfile(currentName);
  }

  const runtime = readJson(getRuntimePath()) || generateRuntime();

  return {
    current_modeprofile: currentName,
    modeprofile: mp ? {
      id: currentName,
      name: mp.name || currentName,
      description: mp.description || '',
      phases: mp.phases || [],
      model_strategy: mp.model_strategy || 'per-phase',
      default_model: mp.default?.primary || 'unknown',
    } : null,
    runtime,
  };
}

export const REASP_PRIMARY_AGENTS = ['ryou-orchestrator', 'ryou-efi-planner'];

export const VALID_PLANNING_METHODS = ['phases', 'epic'];
export const DEFAULT_PLANNING_METHOD = 'phases';

export function getReaspConfig() {
  return readJson(getReaspConfigPath()) || {
    system_name: 'REASP',
    full_name: 'Ryou Enterprise Adaptive SDD Protocol',
    version: '1.0.0',
    default_modeprofile: 'ryougo',
    default_workflow: 'ryou-orchestrator',
    features: {
      rass: { enabled: true, label: 'Ryou Orchestrator' },
      refi: { enabled: true, label: 'Ryou EFI Planner' },
    },
    planning_method: DEFAULT_PLANNING_METHOD,
  };
}

function writeReaspConfig(config) {
  writeJson(getReaspConfigPath(), config);

  const repoPath = join(__dirname, 'reasp.config.json');
  if (existsSync(repoPath)) {
    try {
      writeJson(repoPath, config);
    } catch {
      // Global config remains the runtime source of truth.
    }
  }
}

export function getPlanningMethod() {
  const reasp = getReaspConfig();
  const method = reasp?.planning_method;
  if (VALID_PLANNING_METHODS.includes(method)) return method;
  return DEFAULT_PLANNING_METHOD;
}

export function setPlanningMethod(method) {
  if (!VALID_PLANNING_METHODS.includes(method)) {
    throw new Error(`Invalid planning_method "${method}". Must be one of: ${VALID_PLANNING_METHODS.join(', ')}`);
  }
  const config = getReaspConfig();
  config.planning_method = method;
  writeJson(getReaspConfigPath(), config);
  return { planning_method: method };
}

export function setPrimaryWorkflow(agentName, configPath = getGlobalConfigPath()) {
  if (!REASP_PRIMARY_AGENTS.includes(agentName)) {
    throw new Error(`Unknown REASP workflow agent '${agentName}'. Available: ${REASP_PRIMARY_AGENTS.join(', ')}`);
  }

  const config = readOpenCodeConfig(configPath);
  if (!config.agent) config.agent = {};

  // ── Clean up legacy agent name to prevent duplicates ──
  if (config.agent['ryou-efi-agent']) {
    delete config.agent['ryou-efi-agent'];
  }
  if (config.default_agent === 'ryou-efi-agent') {
    config.default_agent = 'ryou-efi-planner';
  }

  if (!config.agent[agentName] && RYOU_AGENTS[agentName]) {
    config.agent[agentName] = { ...RYOU_AGENTS[agentName] };
  }

  config.default_agent = agentName;
  writeOpenCodeConfig(configPath, config);

  // Ensure agent models match the active ModeProfile after workflow switch
  refreshAllFromModeProfile();

  const reasp = getReaspConfig();
  reasp.default_workflow = agentName;
  if (agentName === 'ryou-orchestrator') {
    reasp.features.rass.enabled = true;
  }
  if (agentName === 'ryou-efi-planner') {
    reasp.features.refi.enabled = true;
  }
  writeJson(getReaspConfigPath(), reasp);

  return getReaspStatus(configPath);
}

export function setFeatureEnabled(featureName, enabled, configPath = getGlobalConfigPath()) {
  const reasp = getReaspConfig();
  if (!reasp.features?.[featureName]) {
    throw new Error(`Unknown REASP feature '${featureName}'. Available: ${Object.keys(reasp.features || {}).join(', ')}`);
  }

  reasp.features[featureName].enabled = enabled;
  writeJson(getReaspConfigPath(), reasp);

  const currentConfig = readOpenCodeConfig(configPath);
  let currentAgent = currentConfig.default_agent || reasp.default_workflow;

  // ── Normalize legacy agent name ──
  if (currentAgent === 'ryou-efi-agent') {
    currentAgent = 'ryou-efi-planner';
  }

  if (!enabled && featureName === 'refi' && currentAgent === 'ryou-efi-planner' && reasp.features?.rass?.enabled !== false) {
    return setPrimaryWorkflow('ryou-orchestrator', configPath);
  }

  if (!enabled && featureName === 'rass' && currentAgent === 'ryou-orchestrator' && reasp.features?.refi?.enabled !== false) {
    return setPrimaryWorkflow('ryou-efi-planner', configPath);
  }

  return getReaspStatus(configPath);
}

export function getReaspStatus(configPath = getGlobalConfigPath()) {
  const reasp = getReaspConfig();
  const config = readOpenCodeConfig(configPath);
  const status = getStatus();

  return {
    system_name: reasp.system_name,
    full_name: reasp.full_name,
    version: reasp.version,
    current_modeprofile: status.current_modeprofile,
    modeprofile: status.modeprofile,
    default_workflow: config.default_agent || reasp.default_workflow || 'ryou-orchestrator',
    planning_method: getPlanningMethod(),
    features: reasp.features,
    primary_agents: REASP_PRIMARY_AGENTS,
  };
}

/**
 * Get the RASS configuration.
 * @returns {object}
 */
export function getConfig() {
  return readJson(getConfigPath()) || {
    system_name: 'RASS',
    full_name: 'Ryou Adaptive SDD System',
    version: '3.0.0',
    default_modeprofile: 'ryougo',
  };
}

/**
 * Available phases for ModeProfile creation.
 */
export const AVAILABLE_PHASES = [
  'orchestrator',
  'init',
  'explore',
  'propose',
  'design',
  'apply',
  'verify',
  'archive',
];

/**
 * Available effort levels.
 */
export const EFFORT_LEVELS = ['low', 'medium', 'high', 'extreme'];

/**
 * Preferred OpenCode Go models shown as suggestions in creation UI.
 * RASS accepts ANY valid model string in primary/fallbacks; this list is only for UX guidance.
 */
export const AVAILABLE_MODELS = [
  { id: 'opencode-go/glm-5.1', label: 'GLM-5.1', description: 'Orchestration, planning, architecture, complex reasoning' },
  { id: 'opencode-go/kimi-k2.7-code', label: 'Kimi K2.7 Code', description: 'Implementation, refactors, C#/.NET code generation' },
  { id: 'opencode-go/kimi-k2.6', label: 'Kimi K2.6', description: 'Implementation, refactors, C#/.NET code generation' },
  { id: 'opencode-go/deepseek-v4-pro', label: 'DeepSeek V4 Pro', description: 'Debugging, review, performance, risk analysis' },
  { id: 'opencode-go/deepseek-v4-flash', label: 'DeepSeek V4 Flash', description: 'Small tasks, documentation, summaries' },
];

/**
 * Default provider catalog used when OpenCode runtime is not available
 * (tests, scripts without api context, etc).
 * Same structure as api.state.provider entries.
 */
export const DEFAULT_PROVIDERS = [
  {
    id: 'opencode-go',
    name: 'OpenCode Go',
    models: [
      { id: 'glm-5.1', fullId: 'opencode-go/glm-5.1', label: 'GLM-5.1', description: 'reasoning' },
      { id: 'kimi-k2.7-code', fullId: 'opencode-go/kimi-k2.7-code', label: 'Kimi K2.7 Code', description: 'coding' },
      { id: 'kimi-k2.6', fullId: 'opencode-go/kimi-k2.6', label: 'Kimi K2.6', description: 'coding' },
      { id: 'deepseek-v4-pro', fullId: 'opencode-go/deepseek-v4-pro', label: 'DeepSeek V4 Pro', description: 'reasoning' },
      { id: 'deepseek-v4-flash', fullId: 'opencode-go/deepseek-v4-flash', label: 'DeepSeek V4 Flash', description: 'coding' },
      { id: 'minimax-m3', fullId: 'opencode-go/minimax-m3', label: 'minimax-m3', description: 'general' },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: [
      { id: 'claude-sonnet-4-5', fullId: 'anthropic/claude-sonnet-4-5', label: 'Claude Sonnet 4.5', description: 'reasoning' },
      { id: 'claude-opus-4-1', fullId: 'anthropic/claude-opus-4-1', label: 'Claude Opus 4.1', description: 'reasoning' },
      { id: 'claude-haiku-4-5', fullId: 'anthropic/claude-haiku-4-5', label: 'Claude Haiku 4.5', description: 'fast' },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    models: [
      { id: 'gpt-5', fullId: 'openai/gpt-5', label: 'GPT-5', description: 'reasoning' },
      { id: 'gpt-5-mini', fullId: 'openai/gpt-5-mini', label: 'GPT-5 mini', description: 'fast' },
      { id: 'o3', fullId: 'openai/o3', label: 'o3', description: 'reasoning' },
    ],
  },
  {
    id: 'google',
    name: 'Google',
    models: [
      { id: 'gemini-2.5-pro', fullId: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro', description: 'reasoning' },
      { id: 'gemini-2.5-flash', fullId: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash', description: 'fast' },
    ],
  },
];

/**
 * Discover providers from OpenCode runtime state.
 * Returns a normalized array of { id, name, models: [{id, fullId, label, description}] }.
 * Falls back to DEFAULT_PROVIDERS when the runtime is not available.
 *
 * @param {object} [api] - OpenCode plugin api (optional)
 * @returns {Array<{id: string, name: string, models: Array<{id: string, fullId: string, label: string, description: string}>}>}
 */
export function discoverProviders(api) {
  if (api?.state?.provider && Array.isArray(api.state.provider)) {
    const providers = api.state.provider
      .filter((prov) => prov && prov.id)
      .map((prov) => ({
        id: prov.id,
        name: prov.name || prov.id,
        models: Object.entries(prov.models || {}).map(([modelId, modelInfo]) => ({
          id: modelId,
          fullId: `${prov.id}/${modelId}`,
          label: modelInfo?.name || modelId,
          description: modelInfo?.family || '',
        })),
      }));

    if (providers.length > 0) {
      // Sort: opencode-go first, then alphabetical
      providers.sort((a, b) => {
        const aGo = a.id === 'opencode-go' ? 0 : 1;
        const bGo = b.id === 'opencode-go' ? 0 : 1;
        if (aGo !== bGo) return aGo - bGo;
        return a.id.localeCompare(b.id);
      });
      return providers;
    }
  }
  return DEFAULT_PROVIDERS;
}

/**
 * Validate that a model belongs to a provider.
 * Accepts both catalog models and custom model strings (warning, not error).
 *
 * @param {string} modelId - Full model string in "provider/model" format
 * @param {string} providerId - Expected provider ID
 * @param {Array} [providers] - Provider catalog (defaults to DEFAULT_PROVIDERS)
 * @returns {{valid: boolean, warning?: string, error?: string}}
 */
export function validateModelInProvider(modelId, providerId, providers = DEFAULT_PROVIDERS) {
  if (!modelId || typeof modelId !== 'string') {
    return { valid: false, error: 'Model ID is required' };
  }
  if (!providerId || typeof providerId !== 'string') {
    return { valid: false, error: 'Provider ID is required' };
  }

  const prefix = `${providerId}/`;
  if (!modelId.startsWith(prefix)) {
    return {
      valid: false,
      error: `Model '${modelId}' does not start with provider prefix '${prefix}'`,
    };
  }

  const prov = providers.find((p) => p.id === providerId);
  if (!prov) {
    return { valid: true, warning: `Provider '${providerId}' is not in the known catalog (custom)` };
  }

  const modelPart = modelId.slice(prefix.length);
  if (!modelPart) {
    return { valid: false, error: `Model part is empty after provider prefix '${prefix}'` };
  }

  const exists = prov.models.some((m) => m.id === modelPart);
  if (!exists) {
    return {
      valid: true,
      warning: `Model '${modelPart}' is not in the catalog of provider '${providerId}' (custom)`,
    };
  }
  return { valid: true };
}

/**
 * Derive the provider ID from a "provider/model" string.
 * Returns the provider ID even if not in catalog (for forward compatibility).
 *
 * @param {string} modelId
 * @returns {string|null}
 */
export function deriveProviderFromModel(modelId) {
  if (!modelId || typeof modelId !== 'string') return null;
  const idx = modelId.indexOf('/');
  if (idx <= 0) return null;
  return modelId.slice(0, idx);
}

/**
 * Get a human-readable label for a provider.
 *
 * @param {string} providerId
 * @param {Array} [providers]
 * @returns {string}
 */
export function getProviderLabel(providerId, providers = DEFAULT_PROVIDERS) {
  if (!providerId) return 'unknown';
  const prov = providers.find((p) => p.id === providerId);
  return prov ? (prov.name || prov.id) : providerId;
}

/**
 * Get models for a specific provider, or empty array if provider not found.
 *
 * @param {string} providerId
 * @param {Array} [providers]
 * @returns {Array}
 */
export function getModelsForProvider(providerId, providers = DEFAULT_PROVIDERS) {
  if (!providerId) return [];
  const prov = providers.find((p) => p.id === providerId);
  return prov?.models || [];
}

/**
 * Fallback models used when a ModeProfile does not define a phase/default.
 */
const DEFAULT_AGENT_MODELS = {
  'ryou-orchestrator': 'opencode-go/kimi-k2.7-code',
  'ryou-efi-planner': 'opencode-go/kimi-k2.7-code',
  planner: 'opencode-go/glm-5.1',
  builder: 'opencode-go/kimi-k2.7-code',
  architect: 'opencode-go/glm-5.1',
  reviewer: 'opencode-go/deepseek-v4-pro',
  debugger: 'opencode-go/deepseek-v4-pro',
  documentation: 'opencode-go/deepseek-v4-flash',
};

// ─── Agent Deployment ────────────────────────────────────────────────────────

/**
 * Ryou agent definitions for OpenCode config deployment.
 * Models are initialized from DEFAULT_AGENT_MODELS and then overridden
 * by the active ModeProfile via refreshAllFromModeProfile().
 */
export const RYOU_AGENTS = {
  'ryou-orchestrator': {
    description: 'Primary orchestrator for pragmatic .NET work using Ryou workflow and MeridianUI.',
    mode: 'primary',
    model: DEFAULT_AGENT_MODELS['ryou-orchestrator'],
    temperature: 0.2,
    steps: 40,
    prompt: '{file:./agents/ryou-orchestrator.md}',
    permission: {
      read: 'allow',
      glob: 'allow',
      grep: 'allow',
      list: 'allow',
      edit: { '*': 'allow', 'C:\\Users\\kevin\\.MeridianUI\\*': 'deny', 'C:\\Users\\kevin\\.MeridianUI\\**': 'deny' },
      bash: 'allow',
      task: 'allow',
      webfetch: 'allow',
      websearch: 'allow',
      external_directory: { '*': 'ask', 'C:\\Users\\kevin\\.MeridianUI\\*': 'allow', 'C:\\Users\\kevin\\.MeridianUI\\**': 'allow' },
    },
  },
  'ryou-efi-planner': {
    description: 'Primary planning agent for REFI packet generation and enterprise implementation handoff.',
    mode: 'primary',
    model: DEFAULT_AGENT_MODELS['ryou-efi-planner'],
    temperature: 0.1,
    steps: 32,
    prompt: '{file:./agents/ryou-efi-planner.md}',
    permission: {
      read: 'allow',
      glob: 'allow',
      grep: 'allow',
      list: 'allow',
      edit: { '*': 'allow', 'C:\\Users\\kevin\\.MeridianUI\\*': 'deny', 'C:\\Users\\kevin\\.MeridianUI\\**': 'deny' },
      bash: 'allow',
      task: 'allow',
      todowrite: 'allow',
      webfetch: 'allow',
      websearch: 'allow',
      external_directory: { '*': 'ask', 'C:\\Users\\kevin\\.MeridianUI\\*': 'allow', 'C:\\Users\\kevin\\.MeridianUI\\**': 'allow' },
    },
  },
  planner: {
    description: 'Subagent for planning medium or complex work before implementation.',
    mode: 'subagent',
    model: DEFAULT_AGENT_MODELS.planner,
    temperature: 0.1,
    steps: 14,
    prompt: '{file:./agents/planner.md}',
    permission: {
      read: 'allow',
      glob: 'allow',
      grep: 'allow',
      list: 'allow',
      edit: 'deny',
      bash: 'deny',
      task: 'deny',
      external_directory: { '*': 'ask', 'C:\\Users\\kevin\\.MeridianUI\\*': 'allow', 'C:\\Users\\kevin\\.MeridianUI\\**': 'allow' },
    },
  },
  builder: {
    description: 'Subagent for C#, .NET, EF Core, XAML, Blazor, MAUI, and MeridianUI implementation.',
    mode: 'subagent',
    model: DEFAULT_AGENT_MODELS.builder,
    temperature: 0.2,
    steps: 40,
    prompt: '{file:./agents/builder.md}',
    permission: {
      read: 'allow',
      glob: 'allow',
      grep: 'allow',
      list: 'allow',
      edit: { '*': 'allow', 'C:\\Users\\kevin\\.MeridianUI\\*': 'deny', 'C:\\Users\\kevin\\.MeridianUI\\**': 'deny' },
      bash: 'allow',
      task: 'deny',
      external_directory: { '*': 'ask', 'C:\\Users\\kevin\\.MeridianUI\\*': 'allow', 'C:\\Users\\kevin\\.MeridianUI\\**': 'allow' },
    },
  },
  architect: {
    description: 'Subagent for architecture decisions, boundaries, data flow, and pragmatic design tradeoffs.',
    mode: 'subagent',
    model: DEFAULT_AGENT_MODELS.architect,
    temperature: 0.1,
    steps: 16,
    prompt: '{file:./agents/architect.md}',
    permission: {
      read: 'allow',
      glob: 'allow',
      grep: 'allow',
      list: 'allow',
      edit: 'deny',
      bash: 'deny',
      task: 'deny',
      external_directory: { '*': 'ask', 'C:\\Users\\kevin\\.MeridianUI\\*': 'allow', 'C:\\Users\\kevin\\.MeridianUI\\**': 'allow' },
    },
  },
  reviewer: {
    description: 'Subagent for code review, regressions, maintainability, performance, and security risks.',
    mode: 'subagent',
    model: DEFAULT_AGENT_MODELS.reviewer,
    temperature: 0.1,
    steps: 18,
    prompt: '{file:./agents/reviewer.md}',
    permission: {
      read: 'allow',
      glob: 'allow',
      grep: 'allow',
      list: 'allow',
      edit: 'deny',
      bash: 'allow',
      task: 'deny',
      external_directory: { '*': 'ask', 'C:\\Users\\kevin\\.MeridianUI\\*': 'allow', 'C:\\Users\\kevin\\.MeridianUI\\**': 'allow' },
    },
  },
  debugger: {
    description: 'Subagent for bug investigation, failing tests, runtime errors, EF issues, and async/concurrency problems.',
    mode: 'subagent',
    model: DEFAULT_AGENT_MODELS.debugger,
    temperature: 0.1,
    steps: 26,
    prompt: '{file:./agents/debugger.md}',
    permission: {
      read: 'allow',
      glob: 'allow',
      grep: 'allow',
      list: 'allow',
      edit: 'deny',
      bash: 'allow',
      task: 'deny',
      external_directory: { '*': 'ask', 'C:\\Users\\kevin\\.MeridianUI\\*': 'allow', 'C:\\Users\\kevin\\.MeridianUI\\**': 'allow' },
    },
  },
  documentation: {
    description: 'Subagent for concise Markdown and visual HTML implementation summaries.',
    mode: 'subagent',
    model: DEFAULT_AGENT_MODELS.documentation,
    temperature: 0.2,
    steps: 12,
    prompt: '{file:./agents/documentation.md}',
    permission: {
      read: 'allow',
      glob: 'allow',
      grep: 'allow',
      list: 'allow',
      edit: { '*': 'allow', 'C:\\Users\\kevin\\.MeridianUI\\*': 'deny', 'C:\\Users\\kevin\\.MeridianUI\\**': 'deny' },
      bash: 'deny',
      task: 'deny',
      external_directory: { '*': 'ask', 'C:\\Users\\kevin\\.MeridianUI\\*': 'allow', 'C:\\Users\\kevin\\.MeridianUI\\**': 'allow' },
    },
  },
};

/**
 * Ryou OpenCode configuration template.
 * This is the base config that gets merged with the user's existing config.
 */
export const RYOU_CONFIG_TEMPLATE = {
  model: DEFAULT_AGENT_MODELS['ryou-orchestrator'],
  small_model: DEFAULT_AGENT_MODELS.documentation,
  default_agent: 'ryou-orchestrator',
  shell: 'pwsh',
  permission: {
    skill: {
      'dotnet-clean-architecture': 'allow',
      'aspnet-api': 'allow',
      efcore: 'allow',
      'refi-enterprise-feature-implementation': 'allow',
      meridianui: 'allow',
      'blazor-ui': 'allow',
      'wpf-xaml': 'allow',
      'avalonia-ui': 'allow',
      'maui-ui': 'allow',
      'documentation-summary': 'allow',
      'debugging-workflow': 'allow',
      'review-workflow': 'allow',
    },
  },
  instructions: [
    'rules/global-rules.md',
    'rules/meridianui.md',
    'refi/README.md',
    'refi/config.yaml',
    'refi/rules/global-rules.md',
    'refi/rules/anti-hallucination.md',
    'refi/rules/quality-gates.md',
  ],
  watcher: {
    ignore: [
      '**/.git/**',
      '**/.vs/**',
      '**/bin/**',
      '**/obj/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/publish/**',
    ],
  },
};

/**
 * Files to deploy for Ryou agent setup.
 * Each entry is [source_relative_to_opencode, description].
 */
export const RYOU_DEPLOY_FILES = {
  agents: [
    'agents/ryou-orchestrator.md',
    'agents/ryou-efi-planner.md',
    'agents/planner.md',
    'agents/builder.md',
    'agents/architect.md',
    'agents/reviewer.md',
    'agents/debugger.md',
    'agents/documentation.md',
  ],
  rules: [
    'rules/global-rules.md',
    'rules/meridianui.md',
  ],
  skills: [
    'skills/refi-enterprise-feature-implementation/SKILL.md',
  ],
  refi: [
    'refi/README.md',
    'refi/config.yaml',
  ],
};

/**
 * Check if Ryou agents are already configured in an OpenCode config.
 * @param {object} config - The parsed opencode.json config
 * @returns {boolean}
 */
export function isRyouConfigured(config) {
  return !!(config && config.agent && config.agent['ryou-orchestrator']);
}

/**
 * Merge Ryou agents into an existing OpenCode config.
 * Does NOT overwrite existing agent configs — only adds missing ones.
 * @param {object} config - The parsed opencode.json config
 * @returns {object} The merged config
 */
export function mergeRyouAgents(config) {
  const merged = { ...config };

  // Ensure agent section exists
  if (!merged.agent) merged.agent = {};

  // ── Clean up legacy agent name to prevent duplicates ──
  if (merged.agent['ryou-efi-agent']) {
    delete merged.agent['ryou-efi-agent'];
  }
  if (merged.default_agent === 'ryou-efi-agent') {
    merged.default_agent = 'ryou-efi-planner';
  }

  // Add missing agents (don't overwrite existing ones)
  for (const [name, agentConfig] of Object.entries(RYOU_AGENTS)) {
    if (!merged.agent[name]) {
      merged.agent[name] = { ...agentConfig };
    }
  }

  // Set default_agent if not set
  if (!merged.default_agent) {
    merged.default_agent = 'ryou-orchestrator';
  }

  // Set model if not set
  if (!merged.model) {
    merged.model = RYOU_CONFIG_TEMPLATE.model;
  }

  if (!merged.small_model) {
    merged.small_model = RYOU_CONFIG_TEMPLATE.small_model;
  }

  if (!merged.shell) {
    merged.shell = RYOU_CONFIG_TEMPLATE.shell;
  }

  // Merge permissions (add missing skills)
  if (!merged.permission) merged.permission = {};
  if (!merged.permission.skill) merged.permission.skill = {};
  for (const [skill, value] of Object.entries(RYOU_CONFIG_TEMPLATE.permission.skill)) {
    if (merged.permission.skill[skill] === undefined) {
      merged.permission.skill[skill] = value;
    }
  }

  // Merge instructions (add missing ones)
  if (!merged.instructions) merged.instructions = [];
  for (const instruction of RYOU_CONFIG_TEMPLATE.instructions) {
    if (!merged.instructions.includes(instruction)) {
      merged.instructions.push(instruction);
    }
  }

  // Merge watcher ignores (add missing ones)
  if (!merged.watcher) merged.watcher = {};
  if (!merged.watcher.ignore) merged.watcher.ignore = [];
  for (const ignore of RYOU_CONFIG_TEMPLATE.watcher.ignore) {
    if (!merged.watcher.ignore.includes(ignore)) {
      merged.watcher.ignore.push(ignore);
    }
  }

  return merged;
}
