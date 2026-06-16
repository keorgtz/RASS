# Orchestration Map · REASP Global CLI + Backup Manager

## Execution Order

```text
Phase 1 · Global CLI
└── 01-cli-global.md
    └── Create root package.json, shebang, wrapper scripts, verify global install.

Phase 2 · Snapshot Model
└── 02-snapshot-model.md
    └── Implement snapshot storage layout, metadata, and config file.

Phase 3 · Snapshot Commands
└── 03-snapshot-commands.md
    └── Implement create/list/restore/delete/purge commands.

Phase 4 · TUI Integration
└── 04-tui-integration.md
    └── Add main menu, snapshot submenu, and pre-install/pre-uninstall prompts.

Phase 5 · Safety Guards
└── 05-safety-guards.md
    └── Atomic restore, auto-backup, confirmations, integrity checks.

Phase 6 · Documentation
└── 06-docs-update.md
    └── Update README, AGENTS.md, TROUBLESHOOTING.md.

Phase 7 · Verification
└── verification.md
    └── End-to-end global CLI and snapshot testing.
```

## Handoff to Ryou Orchestrator

After this plan is approved, `ryou-orchestrator` should:

1. Start with **Shard 01** and **Shard 02** in parallel.
2. Implement **Shard 03** once the model is ready.
3. Wire **Shard 04** into the existing TUI.
4. Harden with **Shard 05**.
5. Finish with **Shard 06** and **Shard 7**.

## Critical Path

`01 Global CLI` → `02 Snapshot Model` → `03 Snapshot Commands` → `05 Safety Guards` → `07 Verification`

Shards 04 and 06 can run in parallel once Shard 03 is complete.

## Files to Create or Modify

### New files

```text
REASP/
├── package.json
├── scripts/
│   ├── reasp.cmd
│   ├── reasp
│   └── link-bin.js (optional)
├── installer/
│   ├── lib/
│   │   ├── snapshot-manager.js
│   │   ├── config-manager.js
│   │   └── safety.js
│   └── commands/
│       ├── snapshot.js
│       └── config.js
```

### Modified files

```text
installer/
├── index.js
├── lib/
│   ├── constants.js
│   └── tui.js
├── README.md
├── AGENTS.md
└── TROUBLESHOOTING.md
```
