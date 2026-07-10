# PART01 — Quality Gates v2

## 1. Purpose
Sustituir `rules/quality-gates.md` por una tabla numerada de 8 puertas con evidencia
mínima exigida.

## 2. Current State
El archivo actual lista 5 viñetas genéricas; no hay evidencia exigida.

## 3. Comparison against baseline
EpicPlanification §3 codifica las 8 puertas con su evidencia; REFI v2 lo replica.

## 4. Missing / Required Scope
Reemplazar el contenido por esta tabla (resumida; el archivo es la fuente canónica):

| # | Gate | Evidence mínima |
|---|------|-----------------|
| 1 | Architecture Review | Notas comparando el diseño con las invariantes del proyecto + ID de ADRs cuando existan. |
| 2 | Scope & Completeness Audit | Tabla "declared vs actual" cerrando todos los gaps como `accepted` o `filled`. |
| 3 | UX/Design Review | Capturas (UI) o diffs de tokens/componentes MeridianUI; en no-UI, contratos o mensajes de error. |
| 4 | Manual / Runtime Validation | Checklist §12 ejecutada con tickboxes; logs o capturas por ítem. |
| 5 | Defect Closure | Issues o notas inline con la resolución; ningún defecto abierto. |
| 6 | Technical Documentation | Links o diffs a docs técnicos producidos. |
| 7 | User Documentation | Links o diffs a docs de usuario producidos. |
| 8 | Final Review & Sign-off | Build 0/0 + suite verde + Acceptance Criteria re-leído + footer firmado. |

Reglas adicionales:

- Orden estricto 1→8; saltarse una bloquea el sign-off.
- Cada gate deja una línea en el footer del PART (ver `templates/part-template.md`).

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
Si las gates son decorativas, las hallucinations vuelven.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
El archivo actual queda obsoleto.

## 9. Required Improvements
1. Reemplazar `rules/quality-gates.md` por la tabla de §4.

## 10. Implementation Plan
1) Tabla arriba.
2) Reemplazar el archivo.

## 11. Automated Test Plan
- Linter: el archivo contiene exactamente 8 filas en la tabla con las evidencias textuales.

## 12. Manual Validation Checklist
- [ ] La tabla está en `rules/quality-gates.md` v2.
- [ ] Las 8 evidencias son específicas, no genéricas.

## 13. Technical Documentation to produce
- `rules/quality-gates.md` v2.

## 14. User Documentation to produce
EPIC 06.

## 15. Acceptance Criteria
- Archivo sustituido.
- 8 filas presentes.
