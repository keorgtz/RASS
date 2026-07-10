# PART05 — WidgetEditors (editores de widgets)

## 1. Purpose
Los editores modales por widget sobre modelos puros (Dashboard/Design): KPI
(`KpiDesignerModel`), gráfico, crosstab, gauge, progreso, texto enriquecido, imagen y
forma — configuran binding (categoría/valor/serie), formato, agregado, colores y
opciones específicas de cada tipo.

## 2. Current State
Funcional (Fase 26). Editores modales sobre modelos puros testeables. 15 widgets:
chart=ChartControl, tabla=TableControl, crosstab=CrosstabEngine+Builder, richtext,
imagen/forma (rect/píldora/línea — sin elipses, límite), gauge (arco de 48 segmentos)/
progreso/KpiCard como controles de extensión.

## 3. Comparison against DevExpress
DevExpress: panel de propiedades del item + wizards por tipo, con opciones ricas
(formato condicional, sparklines, deltas en KPI, múltiples series). AegiReports cubre lo
esencial por editor; auditar deltas/objetivos en KPI, formato condicional de tabla/
crosstab, múltiples series en chart y sparklines.

## 4. Missing Features
- KPI: delta vs objetivo/periodo anterior, flecha/color por tendencia, sparkline.
- Chart: múltiples series/valores, eje secundario, tipos pie/dona/área (liga Epic Charts).
- Tabla/crosstab: formato condicional visual (más allá del post-proceso actual).
- Formas: elipse/círculo (hoy solo rect/píldora/línea — límite declarado).

## 5. UX Problems
- Vista previa en vivo dentro del editor (ver el widget mientras se configura).
- Validación de binding (slot requerido sin campo) con aviso claro.

## 6. Backend Problems
- Los modelos de diseño son puros; extender KPI (delta) y chart (series) manteniendo
  determinismo y la compilación a controles existentes.

## 7. Frontend Problems
- Editores consistentes entre sí (mismos editores de color/número/campo).

## 8. Technical Debt
- El formato condicional de crosstab es post-proceso; unificar con el del reporte
  (Designer PART14) sería ideal — coordinar.

## 9. Required Improvements
1. KPI con delta/objetivo/tendencia + sparkline.
2. Chart multi-serie + eje secundario (pie/dona/área desde Epic Charts).
3. Vista previa en vivo + validación de binding en cada editor.

## 10. Implementation Plan
1) Modelos: extender `KpiDesignerModel` (delta) y el de chart (series) + tests.
2) WPF: preview en vivo, editores compartidos, validación.
3) Recorrido manual configurando cada tipo de widget con datos hoteleros.

## 11. Automated Test Plan
- Cada modelo de diseño produce el widget/binding correcto; KPI delta calcula bien;
  chart multi-serie shape correcto; validación de slot requerido.

## 12. Manual Validation Checklist
- [ ] Editar KPI con delta/objetivo → flecha y color por tendencia; sparkline
- [ ] Editar chart con 2 series → ambas visibles; eje secundario si aplica
- [ ] Editar crosstab con formato condicional de celdas
- [ ] Editar gauge/progreso/texto/imagen/forma
- [ ] Vista previa en vivo dentro del editor
- [ ] Slot requerido sin campo → aviso; aplicar/cancelar; undo tras aplicar
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Dashboard/Architecture.md` (modelos de diseño, compilación a controles),
remite a `Charts/*` para los tipos de gráfico.

## 14. User Documentation to produce
«Configurar widgets» (KPI, gráfico, crosstab, gauge, etc.).

## 15. Acceptance Criteria
- KPI con delta, chart multi-serie, formato condicional y preview en vivo; validación de
  binding; límites de formas documentados; checklist §12 con capturas; suite verde.
