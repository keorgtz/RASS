/**
 * RASS Core — Ryou Adaptive SDD System
 * Core logic for mode/profile management and runtime generation.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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

function getModesDir() { return join(__dirname, 'modes'); }
function getProfilesDir() { return join(__dirname, 'profiles'); }
function getRuntimeDir() { return join(__dirname, 'runtime'); }

function getModePath(name) { return join(getModesDir(), `${name}.json`); }
function getProfilePath(name) { return join(getProfilesDir(), `${name}.json`); }
function getCurrentModePath() { return join(getRuntimeDir(), 'current-mode.json'); }
function getCurrentProfilePath() { return join(getRuntimeDir(), 'current-profile.json'); }
function getRuntimePath() { return join(getRuntimeDir(), 'runtime.generated.json'); }
function getConfigPath() { return join(__dirname, 'sdd.config.json'); }

// ─── Modes ──────────────────────────────────────────────────────────────────

/**
 * List all available SDD modes.
 * @returns {Array<{id: string, name: string, description: string, phases: string[], default_effort: string}>}
 */
export function listModes() {
  const dir = getModesDir();
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const id = f.replace('.json', '');
      const data = readJson(join(dir, f));
      if (!data) return null;
      // Handle both old format (array) and new format (object with phases)
      const phases = Array.isArray(data) ? data : (data.phases || []);
      return {
        id,
        name: data.name || id,
        description: data.description || '',
        phases,
        default_effort: data.default_effort || 'medium',
      };
    })
    .filter(Boolean);
}

/**
 * Get a specific mode by name.
 * @param {string} name
 * @returns {{id: string, name: string, description: string, phases: string[], default_effort: string}|null}
 */
export function getMode(name) {
  const data = readJson(getModePath(name));
  if (!data) return null;
  const phases = Array.isArray(data) ? data : (data.phases || []);
  return {
    id: name,
    name: data.name || name,
    description: data.description || '',
    phases,
    default_effort: data.default_effort || 'medium',
  };
}

/**
 * Switch to a different SDD mode.
 * @param {string} name
 * @returns {{id: string, name: string, description: string, phases: string[], default_effort: string}}
 */
export function switchMode(name) {
  const mode = getMode(name);
  if (!mode) throw new Error(`Mode '${name}' not found. Available: ${listModes().map(m => m.id).join(', ')}`);
  writeJson(getCurrentModePath(), { mode: name });
  generateRuntime();
  return mode;
}

/**
 * Create a new SDD mode.
 * @param {string} name - Mode identifier (e.g., "custom-api")
 * @param {string[]} phases - Array of phase names
 * @param {string} [description] - Human-readable description
 * @param {string} [defaultEffort] - Default effort level (low, medium, high, extreme)
 */
export function createMode(name, phases, description = '', defaultEffort = 'medium') {
  const modeData = {
    name: name.charAt(0).toUpperCase() + name.slice(1).replace(/[-_]/g, ' '),
    description,
    phases,
    default_effort: defaultEffort,
  };
  writeJson(getModePath(name), modeData);
  return { id: name, ...modeData };
}

/**
 * Update an existing SDD mode.
 * @param {string} name - Mode identifier
 * @param {object} updates - Partial updates to merge (phases, description, default_effort, name)
 * @returns {{id: string, name: string, description: string, phases: string[], default_effort: string}}
 */
export function updateMode(name, updates) {
  const existing = readJson(getModePath(name));
  if (!existing) throw new Error(`Mode '${name}' not found`);
  const phases = updates.phases || (Array.isArray(existing) ? existing : existing.phases || []);
  const merged = {
    ...existing,
    ...(updates.name && { name: updates.name }),
    ...(updates.description !== undefined && { description: updates.description }),
    ...(updates.phases && { phases: updates.phases }),
    ...(updates.default_effort && { default_effort: updates.default_effort }),
  };
  // Ensure phases is always in the object format
  if (Array.isArray(merged)) {
    writeJson(getModePath(name), merged);
    return { id: name, name, description: '', phases: merged, default_effort: 'medium' };
  }
  writeJson(getModePath(name), merged);
  return { id: name, name: merged.name || name, description: merged.description || '', phases: merged.phases || [], default_effort: merged.default_effort || 'medium' };
}

/**
 * Delete an SDD mode.
 * @param {string} name
 */
export function deleteMode(name) {
  const filePath = getModePath(name);
  if (existsSync(filePath)) {
    unlinkSync(filePath);
  }
}

// ─── Profiles ───────────────────────────────────────────────────────────────

