# PART01 — README Methodology Section

## 1. Purpose
Añadir una sección al `README.md` raíz que explique la nueva metodología.

## 2. Current State
README.md menciona REFI pero no entra en detalle de planificación.

## 3. Comparison against baseline
EpicPlanification está documentado en `00_MASTER_PRODUCT_COMPLETION.md`; README raíz
de REASP debe tener un resumen equivalente.

## 4. Missing / Required Scope
Insertar (o actualizar) una sección con:

```md
## 🧭 REFI v2 · Epic + PART Methodology

REFI now plans every enterprise request using a two-pass, gate-honest workflow:

1. **Pass 1 — Epic Breakdown.** Ryou EFI Planner produces `request.md`,
   `master-blueprint.md`, `epics/matrix.md`, and one `README.md` per Epic
   (the backlog). Then **it stops** and asks you to confirm.
2. **Pass 2 — PART Detail.** On your demand, the planner expands each PART of
   the chosen Epic using a 15-section template (Purpose → Acceptance Criteria).
   Repeat until every Epic in the packet has its PARTs.
3. **Pass 3 — Orchestration & Handoff.** The planner emits
   `orchestration-map.md`, `progress.md`, and `verification.md`, and hands the
   whole packet to Ryou Orchestrator.
4. **Execution.** Each PART traverses 8 mechanical gates
   (Architecture · Scope · UX · Manual · Defect Closure · Tech Doc · User
   Doc · Sign-off) before being marked Terminated.

Result: better decomposition, fewer hallucinations, and a clean handoff to
Orchestrator with no mid-flight replanning.
```

## 5. UX Problems
N/A — markdown del README.

## 6. Backend / Logic Problems
N/A.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
N/A.

## 9. Required Improvements
1. Insertar el bloque arriba en el `README.md` raíz.

## 10. Implementation Plan
1) Bloque arriba.
2) Insertarlo bajo la sección de "REASP" existente.

## 11. Automated Test Plan
- Linter de markdown: la sección existe y los 3 PASSES están listados.

## 12. Manual Validation Checklist
- [ ] El bloque aparece en el README.
- [ ] Está diferenciado visualmente (badge o emoji coherente).

## 13. Technical Documentation to produce
- `README.md` raíz.

## 14. User Documentation to produce
Este PART.

## 15. Acceptance Criteria
- Bloque presente, las 3 Passes citadas, las 8 gates citadas.
