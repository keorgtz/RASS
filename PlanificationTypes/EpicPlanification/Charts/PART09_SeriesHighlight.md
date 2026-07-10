# PART09 — SeriesHighlight (resaltado por punto/serie)

## 1. Purpose
Resolver el resaltado (highlight) de la gráfica en el dashboard: hoy el color es **por
serie** (`Palette[serieIndex % n]`), por lo que el cross-highlight del dashboard no puede
atenuar/resaltar un **punto** individual. Decidir el cierre (highlight por punto) o el
**límite formal 1.0**.

## 2. Current State
`GetColor` asigna color por índice de serie; no hay estado de resaltado por punto ni atenuado
del resto. El dashboard puede filtrar por selección, pero **el realce visual de la categoría
seleccionada dentro de la propia gráfica es por serie, no por punto** — límite conocido del
cross-highlight (referenciado desde Dashboard PART08).

## 3. Comparison against DevExpress
DevExpress resalta el punto/segmento seleccionado y atenúa el resto. AegiReports: sin realce
por punto. Cerrar exige que cada fragmento conozca su `(serie, categoría)` (PART07) y que el
renderizado aplique color/opacidad según el estado de selección.

## 4. Missing Features
- Estado de selección/resaltado por punto en el modelo de composición.
- Atenuación (opacidad reducida) de puntos no seleccionados; realce del seleccionado.
- Propagación del estado desde la interacción del dashboard al layout de la gráfica.

## 5. UX Problems
- Al filtrar por una categoría, la gráfica no comunica visualmente cuál está activa (solo
  cambian otros widgets) — sensación inconsistente.

## 6. Backend Problems
- Requiere hit-áreas por punto (PART07) y un canal para pasar el conjunto seleccionado al
  `ChartLayoutHandler` (o un post-proceso de fragmentos que ajuste color/opacidad).
- Mantener determinismo: mismo estado de selección → misma salida.

## 7. Frontend Problems
- El dashboard debe re-renderizar la gráfica con el estado de resaltado al seleccionar.

## 8. Technical Debt
- **Highlight por serie** es un límite estructural heredado; su cierre depende de PART07
  (hit-áreas) y toca el canal de interacción del dashboard.

## 9. Required Improvements
1. Estado de resaltado por punto en la composición.
2. Atenuación/realce por color-opacidad según selección.
3. Propagación desde la interacción del dashboard; o **límite 1.0 documentado** si se acota.

## 10. Implementation Plan
1) Decidir alcance 1.0 (highlight por punto vs límite formal).
2) Si se cierra: usar hit-áreas de PART07 + estado de selección → color/opacidad por punto.
3) Recorrido de cross-highlight en el dashboard; si se acota, documentar en `Limitations.md`.

## 11. Automated Test Plan
- Con un punto seleccionado, ese fragmento conserva color y el resto se atenúa (determinista).
- Sin selección, salida idéntica a la actual (sin regresión).

## 12. Manual Validation Checklist
- [ ] Seleccionar una categoría en el dashboard resalta ese punto/columna
- [ ] El resto de puntos se atenúa de forma legible
- [ ] Coherencia con el resto de widgets del cross-filter
- [ ] (Si se acota) el límite está documentado y es consistente

## 13. Technical Documentation to produce
`Charts/Architecture.md` y `Limitations.md` (highlight por punto o límite) — PART11.

## 14. User Documentation to produce
Nota en «Interacción del dashboard con gráficas» — PART12.

## 15. Acceptance Criteria
- Highlight por punto implementado o límite 1.0 documentado explícitamente; sin regresión sin
  selección; §12 con capturas; suite verde.
