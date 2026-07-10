# PART04 — Module Scaffold Update

## 1. Purpose
Poblar `modules/_template/` con un árbol `epics/00-demo/` mínimo y un PART de muestra.

## 2. Current State
`modules/_template/` tiene sólo los 6 archivos mínimos REFI v1 (sin `epics/`).

## 3. Comparison against baseline
EpicPlanification tiene `00_MASTER_PRODUCT_COMPLETION.md` + carpetas Epic; REFI v2 lo
adapta a `epics/matrix.md` + `epics/<epic>/...`.

## 4. Missing / Required Scope
Actualizar `modules/_template/` con:

```text
modules/_template/
├── request.md              # placeholder
├── master-blueprint.md     # placeholder
├── epics/
│   ├── matrix.md           # placeholder con la tabla vacía
│   └── 00-demo/
│       ├── README.md       # ejemplo completamente lleno
│       └── parts/
│           └── PART01_demo.md   # ejemplo con las 15 secciones + footer de gates
├── orchestration-map.md    # placeholder
├── progress.md             # placeholder
└── verification.md         # placeholder
```

El PART de ejemplo debe tener:

- §1 Purpose claro y de baja complejidad.
- §3 Comparison contra el código real de `.opencode/refi/` (ancla verdadera).
- §15 Acceptance Criteria testables (5 viñetas).
- Footer de gates con placeholders.

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
Si el template está vacío sin ejemplo, los agentes no saben cómo se "ve" un PART.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
N/A.

## 9. Required Improvements
1. Crear la estructura arriba y poblar el árbol.

## 10. Implementation Plan
1) Árbol en este PART.
2) Aplicar al scaffold.

## 11. Automated Test Plan
- Test: el scaffold existe y el PART de ejemplo tiene las 15 secciones + footer.

## 12. Manual Validation Checklist
- [ ] Un agente puede clonar el scaffold y entender el patrón.
- [ ] El PART01_demo sirve de referencia.

## 13. Technical Documentation to produce
- `modules/_template/epics/00-demo/README.md`.
- `modules/_template/epics/00-demo/parts/PART01_demo.md`.

## 14. User Documentation to produce
EPIC 06.

## 15. Acceptance Criteria
- Estructura completa.
- PART01_demo con 15 secciones + footer.
