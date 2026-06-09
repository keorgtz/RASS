/**
 * RASS TUI Plugin — Ryou Adaptive SDD System
 * Provides /sdd-mode, /sdd-profile, and /rass-setup slash commands
 * with interactive dialogs, editors, multi-select toggles, and delete options.
 */

import {
  listModes,
  listProfiles,
  switchMode,
  switchProfile,
  createMode,
  createProfile,
  updateMode,
  updateProfile,
  deleteMode,
  deleteProfile,
  getMode,
  getProfile,
  getCurrentMode,
  getCurrentProfile,
  getStatus,
  AVAILABLE_PHASES,
  EFFORT_LEVELS,
  RYOU_AGENTS,
  RYOU_CONFIG_TEMPLATE,
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
  // This is only reached if api.state.provider is not available
  // This is only reached if api.state.provider is not available
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

function getModelLabel(modelId) {
  const model = models.find((m) => m.id === modelId);
  return model ? model.label : modelId;
}

function buildDefaultPhases(primaryPhase) {
  const presets = {
    orchestrator: ['orchestrator', 'apply', 'verify'],
    init: ['orchestrator', 'init', 'apply', 'verify'],
    explore: ['orchestrator', 'explore', 'apply', 'verify'],
    propose: ['orchestrator', 'explore', 'propose', 'apply', 'verify'],
    design: ['orchestrator', 'design', 'apply', 'verify'],
    apply: ['orchestrator', 'apply', 'verify'],
    verify: ['orchestrator', 'apply', 'verify'],
    archive: ['orchestrator', 'apply', 'verify', 'archive'],
  };
  return presets[primaryPhase] || ['orchestrator', 'apply', 'verify'];
}

// ─── Plugin Entry ────────────────────────────────────────────────────────────

export default {
  id: 'rass',
  tui: async (api, _options, _meta) => {
    // Discover all available models from OpenCode runtime
    const models = discoverModels(api);

    // ═══════════════════════════════════════════════════════════════════════
    // /sdd-mode — Switch, Create, Edit, or Delete SDD Modes
    // ═══════════════════════════════════════════════════════════════════════

    const showModeDialog = (dialog) => {
      const modes = listModes();
      const currentMode = getCurrentMode();

      const options = [
        ...modes.map((m) => ({
          title: m.id === currentMode ? `${m.name} (active)` : m.name,
          value: m.id,
          description: m.description || m.phases.join(' → '),
        })),
        {
          title: '+ Create New Mode...',
          value: '__create__',
          description: 'Create a custom SDD mode with your own phases',
        },
      ];

      dialog.replace(
        () => api.ui.DialogSelect({
          title: 'SDD Mode',
          placeholder: 'Select a mode or create new...',
          options,
          current: currentMode,
          onSelect: (option) => {
            if (option.value === '__create__') {
              showCreateModeNameDialog(dialog);
            } else {
              showModeActionsDialog(dialog, option.value);
            }
          },
        }),
      );
    };

    // ── Mode Actions (Switch / Edit / Delete) ─────────────────────────────

    const showModeActionsDialog = (dialog, modeId) => {
      const mode = getMode(modeId);
      if (!mode) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `Mode '${modeId}' not found` });
        return;
      }
      const currentMode = getCurrentMode();
      const isActive = modeId === currentMode;

      const options = [
        ...(isActive
          ? []
          : [{
              title: 'Switch to this mode',
              value: 'switch',
              description: `Activate "${mode.name}" — ${mode.phases.join(' → ')}`,
            }]),
        {
          title: 'Edit mode',
          value: 'edit',
          description: `Modify phases, effort, or description of "${mode.name}"`,
        },
        {
          title: 'Delete mode',
          value: 'delete',
          description: `Permanently delete "${mode.name}"`,
        },
        {
          title: '← Back',
          value: 'back',
          description: 'Return to mode list',
        },
      ];

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Mode: ${mode.name}`,
          placeholder: 'Choose an action...',
          options,
          onSelect: (opt) => {
            switch (opt.value) {
              case 'switch': {
                try {
                  switchMode(modeId);
                  dialog.clear();
                  api.ui.toast({
                    variant: 'success',
                    title: 'Mode Switched',
                    message: `Now using "${mode.name}" — ${mode.phases.join(' → ')}`,
                  });
                } catch (err) {
                  dialog.clear();
                  api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
                }
                break;
              }
              case 'edit':
                showEditModePhasesDialog(dialog, modeId);
                break;
              case 'delete':
                showDeleteModeConfirmDialog(dialog, modeId, mode.name);
                break;
              case 'back':
                showModeDialog(dialog);
                break;
            }
          },
        }),
      );
    };

    // ── Delete Mode Confirmation ──────────────────────────────────────────

    const showDeleteModeConfirmDialog = (dialog, modeId, modeName) => {
      dialog.replace(
        () => api.ui.DialogConfirm({
          title: `Delete "${modeName}"?`,
          message: `This will permanently delete the mode "${modeName}" (${modeId}). This cannot be undone.`,
          onConfirm: () => {
            try {
              deleteMode(modeId);
              dialog.clear();
              api.ui.toast({ variant: 'success', title: 'Mode Deleted', message: `"${modeName}" has been deleted` });
            } catch (err) {
              dialog.clear();
              api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
            }
          },
          onCancel: () => showModeActionsDialog(dialog, modeId),
        }),
      );
    };

    // ── Create Mode: Step 1 — Name ────────────────────────────────────────

    const showCreateModeNameDialog = (dialog) => {
      dialog.replace(
        () => api.ui.DialogPrompt({
          title: 'Create New SDD Mode — Enter a name (e.g., "custom-api", "rapid-prototype")',
          placeholder: 'mode-name',
          onConfirm: (name) => {
            if (!name || !name.trim()) {
              dialog.clear();
              api.ui.toast({ variant: 'error', title: 'Error', message: 'Mode name cannot be empty' });
              return;
            }
            showCreateModePhasesDialog(dialog, name.trim());
          },
          onCancel: () => showModeDialog(dialog),
        }),
      );
    };

    // ── Create Mode: Step 2 — Select Phases (toggle multi-select) ─────────

    const showCreateModePhasesDialog = (dialog, modeName, selectedPhases = null) => {
      const phases = selectedPhases || ['orchestrator', 'apply', 'verify'];

      const options = AVAILABLE_PHASES.map((p) => ({
        title: phases.includes(p) ? `✓ ${p.charAt(0).toUpperCase() + p.slice(1)}` : `  ${p.charAt(0).toUpperCase() + p.slice(1)}`,
        value: p,
        description: getPhaseDescription(p),
      }));

      options.push({
        title: '✓ Done — Confirm phase selection',
        value: '__done__',
        description: `Selected: ${phases.join(', ') || 'none'}`,
      });

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Phases for "${modeName}" — Select to toggle, Done to confirm`,
          placeholder: 'Select a phase to toggle it on/off...',
          options,
          onSelect: (option) => {
            if (option.value === '__done__') {
              if (phases.length === 0) {
                // Re-render with same state to show error
                showCreateModePhasesDialog(dialog, modeName, phases);
                return;
              }
              showCreateModeEffortDialog(dialog, modeName, phases);
            } else {
              // Toggle the phase
              const newPhases = phases.includes(option.value)
                ? phases.filter((p) => p !== option.value)
                : [...phases, option.value];
              showCreateModePhasesDialog(dialog, modeName, newPhases);
            }
          },
        }),
      );
    };

    // ── Create Mode: Step 3 — Effort Level ────────────────────────────────

    const showCreateModeEffortDialog = (dialog, modeName, phases) => {
      const effortOptions = EFFORT_LEVELS.map((e) => ({
        title: e.charAt(0).toUpperCase() + e.slice(1),
        value: e,
        description: getEffortDescription(e),
      }));

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Default effort for "${modeName}"`,
          placeholder: 'Select effort level...',
          options: effortOptions,
          current: 'medium',
          onSelect: (effortOption) => {
            try {
              createMode(modeName, phases, `Custom mode: ${modeName}`, effortOption.value);
              switchMode(modeName);
              dialog.clear();
              api.ui.toast({
                variant: 'success',
                title: 'Mode Created',
                message: `Created "${modeName}" with phases: ${phases.join(' → ')} at ${effortOption.value} effort`,
              });
            } catch (err) {
              dialog.clear();
              api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
            }
          },
        }),
      );
    };

    // ── Edit Mode: Step 1 — Edit Phases (toggle multi-select) ─────────────

    const showEditModePhasesDialog = (dialog, modeId, selectedPhases = null) => {
      const mode = getMode(modeId);
      if (!mode) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `Mode '${modeId}' not found` });
        return;
      }
      const phases = selectedPhases !== null ? selectedPhases : [...mode.phases];

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
        title: '← Change effort level',
        value: '__effort__',
        description: `Current: ${mode.default_effort || 'medium'}`,
      });
      options.push({
        title: '← Back to mode actions',
        value: '__back__',
        description: 'Return without saving',
      });

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Edit "${mode.name}" — Phases (toggle on/off, Done to save)`,
          placeholder: 'Select a phase to toggle it...',
          options,
          onSelect: (option) => {
            if (option.value === '__done__') {
              if (phases.length === 0) {
                showEditModePhasesDialog(dialog, modeId, phases);
                return;
              }
              try {
                updateMode(modeId, { phases });
                dialog.clear();
                api.ui.toast({
                  variant: 'success',
                  title: 'Mode Updated',
                  message: `"${mode.name}" phases updated: ${phases.join(' → ')}`,
                });
              } catch (err) {
                dialog.clear();
                api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
              }
            } else if (option.value === '__effort__') {
              showEditModeEffortDialog(dialog, modeId, phases);
            } else if (option.value === '__back__') {
              showModeActionsDialog(dialog, modeId);
            } else {
              const newPhases = phases.includes(option.value)
                ? phases.filter((p) => p !== option.value)
                : [...phases, option.value];
              showEditModePhasesDialog(dialog, modeId, newPhases);
            }
          },
        }),
      );
    };

    // ── Edit Mode: Step 2 — Change Effort Level ───────────────────────────

    const showEditModeEffortDialog = (dialog, modeId, currentPhases) => {
      const mode = getMode(modeId);
      if (!mode) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `Mode '${modeId}' not found` });
        return;
      }

      const effortOptions = EFFORT_LEVELS.map((e) => ({
        title: e === (mode.default_effort || 'medium') ? `${e.charAt(0).toUpperCase() + e.slice(1)} (current)` : e.charAt(0).toUpperCase() + e.slice(1),
        value: e,
        description: getEffortDescription(e),
      }));

      effortOptions.push({
        title: '← Back to phases',
        value: '__back__',
        description: 'Return to phase editor',
      });

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Edit "${mode.name}" — Effort Level`,
          placeholder: 'Select effort level...',
          options: effortOptions,
          current: mode.default_effort || 'medium',
          onSelect: (option) => {
            if (option.value === '__back__') {
              showEditModePhasesDialog(dialog, modeId, currentPhases);
            } else {
              try {
                updateMode(modeId, { default_effort: option.value, phases: currentPhases });
                dialog.clear();
                api.ui.toast({
                  variant: 'success',
                  title: 'Mode Updated',
                  message: `"${mode.name}" effort changed to ${option.value}`,
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

    // ═══════════════════════════════════════════════════════════════════════
    // /sdd-profile — Switch, Create, Edit, or Delete SDD Profiles
    // ═══════════════════════════════════════════════════════════════════════

    const showProfileDialog = (dialog) => {
      const profiles = listProfiles();
      const currentProfile = getCurrentProfile();

      const options = [
        ...profiles.map((p) => ({
          title: p.id === currentProfile ? `${p.name} (active)` : p.name,
          value: p.id,
          description: p.description || `Primary: ${p.default?.primary || 'unknown'}`,
        })),
        {
          title: '+ Create New Profile...',
          value: '__create__',
          description: 'Create a custom SDD profile with your model preferences',
        },
      ];

      dialog.replace(
        () => api.ui.DialogSelect({
          title: 'SDD Profile',
          placeholder: 'Select a profile or create new...',
          options,
          current: currentProfile,
          onSelect: (option) => {
            if (option.value === '__create__') {
              showCreateProfileNameDialog(dialog);
            } else {
              showProfileActionsDialog(dialog, option.value);
            }
          },
        }),
      );
    };

    // ── Profile Actions (Switch / Edit / Delete) ──────────────────────────

    const showProfileActionsDialog = (dialog, profileId) => {
      const profileData = getProfile(profileId);
      if (!profileData) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `Profile '${profileId}' not found` });
        return;
      }
      const currentProfile = getCurrentProfile();
      const isActive = profileId === currentProfile;
      const profileName = profileData.name || profileId;

      const options = [
        ...(isActive
          ? []
          : [{
              title: 'Switch to this profile',
              value: 'switch',
              description: `Activate "${profileName}" — ${getModelLabel(profileData.default?.primary || 'unknown')}`,
            }]),
        {
          title: 'Edit default model & effort',
          value: 'edit_default',
          description: `Current: ${getModelLabel(profileData.default?.primary || 'unknown')} at ${profileData.default?.effort || 'medium'} effort`,
        },
        {
          title: 'Edit phase model overrides',
          value: 'edit_phases',
          description: 'Set per-phase model and effort overrides',
        },
        {
          title: 'Edit fallback models',
          value: 'edit_fallbacks',
          description: `Current fallbacks: ${(profileData.default?.fallbacks || []).map(getModelLabel).join(', ') || 'none'}`,
        },
        {
          title: 'Delete profile',
          value: 'delete',
          description: `Permanently delete "${profileName}"`,
        },
        {
          title: '← Back',
          value: 'back',
          description: 'Return to profile list',
        },
      ];

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Profile: ${profileName}`,
          placeholder: 'Choose an action...',
          options,
          onSelect: (opt) => {
            switch (opt.value) {
              case 'switch': {
                try {
                  switchProfile(profileId);
                  dialog.clear();
                  api.ui.toast({
                    variant: 'success',
                    title: 'Profile Switched',
                    message: `Now using "${profileName}" profile`,
                  });
                } catch (err) {
                  dialog.clear();
                  api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
                }
                break;
              }
              case 'edit_default':
                showEditProfilePrimaryModelDialog(dialog, profileId);
                break;
              case 'edit_phases':
                showEditProfilePhaseSelectDialog(dialog, profileId);
                break;
              case 'edit_fallbacks':
                showEditProfileFallbacksDialog(dialog, profileId);
                break;
              case 'delete':
                showDeleteProfileConfirmDialog(dialog, profileId, profileName);
                break;
              case 'back':
                showProfileDialog(dialog);
                break;
            }
          },
        }),
      );
    };

    // ── Delete Profile Confirmation ───────────────────────────────────────

    const showDeleteProfileConfirmDialog = (dialog, profileId, profileName) => {
      dialog.replace(
        () => api.ui.DialogConfirm({
          title: `Delete "${profileName}"?`,
          message: `This will permanently delete the profile "${profileName}" (${profileId}). This cannot be undone.`,
          onConfirm: () => {
            try {
              deleteProfile(profileId);
              dialog.clear();
              api.ui.toast({ variant: 'success', title: 'Profile Deleted', message: `"${profileName}" has been deleted` });
            } catch (err) {
              dialog.clear();
              api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
            }
          },
          onCancel: () => showProfileActionsDialog(dialog, profileId),
        }),
      );
    };

    // ── Create Profile: Step 1 — Name ──────────────────────────────────────

    const showCreateProfileNameDialog = (dialog) => {
      dialog.replace(
        () => api.ui.DialogPrompt({
          title: 'Create New SDD Profile — Enter a name (e.g., "my-custom", "focus-code")',
          placeholder: 'profile-name',
          onConfirm: (name) => {
            if (!name || !name.trim()) {
              dialog.clear();
              api.ui.toast({ variant: 'error', title: 'Error', message: 'Profile name cannot be empty' });
              return;
            }
            showCreateProfilePrimaryModelDialog(dialog, name.trim());
          },
          onCancel: () => showProfileDialog(dialog),
        }),
      );
    };

    // ── Create Profile: Step 2 — Primary Model ────────────────────────────

    const showCreateProfilePrimaryModelDialog = (dialog, profileName) => {
      const modelOptions = models.map((m) => ({
        title: m.label,
        value: m.id,
        description: m.description,
      }));

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Primary model for "${profileName}"`,
          placeholder: 'Select the primary AI model...',
          options: modelOptions,
          onSelect: (modelOption) => {
            showCreateProfileEffortDialog(dialog, profileName, modelOption.value);
          },
        }),
      );
    };

    // ── Create Profile: Step 3 — Effort Level ─────────────────────────────

    const showCreateProfileEffortDialog = (dialog, profileName, primaryModel) => {
      const effortOptions = EFFORT_LEVELS.map((e) => ({
        title: e.charAt(0).toUpperCase() + e.slice(1),
        value: e,
        description: getEffortDescription(e),
      }));

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Default effort for "${profileName}"`,
          placeholder: 'Select effort level...',
          options: effortOptions,
          current: 'medium',
          onSelect: (effortOption) => {
            showCreateProfileFallbacksDialog(dialog, profileName, primaryModel, effortOption.value);
          },
        }),
      );
    };

    // ── Create Profile: Step 4 — Fallback Models (toggle multi-select) ────

    const showCreateProfileFallbacksDialog = (dialog, profileName, primaryModel, effort, selectedFallbacks = []) => {
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
        title: '✓ Done — Create profile',
        value: '__done__',
        description: `Primary: ${getModelLabel(primaryModel)} | Fallbacks: ${selectedFallbacks.map(getModelLabel).join(', ') || 'none'}`,
      });

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Fallback models for "${profileName}" — Toggle with Enter, Done to confirm`,
          placeholder: 'Select a model to toggle it as fallback...',
          options,
          onSelect: (option) => {
            if (option.value === '__done__') {
              try {
                createProfile(
                  profileName,
                  {
                    default: {
                      primary: primaryModel,
                      effort,
                      fallbacks: selectedFallbacks,
                    },
                  },
                  `Custom profile: ${profileName}`,
                );
                switchProfile(profileName);
                dialog.clear();
                api.ui.toast({
                  variant: 'success',
                  title: 'Profile Created',
                  message: `Created "${profileName}" with ${getModelLabel(primaryModel)} at ${effort} effort`,
                });
              } catch (err) {
                dialog.clear();
                api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
              }
            } else if (option.disabled) {
              // Skip primary model, re-render same state
              showCreateProfileFallbacksDialog(dialog, profileName, primaryModel, effort, selectedFallbacks);
            } else {
              // Toggle fallback
              const newFallbacks = selectedFallbacks.includes(option.value)
                ? selectedFallbacks.filter((f) => f !== option.value)
                : [...selectedFallbacks, option.value];
              showCreateProfileFallbacksDialog(dialog, profileName, primaryModel, effort, newFallbacks);
            }
          },
        }),
      );
    };

    // ── Edit Profile: Default Model & Effort ───────────────────────────────

    const showEditProfilePrimaryModelDialog = (dialog, profileId) => {
      const profileData = getProfile(profileId);
      if (!profileData) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `Profile '${profileId}' not found` });
        return;
      }
      const currentPrimary = profileData.default?.primary || 'opencode-go/glm-5.1';

      const modelOptions = models.map((m) => ({
        title: m.id === currentPrimary ? `${m.label} (current)` : m.label,
        value: m.id,
        description: m.description,
      }));

      modelOptions.push({
        title: '← Back to profile actions',
        value: '__back__',
        description: 'Return without saving',
      });

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Edit "${profileData.name || profileId}" — Primary Model`,
          placeholder: 'Select the primary AI model...',
          options: modelOptions,
          current: currentPrimary,
          onSelect: (option) => {
            if (option.value === '__back__') {
              showProfileActionsDialog(dialog, profileId);
            } else {
              showEditProfileEffortDialog(dialog, profileId, option.value);
            }
          },
        }),
      );
    };

    // ── Edit Profile: Default Effort ───────────────────────────────────────

    const showEditProfileEffortDialog = (dialog, profileId, newPrimary) => {
      const profileData = getProfile(profileId);
      if (!profileData) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `Profile '${profileId}' not found` });
        return;
      }
      const currentEffort = profileData.default?.effort || 'medium';

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
          title: `Edit "${profileData.name || profileId}" — Default Effort`,
          placeholder: 'Select effort level...',
          options: effortOptions,
          current: currentEffort,
          onSelect: (option) => {
            if (option.value === '__back__') {
              showEditProfilePrimaryModelDialog(dialog, profileId);
            } else {
              try {
                updateProfile(profileId, {
                  default: {
                    primary: newPrimary,
                    effort: option.value,
                    fallbacks: profileData.default?.fallbacks || [],
                  },
                });
                dialog.clear();
                api.ui.toast({
                  variant: 'success',
                  title: 'Profile Updated',
                  message: `Default set to ${getModelLabel(newPrimary)} at ${option.value} effort`,
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

    // ── Edit Profile: Phase Model Overrides ───────────────────────────────

    const showEditProfilePhaseSelectDialog = (dialog, profileId) => {
      const profileData = getProfile(profileId);
      if (!profileData) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `Profile '${profileId}' not found` });
        return;
      }

      const options = AVAILABLE_PHASES.map((p) => {
        const override = profileData[p];
        const hasOverride = !!override;
        return {
          title: hasOverride ? `✓ ${p.charAt(0).toUpperCase() + p.slice(1)} — ${getModelLabel(override.primary)} / ${override.effort || 'default'}` : `  ${p.charAt(0).toUpperCase() + p.slice(1)} — (uses default)`,
          value: p,
          description: hasOverride ? `Override: ${getModelLabel(override.primary)}, effort: ${override.effort || 'default'}` : `Inherits default: ${getModelLabel(profileData.default?.primary || 'unknown')}`,
        };
      });

      options.push({
        title: '← Back to profile actions',
        value: '__back__',
        description: 'Return to profile actions',
      });

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Edit "${profileData.name || profileId}" — Phase Overrides`,
          placeholder: 'Select a phase to set its model override...',
          options,
          onSelect: (option) => {
            if (option.value === '__back__') {
              showProfileActionsDialog(dialog, profileId);
            } else {
              showEditProfilePhaseModelDialog(dialog, profileId, option.value);
            }
          },
        }),
      );
    };

    // ── Edit Profile: Phase Override — Model Selection ─────────────────────

    const showEditProfilePhaseModelDialog = (dialog, profileId, phase) => {
      const profileData = getProfile(profileId);
      if (!profileData) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `Profile '${profileId}' not found` });
        return;
      }
      const currentOverride = profileData[phase];
      const currentModel = currentOverride?.primary || profileData.default?.primary || 'opencode-go/glm-5.1';

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
              showEditProfilePhaseSelectDialog(dialog, profileId);
            } else if (option.value === '__remove__') {
              try {
                updateProfile(profileId, { removePhases: [phase] });
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
              showEditProfilePhaseEffortDialog(dialog, profileId, phase, option.value);
            }
          },
        }),
      );
    };

    // ── Edit Profile: Phase Override — Effort Selection ────────────────────

    const showEditProfilePhaseEffortDialog = (dialog, profileId, phase, modelId) => {
      const profileData = getProfile(profileId);
      if (!profileData) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `Profile '${profileId}' not found` });
        return;
      }
      const currentOverride = profileData[phase];
      const currentEffort = currentOverride?.effort || profileData.default?.effort || 'medium';

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
          title: `${phase.charAt(0).toUpperCase() + phase.slice(1)} — Effort for ${getModelLabel(modelId)}`,
          placeholder: 'Select effort level...',
          options: effortOptions,
          current: currentEffort,
          onSelect: (option) => {
            if (option.value === '__back__') {
              showEditProfilePhaseModelDialog(dialog, profileId, phase);
            } else {
              try {
                updateProfile(profileId, {
                  [phase]: {
                    primary: modelId,
                    effort: option.value,
                    fallbacks: currentOverride?.fallbacks || profileData.default?.fallbacks || [],
                  },
                });
                dialog.clear();
                api.ui.toast({
                  variant: 'success',
                  title: 'Override Set',
                  message: `${phase} will use ${getModelLabel(modelId)} at ${option.value} effort`,
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

    // ── Edit Profile: Fallback Models (toggle multi-select) ───────────────

    const showEditProfileFallbacksDialog = (dialog, profileId, selectedFallbacks = null) => {
      const profileData = getProfile(profileId);
      if (!profileData) {
        dialog.clear();
        api.ui.toast({ variant: 'error', title: 'Error', message: `Profile '${profileId}' not found` });
        return;
      }
      const primary = profileData.default?.primary || 'opencode-go/glm-5.1';
      const fallbacks = selectedFallbacks !== null ? selectedFallbacks : [...(profileData.default?.fallbacks || [])];

      const options = models.map((m) => {
        if (m.id === primary) {
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
        title: '✓ Done — Save fallbacks',
        value: '__done__',
        description: `Fallbacks: ${fallbacks.map(getModelLabel).join(', ') || 'none'}`,
      });
      options.push({
        title: '← Back to profile actions',
        value: '__back__',
        description: 'Return without saving',
      });

      dialog.replace(
        () => api.ui.DialogSelect({
          title: `Edit "${profileData.name || profileId}" — Fallback Models`,
          placeholder: 'Toggle fallbacks with Enter, Done to save...',
          options,
          onSelect: (option) => {
            if (option.value === '__done__') {
              try {
                updateProfile(profileId, {
                  default: {
                    primary,
                    effort: profileData.default?.effort || 'medium',
                    fallbacks,
                  },
                });
                dialog.clear();
                api.ui.toast({
                  variant: 'success',
                  title: 'Fallbacks Updated',
                  message: `Fallbacks: ${fallbacks.map(getModelLabel).join(', ') || 'none'}`,
                });
              } catch (err) {
                dialog.clear();
                api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
              }
            } else if (option.value === '__back__') {
              showProfileActionsDialog(dialog, profileId);
            } else if (option.disabled) {
              showEditProfileFallbacksDialog(dialog, profileId, fallbacks);
            } else {
              const newFallbacks = fallbacks.includes(option.value)
                ? fallbacks.filter((f) => f !== option.value)
                : [...fallbacks, option.value];
              showEditProfileFallbacksDialog(dialog, profileId, newFallbacks);
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
          description: `Mode: ${status.current_mode || 'none'} | Profile: ${status.current_profile || 'none'}`,
        },
        {
          title: 'RyouSet Mode + Profile',
          value: 'ryouset',
          description: 'Switch to RyouSet mode and profile (your exact config)',
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
                  message: `Mode: ${status.current_mode || 'none'} | Profile: ${status.current_profile || 'none'} | Phases: ${status.mode?.phases?.join(' → ') || 'none'}`,
                });
                break;
              }
              case 'ryouset': {
                try {
                  switchMode('ryouset');
                  switchProfile('ryouset');
                  dialog.clear();
                  api.ui.toast({
                    variant: 'success',
                    title: 'Switched to RyouSet',
                    message: 'Mode: RyouSet | Profile: RyouSet — Full pipeline with your exact model routing',
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
        title: 'SDD Mode',
        value: 'sdd-mode',
        description: 'Switch, create, edit, or delete SDD modes',
        category: 'RASS',
        slash: { name: 'sdd-mode', aliases: ['sm'] },
        onSelect: (dialog) => showModeDialog(dialog),
      },
      {
        title: 'SDD Profile',
        value: 'sdd-profile',
        description: 'Switch, create, edit, or delete SDD profiles',
        category: 'RASS',
        slash: { name: 'sdd-profile', aliases: ['sp'] },
        onSelect: (dialog) => showProfileDialog(dialog),
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