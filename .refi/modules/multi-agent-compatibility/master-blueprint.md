# Master Blueprint · REASP Multi-Agent Compatibility

## 1. Problem Statement

REASP currently ships as an OpenCode plugin + global configuration. It is hard-wired to:

- `~/.config/opencode/opencode.json`
- OpenCode agent definitions
- OpenCode plugin system (`plugin.js` / `tui.js`)
- OpenCode-specific permissions, skills, and instructions

This means users who also work with Claude Code, Antigravity CLI, Gemini CLI, or Codex cannot benefit from the Ryou workflow, REFI packets, or MeridianUI rules outside OpenCode.

## 2. Goal

Make REASP installable into multiple AI agent targets while keeping OpenCode as the reference implementation. The installer becomes an **Agent Target Adapter** that translates the same REASP source material into the native format of each selected agent.

## 3. Core Design Principle

> **One source of truth, many native surfaces.**

The existing `.opencode/` assets remain the canonical REASP definition. The installer reads those assets and emits a target-specific configuration for each selected agent. We do not fork REASP per agent; we adapt it.

## 4. Conceptual Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    REASP Source of Truth                    │
│  .opencode/                                                 │
│  ├── agents/            (ryou-orchestrator, efi-planner…)   │
│  ├── rules/             (global-rules.md, meridianui.md)    │
│  ├── refi/              (README.md, config.yaml, rules/)    │
│  ├── phases/            (orchestrator.md … archive.md)      │
│  ├── sdd-profiles/      (ryouset.json …)                    │
│  ├── runtime/                                               │
│  └── plugin.js / tui.js / rass-core.js                      │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
   ┌────────────┐  ┌────────────┐  ┌────────────┐
   │  Adapter   │  │  Adapter   │  │  Adapter   │
   │  OpenCode  │  │ Claude Code│  │   Codex    │
   └─────┬──────┘  └─────┬──────┘  └─────┬──────┘
         │               │               │
   ~/.config/opencode/   ~/.claude/      ~/.codex/
   opencode.json         CLAUDE.md        instructions.md
   plugin.js             settings.json    config.json
   tui.js
