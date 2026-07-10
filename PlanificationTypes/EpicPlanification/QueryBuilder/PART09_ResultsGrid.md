# PART09 — ResultsGrid (ejecución y resultados)

## 1. Purpose
El panel de resultados: ejecución de la consulta (`IQueryExecutor`), grid con
paginación (`QueryExecutionOptions` PageIndex/PageSize), TOP N, cancelación y tiempos de
ejecución, tanto con el intérprete offline como con el ejecutor SQL real.

## 2. Current State
Funcional (Fase 25). Grid con TOP N/paginación/cancelación; `QueryResult` expone
columnas/filas/total/Elapsed/páginas. Fase 28: estilos Meridian en el grid.

## 3. Comparison against DevExpress
DevExpress: preview de datos con paginación y conteo. AegiReports equivalente; auditar
formato de celdas por tipo (fechas/moneda), ancho de columnas ajustable, y el manejo de
resultados grandes (virtualización del grid).

## 4. Missing Features
- Formato de celda por tipo (fecha/moneda/número) y alineación (números a la derecha).
- Anchos de columna ajustables y auto-ajuste; copiar selección/fila.
- Virtualización del grid para páginas grandes.
- Indicador de «ejecutando…» con cancelación y tiempo transcurrido.

## 5. UX Problems
- Resultado vacío con mensaje («la consulta no devolvió filas: ajuste filtros»).
- Error de ejecución (SQL real: conexión/permiso) → diálogo Meridian, sin fallo mudo.

## 6. Backend Problems
- Cancelación real que aborta la consulta en curso (token al ejecutor); solo el último
  resultado publica.

## 7. Frontend Problems
- NULL mostrado distinguible (cursiva «(nulo)»); números con formato es-MX.

## 8. Technical Debt
- El grid podría reutilizarse en el visor/dashboard; evaluar componente común.

## 9. Required Improvements
1. Formato/alineación por tipo + anchos ajustables + copiar.
2. Virtualización + indicador de ejecución con cancelación y tiempo.
3. Estados vacío/error claros.

## 10. Implementation Plan
1) Modelo: metadatos de presentación por columna (tipo/alineación/formato).
2) WPF: grid virtualizado, formato, copiar, estados, progreso cancelable.
3) Recorrido manual: ejecutar presets, cancelar una consulta lenta (simulada).

## 11. Automated Test Plan
- Paginación/TopN sobre datos conocidos; cancelación (token); solo el último resultado
  publica; formato por tipo (función pura); resultado vacío/error manejados.

## 12. Manual Validation Checklist
- [ ] Ejecutar preset → filas con formato por tipo, números a la derecha, NULL distinguible
- [ ] Paginar adelante/atrás; TOP N limita
- [ ] Ejecutar consulta lenta y cancelar → se detiene, sin cuelgue
- [ ] Ajustar anchos; copiar fila/selección
- [ ] Resultado vacío → mensaje orientador; error de conexión → diálogo Meridian
- [ ] Página grande virtualiza sin fuga
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`QueryBuilder/Architecture.md` (ejecución/resultados), `QueryBuilder/Performance.md`
(paginación, virtualización).

## 14. User Documentation to produce
«Ejecutar y ver resultados» (paginación, TOP N, cancelar).

## 15. Acceptance Criteria
- Grid con formato por tipo, virtualizado, cancelable; estados vacío/error correctos;
  checklist §12 con capturas; suite verde.
