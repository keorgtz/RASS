/**
 * REASP Installer — OpenCode target adapter.
 *
 * Preserves the existing OpenCode installation behavior exactly.
 * This adapter is the reference implementation for the multi-agent refactor.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { SOURCE_DIR, getHomeDir, getGlobalOpenCodeDir, REASP_ASSETS } from '../constants.js';
import {
  ProgressTracker,
  countFilesRecursive,
  countTotalFilesToCopy,
  printWarning,
  printInfo,
  printSuccess,
  printError,
  ICONS,
} from '../tui.js';

export const id = 'opencode';
export const displayName = 'OpenCode';
export const capabilities = {
  agents: true,
  plugins: true,
  slashCommands: true,
  mcp: true,
  instructions: true,
  permissions: true,
  models: true,
};

// ═══════════════════════════════════════════════════════════════════════════════
// PATH RESOLUTION
// ═══════════════════════════════════════════════════════════════════════════════

export function getGlobalDir(ctx = {}) {
  return ctx.globalDir || getGlobalOpenCodeDir();
}

export function getGlobalConfigPath(ctx = {}) {
  return path.join(getGlobalDir(ctx), 'opencode.json');
}

export function getInstalledReaspConfigPath(globalDir) {
  return path.join(globalDir, 'reasp.config.json');
}

export function getMeridianUIPathPatterns(ctx = {}) {
  const home = ctx.homeDir || getHomeDir();
  const meridianDir = path.join(home, '.MeridianUI');
  const meridianGlob = meridianDir.replace(/\\/g, '/');
  const starPattern = `${meridianGlob}/*`;
  const starStarPattern = `${meridianGlob}/**`;
  return { starPattern, starStarPattern };
}

export function getDefaultShell() {
  return process.platform === 'win32' ? 'pwsh' : 'bash';
}

// ═══════════════════════════════════════════════════════════════════════════════
// DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Find the OpenCode CLI executable using the same strategy as the legacy installer:
 * 1. `opencode --version`
 * 2. `npx opencode-ai --version`
 * 3. Common filesystem paths on Windows / Unix.
 */
export function findOpenCodeCommand() {
  try {
    execSync('opencode --version', { stdio: 'pipe' });
    return 'opencode';
  } catch {
    // not in PATH
  }

  try {
    execSync('npx opencode-ai --version', { stdio: 'pipe' });
    return 'npx opencode-ai';
  } catch {
    // npx fallback failed
  }

  if (process.platform === 'win32') {
    const appData = process.env.APPDATA || path.join(getHomeDir(), 'AppData', 'Roaming');
    const winPaths = [
      path.join(appData, 'npm', 'opencode.exe'),
      path.join(appData, 'npm', 'node_modules', 'opencode-ai', 'bin', 'opencode.exe'),
      path.join(getHomeDir(), 'AppData', 'Roaming', 'npm', 'opencode.exe'),
      path.join(getHomeDir(), 'AppData', 'Roaming', 'npm', 'node_modules', 'opencode-ai', 'bin', 'opencode.exe'),
    ];
    for (const p of winPaths) {
      if (fs.existsSync(p)) {
        return `"${p}"`;
      }
    }
  } else {
    const unixPaths = [
      '/usr/local/bin/opencode',
      '/usr/bin/opencode',
      path.join(getHomeDir(), '.local', 'bin', 'opencode'),
      path.join(getHomeDir(), '.npm-global', 'bin', 'opencode'),
      path.join(getHomeDir(), '.volta', 'bin', 'opencode'),
      path.join(getHomeDir(), '.nvm', 'versions', 'node', '*', 'bin', 'opencode'),
    ];
    for (const p of unixPaths) {
      if (p.includes('*')) {
        const dir = path.dirname(p);
        if (fs.existsSync(dir)) {
          const entries = fs.readdirSync(dir);
          for (const entry of entries) {
            const candidate = path.join(dir, entry, 'bin', 'opencode');
            if (fs.existsSync(candidate)) {
              return candidate;
            }
          }
        }
      } else if (fs.existsSync(p)) {
        return p;
      }
    }
  }

  return null;
}