```

## 5. Agent Target Abstraction

Each supported agent is modeled as a **Target** with the following contract:

| Field | Description |
|-------|-------------|
| `id` | Machine identifier, e.g. `opencode`, `claude-code`, `antigravity`, `gemini`, `codex` |
| `displayName` | Human label for the TUI |
| `globalConfigDir` | Default directory where the agent stores global configuration |
| `detectCommands` | CLI commands used to verify the agent is installed |
| `detectPaths` | Common filesystem paths that indicate installation |
| `capabilities` | Set of features supported: `agents`, `plugins`, `slashCommands`, `mcp`, `instructions`, `permissions`, `models` |
| `outputFormat` | How REASP material is written: `json`, `markdown`, `yaml`, `toml` |
| `emitter` | Function/reference that writes the target-specific files |

## 6. Capability Mapping

Not every agent supports the same concepts. The adapter must degrade gracefully:

| REASP Concept | OpenCode | Claude Code | Antigravity | Gemini CLI | Codex |
|---------------|----------|-------------|-------------|------------|-------|
| Ryou agents (`ryou-orchestrator`, `ryou-efi-planner`, subagents) | Native agent definitions | System/project instructions + role sections | Target-specific prompts | Target-specific prompts | Target-specific prompts |
| Global rules (`rules/global-rules.md`) | `instructions[]` | Concatenated into `CLAUDE.md` | Concatenated into prompt | Concatenated into prompt | Concatenated into prompt |
| MeridianUI rules | `instructions[]` | Concatenated into `CLAUDE.md` | Concatenated | Concatenated | Concatenated |
| REFI rules | `instructions[]` + `refi/config.yaml` | `CLAUDE.md` + embedded config | Embedded config block | Embedded config block | Embedded config block |
| ModeProfiles (`sdd-profiles/*.json`) | Native via plugin + runtime | Documented in prompt; optional CLI helper script | Documented in prompt | Documented in prompt | Documented in prompt |
| `/sdd` slash commands | Native plugin | Mentioned as available verbs in prompt; optional wrapper script | Mentioned as available verbs | Mentioned as available verbs | Mentioned as available verbs |
| `sdd_mode_profile` tool | Native tool | Emulated via prompt instructions | Emulated via prompt | Emulated via prompt | Emulated via prompt |
| `rass_setup` / `reasp_setup` tools | Native tool | Emulated via prompt | Emulated via prompt | Emulated via prompt | Emulated via prompt |
| Permissions | Native `permission` block | Agent's own permission model; document boundaries | Document boundaries | Document boundaries | Document boundaries |
| Skills | Native `skill` block | Load instructions manually | Manual | Manual | Manual |
| Model routing | Native `model` per agent | Suggest models in prompt | Suggest models | Suggest models | Suggest models |

## 7. Source Asset Transformation

The installer performs these transformations per target:

1. **Read canonical assets** from `.opencode/`.
2. **Resolve active ModeProfile** (default `ryouset`) to obtain model mapping.
3. **Select workflow** (`ryou-orchestrator` vs `ryou-efi-planner`).
4. **Compile prompt bundles**:
   - Primary role prompt (`ryou-orchestrator.md` or `ryou-efi-planner.md`)
   - Global rules
   - MeridianUI rules
   - REFI README + rules
   - Phase prompts relevant to the selected ModeProfile
5. **Emit target files**:
   - OpenCode: write `opencode.json`, copy plugin/runtime/assets.
   - Claude Code: write `~/.claude/CLAUDE.md` (or project `CLAUDE.md`) and optional `~/.claude/settings.json`.
   - Codex: write `~/.codex/instructions.md` and/or `~/.codex/config.json`.
   - Gemini CLI: write `~/.gemini/instructions.md` and/or `~/.gemini/config.json`.
   - Antigravity CLI: write to its documented config location.
6. **Register/install** any target-specific artifacts (plugins, MCP servers, wrapper scripts).

## 8. Installer User Flow

```text
1. Run installer (interactive or CLI)
2. Detect installed agents
3. Show TUI list with checkboxes:
   [✓] OpenCode     (detected)
   [✓] Claude Code  (detected)
   [ ] Antigravity  (not detected)
   [ ] Gemini CLI   (detected)
   [✓] Codex        (detected)
4. User confirms selection
5. Select ModeProfile (ryouset, fast, architecture, ui, debug, enterprise, legacy, minimal)
6. Select default workflow agent (Ryou EFI Planner / Ryou Orchestrator)
7. Install per selected target
8. Show per-target summary and next commands
```

## 9. Backwards Compatibility

- Existing OpenCode behavior must remain unchanged.
- The `node installer/index.js install` command without flags continues to install OpenCode globally as it does today.
- New flags (`--agents`, `--only-detected`, `--dry-run`) are additive.
- Uninstall continues to clean OpenCode by default; additional targets are cleaned only if selected.

## 10. CLI Surface Additions

```text
node installer/index.js install --agents opencode,claude-code,codex
node installer/index.js install --only-detected
node installer/index.js install --dry-run
node installer/index.js uninstall --agents claude-code,codex
node installer/index.js status
node installer/index.js detect
```

## 11. File Layout After Change

```text
REASP/
├── .opencode/                          (unchanged, canonical source)
├── installer/
│   ├── index.js                        (refactored into orchestrator)
│   ├── package.json
│   ├── lib/
│   │   ├── targets/
│   │   │   ├── opencode.js             (existing behavior extracted)
│   │   │   ├── claude-code.js          (new)
│   │   │   ├── antigravity.js          (new, placeholder)
│   │   │   ├── gemini.js               (new)
│   │   │   └── codex.js                (new)
│   │   ├── detect.js                   (agent discovery)
│   │   ├── compile.js                  (prompt bundle compiler)
│   │   ├── tui.js                      (interactive prompts)
│   │   └── constants.js                (paths, capabilities, defaults)
│   └── templates/                      (target-specific templates)
│       ├── claude-code-ryou.md.hbs
│       ├── codex-ryou.md.hbs
│       ├── gemini-ryou.md.hbs
│       └── antigravity-ryou.md.hbs
├── .refi/
│   └── modules/
│       └── multi-agent-compatibility/  (this packet)
└── README.md                           (updated)
```

## 12. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Agent CLI config format changes | Isolate format logic in per-target adapter files; version the emitter. |
| Agents do not support "agents" concept | Degrade to a single system prompt with explicit role switching instructions. |
| Permission model differs widely | Document boundaries in the prompt; do not try to enforce non-OpenCode permissions. |
| OpenCode behavior accidentally regresses | Extract OpenCode logic into its own adapter module and keep existing tests/manual verification. |
| Maintenance burden grows | Keep `.opencode/` as source of truth; adapters are thin translators. |

## 13. Open Questions

- Exact global config paths and file formats for Antigravity CLI, Gemini CLI, and Codex (to be resolved in Shard 01).
- Whether any target supports MCP, custom slash commands, or project-level config files.
- Desired default enablement behavior when an agent is detected but the user did not explicitly select it.
