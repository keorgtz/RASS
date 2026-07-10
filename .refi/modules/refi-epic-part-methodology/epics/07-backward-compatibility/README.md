# EPIC 07 — Backward Compatibility & Migration Helper

**Prioridad:** P2 · **Complejidad:** M · **Completitud (8 puertas):** 0 %
**Estado:** Backlog (este README; PARTs detallados en Pass 2)

## Alcance

Proveer una forma explícita y opcional de migrar un paquete legacy
(`master-blueprint.md` + `domain-shards/01-*.md`) al nuevo formato
(`epics/<epic>/...` + 8 gates).

- Un helper en `scripts/` (Node.js) que lea un paquete legacy y produzca el equivalente
  en EPICs + PARTs (migración 1:1).
- Un snippet de README en `.opencode/refi/README.md` que explique cuándo aplicar.
- Reglas claras: la migración es OPCIONAL; los legacy siguen funcionando.

NO incluye: implementar el helper (eso es opcional y puede ser un stub); migrar los 4
paquetes existentes automáticamente.

## Objetivos

1. Cero presión sobre paquetes legacy funcionando.
2. Camino claro y documentado para migrar cuando el dueño lo decida.
3. Si el helper se implementa, es determinista (mismo input → mismo output).

## Dependencias

- **Entrantes:** EPIC 03 (contrato nuevo), EPIC 04 (templates).
- **Salientes:** consumido solo si el usuario decide migrar.

## Files to Modify / Create

- **Create:** `scripts/migrate-refi-module.js` (opcional, stub documentado).
- **Update:** `.opencode/refi/README.md` con la sección "Migrating legacy packets".

## PARTs planificados (3)

- **PART01_MigrationStrategyAndExclusions** — declarar la postura: legacy opcional,
  no auto-migrar.
- **PART02_MigrationHelperScript_Optional** — esqueleto del helper Node.js (input →
  output determinista).
- **PART03_Documentation_HowToMigrate** — snippet de README / doc con pasos manuales
  para migrar un paquete legacy.

## Definición de Done

- Sección "Migrating legacy packets" en `refi/README.md`.
- Script opcional con esqueleto y dry-run funcional.
- Verificar que los 4 paquetes legacy siguen parseando tras los cambios.
