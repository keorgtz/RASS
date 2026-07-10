# PART03 — Epic Matrix Template

## 1. Purpose
Crear `templates/epic-matrix-template.md` con la tabla de EPICs y las reglas de
transición de estado.

## 2. Current State
REFI v1 no tiene matriz; los módulos usan tablas ad-hoc en sus blueprints.

## 3. Comparison against baseline
EpicPlanification `00_MASTER_PRODUCT_COMPLETION.md` §5 es la inspiración.

## 4. Missing / Required Scope
El archivo debe contener:

- H1 `# Epic Matrix · <Module Name>`.
- Bloque introductorio que recuerde la estrategia (plan 100 % antes de código) y los
  4 estados (`Backlog`, `PARTs detallados`, `EN CURSO`, `Terminado`).
- Tabla con columnas: `#`, `Epic`, `Prioridad`, `Depende de`, `Complejidad`,
  `Duración`, `%`, `Estado`.
- Lista de "Execution Order" explícita (los 4 primeros EPICs críticos y luego los
  secundarios).
- Bloque "EPIC ↔ Ryou-Orchestrator Mapping".
- Bloque "Status Update Rule" con la fórmula del % y el commit ritual.

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
Sin matriz, los EPICs se planifican sin visibilidad cruzada.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
N/A.

## 9. Required Improvements
1. Crear `templates/epic-matrix-template.md`.

## 10. Implementation Plan
1) Texto canónico en este PART.
2) Aplicar a `templates/epic-matrix-template.md`.

## 11. Automated Test Plan
- Test: el archivo contiene la tabla con 8 columnas exactas.

## 12. Manual Validation Checklist
- [ ] Columnas en el orden correcto.
- [ ] Estados enumerados.

## 13. Technical Documentation to produce
- `templates/epic-matrix-template.md`.

## 14. User Documentation to produce
EPIC 06.

## 15. Acceptance Criteria
- Archivo creado.
