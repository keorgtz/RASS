# PART02 — ColumnBarLine (acabado de los 3 tipos existentes)

## 1. Purpose
Llevar los tres tipos implementados (columnas agrupadas, barras horizontales, líneas con
marcadores) a acabado comercial: agrupación correcta de series, marcadores, y decisión sobre
**apilado (stacked)** y **línea con área**. Es la base sobre la que se añaden Pie/Área.

## 2. Current State
`ComposeColumnSeries`/`ComposeBarSeries`/`ComposeLineSeries` producen fragmentos
deterministas: columnas y barras **agrupadas** (clustered, `groupWidth = slot·0.7`,
ancho por serie = grupo/nº series), líneas con segmentos + marcadores circulares. Color por
serie. **No hay apilado (stacked)** ni línea suavizada/área. Las barras horizontales **no
dibujan etiquetas de categoría** (el eje de categorías retorna temprano para `Bar` — bug/gap).

## 3. Comparison against DevExpress
DevExpress ofrece columnas/barras **agrupadas y apiladas (stacked / 100%)**, líneas y
splines. AegiReports tiene agrupadas; **falta apilado** (muy demandado) y las **barras sin
etiqueta de categoría** están por debajo del mínimo comercial.

## 4. Missing Features
- Series **apiladas** (stacked) y **100% apiladas** para columnas y barras.
- Etiquetas de categoría en barras horizontales (hoy ausentes — coordina con PART05).
- Marcadores configurables y grosor de línea; opción de línea suavizada (decisión 1.0).

## 5. UX Problems
- Una gráfica de barras sin etiquetas de categoría es ilegible: el usuario no sabe qué barra
  es cuál.

## 6. Backend Problems
- El apilado cambia el cálculo de `niceMax` (suma por categoría, no máximo por punto) y el
  posicionamiento (acumulado) — coordinar con PART05 (escala).
- `ComposeCategoryAxis` retorna para `Bar`; hay que emitir etiquetas en el eje vertical.

## 7. Frontend Problems
N/A (fragmentos renderer-independientes).

## 8. Technical Debt
- Apilado es trabajo real de layout + escala; decisión 1.0 sobre alcance (agrupado + apilado
  simple como mínimo, o acotar a agrupado).

## 9. Required Improvements
1. Etiquetas de categoría en barras horizontales.
2. Apilado (stacked) para columnas/barras con escala acumulada.
3. Marcadores/grosor configurables; (opcional) spline.

## 10. Implementation Plan
1) Corregir etiquetas de categoría en `Bar`.
2) Añadir modo apilado (columna/barra) con `niceMax` = máx. suma por categoría.
3) Recorrido manual de los tres tipos, agrupado y apilado.

## 11. Automated Test Plan
- Columnas/barras agrupadas: posiciones y anchos esperados (fragmentos).
- Apilado: acumulación correcta por categoría; `niceMax` = máxima suma.
- Barras con etiquetas de categoría presentes.

## 12. Manual Validation Checklist
- [ ] Barras horizontales muestran etiqueta de categoría
- [ ] Columnas/barras agrupadas y apiladas se ven correctas en visor y PDF
- [ ] Líneas con marcadores legibles; múltiples series distinguibles por color
- [ ] Leyenda coincide con las series
- [ ] Tema claro/oscuro

## 13. Technical Documentation to produce
`Charts/Architecture.md` (tipos, apilado, escala acumulada) — PART11.

## 14. User Documentation to produce
Tema «Tipos de gráfica: columnas, barras y líneas» — PART12.

## 15. Acceptance Criteria
- Etiquetas de categoría en barras; apilado implementado o acotado; tres tipos a acabado
  comercial; §12 con capturas; suite verde.
