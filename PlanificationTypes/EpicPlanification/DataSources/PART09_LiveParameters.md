# PART09 — LiveParameters (parámetros vivos y recomposición)

## 1. Purpose
La ejecución parametrizada y su recomposición: `SqlDataSource.WithParameters` (y el
equivalente por proveedor), la re-ejecución de la fuente con nuevos valores y la
paridad de comportamiento entre proveedores/ejecutores cuando el visor o el dashboard
cambian un parámetro.

## 2. Current State
Funcional (Fase 22/24). El visor re-ejecuta la fuente SQL parametrizada (`@Channel`) y
recompone; el query builder re-ejecuta el modelo. Cada fuente aplica los parámetros a su
manera.

## 3. Comparison against DevExpress
DevExpress reevalúa el reporte al cambiar parámetros con re-consulta. AegiReports
equivalente; auditar la CONSISTENCIA entre proveedores (SQL real vs intérprete vs
objetos vs JSON): un mismo parámetro debe producir el mismo subconjunto lógico.

## 4. Missing Features
- Contrato uniforme de «aplicar parámetros» por proveedor (hoy cada uno lo hace a su
  modo).
- Parámetros en JSON/Object (filtrado in-memory parametrizado) equivalente al SQL.
- Cancelación de la recomposición anterior (solo la última publica) en TODOS los
  proveedores.

## 5. UX Problems
- La recomposición debe ser cancelable y con estado terminal (lección Fase 28), igual en
  visor y dashboard.

## 6. Backend Problems
- Paridad semántica: un `@param` de fecha/lookup produce el mismo filtrado en SQL real y
  en el intérprete offline (coordina QueryBuilder PART10 equivalencia).
- Solo el último resultado publica (patrón del LivePreviewController) en cada consumidor.

## 7. Frontend Problems
N/A (se refleja en visor/dashboard).

## 8. Technical Debt
- La divergencia de casing (intérprete vs SQL) impacta aquí; documentar/normalizar.

## 9. Required Improvements
1. Contrato uniforme «WithParameters» por proveedor (incl. JSON/Object in-memory).
2. Cancelación + solo-último-publica en todos los consumidores.
3. Paridad semántica verificada; casing documentado.

## 10. Implementation Plan
1) Modelo: interfaz común de aplicación de parámetros por proveedor + tests de paridad.
2) Cancelación uniforme (token) en visor/dashboard.
3) Recorrido manual: cambiar @Channel en visor y en dashboard con SQL y con intérprete.

## 11. Automated Test Plan
- WithParameters por proveedor produce el subconjunto esperado; paridad SQL↔intérprete
  para un corpus de parámetros; cancelación (solo el último publica).

## 12. Manual Validation Checklist
- [ ] Visor: cambiar @Channel → recomposición con filas nuevas (SQL sembrado)
- [ ] Dashboard: cambiar un parámetro global → widgets recomponen
- [ ] Mismo parámetro en SQL real y en intérprete → mismo subconjunto lógico
- [ ] JSON/Object con parámetro filtra equivalentemente
- [ ] Recomposición cancelable, estado terminal; solo la última publica
- [ ] Casing de lookup documentado/esperado

## 13. Technical Documentation to produce
`DataSources/Architecture.md` (parámetros vivos, WithParameters),
`DataSources/Limitations.md` (paridad/casing).

## 14. User Documentation to produce
Se integra en «Parámetros del reporte»/«del dashboard» (qué pasa al cambiar un valor).

## 15. Acceptance Criteria
- Contrato uniforme de parámetros por proveedor; paridad semántica verificada;
  cancelación y solo-último-publica en todos; checklist §12 con capturas; suite verde.
