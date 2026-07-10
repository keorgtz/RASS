# PART15 — TechnicalDocumentation (documentación técnica del visor)

## 1. Purpose
Generar TODA la documentación técnica declarada por PART01–PART14 del Epic Previewer,
consolidada y coherente, en Markdown, para el desarrollador que integra o extiende el
visor.

## 2. Current State
No existe documentación técnica dedicada del visor; hay ADR-0026 y docs XML de API. Los
PARTs previos ESPECIFICARON qué producir; este PART lo GENERA (al final del Epic).

## 3. Comparison against DevExpress
DevExpress documenta el viewer por API y escenarios. Este PART lleva el visor a ese
estándar para integradores.

## 4. Missing Features
Documentos declarados por los PARTs, aún inexistentes:
- `Architecture.md` (shell, command bar, layout+cache, zoom/inercia, miniaturas,
  navegación, búsqueda, parámetros, selección, inspector, modos inmersivos)
- `Integration.md` (ViewerContext: parámetros, RefreshAsync, export, print para hosts)
- `Performance.md` (virtualización, LRU, render diferido de miniaturas, búsqueda)
- `Limitations.md` (granularidad de selección, escalado de impresión, MiniMap/Prefetch,
  rotate/attachments/touch de ADR-0026)
- `Troubleshooting.md` (diagnóstico con el inspector, errores de impresión/export)

## 5. UX Problems
N/A.

## 6. Backend Problems
- Reflejar el CÓDIGO REAL tras cerrar PART01–14 (se genera al final del Epic).

## 7. Frontend Problems
N/A.

## 8. Technical Debt
- Ejemplos deben compilar (verificados en el Epic Documentation).

## 9. Required Improvements
Redactar los 5 documentos con diagramas, referencias a tipos reales y ejemplos
verificables.

## 10. Implementation Plan
1) Tras cerrar PART01–14, redactar cada documento desde el código final.
2) Enlazar entre sí y desde el README del Epic.

## 11. Automated Test Plan
- Verificación de enlaces; snippets compilables delegados al Epic Documentation.

## 12. Manual Validation Checklist
- [ ] Cada documento existe y cubre lo declarado por su PART origen
- [ ] Referencias a tipos coinciden con el código actual
- [ ] Un host puede integrar el visor siguiendo Integration.md
- [ ] Diagramas legibles; enlaces internos funcionan

## 13. Technical Documentation to produce
(este PART ES la producción) — los 5 documentos de §4.

## 14. User Documentation to produce
N/A (es PART16).

## 15. Acceptance Criteria
- Los 5 documentos completos, coherentes con el código final, enlazados; ejemplos
  verificables; revisión editorial pasada.
