# PART05 — Planning 100 % Rule

## 1. Purpose
Establecer la regla dura que ningún EPIC entra en `EN CURSO` hasta que TODOS los PARTs
de TODOS los EPICs del packet están detallados.

## 2. Current State
REFI v1 no formaliza esta regla; el planner suele saltarse a ejecutar al terminar el
"shard" 1.

## 3. Comparison against baseline
EpicPlanification §7 lo explicita como decisión del propietario y como proceso oficial.

## 4. Missing / Required Scope

- **Regla dura:** ningún código se escribe antes de que `epics/*.md` y todos los
  `epics/*/parts/PARTnn*.md` existan y sean consistentes entre sí.
- **Planificación 100 %:** no se permite implementar PARTs parciales; se detallan
  todos los PARTs, después se ejecuta.
- **Excepciones (explícitas y limitadas):**
  1. Tareas triviales sin EPIC (single file change, config tweak, doc fix) — se planifican
     como un único PART dentro de un único EPIC `00-trivials` y se ejecutan inmediatamente.
  2. Hotfixes de producción — registrados retroactivamente como un PART de un EPIC
     `zz-hotfixes` para auditoría, sin bloquear otros EPICs.
- **Señales de violación** que Ryou EFI Planner debe vigilar:
  - Falta de `epics/matrix.md`.
  - Falta de al menos un `epics/<epic>/README.md`.
  - Falta de al menos un `epics/<epic>/parts/PART*.md` cuando se pretende implementar.
  - Pedido del usuario de implementar pero aún no se detallaron PARTs.

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
Si se rompe la regla, el sistema vuelve al modo "decidir mientras se ejecuta" y las
alucinaciones regresan.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
N/A.

## 9. Required Improvements
1. Una cláusula explícita en `rules/global-rules.md` (EPIC 01, cierre de EPIC).
2. El Ryou EFI Planner (EPIC 02) NO genera código hasta detectar la regla cumplida.

## 10. Implementation Plan
1) Texto canónico en este PART.
2) EPIC 02 lo codifica en el prompt del agente.

## 11. Automated Test Plan
- Test: si se invoca al planner con `--apply-now` y no hay PARTs detallados, el planner
  aborta y devuelve un error estructurado.

## 12. Manual Validation Checklist
- [ ] Esta regla aparece en `rules/global-rules.md` v2.
- [ ] Aparece en el prompt de `ryou-efi-planner` (EPIC 02).
- [ ] Un humano entiende cuándo aplica y cuándo es una excepción.

## 13. Technical Documentation to produce
- Cláusula en `rules/global-rules.md` (EPIC 01 cierre).

## 14. User Documentation to produce
EPIC 06.

## 15. Acceptance Criteria
- La regla está escrita literalmente en al menos 2 sitios (rules/global-rules + prompt).
- Las excepciones están listadas y son limitadas.
- El planner aborta con error cuando se viola.
