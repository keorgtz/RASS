# PART03 — Toolbox (catálogo de widgets)

## 1. Purpose
El panel de widgets del diseñador: grupos (Indicadores/Datos/Medios/Layout),
`DashboardToolboxModel` con búsqueda, y el alta de widgets al lienzo por arrastre o
doble clic, incluidos los widgets estándar y los de terceros (mismo `DashboardWidgetRegistry`).

## 2. Current State
Funcional (Fase 26). Los 15 widgets estándar + los de plugins aparecen por el mismo
`DashboardWidgetRegistry`. Grupos con búsqueda. Fase 28: estilos Meridian.

## 3. Comparison against DevExpress
DevExpress agrupa los dashboard items por categoría con iconos y arrastre con preview.
AegiReports tiene grupos y búsqueda; auditar iconos por widget, ghost de arrastre,
tamaño default por tipo y descripción/tooltip.

## 4. Missing Features
- Ghost/preview del widget durante el arrastre.
- Tamaño default por tipo de widget (KPI pequeño vs chart grande) documentado.
- Iconos y tooltips por widget (incluidos los de terceros vía manifest).
- Insertar por doble clic en una celda libre.

## 5. UX Problems
- Estado vacío de búsqueda; grupos colapsables con memoria de estado.

## 6. Backend Problems
- Ninguno; `DashboardToolboxModel` es puro y testeado.

## 7. Frontend Problems
- Doble clic debería colocar en la primera celda libre, no en posición fija.

## 8. Technical Debt
- Ninguna crítica.

## 9. Required Improvements
1. Ghost de arrastre + tamaños default por tipo + colocación en celda libre.
2. Iconos/tooltips por widget (estándar y terceros).
3. Estado vacío + grupos colapsables con memoria.

## 10. Implementation Plan
1) Modelo: `DashboardWidgetDefaults.SizeFor(kind)` + icono opcional en la fábrica.
2) WPF: ghost, doble clic en celda libre, iconos, colapso.
3) Recorrido manual insertando cada uno de los 15 widgets.

## 11. Automated Test Plan
- Tamaños default por tipo; búsqueda con acentos; el catálogo incluye widgets de un
  plugin de prueba; colocación en celda libre.

## 12. Manual Validation Checklist
- [ ] Arrastrar cada uno de los 15 widgets (ghost + tamaño correcto)
- [ ] Doble clic coloca en celda libre
- [ ] Buscar «kpi»/«gráfico» encuentra; vacío muestra mensaje
- [ ] Widget de plugin (DashboardWidgetsPlugin) aparece e inserta
- [ ] Undo tras insertar elimina el widget
- [ ] Grupos colapsables recuerdan estado
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado (Enter inserta) · [ ] Mouse

## 13. Technical Documentation to produce
`Dashboard/Architecture.md` (toolbox + registry), `Dashboard/API.md` (widgets de
terceros en el toolbox).

## 14. User Documentation to produce
«Agregar widgets al dashboard».

## 15. Acceptance Criteria
- Todo widget (estándar o de plugin) se inserta con ghost, tamaño sensato y en celda
  libre; iconos/tooltips completos; checklist §12 con capturas; suite verde.
