# PART05 — DesignerEditing (edición de tablas en la superficie de diseño)

## 1. Purpose
Cerrar la edición de tablas en el estudio: edición de celdas in situ, agregar/quitar/mover
columnas y filas, ajustar anchos (Fixed/Auto/Star) y alturas, fusionar celdas (`ColumnSpan`
y —si entra— `RowSpan`), todo con undo/redo y calidad comercial MeridianUI. Es el mayor gap
de UX del Epic frente a DevExpress.

## 2. Current State
`DesignSurfaceControl` reconoce la tabla como `ContextMenuTarget.Table` (menú contextual) y
la doble-clic-edición in situ **solo aplica a `TextControl`** (`HitTest is TextControl`); la
tabla no entra a edición de celda por doble clic. Existe inserción vía asistente (PART06),
pero la manipulación fina (editar celda, redimensionar columna arrastrando, fusionar) en la
superficie es limitada.

## 3. Comparison against DevExpress
DevExpress edita la tabla como una hoja: clic en celda para escribir, arrastrar bordes de
columna, insertar/eliminar filas y columnas desde la banda contextual, fusionar celdas.
AegiReports está por debajo aquí: **edición de celda in situ y redimensionado por arrastre
son el hueco principal**.

## 4. Missing Features
- Doble clic en celda de tabla → edición de texto/expresión in situ.
- Arrastrar el borde de columna para redimensionar (con feedback y snapping).
- Insertar/eliminar columna y fila desde el menú contextual de la tabla.
- Fusionar/dividir celdas (`ColumnSpan`, y `RowSpan` si PART01 lo aprueba).
- Selección de celda/columna/fila con resaltado.

## 5. UX Problems
- Editar una celda hoy es indirecto (property grid / recrear), no natural como una hoja.
- Sin affordances de redimensionado ni de selección granular.

## 6. Backend Problems
- Cada operación debe ser un comando de undo/redo (coordina con Designer PART11_UndoRedo).
- La edición de celda reusa el editor de expresiones (Designer PART13 / Expressions PART07).

## 7. Frontend Problems
- Extender el hit-test de `DesignSurfaceControl` para localizar la celda bajo el cursor y
  arrancar edición; overlays de borde de columna; menú contextual con acciones de tabla.

## 8. Technical Debt
- La edición in situ de celda es trabajo real de UI; decisión 1.0 sobre profundidad
  (edición de texto + redimensionar + insertar/eliminar como mínimo comercial).

## 9. Required Improvements
1. Edición de celda in situ (doble clic) reusando el editor de expresiones.
2. Redimensionado de columna por arrastre + insertar/eliminar fila/columna.
3. Fusión de celdas; selección granular con resaltado; todo con undo/redo.

## 10. Implementation Plan
1) Hit-test de celda en `DesignSurfaceControl`; entrar a edición reusando `TextControl`.
2) Overlays de borde para redimensionar; comandos de insertar/eliminar/fusionar.
3) Integrar undo/redo; recorrido manual de edición completa.

## 11. Automated Test Plan
- Comandos de insertar/eliminar fila/columna, redimensionar y fusionar aplican al modelo y
  son reversibles (undo/redo) — probados en el ViewModel/servicio, no en UI.
- Edición de celda actualiza `TableCell.Text` y valida la expresión.

## 12. Manual Validation Checklist
- [ ] Doble clic en celda edita texto/expresión in situ
- [ ] Arrastrar borde de columna redimensiona con feedback
- [ ] Insertar/eliminar fila y columna desde menú contextual
- [ ] Fusionar celdas (ColumnSpan / RowSpan) y deshacer
- [ ] Undo/redo restaura cada operación; selección resaltada
- [ ] Tema claro y oscuro, alto DPI, teclado y ratón

## 13. Technical Documentation to produce
`Tables/Architecture.md` (edición en superficie, comandos) — PART11.

## 14. User Documentation to produce
Tema «Editar tablas en el diseñador» — PART12.

## 15. Acceptance Criteria
- Edición in situ, redimensionado, insertar/eliminar y fusión funcionando con undo/redo y
  acabado MeridianUI; §12 completo en WPF; suite verde.
