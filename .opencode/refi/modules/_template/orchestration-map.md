# Orchestration Map · <Module Name>

> Strategy: **plan 100 % before any code.** Each PART's 8 gates are signed before
> the next PART starts. EPICs in execution order below; dependency arrows show
> hard constraints (must finish all PARTs of an EPIC before starting the next).

## Execution Order (EPIC-level)

```text
EPIC <NN> — <name>          (<P?>, <comp>, <n> PARTs)
    │
    ▼
EPIC <NN> — <name>          (<P?>, <comp>, <n> PARTs)   [parallel with ? possible]
    │
    ▼
…
```

### Critical Path

`EPIC X → EPIC Y → EPIC Z` must run sequentially. EPIC W can run in parallel with Y.

### Per-EPIC PART Order

| EPIC | PARTs (in order) |
|---|---|
| <NN> — <name> | 01 → 02 → … → nn |
| <NN> — <name> | … |

## Dependency Notes

- **Hard dependency:** every PART of an EPIC must have all 8 gates signed before
  the next EPIC starts.
- **Soft dependency:** within EPIC <NN>, PART02 references PART01.

## Shard Gates (= 8 Gates per PART)

Every PART passes, IN ORDER, the 8 gates:

1. Architecture Review · 2. Scope & Completeness Audit · 3. UX/Design Review ·
4. Manual / Runtime Validation · 5. Defect Closure · 6. Technical Documentation ·
7. User Documentation · 8. Final Review & Sign-off.

## Stop Conditions

- A PART cannot be `Terminated` without all 8 gates signed.
- The hand-off to Ryou Orchestrator is BLOCKED until every EPIC's % is 100 %.
- The planner aborts with structured error if invoked while PARTs are missing for
  an EPIC in `EN CURSO`.

## Completion Criteria (packet level)

The packet closes when:

- N/N EPICs are `Terminado`.
- `verification.md` has its "Aggregated Gates" section with `8 × M` gates passed.
- Worked-example (if applicable) exists with EPICs and PARTs footers firmados.

## Handoff to Ryou Orchestrator

When `progress.md` reads `planning-complete`, Ryou Orchestrator receives:

```text
Hand-off a Ryou Orchestrator.

EPICs (N total, orden de ejecución — critical path):
  <NN> — <epic>  →  PART01..mm   (M PARTs)
  <NN> — <epic>  →  …

Total: M PARTs.
For each PART, expect 8 gates in strict order; sign-off in PART footer.
Estado del packet: planning-complete.
NO comenzar hasta confirmación explícita.
```
