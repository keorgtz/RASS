# PART02 — Required Files Contract

## 1. Purpose
Declarar el conjunto mínimo de archivos OBLIGATORIOS al cierre de Pass 1.

## 2. Current State
REFI v1 requiere 6 archivos al terminar un packet; ninguno distingue entre Pass 1
(planeación) y Pass 2 (ejecución).

## 3. Comparison against baseline
EpicPlanification obliga 1 roadmap maestro + 1 README por Epic + N PARTs.

## 4. Missing / Required Scope
Al cierre de Pass 1, el packet debe contener, como mínimo:

1. `request.md` — request original preservada.
2. `master-blueprint.md` — incluye el desglose de EPICs.
3. `epics/matrix.md` — matriz con TODOS los EPICs (prioridad, deps, complejidad, %).
4. Por cada EPIC: `epics/<NN-slug>/README.md`.

Al cierre de Pass 2 (por EPIC detallado):

5. Por cada PART planificado: `epics/<NN-slug>/parts/PARTnn.md` con las 15 secciones.

Al cierre de Pass 3 (hand-off):

6. `orchestration-map.md`, `progress.md`, `verification.md` actualizados.

`domain-shards/` permanece opcional.

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
Si el planner termina Pass 1 sin los 4 archivos mínimos, EPIC 02 (Gating) lo prohíbe.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
N/A.

## 9. Required Improvements
1. Listar los 4 + 1 + 3 arriba en `refi/README.md`.

## 10. Implementation Plan
1) Lista canónica en este PART.
2) Aplicar a `refi/README.md`.

## 11. Automated Test Plan
- Test al cierre de Pass 1: detecta los 4 archivos.
- Test al cierre de Pass 2: para cada EPIC, los PARTs detallados coinciden con los
  planificados (count + slug).

## 12. Manual Validation Checklist
- [ ] La lista aparece en `refi/README.md`.
- [ ] El planner (EPIC 02) referencia la lista.

## 13. Technical Documentation to produce
- Bloque en `refi/README.md`.

## 14. User Documentation to produce
EPIC 06.

## 15. Acceptance Criteria
- Lista exacta de los 4 + 5 + 3 archivos.
