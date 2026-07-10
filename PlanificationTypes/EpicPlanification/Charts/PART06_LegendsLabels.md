# PART06 — LegendsLabels (leyenda y etiquetas de datos)

## 1. Purpose
Cerrar la leyenda y las **etiquetas de datos**: posición y envoltura de la leyenda,
etiquetas de valor/porcentaje por punto, y resolución de **colisiones** de etiquetas para un
acabado comercial.

## 2. Current State
`ComposeLegend` dibuja swatch + nombre por serie en **una sola fila arriba**, acumulando en X
**sin envoltura** (puede desbordar el ancho de la gráfica). **No hay etiquetas de datos** por
punto (ni valor ni porcentaje). La leyenda tiene posición fija (arriba) y fuente fija 7 pt.

## 3. Comparison against DevExpress
DevExpress ubica la leyenda en cualquier borde, la envuelve, y muestra etiquetas de datos con
plantilla (valor, argumento, %). AegiReports: **leyenda de una fila sin wrap y sin etiquetas
de datos** — por debajo del mínimo comercial.

## 4. Missing Features
- Posición de leyenda configurable (arriba/abajo/izquierda/derecha) y **envoltura** a varias
  filas/columnas.
- **Etiquetas de datos** por punto: valor y/o porcentaje, con formato (coordina con PART05).
- Resolución de colisiones (desplazamiento/ocultar etiquetas que se solapan).

## 5. UX Problems
- Con muchas series, la leyenda de una fila se corta.
- Sin etiquetas de datos el usuario debe estimar valores contra el eje.

## 6. Backend Problems
- Envoltura de leyenda requiere layout multifila con medición acumulada por fila.
- Etiquetas de datos requieren medir y posicionar sobre/junto a cada fragmento de serie,
  con detección de solapamiento.

## 7. Frontend Problems
- Fidelidad de posición de etiquetas entre visor y exportadores.

## 8. Technical Debt
- La resolución de colisiones es un algoritmo no trivial; decisión 1.0 (mínimo: ocultar
  etiquetas que no caben; ideal: desplazamiento).

## 9. Required Improvements
1. Leyenda posicionable y con envoltura.
2. Etiquetas de datos (valor/%) con formato es-MX.
3. Resolución de colisiones mínima (ocultar/《desplazar》 solapadas).

## 10. Implementation Plan
1) Layout de leyenda multifila + posición configurable.
2) Etiquetas de datos por punto con formato; para pie/donut, porcentaje (coordina PART03).
3) Detección de colisión y política; recorrido manual.

## 11. Automated Test Plan
- Leyenda con N series envuelve a varias filas sin desbordar.
- Etiquetas de datos con formato correcto por punto; porcentaje en pie suma 100%.
- Etiquetas solapadas se ocultan/desplazan de forma determinista.

## 12. Manual Validation Checklist
- [ ] Leyenda en cada posición (arriba/abajo/izq/der) y envuelta con muchas series
- [ ] Etiquetas de datos legibles con formato es-MX
- [ ] Porcentajes en pie/donut correctos
- [ ] Etiquetas no se solapan (o se ocultan las que no caben)
- [ ] Fidelidad en PDF/imagen/web

## 13. Technical Documentation to produce
`Charts/Architecture.md` (leyenda, etiquetas de datos, colisiones) — PART11.

## 14. User Documentation to produce
Tema «Leyendas y etiquetas de datos» — PART12.

## 15. Acceptance Criteria
- Leyenda posicionable/envuelta; etiquetas de datos con formato; colisiones resueltas;
  §12 con capturas; suite verde.
