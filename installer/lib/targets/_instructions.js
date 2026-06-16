/**
 * REASP Installer — Shared helpers for instruction-file based target adapters.
 *
 * Targets that only support a single markdown instructions file (Claude Code,
 * Codex, Gemini CLI, Antigravity CLI) reuse the marker-based insertion and
 * removal logic defined here.
 */

import fs from 'node:fs';
import path from 'node:path';
import { detectAgent } from '../detect.js';

export const START_MARKER = '<!-- REASP-START -->';
export const END_MARKER = '<!-- REASP-END -->';

const WORKFLOW_DISPLAY_NAMES = {
  'ryou-orchestrator': 'Ryou Orchestrator',
  'ryou-efi-planner': 'Ryou EFI Planner',
};

const MODEL_LIST_KEYS = [
  'ryou-orchestrator',
  'ryou-efi-planner',
  'planner',
  'builder',
  'architect',
  'reviewer',
  'debugger',
  'documentation',
];

const SUBAGENT_IDS = ['planner', 'builder', 'architect', 'reviewer', 'debugger', 'documentation'];

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Read a UTF-8 text file, returning an empty string when it does not exist.
 */
export function readUtf8(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8');
    }
  } catch {
    // fall through
  }
  return '';
}

/**
 * Ensure a directory exists (unless we are in dry-run mode).
 */
