# PART03 — Worked Example · Epic A · "Setup CLI"

## 1. Purpose
Demostrar un paquete REFI v2 con un primer Epic de demo.

## 2. Current State
No existe paquete worked-example.

## 3. Comparison against baseline
EpicPlanification demuestra un producto entero; aquí basta con 1 Epic claro.

## 4. Missing / Required Scope
Crear `.refi/modules/example-todo-cli/` con:

```text
.refi/modules/example-todo-cli/
├── request.md                         # "Necesito un CLI de TODOs para recordar el flow REFI v2."
├── master-blueprint.md                # EPIC breakdown con 2 EPICs.
├── epics/
│   ├── matrix.md                      # 2 filas.
│   ├── 01-setup-cli/
│   │   ├── README.md                  # Backlog.
│   │   └── parts/
│   │       ├── PART01_CLISkeleton.md
│   │       ├── PART02_CommandsAddListComplete.md
│   │       └── PART03_PersistenceJSON.md
│   └── 02-help-and-docs/
│       ├── README.md
│       └── parts/
│           ├── PART01_HelpTexts.md
│           ├── PART02_ReadmeGen.md
│           └── PART03_ManualSmoke.md
├── orchestration-map.md
├── progress.md
└── verification.md
```

El PART01 de Epic A (`CLI Skeleton`) debe usar TODAS las 15 secciones + footer de gates,
y su §3 (Comparison) debe anclar contra `package.json` actual del repo (archivo real,
línea real).

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
Si el worked-example no usa código real, no demuestra anti-alucinación.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
N/A.

## 9. Required Improvements
1. Construir el árbol.
2. Rellenar al menos 1 PART a fondo (15 sec + footer).

## 10. Implementation Plan
1) Árbol arriba.
2) Aplicar.

## 11. Automated Test Plan
- Linter: la estructura está completa.
- Test semántico: `PART01_CLISkeleton.md` §3 cita `package.json` con ruta y/o línea real.

## 12. Manual Validation Checklist
- [ ] Todos los archivos existen.
- [ ] El PART01_CLISkeleton.md usa 15 secciones + footer.

## 13. Technical Documentation to produce
- README del worked-example (interno).

## 14. User Documentation to produce
EPIC 06 cubre este PART.

## 15. Acceptance Criteria
- Estructura completa.
- Al menos 1 PART en 15-sec + footer firmado.
