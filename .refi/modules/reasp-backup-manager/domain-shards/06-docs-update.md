# Domain Shard 06 · Documentation Update

## Objective

Update README, AGENTS.md, and TROUBLESHOOTING.md to reflect the global CLI and snapshot manager features.

## README.md Changes

1. Add installation as global CLI near the top:

```markdown
## 🚀 Install REASP as a system tool

```bash
npm install -g C:\path\to\REASP
# or from inside the repo
npm install -g .

reasp --help
```

2. Replace references to `node installer/index.js` with `reasp`.
3. Add a new section `## 💾 Snapshots & Backup Manager` with:
   - Why snapshots exist.
   - Quick examples:
     ```bash
     reasp snapshot create --agent claude-code --name clean
     reasp snapshot list --agent claude-code
     reasp snapshot restore --agent claude-code --name clean
     reasp snapshot delete --agent claude-code --name clean
     ```
4. Update feature list to include "Agent Backup Manager".

## AGENTS.md Changes

Add a section explaining that snapshots are complete copies of the agent's config directory and list the default snapshot path per agent.

## TROUBLESHOOTING.md Changes

Add:

- "reasp command not found" — check `npm -g` bin PATH, use wrapper script.
- "Snapshot restore failed" — check `~/.reasp/snapshots/` for auto-backup, use it to recover.
- "Out of disk space during snapshot" — purge old snapshots or move snapshots dir.
- "I deleted the wrong snapshot" — snapshots are not recoverable from REASP; rely on external backups.

## Verification Gate

- README examples use `reasp` instead of `node installer/index.js`.
- A new user can follow README to install globally and create a snapshot.
