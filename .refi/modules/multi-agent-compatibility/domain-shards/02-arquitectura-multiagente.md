# Domain Shard 02 · Multi-Agent Adapter Architecture

## Objective

Design the internal structure that lets the installer translate canonical REASP assets into any agent target without forking the source of truth.

## Components

### 2.1 `lib/constants.js`

Central constants:

- `SOURCE_DIR`: `path.resolve(__dirname, '../../.opencode')`
- `DEFAULT_MODEPROFILE`: `'ryouset'`
- `AGENT_TARGETS`: array of target descriptors (id, displayName, default enabled, capabilities).
- `REASP_ASSETS`: canonical source files and directories.

### 2.2 `lib/detect.js`

Agent discovery module:

- `detectAllAgents()` → returns array of `{ id, installed, version, path, detectedBy }`
- Detection strategy per target:
  - Try CLI command first.
  - Fall back to known filesystem paths.
  - Cache results during a single installer run.

### 2.3 `lib/compile.js`

Prompt/asset compiler:

- `compileReaspBundle(options)` where options include:
  - `workflow`: `'ryou-orchestrator' | 'ryou-efi-planner'`
  - `modeProfile`: string
  - `language`: `'es-MX' | 'en'`
- Returns a structured object:
  - `rolePrompt`
  - `rules`
  - `refiConfig`
  - `modeProfileDescription`
  - `availablePhases`
  - `modelMapping`

### 2.4 `lib/targets/<agent>.js`

One adapter per target implementing:

- `id`: string
- `displayName`: string
- `capabilities`: object
- `detect(ctx)`: boolean
- `getGlobalDir(ctx)`: string
- `install(ctx, bundle)`: { success, message, pathsWritten }
- `uninstall(ctx)`: { success, message, pathsRemoved }
- `isInstalled(ctx)`: boolean

### 2.5 `lib/tui.js`

Interactive prompts extracted/refactored from `index.js`:

- `promptAgentSelection(detectedAgents)`
- `promptModeProfile()`
- `promptWorkflowAgent()`
- `confirmInstall(selectedAgents)`

### 2.6 `index.js` (refactored)

Becomes a thin orchestrator:

1. Parse CLI args.
2. Detect agents.
3. Resolve selected agents.
4. Load ModeProfile.
5. Compile bundle.
6. For each selected target, call `target.install()`.
7. Render summary.

## Design Rules

- No hard-coded target logic inside `index.js`.
- OpenCode adapter is the only one allowed to copy plugin/runtime assets; other adapters emit prompts/config only.
- Each adapter validates its own output before writing.
- If a target is selected but not detected, warn and require explicit confirmation.

## Verification Gate

- `detect.js` correctly identifies installed agents on the developer machine.
- Adding a new stub target requires only creating a new file in `lib/targets/`.
