# PART04 — AreaChart (nuevo tipo: área)

## 1. Purpose
Añadir el tipo **área** (line + relleno bajo la curva), incluida el área apilada: gap G
aceptado. Reutiliza la geometría de líneas existente añadiendo un **fragmento de polígono
relleno**.

## 2. Current State
No existe. `ComposeLineSeries` dibuja segmentos y marcadores pero **no rellena** el área bajo
la línea. No hay un `PolygonFragment` de relleno con opacidad. Este PART lo añade.

## 3. Comparison against DevExpress
DevExpress ofrece área, área apilada y área 100%. Meta 1.0: área simple y apilada, con
relleno semitransparente para no ocultar series traseras.

## 4. Missing Features
- `ChartKind.Area` (y apilada) construida sobre la geometría de línea.
- **Fragmento de polígono relleno** con opacidad (área bajo la curva hasta la línea base).
- Orden de dibujo correcto (series traseras primero) y opacidad para legibilidad.

## 5. UX Problems
- Áreas opacas superpuestas ocultan datos: el relleno debe ser semitransparente o apilarse.

## 6. Backend Problems
- El polígono relleno debe renderizarse en todos los backends (WPF/Skia/PDF/HTML) con
  opacidad; reutilizar el color de serie con alfa.
- Área apilada comparte el cálculo acumulado de escala con PART02 (stacked).

## 7. Frontend Problems
- Fidelidad del relleno/opacidad idéntica entre visor y exportadores.

## 8. Technical Debt
- Depende del fragmento de polígono relleno con opacidad (nuevo en el vocabulario de layout);
  coordinar con el mismo esfuerzo de primitivas de PART03.

## 9. Required Improvements
1. `PolygonFragment` relleno con opacidad en todos los backends.
2. `ChartKind.Area` simple y apilada; relleno semitransparente.
3. Orden de dibujo y opacidad para legibilidad.

## 10. Implementation Plan
1) Definir el polígono relleno y renderizarlo por backend.
2) Componer área desde la geometría de línea + relleno a la base; variante apilada.
3) Recorrido manual multiplataforma.

## 11. Automated Test Plan
- El polígono de área cubre exactamente bajo la curva hasta la base.
- Área apilada acumula correctamente; escala coincide con stacked (PART02).
- Relleno con opacidad renderiza por backend (golden).

## 12. Manual Validation Checklist
- [ ] Área simple y apilada se ven correctas y legibles en el visor
- [ ] Relleno semitransparente no oculta series traseras
- [ ] Fidelidad idéntica en PDF, imagen y web
- [ ] Tema claro/oscuro; alto DPI

## 13. Technical Documentation to produce
`Charts/Architecture.md` (fragmento de polígono, área/área apilada) — PART11.

## 14. User Documentation to produce
Tema «Gráficas de área» — PART12.

## 15. Acceptance Criteria
- Área simple y apilada con polígono relleno en todos los backends; opacidad correcta;
  fidelidad multiplataforma; §12 con capturas; suite verde.
