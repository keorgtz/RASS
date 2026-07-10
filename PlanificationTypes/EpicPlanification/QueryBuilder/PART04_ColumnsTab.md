# PART04 — ColumnsTab (columnas de salida, alias y calculadas)

## 1. Purpose
La pestaña de columnas: selección de columnas de salida, alias, agregados
(`AggregateKind`), columnas calculadas aritméticas con `ComputedExpressionGuard`
(whitelist léxica) y el orden de las columnas de salida.

## 2. Current State
Funcional (Fase 25). Alias, agregados, calculadas con guard léxico; el nombre efectivo
de salida se resuelve por `ColumnModel`.

## 3. Comparison against DevExpress
DevExpress: grid de columnas con checkbox de salida, alias, agregado (Sum/Count/…),
orden y agrupación, y expresión de columna. AegiReports cubre lo esencial; auditar la
edición de calculadas (editor + validación en vivo), reordenar columnas por arrastre y
formato de salida.

## 4. Missing Features
- Reordenar columnas de salida por arrastre.
- Editor de columna calculada con validación en vivo (guard) y ayuda de operadores.
- Formato de salida por columna (número/fecha/moneda) que viaje al reporte.
- Mostrar el tipo inferido de cada columna de salida.

## 5. UX Problems
- Distinguir columna simple, agregada y calculada visualmente.
- Alias duplicado avisado inline (el generador ya escapa; evitar colisiones de salida).

## 6. Backend Problems
- `ComputedExpressionGuard`: confirmar whitelist completa (aritmética, paréntesis,
  referencias a columnas) y rechazo de todo lo demás con mensaje.

## 7. Frontend Problems
- El editor de calculada debe reusar el patrón del editor de expresiones (autocompletado
  de columnas), no un TextBox plano.

## 8. Technical Debt
- Formato de salida cruza al pipeline de reporte (integración PART12) — coordinar.

## 9. Required Improvements
1. Reordenar por arrastre + tipo inferido visible + formato por columna.
2. Editor de calculada con autocompletado y validación en vivo del guard.
3. Aviso de alias duplicado.

## 10. Implementation Plan
1) Modelo: orden explícito de columnas; formato por columna; tipo inferido (función pura).
2) WPF: grid con arrastre, editor de calculada, avisos inline.
3) Recorrido manual con preset que use calculadas (Restaurante) y agregados (Ingresos).

## 11. Automated Test Plan
- Alias/agregados/calculadas: nombre efectivo de salida; guard acepta aritmética y
  rechaza funciones/acceso no permitido; reordenar; tipo inferido por columna.

## 12. Manual Validation Checklist
- [ ] Seleccionar columnas, poner alias, marcar agregados
- [ ] Columna calculada `[Total] * 1.16` válida; expresión no permitida rechazada inline
- [ ] Reordenar columnas por arrastre → SQL y resultados reflejan el orden
- [ ] Formato por columna viaja al reporte generado
- [ ] Alias duplicado avisado
- [ ] Tipo inferido visible por columna
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`QueryBuilder/Architecture.md` (columnas/calculadas/guard).

## 14. User Documentation to produce
«Elegir columnas y calcular valores» (alias, agregados, calculadas).

## 15. Acceptance Criteria
- Reordenar/formato/calculadas con validación en vivo; guard robusto; checklist §12 con
  capturas; suite verde.
