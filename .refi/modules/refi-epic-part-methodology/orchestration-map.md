# Orchestration Map · REFI — Upgrade to Epic + PART Methodology

> Strategy: **plan 100 % before any code.** Each PART's 8 gates are signed before the
> next PART starts. EPICs in execution order below; dependency arrows show hard
> constraints (must finish all PARTs of an EPIC before starting the next).

## Execution Order (EPIC-level)

```text
EPIC 01 — Conventions & Terminology          (P0, M, 5 PARTs)
    │
    ▼
EPIC 05 — 8-Gate Verification System         (P0, M, 3 PARTs)   [parallel with 02 possible]
EPIC 02 — Ryou EFI Planner Agent Prompt      (P0, M, 4 PARTs)
    │
    ▼
EPIC 03 — REFI Packet Contract & Structure   (P0, M, 4 PARTs)
    │
    ▼
EPIC 04 — Templates & Module Skeleton        (P0, M, 4 PARTs)
    │
    ▼
EPIC 06 — User Documentation & Worked Example (P1, M, 4 PARTs)
    │
    ▼
EPIC 07 — Backward Compatibility & Migration (P2, M, 3 PARTs)   [optional / can defer]
    │
    ▼
EPIC 08 — Planning Method Selector (P1, M, 3 PARTs)             [UI/tool/prompt]
```

### Critical Path

`EPIC 01 → EPIC 02 → EPIC 03 → EPIC 04 → EPIC 06` must run sequentially to ship the
methodology end-to-end. **EPIC 05** can run immediately after EPIC 01 in parallel
with EPIC 02 (it has no dependency on the new prompt, only on the rule definitions).
**EPIC 07** is deferred until all critical-path EPICs finish.
**EPIC 08** can run in parallel with EPIC 06/07; it is non-blocking for users who keep
  the default `phases` method.

### Per-EPIC PART Order

| EPIC | PARTs (in order) |
|---|---|
| 01 — Conventions | 01 Glossary → 02 Epic Anatomy → 03 PART Template → 04 8 Gates → 05 100 % Rule |
| 02 — Ryou EFI Planner | 01 Two Passes → 02 Gating → 03 Anti-Hallucination → 04 Handoff |
| 03 — Packet Contract | 01 Layout → 02 Required Files → 03 YAML → 04 Backward-Compatible Folders |
| 04 — Templates & Skeleton | 01 PART Template → 02 Epic README Template → 03 Epic Matrix Template → 04 Scaffold |
| 05 — 8-Gate Verification | 01 Quality Gates v2 → 02 Anti-Hallucination v2 → 03 Verification.md Template |
| 06 — Documentation & Example | 01 README section → 02 Diagram → 03 Epic A demo → 04 Epic B demo |
| 07 — Backward Compatibility | 01 Strategy → 02 Migration helper (optional) → 03 Doc |
| 08 — Planning Method Selector | 01 Config state → 02 Tool & TUI → 03 Dual-mode prompt |

## Dependency Notes

- **Hard dependency:** every PART of an EPIC must have all 8 gates signed before the
  next EPIC starts. Cross-EPIC promotion is forbidden.
- **Soft dependency:** within EPIC 02, PART02 (Gating text) references PART01 (Pass
  definitions). Within EPIC 03, PART03 (YAML) and PART04 (folders) reference PART02
  (Required Files). Within EPIC 05, PART03 (verification.md) references PART01
  (Quality Gates v2).

## Shard Gates (= 8 Gates per PART)

Every PART passes, IN ORDER, the 8 gates:

1. **Architecture Review** — design vs project invariants.
2. **Scope & Completeness Audit** — declared vs actual; gaps classified.
3. **UX/Design Review** — MeridianUI if UI; else interface consistency.
4. **Manual / Runtime Validation** — checklist on real hosts; evidence captured.
5. **Defect Closure** — every defect from 1–4 fixed in this PART.
6. **Technical Documentation** — declared tech docs produced.
7. **User Documentation** — declared user docs produced.
8. **Final Review & Sign-off** — build 0/0, suite green, Acceptance Criteria re-read,
   footer signed.