/**
 * List all available SDD profiles.
 * @returns {Array<{id: string, name: string, description: string, default: object}>}
 */
export function listProfiles() {
  const dir = getProfilesDir();
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
        default: data.default || {},
      };
    })
    .filter(Boolean);
}

/**
 * Get a specific profile by name.
 * @param {string} name
 * @returns {object|null}
 */
export function getProfile(name) {
  return readJson(getProfilePath(name));
}

/**
 * Switch to a different SDD profile.
 * @param {string} name
 * @returns {object}
 */
export function switchProfile(name) {
  const profile = getProfile(name);
  if (!profile) throw new Error(`Profile '${name}' not found. Available: ${listProfiles().map(p => p.id).join(', ')}`);
  writeJson(getCurrentProfilePath(), { profile: name });
  generateRuntime();
  return profile;
}

/**
 * Create a new SDD profile.
 * @param {string} name - Profile identifier
 * @param {object} config - Profile configuration with default and per-phase overrides
 * @param {string} [description] - Human-readable description
 */
export function createProfile(name, config, description = '') {
  const profileData = {
    name: name.charAt(0).toUpperCase() + name.slice(1).replace(/[-_]/g, ' '),
    description,
    ...config,
  };
  writeJson(getProfilePath(name), profileData);
  return profileData;
}

/**
 * Update an existing SDD profile.
 * @param {string} name - Profile identifier
 * @param {object} updates - Partial updates to merge (default, per-phase overrides, description, name)
 * @returns {object}
 */
export function updateProfile(name, updates) {
  const existing = readJson(getProfilePath(name));
  if (!existing) throw new Error(`Profile '${name}' not found`);
  const merged = {
    ...existing,
    ...(updates.name && { name: updates.name }),
    ...(updates.description !== undefined && { description: updates.description }),
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
  writeJson(getProfilePath(name), merged);
  return merged;
}

/**
 * Delete an SDD profile.
 * @param {string} name
 */
export function deleteProfile(name) {
  const filePath = getProfilePath(name);
  if (existsSync(filePath)) {
    unlinkSync(filePath);
  }
}

// ─── Runtime ────────────────────────────────────────────────────────────────

/**
 * Get the current active mode name.
 * @returns {string|null}
 */
export function getCurrentMode() {
  const data = readJson(getCurrentModePath());
  return data?.mode || null;
}

/**
 * Get the current active profile name.
 * @returns {string|null}
 */
export function getCurrentProfile() {
  const data = readJson(getCurrentProfilePath());
  return data?.profile || null;
}

/**
 * Generate the runtime configuration by combining current mode + profile.
 * Writes runtime.generated.json and returns the result.
 * @returns {object}
 */
export function generateRuntime() {
  const currentModeName = getCurrentMode() || 'fast';
  const currentProfileName = getCurrentProfile() || 'balanced';

  const mode = getMode(currentModeName);
  const profile = getProfile(currentProfileName);

  if (!mode || !profile) return null;

  const phases = mode.phases || [];
  const defaultEffort = mode.default_effort || 'medium';

  const resolvedPhases = {};
  for (const phase of phases) {
    const phaseProfile = profile[phase] || profile.default;
    if (phaseProfile) {
      resolvedPhases[phase] = {
        model: phaseProfile.primary,
        effort: phaseProfile.effort || defaultEffort,
        fallbacks: phaseProfile.fallbacks || [],
      };
    }
  }

  const runtime = {
    active_mode: currentModeName,
    active_profile: currentProfileName,
    enabled_phases: phases,
    phases: resolvedPhases,
    generated_at: new Date().toISOString(),
  };

  writeJson(getRuntimePath(), runtime);
  return runtime;
}

/**
 * Get the full RASS status: current mode, profile, and resolved runtime.
 * @returns {object}
 */
export function getStatus() {
  const currentModeName = getCurrentMode();
  const currentProfileName = getCurrentProfile();
  const mode = currentModeName ? getMode(currentModeName) : null;
  const profile = currentProfileName ? getProfile(currentProfileName) : null;
  const runtime = generateRuntime();

  return {
    current_mode: currentModeName,
    current_profile: currentProfileName,
    mode,
    profile: profile ? {
      id: currentProfileName,
      name: profile.name || currentProfileName,
      description: profile.description || '',
      default_model: profile.default?.primary || 'unknown',
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
    version: '2.0.0',
    default_mode: 'fast',
    default_profile: 'balanced',
  };
}

/**
 * Available phases for mode creation.
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
 * Available OpenCode Go models for profile creation.
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