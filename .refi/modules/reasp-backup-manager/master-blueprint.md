# Master Blueprint · REASP Global CLI + Backup Manager

## 1. Problem Statement

REASP currently runs as a local Node.js script inside `installer/index.js`. Users must `cd installer && node index.js ...` to use it. There is no global command, and there is no way to safely roll back agent configurations if an install goes wrong.

## 2. Goal

Promote REASP from a local installer script to a first-class global CLI tool (`reasp`) with integrated, agent-specific snapshot management. The same binary handles installation, uninstallation, detection, status, and backup/restore.

## 3. Core Design Principles

> **Install once, manage forever.**
>
> **Snapshot before change.**
>
> **Complete backups, not partial ones.**

## 4. Conceptual Architecture

```text
┌────────────────────────────────────────────────────────────────┐
│                         reasp CLI                              │
│  install · uninstall · detect · status · local · snapshot      │
└───────────────────────────┬────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
  ┌──────────┐      ┌──────────────┐     ┌─────────────┐
  │  Install │      │   Snapshot   │     │   Restore   │
  │ Manager  │      │   Manager    │     │   Manager   │
  └────┬─────┘      └──────┬───────┘     └──────┬──────┘
       │                   │                    │
       ▼                   ▼                    ▼
 lib/targets/*.js    ~/.reasp/snapshots/   agent config dir
```

## 5. Global CLI Entry Point

### Installation as global command

A root `package.json` at the REASP repo root declares:

```json
{
  "name": "reasp-cli",
  "version": "1.0.0",
  "description": "REASP · Global installer, SDD orchestrator, and agent backup manager",
  "type": "module",
  "bin": {
    "reasp": "./installer/index.js"
  },
  "scripts": {
    "postinstall": "node scripts/link-bin.js"
  },
  "preferGlobal": true,
  "files": [
    "installer/",
    ".opencode/",
    "README.md",
    "LICENSE.md"
  ],
  "engines": {
    "node": ">=18.0.0"
  }
}
```

Users install it with:

```bash
npm install -g C:\path\to\REASP
# or, from inside the repo:
npm install -g .
```

After installation, `reasp` is available globally.

### Alternative: wrapper scripts

For systems where `npm -g` is not available or desirable, REASP also provides a `reasp.cmd` / `reasp` shell wrapper in `scripts/` that can be added to PATH manually.

## 6. Snapshot Model

### Storage layout

```text
~/.reasp/
├── last-selection.json
├── config.json
└── snapshots/
    ├── opencode/
    │   ├── 2026-06-15T230000Z-clean/
    │   │   ├── snapshot.json          # metadata
    │   │   └── data/                  # full copy of ~/.config/opencode/
    │   │       ├── opencode.json
    │   │       ├── plugin.js
    │   │       └── ...
    │   └── 2026-06-15T231500Z-before-update/
    │       ├── snapshot.json
    │       └── data/
    ├── claude-code/
    ├── codex/
    ├── gemini/
    └── antigravity/
```

### Snapshot metadata (`snapshot.json`)

```json
{
  "id": "2026-06-15T230000Z-clean",
  "name": "clean",
  "agent": "opencode",
  "displayName": "OpenCode",
  "createdAt": "2026-06-15T23:00:00.000Z",
  "sourcePath": "C:/Users/kevin/.config/opencode",
  "reaspVersion": "1.0.0",
  "agentVersion": "1.17.7",
  "sizeBytes": 1234567,
  "fileCount": 42,
  "note": "Taken before first REASP install"
}
```

### Completeness guarantee

Each snapshot copies the entire agent config directory recursively, including:

- All files REASP knows about.
- Any pre-existing user config, credentials, caches, logs, history, etc.

This ensures a restore returns the agent to exactly the state it had when the snapshot was taken.

## 7. CLI Command Surface

```text
reasp                         # Interactive TUI
reasp install                 # Install REASP into selected agents
reasp install --agents a,b    # Install into specific agents
reasp install --only-detected # Install into all detected agents
reasp install --dry-run       # Preview only
reasp uninstall               # Uninstall from OpenCode (legacy default)
reasp uninstall --agents a,b  # Uninstall from specific agents
reasp detect                  # Show detected agents
reasp status                  # Show REASP install status per agent
reasp local                   # Copy REASP to current workspace

reasp snapshot create         # Interactive: choose agent, enter name
reasp snapshot create --agent opencode --name clean
reasp snapshot create --agent claude-code --name before-reasp --note "manual"

reasp snapshot list           # List all snapshots
reasp snapshot list --agent claude-code

reasp snapshot restore        # Interactive: choose snapshot
reasp snapshot restore --agent claude-code --name before-reasp

reasp snapshot delete         # Interactive: choose snapshot
reasp snapshot delete --agent claude-code --name before-reasp
reasp snapshot purge --agent claude-code --keep 5

reasp config                  # Show REASP global config
reasp config --snapshots-dir /custom/path
```

## 8. Safety Guards

1. **Always snapshot before destructive operation** — when installing or uninstalling, prompt the user to create a snapshot first. Allow `--skip-snapshot` to override.
2. **Confirm restore** — restoring overwrites the live config directory. Require explicit confirmation or `--yes`.
3. **Never delete the only snapshot silently** — warn if restoring would remove the last known-good state.
4. **Atomic writes** — restore into a temp directory first, then swap (rename) to minimize corruption risk.
5. **Preserve snapshot storage on uninstall** — uninstalling REASP from an agent does not delete snapshots. A separate `reasp snapshot purge --all` command exists for explicit cleanup.

## 9. TUI Integration

The interactive TUI gains a main menu:

```text
◈ REASP Manager
  ├─ Install REASP into agents
  ├─ Uninstall REASP from agents
  ├─ Snapshots →
  │   ├─ Create snapshot
  │   ├─ List snapshots
  │   ├─ Restore snapshot
  │   └─ Delete snapshot
  ├─ Detect agents
  ├─ Status
  └─ Exit
```

## 10. Files to Create or Modify

### New files

```textnREASP/
├── package.json                    # global CLI manifest
├── scripts/
│   └── link-bin.js                 # optional postinstall link helper
├── installer/
│   ├── lib/
│   │   ├── snapshot-manager.js     # core snapshot CRUD
│   │   ├── config-manager.js       # ~/.reasp/config.json helpers
│   │   └── safety.js               # confirmation/atomic helpers
│   └── commands/
│       ├── snapshot.js             # snapshot subcommand router
│       └── config.js               # config subcommand
```

### Modified files

```text
installer/
├── index.js                        # register global CLI, main TUI menu, snapshot wiring
├── lib/
│   ├── constants.js                # add SNAPSHOTS_DIR, REASP_CONFIG_PATH
│   └── tui.js                      # add snapshot prompts and main menu
└── README.md                       # document global install and snapshots
```

## 11. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| `npm -g` permission issues on Unix | Document `sudo` alternative and wrapper script fallback. |
| Snapshot copies are large | Document disk usage; offer purge/keep policies. |
| Restore corrupts live config | Atomic swap + backup of current state before restore. |
| Windows PATH not updated after `npm -g` | Use `reasp.cmd` wrapper; document shell restart. |
| Snapshot directory itself gets deleted | Keep snapshots outside agent dirs under `~/.reasp/`. |

## 12. Open Questions

- Should snapshots include the agent's global binary cache/history if it lives outside the config dir? (v1: no, only config dir.)
- Should `reasp uninstall --all` purge snapshots too? (v1: no, explicit `snapshot purge --all` required.)
