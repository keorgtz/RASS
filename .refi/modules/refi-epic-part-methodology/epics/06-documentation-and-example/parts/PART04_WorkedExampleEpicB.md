# PART04 — Worked Example · Epic B · "Help & Docs"

## 1. Purpose
Demostrar un segundo Epic en el mismo worked-example, completando el patrón.

## 2. Current State
EPIC 06 PART03 cubre solo Epic A.

## 3. Comparison against baseline
EpicPlanification demuestra 26 EPICs; aquí 2 son suficientes para el patrón.

## 4. Missing / Required Scope
Epic B (`02-help-and-docs`) cubre:

- PART01_HelpTexts — cada comando tiene `--help` con texto claro, anchor contra
  `commander` o similar como baseline.
- PART02_ReadmeGen — comando `todo readme` que imprime un README con la lista,
  anchor contra `chalk` (no inventar paleta de colores).
- PART03_ManualSmoke — checklist manual: añadir 3 todos, listar, completar 1,
  listar, persistencia tras cerrar CLI.

Cada PART usa las 15 secciones + footer.

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
N/A.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
N/A.

## 9. Required Improvements
1. Crear los 3 PARTs del Epic B.

## 10. Implementation Plan
1) Lista arriba.
2) Aplicar a la estructura.

## 11. Automated Test Plan
- Linter: los 3 PARTs existen.
- Test de coherencia: las §3 de los PARTs citan baselines reales (commander, chalk).

## 12. Manual Validation Checklist
- [ ] Cada PART tiene 15 secciones.
- [ ] Cada PART footer tiene 8 huecos para gates.

## 13. Technical Documentation to produce
- Mismo worked-example.

## 14. User Documentation to produce
EPIC 06 cubre este PART.

## 15. Acceptance Criteria
- 3 PARTs completos con §3 anclada.
