# PART11 — TechnicalDocumentation (documentación técnica de fuentes de datos)

## 1. Purpose
Generar TODA la documentación técnica declarada por PART01–PART10 del Epic DataSources,
consolidada y coherente, en Markdown, para el desarrollador que integra fuentes o
implementa proveedores propios.

## 2. Current State
No existe documentación técnica dedicada; hay ADR-0024 y docs XML de API. Los PARTs
especificaron qué producir; este PART lo GENERA al final del Epic.

## 3. Comparison against DevExpress
DevExpress documenta cada data source por API y escenarios. Meta equivalente para
integradores y autores de proveedores.

## 4. Missing Features
Documentos declarados por los PARTs, aún inexistentes:
- `Architecture.md` (DataRecord/IRecordSource/binding, ObjectDataSource, JSON, SQL Server,
  EF Core, SchemaDiscovery, wizard, parámetros vivos)
- `API.md` (implementar un IRecordSource / ISqlCommandExecutor / IDatabaseMetadataProvider
  propio) — coordina con Epic SDK/QueryBuilder
- `Integration.md` (cablear proveedores en un host, delegados del wizard)
- `Security.md` (parametrización, masking de credenciales) — coordina Epic Security
- `Performance.md` (streaming, memoria, presupuestos) — coordina Epic Performance
- `Limitations.md` (EF una entidad, paridad/casing intérprete↔SQL)
- `Troubleshooting.md` (catálogo de errores por proveedor)
- `Examples.md` (bind a POCOs/JSON/SQL/DbContext)

## 5. UX Problems
N/A.

## 6. Backend Problems
- Reflejar el CÓDIGO REAL tras cerrar PART01–10.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
- Ejemplos deben compilar (verificados en el Epic Documentation).

## 9. Required Improvements
Redactar los documentos con diagramas, referencias a tipos reales y ejemplos verificables.

## 10. Implementation Plan
1) Tras cerrar PART01–10, redactar cada documento desde el código final.
2) Enlazar entre sí y desde el README; coordinar Security/Performance/SDK con sus Epics.

## 11. Automated Test Plan
- Verificación de enlaces; snippets compilables delegados al Epic Documentation.

## 12. Manual Validation Checklist
- [ ] Cada documento existe y cubre lo declarado por su PART origen
- [ ] Referencias a tipos coinciden con el código actual
- [ ] Un integrador implementa un IRecordSource propio siguiendo API.md
- [ ] Diagramas legibles; enlaces internos funcionan

## 13. Technical Documentation to produce
(este PART ES la producción) — los documentos de §4.

## 14. User Documentation to produce
N/A (es PART12).

## 15. Acceptance Criteria
- Documentos completos, coherentes con el código final, enlazados; ejemplos verificables;
  revisión editorial pasada.
