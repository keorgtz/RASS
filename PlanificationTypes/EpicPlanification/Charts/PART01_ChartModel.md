# PART01 — ChartModel (modelo lógico de gráfica)

## 1. Purpose
Auditar y cerrar el modelo lógico de la gráfica: `ChartControl` (`ChartKind`, `Series`,
`Palette` por serie, `ShowLegend`), `ChartSeries` (nombre + puntos) y `ChartDataPoint`
(`Label` + `Value` decimal). Es el modelo puro y determinista que el `ChartLayoutHandler`
compone como fragmentos (rectángulos/líneas/texto) para llegar a todos los renderers y
exporters sin código de plataforma.

## 2. Current State
Implementado y limpio: `ChartControl` con `Kind` (Column/Bar/Line), `Series`, `Palette`
(MeridianPalette de 6 colores, cíclica por serie) y `ShowLegend`. `ChartSeries` inmutable
con `Points`. Persistencia `.aedocx` completa (`ChartControlXmlSerializer`: Kind/ShowLegend/
Palette/Series/Points, cultura invariante). **Hueco central:** en un REPORTE los puntos son
**estáticos** — el `GroupedDocumentExpander` solo resuelve `TextControl` y `TableControl`, no
`ChartControl`; el enlace categoría/valor a la fuente de datos **solo existe en el dashboard**
(`ChartWidgetFactory` arma series desde `ShapedSeries`).

## 3. Comparison against DevExpress
El chart de DevExpress Reporting se enlaza a un data member con *argument*/*value*/*series*
fields y agrega en vivo. AegiReports tiene ese enlace **en el dashboard** pero **no en el
reporte** (puntos literales). Cerrar o acotar el binding de gráfica en reportes es la
decisión de modelo más importante del Epic.

## 4. Missing Features
- **Binding de datos de gráfica en reportes**: campos categoría/valor/serie + agregación,
  expandidos desde la fuente de datos del reporte (hoy solo dashboard).
- Título de gráfica y subtítulo en el modelo.
- Valores negativos en `ChartDataPoint` tratados como datos válidos (hoy se clampan; PART05).

## 5. UX Problems
N/A directo (modelo); se manifiesta al no poder crear una gráfica ligada a datos en el
diseñador de reportes sin pre-agregar.

## 6. Backend Problems
- Añadir binding exige un paso de shaping en la expansión del reporte (categoría/valor/
  agregado) reutilizando el motor de agregados de Expressions — sin motor nuevo.
- Coordinar el modelo de reporte con el shaping del dashboard (una sola semántica).

## 7. Frontend Problems
N/A (modelo puro).

## 8. Technical Debt
- **Gráfica de reporte con datos estáticos**: decisión 1.0 — implementar binding categoría/
  valor/serie con agregación, o acotar formalmente (solo dashboard tiene datos vivos) en
  `Limitations.md`.

## 9. Required Improvements
1. Decidir e implementar (o acotar) el binding de datos de gráfica en reportes.
2. Título/subtítulo en el modelo.
3. Docs XML completas de cada tipo.

## 10. Implementation Plan
1) Auditar cómo se pueblan las gráficas en reporte vs dashboard; fijar la decisión de binding.
2) Si se implementa: shaping de categoría/valor/serie en la expansión del reporte
   (reusando agregados de Expressions) + persistencia del binding.
3) Añadir título/subtítulo; docs XML.

## 11. Automated Test Plan
- Construcción por código de gráficas Column/Bar/Line con paleta y leyenda.
- (Si binding) shaping de categoría/valor desde una fuente produce las series esperadas.
- Round-trip del modelo (incluido binding si entra) por `.aedocx`.

## 12. Manual Validation Checklist
- [ ] Gráfica por código se ve correcta en el visor (3 tipos)
- [ ] (Si binding) gráfica ligada a datos del reporte agrega y grafica en vivo
- [ ] Paleta y leyenda reflejan las series
- [ ] Guardar y reabrir preserva tipo, paleta y series

## 13. Technical Documentation to produce
`Charts/Architecture.md` (modelo, binding, decisión reporte vs dashboard) — PART11.

## 14. User Documentation to produce
Base del tema «Gráficas: series, categorías y paleta» — PART12.

## 15. Acceptance Criteria
- Modelo auditado; binding de datos en reportes implementado o acotado por escrito;
  título/subtítulo; docs XML; §12 con capturas; suite verde.
