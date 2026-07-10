# PART03 — Verification.md Template

## 1. Purpose
Hacer que `modules/_template/verification.md` pida explícitamente las 8 subsecciones por
PART (no genéricamente).

## 2. Current State
El template actual dice simplemente "Pendiente".

## 3. Comparison against baseline
EpicPlanification usa `verification.md` con secciones por ítem verificable.

## 4. Missing / Required Scope
Sustituir el contenido del template por:

```md
# Verification · <Module Name>

> Strategy: el cycle de las 8 puertas (Architecture · Scope · UX · Manual · Defect
> Closure · Tech Doc · User Doc · Final Sign-off) se aplica por PART. Esta página
> agrega los resultados a nivel packet.

## EPIC <NN> — <Name>

### PART01 — <Name>
- Gate 1 (Architecture Review): <evidence-link-or-path>
- Gate 2 (Scope & Completeness Audit): <evidence-link-or-path>
- Gate 3 (UX/Design Review): <evidence-link-or-path>
- Gate 4 (Manual / Runtime Validation): <evidence-link-or-path>
- Gate 5 (Defect Closure): <evidence-link-or-path>
- Gate 6 (Technical Documentation): <evidence-link-or-path>
- Gate 7 (User Documentation): <evidence-link-or-path>
- Gate 8 (Final Review & Sign-off): <evidence-link-or-path>

**Signed by:** _______________  **Date:** _______________

### PART02 — <Name>
… (mismo bloque)

## Aggregated Gates

- Total PARTs: <N>
- Total gates passed: <8N>
- Last update: <date>
- Status: <planning-complete | execution-in-progress | finished>
```

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
Sin este template, los paquetes nuevos crean `verification.md` inconsistentes y los
gates no se pueden agregar.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
El archivo actual queda obsoleto.

## 9. Required Improvements
1. Reemplazar `modules/_template/verification.md` por el bloque de §4.

## 10. Implementation Plan
1) Bloque arriba.
2) Aplicar al template.

## 11. Automated Test Plan
- Linter: el template incluye los literales "Gate 1", "Gate 8", "Signed by",
  "Aggregated Gates".

## 12. Manual Validation Checklist
- [ ] El template cubre una EPIC entera con sus PARTs.
- [ ] Los literales de los 8 gates están explícitos.

## 13. Technical Documentation to produce
- `modules/_template/verification.md`.

## 14. User Documentation to produce
EPIC 06.

## 15. Acceptance Criteria
- Template sustituido.
- Bloque aggregado final presente.
