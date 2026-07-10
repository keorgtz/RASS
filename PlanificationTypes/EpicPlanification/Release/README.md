# Epic: Release — backlog

**Prioridad:** P0 (cierre del programa) · **Complejidad:** Alta ·
**Completitud (8 puertas):** 20 % · **Estado:** Backlog — SIEMPRE el último Epic

## Alcance

`Release` (canales, notas, manifest), `Upgrade` (ApiSurface, BreakingChangeDetector,
contratos protegidos), `CI` (workflows, RegressionGate), `Governance` (SemVerPolicy,
deprecaciones, LTS, ReleaseValidator) y la ejecución final de `RELEASE_CHECKLIST.md`
(Fase 27) para promover `1.0.0-rc.1` → **1.0.0 Stable**.

## Objetivos

1. Todos los Epics anteriores CERRADOS (precondición dura — este Epic audita eso).
2. CI verde de punta a punta en runner limpio (incluida la estrategia raster del
   Epic Headless).
3. Captura de `ApiSurface` 1.0 comprometida como contrato de compatibilidad.
4. Notas de release, manifest firmado, artefactos publicados, tag `v1.0.0`.

## Dependencias

- TODOS los Epics. No inicia hasta que la matriz maestra esté 100 % salvo Release.

## PARTs planificados (8)

- PART01_ProgramAudit — verificación de cierre de los 25 Epics restantes
- PART02_CiPipeline — workflow completo en runner limpio, gates activos
- PART03_ApiFreeze — captura de superficie 1.0, política de breaking changes
- PART04_ReleaseChecklist — ejecución ítem por ítem de RELEASE_CHECKLIST.md
- PART05_ReleaseNotes — notas 1.0, changelog desde el inicio, manifest firmado
- PART06_GoldenBuild — build final reproducible, artefactos, tag
- PART07_PostReleasePolicy — LTS, canales, ventanas de deprecación
- PART08_FinalReview — retrospectiva del programa y cierre formal
