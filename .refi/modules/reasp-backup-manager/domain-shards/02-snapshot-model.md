# Domain Shard 02 · Snapshot Data Model & Storage

## Objective

Define where snapshots live, what metadata they carry, and how to guarantee complete backups.

## Storage Layout

```text
~/.reasp/
├── config.json
├── last-selection.json
└── snapshots/
    ├── opencode/
    ├── claude-code/
    ├── codex/
    ├── gemini/
    └── antigravity/
```

## Snapshot Directory Naming

Each snapshot is stored under `~/.reasp/snapshots/<agent-id>/<ISO8601-timestamp>-<slug>/`.

- `timestamp`: UTC ISO string with colons replaced by dashes for filesystem safety, e.g. `2026-06-15T230000Z`.
- `slug`: sanitized version of the user-provided name, e.g. `clean` or `before-reasp`.
- If slug collision occurs, append a counter: `clean-2`, `clean-3`.

## Snapshot Contents

```text
2026-06-15T230000Z-clean/
├── snapshot.json              # metadata
└── data/                      # complete copy of agent config dir
    └── ...
```

## Metadata Schema (`snapshot.json`)

```json
{
  "id": "2026-06-15T230000Z-clean",
  "name": "clean",
  "agentId": "opencode",
  "agentDisplayName": "OpenCode",
  "createdAt": "2026-06-15T23:00:00.000Z",
  "sourcePath": "C:/Users/kevin/.config/opencode",
  "dataPath": "C:/Users/kevin/.reasp/snapshots/opencode/2026-06-15T230000Z-clean/data",
  "reaspVersion": "1.0.0",
  "agentVersion": "1.17.7",
  "sizeBytes": 1234567,
  "fileCount": 42,
  "note": "Taken before first REASP install"
}
```

## Completeness Rules

1. Snapshot copies the entire directory returned by `target.getGlobalDir(ctx)`.
2. Use `fs.cpSync(source, target, { recursive: true, dereference: false })` to preserve symlinks where supported.
3. Skip snapshot creation if the source directory does not exist.
4. Compute `sizeBytes` and `fileCount` after copy by walking the `data/` directory.

## Configuration File (`~/.reasp/config.json`)

```json
{
  "version": "1.0.0",
  "snapshotsDir": "C:/Users/kevin/.reasp/snapshots",
  "autoSnapshotBeforeInstall": true,
  "autoSnapshotBeforeUninstall": true,
  "maxSnapshotsPerAgent": 0
}
```

- `maxSnapshotsPerAgent`: 0 means unlimited; positive number enables automatic pruning of oldest snapshots.

## Verification Gate

- Creating a snapshot of a test directory produces the expected layout and metadata.
- Metadata `sizeBytes` and `fileCount` match the copied data.
- Snapshot copy is byte-for-byte identical for files under 10 MB.
