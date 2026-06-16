# Domain Shard 05 · OpenCode Backwards Compatibility

## Objective

Ensure the multi-agent refactor does not change the existing OpenCode installation behavior.

## Requirements

1. The legacy commands continue to work:
   - `node installer/index.js install`
   - `node installer/index.js uninstall`
   - `node installer/index.js local`
   - `node installer/index.js` (interactive)

2. The OpenCode adapter must produce the same effective configuration as the current `index.js` for:
   - Agent definitions
   - Instructions list
   - Permissions
   - Skills
   - Watcher ignores
   - Plugin registration
   - Model routing
   - `reasp.config.json`

3. Existing OpenCode-specific files (`plugin.js`, `tui.js`, `rass-core.js`, `runtime/`, `sdd-profiles/`, etc.) remain in `.opencode/` and are copied unchanged.

## Migration Strategy

1. Extract OpenCode-specific functions from `installer/index.js` into `installer/lib/targets/opencode.js`.
2. Keep function signatures and logic identical unless required for the adapter contract.
3. `installer/index.js` delegates to `targets.opencode.install(ctx, bundle)` when OpenCode is selected.
4. Add a regression test/manual checklist:
   - Install with new installer.
   - Verify `~/.config/opencode/opencode.json` contains all Ryou agents.
   - Verify `~/.config/opencode/plugin.js` exists.
   - Run `/sdd` in OpenCode and confirm ModeProfiles list.
   - Run `/reasp-setup` and confirm workflow switching.

## Risk Controls

- Do not rename or restructure `.opencode/` canonical assets.
- Do not change OpenCode plugin IDs or tool schemas.
- Keep the same global config directory resolution (`~/.config/opencode`).

## Verification Gate

- A clean install with the new installer followed by a clean install with the old installer produce the same `opencode.json` (modulo whitespace/order).
- User can still switch between Ryou EFI Planner and Ryou Orchestrator.
