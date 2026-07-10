# Orchestration Map · example-todo-cli

> Strategy: **plan 100 % before any code.** Each PART's 8 gates are signed before
> the next PART starts.

## Execution Order (EPIC-level)

```text
EPIC 01 — Setup CLI              (P0, M, 3 PARTs)
    │
    ▼
EPIC 02 — Help & Docs            (P1, M, 3 PARTs)
```

### Critical Path

EPIC 01 → EPIC 02. No parallel execution possible (EPIC 02 depends on EPIC 01's
commands existing).

### Per-EPIC PART Order

| EPIC | PARTs (in order) |
|---|---|
| 01 — Setup CLI | 01 CLI Skeleton → 02 Commands → 03 Persistence JSON |
| 02 — Help & Docs | 01 Help Texts → 02 Readme Gen → 03 Manual Smoke |

## Dependency Notes

- **EPIC 01 PART02 (Commands)** references **EPIC 01 PART03 (Persistence JSON)** for
  `lib/store.js`. PART02 must be executed AFTER PART03 (or PART03 must be created
  first as a stub, then expanded).
- **EPIC 02 PART01 (Help Texts)** requires `bin/todo.js` from EPIC 01.
- **EPIC 02 PART02 (Readme Gen)** requires `lib/store.js` from EPIC 01 PART03.

## Shard Gates (= 8 Gates per PART)

Every PART passes, IN ORDER, the 8 gates:

1. Architecture Review · 2. Scope & Completeness Audit · 3. UX/Design Review ·
2. Manual / Runtime Validation · 5. Defect Closure · 6. Technical Documentation ·
3. User Documentation · 8. Final Review & Sign-off.

## Stop Conditions

- A PART cannot be `Terminated` without all 8 gates signed.
- The hand-off to Ryou Orchestrator is BLOCKED until every EPIC's % is 100 %.
- The planner aborts with structured error if invoked while PARTs are missing for
  an EPIC in `EN CURSO`.

## Completion Criteria (packet level)

The packet closes when:

- 2/2 EPICs are `Terminado` (all 6 PARTs have footer firmado).
- `verification.md` has its "Aggregated Gates" section with `8 × 6 = 48` gates passed.

## Handoff to Ryou Orchestrator

```text
Hand-off a Ryou Orchestrator.

EPICs (2 total, orden de ejecución — critical path):
  01 — Setup CLI       →  PART01..03   (3 PARTs)
  02 — Help & Docs     →  PART01..03   (3 PARTs)

Total: 6 PARTs.
For each PART, expect 8 gates in strict order; sign-off in PART footer.
Estado del packet: planning-complete.
NO comenzar hasta confirmación explícita.
```