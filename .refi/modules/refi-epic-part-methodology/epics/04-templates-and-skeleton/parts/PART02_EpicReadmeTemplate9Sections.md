# PART02 — Epic README Template (9 Sections)

## 1. Purpose
Crear `templates/epic-readme-template.md` con las 9 secciones definidas en EPIC 01 PART02.

## 2. Current State
No existe un template de "Epic README" en REFI v1.

## 3. Comparison against baseline
EpicPlanification `Designer/README.md` sirve de modelo; REFI v2 lo formaliza con una
lista de 9 secciones obligatorias.

## 4. Missing / Required Scope
El archivo debe contener:

- `# EPIC NN — <Name>`.
- Meta-line con `**Prioridad:**`, `**Complejidad:**`, `**Completitud (8 puertas):**`,
  `**Estado:**`.
- `## Alcance`.
- `## Objetivos` (lista de 3–7 viñetas).
- `## Dependencias` (entrantes y salientes).
- `## Complejidad y prioridad` (justificación de 2–4 líneas).
- `## Files to Modify / Create` (rutas exactas, sin especulación).
- `## PARTs planificados` (lista numerada, una línea de descripción por PART).
- `## Definición de Done` (qué condiciones cierran el EPIC).

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
Si el template no enumera las 9 secciones, los EPICs divergen.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
N/A.

## 9. Required Improvements
1. Crear `templates/epic-readme-template.md` con las 9 secciones.

## 10. Implementation Plan
1) Texto canónico en este PART.
2) Aplicar a `templates/epic-readme-template.md`.

## 11. Automated Test Plan
- Test: el archivo contiene exactamente las 9 secciones en orden.

## 12. Manual Validation Checklist
- [ ] Las 9 secciones están en orden.
- [ ] El meta-line usa los 4 campos.

## 13. Technical Documentation to produce
- `templates/epic-readme-template.md`.

## 14. User Documentation to produce
EPIC 06.

## 15. Acceptance Criteria
- Archivo creado.
