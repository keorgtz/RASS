# Orchestration Map · REASP Multi-Agent Compatibility

## Execution Order

Execute the domain shards in the following order. Each shard gates the next.

```text
Phase 1 · Research
└── 01-investigacion-formatos-agente.md
    └── Verify config paths & capabilities for Claude Code, Codex, Gemini CLI, Antigravity CLI.

Phase 2 · Architecture
└── 02-arquitectura-multiagente.md
    └── Implement lib/constants.js, lib/detect.js, lib/compile.js, adapter contract, lib/tui.js.

Phase 3 · OpenCode Preservation
└── 05-compatibilidad-opencode.md
    └── Extract OpenCode logic into lib/targets/opencode.js without changing behavior.

Phase 4 · Selection & Installer Core
└── 03-installer-seleccion-agentes.md
    └── Refactor index.js into orchestrator; add agent selection TUI and CLI flags.

Phase 5 · New Target Adapters
└── 04-generacion-configs-por-agente.md
    └── Implement Claude Code, Codex, Gemini CLI adapters; placeholder Antigravity adapter.

Phase 6 · Uninstall
└── 06-uninstall-multiagente.md
    └── Implement per-target uninstall with markers and backup logic.

Phase 7 · Documentation
└── 07-documentacion-readme.md
    └── Update README.md and create AGENTS.md / TROUBLESHOOTING.md.

Phase 8 · Verification
└── verification.md
    └── Run manual end-to-end verification on OpenCode + at least one other target.
```

## Handoff to Ryou Orchestrator

After this plan is approved, `ryou-orchestrator` should:

1. Start with **Shard 01** and **Shard 02** in parallel (research can inform architecture, but architecture can be drafted with assumed capabilities).
2. Implement **Shard 05** first among code shards to lock OpenCode behavior.
3. Then implement **Shard 03** and **Shard 04**.
4. Follow with **Shard 06** and **Shard 07**.
5. End with **verification.md** gates.

## Files to Create or Modify

### New files

```text
installer/
├── lib/
│   ├── constants.js
│   ├── detect.js
│   ├── compile.js
│   ├── tui.js
│   └── targets/
│       ├── opencode.js
│       ├── claude-code.js
│       ├── codex.js
│       ├── gemini.js
│       └── antigravity.js
├── templates/
│   ├── claude-code-ryou-orchestrator.md.hbs
│   ├── claude-code-ryou-efi-planner.md.hbs
│   ├── codex-ryou-orchestrator.md.hbs
│   ├── codex-ryou-efi-planner.md.hbs
│   ├── gemini-ryou-orchestrator.md.hbs
│   ├── gemini-ryou-efi-planner.md.hbs
│   ├── antigravity-ryou-orchestrator.md.hbs
│   └── antigravity-ryou-efi-planner.md.hbs
├── AGENTS.md
└── TROUBLESHOOTING.md
```

### Modified files

```text
installer/
├── index.js          (refactored into thin orchestrator)
├── package.json      (add scripts if needed)
README.md             (update for multi-agent support)
```

## Critical Path

The critical path is:

`01 Research` → `02 Architecture` → `05 OpenCode Compatibility` → `03 Selection` → `04 Adapters` → `08 Verification`

Shards 06 and 07 can run largely in parallel after Shard 04.
