# PART01 — Part Template (15 Sections)

## 1. Purpose
Crear `templates/part-template.md` con las 15 secciones obligatorias + footer de 8 gates.

## 2. Current State
Sólo existe `templates/domain-shard-template.md` (7 secciones).

## 3. Comparison against baseline
EpicPlanification PART template es de 15 secciones; REFI v2 replica.

## 4. Missing / Required Scope
El archivo debe contener:

- H1 con naming: `# PARTnn — <Name>`.
- Bloques `## 1. Purpose`, `## 2. Current State`, …, `## 15. Acceptance Criteria`.
- Después de §15, separador `---` y un bloque fijo `## Gates Evidence` con 8 viñetas
  numeradas (`Gate 1 (Architecture Review): …`, ..., `Gate 8 (Final Review & Sign-off): …`).
- Cada viñeta incluye placeholder `<evidence-link-or-path>`.
- Cierra con: `**Signed by:** _______________  **Date:** _______________`.
- Comentarios opcionales (bloque `<!-- … -->`) al lado de secciones que pueden ser N/A,
  recordando: Current State, Comparison, UX, Frontend.

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
Si el template no fuerza el bloque de gates, los PARTs viejos no tendrán dónde apuntar
la evidencia; los gates se vuelven decorativos.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
N/A.

## 9. Required Improvements
1. Crear `templates/part-template.md` con lo anterior.

## 10. Implementation Plan
1) Texto canónico en este PART.
2) Aplicar a `templates/part-template.md`.

## 11. Automated Test Plan
- Test: el archivo contiene exactamente 15 secciones `## N.` (numeradas) + bloque `## Gates Evidence`
  con 8 viñetas.

## 12. Manual Validation Checklist
- [ ] `templates/part-template.md` parsea bien.
- [ ] Las 15 secciones están en orden.
- [ ] El bloque de gates tiene 8 viñetas y placeholder de evidencia.

## 13. Technical Documentation to produce
- `templates/part-template.md`.

## 14. User Documentation to produce
EPIC 06.

## 15. Acceptance Criteria
- Archivo creado con contenido verificado por el linter.
