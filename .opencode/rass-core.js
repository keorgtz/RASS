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

function getModeProfilePath(name) { return join(getModeProfilesDir(), `${name}.json`); }
function getCurrentModeProfilePath() { return join(getRuntimeDir(), 'current-modeprofile.json'); }
function getRuntimePath() { return join(getRuntimeDir(), 'runtime.generated.json'); }
function getConfigPath() { return join(__dirname, 'sdd.config.json'); }

function getHomeDir() {
  return process.env.USERPROFILE || process.env.HOME || os.homedir();
}

function getGlobalConfigPath() {
  return join(getHomeDir(), '.config', 'opencode', 'opencode.json');
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
 * Synchronize Ryou agent models with the active ModeProfile configuration.
 * Maps ModeProfile phases to agent roles and updates opencode.json.
 * @param {string} modeProfileName
 * @returns {boolean} true if sync succeeded
 */
export function syncAgentsWithModeProfile(modeProfileName) {
  const mp = getModeProfile(modeProfileName);
  if (!mp) return false;

  const configPath = getGlobalConfigPath();
  if (!existsSync(configPath)) return false;

  let config;
  try {
    config = JSON.parse(readFileSync(configPath, 'utf8'));
  } catch {
    return false;
  }

  if (!config.agent) return false;

  // Map ModeProfile phases to Ryou agent roles
  const phaseToAgent = {
    orchestrator: 'ryou-orchestrator',
    propose: 'planner',
    apply: 'builder',
    design: 'architect',
    verify: 'reviewer',
    archive: 'documentation',
  };

  const defaultConfig = mp.default || {};

  // Update agent models based on ModeProfile phase configuration
  for (const [phase, agentName] of Object.entries(phaseToAgent)) {
    const phaseConfig = mp[phase] || defaultConfig;
    if (phaseConfig?.primary && config.agent[agentName]) {
      config.agent[agentName].model = phaseConfig.primary;
    }
  }

  // Debugger uses the same model as reviewer (verify phase)
  const verifyConfig = mp.verify || defaultConfig;
  if (verifyConfig?.primary && config.agent.debugger) {
    config.agent.debugger.model = verifyConfig.primary;
  }

  try {
    writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    return true;
  } catch {
    return false;
  }
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
  generateRuntime();
  syncAgentsWithModeProfile(name);
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
  const currentName = getCurrentModeProfile() || 'ryouset';
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
 * @returns {object}
 */
export function getStatus() {
  const currentName = getCurrentModeProfile();
  const mp = currentName ? getModeProfile(currentName) : null;
  const runtime = generateRuntime();

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

/**
 * Get the RASS configuration.
 * @returns {object}
 */
export function getConfig() {
  return readJson(getConfigPath()) || {
    system_name: 'RASS',
    full_name: 'Ryou Adaptive SDD System',
    version: '3.0.0',
    default_modeprofile: 'ryouset',
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
 * Available OpenCode Go models for ModeProfile creation.
 */
export const AVAILABLE_MODELS = [
  { id: 'opencode-go/glm-5.1', label: 'GLM-5.1', description: 'Orchestration, planning, architecture, complex reasoning' },
  { id: 'opencode-go/kimi-k2.6', label: 'Kimi K2.6', description: 'Implementation, refactors, C#/.NET code generation' },
  { id: 'opencode-go/deepseek-v4-pro', label: 'DeepSeek V4 Pro', description: 'Debugging, review, performance, risk analysis' },
  { id: 'opencode-go/deepseek-v4-flash', label: 'DeepSeek V4 Flash', description: 'Small tasks, documentation, summaries' },
];

// ─── Agent Deployment ────────────────────────────────────────────────────────

/**
 * Ryou agent definitions for OpenCode config deployment.
 * These match the exact agent configuration from the user's opencode.json.
 */
export const RYOU_AGENTS = {
  'ryou-orchestrator': {
    description: 'Primary orchestrator for pragmatic .NET work using Ryou workflow and MeridianUI.',
    mode: 'primary',
    model: 'opencode-go/glm-5.1',
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
  planner: {
    description: 'Subagent for planning medium or complex work before implementation.',
    mode: 'subagent',
    model: 'opencode-go/glm-5.1',
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
    model: 'opencode-go/kimi-k2.6',
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
    model: 'opencode-go/glm-5.1',
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
    model: 'opencode-go/deepseek-v4-pro',
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
    model: 'opencode-go/deepseek-v4-pro',
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
    model: 'opencode-go/deepseek-v4-flash',
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
  model: 'opencode-go/kimi-k2.6',
  small_model: 'opencode-go/deepseek-v4-flash',
  default_agent: 'ryou-orchestrator',
  shell: 'pwsh',
  permission: {
    skill: {
      'dotnet-clean-architecture': 'allow',
      'aspnet-api': 'allow',
      efcore: 'allow',
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
  instructions: ['rules/global-rules.md', 'rules/meridianui.md'],
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