export function detect(ctx = {}) {
  const opencodeCmd = findOpenCodeCommand();
  let version = null;

  if (opencodeCmd) {
    try {
      const output = execSync(`${opencodeCmd} --version`, { stdio: 'pipe', encoding: 'utf8' });
      version = output.trim();
    } catch {
      version = 'unknown';
    }
  }

  const globalDir = getGlobalDir(ctx);
  const detectedBy = opencodeCmd ? 'cli' : fs.existsSync(globalDir) ? 'filesystem' : null;

  return {
    id,
    installed: !!opencodeCmd || fs.existsSync(globalDir),
    version,
    path: opencodeCmd || globalDir,
    detectedBy,
  };
}

export function isInstalled(ctx = {}) {
  const globalDir = getGlobalDir(ctx);
  return fs.existsSync(path.join(globalDir, 'plugin.js')) || fs.existsSync(getGlobalConfigPath(ctx));
}

// ═══════════════════════════════════════════════════════════════════════════════
// FILE HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export function copyDirRecursiveSync(source, target, onFileCopied = null) {
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

export function removeDirRecursiveSync(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODEPROFILE MODEL RESOLUTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Read a ModeProfile and resolve agent models from its phase configuration.
 * Primary agents follow a fallback chain: orchestrator → init → explore → default.
 * @param {string} sourceDir - Canonical REASP asset directory.
 * @param {string} modeProfileName - e.g., 'ryouset', 'fast'
 * @returns {object} Map of agent names to model IDs
 */
export function resolveAgentModels(sourceDir, modeProfileName) {
  const mpPath = path.join(sourceDir, 'sdd-profiles', `${modeProfileName}.json`);
  let mp = null;
  if (fs.existsSync(mpPath)) {
    try {
      mp = JSON.parse(fs.readFileSync(mpPath, 'utf8'));
    } catch {
      mp = null;
    }
  }

  // Fallback defaults aligned with rass-core.js
  const defaults = {
    'ryou-orchestrator': 'opencode-go/kimi-k2.7-code',
    'ryou-efi-planner': 'opencode-go/kimi-k2.7-code',
    planner: 'opencode-go/glm-5.1',
    builder: 'opencode-go/kimi-k2.7-code',
    architect: 'opencode-go/glm-5.1',
    reviewer: 'opencode-go/deepseek-v4-pro',
    debugger: 'opencode-go/deepseek-v4-pro',
    documentation: 'opencode-go/deepseek-v4-flash',
  };

  if (!mp) return defaults;

  const defaultConfig = mp.default || {};
  const models = { ...defaults };

  const primaryModel =
    mp.orchestrator?.primary ||
    mp.init?.primary ||
    mp.explore?.primary ||
    defaultConfig.primary ||
    defaults['ryou-orchestrator'];

  models['ryou-orchestrator'] = primaryModel;
  models['ryou-efi-planner'] = primaryModel;

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
 * Synchronize agent models in opencode.json with a ModeProfile configuration.
 * @param {object} ctx
 * @param {string} modeProfileName
 * @returns {boolean}
 */
export function syncAgentsWithModeProfile(ctx, modeProfileName) {
  const sourceDir = ctx.sourceDir || SOURCE_DIR;
  const agentModels = resolveAgentModels(sourceDir, modeProfileName);
  const globalConfigPath = getGlobalConfigPath(ctx);

  if (!fs.existsSync(globalConfigPath)) return false;

  let config;
  try {
    config = JSON.parse(fs.readFileSync(globalConfigPath, 'utf8'));
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
    fs.writeFileSync(globalConfigPath, JSON.stringify(config, null, 2), 'utf8');
    return true;
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// WORKFLOW / CONFIG HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Set the default workflow agent and update reasp.config.json accordingly.
 */
export function setInstalledWorkflow(ctx, workflowAgent) {
  const globalDir = getGlobalDir(ctx);
  const globalConfigPath = getGlobalConfigPath(ctx);

  let config = {};
  if (fs.existsSync(globalConfigPath)) {
    try {
      config = JSON.parse(fs.readFileSync(globalConfigPath, 'utf8'));
    } catch {
      config = {};
    }
  }

  config.default_agent = workflowAgent;
  fs.writeFileSync(globalConfigPath, JSON.stringify(config, null, 2), 'utf8');

  const reaspConfigPath = getInstalledReaspConfigPath(globalDir);
  let reaspConfig = {};
  if (fs.existsSync(reaspConfigPath)) {
    try {
      reaspConfig = JSON.parse(fs.readFileSync(reaspConfigPath, 'utf8'));
    } catch {
      reaspConfig = {};
    }
  }

  reaspConfig.default_workflow = workflowAgent;
  if (!reaspConfig.features) reaspConfig.features = {};
  if (!reaspConfig.features.rass) reaspConfig.features.rass = { enabled: true, label: 'Ryou Orchestrator' };
  if (!reaspConfig.features.refi) reaspConfig.features.refi = { enabled: true, label: 'Ryou EFI Planner' };
  if (workflowAgent === 'ryou-orchestrator') {
    reaspConfig.features.rass.enabled = true;
  }
  if (workflowAgent === 'ryou-efi-planner') {
    reaspConfig.features.refi.enabled = true;
  }
  fs.writeFileSync(reaspConfigPath, JSON.stringify(reaspConfig, null, 2), 'utf8');
}

/**
 * Persist the active ModeProfile for the OpenCode runtime and sync agent models.
 */
export function setInstalledModeProfile(ctx, modeProfileName) {
  const globalDir = getGlobalDir(ctx);
  const runtimeDir = path.join(globalDir, 'runtime');
  if (!fs.existsSync(runtimeDir)) fs.mkdirSync(runtimeDir, { recursive: true });
  fs.writeFileSync(
    path.join(runtimeDir, 'current-modeprofile.json'),
    JSON.stringify({ modeprofile: modeProfileName }, null, 2)
  );

  const syncResult = syncAgentsWithModeProfile(ctx, modeProfileName);
  return { success: syncResult, runtimeDir };
}

// ═══════════════════════════════════════════════════════════════════════════════
// INSTALL
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fallback plugin registration when the `opencode plugin` CLI command fails.
 */
export function registerPluginManually(globalConfigPath, globalDir) {
  let config = {};
  const configExists = fs.existsSync(globalConfigPath);

  if (configExists) {
    try {
      config = JSON.parse(fs.readFileSync(globalConfigPath, 'utf8'));
    } catch {
      config = {};
    }
  }

  if (!config.$schema) {
    config.$schema = 'https://opencode.ai/schema.json';
  }

  if (!config.plugin) config.plugin = [];

  const pluginUrl = pathToFileURL(path.join(globalDir, 'plugin.js')).href;
  const tuiUrl = pathToFileURL(path.join(globalDir, 'tui.js')).href;

  config.plugin = config.plugin.filter((p) => {
    if (typeof p === 'string') {
      return (
        !p.includes('rass') &&
        !p.includes('RASS') &&
        !p.includes('.opencode/plugin') &&
        !p.includes('.opencode/tui') &&
        !(p.endsWith('plugin.js') && p.includes('opencode')) &&
        !(p.endsWith('tui.js') && p.includes('opencode'))
      );
    }
    if (Array.isArray(p)) return !p[0]?.includes('rass') && !p[0]?.includes('RASS');
    return true;
  });

  config.plugin.push(pluginUrl);
  config.plugin.push(tuiUrl);

  fs.writeFileSync(globalConfigPath, JSON.stringify(config, null, 2), 'utf8');
}

/**
 * Install REASP into the OpenCode global configuration directory.
 *
 * @param {object} ctx - Installer context.
 * @param {object} bundle - Compiled REASP bundle.
 * @returns {{globalDir:string, globalConfigPath:string}}
 */
export function install(ctx, bundle = {}) {
  const sourceDir = ctx.sourceDir || SOURCE_DIR;
  const globalDir = getGlobalDir(ctx);
  const globalConfigPath = getGlobalConfigPath(ctx);
  const { starPattern, starStarPattern } = getMeridianUIPathPatterns(ctx);

  const modeProfileName = bundle.modeProfile || ctx.modeProfile || 'ryouset';
  const agentModels = bundle.modelMapping || resolveAgentModels(sourceDir, modeProfileName);
  const progress = ctx.progress || null;
  const dryRun = ctx.dryRun || bundle.dryRun || false;

  const PHASES = {
    init: { start: 0, end: 5, msg: 'Preparing directories', icon: ICONS.diamond },
    copyDirs: { start: 5, end: 35, msg: 'Copying directories', icon: ICONS.bullet },
    copyFiles: { start: 35, end: 45, msg: 'Copying plugin files', icon: ICONS.bullet },
    npm: { start: 45, end: 70, msg: 'Installing npm dependencies', icon: ICONS.ring },
    register: { start: 70, end: 85, msg: 'Registering plugins', icon: ICONS.sparkle },
    agents: { start: 85, end: 98, msg: 'Configuring Ryou agents', icon: ICONS.star },
    finalize: { start: 98, end: 100, msg: 'Finalizing installation', icon: ICONS.check },
  };

  let currentPercent = 0;

  function reportProgress(percent, message, icon) {
    if (progress) {
      progress.update(percent, message, icon);
    }
  }

  function runPhase(phaseName, workFn) {
    const phase = PHASES[phaseName];
    reportProgress(phase.start, phase.msg, phase.icon);
    workFn();
    currentPercent = phase.end;
    reportProgress(currentPercent, phase.msg + '...', phase.icon);
  }

  runPhase('init', () => {
    if (dryRun) {
      printInfo(`[dry-run] Would ensure directory exists: ${globalDir}`);
      return;
    }
    if (!fs.existsSync(globalDir)) {
      fs.mkdirSync(globalDir, { recursive: true });
    }
  });

  const { dirsToCopy, filesToCopy } = REASP_ASSETS;
  const totalFiles = countTotalFilesToCopy(sourceDir, dirsToCopy, filesToCopy);
  let filesCopied = 0;

  function onFileCopied() {
    filesCopied++;
    if (totalFiles > 0 && progress) {
      const copyRange = PHASES.copyDirs.end - PHASES.copyDirs.start;
      const copyProgress = (filesCopied / totalFiles) * copyRange;
      currentPercent = PHASES.copyDirs.start + copyProgress;
      reportProgress(currentPercent, `Copying files (${filesCopied}/${totalFiles})`, ICONS.bullet);
    }
  }

  runPhase('copyDirs', () => {
    if (dryRun) {
      printInfo(`[dry-run] Would copy directories: ${dirsToCopy.join(', ')}`);
      return;
    }
    for (const dir of dirsToCopy) {
      const src = path.join(sourceDir, dir);
      const dest = path.join(globalDir, dir);
      if (fs.existsSync(src)) {
        copyDirRecursiveSync(src, dest, onFileCopied);
      }
    }
  });

  runPhase('copyFiles', () => {
    if (dryRun) {
      printInfo(`[dry-run] Would copy files: ${filesToCopy.join(', ')}`);
      return;
    }
    for (const file of filesToCopy) {
      const src = path.join(sourceDir, file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(globalDir, file));
        filesCopied++;
        if (totalFiles > 0 && progress) {
          const copyRange = PHASES.copyFiles.end - PHASES.copyFiles.start;
          const fileProgress = (filesCopied / totalFiles) * copyRange;
          currentPercent = PHASES.copyFiles.start + fileProgress;
          reportProgress(currentPercent, `Copying files (${filesCopied}/${totalFiles})`, ICONS.bullet);
        }
      }
    }
  });

  let npmInstalled = false;
  if (progress) {
    currentPercent = PHASES.npm.start;
    reportProgress(currentPercent, 'Installing npm dependencies...', ICONS.ring);
  }

  if (dryRun) {
    printInfo('[dry-run] Would run npm install');
    npmInstalled = true;
  } else {
    try {
      execSync('npm install', { cwd: globalDir, stdio: 'pipe' });
      npmInstalled = true;
    } catch (e) {
      const stderr = e.stderr || '';
      printWarning('npm install failed in global dir');
      if (stderr.trim()) printInfo(stderr.trim().split('\n').pop());
      printInfo('Plugin registration may fail without dependencies');
    }
  }

  if (progress) {
    currentPercent = PHASES.npm.end;
    reportProgress(currentPercent, 'npm dependencies installed', ICONS.ring);
  }

  const pluginUrl = pathToFileURL(path.join(globalDir, 'plugin.js')).href;
  const tuiUrl = pathToFileURL(path.join(globalDir, 'tui.js')).href;
  const opencodeCmd = findOpenCodeCommand();

  runPhase('register', () => {
    if (dryRun) {
      printInfo('[dry-run] Would register plugins');
      return;
    }
    if (opencodeCmd) {
      let pluginRegistered = false;
      try {
        execSync(`${opencodeCmd} plugin "${pluginUrl}" --global --force`, {
          stdio: ['pipe', 'pipe', 'pipe'],
          encoding: 'utf8',
        });
        pluginRegistered = true;
        if (progress) {
          currentPercent = PHASES.register.start + ((PHASES.register.end - PHASES.register.start) * 0.5);
          reportProgress(currentPercent, 'Registering plugin TUI...', ICONS.sparkle);
        }
      } catch (e) {
        const stderr = e.stderr || '';
        const stdout = e.stdout || '';
        printWarning('opencode plugin command failed');
        if (stderr.trim()) printInfo(`stderr: ${stderr.trim()}`);
        if (stdout.trim()) printInfo(`stdout: ${stdout.trim()}`);
        printWarning('Falling back to manual config registration');
        registerPluginManually(globalConfigPath, globalDir);
      }

      if (pluginRegistered) {
        try {
          execSync(`${opencodeCmd} plugin "${tuiUrl}" --global --force`, { stdio: 'pipe' });
        } catch (e) {
          const stderr = e.stderr || '';
          const stdout = e.stdout || '';
          printWarning('opencode plugin for TUI failed');
          if (stderr.trim()) printInfo(`stderr: ${stderr.trim()}`);
          if (stdout.trim()) printInfo(`stdout: ${stdout.trim()}`);
        }
      }
    } else {
      printWarning('opencode CLI not found in PATH or common locations');
      printInfo('Tried: opencode, npx opencode-ai, and common install directories');
      printWarning('Falling back to manual config registration');
      registerPluginManually(globalConfigPath, globalDir);
    }
  });

  let config = {};
  if (fs.existsSync(globalConfigPath)) {
    try {
      config = JSON.parse(fs.readFileSync(globalConfigPath, 'utf8'));
    } catch {
      config = {};
    }
  }

  if (!config.agent) config.agent = {};

  if (config.agent['ryou-efi-agent']) {
    delete config.agent['ryou-efi-agent'];
  }
  if (config.default_agent === 'ryou-efi-agent') {
    config.default_agent = 'ryou-efi-planner';
  }

  const ryouAgents = {
    'ryou-orchestrator': {
      description: 'Primary orchestrator for pragmatic .NET work using Ryou workflow and MeridianUI.',
      mode: 'primary',
      model: agentModels['ryou-orchestrator'],
      temperature: 0.2,
      steps: 40,
      prompt: '{file:./agents/ryou-orchestrator.md}',
      permission: {
        read: 'allow', glob: 'allow', grep: 'allow', list: 'allow',
        edit: { '*': 'allow', [starPattern]: 'deny', [starStarPattern]: 'deny' },
        bash: 'allow', task: 'allow', webfetch: 'allow', websearch: 'allow',
        external_directory: { '*': 'ask', [starPattern]: 'allow', [starStarPattern]: 'allow' },
      },
    },
    'ryou-efi-planner': {
      description: 'Primary planning agent for REFI packet generation and implementation handoff.',
      mode: 'primary', model: agentModels['ryou-efi-planner'], temperature: 0.1, steps: 32,
      prompt: '{file:./agents/ryou-efi-planner.md}',
      permission: {
        read: 'allow', glob: 'allow', grep: 'allow', list: 'allow',
        edit: { '*': 'allow', [starPattern]: 'deny', [starStarPattern]: 'deny' },
        bash: 'allow', task: 'allow', todowrite: 'allow', webfetch: 'allow', websearch: 'allow',
        external_directory: { '*': 'ask', [starPattern]: 'allow', [starStarPattern]: 'allow' },
      },
    },
    planner: {
      description: 'Subagent for planning medium or complex work before implementation.',
      mode: 'subagent', model: agentModels.planner, temperature: 0.1, steps: 14,
      prompt: '{file:./agents/planner.md}',
      permission: { read: 'allow', glob: 'allow', grep: 'allow', list: 'allow', edit: 'deny', bash: 'deny', task: 'deny',
        external_directory: { '*': 'ask', [starPattern]: 'allow', [starStarPattern]: 'allow' } },
    },
    builder: {
      description: 'Subagent for C#, .NET, EF Core, XAML, Blazor, MAUI, and MeridianUI implementation.',
      mode: 'subagent', model: agentModels.builder, temperature: 0.2, steps: 40,
      prompt: '{file:./agents/builder.md}',
      permission: { read: 'allow', glob: 'allow', grep: 'allow', list: 'allow',
        edit: { '*': 'allow', [starPattern]: 'deny', [starStarPattern]: 'deny' },
        bash: 'allow', task: 'deny',
        external_directory: { '*': 'ask', [starPattern]: 'allow', [starStarPattern]: 'allow' } },
    },
    architect: {
      description: 'Subagent for architecture decisions, boundaries, data flow, and pragmatic design tradeoffs.',
      mode: 'subagent', model: agentModels.architect, temperature: 0.1, steps: 16,
      prompt: '{file:./agents/architect.md}',
      permission: { read: 'allow', glob: 'allow', grep: 'allow', list: 'allow', edit: 'deny', bash: 'deny', task: 'deny',
        external_directory: { '*': 'ask', [starPattern]: 'allow', [starStarPattern]: 'allow' } },
    },
    reviewer: {
      description: 'Subagent for code review, regressions, maintainability, performance, and security risks.',
      mode: 'subagent', model: agentModels.reviewer, temperature: 0.1, steps: 18,
      prompt: '{file:./agents/reviewer.md}',
      permission: { read: 'allow', glob: 'allow', grep: 'allow', list: 'allow', edit: 'deny', bash: 'allow', task: 'deny',
        external_directory: { '*': 'ask', [starPattern]: 'allow', [starStarPattern]: 'allow' } },
    },
    debugger: {
      description: 'Subagent for bug investigation, failing tests, runtime errors, EF issues, and async/concurrency problems.',
      mode: 'subagent', model: agentModels.debugger, temperature: 0.1, steps: 26,
      prompt: '{file:./agents/debugger.md}',
      permission: { read: 'allow', glob: 'allow', grep: 'allow', list: 'allow', edit: 'deny', bash: 'allow', task: 'deny',
        external_directory: { '*': 'ask', [starPattern]: 'allow', [starStarPattern]: 'allow' } },
    },
    documentation: {
      description: 'Subagent for concise Markdown and visual HTML implementation summaries.',
      mode: 'subagent', model: agentModels.documentation, temperature: 0.2, steps: 12,
      prompt: '{file:./agents/documentation.md}',
      permission: { read: 'allow', glob: 'allow', grep: 'allow', list: 'allow',
        edit: { '*': 'allow', [starPattern]: 'deny', [starStarPattern]: 'deny' },
        bash: 'deny', task: 'deny',
        external_directory: { '*': 'ask', [starPattern]: 'allow', [starStarPattern]: 'allow' } },
    },
  };

  const agentNames = Object.keys(ryouAgents);
  const agentRange = PHASES.agents.end - PHASES.agents.start;

  for (let i = 0; i < agentNames.length; i++) {
    const name = agentNames[i];
    const agentConfig = ryouAgents[name];
    if (!config.agent[name]) {
      config.agent[name] = agentConfig;
    } else {
      config.agent[name].model = agentConfig.model;
    }
    if (progress) {
      const agentProgress = ((i + 1) / agentNames.length) * agentRange;
      currentPercent = PHASES.agents.start + agentProgress;
      reportProgress(currentPercent, `Configuring agent: ${name}`, ICONS.star);
    }
  }

  if (!config.default_agent) {
    config.default_agent = 'ryou-orchestrator';
  }

  const mpPath = path.join(sourceDir, 'sdd-profiles', `${modeProfileName}.json`);
  let modeProfile = null;
  if (fs.existsSync(mpPath)) {
    try {
      modeProfile = JSON.parse(fs.readFileSync(mpPath, 'utf8'));
    } catch {
      modeProfile = null;
    }
  }
  const defaultPrimary = modeProfile?.default?.primary || agentModels['ryou-orchestrator'] || 'opencode-go/kimi-k2.7-code';
  const defaultFallback = modeProfile?.default?.fallbacks?.[0] || 'opencode-go/deepseek-v4-flash';

  if (!config.model) {
    config.model = defaultPrimary;
  }
  if (!config.small_model) {
    config.small_model = defaultFallback;
  }
  if (!config.shell) {
    config.shell = getDefaultShell();
  }

  if (!config.permission) config.permission = {};
  if (!config.permission.skill) config.permission.skill = {};
  const defaultSkills = {
    'dotnet-clean-architecture': 'allow', 'aspnet-api': 'allow', efcore: 'allow',
    'refi-enterprise-feature-implementation': 'allow',
    meridianui: 'allow', 'blazor-ui': 'allow', 'wpf-xaml': 'allow',
    'avalonia-ui': 'allow', 'maui-ui': 'allow', 'documentation-summary': 'allow',
    'debugging-workflow': 'allow', 'review-workflow': 'allow',
  };
  for (const [skill, value] of Object.entries(defaultSkills)) {
    if (config.permission.skill[skill] === undefined) {
      config.permission.skill[skill] = value;
    }
  }

  if (!config.instructions) config.instructions = [];
  const defaultInstructions = [
    'rules/global-rules.md',
    'rules/meridianui.md',
    'refi/README.md',
    'refi/config.yaml',
    'refi/rules/global-rules.md',
    'refi/rules/anti-hallucination.md',
    'refi/rules/quality-gates.md',
  ];
  for (const instruction of defaultInstructions) {
    if (!config.instructions.includes(instruction)) {
      config.instructions.push(instruction);
    }
  }

  if (!config.watcher) config.watcher = {};
  if (!config.watcher.ignore) config.watcher.ignore = [];
  const defaultIgnores = ['**/.git/**', '**/.vs/**', '**/bin/**', '**/obj/**', '**/node_modules/**', '**/dist/**', '**/publish/**'];
  for (const ignore of defaultIgnores) {
    if (!config.watcher.ignore.includes(ignore)) {
      config.watcher.ignore.push(ignore);
    }
  }

  if (dryRun) {
    printInfo(`[dry-run] Would write ${globalConfigPath}`);
  } else {
    fs.writeFileSync(globalConfigPath, JSON.stringify(config, null, 2), 'utf8');
  }

  currentPercent = 100;
  if (progress) {
    progress.finish('Installation complete');
  }

  return { success: true, globalDir, globalConfigPath, pathsWritten: [globalConfigPath] };
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNINSTALL
// ═══════════════════════════════════════════════════════════════════════════════

export function uninstall(ctx = {}) {
  const sourceDir = ctx.sourceDir || SOURCE_DIR;
  const globalDir = getGlobalDir(ctx);
  const globalConfigPath = getGlobalConfigPath(ctx);
  const dryRun = ctx.dryRun || false;

  if (dryRun) {
    return {
      success: true,
      globalDir,
      globalConfigPath,
      message: `[dry-run] Would remove REASP assets from ${globalDir} and clean ${globalConfigPath}`,
      pathsRemoved: [globalDir, globalConfigPath],
    };
  }

  const dirsToRemove = ['sdd-profiles', 'phases', 'runtime', 'agents', 'rules', 'refi'];
  for (const dir of dirsToRemove) {
    removeDirRecursiveSync(path.join(globalDir, dir));
  }

  const filesToRemove = [
    'sdd.config.json', 'reasp.config.json', 'plugin.js', 'tui.js', 'rass-core.js',
    'package.json', 'package-lock.json',
  ];
  for (const file of filesToRemove) {
    const filePath = path.join(globalDir, file);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  removeDirRecursiveSync(path.join(globalDir, 'node_modules'));

  if (fs.existsSync(globalConfigPath)) {
    let config;
    try {
      config = JSON.parse(fs.readFileSync(globalConfigPath, 'utf8'));
    } catch {
      config = {};
    }

    if (config.plugin) {
      config.plugin = config.plugin.filter((p) => {
        if (typeof p === 'string') return !p.includes('rass') && !p.includes('RASS') && !p.includes('plugin.js') && !p.includes('tui.js');
        if (Array.isArray(p)) return !p[0]?.includes('rass') && !p[0]?.includes('RASS');
        return true;
      });

      if (config.plugin.length === 0) delete config.plugin;
    }

    if (config.agent) {
      const ryouAgentNames = ['ryou-orchestrator', 'ryou-efi-planner', 'ryou-efi-agent', 'planner', 'builder', 'architect', 'reviewer', 'debugger', 'documentation'];
      for (const name of ryouAgentNames) {
        delete config.agent[name];
      }
      if (Object.keys(config.agent).length === 0) delete config.agent;
    }

    if (config.default_agent === 'ryou-orchestrator') {
      delete config.default_agent;
    }

    if (config.instructions) {
      config.instructions = config.instructions.filter((i) => ![
        'rules/global-rules.md',
        'rules/meridianui.md',
        'refi/README.md',
        'refi/config.yaml',
        'refi/rules/global-rules.md',
        'refi/rules/anti-hallucination.md',
        'refi/rules/quality-gates.md',
      ].includes(i));
      if (config.instructions.length === 0) delete config.instructions;
    }

    const skillDir = path.join(globalDir, 'skills', 'refi-enterprise-feature-implementation');
    removeDirRecursiveSync(skillDir);

    fs.writeFileSync(globalConfigPath, JSON.stringify(config, null, 2), 'utf8');
  }

  return { success: true, globalDir, globalConfigPath, pathsRemoved: [globalDir] };
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOCAL INSTALL
// ═══════════════════════════════════════════════════════════════════════════════

export function installLocally(ctx = {}) {
  const sourceDir = ctx.sourceDir || SOURCE_DIR;
  const targetOpencode = path.join(process.cwd(), '.opencode');

  const { dirsToCopy, filesToCopy } = REASP_ASSETS;
  for (const dir of dirsToCopy) {
    const src = path.join(sourceDir, dir);
    const dest = path.join(targetOpencode, dir);
    if (fs.existsSync(src)) {
      copyDirRecursiveSync(src, dest);
    }
  }

  for (const file of filesToCopy) {
    const src = path.join(sourceDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(targetOpencode, file));
    }
  }

  return targetOpencode;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT — Target adapter contract
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  id,
  displayName,
  capabilities,
  detect,
  getGlobalDir,
  getGlobalConfigPath,
  isInstalled,
  install,
  uninstall,
  installLocally,
  setInstalledWorkflow,
  setInstalledModeProfile,
  syncAgentsWithModeProfile,
  resolveAgentModels,
  findOpenCodeCommand,
};
