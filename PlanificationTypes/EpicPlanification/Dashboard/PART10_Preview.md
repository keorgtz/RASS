# PART10 — Preview (vista previa interactiva)

## 1. Purpose
El `DashboardPreviewControl`: presenter real del `ReportDocument` compuesto + hit-test
clic→mm, barra de filtros por tipo con jerarquía en cascada, breadcrumb de drill,
auto-refresh del host, F11 y modo presentación.

## 2. Current State
Funcional (Fase 26). Presenter real, hit-test, barra de filtros con lookups del snapshot
sin filtros, breadcrumb, auto-refresh, F11, presentación. Fase 28: control theme +
manejo de parámetros del preview.

## 3. Comparison against DevExpress
DevExpress Viewer de dashboard: interacción completa, exportar el dashboard, y
presentación. AegiReports cubre interacción + F11; auditar exportar el dashboard desde
el preview (a PDF/imagen), refresco manual vs automático y el estado de carga.

## 4. Missing Features
- Exportar el dashboard compuesto desde el preview (reusa exporters del pipeline).
- Refresco manual explícito además del auto-refresh; indicador de «actualizando».
- Mostrar la marca de tiempo del último refresco.

## 5. UX Problems
- Estado de carga/actualización no bloqueante con estado terminal (lección Fase 28).
- La barra de filtros debe ser clara: filtros activos, limpiar, cascada visible.

## 6. Backend Problems
- Auto-refresh del host: solo el último snapshot publica; cancelación de refrescos
  superados.

## 7. Frontend Problems
- Hit-test fiable a distintos zooms; overlays de selección/highlight siguen el zoom.

## 8. Technical Debt
- El preview y el visor comparten presenter; documentar la reutilización.

## 9. Required Improvements
1. Exportar dashboard desde el preview + refresco manual + marca de tiempo.
2. Estado de carga terminal; cancelación de refrescos superados.
3. Barra de filtros pulida (activos/limpiar/cascada).

## 10. Implementation Plan
1) Preview: acción de export (pipeline), refresco manual, marca de tiempo.
2) WPF: estados de carga, barra de filtros, hit-test verificado a varios zooms.
3) Recorrido manual: interactuar, filtrar, drill, exportar, F11.

## 11. Automated Test Plan
- Composición del dashboard a ReportDocument (existente); hit-test clic→widget/categoría;
  solo el último refresco publica; export produce artefacto no vacío.

## 12. Manual Validation Checklist
- [ ] Interactuar: cross-filter, highlight, drill down/up con breadcrumb
- [ ] Barra de filtros: aplicar/limpiar, cascada visible, chips activos
- [ ] Auto-refresh del host; refresco manual; marca de tiempo del último
- [ ] Exportar el dashboard a PDF/imagen desde el preview
- [ ] F11 y presentación; estado de carga terminal
- [ ] Hit-test correcto a 100/150/200 % de zoom
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Dashboard/Architecture.md` (preview, hit-test, auto-refresh), `Dashboard/Performance.md`.

## 14. User Documentation to produce
«Ver e interactuar con un dashboard» (filtros, drill, exportar, presentación).

## 15. Acceptance Criteria
- Interacción completa con estado de carga terminal; export desde preview; hit-test
  fiable; checklist §12 con capturas; suite verde.