Detailed evidence requirements are in `.opencode/refi/rules/quality-gates.md` v2
(EPIC 05).

## Stop Conditions

- A PART cannot be marked Terminated without **all 8 gates signed** in its footer.
- The handoff to Ryou Orchestrator is BLOCKED until every EPIC's % is 100 %.
- The agent (`ryou-efi-planner`) aborts with structured error if invoked while PARTs
  are missing for an EPIC in `EN CURSO`.

## Completion Criteria (packet level)

The packet closes when:

- 8/8 EPICs are `Terminado` (all 30 PARTs across them have footer firmado).
- `verification.md` has its "Aggregated Gates" section with `8 * 30 = 240` gates passed.
- Worked-example in `.refi/modules/example-todo-cli/` exists with 2 EPICs and 6 PARTs,
  each with footers firmados.
- A dry-run on `reasp-backup-manager` (legacy module) produces an equivalent EPIC v2
  via `scripts/migrate-refi-module.js`.
- `planning_method` can be switched between `phases` and `epic` via `/reasp-setup` and
  `reasp_setup(action="set-planning-method")`, and the dual-mode planner prompt honors it.

## Handoff to Ryou Orchestrator

When `progress.md` reads `planning-complete`, Ryou Orchestrator receives:

```text
Hand-off a Ryou Orchestrator.

EPICs (8 total, orden de ejecución — el critical path):
  01 — Conventions                 →  PART01..05   (5 PARTs)
  02 — Planner Agent Prompt        →  PART01..04   (4 PARTs)
  03 — Packet Contract             →  PART01..04   (4 PARTs)
  04 — Templates & Skeleton        →  PART01..04   (4 PARTs)
  05 — 8-Gate Verification         →  PART01..03   (3 PARTs)
  06 — Documentation & Example     →  PART01..04   (4 PARTs)
  07 — Backward Compatibility      →  PART01..03   (3 PARTs)
  08 — Planning Method Selector    →  PART01..03   (3 PARTs)

Total: 30 PARTs.
For each PART, expect 8 gates in strict order; sign-off in PART footer.
Estado del packet: planning-complete.
NO comenzar hasta confirmación explícita.
```

## Files to Create or Modify (consolidated)

### New files

```text
.opencode/refi/
├── rules/epic-glossary.md                          # EPIC 01 PART01
├── templates/part-template.md                      # EPIC 04 PART01
├── templates/epic-readme-template.md               # EPIC 04 PART02
├── templates/epic-matrix-template.md               # EPIC 04 PART03
├── modules/_template/epics/                        # EPIC 04 PART04
│   ├── matrix.md
│   └── 00-demo/
│       ├── README.md
│       └── parts/PART01_demo.md
.refi/modules/example-todo-cli/                     # EPIC 06 PART03 + PART04
scripts/migrate-refi-module.js                      # EPIC 07 PART02 (optional)
```

### Modified files

```text
.opencode/agents/ryou-efi-planner.md                 # EPIC 02 PART01-04 + EPIC 08 PART03
.opencode/refi/README.md                            # EPIC 03 PART01, 02, 04; EPIC 06; EPIC 08
.opencode/refi/config.yaml                          # EPIC 03 PART03
.opencode/refi/rules/global-rules.md                # EPIC 01 PART05, link to glossary
.opencode/refi/rules/quality-gates.md               # EPIC 05 PART01
.opencode/refi/rules/anti-hallucination.md          # EPIC 05 PART02
.opencode/refi/modules/_template/verification.md     # EPIC 05 PART03
.opencode/reasp.config.json                         # EPIC 08 PART01
.opencode/rass-core.js                              # EPIC 08 PART01
.opencode/plugin.js                                 # EPIC 08 PART02
.opencode/tui.js                                    # EPIC 08 PART02
README.md                                           # EPIC 06 PART01 + 02; EPIC 08 (root)
AI/Summarys/summary-2026-07-09.html                 # EPIC 08
```

### Unchanged but cross-referenced

- `.opencode/refi/modules/_template/`: existing files updated, structure preserved.
- All 4 legacy modules: read-only from the perspective of this packet.
