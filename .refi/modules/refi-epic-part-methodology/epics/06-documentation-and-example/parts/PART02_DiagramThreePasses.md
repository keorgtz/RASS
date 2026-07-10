# PART02 — Diagram · Three Passes

## 1. Purpose
Crear un diagrama ASCII de los 3 Passes + 8 gates + hand-off.

## 2. Current State
No existe diagrama en REASP v1.

## 3. Comparison against baseline
EpicPlanification tiene un ASCII art similar en `00_MASTER_PRODUCT_COMPLETION.md` §3.

## 4. Missing / Required Scope
Diagrama a incluir en README y/o en `.refi/README.md`:

```text
            ┌────────────── Ryou EFI Planner ──────────────┐
            │                                               │
            │   Pass 1 — Epic Breakdown                     │
            │   ├─ request.md                                │
            │   ├─ master-blueprint.md (con EPIC breakdown)  │
            │   ├─ epics/matrix.md                           │
            │   └─ epics/<epic>/README.md  (x N)             │
            │        ⤷ STOP · WAIT FOR USER ⤷                │
            │   Pass 2 — PART Detail (por EPIC)              │
            │   └─ epics/<epic>/parts/PARTnn.md (15 sec.)     │
            │        ⤷ STOP · entre EPICs ⤷                  │
            │   Pass 3 — Orchestration                       │
            │   └─ orchestration-map.md / progress.md /       │
            │      verification.md                           │
            │        ⤷ HANDOFF TO ORCHESTRATOR ⤷             │
            │                                               │
            │   Cada PART atraviesa 8 gates                  │
            │   1·Architecture  2·Scope  3·UX  4·Manual      │
            │   5·DefectClosure 6·TechDoc 7·UserDoc 8·SignOff│
            └───────────────────────────────────────────────┘
```

## 5. UX Problems
El diagrama es sólo markdown; no afecta UI.

## 6. Backend / Logic Problems
N/A.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
N/A.

## 9. Required Improvements
1. Insertar el diagrama en `README.md` y/o `refi/README.md`.

## 10. Implementation Plan
1) Bloque arriba.
2) Aplicar.

## 11. Automated Test Plan
N/A.

## 12. Manual Validation Checklist
- [ ] El diagrama se renderiza bien en GitHub.
- [ ] Los nombres coinciden con el glosario (EPIC 01).

## 13. Technical Documentation to produce
- `README.md` raíz.
- `.opencode/refi/README.md`.

## 14. User Documentation to produce
Este PART.

## 15. Acceptance Criteria
- Diagrama presente en al menos un archivo user-facing.
