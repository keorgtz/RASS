# Domain Shard 03 · Snapshot CLI Commands

## Objective

Implement `reasp snapshot <create|list|restore|delete|purge>` commands and their interactive variants.

## Command: `reasp snapshot create`

### Options

- `--agent <id>` or `-a <id>`
- `--name <name>` or `-n <name>`
- `--note <text>`
- `--yes` or `-y` skip confirmation

### Behavior

1. If `--agent` missing, prompt with list of installed/detected agents.
2. If `--name` missing, prompt for a name (default: `snapshot-<timestamp>`).
3. Resolve source directory via `target.getGlobalDir(ctx)`.
4. If source does not exist, abort with helpful message.
5. Compute destination path under `~/.reasp/snapshots/<agent>/<timestamp>-<slug>/`.
6. If destination exists, append counter to slug.
7. Copy source recursively into `data/`.
8. Write `snapshot.json` metadata.
9. Optionally prune old snapshots if `maxSnapshotsPerAgent > 0`.
10. Print summary.

### Return

```js
{ success: true, snapshotPath: '...', fileCount: 42, sizeBytes: 1234567 }
```

## Command: `reasp snapshot list`

### Options

- `--agent <id>` filter by agent
- `--json` output as JSON for scripting

### Behavior

1. Walk `~/.reasp/snapshots/`.
2. Load each `snapshot.json`.
3. Print table:

```text
Agent        Name              Created                  Size      Files
OpenCode     clean             2026-06-15 23:00:00      1.2 MB    42
Claude Code  before-reasp      2026-06-15 23:15:00      4.5 KB    3
```

## Command: `reasp snapshot restore`

### Options

- `--agent <id>`
- `--name <name>` or `--id <id>`
- `--yes` skip confirmation

### Behavior

1. Resolve snapshot path.
2. If target agent is running, warn that the agent should be closed.
3. Create a safety backup of the current live config to `~/.reasp/snapshots/<agent>/<timestamp>-auto-restore-backup/data`.
4. Atomic restore:
   - Rename live dir to `<live>.reasp-temp-old`.
   - Copy snapshot `data/` to live path.
   - On success, delete temp-old.
   - On failure, rename temp-old back.
5. Print result.

## Command: `reasp snapshot delete`

### Options

- `--agent <id>`
- `--name <name>` or `--id <id>`
- `--yes` skip confirmation

### Behavior

1. Resolve snapshot path.
2. Confirm unless `--yes`.
3. Remove directory recursively.

## Command: `reasp snapshot purge`

### Options

- `--agent <id>`
- `--keep <n>` keep the N most recent snapshots
- `--all-agents` purge all agents
- `--yes` skip confirmation

### Behavior

1. List snapshots sorted by `createdAt` descending.
2. Keep the newest `keep` snapshots.
3. Delete the rest.

## Implementation Notes

- Create `installer/lib/snapshot-manager.js` with pure functions:
  - `getSnapshotsDir(ctx)`
  - `getSnapshotDir(ctx, agentId, snapshotId)`
  - `createSnapshot(ctx, agentId, name, note)`
  - `listSnapshots(ctx, agentId?)`
  - `restoreSnapshot(ctx, agentId, snapshotId)`
  - `deleteSnapshot(ctx, agentId, snapshotId)`
  - `purgeSnapshots(ctx, agentId, keep)`
  - `formatBytes(bytes)`
- Create `installer/commands/snapshot.js` to parse args and call these functions.

## Verification Gate

- Create, list, restore, and delete snapshots for at least two agents in temp homes.
- Restore correctly recovers a deleted file from the snapshot.
- Delete removes the snapshot directory.
