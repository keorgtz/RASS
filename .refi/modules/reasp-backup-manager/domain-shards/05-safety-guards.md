# Domain Shard 05 · Safety Guards & Edge Cases

## Objective

Ensure snapshot restore and delete operations are safe and recoverable.

## Atomic Restore

Implement in `lib/snapshot-manager.js`:

```js
function atomicRestore(liveDir, snapshotDataDir) {
  const tempOld = `${liveDir}.reasp-temp-old`;
  const tempNew = `${liveDir}.reasp-temp-new`;

  try {
    // 1. Copy snapshot to temp-new.
    fs.cpSync(snapshotDataDir, tempNew, { recursive: true });

    // 2. Rename live to temp-old.
    if (fs.existsSync(liveDir)) {
      fs.renameSync(liveDir, tempOld);
    }

    // 3. Move temp-new to live.
    fs.renameSync(tempNew, liveDir);

    // 4. Success: remove temp-old.
    fs.rmSync(tempOld, { recursive: true, force: true });

    return { success: true };
  } catch (err) {
    // Rollback: if temp-old exists, restore it.
    try {
      if (fs.existsSync(tempOld) && !fs.existsSync(liveDir)) {
        fs.renameSync(tempOld, liveDir);
      }
      if (fs.existsSync(tempNew)) {
        fs.rmSync(tempNew, { recursive: true, force: true });
      }
    } catch (rollbackErr) {
      return { success: false, error: err, rollbackError: rollbackErr };
    }
    return { success: false, error: err };
  }
}
```

## Auto-Backup Before Restore

Before restoring, always create an automatic snapshot of the current live state named `auto-restore-backup-<timestamp>`. This protects against restoring the wrong snapshot.

## Confirmations

| Operation | Default Confirmation |
|-----------|---------------------|
| snapshot restore | Yes, explicit |
| snapshot delete | Yes, explicit |
| snapshot purge | Yes, explicit |
| install with existing config | Offer snapshot first |
| uninstall | Offer snapshot first |

Use `--yes` to skip.

## Agent Running Warning

If possible, detect whether the target agent process is running before restore:

- Windows: `tasklist | findstr opencode` (best effort).
- Unix: `pgrep -x opencode` (best effort).

If detected, warn the user and recommend closing the agent first.

## Snapshot Integrity

After creating a snapshot, verify that:

- `snapshot.json` is valid JSON.
- `data/` directory exists and is non-empty if source was non-empty.

## Disk Space Check

Before creating a snapshot, check available disk space on the destination drive. If estimated needed space is more than 90% of available, warn and require `--force`.

## Exclusions

When copying, do not follow symlinks out of the source directory to avoid snapshotting unintended system paths. Use `dereference: false` in `fs.cpSync`.

## Verification Gate

- Restore a snapshot; interrupt mid-process (simulate failure); verify rollback leaves live dir intact.
- Delete the only snapshot of an agent; warning is shown.
- Snapshot of an empty agent dir succeeds and reports 0 files.
