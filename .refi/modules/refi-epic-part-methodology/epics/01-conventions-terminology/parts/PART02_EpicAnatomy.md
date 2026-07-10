# PART02 — Epic Anatomy

## 1. Purpose
Definir la anatomía formal de un Epic REFI: estructura de carpetas, secciones del
`README.md`, criterios de prioridad/complejidad/%, y cómo se mide su progreso.

## 2. Current State
REFI v1 no tiene "Epic"; lo más cercano es el list of sections del `master-blueprint.md`.
EpicPlanification define un Epic informal pero no lo formaliza.

## 3. Comparison against baseline
- EpicPlanification: un Epic es una carpeta `EpicName/` con `README.md` y `PARTNN*.md`.
- Glosario EpicPlanification: prioridad P0–P2, complejidad B/M/A/MA, duración estimada,
  dependencias, % de completitud.
- REFI v2 adopta exactamente la misma forma pero lo hace obligatorio (el `README.md`
  del Epic es EXIGIDO, no opcional).

## 4. Missing / Required Scope
Definir las secciones obligatorias del `epics/<NN-slug>/README.md`:

1. **Title** (`# EPIC NN — <Name>`)
2. **Header meta** (Prioridad, Complejidad, % completitud 8 puertas, Estado).
3. **Alcance** (qué subsistemas, qué capabilities; qué NO entra).
4. **Objetivos** (3–7 viñetas, cada una con criterio verificable).
5. **Dependencias** (entrantes y salientes; IDs de otros EPICs).
6. **Complejidad y prioridad** (justificación en 2–4 líneas).
7. **Files to Modify / Create** (rutas exactas, no especulativas).
8. **PARTs planificados** (lista numerada con un line de descripción por PART).
9. **Definition of Done (EPIC level)** — qué condiciones cierran el EPIC, no el PART.

Además, definir:

- **% completitud** = (PARTs que pasaron las 8 puertas) / (PARTs totales).
- **Estados válidos:** `Backlog` → `PARTs detallados` → `EN CURSO` → `Terminado`.
- **Regla de promoción:** un EPIC no entra a `EN CURSO` hasta que TODOS sus PARTs
  están en `PARTs detallados`.

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
Si un EPIC se "abre" antes de que sus PARTs estén detallados, vuelve a aparecer el
problema de "decidir mientras se ejecuta" que la nueva metodología intenta evitar.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
La versión actual de `modules/_template/` no tiene la carpeta `epics/`; EPIC 03 la crea.

## 9. Required Improvements
1. Publicar la plantilla `epics/<epic>/README.md` (su contenido canónico) como
   `templates/epic-readme-template.md` — implementado en EPIC 04.
2. Codificar la regla de promoción % en `rules/epic-glossary.md` (PART01).

## 10. Implementation Plan
1) Borrador de la anatomía en este PART.
2) Especificar la plantilla que usará `ryou-efi-planner` (EPIC 02).
3) Asegurar que la plantilla enumera las 9 secciones en orden.

## 11. Automated Test Plan
N/A — sin tests automatizables para plantillas de documentación.

## 12. Manual Validation Checklist
- [ ] El `README.md` de un Epic puede escribirse siguiendo sólo esta especificación.
- [ ] El % de completitud es trivialmente calculable a partir de la lista de PARTs.
- [ ] El planner (EPIC 02) genera `epics/<epic>/README.md` siguiendo las 9 secciones.

## 13. Technical Documentation to produce
- `templates/epic-readme-template.md` (EPIC 04).

## 14. User Documentation to produce
EPIC 06.

## 15. Acceptance Criteria
- Las 9 secciones del Epic README están listadas en este PART.
- La fórmula del % está explícita: `completed_parts / planned_parts`.
- Los 4 estados están definidos y son los únicos valores válidos en `epics/matrix.md`.
