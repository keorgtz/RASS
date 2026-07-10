# PART11 — MetadataProviders (descubrimiento de catálogo)

## 1. Purpose
El descubrimiento de esquema que alimenta el builder: `SqlServerMetadataProvider`
(4 consultas const `INFORMATION_SCHEMA` vía `ISqlCommandExecutor`), `EfMetadataProvider`
(convención Id→PK, XId→FK) y `ObjectMetadataProvider` (reflexión de POCOs, Fase 28),
todos produciendo `DatabaseSchema` bajo `IDatabaseMetadataProvider`.

## 2. Current State
Funcional (Fases 25/28). `HotelDatabase.SeedMetadata` registra las MISMAS consultas del
proveedor SQL en el sembrado (un solo código de descubrimiento). Los tres proveedores
implementan el mismo contrato.

## 3. Comparison against DevExpress
DevExpress descubre esquema de múltiples orígenes (SQL, EF, objetos, XML). AegiReports
cubre SQL Server, EF y objetos; auditar robustez con esquemas grandes, tipos poco
comunes y permisos limitados; evaluar otros orígenes (Oracle/PostgreSQL) como post-1.0.

## 4. Missing Features
- Mapeo completo de tipos SQL → CLR (auditar tipos menos comunes: `datetime2`,
  `uniqueidentifier`, `decimal(p,s)`, `varbinary`).
- Descubrimiento de claves compuestas y FKs multi-columna.
- Manejo de esquemas con muchos objetos (paginación/filtrado del descubrimiento).
- Vistas y procedimientos (¿parametrizables?) — alcance a definir.

## 5. UX Problems
- Descubrimiento lento (SQL real) con progreso y cancelación (impacta PART02/PART01).
- Permisos insuficientes → mensaje claro de qué falta.

## 6. Backend Problems
- Consultas `INFORMATION_SCHEMA` deben ser robustas ante nombres con caracteres
  especiales, esquemas múltiples (dbo/otros) y colaciones.
- `EfMetadataProvider`/`ObjectMetadataProvider`: FKs por convención pueden no cubrir
  relaciones reales (documentar la convención y sus límites).

## 7. Frontend Problems
N/A (capa de metadatos); se refleja en el explorer (PART02).

## 8. Technical Debt
- Un solo código de descubrimiento SQL (seed = real) — mantener esa disciplina.

## 9. Required Improvements
1. Mapeo de tipos completo + claves/FKs compuestas.
2. Robustez con esquemas grandes y permisos limitados (mensajes claros).
3. Documentar convención de FK de EF/Object y sus límites.

## 10. Implementation Plan
1) SqlServer: revisar las 4 consultas para tipos/compuestas/esquemas; tests con seed.
2) EF/Object: FKs compuestas si es viable; documentar convención.
3) Manejo de errores de permisos/conexión; cancelación.
4) Recorrido manual con base real (si disponible) y con seed.

## 11. Automated Test Plan
- `HotelDatabase` seed: proveedor SQL descubre 8 tablas + 3 vistas con PK/FK correctas;
  mapeo de tipos; EF/Object PK/FK por convención; nombres con caracteres especiales.

## 12. Manual Validation Checklist
- [ ] Descubrir catálogo hotelero (seed) → tablas/vistas/PK/FK correctas
- [ ] Tipos variados mapeados (fecha/decimal/guid/binario)
- [ ] Descubrir contra SQL real (si disponible) con progreso/cancelación
- [ ] Permisos insuficientes → mensaje claro
- [ ] EF y Object: convención de FK documentada y visible
- [ ] Esquema grande no cuelga la UI

## 13. Technical Documentation to produce
`QueryBuilder/Architecture.md` (proveedores de metadatos), `QueryBuilder/Integration.md`
(implementar un IDatabaseMetadataProvider propio).

## 14. User Documentation to produce
«Conectar a una base de datos» (SQL Server, EF, objetos; convenciones).

## 15. Acceptance Criteria
- Descubrimiento robusto con tipos/compuestas/permisos; un solo código SQL seed=real;
  convenciones documentadas; checklist §12 con capturas; suite verde.
