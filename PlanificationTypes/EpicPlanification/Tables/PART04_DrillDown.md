# PART04 — DrillDown (grupos colapsados y navegación)

## 1. Purpose
Auditar y completar el drill-down: `GroupingOptions.CollapsedGroupKeys` colapsa un grupo
conservando su encabezado y pie (subtotales) pero omitiendo detalle y subgrupos, y su
exposición interactiva en el visor (expandir/colapsar por clic).

## 2. Current State
El modelo soporta colapso: en `EmitGroupLevel`, un grupo cuya clave está en
`CollapsedGroupKeys` (comparada culture-aware con `FormatCulture`) emite header+footer y
salta la recursión de subniveles y detalles. Es una recomposición del documento, no un
estado visual. **La interacción del visor (toggle por clic) es el hueco**: hoy el colapso se
fija por opciones, no por gesto del usuario.

## 3. Comparison against DevExpress
DevExpress ofrece drill-down interactivo (clic en el encabezado expande/colapsa) en el visor.
AegiReports tiene el motor (recomposición por `CollapsedGroupKeys`) pero **no el gesto
interactivo** cableado en el `ViewerShell`. Coordinar con Previewer.

## 4. Missing Features
- Toggle interactivo en el visor: clic en encabezado de grupo ↔ actualizar
  `CollapsedGroupKeys` y recomponer.
- Indicador visual de estado (▸/▾) en el encabezado de grupo colapsable.
- Persistencia del estado de colapso al exportar (¿PDF con bookmarks? — decisión).

## 5. UX Problems
- Sin affordance de que un grupo es colapsable; el usuario no descubre la función.

## 6. Backend Problems
- La recomposición completa por cada toggle puede ser cara en reportes grandes → medir y,
  si aplica, recomponer incrementalmente (coordina con Performance PART10).

## 7. Frontend Problems
- Cablear el hit-test del encabezado de grupo en el visor y disparar recomposición
  (coordina con Previewer PART01/PART03).

## 8. Technical Debt
- Decisión 1.0: drill-down interactivo en visor vs solo drill-down programático
  (por parámetro/opción). Si se acota, declararlo en `Limitations.md`.

## 9. Required Improvements
1. Toggle interactivo con indicador ▸/▾ en el visor (si entra en 1.0).
2. Recomposición eficiente ante toggle.
3. Documentar el comportamiento en exportación (estático al estado actual).

## 10. Implementation Plan
1) Verificar la recomposición por `CollapsedGroupKeys` (colapsa/expande correctamente).
2) Cablear gesto + indicador en el visor; recomponer al alternar.
3) Recorrido manual expandir/colapsar en reporte agrupado.

## 11. Automated Test Plan
- Grupo colapsado emite header+footer, omite detalle y subgrupos.
- Expandir/colapsar produce documentos correctos y deterministas.
- Clave con cultura no-invariante colapsa igual (consistencia de comparación).

## 12. Manual Validation Checklist
- [ ] Clic en encabezado de grupo colapsa/expande en el visor
- [ ] Subtotales permanecen visibles con el grupo colapsado
- [ ] Indicador ▸/▾ refleja el estado
- [ ] Exportar respeta el estado actual de colapso
- [ ] Rendimiento aceptable al alternar en reporte grande

## 13. Technical Documentation to produce
`Tables/Architecture.md` (drill-down) e `Integration.md` (API de colapso) — PART11.

## 14. User Documentation to produce
Tema «Expandir y contraer grupos (drill-down)» — PART12.

## 15. Acceptance Criteria
- Drill-down interactivo cableado o acotado por escrito; recomposición correcta y medida;
  §12 con capturas; suite verde.
