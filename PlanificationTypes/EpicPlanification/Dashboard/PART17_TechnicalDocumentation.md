# PART17 — TechnicalDocumentation (documentación técnica del dashboard)

## 1. Purpose
Generar TODA la documentación técnica declarada por PART01–PART16 del Epic Dashboard,
consolidada y coherente, en Markdown, para el desarrollador que integra o extiende el
dashboard.

## 2. Current State
No existe documentación técnica dedicada; hay ADR-0028 y docs XML de API. Los PARTs
especificaron qué producir; este PART lo GENERA al final del Epic.

## 3. Comparison against DevExpress
DevExpress documenta el dashboard por API y escenarios. Meta equivalente para
integradores y autores de widgets.

## 4. Missing Features
Documentos declarados por los PARTs, aún inexistentes:
- `Architecture.md` (decisión angular: dashboard→ReportDocument; shell, canvas/layout,
  fuentes/data engine/shaper, widgets, contenedores, parámetros/filtros, estado inmutable
  y motor de interacción, mapa de hit-áreas, temas, preview, serialización, validador)
- `API.md` (IDashboardWidgetFactory, registry, widget de tercero)
- `Integration.md` (DashboardHostServices: QueryDesigner, ReportResolver, OpenReport,
  publicación)
- `Performance.md` (composición, snapshot, hit-test, preview)
- `Limitations.md` (highlight por punto, Map, formas sin elipse, publicación asíncrona)
- `Migration.md` (`.aedashboard` versiones)
- `Troubleshooting.md` (AEGIDB001–010, plugin de widget faltante)

## 5. UX Problems
N/A.

## 6. Backend Problems
- Reflejar el CÓDIGO REAL tras cerrar PART01–16.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
- Ejemplos deben compilar (verificados en el Epic Documentation).

## 9. Required Improvements
Redactar los documentos con diagramas, referencias a tipos reales y ejemplos verificables.

## 10. Implementation Plan
1) Tras cerrar PART01–16, redactar cada documento desde el código final.
2) Enlazar entre sí y desde el README del Epic; coordinar API con Epic SDK.

## 11. Automated Test Plan
- Verificación de enlaces; snippets compilables delegados al Epic Documentation.

## 12. Manual Validation Checklist
- [ ] Cada documento existe y cubre lo declarado por su PART origen
- [ ] Referencias a tipos coinciden con el código actual
- [ ] Un host integra el dashboard siguiendo Integration.md
- [ ] Un tercero crea un widget siguiendo API.md
- [ ] Diagramas legibles; enlaces internos funcionan

## 13. Technical Documentation to produce
(este PART ES la producción) — los documentos de §4.

## 14. User Documentation to produce
N/A (es PART18).

## 15. Acceptance Criteria
- Documentos completos, coherentes con el código final, enlazados; ejemplos verificables;
  revisión editorial pasada.
