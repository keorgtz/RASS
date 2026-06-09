/**
 * RASS Installer — Modern TUI with ASCII Art Banner
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

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL SYSTEM — Colors, Icons, Banner, Animations
// ═══════════════════════════════════════════════════════════════════════════════

const ICONS = {
  sparkle: '✦',
  diamond: '◈',
  triangle: '▲',
  circle: '◉',
  ring: '◐',
  arrow: '➤',
  star: '✶',
  bullet: '●',
  check: '✓',
  cross: '✗',
  wave: '∿',
  dot: '·',
  dash: '─',
  cornerTL: '╭',
  cornerTR: '╮',
  cornerBL: '╰',
  cornerBR: '╯',
  line: '│',
  shadow: '░',
  shadowMed: '▒',
  shadowDark: '▓',
  block: '█',
};

const THEME = {
  primary: pc.cyan,
  primaryBright: (s) => pc.bold(pc.cyan(s)),
  secondary: pc.magenta,
  secondaryBright: (s) => pc.bold(pc.magenta(s)),
  accent: pc.blue,
  accentBright: (s) => pc.bold(pc.blue(s)),
  success: pc.green,
  successBright: (s) => pc.bold(pc.green(s)),
  warning: pc.yellow,
  warningBright: (s) => pc.bold(pc.yellow(s)),
  error: pc.red,
  errorBright: (s) => pc.bold(pc.red(s)),
  info: pc.gray,
  infoBright: (s) => pc.white(s),
  dim: pc.dim,
  bgPrimary: pc.bgCyan,
  bgSecondary: pc.bgMagenta,
};

// ─── Banner ASCII Art — Modern Italic Style with Shadows ────────────────────

// ─── Elegant Cursive Banner — RASS Logo ───────────────────────────────────
// Modern italic style with subtle shadows and rounded curves

// ─── Ryou ASCII Art Banner — Elegant Cursive Style ────────────────────────

const RYOU_ASCII_RAW = [
  '           :+XXXXXXx:',
  '        xXXXXx;....;XX;',
  '      ;XXX+    +Xx  .XX+',
  '     .xXX    :XX+   ;XX+  :;    ;:     .+xx:     x.    +',
  '      .;.   +XX.   +XXx  xXX.  XXX.  xXX:.xX.  ;XX+  +XX:',
  '           xXX:.;XXXX: .XXX  :XXX  ;XX+X  xX. +XX:  xXX.',
  '         .XXXxxXXx:   .XXx  xXXX: ;XX+.xX+X;:XXX: .XXX.  x;',
  '        +XXX: ;XX.    xXX.:X:XX::XXXX  .XXXxxXX+ xXXX; +X.',
  '    :XXXXXX.  :XXX   .XXXX:.XXXX:.XXXXXXX.  xXXXX.xXXXX:',
  '    .;XXX:    .xXXx  .::  XXX;    .:+;:     :+;   :+;',
  '               :XXXXxxxX+;XX:',
  '               .:xXXXXX ;XX',
  '                  . .+XX+.',
];

// All lines must have exactly the same visual width
const BANNER_CONTENT_WIDTH = 60;

function colorizeAsciiLine(line) {
  let result = '';
  for (const ch of line) {
    if (ch === ' ') {
      result += ch;
    } else if ('X'.includes(ch)) {
      result += THEME.primaryBright(ch);
    } else if ('x+;'.includes(ch)) {
      result += THEME.primary(ch);
    } else if (':,.'.includes(ch)) {
      result += THEME.dim(pc.cyan(ch));
    } else {
      result += THEME.primary(ch);
    }
  }
  return result;
}

function buildBannerColored() {
  const lines = [];
  const W = BANNER_CONTENT_WIDTH;
  
  // Helper to build frame lines with exact width
  const frameTop = THEME.dim('        ╭' + '─'.repeat(W + 2) + '╮');
  const frameInnerTop = THEME.dim('       ╭' + ' '.repeat(W + 2) + '╮');
  const frameEmpty = THEME.dim('      │ ' + ' '.repeat(W) + ' │');
  const frameBottomInner = THEME.dim('       ╰' + ' '.repeat(W + 2) + '╰');
  const frameBottom = THEME.dim('        ╰' + '─'.repeat(W + 2) + '╯');
  
  // Top frame
  lines.push(frameTop);
  lines.push(frameInnerTop);
  lines.push(frameEmpty);
  
  // ASCII art lines
  for (const artLine of RYOU_ASCII_RAW) {
    // Ensure exact width by padding/truncating
    let content = artLine;
    if (content.length < W) {
      content = content + ' '.repeat(W - content.length);
    } else if (content.length > W) {
      content = content.substring(0, W);
    }
    const colored = colorizeAsciiLine(content);
    lines.push(THEME.dim('      │ ') + colored + THEME.dim(' │'));
  }
  
  // Empty line
  lines.push(frameEmpty);
  
  // Subtitle
  const subtitle = 'Ryou Adaptive SDD System v3.0';
  let subtitleContent = subtitle;
  if (subtitleContent.length < W) {
    const padLeft = Math.floor((W - subtitleContent.length) / 2);
    const padRight = W - subtitleContent.length - padLeft;
    subtitleContent = ' '.repeat(padLeft) + subtitleContent + ' '.repeat(padRight);
  } else if (subtitleContent.length > W) {
    subtitleContent = subtitleContent.substring(0, W);
  }
  lines.push(THEME.dim('      │ ') + THEME.infoBright(subtitleContent) + THEME.dim(' │'));
  
  // Empty line
  lines.push(frameEmpty);
  
  // Bottom frame
  lines.push(frameBottomInner);
  lines.push(frameBottom);
  
  return lines;
}

const BANNER_COLORED = buildBannerColored();

// ─── Animation: Line-by-line reveal ───────────────────────────────────────

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function animateBanner() {
  console.clear();
  for (let i = 0; i < BANNER_COLORED.length; i++) {
    process.stdout.write(BANNER_COLORED[i] + '\n');
    await sleep(60);
  }
  await sleep(200);
}

function printBannerInstant() {
  console.clear();
  for (const line of BANNER_COLORED) {
    console.log(line);
  }
}

// ─── Decorative helpers ─────────────────────────────────────────────────────

function printDivider(width = 50) {
  console.log(THEME.dim('  ' + ICONS.dash.repeat(width)));
}

function printHeader(title) {
  console.log('\n  ' + THEME.primaryBright(ICONS.diamond + ' ' + title));
  printDivider(48);
}

function printSuccess(message) {
  console.log('  ' + THEME.successBright(ICONS.sparkle + ' ' + message));
}

function printWarning(message) {
  console.log('  ' + THEME.warningBright(ICONS.triangle + ' ' + message));
}

// ─── Progress Bar System — Granular 0-100% ────────────────────────────────

function renderProgressBar(percent, message, icon = ICONS.ring) {
  const width = 40;
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;

  const barFilled = THEME.primary(ICONS.block.repeat(filled));
  const barEmpty = THEME.dim(ICONS.shadow.repeat(empty));
  const bar = barFilled + barEmpty;

  const stepInfo = `  ${THEME.infoBright(`${percent}%`)} ${THEME.dim(ICONS.line)} ${THEME.accentBright(icon + ' ' + message)}`;

  // Clear previous lines if TTY
  if (process.stdout.isTTY) {
    process.stdout.write('\x1b[2A\x1b[G\x1b[J');
  }

  console.log(`${stepInfo}`);
  console.log(`  ${THEME.dim(ICONS.cornerTL)}${bar}${THEME.dim(ICONS.cornerTR)}`);
}

class ProgressTracker {
  constructor() {
    this.percent = 0;
    this.message = 'Initializing...';
    this.icon = ICONS.diamond;
  }

  update(percent, message, icon) {
    this.percent = Math.min(Math.max(percent, 0), 100);
    if (message) this.message = message;
    if (icon) this.icon = icon;
    // Render immediately — no throttle to ensure all progress updates are visible
    renderProgressBar(this.percent, this.message, this.icon);
  }

  finish(message = 'Installation complete') {
    this.update(100, message, ICONS.check);
  }
}

// ─── File counting for accurate progress ──────────────────────────────────

function countFilesRecursive(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  try {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.lstatSync(fullPath);
      if (stat.isDirectory()) {
        count += countFilesRecursive(fullPath);
      } else {
        count += 1;
      }
    }
  } catch {
    // Ignore permission errors
  }
  return count;
}

function countTotalFilesToCopy(sourceDirs, sourceFiles) {
  let total = 0;
  for (const dir of sourceDirs) {
    const src = path.join(OPENCODE_DIR, dir);
    if (fs.existsSync(src)) {
      total += countFilesRecursive(src);
    }
  }
  total += sourceFiles.filter((f) => fs.existsSync(path.join(OPENCODE_DIR, f))).length;
  return total;
}

function printError(message) {
  console.log('  ' + THEME.errorBright(ICONS.circle + ' ' + message));
}

function printInfo(message) {
  console.log('  ' + THEME.info(ICONS.dot + ' ' + message));
}

// ═══════════════════════════════════════════════════════════════════════════════
// CROSS-PLATFORM HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function getHomeDir() {
  return process.env.USERPROFILE || process.env.HOME || os.homedir();
}

function getMeridianUIPathPatterns() {
  const home = getHomeDir();
  const isWindows = process.platform === 'win32';
  const meridianDir = path.join(home, '.MeridianUI');
  const meridianGlob = meridianDir.replace(/\\/g, '/');
  const starPattern = `${meridianGlob}/*`;
  const starStarPattern = `${meridianGlob}/**`;
  return { starPattern, starStarPattern };
}

function getDefaultShell() {
  return process.platform === 'win32' ? 'pwsh' : 'bash';
}

function findOpenCodeCommand() {
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

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL INSTALL PATHS
// ═══════════════════════════════════════════════════════════════════════════════

function getGlobalOpenCodeDir() {
  const home = getHomeDir();
  return path.join(home, '.config', 'opencode');
}

function getGlobalConfigPath() {
  return path.join(getGlobalOpenCodeDir(), 'opencode.json');
}

// ═══════════════════════════════════════════════════════════════════════════════
// CORE OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

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

function removeDirRecursiveSync(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODEPROFILE AGENT RESOLUTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Read a ModeProfile and resolve agent models from its phase configuration.
 * @param {string} modeProfileName - e.g., 'ryouset', 'fast'
 * @returns {object} Map of agent names to model IDs
 */
