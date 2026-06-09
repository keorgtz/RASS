/**
 * RASS Server Plugin — Ryou Adaptive SDD System
 * Provides sdd_mode, sdd_profile, and rass_setup tools for AI agent interaction.
 */

import { tool } from '@opencode-ai/plugin/tool';
import {
  listModes,
  listProfiles,
  getMode,
  getProfile,
  switchMode,
  switchProfile,
  createMode,
  createProfile,
  getCurrentMode,
  getCurrentProfile,
  generateRuntime,
  getStatus,
  AVAILABLE_PHASES,
  EFFORT_LEVELS,
  AVAILABLE_MODELS,
  RYOU_AGENTS,
  RYOU_CONFIG_TEMPLATE,
  RYOU_DEPLOY_FILES,
  isRyouConfigured,
  mergeRyouAgents,
} from './rass-core.js';

export default {
  id: 'rass',
  server: async (_input) => {
    return {
      tool: {
        // ─── /sdd-mode ───────────────────────────────────────────────────
        sdd_mode: tool({
          description:
            'Manage SDD modes. List available modes, switch to a mode, create a new custom mode, or get current status. ' +
            'Modes define which phases (orchestrator, init, explore, propose, design, apply, verify, archive) are active in the SDD pipeline.',
          args: {
            action: tool.schema
              .enum(['list', 'switch', 'create', 'status'])
              .describe('Action to perform: list modes, switch to a mode, create a new mode, or get current status'),
            name: tool.schema
              .string()
              .optional()
              .describe('Mode name (required for switch and create). Available base modes: fast, architecture, ui, debug, legacy, enterprise, minimal'),
            phases: tool.schema
              .string()
              .optional()
              .describe('Comma-separated phases for create action (e.g., "orchestrator,apply,verify"). Available: orchestrator, init, explore, propose, design, apply, verify, archive'),
            description: tool.schema
              .string()
              .optional()
              .describe('Human-readable description for the new mode'),
            effort: tool.schema
              .enum(EFFORT_LEVELS)
              .optional()
              .describe('Default effort level for the mode: low (speed), medium (balanced), high (reasoning), extreme (deep analysis)'),
          },
          async execute(args, _context) {
            try {
              switch (args.action) {
                case 'list': {
                  const modes = listModes();
                  const current = getCurrentMode();
                  const lines = modes.map((m) => {
                    const active = m.id === current ? ' ← active' : '';
                    return `  **${m.id}**${active} — ${m.description || m.phases.join(' → ')}`;
                  });
                  return {
                    title: 'SDD Modes',
                    output: `Available SDD modes:\n\n${lines.join('\n')}\n\nCurrent mode: **${current || 'none'}**`,
                  };
                }

                case 'switch': {
                  if (!args.name) {
                    return {
                      title: 'Error',
                      output: `Mode name is required. Available: ${listModes().map((m) => m.id).join(', ')}`,
                    };
                  }
                  const mode = switchMode(args.name);
                  return {
                    title: `Switched to ${args.name} mode`,
                    output: `Active mode: **${mode.id}**\nDescription: ${mode.description}\nPhases: ${mode.phases.join(' → ')}\nDefault effort: ${mode.default_effort}`,
                  };
                }

                case 'create': {
                  if (!args.name) return { title: 'Error', output: 'Mode name is required for create action.' };
                  if (!args.phases) return { title: 'Error', output: `Phases are required. Available: ${AVAILABLE_PHASES.join(', ')}` };

                  const phases = args.phases.split(',').map((s) => s.trim()).filter((p) => AVAILABLE_PHASES.includes(p));
                  if (phases.length === 0) {
                    return { title: 'Error', output: `No valid phases found. Available: ${AVAILABLE_PHASES.join(', ')}` };
                  }

                  const newMode = createMode(args.name, phases, args.description || '', args.effort || 'medium');
                  switchMode(args.name);
                  return {
                    title: `Created mode: ${args.name}`,
                    output: `Mode **${newMode.id}** created and activated.\nPhases: ${phases.join(' → ')}\nEffort: ${args.effort || 'medium'}\nDescription: ${args.description || 'None'}`,
                  };
                }

                case 'status': {
                  const status = getStatus();
                  const phases = status.mode?.phases || [];
                  return {
                    title: 'SDD Status',
                    output:
                      `**Mode:** ${status.current_mode || 'none'}\n` +
                      `**Profile:** ${status.current_profile || 'none'}\n` +
                      `**Phases:** ${phases.join(' → ') || 'none'}\n` +
                      `**Default model:** ${status.profile?.default_model || 'none'}`,
                  };
                }

                default:
                  return { title: 'Error', output: `Unknown action: ${args.action}. Use: list, switch, create, status` };
              }
            } catch (err) {
              return { title: 'RASS Error', output: `Error: ${err.message}` };
            }
          },
        }),

        // ─── /sdd-profile ─────────────────────────────────────────────────
        sdd_profile: tool({
          description:
            'Manage SDD profiles. List available profiles, switch to a profile, create a new custom profile, or get current status. ' +
            'Profiles define which AI models and effort levels are used for each phase.',
          args: {
            action: tool.schema
              .enum(['list', 'switch', 'create', 'status'])
              .describe('Action to perform: list profiles, switch to a profile, create a new profile, or get current status'),
            name: tool.schema
              .string()
              .optional()
              .describe('Profile name (required for switch and create). Available base profiles: premium, balanced, minimal, local'),
            primary: tool.schema
              .string()
              .optional()
              .describe('Primary model for create action (e.g., "opencode-go/glm-5.1"). Available: opencode-go/glm-5.1, opencode-go/kimi-k2.6, opencode-go/deepseek-v4-pro, opencode-go/deepseek-v4-flash'),
            fallbacks: tool.schema
              .string()
              .optional()
              .describe('Comma-separated fallback models for create action'),
            effort: tool.schema
              .enum(EFFORT_LEVELS)
              .optional()
              .describe('Default effort level: low, medium, high, extreme'),
            description: tool.schema
              .string()
              .optional()
              .describe('Human-readable description for the new profile'),
          },
          async execute(args, _context) {
            try {
              switch (args.action) {
                case 'list': {
                  const profiles = listProfiles();
                  const current = getCurrentProfile();
                  const lines = profiles.map((p) => {
                    const active = p.id === current ? ' ← active' : '';
                    return `  **${p.id}**${active} — ${p.description || p.default?.primary || 'Custom'}`;
                  });
                  return {
                    title: 'SDD Profiles',
                    output: `Available SDD profiles:\n\n${lines.join('\n')}\n\nCurrent profile: **${current || 'none'}**`,
                  };
                }

                case 'switch': {
                  if (!args.name) {
                    return {
                      title: 'Error',
                      output: `Profile name is required. Available: ${listProfiles().map((p) => p.id).join(', ')}`,
                    };
                  }
                  const profile = switchProfile(args.name);
                  const profileInfo = listProfiles().find((p) => p.id === args.name);
                  return {
                    title: `Switched to ${args.name} profile`,
                    output: `Active profile: **${args.name}**\nDescription: ${profileInfo?.description || 'Custom'}\nDefault model: ${profile.default?.primary || 'unknown'}`,
                  };
                }

                case 'create': {
                  if (!args.name) return { title: 'Error', output: 'Profile name is required for create action.' };
                  if (!args.primary) {
                    return {
                      title: 'Error',
                      output: `Primary model is required. Available models:\n${AVAILABLE_MODELS.map((m) => `  - ${m.id}: ${m.description}`).join('\n')}`,
                    };
                  }

                  const fallbacks = args.fallbacks ? args.fallbacks.split(',').map((s) => s.trim()) : [];
                  const effort = args.effort || 'medium';

                  const profileData = createProfile(
                    args.name,
                    {
                      default: {
                        primary: args.primary,
                        effort,
                        fallbacks,
                      },
                    },
                    args.description || `Custom profile: ${args.name}`
                  );
                  switchProfile(args.name);
                  return {
                    title: `Created profile: ${args.name}`,
                    output: `Profile **${args.name}** created and activated.\nPrimary: ${args.primary}\nEffort: ${effort}\nFallbacks: ${fallbacks.join(', ') || 'none'}`,
                  };
                }

                case 'status': {
                  const status = getStatus();
                  return {
                    title: 'SDD Profile Status',
                    output:
                      `**Profile:** ${status.current_profile || 'none'}\n` +
                      `**Default model:** ${status.profile?.default_model || 'none'}\n` +
                      `**Description:** ${status.profile?.description || 'N/A'}`,
                  };
                }

                default:
                  return { title: 'Error', output: `Unknown action: ${args.action}. Use: list, switch, create, status` };
              }
            } catch (err) {
              return { title: 'RASS Error', output: `Error: ${err.message}` };
            }
          },
        }),

        // ─── /rass-setup ──────────────────────────────────────────────────
        rass_setup: tool({
          description:
            'Manage RASS setup. Check if Ryou agents are configured, deploy agents to OpenCode config, ' +
            'or show the current RASS status including mode, profile, and agent configuration.',
          args: {
            action: tool.schema
              .enum(['status', 'deploy', 'check'])
              .describe('Action: status (show full RASS status), deploy (deploy Ryou agents to OpenCode config), check (check if agents are configured)'),
          },
          async execute(args, _context) {
            try {
              switch (args.action) {
                case 'status': {
                  const status = getStatus();
                  const agents = Object.keys(RYOU_AGENTS);
                  return {
                    title: 'RASS Full Status',
                    output:
                      `**Mode:** ${status.current_mode || 'none'}\n` +
                      `**Profile:** ${status.current_profile || 'none'}\n` +
                      `**Default model:** ${status.profile?.default_model || 'none'}\n` +
                      `**Phases:** ${status.mode?.phases?.join(' → ') || 'none'}\n\n` +
                      `**Ryou Agents:** ${agents.length} configured\n` +
                      agents.map((a) => `  - ${a}: ${RYOU_AGENTS[a].description}`).join('\n'),
                  };
                }

                case 'check': {
                  return {
                    title: 'Ryou Agent Check',
                    output:
                      `Ryou agents are defined in RASS and ready to deploy.\n\n` +
                      `Available agents:\n` +
                      Object.entries(RYOU_AGENTS).map(([name, cfg]) =>
                        `  - **${name}** (${cfg.mode}): ${cfg.model} — ${cfg.description}`
                      ).join('\n') +
                      `\n\nDefault agent: **ryou-orchestrator**\n` +
                      `Default model: **${RYOU_CONFIG_TEMPLATE.model}**\n` +
                      `Small model: **${RYOU_CONFIG_TEMPLATE.small_model}**\n\n` +
                      `Use action "deploy" to install these agents into your OpenCode configuration.`,
                  };
                }

                case 'deploy': {
                  const agentList = Object.entries(RYOU_AGENTS).map(([name, cfg]) =>
                    `  - ${name} (${cfg.mode}, ${cfg.model})`
                  ).join('\n');

                  return {
                    title: 'Ryou Agents Ready for Deployment',
                    output:
                      `The following Ryou agents are configured in RASS:\n\n${agentList}\n\n` +
                      `To deploy these agents to your OpenCode configuration, run:\n` +
                      `\`\`\`\ncd installer && node index.js install\n\`\`\`\n\n` +
                      `This will:\n` +
                      `1. Copy RASS plugin files globally\n` +
                      `2. Deploy Ryou agents to your OpenCode config\n` +
                      `3. Deploy rules and agent prompts\n` +
                      `4. Set ryou-orchestrator as default agent\n` +
                      `5. Configure SDD mode "ryouset" and profile "ryouset" as defaults`,
                  };
                }

                default:
                  return { title: 'Error', output: `Unknown action: ${args.action}. Use: status, deploy, check` };
              }
            } catch (err) {
              return { title: 'RASS Error', output: `Error: ${err.message}` };
            }
          },
        }),
      },
    };
  },
};