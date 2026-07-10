# PART02 — ObjectDataSource (objetos en memoria)

## 1. Purpose
La fuente de objetos en memoria: `ObjectDataSource` (POCOs, records, colecciones
`IEnumerable`, grafos de entidades materializados) con `RootData`/`DataMember`, y su
proveedor de metadatos `ObjectMetadataProvider` (reflexión: escalares→columnas, Id→PK,
XId→FK) para el query builder.

## 2. Current State
Funcional (Fase 3 el binding; Fase 28 el metadata provider y `DataProviderKind.Object`).
Es la fuente de primera clase del binding por objetos; el Demo registra «Ventas»
(POCOs SaleRecord) y el wizard descubre su esquema por reflexión.

## 3. Comparison against DevExpress
DevExpress ObjectDataSource: bind a un tipo con constructor/método que devuelve datos,
con parámetros de constructor. AegiReports: bind directo a una instancia/colección;
auditar la resolución de `DataMember` a una propiedad-colección, grafos anidados y el
soporte de métodos-fábrica (evaluar).

## 4. Missing Features
- `DataMember` a rutas más profundas (colección anidada dentro del modelo raíz).
- Soporte de fábrica (tipo + método) además de instancia directa (evaluar 1.0).
- FKs por convención multi-columna en `ObjectMetadataProvider` (hoy `XId`→`Id`).

## 5. UX Problems
- En el wizard, la «colección registrada» se resuelve por nombre en el host; el mensaje
  de error lista las disponibles (Fase 28) — auditar claridad.

## 6. Backend Problems
- Colección vacía tipada: el metadata provider infiere del genérico `IEnumerable<T>`
  (Fase 28); confirmar cobertura de tipos anidados y nullables.
- `ToRecord`: DataRecord/diccionario pasan directo; POCO se proyecta por reflexión —
  confirmar orden de columnas por declaración estable.

## 7. Frontend Problems
N/A (se refleja en el wizard, DataSources PART07).

## 8. Technical Debt
- Espejo con `EfMetadataProvider` (convención FK) — mantener ambas convenciones
  alineadas y documentadas.

## 9. Required Improvements
1. `DataMember` anidado + evaluar fábrica (tipo+método).
2. FKs por convención más ricas (multi-columna si viable) documentadas.
3. Cobertura de tipos anidados/nullables en la inferencia de esquema.

## 10. Implementation Plan
1) Modelo: `DataMember` anidado; inferencia de tipos anidados; (opcional) fábrica.
2) Tests con POCOs/records/colecciones/grafos.
3) Recorrido manual vía el wizard (proveedor Object) y un reporte con objetos.

## 11. Automated Test Plan
- Esquema de POCOs/records (columnas/PK/FK por convención); DataMember anidado;
  colección vacía tipada infiere; grafo materializado; orden de columnas estable.

## 12. Manual Validation Checklist
- [ ] Wizard proveedor Object: colección «Ventas» → esquema descubierto (Fase 28 base)
- [ ] Colección anidada vía DataMember alimenta el reporte
- [ ] Records y POCOs producen las mismas columnas que sus propiedades
- [ ] Colección vacía tipada muestra columnas (no vacío)
- [ ] Reporte con objetos idéntico a su equivalente con DataRecord
- [ ] Mensaje de colección no registrada lista las disponibles

## 13. Technical Documentation to produce
`DataSources/Architecture.md` (ObjectDataSource + ObjectMetadataProvider),
`DataSources/Examples.md` (bind a POCOs/records).

## 14. User Documentation to produce
«Reportar sobre objetos en memoria» (POCOs, records, colecciones).

## 15. Acceptance Criteria
- DataMember anidado y convención FK documentados; inferencia de tipos robusta; paridad
  con DataRecord; checklist §12 con capturas; suite verde.
