/**
 * RASS TUI Plugin — Ryou Adaptive SDD System
 * Provides /sdd, /sdd-mode, /sdd-profile, and /rass-setup slash commands
 * with interactive dialogs, editors, multi-select toggles, and delete options.
 */

import {
  listModeProfiles,
  getModeProfile,
  switchModeProfile,
  createModeProfile,
  updateModeProfile,
  deleteModeProfile,
  getCurrentModeProfile,
  getStatus,
  AVAILABLE_PHASES,
  EFFORT_LEVELS,
  RYOU_AGENTS,
} from './rass-core.js';

// ─── Dynamic Model Discovery ─────────────────────────────────────────────

/**
 * Discover all available models from OpenCode's runtime state.
 * Falls back to rass-core's models if state is not ready.
 */
function discoverModels(api) {
  // Try to get models from OpenCode's runtime state
  if (api?.state?.provider && Array.isArray(api.state.provider)) {
    const models = [];
    for (const prov of api.state.provider) {
      if (prov?.models && typeof prov.models === 'object') {
        for (const [modelId, modelInfo] of Object.entries(prov.models)) {
          const fullId = prov.id ? `${prov.id}/${modelId}` : modelId;
          models.push({
            id: fullId,
            label: modelInfo?.name || modelId,
            description: modelInfo?.family
              ? `${prov.id || 'unknown'} — ${modelInfo.family}`
              : `${prov.id || 'unknown'}`,
          });
        }
      }
    }
    if (models.length > 0) {
      // Sort: OpenCode Go models first, then by provider, then by name
      models.sort((a, b) => {
        const aGo = a.id.startsWith('opencode-go/') ? 0 : 1;
        const bGo = b.id.startsWith('opencode-go/') ? 0 : 1;
        if (aGo !== bGo) return aGo - bGo;
        return a.id.localeCompare(b.id);
      });
      return models;
    }
  }

  // Fallback: import from rass-core
  return [
    { id: 'opencode-go/glm-5.1', label: 'GLM-5.1', description: 'Orchestration, planning, architecture, complex reasoning' },
    { id: 'opencode-go/kimi-k2.6', label: 'Kimi K2.6', description: 'Implementation, refactors, C#/.NET code generation' },
    { id: 'opencode-go/deepseek-v4-pro', label: 'DeepSeek V4 Pro', description: 'Debugging, review, performance, risk analysis' },
    { id: 'opencode-go/deepseek-v4-flash', label: 'DeepSeek V4 Flash', description: 'Small tasks, documentation, summaries' },
  ];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getPhaseDescription(phase) {
  const descriptions = {
    orchestrator: 'Routing, delegation, mode/profile selection',
    init: 'Read project, understand stack, identify architecture',
    explore: 'Impact analysis, dependencies, risks',
    propose: 'Architecture decisions, tradeoffs, design proposals',
    design: 'MeridianUI, layouts, UX, responsive, accessibility',
    apply: 'Code implementation, EF, APIs, XAML, Blazor, MAUI',
    verify: 'Bug detection, SOLID, performance, UX consistency',
    archive: 'Summaries, changelogs, documentation',
  };
  return descriptions[phase] || phase;
}

function getEffortDescription(effort) {
  const descriptions = {
    low: 'Speed — minimal reasoning, fast responses',
    medium: 'Balanced — standard reasoning, good quality',
    high: 'Deep reasoning — thorough analysis, careful decisions',
    extreme: 'Maximum analysis — exhaustive reasoning, best quality',
  };
  return descriptions[effort] || effort;
}

function getModelLabel(modelId, models) {
  const model = models.find((m) => m.id === modelId);
  return model ? model.label : modelId;
}

function buildPhaseSummary(phases) {
  if (!phases || phases.length === 0) return 'No phases';
  return phases.join(' → ');
}

// ─── Plugin Entry ────────────────────────────────────────────────────────────

export default {
  id: 'rass',
  tui: async (api, _options, _meta) => {
    // Discover all available models from OpenCode runtime
    const models = discoverModels(api);

    // ═══════════════════════════════════════════════════════════════════════
    // /sdd — Main Unified ModeProfile Command
    // ═══════════════════════════════════════════════════════════════════════

    const showModeProfileDialog = (dialog) => {
      const modeProfiles = listModeProfiles();
      const currentMp = getCurrentModeProfile();

      const options = [
        ...modeProfiles.map((mp) => ({
          title: mp.id === currentMp ? `${mp.name} (active)` : mp.name,
          value: mp.id,
          description: `${buildPhaseSummary(mp.phases)} | ${mp.model_strategy === 'single' ? 'Single model' : 'Per-phase models'}`,
        })),
        {
          title: '+ Create New ModeProfile...',
          value: '__create__',
          description: 'Create a custom SDD ModeProfile with your own phases and model routing',
        },
      ];

      dialog.replace(
        () => api.ui.DialogSelect({
          title: 'SDD ModeProfile',
          placeholder: 'Select a ModeProfile or create new...',
          options,
          current: currentMp,
          onSelect: (option) => {
            if (option.value === '__create__') {
              showCreateModeProfileNameDialog(dialog);
            } else {
              showModeProfileActionsDialog(dialog, option.value);
            }
          },
        }),
      );
    };

    // ── ModeProfile Actions (Switch / Edit / Delete) ────────────────────────

    const showModeProfileActionsDialog = (dialog, mpId) => {
      const mp = getModeProfile(mpId);
      if (!mp) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `ModeProfile '${mpId}' not found` });
        return;
      }
      const currentMp = getCurrentModeProfile();
      const isActive = mpId === currentMp;
      const mpName = mp.name || mpId;

      const options = [
        ...(isActive
          ? []
          : [{
              title: 'Switch to this ModeProfile',
              value: 'switch',
              description: `Activate "${mpName}" — ${buildPhaseSummary(mp.phases)}`,
            }]),
        {
          title: 'Edit ModeProfile',
          value: 'edit',
          description: `Modify phases, model strategy, or per-phase settings of "${mpName}"`,
        },
        {
          title: 'Delete ModeProfile',
          value: 'delete',
          description: `Permanently delete "${mpName}"`,
        },
        {
          title: '← Back',
          value: 'back',
          description: 'Return to ModeProfile list',
        },
      ];

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `ModeProfile: ${mpName}`,
          placeholder: 'Choose an action...',
          options,
          onSelect: (opt) => {
            switch (opt.value) {
              case 'switch': {
                try {
                  switchModeProfile(mpId);
                  dialog.clear();
                  api.ui.toast({
                    variant: 'success',
                    title: 'ModeProfile Switched',
                    message: `Now using "${mpName}" — ${buildPhaseSummary(mp.phases)}`,
                  });
                } catch (err) {
                  dialog.clear();
                  api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
                }
                break;
              }
              case 'edit':
                showEditModeProfileDialog(dialog, mpId);
                break;
              case 'delete':
                showDeleteModeProfileConfirmDialog(dialog, mpId, mpName);
                break;
              case 'back':
                showModeProfileDialog(dialog);
                break;
            }
          },
        }),
      );
    };

    // ── Delete ModeProfile Confirmation ───────────────────────────────────

    const showDeleteModeProfileConfirmDialog = (dialog, mpId, mpName) => {
      dialog.replace(
        () => api.ui.DialogConfirm({
          title: `Delete "${mpName}"?`,
          message: `This will permanently delete the ModeProfile "${mpName}" (${mpId}). This cannot be undone.`,
          onConfirm: () => {
            try {
              deleteModeProfile(mpId);
              dialog.clear();
              api.ui.toast({ variant: 'success', title: 'ModeProfile Deleted', message: `"${mpName}" has been deleted` });
            } catch (err) {
              dialog.clear();
              api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
            }
          },
          onCancel: () => showModeProfileActionsDialog(dialog, mpId),
        }),
      );
    };

    // ═══════════════════════════════════════════════════════════════════════
    // Create New ModeProfile Flow
    // ═══════════════════════════════════════════════════════════════════════

    // Step 1: Name
    const showCreateModeProfileNameDialog = (dialog) => {
      dialog.replace(
        () => api.ui.DialogPrompt({
          title: 'Create New ModeProfile — Enter a name (e.g., "custom-api", "rapid-prototype")',
          placeholder: 'modeprofile-name',
          onConfirm: (name) => {
            if (!name || !name.trim()) {
              dialog.clear();
              api.ui.toast({ variant: 'error', title: 'Error', message: 'ModeProfile name cannot be empty' });
              return;
            }
            showCreateModeProfileDescriptionDialog(dialog, name.trim());
          },
          onCancel: () => showModeProfileDialog(dialog),
        }),
      );
    };

    // Step 2: Description
    const showCreateModeProfileDescriptionDialog = (dialog, mpName) => {
      dialog.replace(
        () => api.ui.DialogPrompt({
          title: `Description for "${mpName}" (optional)`,
          placeholder: 'What is this ModeProfile for?',
          onConfirm: (description) => {
            showCreateModeProfilePhasesDialog(dialog, mpName, description || '', ['orchestrator', 'apply', 'verify']);
          },
          onCancel: () => showCreateModeProfilePhasesDialog(dialog, mpName, '', ['orchestrator', 'apply', 'verify']),
        }),
      );
    };

    // Step 3: Select Phases (toggle multi-select)
    const showCreateModeProfilePhasesDialog = (dialog, mpName, description, selectedPhases) => {
      const options = AVAILABLE_PHASES.map((p) => ({
        title: selectedPhases.includes(p) ? `✓ ${p.charAt(0).toUpperCase() + p.slice(1)}` : `  ${p.charAt(0).toUpperCase() + p.slice(1)}`,
        value: p,
        description: getPhaseDescription(p),
      }));

      options.push({
        title: '✓ Done — Confirm phase selection',
        value: '__done__',
        description: `Selected: ${selectedPhases.join(', ') || 'none'}`,
      });

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Phases for "${mpName}" — Select to toggle, Done to confirm`,
          placeholder: 'Select a phase to toggle it on/off...',
          options,
          onSelect: (option) => {
            if (option.value === '__done__') {
              if (selectedPhases.length === 0) {
                showCreateModeProfilePhasesDialog(dialog, mpName, description, selectedPhases);
                return;
              }
              showCreateModeProfileStrategyDialog(dialog, mpName, description, selectedPhases);
            } else {
              const newPhases = selectedPhases.includes(option.value)
                ? selectedPhases.filter((p) => p !== option.value)
                : [...selectedPhases, option.value];
              showCreateModeProfilePhasesDialog(dialog, mpName, description, newPhases);
            }
          },
        }),
      );
    };

    // Step 4: Model Strategy
    const showCreateModeProfileStrategyDialog = (dialog, mpName, description, phases) => {
      const options = [
        {
          title: 'Single model for all phases',
          value: 'single',
          description: 'One model, effort, and fallback set applies to every phase',
        },
        {
          title: 'One model per phase',
          value: 'per-phase',
          description: 'Configure a different model, effort, and fallbacks for each phase individually',
        },
      ];

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Model strategy for "${mpName}"`,
          placeholder: 'Choose how models are assigned to phases...',
          options,
          onSelect: (option) => {
            if (option.value === 'single') {
              showCreateModeProfileSingleModelDialog(dialog, mpName, description, phases);
            } else {
              showCreateModeProfilePerPhaseModelDialog(dialog, mpName, description, phases, 0, {});
            }
          },
        }),
      );
    };

    // Step 5a (single model): Select model
    const showCreateModeProfileSingleModelDialog = (dialog, mpName, description, phases) => {
      const modelOptions = models.map((m) => ({
        title: m.label,
        value: m.id,
        description: m.description,
      }));

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Primary model for "${mpName}" (all phases)`,
          placeholder: 'Select the primary AI model...',
          options: modelOptions,
          onSelect: (modelOption) => {
            showCreateModeProfileSingleEffortDialog(dialog, mpName, description, phases, modelOption.value);
          },
        }),
      );
    };

    // Step 5a (single model): Select effort
    const showCreateModeProfileSingleEffortDialog = (dialog, mpName, description, phases, primaryModel) => {
      const effortOptions = EFFORT_LEVELS.map((e) => ({
        title: e.charAt(0).toUpperCase() + e.slice(1),
        value: e,
        description: getEffortDescription(e),
      }));

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Default effort for "${mpName}"`,
          placeholder: 'Select effort level...',
          options: effortOptions,
          current: 'medium',
          onSelect: (effortOption) => {
            showCreateModeProfileSingleFallbacksDialog(dialog, mpName, description, phases, primaryModel, effortOption.value, []);
          },
        }),
      );
    };

    // Step 5a (single model): Select fallbacks (toggle multi-select)
    const showCreateModeProfileSingleFallbacksDialog = (dialog, mpName, description, phases, primaryModel, effort, selectedFallbacks) => {
      const options = models.map((m) => {
        if (m.id === primaryModel) {
          return {
            title: `${m.label} (primary)`,
            value: m.id,
            description: m.description,
            disabled: true,
          };
        }
        return {
          title: selectedFallbacks.includes(m.id) ? `✓ ${m.label}` : `  ${m.label}`,
          value: m.id,
          description: m.description,
        };
      });

      options.push({
        title: '✓ Done — Create ModeProfile',
        value: '__done__',
        description: `Primary: ${getModelLabel(primaryModel, models)} | Fallbacks: ${selectedFallbacks.map((f) => getModelLabel(f, models)).join(', ') || 'none'}`,
      });

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Fallback models for "${mpName}" — Toggle with Enter, Done to confirm`,
          placeholder: 'Select a model to toggle it as fallback...',
          options,
          onSelect: (option) => {
            if (option.value === '__done__') {
              try {
                createModeProfile(mpName, {
                  name: mpName.charAt(0).toUpperCase() + mpName.slice(1).replace(/[-_]/g, ' '),
                  description,
                  phases,
                  model_strategy: 'single',
                  default: {
                    primary: primaryModel,
                    effort,
                    fallbacks: selectedFallbacks,
                  },
                });
                switchModeProfile(mpName);
                dialog.clear();
                api.ui.toast({
                  variant: 'success',
                  title: 'ModeProfile Created',
                  message: `Created "${mpName}" with ${phases.length} phases using ${getModelLabel(primaryModel, models)} at ${effort} effort`,
                });
              } catch (err) {
                dialog.clear();
                api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
              }
            } else if (option.disabled) {
              showCreateModeProfileSingleFallbacksDialog(dialog, mpName, description, phases, primaryModel, effort, selectedFallbacks);
            } else {
              const newFallbacks = selectedFallbacks.includes(option.value)
                ? selectedFallbacks.filter((f) => f !== option.value)
                : [...selectedFallbacks, option.value];
              showCreateModeProfileSingleFallbacksDialog(dialog, mpName, description, phases, primaryModel, effort, newFallbacks);
            }
          },
        }),
      );
    };

    // Step 5b (per-phase): For EACH selected phase — model, effort, fallbacks
    const showCreateModeProfilePerPhaseModelDialog = (dialog, mpName, description, phases, phaseIndex, phaseConfigs) => {
      if (phaseIndex >= phases.length) {
        // All phases configured — save
        const config = {
          name: mpName.charAt(0).toUpperCase() + mpName.slice(1).replace(/[-_]/g, ' '),
          description,
          phases,
          model_strategy: 'per-phase',
          default: phaseConfigs[phases[0]] || {},
        };
        for (const phase of phases) {
          if (phaseConfigs[phase]) {
            config[phase] = phaseConfigs[phase];
          }
        }
        try {
          createModeProfile(mpName, config);
          switchModeProfile(mpName);
          dialog.clear();
          api.ui.toast({
            variant: 'success',
            title: 'ModeProfile Created',
            message: `Created "${mpName}" with ${phases.length} phases and per-phase model routing`,
          });
        } catch (err) {
          dialog.clear();
          api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
        }
        return;
      }

      const currentPhase = phases[phaseIndex];
      const progress = `Phase ${phaseIndex + 1} of ${phases.length}`;

      const modelOptions = models.map((m) => ({
        title: m.label,
        value: m.id,
        description: m.description,
      }));

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `${progress}: ${currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} — Select model`,
          placeholder: `Choose the AI model for the ${currentPhase} phase...`,
          options: modelOptions,
          onSelect: (modelOption) => {
            showCreateModeProfilePerPhaseEffortDialog(dialog, mpName, description, phases, phaseIndex, phaseConfigs, currentPhase, modelOption.value);
          },
        }),
      );
    };

    const showCreateModeProfilePerPhaseEffortDialog = (dialog, mpName, description, phases, phaseIndex, phaseConfigs, currentPhase, modelId) => {
      const progress = `Phase ${phaseIndex + 1} of ${phases.length}`;

      const effortOptions = EFFORT_LEVELS.map((e) => ({
        title: e.charAt(0).toUpperCase() + e.slice(1),
        value: e,
        description: getEffortDescription(e),
      }));

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `${progress}: ${currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} — Effort for ${getModelLabel(modelId, models)}`,
          placeholder: 'Select effort level...',
          options: effortOptions,
          current: 'medium',
          onSelect: (effortOption) => {
            showCreateModeProfilePerPhaseFallbacksDialog(dialog, mpName, description, phases, phaseIndex, phaseConfigs, currentPhase, modelId, effortOption.value, []);
          },
        }),
      );
    };

    const showCreateModeProfilePerPhaseFallbacksDialog = (dialog, mpName, description, phases, phaseIndex, phaseConfigs, currentPhase, modelId, effort, selectedFallbacks) => {
      const progress = `Phase ${phaseIndex + 1} of ${phases.length}`;

      const options = models.map((m) => {
        if (m.id === modelId) {
          return {
            title: `${m.label} (primary)`,
            value: m.id,
            description: m.description,
            disabled: true,
          };
        }
        return {
          title: selectedFallbacks.includes(m.id) ? `✓ ${m.label}` : `  ${m.label}`,
          value: m.id,
          description: m.description,
        };
      });

      options.push({
        title: '✓ Done — Confirm fallbacks',
        value: '__done__',
        description: `Fallbacks: ${selectedFallbacks.map((f) => getModelLabel(f, models)).join(', ') || 'none'}`,
      });

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `${progress}: ${currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} — Fallbacks for ${getModelLabel(modelId, models)}`,
          placeholder: 'Toggle fallbacks with Enter, Done to confirm...',
          options,
          onSelect: (option) => {
            if (option.value === '__done__') {
              const newPhaseConfigs = {
                ...phaseConfigs,
                [currentPhase]: {
                  primary: modelId,
                  effort,
                  fallbacks: selectedFallbacks,
                },
              };
              showCreateModeProfilePerPhaseModelDialog(dialog, mpName, description, phases, phaseIndex + 1, newPhaseConfigs);
            } else if (option.disabled) {
              showCreateModeProfilePerPhaseFallbacksDialog(dialog, mpName, description, phases, phaseIndex, phaseConfigs, currentPhase, modelId, effort, selectedFallbacks);
            } else {
              const newFallbacks = selectedFallbacks.includes(option.value)
                ? selectedFallbacks.filter((f) => f !== option.value)
                : [...selectedFallbacks, option.value];
              showCreateModeProfilePerPhaseFallbacksDialog(dialog, mpName, description, phases, phaseIndex, phaseConfigs, currentPhase, modelId, effort, newFallbacks);
            }
          },
        }),
      );
    };

    // ═══════════════════════════════════════════════════════════════════════
    // Edit ModeProfile Flow
    // ═══════════════════════════════════════════════════════════════════════

    const showEditModeProfileDialog = (dialog, mpId) => {
      const mp = getModeProfile(mpId);
      if (!mp) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `ModeProfile '${mpId}' not found` });
        return;
      }
      const mpName = mp.name || mpId;

      const options = [
        {
          title: 'Edit phases',
          value: 'edit_phases',
          description: `Current: ${buildPhaseSummary(mp.phases)}`,
        },
        {
          title: 'Edit model strategy',
          value: 'edit_strategy',
          description: `Current: ${mp.model_strategy || 'per-phase'}`,
        },
        {
          title: 'Edit default model & effort',
          value: 'edit_default',
          description: `Current: ${getModelLabel(mp.default?.primary || 'unknown', models)} at ${mp.default?.effort || 'medium'} effort`,
        },
        {
          title: 'Edit per-phase models',
          value: 'edit_phase_models',
          description: 'Configure model, effort, and fallbacks for each phase',
        },
        {
          title: 'Edit description',
          value: 'edit_description',
          description: `Current: ${mp.description || 'none'}`,
        },
        {
          title: '← Back to actions',
          value: 'back',
          description: 'Return without saving',
        },
      ];

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Edit "${mpName}"`,
          placeholder: 'Choose what to edit...',
          options,
          onSelect: (opt) => {
            switch (opt.value) {
              case 'edit_phases':
                showEditModeProfilePhasesDialog(dialog, mpId);
                break;
              case 'edit_strategy':
                showEditModeProfileStrategyDialog(dialog, mpId);
                break;
              case 'edit_default':
                showEditModeProfileDefaultModelDialog(dialog, mpId);
                break;
              case 'edit_phase_models':
                showEditModeProfilePhaseSelectDialog(dialog, mpId);
                break;
              case 'edit_description':
                showEditModeProfileDescriptionDialog(dialog, mpId);
                break;
              case 'back':
                showModeProfileActionsDialog(dialog, mpId);
                break;
            }
          },
        }),
      );
    };

    // Edit: Phases
    const showEditModeProfilePhasesDialog = (dialog, mpId, selectedPhases = null) => {
      const mp = getModeProfile(mpId);
      if (!mp) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `ModeProfile '${mpId}' not found` });
        return;
      }
      const phases = selectedPhases !== null ? selectedPhases : [...(mp.phases || [])];

      const options = AVAILABLE_PHASES.map((p) => ({
        title: phases.includes(p) ? `✓ ${p.charAt(0).toUpperCase() + p.slice(1)}` : `  ${p.charAt(0).toUpperCase() + p.slice(1)}`,
        value: p,
        description: getPhaseDescription(p),
      }));

      options.push({
        title: '✓ Done — Save phases',
        value: '__done__',
        description: `Selected: ${phases.join(', ') || 'none'}`,
      });
      options.push({
        title: '← Back to edit menu',
        value: '__back__',
        description: 'Return without saving',
      });

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Edit "${mp.name || mpId}" — Phases (toggle on/off, Done to save)`,
          placeholder: 'Select a phase to toggle it...',
          options,
          onSelect: (option) => {
            if (option.value === '__done__') {
              if (phases.length === 0) {
                showEditModeProfilePhasesDialog(dialog, mpId, phases);
                return;
              }
              try {
                updateModeProfile(mpId, { phases });
                dialog.clear();
                api.ui.toast({
                  variant: 'success',
                  title: 'ModeProfile Updated',
                  message: `"${mp.name || mpId}" phases updated: ${phases.join(' → ')}`,
                });
              } catch (err) {
                dialog.clear();
                api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
              }
            } else if (option.value === '__back__') {
              showEditModeProfileDialog(dialog, mpId);
            } else {
              const newPhases = phases.includes(option.value)
                ? phases.filter((p) => p !== option.value)
                : [...phases, option.value];
              showEditModeProfilePhasesDialog(dialog, mpId, newPhases);
            }
          },
        }),
      );
    };

    // Edit: Model Strategy
    const showEditModeProfileStrategyDialog = (dialog, mpId) => {
      const mp = getModeProfile(mpId);
      if (!mp) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `ModeProfile '${mpId}' not found` });
        return;
      }
      const currentStrategy = mp.model_strategy || 'per-phase';

      const options = [
        {
          title: currentStrategy === 'single' ? 'Single model for all phases (current)' : 'Single model for all phases',
          value: 'single',
          description: 'One model, effort, and fallback set applies to every phase',
        },
        {
          title: currentStrategy === 'per-phase' ? 'One model per phase (current)' : 'One model per phase',
          value: 'per-phase',
          description: 'Configure a different model, effort, and fallbacks for each phase individually',
        },
        {
          title: '← Back to edit menu',
          value: '__back__',
          description: 'Return without saving',
        },
      ];

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Edit "${mp.name || mpId}" — Model Strategy`,
          placeholder: 'Choose model strategy...',
          options,
          onSelect: (option) => {
            if (option.value === '__back__') {
              showEditModeProfileDialog(dialog, mpId);
            } else {
              try {
                updateModeProfile(mpId, { model_strategy: option.value });
                dialog.clear();
                api.ui.toast({
                  variant: 'success',
                  title: 'ModeProfile Updated',
                  message: `"${mp.name || mpId}" model strategy changed to ${option.value}`,
                });
              } catch (err) {
                dialog.clear();
                api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
              }
            }
          },
        }),
      );
    };

    // Edit: Default Model
    const showEditModeProfileDefaultModelDialog = (dialog, mpId) => {
      const mp = getModeProfile(mpId);
      if (!mp) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `ModeProfile '${mpId}' not found` });
        return;
      }
      const currentPrimary = mp.default?.primary || 'opencode-go/glm-5.1';

      const modelOptions = models.map((m) => ({
        title: m.id === currentPrimary ? `${m.label} (current)` : m.label,
        value: m.id,
        description: m.description,
      }));

      modelOptions.push({
        title: '← Back to edit menu',
        value: '__back__',
        description: 'Return without saving',
      });

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Edit "${mp.name || mpId}" — Default Primary Model`,
          placeholder: 'Select the primary AI model...',
          options: modelOptions,
          current: currentPrimary,
          onSelect: (option) => {
            if (option.value === '__back__') {
              showEditModeProfileDialog(dialog, mpId);
            } else {
              showEditModeProfileDefaultEffortDialog(dialog, mpId, option.value);
            }
          },
        }),
      );
    };

    // Edit: Default Effort
    const showEditModeProfileDefaultEffortDialog = (dialog, mpId, newPrimary) => {
      const mp = getModeProfile(mpId);
      if (!mp) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `ModeProfile '${mpId}' not found` });
        return;
      }
      const currentEffort = mp.default?.effort || 'medium';

      const effortOptions = EFFORT_LEVELS.map((e) => ({
        title: e === currentEffort ? `${e.charAt(0).toUpperCase() + e.slice(1)} (current)` : e.charAt(0).toUpperCase() + e.slice(1),
        value: e,
        description: getEffortDescription(e),
      }));

      effortOptions.push({
        title: '← Back to model selection',
        value: '__back__',
        description: 'Return without saving',
      });

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Edit "${mp.name || mpId}" — Default Effort`,
          placeholder: 'Select effort level...',
          options: effortOptions,
          current: currentEffort,
          onSelect: (option) => {
            if (option.value === '__back__') {
              showEditModeProfileDefaultModelDialog(dialog, mpId);
            } else {
              showEditModeProfileDefaultFallbacksDialog(dialog, mpId, newPrimary, option.value);
            }
          },
        }),
      );
    };

    // Edit: Default Fallbacks
    const showEditModeProfileDefaultFallbacksDialog = (dialog, mpId, newPrimary, newEffort, selectedFallbacks = null) => {
      const mp = getModeProfile(mpId);
      if (!mp) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `ModeProfile '${mpId}' not found` });
        return;
      }
      const fallbacks = selectedFallbacks !== null ? selectedFallbacks : [...(mp.default?.fallbacks || [])];

      const options = models.map((m) => {
        if (m.id === newPrimary) {
          return {
            title: `${m.label} (primary)`,
            value: m.id,
            description: m.description,
            disabled: true,
          };
        }
        return {
          title: fallbacks.includes(m.id) ? `✓ ${m.label}` : `  ${m.label}`,
          value: m.id,
          description: m.description,
        };
      });

      options.push({
        title: '✓ Done — Save defaults',
        value: '__done__',
        description: `Primary: ${getModelLabel(newPrimary, models)} | Fallbacks: ${fallbacks.map((f) => getModelLabel(f, models)).join(', ') || 'none'}`,
      });
      options.push({
        title: '← Back to effort selection',
        value: '__back__',
        description: 'Return without saving',
      });

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Edit "${mp.name || mpId}" — Default Fallback Models`,
          placeholder: 'Toggle fallbacks with Enter, Done to save...',
          options,
          onSelect: (option) => {
            if (option.value === '__done__') {
              try {
                updateModeProfile(mpId, {
                  default: {
                    primary: newPrimary,
                    effort: newEffort,
                    fallbacks,
                  },
                });
                dialog.clear();
                api.ui.toast({
                  variant: 'success',
                  title: 'ModeProfile Updated',
                  message: `Default set to ${getModelLabel(newPrimary, models)} at ${newEffort} effort`,
                });
              } catch (err) {
                dialog.clear();
                api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
              }
            } else if (option.value === '__back__') {
              showEditModeProfileDefaultEffortDialog(dialog, mpId, newPrimary);
            } else if (option.disabled) {
              showEditModeProfileDefaultFallbacksDialog(dialog, mpId, newPrimary, newEffort, fallbacks);
            } else {
              const newFallbacks = fallbacks.includes(option.value)
                ? fallbacks.filter((f) => f !== option.value)
                : [...fallbacks, option.value];
              showEditModeProfileDefaultFallbacksDialog(dialog, mpId, newPrimary, newEffort, newFallbacks);
            }
          },
        }),
      );
    };

    // Edit: Description
    const showEditModeProfileDescriptionDialog = (dialog, mpId) => {
      const mp = getModeProfile(mpId);
      if (!mp) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `ModeProfile '${mpId}' not found` });
        return;
      }

      dialog.replace(
        () => api.ui.DialogPrompt({
          title: `Edit description for "${mp.name || mpId}"`,
          placeholder: mp.description || 'Enter a description...',
          onConfirm: (description) => {
            try {
              updateModeProfile(mpId, { description });
              dialog.clear();
              api.ui.toast({
                variant: 'success',
                title: 'ModeProfile Updated',
                message: `Description updated for "${mp.name || mpId}"`,
              });
            } catch (err) {
              dialog.clear();
              api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
            }
          },
          onCancel: () => showEditModeProfileDialog(dialog, mpId),
        }),
      );
    };

    // Edit: Per-Phase Model Select
    const showEditModeProfilePhaseSelectDialog = (dialog, mpId) => {
      const mp = getModeProfile(mpId);
      if (!mp) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `ModeProfile '${mpId}' not found` });
        return;
      }

      const options = AVAILABLE_PHASES.map((p) => {
        const override = mp[p];
        const hasOverride = !!override;
        return {
          title: hasOverride
            ? `✓ ${p.charAt(0).toUpperCase() + p.slice(1)} — ${getModelLabel(override.primary, models)} / ${override.effort || 'default'}`
            : `  ${p.charAt(0).toUpperCase() + p.slice(1)} — (uses default)`,
          value: p,
          description: hasOverride
            ? `Override: ${getModelLabel(override.primary, models)}, effort: ${override.effort || 'default'}`
            : `Inherits default: ${getModelLabel(mp.default?.primary || 'unknown', models)}`,
        };
      });

      options.push({
        title: '← Back to edit menu',
        value: '__back__',
        description: 'Return to edit menu',
      });

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Edit "${mp.name || mpId}" — Per-Phase Models`,
          placeholder: 'Select a phase to set its model override...',
          options,
          onSelect: (option) => {
            if (option.value === '__back__') {
              showEditModeProfileDialog(dialog, mpId);
            } else {
              showEditModeProfilePhaseModelDialog(dialog, mpId, option.value);
            }
          },
        }),
      );
    };

    // Edit: Phase Override — Model Selection
    const showEditModeProfilePhaseModelDialog = (dialog, mpId, phase) => {
      const mp = getModeProfile(mpId);
      if (!mp) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `ModeProfile '${mpId}' not found` });
        return;
      }
      const currentOverride = mp[phase];
      const currentModel = currentOverride?.primary || mp.default?.primary || 'opencode-go/glm-5.1';

      const modelOptions = models.map((m) => ({
        title: m.id === currentModel ? `${m.label} (current)` : m.label,
        value: m.id,
        description: m.description,
      }));

      modelOptions.push({
        title: '✗ Remove override (use default)',
        value: '__remove__',
        description: `This phase will inherit the default model settings`,
      });
      modelOptions.push({
        title: '← Back to phase list',
        value: '__back__',
        description: 'Return without changes',
      });

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `${phase.charAt(0).toUpperCase() + phase.slice(1)} — Model Override`,
          placeholder: 'Select model for this phase...',
          options: modelOptions,
          current: currentModel,
          onSelect: (option) => {
            if (option.value === '__back__') {
              showEditModeProfilePhaseSelectDialog(dialog, mpId);
            } else if (option.value === '__remove__') {
              try {
                updateModeProfile(mpId, { removePhases: [phase] });
                dialog.clear();
                api.ui.toast({
                  variant: 'success',
                  title: 'Override Removed',
                  message: `${phase} will now use default model settings`,
                });
              } catch (err) {
                dialog.clear();
                api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
              }
            } else {
              showEditModeProfilePhaseEffortDialog(dialog, mpId, phase, option.value);
            }
          },
        }),
      );
    };

    // Edit: Phase Override — Effort Selection
    const showEditModeProfilePhaseEffortDialog = (dialog, mpId, phase, modelId) => {
      const mp = getModeProfile(mpId);
      if (!mp) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `ModeProfile '${mpId}' not found` });
        return;
      }
      const currentOverride = mp[phase];
      const currentEffort = currentOverride?.effort || mp.default?.effort || 'medium';

      const effortOptions = EFFORT_LEVELS.map((e) => ({
        title: e === currentEffort ? `${e.charAt(0).toUpperCase() + e.slice(1)} (current)` : e.charAt(0).toUpperCase() + e.slice(1),
        value: e,
        description: getEffortDescription(e),
      }));

      effortOptions.push({
        title: '← Back to model selection',
        value: '__back__',
        description: 'Return without saving',
      });

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `${phase.charAt(0).toUpperCase() + phase.slice(1)} — Effort for ${getModelLabel(modelId, models)}`,
          placeholder: 'Select effort level...',
          options: effortOptions,
          current: currentEffort,
          onSelect: (option) => {
            if (option.value === '__back__') {
              showEditModeProfilePhaseModelDialog(dialog, mpId, phase);
            } else {
              showEditModeProfilePhaseFallbacksDialog(dialog, mpId, phase, modelId, option.value);
            }
          },
        }),
      );
    };

    // Edit: Phase Override — Fallbacks
    const showEditModeProfilePhaseFallbacksDialog = (dialog, mpId, phase, modelId, effort, selectedFallbacks = null) => {
      const mp = getModeProfile(mpId);
      if (!mp) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `ModeProfile '${mpId}' not found` });
        return;
      }
      const currentOverride = mp[phase];
      const fallbacks = selectedFallbacks !== null ? selectedFallbacks : [...(currentOverride?.fallbacks || mp.default?.fallbacks || [])];

      const options = models.map((m) => {
        if (m.id === modelId) {
          return {
            title: `${m.label} (primary)`,
            value: m.id,
            description: m.description,
            disabled: true,
          };
        }
        return {
          title: fallbacks.includes(m.id) ? `✓ ${m.label}` : `  ${m.label}`,
          value: m.id,
          description: m.description,
        };
      });

      options.push({
        title: '✓ Done — Save override',
        value: '__done__',
        description: `Fallbacks: ${fallbacks.map((f) => getModelLabel(f, models)).join(', ') || 'none'}`,
      });
      options.push({
        title: '← Back to effort selection',
        value: '__back__',
        description: 'Return without saving',
      });

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `${phase.charAt(0).toUpperCase() + phase.slice(1)} — Fallbacks for ${getModelLabel(modelId, models)}`,
          placeholder: 'Toggle fallbacks with Enter, Done to save...',
          options,
          onSelect: (option) => {
            if (option.value === '__done__') {
              try {
                updateModeProfile(mpId, {
                  [phase]: {
                    primary: modelId,
                    effort,
                    fallbacks,
                  },
                });
                dialog.clear();
                api.ui.toast({
                  variant: 'success',
                  title: 'Override Set',
                  message: `${phase} will use ${getModelLabel(modelId, models)} at ${effort} effort`,
                });
              } catch (err) {
                dialog.clear();
                api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
              }
            } else if (option.value === '__back__') {
              showEditModeProfilePhaseEffortDialog(dialog, mpId, phase, modelId);
            } else if (option.disabled) {
              showEditModeProfilePhaseFallbacksDialog(dialog, mpId, phase, modelId, effort, fallbacks);
            } else {
              const newFallbacks = fallbacks.includes(option.value)
                ? fallbacks.filter((f) => f !== option.value)
                : [...fallbacks, option.value];
              showEditModeProfilePhaseFallbacksDialog(dialog, mpId, phase, modelId, effort, newFallbacks);
            }
          },
        }),
      );
    };

    // ═══════════════════════════════════════════════════════════════════════
    // /rass-setup — Status, RyouSet, Agents
    // ═══════════════════════════════════════════════════════════════════════

    const showSetupDialog = (dialog) => {
      const status = getStatus();

      const options = [
        {
          title: 'View Status',
          value: 'status',
          description: `ModeProfile: ${status.current_modeprofile || 'none'} | Phases: ${buildPhaseSummary(status.modeprofile?.phases)}`,
        },
        {
          title: 'Switch to RyouSet',
          value: 'ryouset',
          description: 'Switch to RyouSet ModeProfile (full pipeline with all subagents)',
        },
        {
          title: 'View Ryou Agents',
          value: 'agents',
          description: `${Object.keys(RYOU_AGENTS).length} agents: ryou-orchestrator, planner, builder, architect, reviewer, debugger, documentation`,
        },
      ];

      dialog.replace(
        () => api.ui.DialogSelect({
          title: 'RASS Setup',
          placeholder: 'Choose an action...',
          options,
          onSelect: (option) => {
            switch (option.value) {
              case 'status': {
                dialog.clear();
                api.ui.toast({
                  variant: 'info',
                  title: 'RASS Status',
                  message: `ModeProfile: ${status.current_modeprofile || 'none'} | Phases: ${buildPhaseSummary(status.modeprofile?.phases)} | Strategy: ${status.modeprofile?.model_strategy || 'unknown'}`,
                });
                break;
              }
              case 'ryouset': {
                try {
                  switchModeProfile('ryouset');
                  dialog.clear();
                  api.ui.toast({
                    variant: 'success',
                    title: 'Switched to RyouSet',
                    message: 'ModeProfile: RyouSet — Full pipeline with per-phase model routing',
                  });
                } catch (err) {
                  dialog.clear();
                  api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
                }
                break;
              }
              case 'agents': {
                dialog.clear();
                api.ui.toast({
                  variant: 'info',
                  title: 'Ryou Agents',
                  message: `7 agents configured. Run "cd installer && node index.js install" to deploy to OpenCode.`,
                });
                break;
              }
            }
          },
        }),
      );
    };

    // ═══════════════════════════════════════════════════════════════════════
    // Register Slash Commands
    // ═══════════════════════════════════════════════════════════════════════

    const disposeCommands = api.command?.register(() => [
      {
        title: 'SDD ModeProfile',
        value: 'sdd',
        description: 'Switch, create, edit, or delete SDD ModeProfiles',
        category: 'RASS',
        slash: { name: 'sdd', aliases: ['s'] },
        onSelect: (dialog) => showModeProfileDialog(dialog),
      },
      {
        title: 'SDD Mode (legacy alias)',
        value: 'sdd-mode',
        description: 'Alias for /sdd — use /sdd instead',
        category: 'RASS',
        slash: { name: 'sdd-mode', aliases: ['sm'] },
        onSelect: (dialog) => showModeProfileDialog(dialog),
      },
      {
        title: 'SDD Profile (legacy alias)',
        value: 'sdd-profile',
        description: 'Alias for /sdd — use /sdd instead',
        category: 'RASS',
        slash: { name: 'sdd-profile', aliases: ['sp'] },
        onSelect: (dialog) => showModeProfileDialog(dialog),
      },
      {
        title: 'RASS Setup',
        value: 'rass-setup',
        description: 'View RASS status, switch to RyouSet, or view Ryou agent configuration',
        category: 'RASS',
        slash: { name: 'rass-setup', aliases: ['rs'] },
        onSelect: (dialog) => showSetupDialog(dialog),
      },
    ]);

    // ─── Cleanup ──────────────────────────────────────────────────────────
    api.lifecycle.onDispose(() => {
      disposeCommands?.();
    });
  },
};
