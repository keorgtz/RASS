# PART21 — TechnicalDocumentation (documentación técnica del designer)

## 1. Purpose
Generar TODA la documentación técnica declarada por PART01–PART20 del Epic Designer,
consolidada y coherente, en Markdown, dentro de `docs/ProductCompletion/Designer/tech/`
(o la ubicación que el Epic Documentation fije).

## 2. Current State
No existe documentación técnica dedicada del designer; hay ADRs (0013/0023/0025/0030)
y docs XML de API. Los PARTs previos ESPECIFICARON qué producir; este PART lo GENERA.

## 3. Comparison against DevExpress
DevExpress ofrece documentación técnica exhaustiva por componente. Este PART lleva el
designer a ese estándar para el desarrollador que integra o extiende.

## 4. Missing Features
Los documentos declarados por los PARTs, aún inexistentes:
- `Architecture.md` (shell, docking, superficie, comandos, preview, theming)
- `API.md` (extensiones: toolbox, property editors, wizards, comandos)
- `Integration.md` (contrato de hosting: eventos Save/Open/Export/Print,
  StudioAuthoringContext)
- `Performance.md` (presupuestos e incremental)
- `Limitations.md` (límites 1.0: reparenting, grupos persistentes, theming)
- `Migration.md` (esquema .aedocx, versiones)
- `Troubleshooting.md` (plugin faltante, layout corrupto)
- `Accessibility.md` (UIA, atajos)

## 5. UX Problems
N/A (documentación).

## 6. Backend Problems
- Cada documento debe reflejar el CÓDIGO REAL tras cerrar PART01–20 (no el estado
  previo); se genera al final del Epic.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
- Riesgo de divergencia doc↔código: los ejemplos deben compilar (verificados en el
  Epic Documentation contra el API real).

## 9. Required Improvements
Redactar los 8 documentos con diagramas ASCII/mermaid, referencias a tipos reales y
ejemplos verificables.

## 10. Implementation Plan
1) Tras cerrar PART01–20, redactar cada documento desde el código final.
2) Enlazar entre sí y desde el README del Epic.
3) Los ejemplos de código se marcan para verificación por el Epic Documentation.

## 11. Automated Test Plan
- Verificación de enlaces (sin rotos); si hay snippets compilables, un test que los
  compile (o se delega al Epic Documentation).

## 12. Manual Validation Checklist
- [ ] Cada documento existe y cubre lo declarado por su PART origen
- [ ] Referencias a tipos coinciden con el código actual
- [ ] Diagramas legibles; enlaces internos funcionan
- [ ] Un desarrollador externo puede extender el toolbox siguiendo API.md
- [ ] Un host puede integrar el estudio siguiendo Integration.md

## 13. Technical Documentation to produce
(este PART ES la producción) — los 8 documentos listados en §4.

## 14. User Documentation to produce
N/A (la de usuario es PART22).

## 15. Acceptance Criteria
- Los 8 documentos completos, coherentes con el código final del Epic, enlazados;
  ejemplos verificables; revisión editorial pasada.
