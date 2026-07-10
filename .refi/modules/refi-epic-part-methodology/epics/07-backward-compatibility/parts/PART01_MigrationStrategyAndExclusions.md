# PART01 — Migration Strategy & Exclusions

## 1. Purpose
Fijar la postura oficial: legacy = opcional + sin auto-migración silenciosa.

## 2. Current State
No hay postura documentada; los 4 paquetes legacy siguen viviendo.

## 3. Comparison against baseline
EpicPlanification fue una decisión del propietario; aquí REFI v2 lo traduce a una
política explícita para evitar reescrituras accidentales.

## 4. Missing / Required Scope
La política oficial:

- **Migración opcional.** Los paquetes legacy NO se migran automáticamente. El dueño
  decide por paquete.
- **Doble formato soportado.** El parser reconoce:
  - Nuevo: `epics/matrix.md` + `epics/<epic>/README.md` + `epics/<epic>/parts/PART*.md`.
  - Legacy: `master-blueprint.md` + `domain-shards/01-*.md` + `orchestration-map.md`.
- **Documentar la elección.** Cada paquete lleva un header en su README de cabecera
  declarando "PlanificationType: epic-part" o "PlanificationType: legacy-shards".
- **Sin reescritura silenciosa.** Nunca se sobreescribe un paquete legacy al cargar
  uno nuevo en el mismo slug.

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
Una auto-migración dañina podría borrar dominios shard útiles del legacy.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
La política explícita reduce la tentación de "normalizar" paquetes viejos.

## 9. Required Improvements
1. Bloque arriba en `refi/README.md`.

## 10. Implementation Plan
1) Texto arriba.
2) Aplicar.

## 11. Automated Test Plan
- Test: el linter reconoce ambos formatos.

## 12. Manual Validation Checklist
- [ ] La política está escrita en `refi/README.md`.

## 13. Technical Documentation to produce
- `refi/README.md`.

## 14. User Documentation to produce
EPIC 06 cubre este PART.

## 15. Acceptance Criteria
- Política textual presente.
- Doble formato soportado.