function resolveAgentModels(modeProfileName) {
  const mpPath = path.join(OPENCODE_DIR, 'sdd-profiles', `${modeProfileName}.json`);
  let mp = null;
  if (fs.existsSync(mpPath)) {
    try {
      mp = JSON.parse(fs.readFileSync(mpPath, 'utf8'));
    } catch {
      mp = null;
    }
  }

  // Fallback defaults (legacy hardcoded values)
  const defaults = {
    'ryou-orchestrator': 'opencode-go/glm-5.1',
    planner: 'opencode-go/glm-5.1',
    builder: 'opencode-go/kimi-k2.6',
    architect: 'opencode-go/glm-5.1',
    reviewer: 'opencode-go/deepseek-v4-pro',
    debugger: 'opencode-go/deepseek-v4-pro',
    documentation: 'opencode-go/deepseek-v4-flash',
  };

  if (!mp) return defaults;

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
  const models = { ...defaults };

  for (const [phase, agentName] of Object.entries(phaseToAgent)) {
    const phaseConfig = mp[phase] || defaultConfig;
    if (phaseConfig?.primary) {
      models[agentName] = phaseConfig.primary;
    }
  }

  // Debugger uses the same model as reviewer (verify phase)
  const verifyConfig = mp.verify || defaultConfig;
  if (verifyConfig?.primary) {
    models.debugger = verifyConfig.primary;
  }

  return models;
}

