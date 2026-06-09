/**
 * RASS Installer — TUI for global install/uninstall of the RASS OpenCode plugin.
 *
 * Usage:
 *   node installer/index.js install    — Install RASS globally into OpenCode
 *   node installer/index.js uninstall  — Uninstall RASS globally from OpenCode
 *   node installer/index.js            — Interactive mode (choose install or uninstall)
 */

import { intro, outro, spinner, select, confirm, text, note, isCancel } from '@clack/prompts';
import pc from 'picocolors';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RASS_DIR = path.resolve(__dirname, '..');
const OPENCODE_DIR = path.join(RASS_DIR, '.opencode');

// ─── Cross-platform helpers ────────────────────────────────────────────────

function getHomeDir() {
  return process.env.USERPROFILE || process.env.HOME || os.homedir();
}

function getMeridianUIPathPatterns() {
  const home = getHomeDir();
  const isWindows = process.platform === 'win32';
  const meridianDir = path.join(home, '.MeridianUI');
  // OpenCode uses glob patterns; use forward slashes for consistency
  const meridianGlob = meridianDir.replace(/\\/g, '/');
  const starPattern = `${meridianGlob}/*`;
  const starStarPattern = `${meridianGlob}/**`;
  return { starPattern, starStarPattern };
}

function getDefaultShell() {
  return process.platform === 'win32' ? 'pwsh' : 'bash';
}

/**
 * Find the opencode CLI command, trying multiple strategies.
 * Returns the command string or null if not found.
 */
