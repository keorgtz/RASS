# Domain Shard 03 · Installer Agent Selection & Detection

## Objective

Implement the user-facing flow that detects which AI agents are available and lets the user choose where to install REASP.

## Requirements

1. **Detection before selection**
   - Run detection once at startup.
   - Show detection status per agent.

2. **TUI selection**
   - Use `@clack/prompts` `multiselect` or `confirm` per agent.
   - Pre-select OpenCode if detected.
   - Do not pre-select other agents unless user previously chose them (read from `~/.reasp/last-selection.json`).

3. **CLI flags**
   - `--agents opencode,claude-code,codex`
   - `--only-detected`
   - `--dry-run`
   - `--yes` / `-y` to skip confirmations

4. **Warnings**
   - If a selected agent is not detected, show warning and require `--force` or interactive confirmation.
   - If no agents are selected, abort with instructions.

5. **Status command**
   - `node installer/index.js detect` prints detected agents.
   - `node installer/index.js status` prints installed REASP targets.

## UI Text (Spanish, consistent with existing installer)

```text
Agentes de IA detectados:
  [✓] OpenCode      — detectado v2.x
  [✓] Claude Code   — detectado v0.x
  [ ] Antigravity   — no detectado
  [✓] Gemini CLI    — detectado v1.x
  [✓] Codex         — detectado v1.x

Selecciona los agentes donde instalar REASP:
```

## Implementation Steps

1. Refactor `index.js` to import `lib/detect.js` and `lib/tui.js`.
2. Implement `detect.js` for all five targets using commands and path checks.
3. Add multiselect prompt in `interactiveInstall()` after the banner.
4. Store selected agents in a runtime context object passed to install functions.
5. Print per-target install progress.

## Verification Gate

- Running `node installer/index.js` on a machine with OpenCode + Claude Code shows both detected and allows selecting only Claude Code.
- `--dry-run` prints what would be written without modifying files.
- `--agents opencode` still behaves exactly like the legacy installer.
