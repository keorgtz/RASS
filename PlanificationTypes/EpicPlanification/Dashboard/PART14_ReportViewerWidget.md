# PART14 — ReportViewerWidget (widget de reporte incrustado)

## 1. Purpose
El widget ReportViewer: incrusta bands FRESCAS ya expandidas del resolutor del host
(`DashboardHostServices.ReportResolver`) dentro del dashboard, y la navegación
DrillThrough/LinkedReport que abre el reporte referenciado en el visor real
(`OpenReport` → `DashboardNavigationRequest`).

## 2. Current State
Funcional (Fase 26). El Demo resuelve escenarios hoteleros por título (`ResolveHotelReportBands`)
y abre el reporte navegado en el visor (`OpenNavigatedReportAsync`). Las bands se
expanden frescas por llamada.

## 3. Comparison against DevExpress
DevExpress no incrusta reportes completos como item de dashboard de forma nativa (usa
drill a un reporte). AegiReports incrusta bands reales — un diferencial. Auditar el
tamaño/scroll del reporte incrustado, el refresco con los filtros del dashboard y el
manejo de un reporte no resuelto.

## 4. Missing Features
- El reporte incrustado debe reaccionar a los filtros/parámetros globales del dashboard
  (no solo mostrarse estático).
- Scroll/paginación del reporte dentro del widget si excede el área.
- Manejo de referencia no resuelta (reporte inexistente) con aviso en el widget.

## 5. UX Problems
- Indicar que el widget es un reporte (encabezado con el nombre) y permitir «abrir en
  visor» desde el widget.
- Estado de carga del reporte incrustado.

## 6. Backend Problems
- `ReportResolver` del host expande frescas por llamada; confirmar cancelación y que los
  parámetros del dashboard se propagan al resolver.

## 7. Frontend Problems
- Render del reporte incrustado a la escala del widget sin romper el layout.

## 8. Technical Debt
- El contrato `ReportResolver`/`OpenReport` es del host; documentarlo en el SDK de
  hosting.

## 9. Required Improvements
1. Propagar filtros/parámetros del dashboard al reporte incrustado.
2. Scroll/paginación dentro del widget; abrir en visor desde el widget.
3. Referencia no resuelta → aviso claro en el widget.

## 10. Implementation Plan
1) Modelo: paso de parámetros del dashboard al ReportResolver + tests.
2) WPF: scroll/paginación, encabezado con abrir-en-visor, estados.
3) Recorrido manual: incrustar un reporte hotelero, filtrarlo, drill-through al visor.

## 11. Automated Test Plan
- ReportResolver devuelve bands frescas por llamada; parámetros propagados; referencia
  no resuelta → resultado manejado; DrillThrough → DashboardNavigationRequest correcto.

## 12. Manual Validation Checklist
- [ ] Incrustar un reporte hotelero en el dashboard
- [ ] Filtrar el dashboard → el reporte incrustado refleja el filtro
- [ ] Scroll/paginación dentro del widget si el reporte es largo
- [ ] Abrir en visor desde el widget (DrillThrough/LinkedReport)
- [ ] Referencia inexistente → aviso en el widget, sin fallo mudo
- [ ] Estado de carga del reporte incrustado
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Dashboard/Integration.md` (ReportResolver/OpenReport), `Dashboard/Architecture.md`
(widget de reporte, bands frescas).

## 14. User Documentation to produce
«Incrustar un reporte en el dashboard» (y navegar a él).

## 15. Acceptance Criteria
- Reporte incrustado reactivo a filtros, con scroll y abrir-en-visor; referencia no
  resuelta manejada; checklist §12 con capturas; suite verde.
