# Epic Matrix · example-todo-cli

> Strategy: every EPIC's PARTs are 100 % detailed BEFORE any code is touched.

Complexity: **B** = Baja · **M** = Media · **A** = Alta · **MA** = Muy alta.
Duration: sesiones de trabajo enfocadas.

| # | Epic | Prioridad | Depende de | Complejidad | Duración | % | Estado |
|---|---|---|---|---|---|---|---|
| 1 | Setup CLI | P0 | — | M | 2 | 0 % | PARTs detallados (pendiente de ejecución) |
| 2 | Help & Docs | P1 | EPIC 01 | M | 1 | 0 % | PARTs detallados (pendiente de ejecución) |

**Total:** 2 EPICs · 6 PARTs · ~3 sesiones de trabajo.

## Execution Order

1. **EPIC 01 — Setup CLI** (foundations; everything else depends on it).
2. **EPIC 02 — Help & Docs** (depends on EPIC 01 to have commands in place).

## EPIC ↔ Ryou-Orchestrator Mapping

Each EPIC is handed to Ryou Orchestrator as a unit. Orchestrator executes PARTs in
the order declared and applies the 8 gates to each PART before moving on.

## Status Update Rule

PART footer signed → matrix % updates → `progress.md` updates. EPIC closure = commit
with trailer de coautoría.