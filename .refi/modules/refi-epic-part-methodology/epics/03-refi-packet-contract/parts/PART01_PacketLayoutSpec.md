# PART01 — Packet Layout Spec

## 1. Purpose
Especificar formalmente la nueva estructura de carpetas de un packet REFI.

## 2. Current State
`refi/README.md` v1 lista 6 archivos como mínimo: `request.md`, `master-blueprint.md`,
`domain-shards/01-*.md`, `orchestration-map.md`, `progress.md`, `verification.md`.

## 3. Comparison against baseline
EpicPlanification usa carpeta por Epic con `README.md` + `PARTnn*.md` planos.
REFI v2 usa esa misma forma pero la jerarquiza: `epics/<NN-slug>/README.md` + `parts/`.

## 4. Missing / Required Scope
Estructura canónica de un packet nuevo:

```text
.refi/modules/<slug>/
├── request.md
├── master-blueprint.md
├── epics/
│   ├── matrix.md
│   └── <NN-epic-slug>/
│       ├── README.md
│       └── parts/
│           ├── PART01_<slug>.md
│           ├── PART02_<slug>.md
│           └── ...
├── domain-shards/                 # opcional, sólo cross-cutting
│   └── 00-<cross>.md
├── orchestration-map.md
├── progress.md
└── verification.md
```

Reglas:

- `<NN>` es 2 dígitos, en el orden de planificación (`01`, `02`, ...).
- `<slug>` es kebab-case, max 40 chars.
- `epics/matrix.md` es OBLIGATORIO en cualquier packet nuevo.
- `epics/<epic>/README.md` es OBLIGATORIO por cada EPIC listado en la matriz.
- `domain-shards/` es OPCIONAL; si existe, cada shard debe explicar por qué no cabe en
  un EPIC.

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
Si la estructura es laxa, agentes distintos generan packets no interoperables.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
Los 4 paquetes existentes NO siguen la nueva estructura; EPIC 07 los migra opcionalmente.

## 9. Required Improvements
1. Declarar la estructura arriba en `refi/README.md`.
2. Proveer un árbol similar en `modules/_template/` vía EPIC 04.

## 10. Implementation Plan
1) Árbol canónico en este PART.
2) EPIC 03, PART02 lo promueve a `refi/README.md`.

## 11. Automated Test Plan
- Linter: si el packet declara N EPICs en `epics/matrix.md`, deben existir N
  `epics/<epic>/README.md` y al menos 1 `epics/<epic>/parts/PART*.md`.

## 12. Manual Validation Checklist
- [ ] El árbol está en `refi/README.md`.
- [ ] Existe `modules/_template/epics/` con al menos un placeholder.

## 13. Technical Documentation to produce
- Bloque en `refi/README.md`.

## 14. User Documentation to produce
EPIC 06.

## 15. Acceptance Criteria
- Bloque árbol presente.
- Reglas de nombrado declaradas.
