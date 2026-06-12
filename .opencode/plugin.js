/**
 * RASS Server Plugin — Ryou Adaptive SDD System
 * Provides sdd_mode_profile and rass_setup tools for AI agent interaction.
 */

import { tool } from '@opencode-ai/plugin/tool';
import {
  listModeProfiles,
  getModeProfile,
  switchModeProfile,
  createModeProfile,
  getCurrentModeProfile,
  generateRuntime,
  getStatus,
  getReaspStatus,
  setPrimaryWorkflow,
  setFeatureEnabled,
  getReaspConfig,
  REASP_PRIMARY_AGENTS,
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
        // ─── /sdd-mode-profile ───────────────────────────────────────────
        sdd_mode_profile: tool({
          description:
            'Manage unified SDD ModeProfiles. List, switch, create, edit, or get status. ' +
            'A ModeProfile combines phases (what steps run) with model routing (which AI model each phase uses).',
          args: {
            action: tool.schema
              .enum(['list', 'switch', 'create', 'status'])
              .describe('Action: list modeprofiles, switch to one, create new, or get current status'),
            name: tool.schema
              .string()
              .optional()
              .describe('ModeProfile name (required for switch and create). Available base modeprofiles: ryouset, fast, architecture, ui, debug, enterprise, legacy, minimal'),
            phases: tool.schema
              .string()
              .optional()
              .describe('Comma-separated phases for create (e.g., "orchestrator,apply,verify"). Available: orchestrator, init, explore, propose, design, apply, verify, archive'),
            model_strategy: tool.schema
              .enum(['single', 'per-phase'])
              .optional()
              .describe('Model strategy: single (one model for all) or per-phase (different model per phase)'),
            primary: tool.schema
              .string()
              .optional()
              .describe('Primary model for create with single strategy (e.g., "opencode-go/glm-5.1")'),
            effort: tool.schema
              .enum(EFFORT_LEVELS)
              .optional()
              .describe('Default effort level: low, medium, high, extreme'),
            description: tool.schema
              .string()
              .optional()
              .describe('Human-readable description'),
          },
          async execute(args, _context) {
            try {
              switch (args.action) {
                case 'list': {
                  const modeProfiles = listModeProfiles();
                  const current = getCurrentModeProfile();
                  const lines = modeProfiles.map((mp) => {
                    const active = mp.id === current ? ' ← active' : '';
                    return `  **${mp.id}**${active} — ${mp.description || mp.phases.join(' → ')}`;
                  });
                  return {
                    title: 'SDD ModeProfiles',
                    output: `Available SDD ModeProfiles:\n\n${lines.join('\n')}\n\nCurrent ModeProfile: **${current || 'none'}**`,
                  };
                }

                case 'switch': {
                  if (!args.name) {
                    return {
                      title: 'Error',
                      output: `ModeProfile name is required. Available: ${listModeProfiles().map((mp) => mp.id).join(', ')}`,
                    };
                  }
                  const mp = switchModeProfile(args.name);
                  return {
                    title: `Switched to ${args.name}`,
                    output: `Active ModeProfile: **${args.name}**\nDescription: ${mp.description || 'N/A'}\nPhases: ${mp.phases?.join(' → ') || 'none'}\nModel strategy: ${mp.model_strategy || 'per-phase'}\nDefault model: ${mp.default?.primary || 'unknown'}`,
                  };
                }

                case 'create': {
                  if (!args.name) return { title: 'Error', output: 'ModeProfile name is required for create action.' };
                  if (!args.phases) return { title: 'Error', output: `Phases are required. Available: ${AVAILABLE_PHASES.join(', ')}` };

                  const phases = args.phases.split(',').map((s) => s.trim()).filter((p) => AVAILABLE_PHASES.includes(p));
                  if (phases.length === 0) {
                    return { title: 'Error', output: `No valid phases found. Available: ${AVAILABLE_PHASES.join(', ')}` };
                  }

                  const strategy = args.model_strategy || 'per-phase';
                  const effort = args.effort || 'medium';
                  const primary = args.primary || 'opencode-go/glm-5.1';

                  const config = {
                    name: args.name.charAt(0).toUpperCase() + args.name.slice(1).replace(/[-_]/g, ' '),
                    description: args.description || `Custom ModeProfile: ${args.name}`,
                    phases,
                    model_strategy: strategy,
                    default: {
                      primary,
                      effort,
                      fallbacks: [],
                    },
                  };

                  // For per-phase, copy default to each phase
                  if (strategy === 'per-phase') {
                    for (const phase of phases) {
                      config[phase] = { ...config.default };
                    }
                  }

                  createModeProfile(args.name, config);
                  switchModeProfile(args.name);
                  return {
                    title: `Created ModeProfile: ${args.name}`,
                    output: `ModeProfile **${args.name}** created and activated.\nPhases: ${phases.join(' → ')}\nStrategy: ${strategy}\nDefault model: ${primary}\nEffort: ${effort}\nDescription: ${config.description}`,
                  };
                }

                case 'status': {
                  const status = getStatus();
                  const phases = status.modeprofile?.phases || [];
                  return {
                    title: 'SDD Status',
                    output:
                      `**ModeProfile:** ${status.current_modeprofile || 'none'}\n` +
                      `**Phases:** ${phases.join(' → ') || 'none'}\n` +
                      `**Model strategy:** ${status.modeprofile?.model_strategy || 'unknown'}\n` +
                      `**Default model:** ${status.modeprofile?.default_model || 'none'}`,
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
            'or show the current RASS status including ModeProfile and agent configuration.',
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
                  const reasp = getReaspStatus();
                  const agents = Object.keys(RYOU_AGENTS);
                  return {
                    title: 'REASP Full Status',
                    output:
                      `**System:** ${reasp.full_name}\n` +
                      `**Default workflow:** ${reasp.default_workflow}\n` +
                      `**REFI enabled:** ${reasp.features?.refi?.enabled ? 'yes' : 'no'}\n` +
                      `**ModeProfile:** ${status.current_modeprofile || 'none'}\n` +
                      `**Phases:** ${status.modeprofile?.phases?.join(' → ') || 'none'}\n` +
                      `**Model strategy:** ${status.modeprofile?.model_strategy || 'unknown'}\n` +
                      `**Default model:** ${status.modeprofile?.default_model || 'none'}\n\n` +
                      `**Ryou Agents:** ${agents.length} configured\n` +
                      agents.map((a) => `  - ${a}: ${RYOU_AGENTS[a].description}`).join('\n'),
                  };
                }

                case 'check': {
                  return {
                    title: 'REASP Agent Check',
                    output:
                      `Ryou agents and the REFI toolkit are defined in REASP and ready to deploy.\n\n` +
                      `Available agents:\n` +
                      Object.entries(RYOU_AGENTS).map(([name, cfg]) =>
                        `  - **${name}** (${cfg.mode}): ${cfg.model} — ${cfg.description}`
                      ).join('\n') +
                      `\n\nPrimary workflows: **${REASP_PRIMARY_AGENTS.join('**, **')}**\n` +
                      `Default agent: **ryou-orchestrator**\n` +
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
                    title: 'REASP Ready for Deployment',
                    output:
                      `The following REASP agents are configured:\n\n${agentList}\n\n` +
                      `To deploy these agents to your OpenCode configuration, run:\n` +
                      `\`\`\`\ncd installer && node index.js install\n\`\`\`\n\n` +
                      `This will:\n` +
                      `1. Copy RASS + REFI assets globally\n` +
                      `2. Deploy Ryou agents to your OpenCode config\n` +
                      `3. Deploy REFI rules, templates, and skill\n` +
                      `4. Let you choose between ryou-efi-planner and ryou-orchestrator\n` +
                      `5. Configure SDD ModeProfile "ryouset" as default`,
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

        reasp_setup: tool({
          description:
            'Manage REASP setup. View combined RASS/REFI status, switch between Ryou EFI Planner and Ryou Orchestrator, or enable and disable REFI.',
          args: {
            action: tool.schema
              .enum(['status', 'deploy', 'switch-workflow', 'toggle-feature'])
              .describe('Action: status, deploy, switch-workflow, or toggle-feature'),
            workflow: tool.schema
              .string()
              .optional()
              .describe('Workflow agent to activate: ryou-efi-planner or ryou-orchestrator'),
            feature: tool.schema
              .string()
              .optional()
              .describe('Feature to toggle: refi or rass'),
            enabled: tool.schema
              .boolean()
              .optional()
              .describe('Desired feature state for toggle-feature'),
          },
          async execute(args, _context) {
            try {
              switch (args.action) {
                case 'status': {
                  const status = getReaspStatus();
                  return {
                    title: 'REASP Status',
                    output:
                      `**System:** ${status.full_name}\n` +
                      `**Workflow agent:** ${status.default_workflow}\n` +
                      `**ModeProfile:** ${status.current_modeprofile || 'none'}\n` +
                      `**REFI enabled:** ${status.features?.refi?.enabled ? 'yes' : 'no'}\n` +
                      `**RASS enabled:** ${status.features?.rass?.enabled ? 'yes' : 'no'}\n` +
                      `**Primary agents:** ${status.primary_agents.join(', ')}`,
                  };
                }
                case 'deploy': {
                  return {
                    title: 'REASP Deployment',
                    output: 'Run `cd installer && node index.js install` to deploy REASP globally with RASS and REFI together.',
                  };
                }
                case 'switch-workflow': {
                  if (!args.workflow) {
                    return { title: 'Error', output: `workflow is required. Available: ${REASP_PRIMARY_AGENTS.join(', ')}` };
                  }
                  const status = setPrimaryWorkflow(args.workflow);
                  return {
                    title: 'Workflow Switched',
                    output: `REASP is now using **${status.default_workflow}** as the default agent.`,
                  };
                }
                case 'toggle-feature': {
                  if (!args.feature || typeof args.enabled !== 'boolean') {
                    return { title: 'Error', output: 'feature and enabled are required for toggle-feature.' };
                  }
                  const status = setFeatureEnabled(args.feature, args.enabled);
                  return {
                    title: 'Feature Updated',
                    output: `Feature **${args.feature}** is now **${status.features?.[args.feature]?.enabled ? 'enabled' : 'disabled'}**. Active workflow: **${status.default_workflow}**.`,
                  };
                }
                default:
                  return { title: 'Error', output: `Unknown action: ${args.action}` };
              }
            } catch (err) {
              return { title: 'REASP Error', output: `Error: ${err.message}` };
            }
          },
        }),
      },
    };
  },
};
