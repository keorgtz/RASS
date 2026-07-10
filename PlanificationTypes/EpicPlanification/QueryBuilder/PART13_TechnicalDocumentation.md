# PART13 — TechnicalDocumentation (documentación técnica del query builder)

## 1. Purpose
Generar TODA la documentación técnica declarada por PART01–PART12 del Epic QueryBuilder,
consolidada y coherente, en Markdown, para el desarrollador que integra o extiende el
diseñador de consultas.

## 2. Current State
No existe documentación técnica dedicada; hay ADR-0027 y docs XML de API. Los PARTs
especificaron qué producir; este PART lo GENERA al final del Epic.

## 3. Comparison against DevExpress
DevExpress documenta el query builder por API y escenarios. Meta equivalente para
integradores y autores de proveedores de metadatos/ejecutores.

## 4. Missing Features
Documentos declarados por los PARTs, aún inexistentes:
- `Architecture.md` (shell, explorer, canvas/joins, columnas, filtros, parámetros,
  orden/grupo, SQL/validador, ejecutores, proveedores de metadatos)
- `API.md` (QueryModel inmutable, extensión)
- `Integration.md` (factory de contexto, IDatabaseMetadataProvider e IQueryExecutor
  propios, persistencia de QueryModel, wizard/dashboard)
- `Security.md` (parametrización, anti-inyección, guard de calculadas) — coordina con
  Epic Security
- `Performance.md` (paginación, virtualización, esquemas grandes)
- `Limitations.md` (divergencias intérprete↔SQL, EF una entidad)
- `Examples.md` (integrar el builder, proveedor de metadatos propio)

## 5. UX Problems
N/A.

## 6. Backend Problems
- Reflejar el CÓDIGO REAL tras cerrar PART01–12.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
- Ejemplos deben compilar (verificados en el Epic Documentation).

## 9. Required Improvements
Redactar los documentos con diagramas, referencias a tipos reales y ejemplos
verificables.

## 10. Implementation Plan
1) Tras cerrar PART01–12, redactar cada documento desde el código final.
2) Enlazar entre sí y desde el README del Epic; coordinar Security con su Epic.

## 11. Automated Test Plan
- Verificación de enlaces; snippets compilables delegados al Epic Documentation.

## 12. Manual Validation Checklist
- [ ] Cada documento existe y cubre lo declarado por su PART origen
- [ ] Referencias a tipos coinciden con el código actual
- [ ] Un integrador implementa un IDatabaseMetadataProvider siguiendo Integration.md
- [ ] Diagramas legibles; enlaces internos funcionan

## 13. Technical Documentation to produce
(este PART ES la producción) — los documentos de §4.

## 14. User Documentation to produce
N/A (es PART14).

## 15. Acceptance Criteria
- Documentos completos, coherentes con el código final, enlazados; ejemplos verificables;
  revisión editorial pasada.
