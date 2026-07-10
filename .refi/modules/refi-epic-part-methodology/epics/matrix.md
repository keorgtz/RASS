# Epic Matrix · REFI — Upgrade to Epic + PART Methodology

> **Strategy:** Every EPIC's PARTs are 100 % detailed BEFORE any code is touched.
> Status legend: **Backlog** = only this README; **PARTs detallados** = planeación
> completa, pendiente de ejecución; **EN CURSO** = ejecutando PARTs; **Terminado** =
> 8 puertas cerradas por TODOS los PARTs.

Complexity: **B**=Baja · **M**=Media · **A**=Alta · **MA**=Muy alta.
Duration: sesiones de trabajo enfocadas.

| # | Epic | Prioridad | Depende de | Complejidad | Duración | % | Estado |
|---|---|---|---|---|---|---|---|
| 1 | Conventions & Terminology | P0 | — | M | 2 | 0 % | Backlog (este README) |
| 2 | Ryou EFI Planner Agent Prompt | P0 | EPIC 01 | M | 2 | 0 % | Backlog |
| 3 | REFI Packet Contract & Folder Structure | P0 | EPIC 01, 02 | M | 3 | 0 % | Backlog |
| 4 | Templates & Module Skeleton | P0 | EPIC 01, 03 | M | 3 | 0 % | Backlog |
| 5 | 8-Gate Verification System | P0 | EPIC 01 | M | 2 | 0 % | Backlog |
| 6 | User Documentation & Worked Example | P1 | EPIC 01–05 | M | 3 | 0 % | Backlog |
| 7 | Backward Compatibility & Migration Helper | P2 | EPIC 03, 04 | M | 2 | 0 % | Backlog |
| 8 | Planning Method Selector | P1 | EPIC 01, 02, 03 | M | 2 | 0 % | Backlog |

**Total:** 8 EPICs · 31 PARTs planned · ~19 sesiones de trabajo.

## Execution Order

1. **EPIC 01 — Conventions & Terminology** (first; everything depends on it).
2. **EPIC 05 — 8-Gate Verification System** (parallel to 02; pure rules).
3. **EPIC 02 — Ryou EFI Planner Agent Prompt** (drives the workflow; needs 01 + 05).
4. **EPIC 03 — REFI Packet Contract & Folder Structure** (after 02; concrete folder design).
5. **EPIC 04 — Templates & Module Skeleton** (after 03; implements the templates).
6. **EPIC 06 — User Documentation & Worked Example** (after 01–05 finalized).
7. **EPIC 07 — Backward Compatibility & Migration** (can be deferred without blocking).
8. **EPIC 08 — Planning Method Selector** (after 01–03; makes the new prompt dual-mode
   and exposes the selector via UI/tool).

## EPIC ↔ Ryou-Orchestrator Mapping

Each EPIC is handed to **Ryou Orchestrator** as a unit. Orchestrator executes the EPIC's
PARTs in the EPIC's stated order, applying the 8 gates to each PART before moving on.
No PART may skip a gate.

## Status Update Rule

When a PART closes all 8 gates:
- The PART's footer records the date + signature.
- The EPIC's `%` in this matrix moves up proportionally.
- `progress.md` of this packet is updated.

When an EPIC closes all its PARTs:
- A commit with the trailer of coautoría is created.
- This matrix is updated (Backlog → TERMINADO).
- Orchestrator moves to the next EPIC in the order above.
