/**
 * REASP Installer — Visual system and interactive TUI prompts.
 *
 * Contains the banner, icons, theme, progress helpers, and all
 * `@clack/prompts` based interactions.
 */

import { intro, outro, spinner, select, confirm, multiselect, text, isCancel } from '@clack/prompts';
import pc from 'picocolors';
import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_MODEPROFILE, DEFAULT_WORKFLOW, AGENT_TARGETS } from './constants.js';

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

export const ICONS = {
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

export const THEME = {
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

  const frameTop = THEME.dim('        ╭' + '─'.repeat(W + 2) + '╮');
  const frameInnerTop = THEME.dim('       ╭' + ' '.repeat(W + 2) + '╮');
  const frameEmpty = THEME.dim('      │ ' + ' '.repeat(W) + ' │');
  const frameBottomInner = THEME.dim('       ╰' + ' '.repeat(W + 2) + '╰');
  const frameBottom = THEME.dim('        ╰' + '─'.repeat(W + 2) + '╯');

  lines.push(frameTop);
  lines.push(frameInnerTop);
  lines.push(frameEmpty);

  for (const artLine of RYOU_ASCII_RAW) {
    let content = artLine;
    if (content.length < W) {
      content = content + ' '.repeat(W - content.length);
    } else if (content.length > W) {
      content = content.substring(0, W);
    }
    const colored = colorizeAsciiLine(content);
    lines.push(THEME.dim('      │ ') + colored + THEME.dim(' │'));
  }

  lines.push(frameEmpty);

  const subtitle = 'REASP · RASS + REFI Unified Installer';
  let subtitleContent = subtitle;
  if (subtitleContent.length < W) {
    const padLeft = Math.floor((W - subtitleContent.length) / 2);
    const padRight = W - subtitleContent.length - padLeft;
    subtitleContent = ' '.repeat(padLeft) + subtitleContent + ' '.repeat(padRight);
  } else if (subtitleContent.length > W) {
    subtitleContent = subtitleContent.substring(0, W);
  }
  lines.push(THEME.dim('      │ ') + THEME.infoBright(subtitleContent) + THEME.dim(' │'));

  lines.push(frameEmpty);
  lines.push(frameBottomInner);
  lines.push(frameBottom);

  return lines;
}

const BANNER_COLORED = buildBannerColored();

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function animateBanner() {
  console.clear();
  for (let i = 0; i < BANNER_COLORED.length; i++) {
    process.stdout.write(BANNER_COLORED[i] + '\n');
    await sleep(60);
  }
  await sleep(200);
}

export function printBannerInstant() {
  console.clear();
  for (const line of BANNER_COLORED) {
    console.log(line);
  }
}

export function printDivider(width = 50) {
  console.log(THEME.dim('  ' + ICONS.dash.repeat(width)));
}

export function printHeader(title) {
  console.log('\n  ' + THEME.primaryBright(ICONS.diamond + ' ' + title));
  printDivider(48);
}

export function printSuccess(message) {
  console.log('  ' + THEME.successBright(ICONS.sparkle + ' ' + message));
}

export function printWarning(message) {
  console.log('  ' + THEME.warningBright(ICONS.triangle + ' ' + message));
}

export function printError(message) {
  console.log('  ' + THEME.errorBright(ICONS.circle + ' ' + message));
}

export function printInfo(message) {
  console.log('  ' + THEME.info(ICONS.dot + ' ' + message));
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

  if (process.stdout.isTTY) {
    process.stdout.write('\x1b[2A\x1b[G\x1b[J');
  }

  console.log(`${stepInfo}`);
  console.log(`  ${THEME.dim(ICONS.cornerTL)}${bar}${THEME.dim(ICONS.cornerTR)}`);
}

export class ProgressTracker {
  constructor() {
    this.percent = 0;
    this.message = 'Initializing...';
    this.icon = ICONS.diamond;
  }

  update(percent, message, icon) {
    this.percent = Math.min(Math.max(percent, 0), 100);
    if (message) this.message = message;
    if (icon) this.icon = icon;
    renderProgressBar(this.percent, this.message, this.icon);
  }

  finish(message = 'Installation complete') {
    this.update(100, message, ICONS.check);
  }
}

// ─── File counting for accurate progress ──────────────────────────────────

export function countFilesRecursive(dir) {
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

export function countTotalFilesToCopy(sourceDir, sourceDirs, sourceFiles) {
  let total = 0;
  for (const dir of sourceDirs) {
    const src = path.join(sourceDir, dir);
    if (fs.existsSync(src)) {
      total += countFilesRecursive(src);
    }
  }
  total += sourceFiles.filter((f) => fs.existsSync(path.join(sourceDir, f))).length;
  return total;
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTIVE PROMPTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Prompt the user to select one or more agent targets.
 *
 * OpenCode is pre-selected when detected. Other agents use their previous
 * selection state from `lastSelection` if available.
 *
 * @param {Array<{id:string, installed:boolean}>} detectedAgents
 * @param {string[]} [lastSelection]
 * @returns {Promise<string[]>} Selected agent ids.
 */
export async function promptAgentSelection(detectedAgents, lastSelection = []) {
  const installedIds = new Set(detectedAgents.filter((a) => a.installed).map((a) => a.id));

  const options = AGENT_TARGETS.map((target) => {
    const detected = installedIds.has(target.id);
    const label = `${target.displayName}${detected ? THEME.success('  ✓ detectado') : THEME.dim('  — no detectado')}`;
    let selected = false;
    if (target.id === 'opencode') {
      selected = detected;
    } else if (lastSelection.includes(target.id)) {
      selected = true;
    }
    return { value: target.id, label, hint: detected ? undefined : THEME.dim('seleccionar requiere --force') };
  });

  const initialValues = AGENT_TARGETS
    .filter((t) => (t.id === 'opencode' && installedIds.has(t.id)) || lastSelection.includes(t.id))
    .map((t) => t.id);

  const selected = await multiselect({
    message: THEME.primaryBright(ICONS.arrow + ' Selecciona los agentes donde instalar REASP:'),
    options,
    initialValues,
    required: true,
  });

  if (isCancel(selected)) {
    outro(THEME.warning('  ' + ICONS.triangle + ' Cancelled'));
    process.exit(0);
  }

  return selected;
}

/**
 * Prompt the user to choose the default SDD ModeProfile.
 * @returns {Promise<string>}
 */
export async function promptModeProfile() {
  const modeProfile = await select({
    message: THEME.primaryBright(ICONS.arrow + ' Select default SDD ModeProfile:'),
    options: [
      { value: 'ryougo', label: THEME.successBright(ICONS.star + ' RyouGo (Recommended)'), hint: THEME.dim('Full pipeline — OpenCode Go, all 8 phases, per-phase models') },
      { value: 'ryoukimi', label: THEME.secondaryBright(ICONS.diamond + ' RyouKimi'), hint: THEME.dim('Full pipeline — Kimi k2p7 primary, k2p6 fallback/archive') },
      { value: 'ryouminimax', label: THEME.accentBright(ICONS.bullet + ' RyouMinimax'), hint: THEME.dim('Full pipeline — MiniMax-M3 primary, MiniMax-M2.7 fallback/archive') },
      { value: 'fast', label: THEME.accentBright(ICONS.bullet + ' Fast'), hint: THEME.dim('Orchestrator → Apply → Verify, low effort') },
      { value: 'architecture', label: THEME.secondaryBright(ICONS.diamond + ' Architecture'), hint: THEME.dim('Full pipeline for complex systems, high reasoning') },
      { value: 'ui', label: THEME.primaryBright(ICONS.sparkle + ' UI'), hint: THEME.dim('Orchestrator → Design → Apply → Verify, UI-focused') },
      { value: 'debug', label: THEME.warningBright(ICONS.triangle + ' Debug'), hint: THEME.dim('Explore → Verify → Apply loop, high reasoning') },
      { value: 'enterprise', label: THEME.errorBright(ICONS.circle + ' Enterprise'), hint: THEME.dim('Maximum robustness, all phases, extreme reasoning') },
      { value: 'legacy', label: THEME.infoBright(ICONS.dot + ' Legacy'), hint: THEME.dim('For refactors and modernization') },
      { value: 'minimal', label: THEME.dim(ICONS.dash + ' Minimal'), hint: THEME.dim('Explore → Apply only, low cost') },
    ],
    initialValue: DEFAULT_MODEPROFILE,
  });

  if (isCancel(modeProfile)) {
    outro(THEME.warning('  ' + ICONS.triangle + ' Cancelled'));
    process.exit(0);
  }

  return modeProfile;
}

/**
 * Prompt the user to choose the default workflow agent.
 * @returns {Promise<string>}
 */
export async function promptWorkflowAgent() {
  const workflowAgent = await select({
    message: THEME.primaryBright(ICONS.arrow + ' Select default REASP workflow:'),
    options: [
      { value: 'ryou-efi-planner', label: THEME.secondaryBright(ICONS.diamond + ' Ryou EFI Planner'), hint: THEME.dim('Planning-first REFI workflow for enterprise feature packets') },
      { value: 'ryou-orchestrator', label: THEME.successBright(ICONS.star + ' Ryou Orchestrator'), hint: THEME.dim('Implementation-first workflow once the REFI packet is ready') },
    ],
    initialValue: DEFAULT_WORKFLOW,
  });

  if (isCancel(workflowAgent)) {
    outro(THEME.warning('  ' + ICONS.triangle + ' Cancelled'));
    process.exit(0);
  }

  return workflowAgent;
}

/**
 * Confirm the selected targets before writing any files.
 * @param {Array<{id:string, displayName:string}>} selectedAgents
 * @param {boolean} [autoConfirm]
 * @returns {Promise<boolean>}
 */
export async function confirmInstall(selectedAgents, autoConfirm = false) {
  if (autoConfirm) return true;

  const list = selectedAgents.map((a) => `    ${THEME.success(ICONS.check)} ${a.displayName}`).join('\n');
  const confirmed = await confirm({
    message: THEME.warningBright(ICONS.triangle + ` This will install REASP into:\n${list}\n\n  Continue?`),
  });

  if (isCancel(confirmed) || !confirmed) {
    outro(THEME.warning('  ' + ICONS.triangle + ' Cancelled'));
    process.exit(0);
  }

  return true;
}

/**
 * Confirm uninstallation from the selected targets.
 * @param {Array<{id:string, displayName:string}>} selectedAgents
 * @param {boolean} [autoConfirm]
 * @returns {Promise<boolean>}
 */
export async function confirmUninstall(selectedAgents, autoConfirm = false) {
  if (autoConfirm) return true;

  const list = selectedAgents.map((a) => `    ${THEME.error(ICONS.cross)} ${a.displayName}`).join('\n');
  const confirmed = await confirm({
    message: THEME.errorBright(ICONS.circle + ` This will remove REASP from:\n${list}\n\n  Continue?`),
  });

  if (isCancel(confirmed) || !confirmed) {
    outro(THEME.warning('  ' + ICONS.triangle + ' Cancelled'));
    process.exit(0);
  }

  return true;
}

/**
 * Prompt the user with the REASP main menu.
 * @returns {Promise<'install'|'uninstall'|'snapshots'|'detect'|'status'|'exit'>}
 */
export async function promptMainMenu() {
  const choice = await select({
    message: THEME.primaryBright(ICONS.diamond + ' REASP Manager'),
    options: [
      { value: 'install', label: THEME.success(ICONS.sparkle + ' Install REASP') },
      { value: 'uninstall', label: THEME.error(ICONS.cross + ' Uninstall REASP') },
      { value: 'snapshots', label: THEME.accent(ICONS.bullet + ' Snapshots') },
      { value: 'detect', label: THEME.info(ICONS.dot + ' Detect agents') },
      { value: 'status', label: THEME.info(ICONS.dot + ' Status') },
      { value: 'exit', label: THEME.dim(ICONS.dash + ' Exit') },
    ],
    initialValue: 'install',
  });

  return isCancel(choice) ? 'exit' : choice;
}

/**
 * Prompt the user with the snapshot submenu.
 * @returns {Promise<'create'|'list'|'restore'|'delete'|'back'>}
 */
export async function promptSnapshotSubmenu() {
  const choice = await select({
    message: THEME.primaryBright(ICONS.diamond + ' Snapshots'),
    options: [
      { value: 'create', label: THEME.success(ICONS.sparkle + ' Create') },
      { value: 'list', label: THEME.info(ICONS.dot + ' List') },
      { value: 'restore', label: THEME.warning(ICONS.triangle + ' Restore') },
      { value: 'delete', label: THEME.error(ICONS.cross + ' Delete') },
      { value: 'back', label: THEME.dim(ICONS.dash + ' Back') },
    ],
    initialValue: 'create',
  });

  return isCancel(choice) ? 'back' : choice;
}

/**
 * Prompt the user to select a single detected agent.
 * @param {Array<{id:string, displayName:string, installed:boolean, version:string|null}>} detectedAgents
 * @param {boolean} [allowAll]
 * @returns {Promise<string|null>} Agent id, `'all'`, or `null` if cancelled.
 */
export async function promptSelectAgent(detectedAgents, allowAll = false) {
  const installed = detectedAgents.filter((a) => a.installed);
  const options = installed.map((a) => ({
    value: a.id,
    label: `${a.displayName}${a.version ? THEME.dim(` v${a.version}`) : ''}`,
  }));

  if (allowAll) {
    options.unshift({ value: 'all', label: THEME.accentBright(ICONS.star + ' All agents') });
  }

  if (options.length === 0) {
    printWarning('No agents detected.');
    return null;
  }

  const choice = await select({
    message: THEME.primaryBright(ICONS.arrow + ' Select agent:'),
    options,
    initialValue: options[0]?.value,
  });

  return isCancel(choice) ? null : choice;
}

function formatSnapshotDate(isoString) {
  try {
    return new Date(isoString).toLocaleString();
  } catch {
    return String(isoString);
  }
}

function formatBytes(bytes) {
  const n = Number(bytes);
  if (!Number.isFinite(n) || n < 0) return '0 B';
  if (n === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.min(Math.floor(Math.log(n) / Math.log(k)), units.length - 1);
  const value = n / Math.pow(k, i);
  const formatted = Number.isInteger(value) ? value.toString() : value.toFixed(2);
  return `${formatted} ${units[i]}`;
}

/**
 * Prompt the user to select a snapshot from a list.
 * @param {Array<{id:string, name:string, createdAt:string, sizeBytes:number, fileCount:number}>} snapshots
 * @returns {Promise<string|null>} Snapshot id or `null` if cancelled.
 */
export async function promptSnapshotSelection(snapshots) {
  if (snapshots.length === 0) {
    printWarning('No snapshots available.');
    return null;
  }

  const options = snapshots.map((s) => ({
    value: s.id,
    label: `${s.name}  ${THEME.dim(`(${formatSnapshotDate(s.createdAt)})`)}`,
    hint: THEME.dim(`${s.fileCount} files · ${formatBytes(s.sizeBytes)}`),
  }));

  const choice = await select({
    message: THEME.primaryBright(ICONS.arrow + ' Select snapshot:'),
    options,
    initialValue: options[0]?.value,
  });

  return isCancel(choice) ? null : choice;
}

/**
 * Prompt for a snapshot name.
 * @returns {Promise<string|null>} Normalized name or `null` if cancelled.
 */
export async function promptSnapshotName() {
  const defaultName = `snapshot-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)}`;
  const name = await text({
    message: THEME.primaryBright(ICONS.arrow + ' Snapshot name:'),
    placeholder: defaultName,
    defaultValue: defaultName,
    validate(value) {
      if (!value || !String(value).trim()) return 'Please enter a snapshot name';
    },
  });

  return isCancel(name) ? null : String(name).trim();
}

/**
 * Prompt for an optional snapshot note.
 * @returns {Promise<string>} Note text (empty if cancelled).
 */
export async function promptSnapshotNote() {
  const note = await text({
    message: THEME.primaryBright(ICONS.arrow + ' Note (optional):'),
    placeholder: 'e.g. clean state before update',
  });

  return isCancel(note) ? '' : String(note).trim();
}

/**
 * Ask the user whether to create a snapshot before a destructive action.
 * @param {string} action
 * @returns {Promise<boolean>}
 */
export async function confirmSnapshotBeforeAction(action) {
  const confirmed = await confirm({
    message: THEME.warningBright(ICONS.triangle + ` Create a snapshot before ${action}? (recommended)`),
    initialValue: true,
  });

  return isCancel(confirmed) ? false : confirmed;
}

/**
 * Re-export clack helpers used by the orchestrator.
 */
export { intro, outro, spinner, select, confirm, text, isCancel };
