# Domain Shard 06 · Multi-Agent Uninstall

## Objective

Allow the user to remove REASP from any subset of installed AI agent targets without affecting others.

## Requirements

1. **Interactive uninstall**
   - Detect which targets currently have REASP installed.
   - Show multiselect list of installed targets.
   - Default: select all installed targets.

2. **CLI uninstall**
   - `node installer/index.js uninstall --agents claude-code,codex`
   - `node installer/index.js uninstall` uninstalls from all detected targets that have REASP.
   - `--all` alias.

3. **Per-target cleanup**
   - OpenCode: remove copied assets, agents, instructions, plugins as today.
   - Claude Code: remove REASP block from `CLAUDE.md` or delete the file if it only contained REASP.
   - Codex / Gemini / Antigravity: remove REASP-generated files/sections.

4. **Safety**
   - Never delete an entire agent config directory; only remove files known to be written by REASP.
   - Backup modified files before first modification (e.g., `CLAUDE.md.reasp-backup`).

## OpenCode Uninstall

Move existing `uninstallGlobally()` logic into `lib/targets/opencode.js` and ensure it still:

- Removes directories: `sdd-profiles`, `phases`, `runtime`, `agents`, `rules`, `refi`.
- Removes files: `sdd.config.json`, `reasp.config.json`, `plugin.js`, `tui.js`, `rass-core.js`, `package.json`, `package-lock.json`.
- Removes `node_modules`.
- Cleans `opencode.json` of Ryou agents, plugins, instructions.

## Non-OpenCode Uninstall

For agents that use a single markdown file, implement a reversible insertion marker strategy:

```markdown
<!-- REASP-START -->
... REASP content ...
<!-- REASP-END -->
```

Uninstall removes the marked block. If the file becomes empty, delete it.

## Verification Gate

- After uninstalling Claude Code only, OpenCode still has REASP fully functional.
- After uninstalling OpenCode only, Claude Code still has REASP if it was installed.
- Reinstalling after uninstall produces a working configuration.
