# PART08 — Performance (rendimiento de evaluación)

## 1. Purpose
El rendimiento del motor bajo volumen: evaluación de expresiones por millar de filas,
cache del árbol de parse (parsear una vez, evaluar N veces), y el coste de los agregados
sobre grandes conjuntos.

## 2. Current State
El motor evalúa correctamente; no hay presupuestos formales ni verificación de que el
árbol de parse se reutiliza en lugar de re-parsear por fila.

## 3. Comparison against DevExpress
DevExpress compila/cachea expresiones para evaluación masiva. AegiReports debe
garantizar que una expresión de detalle se parsea UNA vez y se evalúa por fila sin
re-parseo, dentro de un presupuesto.

## 4. Missing Features
- Cache del árbol de parse por expresión (clave = texto) reutilizado en la expansión.
- Presupuesto de tiempo de evaluación por millar de filas + medición.
- Evaluación sin asignaciones excesivas (evitar boxing/strings intermedios innecesarios).

## 5. UX Problems
N/A (impacta la latencia del preview/composición).

## 6. Backend Problems
- Confirmar que la expansión no re-parsea la misma expresión por cada fila.
- Agregados sobre N filas en una pasada (no O(N²)).

## 7. Frontend Problems
N/A.

## 8. Technical Debt
- Coordina con Epic Performance (presupuestos globales); este PART es específico del
  motor de expresiones.

## 9. Required Improvements
1. Cache del árbol de parse reutilizado en la expansión.
2. Presupuesto de evaluación por millar de filas + baseline en Benchmarks.
3. Reducir asignaciones en el hot path de evaluación.

## 10. Implementation Plan
1) Motor: cache de parse; auditar el hot path de expansión (parseo por fila).
2) Benchmarks: expresiones sobre 10k/100k filas + baseline + RegressionGate.
3) Recorrido manual con reporte de muchas filas y expresiones.

## 11. Automated Test Plan
- La misma expresión se parsea una vez (contador de parse); evaluación de 100k filas
  dentro del presupuesto; agregados en una pasada; sin fuga tras evaluación masiva.

## 12. Manual Validation Checklist
- [ ] Reporte de 50k filas con expresiones de detalle compone dentro del presupuesto
- [ ] La expresión no se re-parsea por fila (verificable por instrumentación)
- [ ] Agregados sobre grandes conjuntos sin degradación cuadrática
- [ ] Memoria estable durante la evaluación masiva
- [ ] Preview del estudio responde con expresiones costosas (liga PART05 presupuesto)

## 13. Technical Documentation to produce
`Expressions/Performance.md` (cache de parse, presupuestos, hot path) — coordina Epic
Performance.

## 14. User Documentation to produce
Nota en «Buenas prácticas»: expresiones eficientes en reportes grandes.

## 15. Acceptance Criteria
- Cache de parse reutilizado; presupuesto por millar de filas cumplido; agregados en una
  pasada; sin fugas; RegressionGate activo; checklist §12 con mediciones; suite verde.
