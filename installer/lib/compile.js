/**
 * REASP Installer — Canonical asset compiler.
 *
 * Reads the source-of-truth assets under `.opencode/` and produces a
 * normalized bundle that every target adapter can consume.
 */

import fs from 'node:fs';
import path from 'node:path';
import { SOURCE_DIR, DEFAULT_MODEPROFILE } from './constants.js';
import { resolveAgentModels } from './targets/opencode.js';

function readFileSafe(filePath, defaultValue = '') {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8');
    }
  } catch {
    // fall through
  }
  return defaultValue;
}

function readJsonSafe(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch {
    // fall through
  }
  return null;
}

/**
 * Compile a REASP bundle for the requested workflow and ModeProfile.
 *
 * @param {object} options
 * @param {string} [options.workflow='ryou-orchestrator']
 * @param {string} [options.modeProfile=DEFAULT_MODEPROFILE]
 * @param {string} [options.language='es-MX']
 * @returns {object} Normalized REASP bundle.
 */
export function compileReaspBundle(options = {}) {
  const sourceDir = options.sourceDir || SOURCE_DIR;
  const workflow = options.workflow || 'ryou-orchestrator';
  const modeProfileName = options.modeProfile || DEFAULT_MODEPROFILE;
  const language = options.language || 'es-MX';

  const modeProfilePath = path.join(sourceDir, 'sdd-profiles', `${modeProfileName}.json`);
  const modeProfileData = readJsonSafe(modeProfilePath);

  const modelMapping = resolveAgentModels(sourceDir, modeProfileName);

  // Primary role prompt for the selected workflow.
  const rolePromptPath = path.join(sourceDir, 'agents', `${workflow}.md`);
  const rolePrompt = readFileSafe(rolePromptPath);

  // Global rules and MeridianUI rules.
  const rules = {
    global: readFileSafe(path.join(sourceDir, 'rules', 'global-rules.md')),
    meridianui: readFileSafe(path.join(sourceDir, 'rules', 'meridianui.md')),
  };

  // REFI packet configuration and rules.
  const refiConfig = {
    readme: readFileSafe(path.join(sourceDir, 'refi', 'README.md')),
    config: readFileSafe(path.join(sourceDir, 'refi', 'config.yaml')),
    globalRules: readFileSafe(path.join(sourceDir, 'refi', 'rules', 'global-rules.md')),
    antiHallucination: readFileSafe(path.join(sourceDir, 'refi', 'rules', 'anti-hallucination.md')),
    qualityGates: readFileSafe(path.join(sourceDir, 'refi', 'rules', 'quality-gates.md')),
  };

  // Phase prompts declared by the ModeProfile.
  const availablePhases = modeProfileData?.phases || [
    'orchestrator', 'init', 'explore', 'propose', 'design', 'apply', 'verify', 'archive',
  ];

  const phasePrompts = {};
  for (const phase of availablePhases) {
    const phasePath = path.join(sourceDir, 'phases', `${phase}.md`);
    phasePrompts[phase] = readFileSafe(phasePath);
  }

  // Subagent prompts for targets that need them inline.
  const agentIds = ['planner', 'builder', 'architect', 'reviewer', 'debugger', 'documentation'];
  const agentPrompts = {};
  for (const agentId of agentIds) {
    const agentPath = path.join(sourceDir, 'agents', `${agentId}.md`);
    agentPrompts[agentId] = readFileSafe(agentPath);
  }

  return {
    workflow,
    modeProfile: modeProfileName,
    language,
    sourceDir,
    modelMapping,
    rolePrompt,
    rules,
    refiConfig,
    modeProfileDescription: modeProfileData?.description || '',
    availablePhases,
    phasePrompts,
    agentPrompts,
    modeProfileData,
  };
}
