# PART07 — Performance (datasets anchos)

## 1. Purpose
Garantizar que el crosstab escala con datasets **anchos** (muchas claves de columna) y
**altos** (muchos registros), manteniendo la pasada única del engine y una materialización de
tabla acotada en memoria y ancho.

## 2. Current State
El engine agrega en una sola pasada con `Dictionary` de acumuladores y `SortedSet` de claves;
la matriz es `decimal?[,]` densa (filas × columnas). El builder genera una columna Star por
clave de columna. **Riesgos:** con cientos de columnas pivote, la matriz densa y la tabla se
vuelven anchas (memoria + layout); sin límites declarados ni banco de medición.

## 3. Comparison against DevExpress
DevExpress limita/pagina pivotes muy anchos y advierte. AegiReports: sin política ante
explosión de cardinalidad de columnas.

## 4. Missing Features
- Presupuesto/límite de cardinalidad de columnas con diagnóstico (evitar tabla de 500
  columnas ilegible).
- Banco de rendimiento (registros × cardinalidad fila/columna) con umbrales.
- (Opcional) matriz dispersa si la densidad es baja.

## 5. UX Problems
- Un crosstab con demasiadas columnas es ilegible y desborda la página; conviene advertir o
  agrupar («otros»).

## 6. Backend Problems
- La matriz densa reserva filas × columnas aunque muchas celdas sean `null`; medir memoria en
  casos anchos.
- El orden por `SortedSet` es O(n log n) por inserción — aceptable, pero medir con volumen.

## 7. Frontend Problems
- Ancho de la tabla materializada; coordinar con la paginación horizontal de Tables (PART02).

## 8. Technical Debt
- Sin límites ni banco, una explosión de columnas pasa inadvertida hasta producción.

## 9. Required Improvements
1. Límite de cardinalidad de columnas con diagnóstico y política («otros»/advertir).
2. Banco de rendimiento con umbrales de tiempo/memoria.
3. (Opcional) representación dispersa si aplica.

## 10. Implementation Plan
1) Definir escenarios (10k–100k registros; 10/50/200 columnas) y umbrales.
2) Medir engine + builder + layout; aplicar límite/diagnóstico de columnas.
3) Recorrido manual con un dataset ancho real.

## 11. Automated Test Plan
- Engine one-pass dentro de umbral para 100k registros.
- Cardinalidad de columnas por encima del límite emite diagnóstico.
- Sin fugas al repetir construcción.

## 12. Manual Validation Checklist
- [ ] Crosstab de 100k registros construye en tiempo aceptable
- [ ] Con muchas columnas, se advierte o se agrupan en «otros»
- [ ] Memoria estable; la tabla pagina (hereda de Tables)
- [ ] Export del crosstab ancho termina en tiempo acotado

## 13. Technical Documentation to produce
`Crosstabs/Architecture.md` (rendimiento, límites de cardinalidad) — PART09.

## 14. User Documentation to produce
Nota de buenas prácticas «Tablas cruzadas anchas» — PART10.

## 15. Acceptance Criteria
- Banco con umbrales verde; límite de columnas con diagnóstico; §12 con mediciones; suite
  verde.
