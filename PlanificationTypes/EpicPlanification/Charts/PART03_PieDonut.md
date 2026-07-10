# PART03 — PieDonut (nuevo tipo: pastel y dona)

## 1. Purpose
Añadir los tipos **pastel (pie)** y **dona (donut)** al `ChartControl`: gap G aceptado en
FINAL_PRODUCT_GAPS, de los de mayor demanda comercial tras columnas/líneas. Requiere emitir
**fragmentos de arco** en el pipeline de layout.

## 2. Current State
No existen: `ChartKind` solo tiene Column/Bar/Line; el comentario del enum declara «Pie y
áreas son fase futura (requieren fragmentos de arco)». El pipeline emite rectángulos, líneas
y texto, pero **no un fragmento de arco/sector**. Este PART introduce el tipo y su primitiva
de dibujo.

## 3. Comparison against DevExpress
DevExpress ofrece pie/donut con etiquetas de porcentaje y explosión de sectores. Meta 1.0:
pie y donut legibles con leyenda y etiquetas de porcentaje; explosión de sectores es opcional.

## 4. Missing Features
- **Fragmento de arco/sector** (ángulo inicial/barrido, radios interno/externo) en el
  vocabulario de layout, con renderizado en TODOS los backends (WPF/Skia/PDF/HTML).
- `ChartKind.Pie` y `ChartKind.Donut` (radio interno > 0).
- Etiquetas de porcentaje y/o valor por sector; leyenda por categoría (no por serie).
- Semántica de datos: pie usa **una serie** (categorías = sectores) — validar/convertir.

## 5. UX Problems
- Un pie con muchas categorías pequeñas es ilegible: política de «otros» / mínimo de sector
  (decisión 1.0).

## 6. Backend Problems
- El fragmento de arco debe renderizarse en cada backend: WPF (`PathGeometry`), Skia
  (`AddArc`), PDF (curvas Bézier que aproximan el arco), HTML/SVG (`<path>`).
- Determinismo: ángulos calculados en aritmética exacta; orden estable de sectores.

## 7. Frontend Problems
- El visor y el editor deben renderizar el arco idénticamente (fidelidad multiplataforma).

## 8. Technical Debt
- Introducir una primitiva de dibujo nueva toca todos los renderers/exporters — es el mayor
  esfuerzo del Epic; planear y probar por backend.

## 9. Required Improvements
1. Fragmento de arco/sector en el layout + soporte en todos los renderers.
2. `ChartKind.Pie`/`Donut` con etiquetas de porcentaje y leyenda por categoría.
3. Política de sectores pequeños («otros»).

## 10. Implementation Plan
1) Definir `ArcFragment` (centro, radios, ángulos, color) y renderizarlo por backend.
2) Componer pie/donut desde una serie: sectores proporcionales + etiquetas + leyenda.
3) Recorrido manual en visor, PDF, imagen y web; verificar fidelidad idéntica.

## 11. Automated Test Plan
- Ángulos de sector proporcionales al valor; suma = 360°; orden estable.
- Donut respeta radio interno; etiquetas de porcentaje correctas.
- Fragmento de arco renderiza en cada backend (golden por backend).

## 12. Manual Validation Checklist
- [ ] Pie y donut se ven correctos y legibles en el visor
- [ ] Etiquetas de porcentaje/valor correctas; leyenda por categoría
- [ ] Fidelidad idéntica en PDF, imagen y web
- [ ] Sectores pequeños manejados (política «otros»)
- [ ] Tema claro/oscuro; alto DPI

## 13. Technical Documentation to produce
`Charts/Architecture.md` (fragmento de arco, pie/donut) — PART11.

## 14. User Documentation to produce
Tema «Gráficas de pastel y dona» — PART12.

## 15. Acceptance Criteria
- Pie y donut implementados con fragmento de arco en todos los backends; etiquetas de
  porcentaje; fidelidad multiplataforma; §12 con capturas; suite verde.
