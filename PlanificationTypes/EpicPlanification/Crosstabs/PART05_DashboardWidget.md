# PART05 — DashboardWidget (widget de crosstab y formato condicional)

## 1. Purpose
Cerrar el widget crosstab del dashboard (`CrosstabWidgetFactory`,
`CrosstabDashboardWidget`): datos vivos vía shaping, **formato condicional por celda**
(`CrosstabFormatRule`, post-proceso), hit-áreas de interacción, y la **coherencia** de ese
formato condicional con el crosstab de reporte.

## 2. Current State
Implementado y vivo: el widget corre `CrosstabEngine.Build` sobre `context.Data.Rows` con
`RowField`/`ColumnField`/`ValueField`/`Aggregate`, materializa vía `CrosstabTableBuilder` y
aplica `ApplyFormatRules` — reglas de umbral (`AtOrAbove`/`< Threshold`) que pintan el
**fondo de las celdas de valor** del cuerpo. **Límites:** el formato condicional es
**umbral simple** (no expresión), vive **solo en el dashboard** (el crosstab de reporte no lo
tiene), y no hay hit-áreas por celda para cross-filter fino.

## 3. Comparison against DevExpress
DevExpress ofrece formato condicional con reglas ricas (rangos, escalas de color, barras de
datos) y drill/selección por celda. AegiReports: **umbral simple, solo dashboard, sin
selección por celda** — brechas de riqueza y de coherencia.

## 4. Missing Features
- Formato condicional **coherente entre reporte y dashboard** (reglas compartidas y
  persistidas) — cerrar la asimetría; coordina con Tables PART07 y Designer PART14.
- Reglas más ricas (rango, por expresión, escala de color) — decisión 1.0.
- Hit-áreas por celda para selección/cross-filter (coordina con Dashboard PART08).

## 5. UX Problems
- El usuario que ve formato condicional en el dashboard no lo obtiene en el reporte impreso
  del mismo pivote — inconsistencia percibida.

## 6. Backend Problems
- Unificar el modelo de regla (umbral/rango/expresión) y persistirlo en ambos lados
  (`.aedashboard` ya guarda `FormatRules`; el reporte no — PART08).
- Hit-áreas por celda requieren metadatos en el TableControl materializado.

## 7. Frontend Problems
- Editor de reglas en el dashboard con acabado MeridianUI; feedback en vivo.

## 8. Technical Debt
- **Formato condicional dashboard-only y umbral-simple**: comparte la deuda de formato
  condicional del producto (Designer PART14: no persiste / plano). Cerrar de forma unificada.

## 9. Required Improvements
1. Modelo de formato condicional unificado y persistido (reporte + dashboard).
2. Reglas más ricas (rango/expresión/escala de color) según alcance 1.0.
3. Hit-áreas por celda para interacción.

## 10. Implementation Plan
1) Unificar el modelo de regla y persistirlo en ambos lados.
2) Enriquecer reglas (mínimo: rango; ideal: expresión/escala) según decisión.
3) Hit-áreas por celda; recorrido de cross-filter y de formato condicional.

## 11. Automated Test Plan
- `ApplyFormatRules` pinta las celdas correctas por umbral (regresión).
- Reglas unificadas evalúan igual en reporte y dashboard.
- (Si hit-áreas) cada celda de valor lleva (fila, columna) correcta.

## 12. Manual Validation Checklist
- [ ] Regla de umbral pinta las celdas esperadas en el dashboard
- [ ] La misma regla aplica en el crosstab de reporte
- [ ] La regla persiste al guardar y reabrir (dashboard y reporte)
- [ ] Selección por celda filtra el resto de widgets (si hit-áreas)
- [ ] Tema claro/oscuro

## 13. Technical Documentation to produce
`Crosstabs/Architecture.md` (widget, formato condicional, hit-áreas) — PART09.

## 14. User Documentation to produce
Tema «Formato condicional en tablas cruzadas» — PART10.

## 15. Acceptance Criteria
- Formato condicional unificado y persistido en reporte y dashboard; reglas según alcance;
  hit-áreas o límite documentado; §12 con capturas; suite verde.
