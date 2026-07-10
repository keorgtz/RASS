# PART03 — Aggregates (agregados y alcances)

## 1. Purpose
Los agregados de expresión (Sum/Count/Avg/Min/Max, etc.) y sus ALCANCES: banda de
detalle, grupo (por nivel) y reporte completo, incluida su anidación y el uso en
sumarios (`Sum([Records.Total])`) y encabezados/pies de grupo.

## 2. Current State
Funcional. Los sumarios de grupo/reporte funcionan en tablas y bandas (usados por los
escenarios hoteleros: subtotales por grupo, totales de reporte). El alcance se resuelve
por el contexto de banda.

## 3. Comparison against DevExpress
DevExpress: `sumSum`, `sumCount`, `sumAvg` con alcance (Group/Report) y summary
running. AegiReports cubre agregados por alcance; auditar el summary running
(acumulado), el conteo distinto (DistinctCount) y el porcentaje sobre el total.

## 4. Missing Features
- Summary running (acumulado de detalle) y running por grupo.
- DistinctCount / porcentaje sobre total del grupo/reporte.
- Agregados condicionales (Sum de filas que cumplen una condición).

## 5. UX Problems
- En el editor/wizard, elegir el ALCANCE del agregado (grupo N / reporte) con claridad.

## 6. Backend Problems
- Determinismo del cálculo por alcance; anidación de agregados; agregados sobre
  colecciones de detalle (`[Records.X]`).

## 7. Frontend Problems
N/A (se refleja en wizard de campo calculado/sumario).

## 8. Technical Debt
- Alinear la nomenclatura de agregados entre el motor de expresiones y el query builder
  (AggregateKind) — documentar el mapeo.

## 9. Required Improvements
1. Summary running + DistinctCount + porcentaje sobre total.
2. Agregados condicionales.
3. Selección de alcance clara en el editor/wizard.

## 10. Implementation Plan
1) Motor: running/distinct/porcentaje/condicional + tests por alcance.
2) Wizard/editor: selección de alcance y tipo de agregado.
3) Recorrido manual con reporte agrupado hotelero (subtotales, running, porcentaje).

## 11. Automated Test Plan
- Sum/Count/Avg/Min/Max por alcance (detalle/grupo/reporte); running acumulado;
  DistinctCount; porcentaje sobre total; agregado condicional; anidación.

## 12. Manual Validation Checklist
- [ ] Subtotal por grupo y total de reporte correctos (escenario agrupado)
- [ ] Summary running (acumulado) en detalle y por grupo
- [ ] DistinctCount y porcentaje sobre el total del grupo/reporte
- [ ] Agregado condicional (Sum de filas que cumplen)
- [ ] Selección de alcance clara en el wizard/editor
- [ ] Resultado determinista

## 13. Technical Documentation to produce
`Expressions/Architecture.md` (agregados, alcances, running), mapeo con AggregateKind.

## 14. User Documentation to produce
«Totales y agregados» (subtotales, acumulados, porcentajes).

## 15. Acceptance Criteria
- Running/distinct/porcentaje/condicional por alcance operativos y deterministas;
  selección de alcance clara; checklist §12 con capturas; suite verde.
