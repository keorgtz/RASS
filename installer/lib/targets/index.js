/**
 * REASP Installer — Target adapter registry.
 *
 * Aggregates every supported agent target so subsystems such as the
 * snapshot manager can resolve `TARGETS[agentId]` without depending on
 * the CLI entry point.
 */

import opencodeTarget from './opencode.js';
import claudeCodeTarget from './claude-code.js';
import antigravityTarget from './antigravity.js';
import geminiTarget from './gemini.js';
import codexTarget from './codex.js';

/** Map of agent id → target adapter. */
export const TARGETS = {
  opencode: opencodeTarget,
  'claude-code': claudeCodeTarget,
  antigravity: antigravityTarget,
  gemini: geminiTarget,
  codex: codexTarget,
};

/** Ordered array of supported target adapters. */
export const TARGET_LIST = Object.values(TARGETS);

export default TARGETS;
