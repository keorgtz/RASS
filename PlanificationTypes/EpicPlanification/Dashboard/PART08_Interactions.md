# PART08 — Interactions (cross-filter, highlight, drill)

## 1. Purpose
El ciclo de interacción puro: `DashboardState` INMUTABLE (parámetros/filtros/selecciones/
drill paths/tabs/página) + `DashboardInteractionEngine` — CrossFilter/MasterDetail
(toggle → filtros efectivos de objetivos), CrossHighlight (marca sin excluir), DrillDown
por jerarquía con DrillUp, y DrillThrough/LinkedReport (→ `DashboardNavigationRequest`
que el host abre en el visor).

## 2. Current State
Funcional (Fase 26). Ciclo puro y determinista: hit → nuevo estado → recomposición.
**Límite declarado:** CrossHighlight en charts = anotación en el título + fondo de fila
en tablas (la paleta del chart engine es por SERIE, no por punto).

## 3. Comparison against DevExpress
DevExpress: master filtering, drill-down, y highlighting nativo por punto en charts.
AegiReports cubre cross-filter/master-detail/drill/through; el highlight por punto de
chart es el límite. Auditar la configuración de interacciones por widget (qué es maestro,
qué objetivos) y el feedback visual.

## 4. Missing Features
- Configurar por widget: rol maestro/objetivo, jerarquía de drill, destino de through.
- Highlight por punto en charts (hoy anotación/fila) — DECISIÓN DE ALCANCE 1.0 (liga
  Epic Charts PART09 SeriesHighlight).
- Indicador visual de filtro maestro activo (qué widget filtra a cuáles).

## 5. UX Problems
- El usuario debe entender qué clic hace qué: feedback de selección, breadcrumb de drill,
  y limpiar selección/filtro maestro.
- DrillThrough debe abrir el visor con el contexto correcto (fila/categoría).

## 6. Backend Problems
- `DashboardInteractionEngine`: estado inmutable, transiciones deterministas; confirmar
  que combinar cross-filter + drill + params produce el snapshot correcto.

## 7. Frontend Problems
- Hit-test clic→mm→widget/categoría fiable a distintos zooms (el mapa de hit-áreas).

## 8. Technical Debt
- El límite de highlight por punto es la deuda visible; resolver con Epic Charts o
  reafirmar documentado.

## 9. Required Improvements
1. Configuración de interacciones por widget (maestro/objetivo/jerarquía/through).
2. Decisión sobre highlight por punto (con Epic Charts).
3. Feedback: breadcrumb de drill, indicador de maestro, limpiar.

## 10. Implementation Plan
1) Modelo: configuración de interacciones en el documento + transiciones + tests.
2) WPF: UI de configuración, feedback, hit-test verificado.
3) Recorrido manual: cross-filter entre widgets, drill down/up, through al visor.

## 11. Automated Test Plan
- CrossFilter/MasterDetail toggle → filtros efectivos; CrossHighlight marca sin excluir;
  DrillDown/Up por jerarquía; DrillThrough → DashboardNavigationRequest correcto;
  estado inmutable (cada interacción produce nuevo estado).

## 12. Manual Validation Checklist
- [ ] Clic en un widget maestro filtra los objetivos; toggle limpia
- [ ] CrossHighlight marca (anotación/fila) sin excluir
- [ ] DrillDown por jerarquía con breadcrumb; DrillUp regresa
- [ ] DrillThrough/LinkedReport abre el visor con el contexto correcto
- [ ] Configurar roles/jerarquía/destino por widget
- [ ] Combinar cross-filter + drill + parámetro global → snapshot correcto
- [ ] Indicador de maestro activo; limpiar todo
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Dashboard/Architecture.md` (estado inmutable, motor de interacción, mapa de hit-áreas),
`Dashboard/Limitations.md` (highlight por punto si queda fuera).

## 14. User Documentation to produce
«Interacciones del dashboard» (filtrado maestro, drill, navegación a reportes).

## 15. Acceptance Criteria
- Interacciones configurables y deterministas; hit-test fiable; decisión de highlight
  cerrada; feedback completo; checklist §12 con capturas; suite verde.
