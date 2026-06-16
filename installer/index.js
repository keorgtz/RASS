#!/usr/bin/env node

/**
 * REASP Installer — Multi-agent orchestrator.
 *
 * Refactored from the monolithic OpenCode-only installer into a thin
 * orchestrator that delegates to per-agent target adapters.
 *
 * Usage:
 *   reasp install                 Install REASP into OpenCode (legacy default)
 *   reasp install --agents a,b    Install into selected agents
 *   reasp install --only-detected Install into all detected agents
 *   reasp install --dry-run       Preview changes without writing files
 *   reasp uninstall               Uninstall REASP from OpenCode
 *   reasp uninstall --agents a,b  Uninstall from selected agents
 *   reasp detect                  Show detected AI agents
 *   reasp status                  Show REASP installation status
 *   reasp local                   Copy REASP into workspace .opencode/
 *   reasp                         Interactive TUI mode
 */

import fs from 'node:fs';
import path from 'node:path';
import { SOURCE_DIR, DEFAULT_MODEPROFILE, DEFAULT_WORKFLOW, AGENT_TARGETS, getHomeDir, REASP_CLI_VERSION } from './lib/constants.js';
import { detectAllAgents } from './lib/detect.js';
import { compileReaspBundle } from './lib/compile.js';
import { TARGETS } from './lib/targets/index.js';
import { loadReaspConfig, saveReaspConfig } from './lib/config-manager.js';
import { createSnapshot, listSnapshots, formatBytes } from './lib/snapshot-manager.js';
import cmdSnapshot from './commands/snapshot.js';
import cmdConfig from './commands/config.js';
import {
  animateBanner,
  printBannerInstant,
  printDivider,
  printHeader,
  printSuccess,
  printWarning,
  printError,
  printInfo,
  promptAgentSelection,
  promptModeProfile,
  promptWorkflowAgent,
  promptMainMenu,
  promptSnapshotSubmenu,
  promptSelectAgent,
  promptSnapshotSelection,
  promptSnapshotName,
  promptSnapshotNote,
  confirmSnapshotBeforeAction,
  confirmInstall,
  confirmUninstall,
  ProgressTracker,
  outro,
  isCancel,
  spinner,
  ICONS,
  THEME,
} from './lib/tui.js';

const REASP_STATE_DIR = path.join(getHomeDir(), '.reasp');
const LAST_SELECTION_PATH = path.join(REASP_STATE_DIR, 'last-selection.json');

// ═══════════════════════════════════════════════════════════════════════════════
// CLI PARSING
// ═══════════════════════════════════════════════════════════════════════════════

function parseArgs(argv) {
  const result = { _: [], flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('-')) {
        result.flags[key] = next;
        i++;
      } else {
        result.flags[key] = true;
      }
    } else if (arg.startsWith('-') && arg.length > 1) {
      // Support clustered short flags like -yf or single -y
      const chars = arg.slice(1).split('');
      for (const ch of chars) {
        result.flags[ch] = true;
      }
    } else {
      result._.push(arg);
    }
  }
  return result;
}

function parseAgentList(flagValue) {
  if (!flagValue || typeof flagValue !== 'string') return [];
  return flagValue.split(',').map((s) => s.trim()).filter(Boolean);
}

