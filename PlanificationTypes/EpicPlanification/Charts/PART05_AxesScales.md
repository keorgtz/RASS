# PART05 — AxesScales (ejes, escalas y formato)

## 1. Purpose
Cerrar los ejes a nivel comercial: escala «nice» determinista (ya existe), **soporte de
valores negativos**, formato numérico y de cultura de las etiquetas de valor, títulos de
eje, y **rotación/elipsis de etiquetas de categoría** cuando no caben.

## 2. Current State
`ComputeNiceScale` produce máximo y paso 1/2/5·10ⁿ deterministas (4–8 divisiones). El eje de
valores dibuja gridlines + etiquetas con formato **fijo `"0.##"` en `InvariantCulture`**.
Limitaciones reales: **valores negativos se clampan a 0** (`Math.Max(0, value)` y `niceMax`
solo positivo → no hay eje negativo); **el eje de categorías se omite para `Bar`**; no hay
título de eje ni rotación de etiquetas largas (se solapan).

## 3. Comparison against DevExpress
DevExpress soporta rango negativo, ejes secundarios, formato y cultura por eje, títulos y
rotación automática de etiquetas. AegiReports: escala nice sólida pero **sin negativos, sin
formato/cultura configurable, sin títulos ni rotación** — brechas claras.

## 4. Missing Features
- **Rango de valores con negativos** (línea base en cero interior, columnas/barras hacia
  ambos lados).
- Formato numérico y cultura de etiquetas de valor (miles, moneda, %, es-MX).
- Título de eje (valor y categoría).
- Rotación/elipsis de etiquetas de categoría largas para evitar solapamiento.

## 5. UX Problems
- Datos con negativos se ven planos (clampados) — engañoso.
- Etiquetas de categoría largas se solapan e ilegibles.

## 6. Backend Problems
- Rango negativo cambia `niceMax`→`[niceMin, niceMax]`, la posición de la base y el signo de
  las alturas; toca los tres composers de serie.
- Formato/cultura debe fluir desde el estilo/opciones al `ToString` de etiquetas.

## 7. Frontend Problems
- Rotación de etiquetas requiere medir a un ángulo y reservar altura del eje de categoría.

## 8. Technical Debt
- El clamp a 0 es una simplificación estructural: quitarlo obliga a revisar escala y todos
  los composers — planear en conjunto con PART02 (stacked comparte cálculo de escala).

## 9. Required Improvements
1. Soporte de valores negativos (rango `[min,max]` nice, base en cero interior).
2. Formato numérico + cultura (es-MX) de etiquetas de valor.
3. Títulos de eje; rotación/elipsis de etiquetas de categoría.

## 10. Implementation Plan
1) Generalizar la escala nice a rango con negativos; reubicar la base.
2) Formato/cultura de etiquetas desde opciones; títulos de eje.
3) Rotación de etiquetas de categoría al no caber; recorrido manual.

## 11. Automated Test Plan
- Escala nice con datos negativos produce `[min,max]` correcto y base interior.
- Formato es-MX (p. ej. `1,234.5`) aplicado a etiquetas de valor.
- Rotación se activa cuando las etiquetas exceden el ancho del slot.

## 12. Manual Validation Checklist
- [ ] Serie con negativos muestra columnas/barras a ambos lados de la base
- [ ] Etiquetas de valor con formato es-MX (miles/decimales/moneda)
- [ ] Títulos de eje visibles y legibles
- [ ] Categorías largas rotadas o con elipsis, sin solaparse
- [ ] Barras horizontales muestran su eje de categoría (coordinado con PART02)

## 13. Technical Documentation to produce
`Charts/Architecture.md` (escala, rango negativo, formato, ejes) — PART11.

## 14. User Documentation to produce
Tema «Ejes, escalas y formato de la gráfica» — PART12.

## 15. Acceptance Criteria
- Negativos soportados; formato/cultura configurable; títulos y rotación; §12 con capturas;
  suite verde.
