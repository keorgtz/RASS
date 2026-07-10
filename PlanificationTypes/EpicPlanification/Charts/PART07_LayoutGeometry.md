# PART07 — LayoutGeometry (geometría determinista y hit-áreas)

## 1. Purpose
Auditar y endurecer la geometría del `ChartLayoutHandler`: regiones (leyenda/eje de valores/
eje de categorías/plot), determinismo EMU exacto, y las **hit-áreas** que el dashboard usa
para interacción (clic en punto/serie → filtro cruzado). Es el puente entre el dibujo y la
interactividad.

## 2. Current State
El handler reparte regiones con márgenes fijos (leyenda 6 mm, eje de valores 12 mm, eje de
categoría 6 mm) y emite fragmentos deterministas. **No expone hit-áreas por punto/serie**: la
interacción del dashboard (cross-filter) necesita saber qué rectángulo/sector corresponde a
qué (serie, categoría). Los márgenes son constantes, no se adaptan al ancho de las etiquetas.

## 3. Comparison against DevExpress
DevExpress mapea clics a puntos de datos para drill/selección. AegiReports tiene el dibujo
determinista pero **el mapeo punto→hit-área para el dashboard es el hueco** (coordina con
Dashboard PART08_Interactions y PART09_SeriesHighlight de este Epic).

## 4. Missing Features
- Metadatos de hit-área por fragmento: `(serieIndex, categoryIndex)` → rect/sector.
- Regiones adaptativas: ancho del eje de valores según la etiqueta más ancha (hoy 12 mm fijo).
- Márgenes que reaccionen a leyenda envuelta / etiquetas rotadas (coordina PART05/PART06).

## 5. UX Problems
- Eje de valores de ancho fijo desperdicia o recorta espacio según los números.

## 6. Backend Problems
- Adjuntar identidad `(serie, categoría)` a cada fragmento sin romper el determinismo ni el
  transporte (los fragmentos deben seguir siendo serializables).
- Recalcular regiones a partir de mediciones reales de etiquetas.

## 7. Frontend Problems
- El dashboard consume las hit-áreas para resaltar/filtrar; el visor de reporte las ignora.

## 8. Technical Debt
- Hoy la interacción del dashboard con gráficas es limitada por la ausencia de hit-áreas
  por punto — origen del límite de highlight (PART09).

## 9. Required Improvements
1. Hit-áreas por punto/serie adjuntas a los fragmentos.
2. Regiones adaptativas (ancho de eje de valores según etiqueta más ancha).
3. Márgenes reactivos a leyenda/etiquetas.

## 10. Implementation Plan
1) Añadir identidad `(serie, categoría)` a los fragmentos de serie (y sectores de pie).
2) Regiones adaptativas midiendo etiquetas; recomputar plot.
3) Exponer las hit-áreas al dashboard; recorrido de cross-filter.

## 11. Automated Test Plan
- Cada fragmento de serie lleva `(serie, categoría)` correcto.
- Ancho del eje de valores = etiqueta más ancha + margen (determinista).
- Geometría reproducible byte a byte para la misma entrada.

## 12. Manual Validation Checklist
- [ ] Clic en columna/barra/punto en el dashboard identifica (serie, categoría)
- [ ] Eje de valores se ajusta al ancho de los números
- [ ] Plot no se solapa con leyenda envuelta ni etiquetas rotadas
- [ ] Geometría idéntica en visor y exportadores

## 13. Technical Documentation to produce
`Charts/Architecture.md` (regiones, hit-áreas, determinismo) — PART11.

## 14. User Documentation to produce
N/A directo (se refleja en interacción del dashboard) — nota en PART12.

## 15. Acceptance Criteria
- Hit-áreas por punto/serie expuestas; regiones adaptativas; determinismo verificado;
  §12 con capturas; suite verde.
