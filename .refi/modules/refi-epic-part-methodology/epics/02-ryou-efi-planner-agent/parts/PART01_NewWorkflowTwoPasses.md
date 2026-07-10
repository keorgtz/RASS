# PART01 — New Workflow · Two Passes

## 1. Purpose
Codificar en el prompt de Ryou EFI Planner un workflow de DOS pasadas para forzar
planificación 100 % antes de ejecución.

## 2. Current State
El prompt actual describe 7 pasos lineales (Preserve request → Write blueprint → Split
shards → Map → Implement → Verify). No hay gates de usuario y no usa EPIC/PART.

## 3. Comparison against baseline
EpicPlanification §7 separa **planeación** (detalle 100 % de PARTs) de **ejecución**
(código PART por PART con 8 gates). REFI v2 replica esa división en el prompt.

## 4. Missing / Required Scope
Reemplazar los 7 pasos actuales por:

**Pass 1 — Epic Breakdown**

1. Preserve the request (`request.md`).
2. Write `master-blueprint.md` with EPIC breakdown (incluye `epics/matrix.md`).
3. For each EPIC, write `epics/<NN-slug>/README.md` (backlog only — planned PARTs list,
   NOT yet detailed).
4. **STOP · WAIT FOR USER CONFIRMATION** ("¿Quieres que detalle los PARTs del EPIC X?"

**Pass 2 — PART Detail** (per EPIC, on user demand)

5. For each PART of the chosen EPIC, write `epics/<epic>/parts/PARTnn.md` using the
   15-section template (incluyendo footer de 8 gates).
6. **STOP · WAIT FOR USER CONFIRMATION** between EPICs (si el usuario pide EPIC por EPIC).
7. Repeat 5–6 until all EPICs of the packet have their PARTs detailed.

**Pass 3 — Orchestration & Handoff**

8. Write `orchestration-map.md` (EPIC order + per-EPIC PART order + 8-gate cycle).
9. Update `progress.md` and `verification.md`.
10. Hand off to `ryou-orchestrator` with explicit acceptance criteria per PART.

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
Si el prompt omite los STOP, el agente ejecuta prematuramente; sigue siendo la causa
histórica de alucinaciones.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
El prompt actual mezcla "plan" y "implement"; este PART los separa formalmente.

## 9. Required Improvements
1. Reescribir el bloque "Primary Mission" del agente con este flujo.
2. Eliminar la línea "Implement shard by shard" del prompt actual.

## 10. Implementation Plan
1) Definir el flujo en este PART.
2) Aplicarlo al prompt en `.opencode/agents/ryou-efi-planner.md`.

## 11. Automated Test Plan
- Test: ejecutar el prompt contra un request sintético y verificar el orden de
  archivos creados (request → blueprint → epics/matrix → epics/<epic>/README → STOP).

## 12. Manual Validation Checklist
- [ ] El prompt actual se reemplaza por las 3 Passes.
- [ ] El prompt NO contiene instrucciones de "implementar primero".
- [ ] Hay un STOP explícito al final de Pass 1.

## 13. Technical Documentation to produce
- Bloque "Workflow" en el prompt del agente.

## 14. User Documentation to produce
EPIC 06.

## 15. Acceptance Criteria
- Bloque "Workflow" contiene los 10 pasos numerados arriba.
- El prompt cita explícitamente "STOP · WAIT FOR USER" en los lugares correctos.
