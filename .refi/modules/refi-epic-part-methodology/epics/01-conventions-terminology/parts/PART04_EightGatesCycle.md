# PART04 — Eight Gates Cycle

## 1. Purpose
Codificar las 8 puertas que todo PART debe atravesar antes de ser marcado "Terminado",
incluyendo la evidencia mínima requerida por cada una.

## 2. Current State
REFI v1 `rules/quality-gates.md` lista sólo 5 puertas genéricas sin evidencia exigida.

## 3. Comparison against baseline
EpicPlanification §3 codifica las 8 puertas y exige evidencia; REFI v2 hereda el mismo
esquema.

## 4. Missing / Required Scope

| # | Gate | Evidence mínima |
|---|------|-----------------|
| 1 | **Architecture Review** | Notas de contraste contra las invariantes / ADRs del proyecto. |
| 2 | **Scope & Completeness Audit** | Tabla "declared vs actual" con todos los gaps clasificados (accepted / filled). |
| 3 | **UX/Design Review** | Capturas de pantalla si UI; diff de tokens MeridianUI o links a componentes reutilizados. |
| 4 | **Manual / Runtime Validation** | Checklist §12 ejecutado, con tickboxes; logs/evidencia por ítem tickado. |
| 5 | **Defect Closure** | Issues/PRs cerrados en este PART o notas inline en el footer del PART. |
| 6 | **Technical Documentation** | Links o diff a docs técnicos producidos (sueltos en `docs/` o `refi/docs/`). |
| 7 | **User Documentation** | Links o diff a docs de usuario producidos. |
| 8 | **Final Review & Sign-off** | Build 0/0 + suite verde + Acceptance Criteria re-leído + footer firmado. |

Reglas adicionales:

- Las puertas se atraviesan **en orden**; saltar una es bloquear la promoción del PART.
- Cada gate deja una línea mínima en el footer del PART (ver PART03 §4).
- El "Sign-off" (puerta 8) NO ocurre hasta que las 7 anteriores están llenas.

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
Sin evidencia explícita, las puertas son decorativas; cualquier cosa puede marcarse verde.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
N/A.

## 9. Required Improvements
1. Sustituir `.opencode/refi/rules/quality-gates.md` por la tabla §4 (EPIC 05).
2. Hacer que `verification.md` del packet pida por gate, no genéricamente.

## 10. Implementation Plan
1) Tabla arriba en este PART.
2) EPIC 05 la convierte en el cuerpo de `rules/quality-gates.md` v2.

## 11. Automated Test Plan
- Test de contract: `verification.md` de cada packet nuevo contiene 8 secciones con el
  mismo nombre que las 8 puertas.

## 12. Manual Validation Checklist
- [ ] Leer este PART + EPIC 05 y poder nombrar la evidencia de cada gate.
- [ ] Confirmar que el orden es 1→8 y que 8 no se firma antes de 1–7.

## 13. Technical Documentation to produce
- `rules/quality-gates.md` v2 (EPIC 05).

## 14. User Documentation to produce
EPIC 06.

## 15. Acceptance Criteria
- Las 8 puertas están numeradas y ordenadas.
- Cada puerta declara evidencia mínima.
- El orden es estricto.