function showUsage() {
  printBannerInstant();
  printDivider();
  printHeader('Usage');
  console.log('  ' + THEME.warningBright('Commands:'));
  console.log('  ' + THEME.success(ICONS.sparkle + ' install') + THEME.dim('          Install REASP into selected agent(s)'));
  console.log('  ' + THEME.error(ICONS.cross + ' uninstall') + THEME.dim('        Uninstall REASP from selected agent(s)'));
  console.log('  ' + THEME.accent(ICONS.diamond + ' local') + THEME.dim('            Copy REASP to current workspace .opencode/'));
  console.log('  ' + THEME.accent(ICONS.bullet + ' snapshot') + THEME.dim('         Manage agent configuration snapshots'));
  console.log('  ' + THEME.info(ICONS.dot + ' config') + THEME.dim('           Show or update REASP configuration'));
  console.log('  ' + THEME.info(ICONS.dot + ' detect') + THEME.dim('           Show detected AI agents'));
  console.log('  ' + THEME.info(ICONS.dot + ' status') + THEME.dim('           Show REASP installation status'));
  console.log('  ' + THEME.info(ICONS.dot + ' (no args)') + THEME.dim('        Interactive TUI mode'));
  console.log('');
  console.log('  ' + THEME.warningBright('Install flags:'));
  console.log('  ' + THEME.dim('  --agents a,b,c     Comma-separated agent ids (opencode, claude-code, codex, gemini, antigravity)'));
  console.log('  ' + THEME.dim('  --only-detected    Select all currently detected agents'));
  console.log('  ' + THEME.dim('  --dry-run          Preview changes without writing files'));
  console.log('  ' + THEME.dim('  --skip-snapshot    Skip automatic pre-install snapshot'));
  console.log('  ' + THEME.dim('  -y, --yes          Skip confirmations'));
  console.log('  ' + THEME.dim('  --force            Allow installing into agents not detected'));
  console.log('');
  console.log('  ' + THEME.warningBright('Snapshot commands:'));
  console.log('  ' + THEME.dim('  reasp snapshot create  --agent <id> --name <name> [--note <text>] [--yes]'));
  console.log('  ' + THEME.dim('  reasp snapshot list    [--agent <id>] [--json]'));
  console.log('  ' + THEME.dim('  reasp snapshot restore --agent <id> --name|--id <value> [--yes]'));
  console.log('  ' + THEME.dim('  reasp snapshot delete  --agent <id> --name|--id <value> [--yes]'));
  console.log('  ' + THEME.dim('  reasp snapshot purge   --agent <id>|--all-agents [--keep <n>] [--yes]'));
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function loadLastSelection() {
  try {
    if (fs.existsSync(LAST_SELECTION_PATH)) {
      return JSON.parse(fs.readFileSync(LAST_SELECTION_PATH, 'utf8'));
    }
  } catch {
    // ignore
  }
  return [];
}

function saveLastSelection(selectedIds) {
  try {
    if (!fs.existsSync(REASP_STATE_DIR)) {
      fs.mkdirSync(REASP_STATE_DIR, { recursive: true });
    }
    fs.writeFileSync(LAST_SELECTION_PATH, JSON.stringify(selectedIds, null, 2), 'utf8');
  } catch {
    // ignore
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// INSTALL / UNINSTALL ORCHESTRATION
// ═══════════════════════════════════════════════════════════════════════════════

function buildContext(options = {}) {
  return {
    sourceDir: SOURCE_DIR,
    homeDir: getHomeDir(),
    dryRun: options.dryRun || false,
    force: options.force || false,
    yes: options.yes || false,
    verbose: options.verbose || false,
  };
}

function resolveSelectedAgents(options, detectedAgents) {
  const detectedIds = new Set(detectedAgents.filter((a) => a.installed).map((a) => a.id));

  if (options.onlyDetected) {
    return detectedAgents.filter((a) => a.installed).map((a) => a.id);
  }

  if (options.agents && options.agents.length > 0) {
    return options.agents;
  }

  // Legacy default: OpenCode only.
  return ['opencode'];
}

function validateSelectedAgents(selectedIds, detectedAgents, force, requireDetected = true, dryRun = false) {
  const detectedIds = new Set(detectedAgents.filter((a) => a.installed).map((a) => a.id));
  const unknown = selectedIds.filter((id) => !TARGETS[id]);
  const notDetected = selectedIds.filter((id) => !detectedIds.has(id));

  if (unknown.length > 0) {
    printError(`Unknown agent target(s): ${unknown.join(', ')}`);
    return false;
  }

  if (requireDetected && notDetected.length > 0 && !force && !dryRun) {
    printWarning(`The following agents were not detected: ${notDetected.join(', ')}`);
    printInfo('Use --force to install anyway, or choose from detected agents.');
    return false;
  }

  if (selectedIds.length === 0) {
    printWarning('No agents selected. Aborting.');
    return false;
  }

  return true;
}

async function runInstall(selectedIds, options = {}) {
  const ctx = buildContext(options);
  const config = loadReaspConfig(ctx);

  if (config.autoSnapshotBeforeInstall && !options.skipSnapshot) {
    const shouldSnapshot = options.yes || await confirmSnapshotBeforeAction('install');
    if (shouldSnapshot) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      for (const agentId of selectedIds) {
        const result = createSnapshot(ctx, agentId, `pre-install-${timestamp}`, 'Auto snapshot before install');
        if (result.success) {
          printSuccess(`Pre-install snapshot: ${result.metadata.name} · ${formatBytes(result.metadata.sizeBytes)}`);
        } else {
          printWarning(`Could not snapshot ${TARGETS[agentId]?.displayName || agentId}: ${result.message}`);
        }
      }
    }
  }

  const bundle = compileReaspBundle({
    workflow: options.workflow || DEFAULT_WORKFLOW,
    modeProfile: options.modeProfile || DEFAULT_MODEPROFILE,
    language: options.language || 'es-MX',
  });

  printDivider();
  printHeader('Installing REASP');

  if (ctx.dryRun) {
    printWarning('[DRY-RUN] No files will be modified.');
  }

  for (const agentId of selectedIds) {
    const target = TARGETS[agentId];
    const targetCtx = { ...ctx, globalDir: target.getGlobalDir(ctx) };

    printInfo(`${ctx.dryRun ? '[DRY-RUN] Would install' : 'Installing'} REASP into ${target.displayName}...`);

    if (agentId === 'opencode' && !ctx.dryRun) {
      const progress = new ProgressTracker();
      progress.update(0, 'Initializing...', ICONS.diamond);
      targetCtx.progress = progress;
    }

    const result = target.install(targetCtx, bundle);

    if (agentId === 'opencode' && options.workflow && !ctx.dryRun) {
      target.setInstalledWorkflow(targetCtx, options.workflow);
    }

    if (agentId === 'opencode' && options.modeProfile && !ctx.dryRun) {
      target.setInstalledModeProfile(targetCtx, options.modeProfile);
    }

    if (result.success) {
      printSuccess(result.message || `${target.displayName} ready`);
    } else {
      printWarning(result.message || `${target.displayName} installation had issues`);
    }
  }

  printDivider();
  printHeader('Summary');
  for (const agentId of selectedIds) {
    const target = TARGETS[agentId];
    console.log('  ' + THEME.success(ICONS.check + ' ' + target.displayName) + THEME.dim(ctx.dryRun ? ' (would install)' : ' (installed)'));
  }

  if (!ctx.dryRun) {
    saveLastSelection(selectedIds);
  }
}

async function runUninstall(selectedIds, options = {}) {
  const ctx = buildContext(options);
  const config = loadReaspConfig(ctx);

  if (config.autoSnapshotBeforeUninstall && !options.skipSnapshot) {
    const shouldSnapshot = options.yes || await confirmSnapshotBeforeAction('uninstall');
    if (shouldSnapshot) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      for (const agentId of selectedIds) {
        const result = createSnapshot(ctx, agentId, `pre-uninstall-${timestamp}`, 'Auto snapshot before uninstall');
        if (result.success) {
          printSuccess(`Pre-uninstall snapshot: ${result.metadata.name} · ${formatBytes(result.metadata.sizeBytes)}`);
        } else {
          printWarning(`Could not snapshot ${TARGETS[agentId]?.displayName || agentId}: ${result.message}`);
        }
      }
    }
  }

  printDivider();
  printHeader('Uninstalling REASP');

  if (ctx.dryRun) {
    printWarning('[DRY-RUN] No files will be removed.');
  }

  for (const agentId of selectedIds) {
    const target = TARGETS[agentId];
    const targetCtx = { ...ctx, globalDir: target.getGlobalDir(ctx) };

    printInfo(`${ctx.dryRun ? '[DRY-RUN] Would uninstall' : 'Uninstalling'} REASP from ${target.displayName}...`);

    const result = target.uninstall(targetCtx);
    if (result.success) {
      printSuccess(result.message || `${target.displayName} cleaned`);
    } else {
      printWarning(result.message || `${target.displayName} uninstall had issues`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMMANDS
// ═══════════════════════════════════════════════════════════════════════════════

async function cmdInstall(args, flags) {
  const detectedAgents = detectAllAgents();
  const hasExplicitSelection = !!flags.agents || !!flags['only-detected'];
  const options = {
    agents: parseAgentList(flags.agents),
    onlyDetected: !!flags['only-detected'],
    dryRun: !!flags['dry-run'],
    skipSnapshot: !!flags['skip-snapshot'] || !!flags.skipSnapshot,
    yes: !!flags.y || !!flags.yes,
    force: !!flags.force,
    modeProfile: flags.modeprofile || flags['mode-profile'] || DEFAULT_MODEPROFILE,
    workflow: flags.workflow || DEFAULT_WORKFLOW,
  };

  const selectedIds = resolveSelectedAgents(options, detectedAgents);

  // Legacy `install` without flags keeps the old OpenCode behavior and does
  // not block when OpenCode is not detected (manual fallback still works).
  if (!validateSelectedAgents(selectedIds, detectedAgents, options.force, hasExplicitSelection, options.dryRun)) {
    process.exit(1);
  }

  const selectedTargets = selectedIds.map((id) => ({ id, displayName: TARGETS[id].displayName }));

  if (!options.yes) {
    await confirmInstall(selectedTargets, false);
  }

  await runInstall(selectedIds, options);
}

async function cmdUninstall(args, flags) {
  const detectedAgents = detectAllAgents();
  const options = {
    agents: parseAgentList(flags.agents),
    dryRun: !!flags['dry-run'],
    skipSnapshot: !!flags['skip-snapshot'] || !!flags.skipSnapshot,
    yes: !!flags.y || !!flags.yes,
    force: !!flags.force,
  };

  // Default uninstall target is OpenCode.
  if (!options.agents || options.agents.length === 0) {
    options.agents = ['opencode'];
  }

  const hasExplicitSelection = !!flags.agents;

  if (!validateSelectedAgents(options.agents, detectedAgents, options.force, hasExplicitSelection, options.dryRun)) {
    process.exit(1);
  }

  const selectedTargets = options.agents.map((id) => ({ id, displayName: TARGETS[id].displayName }));

  if (!options.yes) {
    await confirmUninstall(selectedTargets, false);
  }

  await runUninstall(options.agents, options);
}

function cmdDetect() {
  printBannerInstant();
  printDivider();
  printHeader('Detected AI Agents');

  const agents = detectAllAgents();
  for (const agent of agents) {
    const icon = agent.installed ? ICONS.check : ICONS.cross;
    const status = agent.installed
      ? THEME.success(`${icon} detectado`) + (agent.version ? THEME.dim(` v${agent.version}`) : '')
      : THEME.dim(`${icon} no detectado`);
    console.log(`  ${agent.displayName.padEnd(14)} ${status}`);
  }
}

function cmdStatus() {
  printBannerInstant();
  printDivider();
  printHeader('REASP Installation Status');

  for (const [id, target] of Object.entries(TARGETS)) {
    const installed = target.isInstalled({ sourceDir: SOURCE_DIR, homeDir: getHomeDir() });
    const icon = installed ? ICONS.check : ICONS.cross;
    const status = installed ? THEME.success('installed') : THEME.dim('not installed');
    console.log(`  ${target.displayName.padEnd(16)} ${icon} ${status}`);
  }
}

async function cmdLocal() {
  printBannerInstant();
  printDivider();
  printHeader('Workspace Installation');

  const s = spinner();
  s.start(THEME.primary('  ' + ICONS.ring + ' Installing REASP in workspace...'));

  try {
    const target = opencodeTarget.installLocally({ sourceDir: SOURCE_DIR });
    s.stop(THEME.successBright('  ' + ICONS.sparkle + ' REASP installed in workspace'));

    printDivider();
    printHeader('Local Install');

    printInfo(`Installed to: ${target}`);
    printInfo('This only affects the current project and includes both RASS and REFI assets.');
    printInfo('For global installation, run: node installer/index.js install');
  } catch (err) {
    s.stop(THEME.errorBright('  ' + ICONS.cross + ' Installation failed'));
    printError(err.message);
    process.exit(1);
  }
}

async function interactiveMode() {
  await animateBanner();

  while (true) {
    const choice = await promptMainMenu();
    if (choice === 'exit' || isCancel(choice)) {
      outro(THEME.success('  ' + ICONS.check + ' Goodbye'));
      break;
    }

    switch (choice) {
      case 'install':
        await interactiveInstall();
        break;
      case 'uninstall':
        await interactiveUninstall();
        break;
      case 'snapshots':
        await interactiveSnapshots();
        break;
      case 'detect':
        cmdDetect();
        break;
      case 'status':
        cmdStatus();
        break;
    }
  }
}

async function interactiveInstall() {
  const detectedAgents = detectAllAgents();
  const lastSelection = loadLastSelection();

  const selectedIds = await promptAgentSelection(detectedAgents, lastSelection);
  if (!validateSelectedAgents(selectedIds, detectedAgents, false)) {
    return;
  }

  const selectedTargets = selectedIds.map((id) => ({ id, displayName: TARGETS[id].displayName }));
  await confirmInstall(selectedTargets, false);

  const modeProfile = await promptModeProfile();
  const workflowAgent = await promptWorkflowAgent();

  await runInstall(selectedIds, {
    modeProfile,
    workflow: workflowAgent,
    dryRun: false,
    yes: false, // Prompt for snapshot; install confirmation already obtained above.
  });
}

async function interactiveUninstall() {
  const detectedAgents = detectAllAgents();
  const selectedIds = await promptAgentSelection(detectedAgents, []);
  if (!validateSelectedAgents(selectedIds, detectedAgents, false)) {
    return;
  }

  const selectedTargets = selectedIds.map((id) => ({ id, displayName: TARGETS[id].displayName }));
  await confirmUninstall(selectedTargets, false);

  await runUninstall(selectedIds, {
    dryRun: false,
    yes: false, // Prompt for snapshot; uninstall confirmation already obtained above.
  });
}

async function interactiveSnapshots() {
  while (true) {
    const action = await promptSnapshotSubmenu();
    if (action === 'back' || isCancel(action)) break;

    const flags = {};
    if (action === 'create') {
      const detectedAgents = detectAllAgents();
      const agentId = await promptSelectAgent(detectedAgents, false);
      if (!agentId) break;

      const name = await promptSnapshotName();
      if (!name) break;

      const note = await promptSnapshotNote();

      flags.agent = agentId;
      flags.name = name;
      flags.note = note;
      flags.yes = true;
    } else if (action === 'list') {
      const detectedAgents = detectAllAgents();
      const agentId = await promptSelectAgent(detectedAgents, true);
      if (!agentId) break;

      if (agentId === 'all') {
        flags.agent = undefined;
      } else {
        flags.agent = agentId;
      }
    } else if (action === 'restore' || action === 'delete') {
      const detectedAgents = detectAllAgents();
      const agentId = await promptSelectAgent(detectedAgents, false);
      if (!agentId) break;

      const snapshots = listSnapshots({ homeDir: process.env.USERPROFILE || process.env.HOME }, agentId);
      const snapshotId = await promptSnapshotSelection(snapshots);
      if (!snapshotId) break;

      flags.agent = agentId;
      flags.id = snapshotId;
      flags.yes = true;
    }

    try {
      await cmdSnapshot([action], flags);
    } catch (err) {
      printError(err.message);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ENTRYPOINT
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  const { _: args, flags } = parseArgs(process.argv.slice(2));
  const command = (args[0] || '').toLowerCase();

  if (flags.help || flags.h) {
    showUsage();
    return;
  }

  if (flags.version || flags.v) {
    console.log(REASP_CLI_VERSION);
    return;
  }

  try {
    switch (command) {
      case 'install':
        printBannerInstant();
        await cmdInstall(args, flags);
        break;
      case 'uninstall':
        printBannerInstant();
        await cmdUninstall(args, flags);
        break;
      case 'detect':
        cmdDetect();
        break;
      case 'status':
        cmdStatus();
        break;
      case 'local':
        await cmdLocal();
        break;
      case 'snapshot':
        await cmdSnapshot(args.slice(1), flags);
        break;
      case 'config':
        await cmdConfig(args.slice(1), flags);
        break;
      case '':
        await interactiveMode();
        break;
      default:
        showUsage();
        process.exit(1);
    }
  } catch (err) {
    printError(err.message);
    if (err.stack && flags.verbose) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

main();
