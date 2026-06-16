# Domain Shard 04 · TUI Main Menu & Snapshot Flows

## Objective

Add snapshot operations to the interactive TUI and integrate pre-install/pre-uninstall snapshot prompts.

## Main Menu

Update `interactiveMode()` in `installer/index.js` to show a main menu instead of jumping directly to install:

```text
◈ REASP Manager

  ┌─ Install REASP
  ├─ Uninstall REASP
  ├─ Snapshots
  │   ├─ Create snapshot
  │   ├─ List snapshots
  │   ├─ Restore snapshot
  │   └─ Delete snapshot
  ├─ Detect agents
  ├─ Status
  └─ Exit
```

Use `@clack/prompts` `select` for navigation.

## Snapshot Submenu

When user selects **Snapshots**, show:

```text
◈ Snapshots

  ├─ Create
  ├─ List
  ├─ Restore
  ├─ Delete
  └─ Back
```

### Create flow

1. Select agent (list detected + "All agents" option).
2. Enter name.
3. Optional note.
4. Execute.

### List flow

1. Optionally select agent or show all.
2. Display formatted table.

### Restore flow

1. Select agent.
2. Select snapshot from list (show name + date).
3. Confirm (warn about overwriting live config).
4. Execute.

### Delete flow

1. Select agent.
2. Select snapshot.
3. Confirm.
4. Execute.

## Pre-install Prompt

Before running `runInstall()`:

```text
Create a snapshot before installing? (recommended)
  [✓] Yes
  [ ] No
```

If yes:
- For each selected agent, call `createSnapshot(ctx, agentId, `pre-install-${timestamp}`, 'Auto snapshot before install')`.
- Then proceed with install.

Add CLI flag `--skip-snapshot` to bypass.

## Pre-uninstall Prompt

Same pattern as pre-install.

Add CLI flag `--skip-snapshot` to bypass.

## Helpers in `lib/tui.js`

Add:

- `promptMainMenu()`
- `promptSnapshotSubmenu()`
- `promptSelectAgent(detectedAgents, allowAll = false)`
- `promptSnapshotSelection(snapshots)`
- `confirmSnapshotBeforeAction(action)`

## Verification Gate

- Running `reasp` (interactive) shows the main menu.
- Selecting Install prompts for snapshot before continuing.
- Selecting Snapshots → Create produces a snapshot.
- Selecting Snapshots → Restore restores it.
