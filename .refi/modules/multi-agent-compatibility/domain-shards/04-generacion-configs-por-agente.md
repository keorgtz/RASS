# Domain Shard 04 · Per-Agent Configuration Generation

## Objective

Implement the adapters that convert canonical REASP assets into each target agent's native format.

## Shared Compilation Pipeline

`lib/compile.js` produces a normalized bundle:

```js
{
  workflow: 'ryou-orchestrator',      // or 'ryou-efi-planner'
  modeProfile: 'ryouset',
  language: 'es-MX',
  rolePrompt: '…',                    // full text of the primary agent markdown
  globalRules: '…',                   // rules/global-rules.md
  meridianuiRules: '…',               // rules/meridianui.md
  refiReadme: '…',                    // refi/README.md
  refiConfigYaml: '…',                // refi/config.yaml as embedded text
  refiRules: ['…', '…'],              // refi/rules/*.md
  phasePrompts: { orchestrator: '…', init: '…', ... },
  modeProfileJson: { ... },           // parsed sdd-profiles/<profile>.json
  modelMapping: { 'ryou-orchestrator': 'opencode-go/kimi-k2.7-code', ... },
  effectivePhases: ['orchestrator', 'init', 'explore', 'propose', 'design', 'apply', 'verify', 'archive'],
}
```

## Target-Specific Emitters

### OpenCode (`lib/targets/opencode.js`)

Behavior: preserve existing installer logic, moved into adapter shape.

- Write `~/.config/opencode/opencode.json` agents/instructions/permissions.
- Copy plugin/runtime/assets to `~/.config/opencode/`.
- Register plugin via CLI or manual fallback.
- Do not break existing functionality.

### Claude Code (`lib/targets/claude-code.js`)

- Output file: `~/.claude/CLAUDE.md` (global) or `.claude/CLAUDE.md` (project-local option).
- Optional: `~/.claude/settings.json` for model/preferences.
- Content structure:
  1. `# Ryou / REASP for Claude Code`
  2. Role section (Orchestrator or EFI Planner)
  3. Global rules
  4. MeridianUI source-of-truth block
  5. REFI config + rules
  6. Phase guide for current ModeProfile
  7. Model recommendations
  8. Handoff rules

### Codex (`lib/targets/codex.js`)

- Output file: `~/.codex/instructions.md` (or `~/.codex/config.json` if supported).
- Similar structure to Claude Code, adapted to Codex conventions.

### Gemini CLI (`lib/targets/gemini.js`)

- Output file: `~/.gemini/instructions.md` (or equivalent).
- Adapt model references to Gemini model IDs.

### Antigravity CLI (`lib/targets/antigravity.js`)

- Output file: to be determined by Shard 01.
- Start with a placeholder that throws a helpful error until format is verified.

## Prompt Template Strategy

Use simple string templates, not a heavy templating engine. Each target can have a `templates/<target>-<workflow>.md.hbs` file that is read and interpolated.

Interpolation tokens:

- `{{ROLE_PROMPT}}`
- `{{GLOBAL_RULES}}`
- `{{MERIDIANUI_RULES}}`
- `{{REFI_README}}`
- `{{REFI_CONFIG_YAML}}`
- `{{REFI_RULES}}`
- `{{MODEPROFILE_DESCRIPTION}}`
- `{{MODEL_MAPPING}}`
- `{{EFFECTIVE_PHASES}}`

## Verification Gate

- Each adapter writes valid files for its target.
- Claude Code can load `~/.claude/CLAUDE.md` and respond as Ryou Orchestrator.
- OpenCode output is byte-for-byte equivalent to the legacy installer for the same options.
