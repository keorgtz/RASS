# PART02 — TotalsSubtotals (totales, subtotales y orden)

## 1. Purpose
Cerrar la semántica de totales/subtotales y el **orden de encabezados**: hoy los totales se
calculan siempre como **suma** de celdas y las claves se ordenan como **cadena ordinal**. Son
dos brechas de corrección que afectan cualquier crosstab con Average/Min/Max o con columnas
numéricas/de fecha (meses).

## 2. Current State
`CrosstabResult` expone `RowTotals`, `ColumnTotals` y `GrandTotal`, calculados en el engine
como `total += value` sobre las celdas resueltas. **Problema:** con `Average`/`Min`/`Max`,
sumar las celdas produce un «total» sin sentido (suma de promedios, etc.). El orden de
`RowKeys`/`ColumnKeys` es `SortedSet<string>(Ordinal)`: **meses, números y fechas se ordenan
alfabéticamente** («10» < «2», «abril» < «enero»).

## 3. Comparison against DevExpress
DevExpress calcula el total **con el mismo agregado** que la celda (media de medias vía
recomputación, no suma) y ordena encabezados por valor natural (numérico/fecha) o por un
orden explícito. AegiReports: **total siempre suma** y **orden solo string ordinal** — dos
gaps de corrección.

## 4. Missing Features
- Totales/subtotales calculados **con el agregado de la definición** (recomputar sobre los
  registros del eje, no sumar celdas) — al menos correcto para Sum/Count; Average/Min/Max
  recomputados.
- Orden de encabezados **natural** (numérico/fecha) y **orden explícito** (por clave o por
  total, asc/desc).
- Subtotales multinivel cuando haya campos anidados (depende de PART01).

## 5. UX Problems
- Un crosstab de ingresos por mes muestra las columnas en orden alfabético — confuso.
- Un total de promedios engaña al lector.

## 6. Backend Problems
- Recomputar totales con el agregado exige conservar acumuladores por eje (no solo por
  celda) o recomputar desde los registros — decisión de diseño.
- Orden natural requiere conocer el tipo de la clave (numérico/fecha) antes de convertir a
  string, o mantener la clave tipada.

## 7. Frontend Problems
N/A (el builder refleja el resultado; PART03).

## 8. Technical Debt
- **Totales como suma** y **orden ordinal string** son simplificaciones estructurales del
  engine; corregirlas toca `CrosstabResult` y el builder.

## 9. Required Improvements
1. Totales/subtotales con el agregado correcto (recomputados).
2. Orden natural de encabezados + orden explícito (clave/total, asc/desc).
3. Subtotales multinivel si entra multi-campo (PART01).

## 10. Implementation Plan
1) Conservar acumuladores por fila/columna para resolver totales con el agregado.
2) Mantener claves tipadas para orden natural; opción de orden explícito.
3) Recorrido manual con meses y con Average.

## 11. Automated Test Plan
- Total con Average = promedio del eje (no suma de promedios); Min/Max correctos.
- Orden natural: meses y números ordenados correctamente; orden explícito respetado.
- Gran total coherente con el agregado.

## 12. Manual Validation Checklist
- [ ] Crosstab por mes muestra columnas en orden cronológico
- [ ] Total de un crosstab de promedios es el promedio correcto
- [ ] Orden explícito (por total desc) funciona
- [ ] Subtotales por nivel correctos (si multi-campo)

## 13. Technical Documentation to produce
`Crosstabs/Architecture.md` (totales por agregado, orden) — PART09.

## 14. User Documentation to produce
Tema «Totales, subtotales y orden en tablas cruzadas» — PART10.

## 15. Acceptance Criteria
- Totales calculados con el agregado; orden natural y explícito; §12 con capturas; suite
  verde.
