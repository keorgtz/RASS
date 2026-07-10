# PART09 — TechnicalDocumentation (documentación técnica de parámetros)

## 1. Purpose
Generar TODA la documentación técnica declarada por PART01–PART08 del Epic Parameters,
consolidada y coherente, en Markdown, para el desarrollador que integra o extiende los
parámetros.

## 2. Current State
No existe documentación técnica dedicada; hay docs XML de API. Los PARTs especificaron
qué producir; este PART lo GENERA al final del Epic.

## 3. Comparison against DevExpress
DevExpress documenta parámetros por API y escenarios. Meta equivalente para integradores.

## 4. Missing Features
Documentos declarados por los PARTs, aún inexistentes:
- `Architecture.md` (modelo unificado reporte↔consulta, tipos/validación, lookups/
  cascada, multi-valor/rangos, panel del visor, parámetros del dashboard, cache keys)
- `API.md` (declarar parámetros por código; ReportParameterDefinition/ParameterModel)
- `Integration.md` (ViewerContext.RefreshAsync, DashboardDataEngine, lookups dinámicos)
- `Limitations.md` (alcance de multi-valor/rango si se acota)

## 5. UX Problems
N/A.

## 6. Backend Problems
- Reflejar el CÓDIGO REAL tras cerrar PART01–08.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
- Ejemplos deben compilar (verificados en el Epic Documentation).

## 9. Required Improvements
Redactar los documentos con diagramas, referencias a tipos reales y ejemplos verificables.

## 10. Implementation Plan
1) Tras cerrar PART01–08, redactar cada documento desde el código final.
2) Enlazar entre sí y desde el README; coordinar con Previewer/Dashboard/QueryBuilder/
   Server/Performance.

## 11. Automated Test Plan
- Verificación de enlaces; snippets compilables delegados al Epic Documentation.

## 12. Manual Validation Checklist
- [ ] Cada documento existe y cubre lo declarado por su PART origen
- [ ] Referencias a tipos coinciden con el código actual
- [ ] Un integrador declara parámetros por código siguiendo API.md
- [ ] Diagramas legibles; enlaces internos funcionan

## 13. Technical Documentation to produce
(este PART ES la producción) — los documentos de §4.

## 14. User Documentation to produce
N/A (es PART10).

## 15. Acceptance Criteria
- Documentos completos, coherentes con el código final, enlazados; ejemplos verificables;
  revisión editorial pasada.
