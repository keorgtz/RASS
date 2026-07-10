# PART05 — EfCoreProvider (Entity Framework Core)

## 1. Purpose
La fuente Entity Framework: `EfCoreDataSource` sobre `IQueryable<T>` (async EF +
síncrono LINQ-objetos) y `EfMetadataProvider` (convención Id→PK, XId→FK) para el query
builder en modo EF.

## 2. Current State
Funcional (Fase 22/25). `EfCoreDataSource` materializa `IQueryable`; `EfMetadataProvider`
deriva el catálogo por reflexión de entidades. **Límite declarado:** el Demo NO incluye
un DbContext (usa SQL/JSON/Object); `LinqPipelineBuilder` soporta UNA entidad.

## 3. Comparison against DevExpress
DevExpress EF Data Source: bind a un DbContext y seleccionar entidad/consulta, con
parámetros. AegiReports: bind a `IQueryable`; auditar el modo multi-entidad (joins entre
IQueryable), la muestra con un DbContext real y los parámetros/filtros aplicados en la
base (no en memoria).

## 4. Missing Features
- **Muestra con un DbContext real** (hoy el Demo no lo incluye) — hace la feature
  «tocable» para el usuario.
- Modo EF **multi-entidad** (joins entre `IQueryable`) — DECISIÓN DE ALCANCE 1.0 (liga
  QueryBuilder PART10; hoy una entidad).
- Filtros/parámetros traducidos a la consulta EF (server-side) vs materializar y filtrar
  en memoria — política clara.

## 5. UX Problems
- El wizard EF pide «consulta con nombre» resuelta por el host; auditar claridad y una
  muestra que lo demuestre.

## 6. Backend Problems
- Materialización async vs síncrona (LINQ-objetos) coherente; cancelación del query EF.
- La convención FK (`XId`→entidad) puede no cubrir relaciones reales — documentar.

## 7. Frontend Problems
N/A (se refleja en el wizard/query builder).

## 8. Technical Debt
- El límite «una entidad» de `LinqPipelineBuilder` es la deuda visible; resolver o
  reafirmar documentado (coordinado con QueryBuilder PART10).

## 9. Required Improvements
1. Muestra con DbContext real (in-memory provider de EF o SQLite) en Samples.
2. Decisión multi-entidad; política server-side vs in-memory de filtros.
3. Cancelación y async robustos; convención FK documentada.

## 10. Implementation Plan
1) Samples: DbContext de ejemplo (EF InMemory/SQLite) con entidades hoteleras.
2) Decisión multi-entidad (con QueryBuilder PART10) + política de traducción.
3) Recorrido manual con la muestra EF end-to-end.

## 11. Automated Test Plan
- `EfCoreDataSource` sobre `IQueryable` en memoria: materialización async/sync,
  cancelación; `EfMetadataProvider` PK/FK por convención; (si aplica) multi-entidad.

## 12. Manual Validation Checklist
- [ ] Muestra EF: bind a un DbContext → reporte con entidades reales
- [ ] Query builder en modo EF descubre el esquema por reflexión
- [ ] Parámetros/filtros aplicados (server-side o documentado in-memory)
- [ ] Cancelar una consulta EF
- [ ] Multi-entidad (si en alcance) o límite «una entidad» visible en UI
- [ ] Convención FK documentada y coherente con el catálogo

## 13. Technical Documentation to produce
`DataSources/Architecture.md` (EF Core), `DataSources/Limitations.md` (una entidad si
queda), `DataSources/Examples.md` (bind a DbContext).

## 14. User Documentation to produce
«Conectar a Entity Framework Core» (DbContext, entidades, límites).

## 15. Acceptance Criteria
- Muestra EF real operativa; decisión multi-entidad cerrada; async/cancelación robustos;
  convención documentada; checklist §12 con capturas; suite verde.
