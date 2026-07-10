# Master Blueprint · example-todo-cli

## 1. Problem Statement

Demonstrate REFI v2 (Epic + PART) end-to-end on a small but real piece of work: a
CLI de TODOs en Node.js sin dependencias externas pesadas. The example is fully
self-contained under `.refi/modules/example-todo-cli/` and never modifies the rest
of the repo.

## 2. Goal

Produce a working `todo.js` with `add`, `list`, `complete`, `done`, `readme`, and
`--help` per command. Persist state in `todos.json`. Provide a REFI v2 packet
(2 EPICs, 6 PARTs, 8-gate cycle) that the reader can clone or copy to start any
real packet.

## 3. Core Design Principles

- **Self-contained.** No dependencies beyond Node's stdlib. Real libs are mentioned
  in PART §3 (Comparison) but never installed by this packet.
- **Single file.** `bin/todo.js` is one CommonJS file, ~150 lines.
- **REFI v2 compliant.** The packet structure IS the example.

## 4. Conceptual Architecture

```text
┌────────────────────────────────────────────────┐
│                 todo.js (CLI)                  │
│  add · list · complete · done · readme · --help│
└───────────────────────┬────────────────────────┘
                        │
                        ▼
                ┌───────────────┐
                │  todos.json   │  (persistence)
                └───────────────┘
```

## 5. Packet Structure (REFI v2)

```text
.refi/modules/example-todo-cli/
├── request.md
├── master-blueprint.md
├── epics/
│   ├── matrix.md
│   ├── 01-setup-cli/         ← EPIC A
│   │   ├── README.md
│   │   └── parts/
│   │       ├── PART01_CLISkeleton.md
│   │       ├── PART02_CommandsAddListComplete.md
│   │       └── PART03_PersistenceJSON.md
│   └── 02-help-and-docs/     ← EPIC B
│       ├── README.md
│       └── parts/
│           ├── PART01_HelpTexts.md
│           ├── PART02_ReadmeGen.md
│           └── PART03_ManualSmoke.md
├── orchestration-map.md
├── progress.md
└── verification.md
```

## 6. Workflow (Three Passes)

| Pass | Action | Output |
|------|--------|--------|
| 1    | Epic Breakdown | `request.md`, `master-blueprint.md`, `epics/matrix.md`, 2 EPIC READMEs |
| 2    | PART Detail | 6 PARTs (3 per EPIC) with 15 sections + footer |
| 3    | Orchestration & Hand-off | `orchestration-map.md`, `progress.md`, `verification.md` |

## 7. PART Template · 15 Sections

`templates/part-template.md`. Sections 2, 3, 5, 7, 8 can be marked `N/A` per the
allowed N/A table in `rules/epic-glossary.md` §3.

## 8. The 8 Gates (per PART)

Reference: `rules/quality-gates.md` v2.

## 9. Interaction with RASS Phases (unchanged)

The execution of `bin/todo.js` (when actually run) uses RASS phases only loosely —
this is a small CLI, not a multi-component enterprise system. The Ryou EFI Planner
that authored this packet operates in `architecture` ModeProfile (orchestrator →
init → explore → propose → design → apply → verify → archive).

## 10. Affected Layers

| Layer | Change |
|-------|--------|
| `.refi/modules/example-todo-cli/` | NEW — entire folder. |
| `.opencode/refi/templates/` | referenced by name; not modified by this packet. |
| `.opencode/refi/rules/` | referenced by name; not modified by this packet. |

## 11. Persistence / Configuration Impact

- No DB, no global config, no schema change.
- `todos.json` is created on first `add`.

## 12. UI / UX Surfaces

- CLI only. Plain-text output, no TUI library.
- Colors: optional; if used, only ANSI escape codes (no `chalk` dependency).

## 13. Risks and Anti-Patterns

| Risk | Mitigation |
|------|------------|
| User installs dependencies outside stdlib | Explicit "no dependencies" rule in EPIC A PART01. |
| Reader copies code into a real project | Code is namespaced under `.refi/modules/example-todo-cli/bin/`; README warns. |
| Worked-example drifts from real REFI v2 spec | Each PART's §3 anchors to `.opencode/refi/templates/part-template.md` line ranges. |

## 14. Execution Shards (= EPICs)

1. **EPIC 01 — Setup CLI** (3 PARTs): skeleton, core commands, JSON persistence.
2. **EPIC 02 — Help & Docs** (3 PARTs): per-command `--help`, `readme` generator,
   manual smoke checklist.

Total: 2 EPICs · 6 PARTs · ~3 sesiones de trabajo.

## 15. Verification Strategy

- Each PART has 8 gates signed in its footer.
- Final `verification.md` aggregates 8 × 6 = 48 gates.
- Smoke test runs `node bin/todo.js --help` and confirms the output matches §15
  criteria.

## 16. Open Questions

- None blocking. PART §3 cites real stdlib functions and patterns.

## 17. Excluded From This Packet

- No npm packaging.
- No TypeScript conversion.
- No CI workflow.
- No tests outside `verification.md`'s manual checklist.