function findOpenCodeCommand() {
  // 1. Try 'opencode' in PATH
  try {
    execSync('opencode --version', { stdio: 'pipe' });
    return 'opencode';
  } catch {
    // not in PATH
  }

  // 2. Try npx opencode-ai
  try {
    execSync('npx opencode-ai --version', { stdio: 'pipe' });
    return 'npx opencode-ai';
  } catch {
    // npx fallback failed
  }

  // 3. Try common install locations
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
      path.join(getHomeDir(), '.nvm', 'versions', 'node', '*', 'bin', 'opencode'),
    ];
    for (const p of unixPaths) {
      if (p.includes('*')) {
        // Handle glob-like paths (e.g., nvm versions)
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

// ─── Global install paths ──────────────────────────────────────────────────

function getGlobalOpenCodeDir() {
  const home = getHomeDir();
  // OpenCode reads global config from ~/.config/opencode/ on all platforms
  return path.join(home, '.config', 'opencode');
}

function getGlobalConfigPath() {
  return path.join(getGlobalOpenCodeDir(), 'opencode.json');
}

// ─── Core operations ───────────────────────────────────────────────────────

function copyDirRecursiveSync(source, target) {
  if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
  for (const file of fs.readdirSync(source)) {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyDirRecursiveSync(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  }
}

function removeDirRecursiveSync(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Install RASS plugin globally into OpenCode.
 * This copies the .opencode directory content into the global OpenCode config,
 * deploys Ryou agents, and registers the plugin using the opencode CLI.
 */
function installGlobally() {
  const globalDir = getGlobalOpenCodeDir();
  const globalConfigPath = getGlobalConfigPath();
  const { starPattern, starStarPattern } = getMeridianUIPathPatterns();

  // 1. Ensure global .opencode directory exists
  if (!fs.existsSync(globalDir)) {
    fs.mkdirSync(globalDir, { recursive: true });
  }

  // 2. Copy modes, profiles, phases, runtime to global .opencode
  const dirsToCopy = ['modes', 'profiles', 'phases', 'runtime'];
  for (const dir of dirsToCopy) {
    const src = path.join(OPENCODE_DIR, dir);
    const dest = path.join(globalDir, dir);
    if (fs.existsSync(src)) {
      copyDirRecursiveSync(src, dest);
    }
  }

  // 3. Copy agents and rules to global .opencode
  const contentDirs = ['agents', 'rules'];
  for (const dir of contentDirs) {
    const src = path.join(OPENCODE_DIR, dir);
    const dest = path.join(globalDir, dir);
    if (fs.existsSync(src)) {
      copyDirRecursiveSync(src, dest);
    }
  }

  // 4. Copy sdd.config.json to global
  const configSrc = path.join(OPENCODE_DIR, 'sdd.config.json');
  if (fs.existsSync(configSrc)) {
    fs.copyFileSync(configSrc, path.join(globalDir, 'sdd.config.json'));
  }

  // 5. Copy plugin files to global
  const pluginFiles = ['plugin.js', 'tui.js', 'rass-core.js'];
  for (const file of pluginFiles) {
    const src = path.join(OPENCODE_DIR, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(globalDir, file));
    }
  }

  // 6. Copy package.json to global
  const pkgSrc = path.join(OPENCODE_DIR, 'package.json');
  if (fs.existsSync(pkgSrc)) {
    fs.copyFileSync(pkgSrc, path.join(globalDir, 'package.json'));
  }

  // 7. Install npm dependencies in global dir
  try {
    execSync('npm install', { cwd: globalDir, stdio: 'pipe' });
  } catch {
    // npm install may fail if no network or npm not available; that's OK
  }

  // 8. Register plugins using opencode CLI (this is the correct way)
  // opencode plugin requires an absolute file:// URL, not a relative path
  const pluginUrl = `file:///${globalDir.replace(/\\/g, '/')}/plugin.js`;
  const tuiUrl = `file:///${globalDir.replace(/\\/g, '/')}/tui.js`;

  const opencodeCmd = findOpenCodeCommand();

  if (opencodeCmd) {
    let pluginRegistered = false;
    try {
      execSync(`${opencodeCmd} plugin "${pluginUrl}" --global --force`, { stdio: 'pipe' });
      pluginRegistered = true;
    } catch (e) {
      console.log(pc.yellow(`  Warning: opencode plugin command failed (${e.message}).`));
      console.log(pc.yellow('  Falling back to manual config registration.'));
      registerPluginManually(globalConfigPath, globalDir);
    }

    if (pluginRegistered) {
      try {
        execSync(`${opencodeCmd} plugin "${tuiUrl}" --global --force`, { stdio: 'pipe' });
      } catch (e) {
        // TUI plugin may already be registered with the server plugin
        console.log(pc.yellow(`  Warning: opencode plugin for TUI failed (${e.message}). It may already be registered.`));
      }
    }
  } else {
    console.log(pc.yellow('  Warning: opencode CLI not found in PATH or common locations.'));
    console.log(pc.gray('  Tried: opencode, npx opencode-ai, and common install directories.'));
    console.log(pc.yellow('  Falling back to manual config registration.'));
    registerPluginManually(globalConfigPath, globalDir);
  }

  // 9. Merge Ryou agents into OpenCode config
  let config = {};
  if (fs.existsSync(globalConfigPath)) {
    try {
      config = JSON.parse(fs.readFileSync(globalConfigPath, 'utf8'));
    } catch {
      config = {};
    }
  }

  // Merge Ryou agents (don't overwrite existing ones)
  if (!config.agent) config.agent = {};

  const ryouAgents = {
    'ryou-orchestrator': {
      description: 'Primary orchestrator for pragmatic .NET work using Ryou workflow and MeridianUI.',
      mode: 'primary',
      model: 'opencode-go/glm-5.1',
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
    planner: {
      description: 'Subagent for planning medium or complex work before implementation.',
      mode: 'subagent', model: 'opencode-go/glm-5.1', temperature: 0.1, steps: 14,
      prompt: '{file:./agents/planner.md}',
      permission: { read: 'allow', glob: 'allow', grep: 'allow', list: 'allow', edit: 'deny', bash: 'deny', task: 'deny',
        external_directory: { '*': 'ask', [starPattern]: 'allow', [starStarPattern]: 'allow' } },
    },
    builder: {
      description: 'Subagent for C#, .NET, EF Core, XAML, Blazor, MAUI, and MeridianUI implementation.',
      mode: 'subagent', model: 'opencode-go/kimi-k2.6', temperature: 0.2, steps: 40,
      prompt: '{file:./agents/builder.md}',
      permission: { read: 'allow', glob: 'allow', grep: 'allow', list: 'allow',
        edit: { '*': 'allow', [starPattern]: 'deny', [starStarPattern]: 'deny' },
        bash: 'allow', task: 'deny',
        external_directory: { '*': 'ask', [starPattern]: 'allow', [starStarPattern]: 'allow' } },
    },
    architect: {
      description: 'Subagent for architecture decisions, boundaries, data flow, and pragmatic design tradeoffs.',
      mode: 'subagent', model: 'opencode-go/glm-5.1', temperature: 0.1, steps: 16,
      prompt: '{file:./agents/architect.md}',
      permission: { read: 'allow', glob: 'allow', grep: 'allow', list: 'allow', edit: 'deny', bash: 'deny', task: 'deny',
        external_directory: { '*': 'ask', [starPattern]: 'allow', [starStarPattern]: 'allow' } },
    },
    reviewer: {
      description: 'Subagent for code review, regressions, maintainability, performance, and security risks.',
      mode: 'subagent', model: 'opencode-go/deepseek-v4-pro', temperature: 0.1, steps: 18,
      prompt: '{file:./agents/reviewer.md}',
      permission: { read: 'allow', glob: 'allow', grep: 'allow', list: 'allow', edit: 'deny', bash: 'allow', task: 'deny',
        external_directory: { '*': 'ask', [starPattern]: 'allow', [starStarPattern]: 'allow' } },
    },
    debugger: {
      description: 'Subagent for bug investigation, failing tests, runtime errors, EF issues, and async/concurrency problems.',
      mode: 'subagent', model: 'opencode-go/deepseek-v4-pro', temperature: 0.1, steps: 26,
      prompt: '{file:./agents/debugger.md}',
      permission: { read: 'allow', glob: 'allow', grep: 'allow', list: 'allow', edit: 'deny', bash: 'allow', task: 'deny',
        external_directory: { '*': 'ask', [starPattern]: 'allow', [starStarPattern]: 'allow' } },
    },
    documentation: {
      description: 'Subagent for concise Markdown and visual HTML implementation summaries.',
      mode: 'subagent', model: 'opencode-go/deepseek-v4-flash', temperature: 0.2, steps: 12,
      prompt: '{file:./agents/documentation.md}',
      permission: { read: 'allow', glob: 'allow', grep: 'allow', list: 'allow',
        edit: { '*': 'allow', [starPattern]: 'deny', [starStarPattern]: 'deny' },
        bash: 'deny', task: 'deny',
        external_directory: { '*': 'ask', [starPattern]: 'allow', [starStarPattern]: 'allow' } },
    },
  };

  for (const [name, agentConfig] of Object.entries(ryouAgents)) {
    if (!config.agent[name]) {
      config.agent[name] = agentConfig;
    }
  }

  // Set default_agent if not set
  if (!config.default_agent) {
    config.default_agent = 'ryou-orchestrator';
  }

  // Set model if not set
  if (!config.model) {
    config.model = 'opencode-go/kimi-k2.6';
  }
  if (!config.small_model) {
    config.small_model = 'opencode-go/deepseek-v4-flash';
  }
  if (!config.shell) {
    config.shell = getDefaultShell();
  }

  // Merge permissions (add missing skills)
  if (!config.permission) config.permission = {};
  if (!config.permission.skill) config.permission.skill = {};
  const defaultSkills = {
    'dotnet-clean-architecture': 'allow', 'aspnet-api': 'allow', efcore: 'allow',
    meridianui: 'allow', 'blazor-ui': 'allow', 'wpf-xaml': 'allow',
    'avalonia-ui': 'allow', 'maui-ui': 'allow', 'documentation-summary': 'allow',
    'debugging-workflow': 'allow', 'review-workflow': 'allow',
  };
  for (const [skill, value] of Object.entries(defaultSkills)) {
    if (config.permission.skill[skill] === undefined) {
      config.permission.skill[skill] = value;
    }
  }

  // Merge instructions (add missing ones)
  if (!config.instructions) config.instructions = [];
  const defaultInstructions = ['rules/global-rules.md', 'rules/meridianui.md'];
  for (const instruction of defaultInstructions) {
    if (!config.instructions.includes(instruction)) {
      config.instructions.push(instruction);
    }
  }

  // Merge watcher ignores (add missing ones)
  if (!config.watcher) config.watcher = {};
  if (!config.watcher.ignore) config.watcher.ignore = [];
  const defaultIgnores = ['**/.git/**', '**/.vs/**', '**/bin/**', '**/obj/**', '**/node_modules/**', '**/dist/**', '**/publish/**'];
  for (const ignore of defaultIgnores) {
    if (!config.watcher.ignore.includes(ignore)) {
      config.watcher.ignore.push(ignore);
    }
  }

  fs.writeFileSync(globalConfigPath, JSON.stringify(config, null, 2), 'utf8');

  return { globalDir, globalConfigPath };
}

/**
 * Fallback: manually register plugin entries in opencode.json
 * Used when opencode CLI is not available.
 */
function registerPluginManually(globalConfigPath, globalDir) {
  let config = {};
  const configExists = fs.existsSync(globalConfigPath);

  if (configExists) {
    try {
      config = JSON.parse(fs.readFileSync(globalConfigPath, 'utf8'));
    } catch {
      config = {};
    }
  }

  // Ensure $schema is present (OpenCode requires this)
  if (!config.$schema) {
    config.$schema = 'https://opencode.ai/schema.json';
  }

  if (!config.plugin) config.plugin = [];

  // Use absolute file:// URLs — OpenCode requires these for plugin registration
  const pluginUrl = `file:///${globalDir.replace(/\\/g, '/')}/plugin.js`;
  const tuiUrl = `file:///${globalDir.replace(/\\/g, '/')}/tui.js`;

  // Remove old RASS entries if they exist
  config.plugin = config.plugin.filter((p) => {
    if (typeof p === 'string') {
      return !p.includes('rass') && !p.includes('RASS') &&
             !p.includes('.opencode/plugin') && !p.includes('.opencode/tui') &&
             !(p.endsWith('plugin.js') && p.includes('opencode')) &&
             !(p.endsWith('tui.js') && p.includes('opencode'));
    }
    if (Array.isArray(p)) return !p[0]?.includes('rass') && !p[0]?.includes('RASS');
    return true;
  });

  config.plugin.push(pluginUrl);
  config.plugin.push(tuiUrl);

  fs.writeFileSync(globalConfigPath, JSON.stringify(config, null, 2), 'utf8');
}

/**
 * Uninstall RASS plugin globally from OpenCode.
 */
function uninstallGlobally() {
  const globalDir = getGlobalOpenCodeDir();
  const globalConfigPath = getGlobalConfigPath();

  // 1. Remove RASS directories from global .opencode
  const dirsToRemove = ['modes', 'profiles', 'phases', 'runtime', 'agents', 'rules'];
  for (const dir of dirsToRemove) {
    removeDirRecursiveSync(path.join(globalDir, dir));
  }

  // 2. Remove RASS files from global .opencode
  const filesToRemove = [
    'sdd.config.json', 'plugin.js', 'tui.js', 'rass-core.js',
    'package.json', 'package-lock.json',
  ];
  for (const file of filesToRemove) {
    const filePath = path.join(globalDir, file);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  // 3. Remove node_modules if it was created by RASS
  removeDirRecursiveSync(path.join(globalDir, 'node_modules'));

  // 4. Remove RASS plugin entries and Ryou agents from OpenCode config
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

    // Remove Ryou agents
    if (config.agent) {
      const ryouAgentNames = ['ryou-orchestrator', 'planner', 'builder', 'architect', 'reviewer', 'debugger', 'documentation'];
      for (const name of ryouAgentNames) {
        delete config.agent[name];
      }
      if (Object.keys(config.agent).length === 0) delete config.agent;
    }

    // Remove default_agent if it was set by RASS
    if (config.default_agent === 'ryou-orchestrator') {
      delete config.default_agent;
    }

    // Remove RASS-added instructions
    if (config.instructions) {
      config.instructions = config.instructions.filter((i) => i !== 'rules/global-rules.md' && i !== 'rules/meridianui.md');
      if (config.instructions.length === 0) delete config.instructions;
    }

    fs.writeFileSync(globalConfigPath, JSON.stringify(config, null, 2), 'utf8');
  }

  return { globalDir, globalConfigPath };
}

/**
 * Install RASS into the current workspace (local .opencode).
 */
function installLocally() {
  const targetOpencode = path.join(process.cwd(), '.opencode');

  // Copy RASS .opencode content to workspace .opencode
  const dirsToCopy = ['modes', 'profiles', 'phases', 'runtime'];
  for (const dir of dirsToCopy) {
    const src = path.join(OPENCODE_DIR, dir);
    const dest = path.join(targetOpencode, dir);
    if (fs.existsSync(src)) {
      copyDirRecursiveSync(src, dest);
    }
  }

  const filesToCopy = ['sdd.config.json', 'plugin.js', 'tui.js', 'rass-core.js', 'package.json'];
  for (const file of filesToCopy) {
    const src = path.join(OPENCODE_DIR, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(targetOpencode, file));
    }
  }

  return targetOpencode;
}

// ─── TUI ────────────────────────────────────────────────────────────────────

async function interactiveInstall() {
  console.clear();
  intro(pc.bgCyan(pc.black(' RASS v2.0 — Ryou Adaptive SDD System ')));

  const action = await select({
    message: 'What would you like to do?',
    options: [
      { value: 'global', label: 'Install globally', hint: 'Register RASS plugin in OpenCode for all projects' },
      { value: 'local', label: 'Install in workspace', hint: 'Copy RASS to .opencode/ in current directory' },
      { value: 'uninstall', label: 'Uninstall globally', hint: 'Remove RASS plugin from OpenCode' },
    ],
  });

  if (isCancel(action)) {
    outro(pc.yellow('Cancelled.'));
    return;
  }

  if (action === 'global') {
    const confirmed = await confirm({
      message: 'This will install RASS as a global OpenCode plugin. Continue?',
    });

    if (isCancel(confirmed) || !confirmed) {
      outro(pc.yellow('Cancelled.'));
      return;
    }

    const s = spinner();
    s.start('Installing RASS globally...');

    try {
      const { globalDir } = installGlobally();
      s.stop(pc.green('RASS installed globally.'));

      // Configure default mode and profile
      const configureNow = await confirm({
        message: 'Configure default mode and profile now?',
      });

      if (configureNow && !isCancel(configureNow)) {
        const mode = await select({
          message: 'Select default SDD mode:',
          options: [
            { value: 'ryouset', label: 'RyouSet (Recommended)', hint: 'Full pipeline — GLM-5.1 orchestrates, all 8 phases' },
            { value: 'fast', label: 'Fast', hint: 'Orchestrator → Apply → Verify' },
            { value: 'architecture', label: 'Architecture', hint: 'Full pipeline for complex systems' },
            { value: 'ui', label: 'UI', hint: 'Orchestrator → Design → Apply → Verify' },
            { value: 'debug', label: 'Debug', hint: 'Explore → Verify → Apply → Verify' },
            { value: 'enterprise', label: 'Enterprise', hint: 'Maximum robustness, all phases' },
            { value: 'legacy', label: 'Legacy', hint: 'For refactors and modernization' },
            { value: 'minimal', label: 'Minimal', hint: 'Explore → Apply only' },
          ],
        });

        const profile = await select({
          message: 'Select default SDD profile:',
          options: [
            { value: 'ryouset', label: 'RyouSet (Recommended)', hint: 'GLM-5.1 orchestrates, Kimi K2.6 builds, DeepSeek reviews' },
            { value: 'premium', label: 'Premium', hint: 'GLM-5.1 + Kimi K2.6 + DeepSeek V4 Pro' },
            { value: 'balanced', label: 'Balanced', hint: 'GLM-5.1 + Kimi K2.6 + DeepSeek V4 Flash' },
            { value: 'minimal', label: 'Minimal', hint: 'DeepSeek V4 Flash + Kimi K2.6' },
            { value: 'local', label: 'Local', hint: 'GLM-5.1 only (OpenCode Go)' },
          ],
        });

        if (!isCancel(mode) && !isCancel(profile)) {
          const runtimeDir = path.join(globalDir, 'runtime');
          if (!fs.existsSync(runtimeDir)) fs.mkdirSync(runtimeDir, { recursive: true });
          fs.writeFileSync(path.join(runtimeDir, 'current-mode.json'), JSON.stringify({ mode: mode }, null, 2));
          fs.writeFileSync(path.join(runtimeDir, 'current-profile.json'), JSON.stringify({ profile: profile }, null, 2));

          note(
            `Mode: ${mode}\nProfile: ${profile}\n\nUse /sdd-mode and /sdd-profile in OpenCode to switch at any time.`,
            'Configuration'
          );
        }
      }

      note(
        `Installed to: ${globalDir}\n\nCommands available in OpenCode:\n  /sdd-mode — Switch or create SDD modes\n  /sdd-profile — Switch or create SDD profiles\n  /rass-setup — View status, switch to RyouSet, view agents\n  /sm — Alias for /sdd-mode\n  /sp — Alias for /sdd-profile\n  /rs — Alias for /rass-setup\n\nAI tools available:\n  sdd_mode — Manage modes programmatically\n  sdd_profile — Manage profiles programmatically\n  rass_setup — View RASS status and agent info\n\nRyou agents deployed:\n  ryou-orchestrator (primary), planner, builder, architect, reviewer, debugger, documentation`,
        'RASS Installed'
      );

      outro(pc.cyan('RASS is ready. Open OpenCode and start using /sdd-mode, /sdd-profile, and /rass-setup.'));
    } catch (err) {
      s.stop(pc.red('Installation failed.'));
      outro(pc.red(err.message));
    }

  } else if (action === 'local') {
    const s = spinner();
    s.start('Installing RASS in workspace...');

    try {
      const target = installLocally();
      s.stop(pc.green('RASS installed in workspace.'));

      note(
        `Installed to: ${target}\n\nThis only affects the current project.\nFor global installation, run again and choose "Install globally".`,
        'Local Install'
      );

      outro(pc.cyan('RASS is ready in this workspace.'));
    } catch (err) {
      s.stop(pc.red('Installation failed.'));
      outro(pc.red(err.message));
    }

  } else if (action === 'uninstall') {
    const confirmed = await confirm({
      message: 'This will remove RASS from OpenCode globally. Continue?',
    });

    if (isCancel(confirmed) || !confirmed) {
      outro(pc.yellow('Cancelled.'));
      return;
    }

    const s = spinner();
    s.start('Uninstalling RASS...');

    try {
      const { globalDir } = uninstallGlobally();
      s.stop(pc.green('RASS uninstalled.'));

      note(
        `Removed from: ${globalDir}\n\nRASS plugin, modes, profiles, and runtime have been removed.\nOpenCode config has been cleaned up.`,
        'Uninstalled'
      );

      outro(pc.cyan('RASS has been removed. Restart OpenCode to apply changes.'));
    } catch (err) {
      s.stop(pc.red('Uninstall failed.'));
      outro(pc.red(err.message));
    }
  }
}

// ─── CLI ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.length > 0) {
  const command = args[0].toLowerCase();

  if (command === 'install') {
    console.log(pc.cyan('Installing RASS globally...'));
    try {
      const { globalDir } = installGlobally();
      console.log(pc.green(`RASS installed globally to: ${globalDir}`));
      console.log(pc.gray('Use /sdd-mode and /sdd-profile in OpenCode.'));
    } catch (err) {
      console.error(pc.red(`Installation failed: ${err.message}`));
      process.exit(1);
    }
  } else if (command === 'uninstall') {
    console.log(pc.cyan('Uninstalling RASS globally...'));
    try {
      const { globalDir } = uninstallGlobally();
      console.log(pc.green(`RASS uninstalled from: ${globalDir}`));
    } catch (err) {
      console.error(pc.red(`Uninstall failed: ${err.message}`));
      process.exit(1);
    }
  } else if (command === 'local') {
    console.log(pc.cyan('Installing RASS in workspace...'));
    try {
      const target = installLocally();
      console.log(pc.green(`RASS installed locally to: ${target}`));
    } catch (err) {
      console.error(pc.red(`Local install failed: ${err.message}`));
      process.exit(1);
    }
  } else {
    console.log(pc.yellow('Usage: node installer/index.js [install|uninstall|local]'));
    console.log(pc.gray('  install    — Install RASS globally into OpenCode'));
    console.log(pc.gray('  uninstall  — Uninstall RASS globally from OpenCode'));
    console.log(pc.gray('  local      — Install RASS in current workspace .opencode/'));
    console.log(pc.gray('  (no args)  — Interactive TUI mode'));
    process.exit(1);
  }
} else {
  interactiveInstall().catch(console.error);
}
