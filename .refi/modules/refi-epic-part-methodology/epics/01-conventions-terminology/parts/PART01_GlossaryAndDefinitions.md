# PART01 — Glossary & Definitions

## 1. Purpose
Fijar el vocabulario canónico de REFI v2 (Epic + PART) en un único glosario para evitar
derivas entre los EPICs 02–05 y los futuros módulos REFI.

## 2. Current State
REFI v1 no tiene glosario formal; los términos "shard", "domain", "scope" se usan
indistintamente. El equipo aprendió el nuevo vocabulario mirando
`PlanificationTypes/EpicPlanification/` ad-hoc.

## 3. Comparison against baseline
EpicPlanification usa `Epic`, `PART`, `README.md` por Epic, plantilla de 15 secciones por
PART, y una matriz maestra. REFI v1 debe alinearse con esos términos y NO renombrarlos.

## 4. Missing / Required Scope
Definir y publicar en `.opencode/refi/rules/epic-glossary.md`:

- **REFI** — sistema de planificación de paquetes empresariales dentro de REASP.
- **REFI Packet** — carpeta `.refi/modules/<slug>/` que contiene la planificación completa.
- **Epic** — unidad de planificación de alto nivel, alineada a subsistema o capacidad
  entregable. Vive en `epics/<NN-slug>/`. Tiene su propio `README.md` (backlog).
- **PART** — unidad de planificación/ejecución dentro de un Epic. Sigue la plantilla
  de 15 secciones. Vive en `epics/<epic>/parts/PARTnn_<slug>.md`.
- **8 Gates** — ciclo obligatorio por PART: Architecture Review, Scope & Completeness
  Audit, UX/Design Review, Manual Validation, Defect Closure, Tech Doc, User Doc,
  Final Review & Sign-off.
- **Baseline** — el ancla contra la que se compara un PART en su sección 3. Por defecto
  es el código real del proyecto; puede ser un competidor o una convención.
- **Acceptance Criteria** — bullets concretos, verificables, que cierran el PART.
- **Quality Gate Evidence** — capturas, logs, diff, snippets que respaldan el cierre
  de cada una de las 8 puertas; vive en el footer del PART.
- **Planning 100 % Rule** — los PARTs de todos los EPICs se detallan antes de tocar código.
- **Shards (legacy)** — ejecución unitaria REFI v1; sobrevive en `domain-shards/` para
  tareas cross-cutting no encuadrables en un Epic.

## 5. UX Problems
N/A — sin UI.

## 6. Backend / Logic Problems
Riesgo: si los agentes usan términos viejos, se reintroduce la fragmentación REFI v1.
Mitigación: el prompt Ryou EFI Planner (EPIC 02) debe usar exclusivamente el glosario.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
Ninguna.

## 9. Required Improvements
1. Crear `.opencode/refi/rules/epic-glossary.md` con el contenido de §4 + cross-links.
2. Referenciar el glosario desde `rules/global-rules.md` (EPIC 01, PART05).

## 10. Implementation Plan
1) Borrador del glosario en este PART.
2) Crear `rules/epic-glossary.md` con el contenido aprobado.
3) Una entrada "see epic-glossary.md" en `rules/global-rules.md`.
4) Cross-link al menos a `PlanificationTypes/EpicPlanification/Designer/README.md`.

## 11. Automated Test Plan
- Test de coherencia léxica: grep en `.opencode/refi/` para asegurar que ningún agente
  nuevo usa "phase" para referirse a un Epic ni "shard" para un PART.

## 12. Manual Validation Checklist
- [ ] Leer `rules/epic-glossary.md` y poder explicar cada término sin ambigüedad.
- [ ] Confirmar que los términos coinciden 1:1 con EpicPlanification.
- [ ] Confirmar que están citados desde `rules/global-rules.md`.

## 13. Technical Documentation to produce
- `rules/epic-glossary.md`.

## 14. User Documentation to produce
Sección corta en `README.md` raíz ("REFI planning terminology") — implementada en EPIC 06.

## 15. Acceptance Criteria
- Archivo `rules/epic-glossary.md` creado con los 11 términos y cross-links.
- Búsqueda de "domain shard" en prompts oficiales devuelve 0 hits nuevos (los legados
  siguen siendo válidos).
- Ryou EFI Planner no inicia su prompt sin antes leer el glosario.
