# PART02 — Migration Helper Script (Optional)

## 1. Purpose
Proveer un esqueleto de helper Node.js que traduzca un paquete legacy a EPIC/PART.
El script puede quedarse en stub durante v1; la prioridad es la política, no la herramienta.

## 2. Current State
No existe helper.

## 3. Comparison against baseline
EpicPlanification no tiene herramienta equivalente; aquí opcional y mínima.

## 4. Missing / Required Scope
`scripts/migrate-refi-module.js`:

```js
#!/usr/bin/env node
/**
 * REFI v2 — Optional helper.
 *
 * Input:  .refi/modules/<slug>/  (legacy shape: master-blueprint.md + domain-shards/01-*.md)
 * Output: .refi/modules/<slug>-v2/  (epics/<epic>/...)
 *
 * Behaviour:
 *  - Pure function: deterministic.
 *  - NEVER overwrites the original.
 *  - Creates a NEW folder with the migrated packet.
 *  - If plan shape doesn't match legacy, refuses and prints the error.
 *
 * Usage:
 *  node scripts/migrate-refi-module.js <slug> [--dry-run] [--output=<new-slug>]
 */
```

El helper:

1. Lee `master-blueprint.md` legacy.
2. Por cada entrada en "Execution Shards" produce un PART en
   `epics/<epic>/parts/PARTnn.md`, mapeando secciones 7-a-15 con placeholders.
3. Crea un único Epic `00-legacy-shards` que contiene todos los PARTs migrados.
4. Reporta un diff textual si `--dry-run`.

Cada PART migrado debe marcarse como `Migrated from legacy shard <old>` en su footer.

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
La conversión 7→15 secciones implica pérdida de detalle (no se puede adivinar §3
`Comparison`). El script avisa y deja huecos a llenar.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
N/A.

## 9. Required Improvements
1. Crear el script con el esqueleto anterior.

## 10. Implementation Plan
1) Bloque arriba.
2) Aplicar.

## 11. Automated Test Plan
- Test dry-run contra `reasp-backup-manager` legacy: produce 6 PARTs en Epic
  `00-legacy-shards` sin tocar el original.

## 12. Manual Validation Checklist
- [ ] El script existe y dry-run funciona.
- [ ] No toca el original.

## 13. Technical Documentation to produce
- `scripts/migrate-refi-module.js`.

## 14. User Documentation to produce
EPIC 06 cubre este PART + README del script.

## 15. Acceptance Criteria
- Script + dry-run OK.
- Output determinista.
