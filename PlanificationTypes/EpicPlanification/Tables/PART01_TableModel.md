# PART01 — TableModel (modelo lógico de tabla)

## 1. Purpose
Auditar y cerrar el modelo lógico de la tabla: `TableControl` (columnas + filas +
`RepeatHeaderOnContinuation`), `TableColumn` (Fixed/Auto/Star, ancho/peso), `TableRow`
(papel Header/Body/Footer, alto) y `TableCell` (texto con expresiones, `WordWrap`,
`ColumnSpan`, estilo por nombre + override, herencia tipográfica de la tabla). Es el
cimiento renderer-independiente del que dependen layout, agrupación, persistencia y
exportación.

## 2. Current State
Implementado y sólido: `TableControl : ReportControl` con `Columns`/`Rows` y encabezado
repetido por defecto. `TableColumn` con `TableColumnSizing.{Fixed,Auto,Star}`. `TableCell`
con `Text`, `WordWrap`, `StyleName`, `Style` (override) y `ColumnSpan`. La celda hereda el
estilo de la tabla y aplica sus overrides (`tableStyle.Merge(cell)`), resuelto en
`TableLayoutHandler.ResolveCellStyle`. Modelo puro net9.0, jamás un control visual.

## 3. Comparison against DevExpress
DevExpress `XRTable` = filas/celdas con `ColumnSpan` **y `RowSpan`**, estilos por celda,
anclaje. AegiReports tiene paridad en columnas (Fixed/Auto/Star supera al ancho fijo puro)
y `ColumnSpan`, pero **carece de `RowSpan`** (merge vertical de celdas).

## 4. Missing Features
- **`RowSpan` en `TableCell`** — merge vertical de celdas (gap real vs DevExpress).
- `TableRow` no expone estilo de fila propio (solo celdas); el estilo alternado se decide
  en PART07.
- Sin validación de invariantes del modelo (celdas por fila ≠ columnas cuando hay spans).

## 5. UX Problems
N/A directo (modelo); su carencia se manifiesta en PART05 (no se puede fusionar vertical
en el designer).

## 6. Backend Problems
- Añadir `RowSpan` obliga a tocar layout (medición/offsets), persistencia y exportadores
  de forma coordinada — decisión de alcance 1.0 (implementar vs declarar límite).
- Sin verificación de que `∑ColumnSpan` de una fila coincide con el número de columnas.

## 7. Frontend Problems
N/A (modelo puro).

## 8. Technical Debt
- **`RowSpan` ausente**: decisión transversal (toca PART02/05/08/09). Si se acota a 1.0,
  documentarlo como límite explícito en `Limitations.md`.

## 9. Required Improvements
1. Decidir e implementar (o acotar formalmente) `RowSpan`.
2. Validador ligero de coherencia fila↔columnas (diagnóstico, no excepción).
3. Docs XML completas de cada tipo del modelo.

## 10. Implementation Plan
1) Auditar el modelo contra los cuatro consumidores (layout, agrupación, serializador,
   exportadores) y fijar la decisión de `RowSpan`.
2) Si se implementa: `RowSpan` en `TableCell` + propagación coordinada; si no, `Limitations`.
3) Validador de coherencia con diagnóstico `AEGI-TBL-*`.

## 11. Automated Test Plan
- Construcción por código de tablas con Fixed/Auto/Star, `ColumnSpan`, herencia de estilo.
- (Si aplica) `RowSpan`: medición/offsets correctos y round-trip.
- Coherencia fila↔columnas emite diagnóstico esperado.

## 12. Manual Validation Checklist
- [ ] Tabla con las tres estrategias de columna se ve correcta en el visor
- [ ] `ColumnSpan` fusiona horizontalmente y respeta el ancho combinado
- [ ] Herencia de estilo de tabla → celda visible (tipografía heredada + override)
- [ ] (Si `RowSpan`) merge vertical correcto en visor, PDF y reapertura

## 13. Technical Documentation to produce
`Tables/Architecture.md` (modelo lógico y decisión de `RowSpan`) — consolidado en PART11.

## 14. User Documentation to produce
Base del tema «Tablas: columnas, filas y celdas» — consolidado en PART12.

## 15. Acceptance Criteria
- Modelo auditado; `RowSpan` implementado o acotado por escrito; validador con
  diagnóstico; docs XML completas; recorrido §12 con capturas; suite verde.
