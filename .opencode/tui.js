/**
 * RASS TUI Plugin — Ryou Adaptive SDD System
 * Provides /sdd, /sdd-mode, /sdd-profile, /rass-setup, and /reasp-setup slash commands
 * with interactive dialogs for unified ModeProfile management.
 *
 * Edit flow: Phases → Strategy → Configure Models → Description
 * Configure Models (single): Model → Effort → back to model list
 * Configure Models (per-phase): Phase list → Model → Effort → back to phase list
 * Create flow: Name → Description → Phases → Strategy → Models → Save (no fallbacks)
 */

import {
  listModeProfiles,
  getModeProfile,
  switchModeProfile,
  syncAgentsWithModeProfile,
  createModeProfile,
  updateModeProfile,
  deleteModeProfile,
  getCurrentModeProfile,
  getStatus,
  getReaspStatus,
  setPrimaryWorkflow,
  setFeatureEnabled,
  AVAILABLE_PHASES,
  EFFORT_LEVELS,
  RYOU_AGENTS,
} from './rass-core.js';

// ─── Dynamic Model Discovery ─────────────────────────────────────────────

function discoverModels(api) {
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
      models.sort((a, b) => {
        const aGo = a.id.startsWith('opencode-go/') ? 0 : 1;
        const bGo = b.id.startsWith('opencode-go/') ? 0 : 1;
        if (aGo !== bGo) return aGo - bGo;
        return a.id.localeCompare(b.id);
      });
      return models;
    }
  }
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
    const models = discoverModels(api);

    // ═══════════════════════════════════════════════════════════════════════
    // /sdd — Main ModeProfile List
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
              showCreateNameDialog(dialog);
            } else {
              showActionsDialog(dialog, option.value);
            }
          },
        }),
      );
    };

    // ── Actions (Switch / Edit / Delete) ────────────────────────────────────

    const showActionsDialog = (dialog, mpId) => {
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
          description: `Modify "${mpName}"`,
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
                    message: `Now using "${mpName}" — ${buildPhaseSummary(mp.phases)}. Agent models synchronized.`,
                  });
                } catch (err) {
                  dialog.clear();
                  api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
                }
                break;
              }
              case 'edit':
                showEditDialog(dialog, mpId);
                break;
              case 'delete':
                showDeleteConfirmDialog(dialog, mpId, mpName);
                break;
              case 'back':
                showModeProfileDialog(dialog);
                break;
            }
          },
        }),
      );
    };

    // ── Delete Confirmation ────────────────────────────────────────────────

    const showDeleteConfirmDialog = (dialog, mpId, mpName) => {
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
          onCancel: () => showActionsDialog(dialog, mpId),
        }),
      );
    };

    // ═══════════════════════════════════════════════════════════════════════
    // Create New ModeProfile Flow
    // ═══════════════════════════════════════════════════════════════════════

    // Step 1: Name
    const showCreateNameDialog = (dialog) => {
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
            showCreateDescriptionDialog(dialog, name.trim());
          },
          onCancel: () => showModeProfileDialog(dialog),
        }),
      );
    };

    // Step 2: Description
    const showCreateDescriptionDialog = (dialog, mpName) => {
      dialog.replace(
        () => api.ui.DialogPrompt({
          title: `Description for "${mpName}" (optional)`,
          placeholder: 'What is this ModeProfile for?',
          onConfirm: (description) => {
            showCreatePhasesDialog(dialog, mpName, description || '', ['orchestrator', 'apply', 'verify']);
          },
          onCancel: () => showCreatePhasesDialog(dialog, mpName, '', ['orchestrator', 'apply', 'verify']),
        }),
      );
    };

    // Step 3: Select Phases (toggle multi-select)
    const showCreatePhasesDialog = (dialog, mpName, description, selectedPhases) => {
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
                showCreatePhasesDialog(dialog, mpName, description, selectedPhases);
                return;
              }
              showCreateStrategyDialog(dialog, mpName, description, selectedPhases);
            } else {
              const newPhases = selectedPhases.includes(option.value)
                ? selectedPhases.filter((p) => p !== option.value)
                : [...selectedPhases, option.value];
              showCreatePhasesDialog(dialog, mpName, description, newPhases);
            }
          },
        }),
      );
    };

    // Step 4: Model Strategy
    const showCreateStrategyDialog = (dialog, mpName, description, phases) => {
      const options = [
        {
          title: 'Single model for all phases',
          value: 'single',
          description: 'One model and effort level applies to every phase',
        },
        {
          title: 'One model per phase',
          value: 'per-phase',
          description: 'Configure a different model and effort for each phase individually',
        },
      ];

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Model strategy for "${mpName}"`,
          placeholder: 'Choose how models are assigned to phases...',
          options,
          onSelect: (option) => {
            if (option.value === 'single') {
              showCreateSingleModelDialog(dialog, mpName, description, phases);
            } else {
              showCreatePerPhasePhaseDialog(dialog, mpName, description, phases, 0, {});
            }
          },
        }),
      );
    };

    // ── Create: Single Model Strategy ──────────────────────────────────────

    const showCreateSingleModelDialog = (dialog, mpName, description, phases) => {
      const modelOptions = models.map((m) => ({
        title: m.label,
        value: m.id,
        description: m.description,
      }));

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Select model for "${mpName}" (all phases)`,
          placeholder: 'Choose the AI model...',
          options: modelOptions,
          onSelect: (modelOption) => {
            showCreateSingleEffortDialog(dialog, mpName, description, phases, modelOption.value);
          },
        }),
      );
    };

    const showCreateSingleEffortDialog = (dialog, mpName, description, phases, primaryModel) => {
      const effortOptions = EFFORT_LEVELS.map((e) => ({
        title: e.charAt(0).toUpperCase() + e.slice(1),
        value: e,
        description: getEffortDescription(e),
      }));

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Effort level for ${getModelLabel(primaryModel, models)}`,
          placeholder: 'Select effort level...',
          options: effortOptions,
          current: 'medium',
          onSelect: (effortOption) => {
            // Save and create the ModeProfile
            try {
              createModeProfile(mpName, {
                name: mpName.charAt(0).toUpperCase() + mpName.slice(1).replace(/[-_]/g, ' '),
                description,
                phases,
                model_strategy: 'single',
                default: {
                  primary: primaryModel,
                  effort: effortOption.value,
                  fallbacks: [],
                },
              });
              switchModeProfile(mpName);
              dialog.clear();
              api.ui.toast({
                variant: 'success',
                title: 'ModeProfile Created',
                message: `Created "${mpName}" — ${phases.length} phases, ${getModelLabel(primaryModel, models)} at ${effortOption.value} effort`,
              });
            } catch (err) {
              dialog.clear();
              api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
            }
          },
        }),
      );
    };

    // ── Create: Per-Phase Strategy ─────────────────────────────────────────

    const showCreatePerPhasePhaseDialog = (dialog, mpName, description, phases, phaseIndex, phaseConfigs) => {
      if (phaseIndex >= phases.length) {
        // All phases configured — save
        const config = {
          name: mpName.charAt(0).toUpperCase() + mpName.slice(1).replace(/[-_]/g, ' '),
          description,
          phases,
          model_strategy: 'per-phase',
          default: phaseConfigs[phases[0]] || { primary: 'opencode-go/glm-5.1', effort: 'medium', fallbacks: [] },
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
            message: `Created "${mpName}" — ${phases.length} phases with per-phase model routing`,
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
            showCreatePerPhaseEffortDialog(dialog, mpName, description, phases, phaseIndex, phaseConfigs, currentPhase, modelOption.value);
          },
        }),
      );
    };

    const showCreatePerPhaseEffortDialog = (dialog, mpName, description, phases, phaseIndex, phaseConfigs, currentPhase, modelId) => {
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
            // Save this phase config and move to next
            const newPhaseConfigs = {
              ...phaseConfigs,
              [currentPhase]: {
                primary: modelId,
                effort: effortOption.value,
                fallbacks: [],
              },
            };
            showCreatePerPhasePhaseDialog(dialog, mpName, description, phases, phaseIndex + 1, newPhaseConfigs);
          },
        }),
      );
    };

    // ═══════════════════════════════════════════════════════════════════════
    // Edit ModeProfile Flow — Simplified
    // ═══════════════════════════════════════════════════════════════════════

    const showEditDialog = (dialog, mpId) => {
      const mp = getModeProfile(mpId);
      if (!mp) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `ModeProfile '${mpId}' not found` });
        return;
      }
      const mpName = mp.name || mpId;
      const strategy = mp.model_strategy || 'per-phase';

      const options = [
        {
          title: 'Edit phases',
          value: 'edit_phases',
          description: `Current: ${buildPhaseSummary(mp.phases)}`,
        },
        {
          title: 'Model strategy',
          value: 'edit_strategy',
          description: `Current: ${strategy === 'single' ? 'Single model for all phases' : 'One model per phase'}`,
        },
        {
          title: 'Configure models',
          value: 'configure_models',
          description: strategy === 'single'
            ? `Set model and effort for all phases — ${getModelLabel(mp.default?.primary || 'unknown', models)}`
            : `Set model and effort for each phase individually`,
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
                showEditPhasesDialog(dialog, mpId);
                break;
              case 'edit_strategy':
                showEditStrategyDialog(dialog, mpId);
                break;
              case 'configure_models':
                if (strategy === 'single') {
                  showEditSingleModelDialog(dialog, mpId);
                } else {
                  showEditPerPhasePhaseListDialog(dialog, mpId);
                }
                break;
              case 'edit_description':
                showEditDescriptionDialog(dialog, mpId);
                break;
              case 'back':
                showActionsDialog(dialog, mpId);
                break;
            }
          },
        }),
      );
    };

    // ── Edit: Phases ───────────────────────────────────────────────────────

    const showEditPhasesDialog = (dialog, mpId, selectedPhases = null) => {
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
                showEditPhasesDialog(dialog, mpId, phases);
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
              showEditDialog(dialog, mpId);
            } else {
              const newPhases = phases.includes(option.value)
                ? phases.filter((p) => p !== option.value)
                : [...phases, option.value];
              showEditPhasesDialog(dialog, mpId, newPhases);
            }
          },
        }),
      );
    };

    // ── Edit: Model Strategy ───────────────────────────────────────────────

    const showEditStrategyDialog = (dialog, mpId) => {
      const mp = getModeProfile(mpId);
      if (!mp) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `ModeProfile '${mpId}' not found` });
        return;
      }
      const currentStrategy = mp.model_strategy || 'per-phase';

      const options = [
        {
          title: currentStrategy === 'single' ? '✓ Single model for all phases' : 'Single model for all phases',
          value: 'single',
          description: 'One model and effort level applies to every phase',
        },
        {
          title: currentStrategy === 'per-phase' ? '✓ One model per phase' : 'One model per phase',
          value: 'per-phase',
          description: 'Configure a different model and effort for each phase individually',
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
              showEditDialog(dialog, mpId);
            } else {
              try {
                updateModeProfile(mpId, { model_strategy: option.value });
                dialog.clear();
                api.ui.toast({
                  variant: 'success',
                  title: 'ModeProfile Updated',
                  message: `"${mp.name || mpId}" model strategy changed to ${option.value === 'single' ? 'single model' : 'per-phase'}`,
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

    // ── Edit: Configure Models (Single Strategy) ──────────────────────────
    // Flow: Model list → select model → effort list → select effort → save → back to model list

    const showEditSingleModelDialog = (dialog, mpId) => {
      const mp = getModeProfile(mpId);
      if (!mp) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `ModeProfile '${mpId}' not found` });
        return;
      }
      const currentPrimary = mp.default?.primary || 'opencode-go/glm-5.1';
      const currentEffort = mp.default?.effort || 'medium';

      const modelOptions = models.map((m) => ({
        title: m.id === currentPrimary ? `✓ ${m.label} — ${currentEffort} effort` : m.label,
        value: m.id,
        description: m.id === currentPrimary ? `Current model (${currentEffort} effort)` : m.description,
      }));

      modelOptions.push({
        title: '← Back to edit menu',
        value: '__back__',
        description: 'Return to edit menu',
      });

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Configure models for "${mp.name || mpId}" — Single model for all phases`,
          placeholder: 'Select a model to configure...',
          options: modelOptions,
          onSelect: (option) => {
            if (option.value === '__back__') {
              showEditDialog(dialog, mpId);
            } else {
              showEditSingleEffortDialog(dialog, mpId, option.value);
            }
          },
        }),
      );
    };

    const showEditSingleEffortDialog = (dialog, mpId, selectedModel) => {
      const mp = getModeProfile(mpId);
      if (!mp) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `ModeProfile '${mpId}' not found` });
        return;
      }
      const currentEffort = mp.default?.effort || 'medium';

      const effortOptions = EFFORT_LEVELS.map((e) => ({
        title: e === currentEffort && selectedModel === (mp.default?.primary || 'opencode-go/glm-5.1')
          ? `${e.charAt(0).toUpperCase() + e.slice(1)} (current)`
          : e.charAt(0).toUpperCase() + e.slice(1),
        value: e,
        description: getEffortDescription(e),
      }));

      effortOptions.push({
        title: '← Back to model list',
        value: '__back__',
        description: 'Return without saving',
      });

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Effort for ${getModelLabel(selectedModel, models)}`,
          placeholder: 'Select effort level...',
          options: effortOptions,
          current: currentEffort,
          onSelect: (option) => {
            if (option.value === '__back__') {
              showEditSingleModelDialog(dialog, mpId);
            } else {
              try {
                updateModeProfile(mpId, {
                  default: {
                    primary: selectedModel,
                    effort: option.value,
                    fallbacks: mp.default?.fallbacks || [],
                  },
                });
                // After saving, go back to model list to see the change
                showEditSingleModelDialog(dialog, mpId);
              } catch (err) {
                dialog.clear();
                api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
              }
            }
          },
        }),
      );
    };

    // ── Edit: Configure Models (Per-Phase Strategy) ────────────────────────
    // Flow: Phase list → select phase → model list → select model → effort list → select effort → save → back to phase list

    const showEditPerPhasePhaseListDialog = (dialog, mpId) => {
      const mp = getModeProfile(mpId);
      if (!mp) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `ModeProfile '${mpId}' not found` });
        return;
      }

      const options = (mp.phases || []).map((p) => {
        const phaseConfig = mp[p];
        const hasConfig = !!phaseConfig;
        return {
          title: hasConfig
            ? `${p.charAt(0).toUpperCase() + p.slice(1)} — ${getModelLabel(phaseConfig.primary, models)} / ${phaseConfig.effort || 'medium'}`
            : `${p.charAt(0).toUpperCase() + p.slice(1)} — (uses default)`,
          value: p,
          description: hasConfig
            ? `${getModelLabel(phaseConfig.primary, models)} at ${phaseConfig.effort || 'medium'} effort`
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
          title: `Configure models for "${mp.name || mpId}" — Select a phase`,
          placeholder: 'Select a phase to configure its model and effort...',
          options,
          onSelect: (option) => {
            if (option.value === '__back__') {
              showEditDialog(dialog, mpId);
            } else {
              showEditPerPhaseModelDialog(dialog, mpId, option.value);
            }
          },
        }),
      );
    };

    const showEditPerPhaseModelDialog = (dialog, mpId, phase) => {
      const mp = getModeProfile(mpId);
      if (!mp) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `ModeProfile '${mpId}' not found` });
        return;
      }
      const phaseConfig = mp[phase];
      const currentModel = phaseConfig?.primary || mp.default?.primary || 'opencode-go/glm-5.1';

      const modelOptions = models.map((m) => ({
        title: m.id === currentModel ? `✓ ${m.label}` : m.label,
        value: m.id,
        description: m.id === currentModel ? `Current model for ${phase}` : m.description,
      }));

      modelOptions.push({
        title: '← Back to phase list',
        value: '__back__',
        description: 'Return without saving',
      });

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `${phase.charAt(0).toUpperCase() + phase.slice(1)} — Select model`,
          placeholder: 'Choose the AI model for this phase...',
          options: modelOptions,
          onSelect: (option) => {
            if (option.value === '__back__') {
              showEditPerPhasePhaseListDialog(dialog, mpId);
            } else {
              showEditPerPhaseEffortDialog(dialog, mpId, phase, option.value);
            }
          },
        }),
      );
    };

    const showEditPerPhaseEffortDialog = (dialog, mpId, phase, selectedModel) => {
      const mp = getModeProfile(mpId);
      if (!mp) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `ModeProfile '${mpId}' not found` });
        return;
      }
      const phaseConfig = mp[phase];
      const currentEffort = phaseConfig?.effort || mp.default?.effort || 'medium';

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
          title: `${phase.charAt(0).toUpperCase() + phase.slice(1)} — Effort for ${getModelLabel(selectedModel, models)}`,
          placeholder: 'Select effort level...',
          options: effortOptions,
          current: currentEffort,
          onSelect: (option) => {
            if (option.value === '__back__') {
              showEditPerPhaseModelDialog(dialog, mpId, phase);
            } else {
              try {
                updateModeProfile(mpId, {
                  [phase]: {
                    primary: selectedModel,
                    effort: option.value,
                    fallbacks: phaseConfig?.fallbacks || mp.default?.fallbacks || [],
                  },
                });
                // After saving, go back to phase list to configure next phase
                showEditPerPhasePhaseListDialog(dialog, mpId);
              } catch (err) {
                dialog.clear();
                api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
              }
            }
          },
        }),
      );
    };

    // ── Edit: Description ──────────────────────────────────────────────────

    const showEditDescriptionDialog = (dialog, mpId) => {
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
          onCancel: () => showEditDialog(dialog, mpId),
        }),
      );
    };

    // ═══════════════════════════════════════════════════════════════════════
    // /rass-setup + /reasp-setup — Status, Workflow Switching, Agents
    // ═══════════════════════════════════════════════════════════════════════

    const showSetupDialog = (dialog) => {
      const status = getStatus();
      const reasp = getReaspStatus();
      const refiEnabled = reasp.features?.refi?.enabled !== false;

      const options = [
        {
          title: 'View Status',
          value: 'status',
          description: `Workflow: ${reasp.default_workflow} | ModeProfile: ${status.current_modeprofile || 'none'}`,
        },
        {
          title: 'Use Ryou EFI Planner',
          value: 'efi',
          description: 'Activate planning-first REFI workflow for packet generation and handoff',
        },
        {
          title: 'Use Ryou Orchestrator',
          value: 'orchestrator',
          description: 'Activate pragmatic implementation workflow after EFI planning is ready',
        },
        {
          title: refiEnabled ? 'Disable REFI Planning' : 'Enable REFI Planning',
          value: 'toggle-refi',
          description: refiEnabled ? 'Keep REASP installed but turn off the EFI planning workflow' : 'Turn REFI planning back on inside REASP',
        },
        {
          title: 'Switch to RyouSet',
          value: 'ryouset',
          description: 'Switch to RyouSet ModeProfile (full pipeline with all subagents)',
        },
        {
          title: 'View REASP Agents',
          value: 'agents',
          description: `${Object.keys(RYOU_AGENTS).length} agents including ryou-efi-planner and ryou-orchestrator`,
        },
      ];

      dialog.replace(
        () => api.ui.DialogSelect({
            title: 'REASP Setup',
            placeholder: 'Choose an action...',
            options,
            onSelect: (option) => {
              switch (option.value) {
                case 'status': {
                dialog.clear();
                  api.ui.toast({
                    variant: 'info',
                    title: 'REASP Status',
                    message: `Workflow: ${reasp.default_workflow} | ModeProfile: ${status.current_modeprofile || 'none'} | REFI: ${refiEnabled ? 'enabled' : 'disabled'}`,
                  });
                  break;
                }
                case 'efi': {
                  try {
                    setFeatureEnabled('refi', true);
                    setPrimaryWorkflow('ryou-efi-planner');
                    dialog.clear();
                    api.ui.toast({
                      variant: 'success',
                      title: 'Ryou EFI Planner Active',
                      message: 'REASP will now default to Ryou EFI Planner for REFI packet planning.',
                    });
                  } catch (err) {
                    dialog.clear();
                    api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
                  }
                  break;
                }
                case 'orchestrator': {
                  try {
                    setPrimaryWorkflow('ryou-orchestrator');
                    dialog.clear();
                    api.ui.toast({
                      variant: 'success',
                      title: 'Ryou Orchestrator Active',
                      message: 'REASP will now default to Ryou Orchestrator for implementation work.',
                    });
                  } catch (err) {
                    dialog.clear();
                    api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
                  }
                  break;
                }
                case 'toggle-refi': {
                  try {
                    const nextState = !refiEnabled;
                    const result = setFeatureEnabled('refi', nextState);
                    dialog.clear();
                    api.ui.toast({
                      variant: 'success',
                      title: nextState ? 'REFI Enabled' : 'REFI Disabled',
                      message: `REFI planning is now ${nextState ? 'enabled' : 'disabled'}. Active workflow: ${result.default_workflow}.`,
                    });
                  } catch (err) {
                    dialog.clear();
                    api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
                  }
                  break;
                }
                case 'ryouset': {
                  try {
                    switchModeProfile('ryouset');
                  dialog.clear();
                  api.ui.toast({
                    variant: 'success',
                    title: 'Switched to RyouSet',
                    message: 'ModeProfile: RyouSet — Full pipeline with per-phase model routing. Agent models synchronized.',
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
                    title: 'REASP Agents',
                    message: `${Object.keys(RYOU_AGENTS).length} agents configured, including Ryou EFI Planner for planning and Ryou Orchestrator for implementation.`,
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
        description: 'Legacy alias for REASP setup: status, workflow switching, and agent configuration',
        category: 'REASP',
        slash: { name: 'rass-setup', aliases: ['rs'] },
        onSelect: (dialog) => showSetupDialog(dialog),
      },
      {
        title: 'REASP Setup',
        value: 'reasp-setup',
        description: 'Switch between Ryou EFI Planner and Ryou Orchestrator, view REASP status, and toggle REFI planning',
        category: 'REASP',
        slash: { name: 'reasp-setup', aliases: ['reasp'] },
        onSelect: (dialog) => showSetupDialog(dialog),
      },
    ]);

    // ─── Cleanup ──────────────────────────────────────────────────────────
    api.lifecycle.onDispose(() => {
      disposeCommands?.();
    });
  },
};