export function ensureDir(dirPath, dryRun = false) {
  if (dryRun) return;
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Create a `.reasp-backup` copy the first time we touch a file.
 * Does nothing when the file is missing or a backup already exists.
 */
export function backupIfNeeded(filePath, dryRun = false) {
  const backupPath = `${filePath}.reasp-backup`;
  if (dryRun || !fs.existsSync(filePath) || fs.existsSync(backupPath)) {
    return backupPath;
  }
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

/**
 * Remove every REASP-delimited block from the given content.
 */
export function removeReaspBlocks(content) {
  const escapedStart = escapeRegex(START_MARKER);
  const escapedEnd = escapeRegex(END_MARKER);
  const regex = new RegExp(`[\\t ]*${escapedStart}[\\s\\S]*?${escapedEnd}[\\t ]*\\n?`, 'g');
  const cleaned = content.replace(regex, '');
  return cleaned.replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Return true when the target instructions file exists and contains a REASP block.
 */
export function isReaspInstalled(filePath) {
  if (!fs.existsSync(filePath)) return false;
  return fs.readFileSync(filePath, 'utf8').includes(START_MARKER);
}

/**
 * Centralized detection for instruction-file adapters.
 */
export function detectForAdapter(adapterId) {
  const found = detectAgent(adapterId);
  if (found) return found;
  return {
    id: adapterId,
    installed: false,
    version: null,
    path: null,
    detectedBy: null,
  };
}

function renderPhaseGuide(bundle) {
  const phases = bundle.availablePhases || [];
  if (phases.length === 0) return '_No phases configured._';
  return phases
    .map((phase) => {
      const prompt = bundle.phasePrompts?.[phase];
      return `### Phase: ${phase}\n\n${prompt || '_No prompt available for this phase._'}`;
    })
    .join('\n\n');
}

function renderSubagentReference(bundle) {
  return SUBAGENT_IDS.map((agentId) => {
    const prompt = bundle.agentPrompts?.[agentId];
    return `### ${agentId}\n\n${prompt || '_No prompt available._'}`;
  }).join('\n\n');
}

function renderRefiConfiguration(bundle) {
  const parts = [];
  const cfg = bundle.refiConfig || {};
  if (cfg.readme) {
    parts.push('### README\n\n' + cfg.readme);
  }
  if (cfg.config) {
    parts.push('### config.yaml\n\n```yaml\n' + cfg.config.trimEnd() + '\n```');
  }
  if (cfg.globalRules) {
    parts.push('### Global Rules\n\n' + cfg.globalRules);
  }
  if (cfg.antiHallucination) {
    parts.push('### Anti-Hallucination Rules\n\n' + cfg.antiHallucination);
  }
  if (cfg.qualityGates) {
    parts.push('### Quality Gates\n\n' + cfg.qualityGates);
  }
  return parts.join('\n\n');
}

function renderModelMapping(bundle) {
  const mapping = bundle.modelMapping || {};
  return MODEL_LIST_KEYS.map((key) => `- ${key}: ${mapping[key] || 'default'}`).join('\n');
}

/**
 * Build the canonical REASP markdown block for instruction-file targets.
 */
export function buildReaspBlock(bundle, homeDir) {
  const workflowTitle = WORKFLOW_DISPLAY_NAMES[bundle.workflow] || bundle.workflow;
  const modeProfileLine = `${bundle.modeProfile}${bundle.modeProfileDescription ? ` — ${bundle.modeProfileDescription}` : ''}`;
  const meridianPath = path.join(homeDir || '', '.MeridianUI').replace(/\\/g, '/');
  const refiSection = renderRefiConfiguration(bundle);

  const parts = [
    START_MARKER,
    '<!-- Installed by REASP installer. Do not edit this block manually. -->',
    '# REASP · Ryou Enterprise Adaptive SDD Protocol',
    '',
    '## Active Workflow',
    '',
    workflowTitle,
    '',
    '## Active ModeProfile',
    '',
    modeProfileLine,
    '',
    '## Role',
    '',
    bundle.rolePrompt || '_No role prompt configured._',
    '',
    '## Global Rules',
    '',
    bundle.rules?.global || '_No global rules configured._',
    '',
    '## MeridianUI Rules',
    '',
    bundle.rules?.meridianui || '_No MeridianUI rules configured._',
    '',
  ];

  if (refiSection) {
    parts.push('## REFI Configuration', '', refiSection, '');
  }

  parts.push(
    '## Phase Guide',
    '',
    renderPhaseGuide(bundle),
    '',
    '## Subagent Reference',
    '',
    renderSubagentReference(bundle),
    '',
    '## Model Mapping',
    '',
    renderModelMapping(bundle),
    '',
    '## Boundaries',
    '',
    '- You may read any project file.',
    `- You may edit project files except ${meridianPath}/** unless explicitly requested.`,
    '- Do not hardcode secrets.',
    '- Prefer simple, pragmatic solutions.',
    '',
    END_MARKER
  );

  return parts.join('\n');
}

/**
 * Install a REASP block into a single markdown instructions file.
 * This is the shared implementation used by Claude Code, Codex, Gemini and Antigravity.
 */
export function installInstructionsFile(ctx, bundle, filePath) {
  const dryRun = ctx?.dryRun || false;
  const homeDir = ctx?.homeDir;

  if (dryRun) {
    return {
      success: true,
      message: `[dry-run] Would write REASP block to ${filePath}`,
      pathsWritten: [filePath],
    };
  }

  ensureDir(path.dirname(filePath), dryRun);
  const existing = readUtf8(filePath);
  backupIfNeeded(filePath, dryRun);
  const cleaned = removeReaspBlocks(existing);
  const block = buildReaspBlock(bundle, homeDir);
  const newContent = cleaned ? `${cleaned}\n\n${block}` : block;

  fs.writeFileSync(filePath, newContent, 'utf8');

  return {
    success: true,
    message: `Wrote REASP instructions to ${filePath}`,
    pathsWritten: [filePath],
  };
}

/**
 * Remove a REASP block from a single markdown instructions file.
 */
export function uninstallInstructionsFile(ctx, filePath) {
  const dryRun = ctx?.dryRun || false;

  if (dryRun) {
    return {
      success: true,
      message: `[dry-run] Would remove REASP block from ${filePath}`,
      pathsRemoved: [filePath],
    };
  }

  if (!fs.existsSync(filePath)) {
    return {
      success: true,
      message: `No instructions file found at ${filePath}`,
      pathsRemoved: [],
    };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes(START_MARKER)) {
    return {
      success: true,
      message: `No REASP block found in ${filePath}`,
      pathsRemoved: [],
    };
  }

  const cleaned = removeReaspBlocks(content);
  if (!cleaned.trim()) {
    fs.unlinkSync(filePath);
    return {
      success: true,
      message: `Removed ${filePath} (only contained REASP block)`,
      pathsRemoved: [filePath],
    };
  }

  fs.writeFileSync(filePath, cleaned, 'utf8');
  return {
    success: true,
    message: `Removed REASP block from ${filePath}`,
    pathsRemoved: [filePath],
  };
}
