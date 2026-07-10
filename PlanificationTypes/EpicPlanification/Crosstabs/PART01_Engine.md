# PART01 — Engine (motor de pivoteo)

## 1. Purpose
Auditar y cerrar el `CrosstabEngine`: pivoteo en UNA sola pasada con acumuladores por celda,
agregados (Sum/Count/Average/Min/Max), claves de fila/columna resueltas por el binding
compilado, y el modelo `CrosstabDefinition`/`CrosstabResult`. Es el corazón determinista del
Epic.

## 2. Current State
Implementado y limpio: `CrosstabEngine.Build` agrega en una pasada
(`Dictionary<(row,column), Accumulator>`), claves en `SortedSet<string>(Ordinal)`, celdas
`decimal?[,]` con `null` = sin datos (distinto de cero), aritmética decimal exacta.
`CrosstabDefinition` = **un** RowPath, **una** ColumnPath, **un** ValuePath, **un**
Aggregate. **Hueco central:** no existe `CrosstabControl : ReportControl` — en un reporte el
crosstab se **hornea** a `TableControl` estático en tiempo de autoría (`CrosstabTableBuilder`)
y **no se re-pivotea** al ejecutar contra datos/parámetros nuevos. Solo el **dashboard** lo
ejecuta en vivo (`CrosstabWidgetFactory` corre el engine al materializar).

## 3. Comparison against DevExpress
El Cross Tab de DevExpress permite **múltiples campos por eje** (encabezados anidados),
**múltiples medidas**, y es **vivo** (re-pivotea al correr el reporte). AegiReports: un campo
por eje, una medida, y en reporte es **horneado, no vivo** — tres brechas de modelo.

## 4. Missing Features
- **CrosstabControl vivo en reportes**: control que corre el engine durante la expansión
  (re-pivotea con los datos/parámetros del reporte), o acotar formalmente a «snapshot».
- **Múltiples campos por eje** (filas/columnas anidadas) y **múltiples medidas**.
- Elección de si celdas `null` se muestran vacías o como cero (hoy vacío fijo).

## 5. UX Problems
N/A directo (motor); se manifiesta en que un crosstab de reporte no refleja datos nuevos.

## 6. Backend Problems
- Un `CrosstabControl` vivo implica un handler de expansión (como Table) que ejecute el
  engine con el `IRecordSource` del reporte — coordinar con el pipeline (PART03).
- Multi-campo/multi-medida cambia `CrosstabDefinition` y `CrosstabResult` (claves compuestas
  y matriz por medida).

## 7. Frontend Problems
N/A (motor puro).

## 8. Technical Debt
- **Crosstab de reporte horneado, no vivo** + **una dimensión/medida por eje**: decisiones
  1.0 — implementar CrosstabControl vivo y/o multi-campo, o acotarlas en `Limitations.md`.

## 9. Required Improvements
1. Decidir e implementar (o acotar) el crosstab vivo en reportes.
2. Decidir e implementar (o acotar) múltiples campos por eje y múltiples medidas.
3. Docs XML completas del engine y sus tipos.

## 10. Implementation Plan
1) Auditar reporte (horneado) vs dashboard (vivo); fijar decisiones de vivo/multi-campo.
2) Si vivo: `CrosstabControl` + handler de expansión reutilizando el engine.
3) Si multi-campo/medida: extender definición/resultado con tests deterministas.

## 11. Automated Test Plan
- Pivoteo una-pasada correcto por agregado (Sum/Count/Average/Min/Max).
- Claves ordenadas de forma determinista; celdas `null` distintas de cero.
- (Si vivo) el CrosstabControl re-pivotea al cambiar datos/parámetros.

## 12. Manual Validation Checklist
- [ ] Crosstab hotelero (tipo × canal, ingreso) correcto en el visor
- [ ] Cada agregado produce valores correctos
- [ ] (Si vivo) cambiar un parámetro re-pivotea el crosstab del reporte
- [ ] Celdas sin datos vacías (o cero, según la opción elegida)

## 13. Technical Documentation to produce
`Crosstabs/Architecture.md` (engine, vivo vs horneado, multi-campo) — PART09.

## 14. User Documentation to produce
Base del tema «Tablas cruzadas: filas, columnas y valores» — PART10.

## 15. Acceptance Criteria
- Engine auditado; crosstab vivo y multi-campo/medida implementados o acotados por escrito;
  docs XML; §12 con capturas; suite verde.
