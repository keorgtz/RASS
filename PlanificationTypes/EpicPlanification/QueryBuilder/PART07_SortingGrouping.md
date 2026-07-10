# PART07 — SortingGrouping (orden, agrupación y TopN)

## 1. Purpose
El orden multi-columna (`SortingModel`, asc/desc), la agrupación GROUP BY
(`GroupingModel`) con su relación con los agregados, y el límite `TopN`.

## 2. Current State
Funcional (Fase 25). Orden multi-clave, GROUP BY con agregados, TopN. El validador
detecta columna fuera de GROUP BY (AEGIQB).

## 3. Comparison against DevExpress
DevExpress: orden por múltiples columnas con prioridad, agrupación y TOP. AegiReports
equivalente; auditar la UI de prioridad de orden (reordenar), la guía de qué columnas
requieren agregado al agrupar y TOP con/sin empates (WITH TIES).

## 4. Missing Features
- Reordenar la prioridad de las columnas de orden (arrastre).
- Al agrupar, guiar: columnas no agrupadas deben tener agregado (asistencia, no solo
  error).
- TOP N con empates (WITH TIES) — evaluar alcance 1.0.

## 5. UX Problems
- Distinguir columnas de agrupación de las de orden; evitar configuraciones inválidas
  con avisos tempranos en vez de solo error de validación.

## 6. Backend Problems
- Coherencia GROUP BY ↔ agregados ↔ ORDER BY (orden por alias de salida o por origen);
  el intérprete y el SQL deben coincidir (Epic PART10 equivalencia).

## 7. Frontend Problems
- Selector de asc/desc claro; TopN con spinner validado (≥1).

## 8. Technical Debt
- Ninguna crítica.

## 9. Required Improvements
1. Reordenar prioridad de orden; guía de agregado al agrupar.
2. TOP N validado; evaluar WITH TIES.
3. Avisos tempranos de configuración inválida.

## 10. Implementation Plan
1) Modelo: prioridad de orden explícita; asistencia de agregado; TopN límites.
2) WPF: reordenar, selectores, avisos.
3) Recorrido manual con Ingresos (GROUP BY + SUM/COUNT + orden).

## 11. Automated Test Plan
- Orden multi-clave asc/desc; GROUP BY con agregados; columna sin agregar detectada;
  TopN; equivalencia intérprete↔SQL en orden/grupo (liga PART10).

## 12. Manual Validation Checklist
- [ ] Ordenar por 2+ columnas con prioridad reordenable (asc/desc)
- [ ] Agrupar por una columna; las no agrupadas piden agregado (guía)
- [ ] TopN limita resultados; empates si WITH TIES en alcance
- [ ] Configuración inválida avisa temprano
- [ ] SQL y resultados coinciden en orden/grupo
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`QueryBuilder/Architecture.md` (orden/grupo/TopN).

## 14. User Documentation to produce
«Ordenar y agrupar resultados».

## 15. Acceptance Criteria
- Orden reordenable, agrupación guiada, TopN validado; equivalencia SQL↔intérprete;
  checklist §12 con capturas; suite verde.
