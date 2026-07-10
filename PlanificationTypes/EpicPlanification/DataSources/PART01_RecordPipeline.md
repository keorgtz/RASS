# PART01 — RecordPipeline (DataRecord, esquema y binding)

## 1. Purpose
El núcleo del acceso a datos: `DataRecord` (fila respaldada por diccionario, orden
determinista), `DataShapeSchema` (descubre esquema desde la forma), `RecordDataSource`
(el `IRecordSource` común), `RecordMaterializer` (enumera la colección una vez) y la
ruta rápida en `BindingPathResolver` que permite que filas SIN tipo CLR (SQL/JSON/
proyecciones EF/objetos) fluyan por TODO el pipeline sin tocar el motor.

## 2. Current State
Funcional y maduro (Fase 22). Es la pieza angular que desacopló los proveedores del
motor: `DataRecord : IReadOnlyDictionary<string, object?>` con columnas en orden;
materialización única; binding con ruta rápida para diccionarios.

## 3. Comparison against DevExpress
DevExpress abstrae la fuente con `IDataSource`/DataView y binding por ruta. AegiReports
usa `IRecordSource` + `DataRecord` (más simple y determinista). Auditar el binding de
rutas anidadas, colecciones dentro de registros (detalle-maestro) y tipos nulos.

## 4. Missing Features
- Binding de rutas anidadas profundas dentro de un `DataRecord` (objeto dentro de fila).
- Detalle anidado (una columna que es a su vez una colección) para subreportes/detalle.
- Coerción/normalización de tipos consistente (fechas, decimales, DBNull→null).

## 5. UX Problems
N/A (capa de datos); impacta el explorador de campos (Designer PART05).

## 6. Backend Problems
- `DataRecord` con columnas duplicadas: el último valor gana preservando orden
  (verificado); confirmar que DBNull se normaliza a null en TODOS los proveedores.
- `BindingPathResolver`: la ruta rápida no debe divergir del binding por reflexión.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
- Documentar el contrato de `IRecordSource` (RootData/DataMember) como base del SDK de
  fuentes.

## 9. Required Improvements
1. Rutas anidadas + detalle anidado (colección dentro de fila) verificados.
2. Normalización de tipos uniforme (DBNull/decimales/fechas) entre proveedores.
3. Equivalencia binding rápido ↔ reflexión (test de no-divergencia).

## 10. Implementation Plan
1) Modelo: rutas anidadas y detalle en `BindingPathResolver`/`RecordMaterializer` + tests.
2) Normalización de tipos en el punto de entrada de cada proveedor.
3) Recorrido conceptual + tests (no hay UI propia; se valida vía pipeline).

## 11. Automated Test Plan
- `DataRecord`: orden, duplicados, DBNull→null; `DataShapeSchema` desde formas variadas;
  binding rápido == reflexión para el mismo grafo; detalle anidado expande correcto.

## 12. Manual Validation Checklist
(vía Demo/pipeline, no hay UI propia)
- [ ] Un reporte con `[Campo]` y `[Obj.Sub]` enlaza rutas simples y anidadas
- [ ] Detalle anidado (colección en fila) alimenta una tabla/subreporte
- [ ] Valores nulos (DBNull) se muestran como vacío, no como texto «DBNull»
- [ ] Fechas/decimales con formato es-MX correcto
- [ ] Mismo resultado con fuente tipada (objetos) y sin tipo (DataRecord)

## 13. Technical Documentation to produce
`DataSources/Architecture.md` (DataRecord/IRecordSource/binding), `DataSources/API.md`
(IRecordSource propio).

## 14. User Documentation to produce
Base conceptual para «Conectar datos» (qué es una fuente de registros) — se integra en
los PARTs de proveedores.

## 15. Acceptance Criteria
- Rutas anidadas + detalle + normalización de tipos uniformes; binding rápido sin
  divergencia; checklist §12 verificada; build 0/0; suite verde.
