# REASP Agent Target Reference

This document describes how REASP adapts to each supported AI agent CLI.

## Adapter Architecture

Each agent is implemented as a target module under `lib/targets/<agent-id>.js`. The orchestrator in `index.js` calls the same contract for every target:

```js
{
  id,              // machine identifier
  displayName,     // human label
  capabilities,    // feature flags
  detect(ctx),     // return detection result
  getGlobalDir(ctx),
  isInstalled(ctx),
  install(ctx, bundle),
  uninstall(ctx)
}
```

The canonical REASP assets live in `.opencode/`. `lib/compile.js` reads those assets and produces a normalized `bundle` object containing role prompts, rules, REFI config, phase prompts, subagent prompts, and model mapping. Each target adapter translates that bundle into the native format of its agent.

## Supported Agents

| Agent | ID | Global dir (all OS) | File written | Status |
|-------|----|---------------------|--------------|--------|
| OpenCode | `opencode` | `~/.config/opencode/` | `opencode.json` + plugin/runtime assets | Reference implementation |
| Claude Code | `claude-code` | `~/.claude/` | `CLAUDE.md` | Stable |
| Codex | `codex` | `~/.codex/` | `instructions.md` | Stable |
| Gemini CLI | `gemini` | `~/.gemini/` | `instructions.md` | Stable |
| Antigravity CLI | `antigravity` | `~/.antigravity/` | `instructions.md` | Experimental |

## Capability Matrix

| Capability | OpenCode | Claude Code | Codex | Gemini CLI | Antigravity CLI |
|------------|----------|-------------|-------|------------|-----------------|
| Native agents | ✅ | ❌ | ❌ | ❌ | ❌ |
| Plugins / tools | ✅ | ❌ | ❌ | ❌ | ❌ |
| Slash commands | ✅ | ❌ | ❌ | ❌ | ❌ |
| MCP server | ✅ | ❌* | ❌* | ❌* | ❌* |
| System instructions | ✅ | ✅ | ✅ | ✅ | ✅ |
| Permission enforcement | ✅ | ❌ | ❌ | ❌ | ❌ |
| Per-agent model routing | ✅ | ❌ | ❌ | ❌ | ❌ |

\* MCP may be supported by the agent in the future; REASP currently does not register an MCP server for non-OpenCode targets.

## How Targets Work

### OpenCode

- Copies plugin/runtime/assets to `~/.config/opencode/`.
- Writes `opencode.json` with Ryou agents, instructions, permissions, skills, watcher ignores, and plugin registration.
- Runs `npm install` in the global dir.
- Registers the plugin via `opencode plugin ... --global --force` or manual fallback.

### Instruction-file targets (Claude Code, Codex, Gemini CLI, Antigravity CLI)

- Writes a single markdown instructions file.
- Uses `<!-- REASP-START -->` and `<!-- REASP-END -->` markers so uninstall can remove only the REASP block.
- Creates a `.reasp-backup` copy the first time the file is modified.
- The block includes the active workflow role prompt, global rules, MeridianUI rules, REFI config/rules, phase guide, subagent reference, model mapping, and boundaries.

## Model Mapping

The OpenCode adapter resolves models from the active ModeProfile. Non-OpenCode targets embed the mapping as text because they do not support per-agent model routing.

Example mapping (from `ryouset` ModeProfile):

```text
ryou-orchestrator: opencode-go/kimi-k2.7-code
ryou-efi-planner:  opencode-go/kimi-k2.7-code
planner:           opencode-go/glm-5.1
builder:           opencode-go/kimi-k2.7-code
architect:         opencode-go/glm-5.1
reviewer:          opencode-go/deepseek-v4-pro
debugger:          opencode-go/deepseek-v4-pro
documentation:     opencode-go/deepseek-v4-flash
```

## Adding a New Agent Target

1. Add the target descriptor to `lib/constants.js` `AGENT_TARGETS`.
2. Add detection logic to `lib/detect.js` `DETECTORS`.
3. Create `lib/targets/<agent-id>.js` implementing the adapter contract.
4. If the target uses a single instructions file, reuse `lib/targets/_instructions.js` helpers.
5. Import the new target in `installer/index.js` `TARGETS` map.
6. Update this file (`AGENTS.md`) and `README.md`.
7. Update `TROUBLESHOOTING.md` with any known issues.

## Per-OS Global Directory Reference

| Agent | Windows | macOS / Linux |
|-------|---------|---------------|
| OpenCode | `%USERPROFILE%\.config\opencode` | `~/.config/opencode` |
| Claude Code | `%USERPROFILE%\.claude` | `~/.claude` |
| Codex | `%USERPROFILE%\.codex` | `~/.codex` |
| Gemini CLI | `%USERPROFILE%\.gemini` | `~/.gemini` |
| Antigravity CLI | `%USERPROFILE%\.antigravity` | `~/.antigravity` |
| MeridianUI | `%USERPROFILE%\.MeridianUI` | `~/.MeridianUI` |
| REASP state | `%USERPROFILE%\.reasp` | `~/.reasp` |

### OpenCode binary detection on Linux / macOS

REASP searches these locations in order when detecting the `opencode` binary:

| Source | Path |
|--------|------|
| npm global | `~/.npm-global/bin/opencode` |
| Yarn global | `~/.yarn/bin/opencode` |
| Homebrew (macOS) | `/usr/local/bin/opencode`, `/opt/homebrew/bin/opencode` |
| System bin | `/usr/bin/opencode`, `/usr/local/bin/opencode` |
| Volta | `~/.volta/bin/opencode` |

If OpenCode is installed in a non-standard location, ensure its parent directory is in `PATH` or use `reasp install --agents opencode --force`.

## Environment Variables

| Variable | Effect |
|----------|--------|
| `ANTIGRAVITY_CONFIG_PATH` | Override the Antigravity CLI instructions file path. |

## Snapshots

REASP can create complete backups of any supported agent's configuration directory. Snapshots are stored under `~/.reasp/snapshots/<agent-id>/<timestamp>-<name>/` and contain a full recursive copy of the agent's global config directory.

| Agent | Snapshot source |
|-------|-----------------|
| OpenCode | `~/.config/opencode/` |
| Claude Code | `~/.claude/` |
| Codex | `~/.codex/` |
| Gemini CLI | `~/.gemini/` |
| Antigravity CLI | `~/.antigravity/` |

Each snapshot includes:

- `snapshot.json` — metadata (timestamp, source path, size, file count, agent version, REASP version).
- `data/` — complete copy of the source directory.

Use the `reasp snapshot` family of commands to create, list, restore, delete, and purge snapshots.

## Notes

- Non-OpenCode targets degrade gracefully: there are no native tools/slash commands, but the full REASP behavior is described in the system instructions block.
- Agents that do not load global instructions automatically may require a restart after installation.
- Snapshots are not deleted when REASP is uninstalled from an agent; purge them explicitly with `reasp snapshot purge`.
