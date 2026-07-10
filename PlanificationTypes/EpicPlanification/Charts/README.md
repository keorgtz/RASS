# Epic: Charts — backlog

**Prioridad:** P1 · **Complejidad:** Alta · **Completitud (8 puertas):** 35 % ·
**Estado:** PARTs detallados (pendiente de ejecución)

## Alcance

`AegiReports.Charts` (ChartControl Column/Bar/Line, escala nice determinista,
ChartLayoutHandler con geometría de leyenda/ejes/categorías, ChartsPlugin, serializador
`.aedocx`), el wizard de gráfica y el widget chart del dashboard.

## Objetivos

1. Cerrar los gaps de tipos declarados en FINAL_PRODUCT_GAPS: **pie/dona y área**
   (G-charts) — son los tipos de mayor demanda comercial tras columnas/líneas.
2. Highlight por punto/serie (hoy la paleta es por serie — límite del cross-highlight
   del dashboard): decidir cierre o límite 1.0.
3. Etiquetas de datos, formato numérico y leyendas a nivel comercial.
4. Paridad auditada contra el charting básico de DevExpress Reporting (no XtraCharts
   completo: alcance = charts DE REPORTE).

## Dependencias

- Ninguna entrante. Alimenta: Dashboard (widget chart), Samples.

## PARTs planificados (12)

- PART01_ChartModel — series, categorías, escalas, paleta, temas
- PART02_ColumnBarLine — acabado de los 3 tipos existentes
- PART03_PieDonut — NUEVO tipo (gap G aceptado a cerrar)
- PART04_AreaChart — NUEVO tipo (gap G aceptado a cerrar)
- PART05_AxesScales — escala nice, formatos, rotación de etiquetas, límites
- PART06_LegendsLabels — leyenda, etiquetas de datos, colisiones
- PART07_LayoutGeometry — geometría determinista, hit-áreas del dashboard
- PART08_WizardEditor — wizard de gráfica + editor del dashboard
- PART09_SeriesHighlight — highlight por punto/serie o límite formal
- PART10_ExportFidelity — fidelidad en PDF/imagen/XLSX/web
- PART11_TechnicalDocumentation
- PART12_UserDocumentation