/**
 * Synchronize agent models in opencode.json with a ModeProfile configuration.
 * @param {string} modeProfileName
 * @param {string} globalConfigPath
 * @returns {boolean}
 */
function syncAgentsWithModeProfile(modeProfileName, globalConfigPath) {
  const agentModels = resolveAgentModels(modeProfileName);

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
// INSTALL GLOBALLY
// ═══════════════════════════════════════════════════════════════════════════════

function installGlobally(modeProfileName = 'ryouset', progress = null) {
  const globalDir = getGlobalOpenCodeDir();
  const globalConfigPath = getGlobalConfigPath();
  const { starPattern, starStarPattern } = getMeridianUIPathPatterns();
  const agentModels = resolveAgentModels(modeProfileName);

  // ── Phase definitions with start/end percentages ──
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
    
    // Execute the work
    workFn();
    
    // Ensure we reach the end of this phase
    currentPercent = phase.end;
    reportProgress(currentPercent, phase.msg + '...', phase.icon);
  }

  // Phase 1: Init (0-5%)
  runPhase('init', () => {
    if (!fs.existsSync(globalDir)) {
      fs.mkdirSync(globalDir, { recursive: true });
    }
  });

  // Count total files for accurate copy progress
  const dirsToCopy = ['sdd-profiles', 'phases', 'runtime', 'agents', 'rules'];
  const filesToCopy = ['sdd.config.json', 'plugin.js', 'tui.js', 'rass-core.js', 'package.json'];
  const totalFiles = countTotalFilesToCopy(dirsToCopy, filesToCopy);
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

  // Phase 2: Copy directories (5-35%)
  runPhase('copyDirs', () => {
    for (const dir of dirsToCopy) {
      const src = path.join(OPENCODE_DIR, dir);
      const dest = path.join(globalDir, dir);
      if (fs.existsSync(src)) {
        copyDirRecursiveSync(src, dest, onFileCopied);
      }
    }
  });

  // Phase 3: Copy individual files (35-45%)
  runPhase('copyFiles', () => {
    for (const file of filesToCopy) {
      const src = path.join(OPENCODE_DIR, file);
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

  // Phase 4: npm install (45-70%)
  // Note: execSync blocks the event loop, so we show start/end progress only
  let npmInstalled = false;
  
  if (progress) {
    // Show start of npm phase
    currentPercent = PHASES.npm.start;
    reportProgress(currentPercent, 'Installing npm dependencies...', ICONS.ring);
  }

  try {
    execSync('npm install', { cwd: globalDir, stdio: 'pipe' });
    npmInstalled = true;
  } catch (e) {
    const stderr = e.stderr || '';
    printWarning('npm install failed in global dir');
    if (stderr.trim()) printInfo(stderr.trim().split('\n').pop());
    printInfo('Plugin registration may fail without dependencies');
  }

  if (progress) {
    // Show end of npm phase
    currentPercent = PHASES.npm.end;
    reportProgress(currentPercent, 'npm dependencies installed', ICONS.ring);
  }

  // Phase 5: Register plugins (70-85%)
  const pluginUrl = `file:///${globalDir.replace(/\\/g, '/')}/plugin.js`;
  const tuiUrl = `file:///${globalDir.replace(/\\/g, '/')}/tui.js`;
  const opencodeCmd = findOpenCodeCommand();

  runPhase('register', () => {
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

  // Phase 6: Configure agents (85-98%)
  let config = {};
  if (fs.existsSync(globalConfigPath)) {
    try {
      config = JSON.parse(fs.readFileSync(globalConfigPath, 'utf8'));
    } catch {
      config = {};
    }
  }

  if (!config.agent) config.agent = {};

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
    // Update progress per agent smoothly
    if (progress) {
      const agentProgress = ((i + 1) / agentNames.length) * agentRange;
      currentPercent = PHASES.agents.start + agentProgress;
      reportProgress(currentPercent, `Configuring agent: ${name}`, ICONS.star);
    }
  }

  if (!config.default_agent) {
    config.default_agent = 'ryou-orchestrator';
  }
  if (!config.model) {
    config.model = 'opencode-go/kimi-k2.6';
  }
  if (!config.small_model) {
    config.small_model = 'opencode-go/deepseek-v4-flash';
  }
  if (!config.shell) {
    config.shell = getDefaultShell();
  }

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

  if (!config.instructions) config.instructions = [];
  const defaultInstructions = ['rules/global-rules.md', 'rules/meridianui.md'];
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

  fs.writeFileSync(globalConfigPath, JSON.stringify(config, null, 2), 'utf8');

  // Phase 7: Finalize (98-100%)
  currentPercent = 100;
  if (progress) {
    progress.finish('Installation complete');
  }

  return { globalDir, globalConfigPath };
}

// ═══════════════════════════════════════════════════════════════════════════════
// FALLBACK: MANUAL PLUGIN REGISTRATION
// ═══════════════════════════════════════════════════════════════════════════════

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

  if (!config.$schema) {
    config.$schema = 'https://opencode.ai/schema.json';
  }

  if (!config.plugin) config.plugin = [];

  const pluginUrl = `file:///${globalDir.replace(/\\/g, '/')}/plugin.js`;
  const tuiUrl = `file:///${globalDir.replace(/\\/g, '/')}/tui.js`;

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

// ═══════════════════════════════════════════════════════════════════════════════
// UNINSTALL GLOBALLY
// ═══════════════════════════════════════════════════════════════════════════════

function uninstallGlobally() {
  const globalDir = getGlobalOpenCodeDir();
  const globalConfigPath = getGlobalConfigPath();

  const dirsToRemove = ['sdd-profiles', 'phases', 'runtime', 'agents', 'rules'];
  for (const dir of dirsToRemove) {
    removeDirRecursiveSync(path.join(globalDir, dir));
  }

  const filesToRemove = [
    'sdd.config.json', 'plugin.js', 'tui.js', 'rass-core.js',
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
      const ryouAgentNames = ['ryou-orchestrator', 'planner', 'builder', 'architect', 'reviewer', 'debugger', 'documentation'];
      for (const name of ryouAgentNames) {
        delete config.agent[name];
      }
      if (Object.keys(config.agent).length === 0) delete config.agent;
    }

    if (config.default_agent === 'ryou-orchestrator') {
      delete config.default_agent;
    }

    if (config.instructions) {
      config.instructions = config.instructions.filter((i) => i !== 'rules/global-rules.md' && i !== 'rules/meridianui.md');
      if (config.instructions.length === 0) delete config.instructions;
    }

    fs.writeFileSync(globalConfigPath, JSON.stringify(config, null, 2), 'utf8');
  }

  return { globalDir, globalConfigPath };
}

// ═══════════════════════════════════════════════════════════════════════════════
// INSTALL LOCALLY
// ═══════════════════════════════════════════════════════════════════════════════

function installLocally() {
  const targetOpencode = path.join(process.cwd(), '.opencode');

  const dirsToCopy = ['sdd-profiles', 'phases', 'runtime'];
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

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTIVE TUI — REDESIGNED WITH VISUAL SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

async function interactiveInstall() {
  // Animate banner on entry
  await animateBanner();

  const action = await select({
    message: THEME.primaryBright(ICONS.arrow + ' What would you like to do?'),
    options: [
      { value: 'global', label: THEME.successBright(ICONS.sparkle + ' Install globally'), hint: THEME.dim('Register RASS plugin in OpenCode for all projects') },
      { value: 'local', label: THEME.accentBright(ICONS.diamond + ' Install in workspace'), hint: THEME.dim('Copy RASS to .opencode/ in current directory') },
      { value: 'uninstall', label: THEME.errorBright(ICONS.cross + ' Uninstall globally'), hint: THEME.dim('Remove RASS plugin from OpenCode') },
    ],
  });

  if (isCancel(action)) {
    outro(THEME.warning('  ' + ICONS.triangle + ' Cancelled'));
    return;
  }

  if (action === 'global') {
    const confirmed = await confirm({
      message: THEME.warningBright(ICONS.triangle + ' This will install RASS as a global OpenCode plugin. Continue?'),
    });

    if (isCancel(confirmed) || !confirmed) {
      outro(THEME.warning('  ' + ICONS.triangle + ' Cancelled'));
      return;
    }

    console.log('\n  ' + THEME.primaryBright(ICONS.ring + ' Installing RASS globally...'));
    console.log('');

    const progress = new ProgressTracker();
    progress.update(0, 'Initializing...', ICONS.diamond); // Initialize display

    try {
      const { globalDir } = installGlobally('ryouset', progress);
      console.log('\n  ' + THEME.successBright(ICONS.sparkle + ' RASS installed globally'));

      printDivider();
      printHeader('Configuration');

      const configureNow = await confirm({
        message: THEME.infoBright(ICONS.diamond + ' Configure default ModeProfile now?'),
      });

      if (configureNow && !isCancel(configureNow)) {
        printDivider();
        printHeader('Select ModeProfile');

        const modeProfile = await select({
          message: THEME.primaryBright(ICONS.arrow + ' Select default SDD ModeProfile:'),
          options: [
            { value: 'ryouset', label: THEME.successBright(ICONS.star + ' RyouSet (Recommended)'), hint: THEME.dim('Full pipeline — GLM-5.1 orchestrates, all 8 phases, per-phase models') },
            { value: 'fast', label: THEME.accentBright(ICONS.bullet + ' Fast'), hint: THEME.dim('Orchestrator → Apply → Verify, low effort') },
            { value: 'architecture', label: THEME.secondaryBright(ICONS.diamond + ' Architecture'), hint: THEME.dim('Full pipeline for complex systems, high reasoning') },
            { value: 'ui', label: THEME.primaryBright(ICONS.sparkle + ' UI'), hint: THEME.dim('Orchestrator → Design → Apply → Verify, UI-focused') },
            { value: 'debug', label: THEME.warningBright(ICONS.triangle + ' Debug'), hint: THEME.dim('Explore → Verify → Apply loop, high reasoning') },
            { value: 'enterprise', label: THEME.errorBright(ICONS.circle + ' Enterprise'), hint: THEME.dim('Maximum robustness, all phases, extreme reasoning') },
            { value: 'legacy', label: THEME.infoBright(ICONS.dot + ' Legacy'), hint: THEME.dim('For refactors and modernization') },
            { value: 'minimal', label: THEME.dim(ICONS.dash + ' Minimal'), hint: THEME.dim('Explore → Apply only, low cost') },
          ],
        });

        if (!isCancel(modeProfile)) {
          const runtimeDir = path.join(globalDir, 'runtime');
          if (!fs.existsSync(runtimeDir)) fs.mkdirSync(runtimeDir, { recursive: true });
          fs.writeFileSync(path.join(runtimeDir, 'current-modeprofile.json'), JSON.stringify({ modeprofile: modeProfile }, null, 2));

          // Synchronize agent models with the selected ModeProfile
          const globalConfigPath = getGlobalConfigPath();
          const syncResult = syncAgentsWithModeProfile(modeProfile, globalConfigPath);
          if (syncResult) {
            printSuccess(`Agent models synchronized with ${modeProfile} ModeProfile`);
          }

          printSuccess(`ModeProfile set to: ${modeProfile}`);
          printInfo('Use /sdd in OpenCode to switch ModeProfiles at any time');
        }
      }

      printDivider();
      printHeader('RASS Installed');

      note(
        THEME.infoBright('Installed to:') + ' ' + THEME.primary(globalDir) + '\n\n' +
        THEME.secondaryBright('Commands available in OpenCode:') + '\n' +
        '  ' + THEME.success('/sdd') + THEME.dim(' — Switch or create SDD ModeProfiles') + '\n' +
        '  ' + THEME.success('/sdd-mode') + THEME.dim(' — Alias for /sdd (backward compatible)') + '\n' +
        '  ' + THEME.success('/sdd-profile') + THEME.dim(' — Alias for /sdd (backward compatible)') + '\n' +
        '  ' + THEME.success('/rass-setup') + THEME.dim(' — View status, switch to RyouSet, view agents') + '\n' +
        '  ' + THEME.success('/s') + THEME.dim(' — Alias for /sdd') + '\n' +
        '  ' + THEME.success('/rs') + THEME.dim(' — Alias for /rass-setup') + '\n\n' +
        THEME.secondaryBright('AI tools available:') + '\n' +
        '  ' + THEME.accent('sdd_mode_profile') + THEME.dim(' — Manage ModeProfiles programmatically') + '\n' +
        '  ' + THEME.accent('rass_setup') + THEME.dim(' — View RASS status and agent info') + '\n\n' +
        THEME.secondaryBright('Ryou agents deployed:') + '\n' +
        '  ' + THEME.primary('ryou-orchestrator') + THEME.dim(' (primary)') + ', ' +
        THEME.info('planner') + ', ' + THEME.info('builder') + ', ' + THEME.info('architect') + ', ' +
        THEME.info('reviewer') + ', ' + THEME.info('debugger') + ', ' + THEME.info('documentation'),
        THEME.successBright(ICONS.sparkle + ' Installation Complete')
      );

      outro(THEME.successBright('  ' + ICONS.sparkle + ' RASS is ready. Open OpenCode and start using /sdd and /rass-setup'));
    } catch (err) {
      s.stop(THEME.errorBright('  ' + ICONS.cross + ' Installation failed'));
      outro(THEME.errorBright('  ' + ICONS.circle + ' ' + err.message));
    }

  } else if (action === 'local') {
    const s = spinner();
    s.start(THEME.primary('  ' + ICONS.ring + ' Installing RASS in workspace...'));

    try {
      const target = installLocally();
      s.stop(THEME.successBright('  ' + ICONS.sparkle + ' RASS installed in workspace'));

      printDivider();
      printHeader('Local Install');

      note(
        THEME.infoBright('Installed to:') + ' ' + THEME.primary(target) + '\n\n' +
        'This only affects the current project.\n' +
        'For global installation, run again and choose ' + THEME.successBright('"Install globally"'),
        THEME.successBright(ICONS.sparkle + ' Workspace Ready')
      );

      outro(THEME.successBright('  ' + ICONS.sparkle + ' RASS is ready in this workspace'));
    } catch (err) {
      s.stop(THEME.errorBright('  ' + ICONS.cross + ' Installation failed'));
      outro(THEME.errorBright('  ' + ICONS.circle + ' ' + err.message));
    }

  } else if (action === 'uninstall') {
    const confirmed = await confirm({
      message: THEME.errorBright(ICONS.circle + ' This will remove RASS from OpenCode globally. Continue?'),
    });

    if (isCancel(confirmed) || !confirmed) {
      outro(THEME.warning('  ' + ICONS.triangle + ' Cancelled'));
      return;
    }

    const s = spinner();
    s.start(THEME.error('  ' + ICONS.ring + ' Uninstalling RASS...'));

    try {
      const { globalDir } = uninstallGlobally();
      s.stop(THEME.successBright('  ' + ICONS.sparkle + ' RASS uninstalled'));

      printDivider();
      printHeader('Uninstalled');

      note(
        THEME.infoBright('Removed from:') + ' ' + THEME.primary(globalDir) + '\n\n' +
        'RASS plugin, sdd-profiles, and runtime have been removed.\n' +
        'OpenCode config has been cleaned up.',
        THEME.warningBright(ICONS.triangle + ' RASS Removed')
      );

      outro(THEME.warningBright('  ' + ICONS.triangle + ' RASS has been removed. Restart OpenCode to apply changes'));
    } catch (err) {
      s.stop(THEME.errorBright('  ' + ICONS.cross + ' Uninstall failed'));
      outro(THEME.errorBright('  ' + ICONS.circle + ' ' + err.message));
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLI MODE — REDESIGNED WITH VISUAL SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

const args = process.argv.slice(2);

if (args.length > 0) {
  const command = args[0].toLowerCase();

  if (command === 'install') {
    printBannerInstant();
    printDivider();
    printHeader('Global Installation');
    printInfo('Installing RASS globally...');

    try {
      const { globalDir } = installGlobally();
      printSuccess(`RASS installed globally to: ${globalDir}`);
      printInfo('Use /sdd in OpenCode');
    } catch (err) {
      printError(`Installation failed: ${err.message}`);
      process.exit(1);
    }
  } else if (command === 'uninstall') {
    printBannerInstant();
    printDivider();
    printHeader('Global Uninstallation');
    printInfo('Uninstalling RASS globally...');

    try {
      const { globalDir } = uninstallGlobally();
      printSuccess(`RASS uninstalled from: ${globalDir}`);
    } catch (err) {
      printError(`Uninstall failed: ${err.message}`);
      process.exit(1);
    }
  } else if (command === 'local') {
    printBannerInstant();
    printDivider();
    printHeader('Workspace Installation');
    printInfo('Installing RASS in workspace...');

    try {
      const target = installLocally();
      printSuccess(`RASS installed locally to: ${target}`);
    } catch (err) {
      printError(`Local install failed: ${err.message}`);
      process.exit(1);
    }
  } else {
    printBannerInstant();
    printDivider();
    printHeader('Usage');
    console.log('  ' + THEME.warningBright('Usage:') + ' node installer/index.js [install|uninstall|local]');
    console.log('  ' + THEME.success(ICONS.sparkle + ' install') + THEME.dim('    — Install RASS globally into OpenCode'));
    console.log('  ' + THEME.error(ICONS.cross + ' uninstall') + THEME.dim('  — Uninstall RASS globally from OpenCode'));
    console.log('  ' + THEME.accent(ICONS.diamond + ' local') + THEME.dim('      — Install RASS in current workspace .opencode/'));
    console.log('  ' + THEME.info(ICONS.dot + ' (no args)') + THEME.dim('  — Interactive TUI mode'));
    process.exit(1);
  }
} else {
  interactiveInstall().catch((err) => {
    printError(err.message);
    process.exit(1);
  });
}
