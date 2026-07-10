# PART08 — ParametersPanel (panel de parámetros y recomposición)

## 1. Purpose
El panel de parámetros del visor: `ParameterFormModel` (9 tipos, Required/Min/Max/Regex,
lookups en cascada con auto-refresh), enlazado a `ViewerContext.RefreshAsync` para
recomponer el documento REAL con los nuevos valores (la fuente SQL/consulta se
re-ejecuta parametrizada).

## 2. Current State
Funcional (Fase 24). El Demo demuestra el ciclo hotelero: cambiar @Channel → re-ejecuta
la fuente → recompone. Cascada y auto-refresh operativos.

## 3. Comparison against DevExpress
DevExpress: panel de parámetros con editores por tipo, validación, «Submit», y
parámetros dependientes en cascada. AegiReports equivalente; auditar multi-valor,
rango de fechas, y el modo submit vs auto (recomponer al instante vs con botón).

## 4. Missing Features
- Modo «Enviar» explícito (acumular cambios y recomponer al pulsar) vs auto-refresh —
  configurable (recomponer en cada tecla es caro).
- Multi-valor y rango de fechas (coordinar con el Epic Parameters).
- Reset a valores por defecto.

## 5. UX Problems
- Editores por tipo consistentes con el property grid (no reinventar).
- Progreso de recomposición no bloqueante con estado terminal (lección Fase 28).
- Validación inline (borde ámbar + tooltip), nunca diálogos.

## 6. Backend Problems
- `RefreshAsync` debe cancelar recomposiciones anteriores (solo la última publica) —
  patrón del LivePreviewController.

## 7. Frontend Problems
- Cascada: al cambiar un padre, los hijos se recargan mostrando estado de carga.

## 8. Technical Debt
- Compartir editores con PART07 del Designer (property grid) para no duplicar.

## 9. Required Improvements
1. Modo submit/auto configurable + reset a defaults.
2. Multi-valor y rango de fechas (con el Epic Parameters).
3. Recomposición cancelable con estado terminal; validación inline.

## 10. Implementation Plan
1) Modelo: modo submit, reset, multi-valor (coordinar Parameters) + tests de cascada.
2) WPF: editores compartidos, progreso terminal, validación inline.
3) Recorrido manual con el escenario hotelero (@Channel) y con consulta parametrizada.

## 11. Automated Test Plan
- Cascada (padre→hijos recargan), validaciones por tipo, submit acumula vs auto;
  RefreshAsync: solo la última recomposición publica.

## 12. Manual Validation Checklist
- [ ] Cambiar @Channel → documento recompone con las filas nuevas
- [ ] Cascada: cambiar padre recarga hijos con estado de carga
- [ ] Modo submit acumula; modo auto recompone al instante
- [ ] Validación inline (requerido/rango/regex) sin diálogos
- [ ] Reset a defaults
- [ ] Recomposición larga: UI responde, estado terminal siempre
- [ ] Multi-valor / rango de fechas (si en alcance)
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Previewer/Architecture.md` (parámetros, RefreshAsync), `Previewer/Integration.md`
(ViewerContext.RefreshAsync para hosts).

## 14. User Documentation to produce
«Parámetros del reporte» (cambiar valores, cascada, enviar).

## 15. Acceptance Criteria
- Recomposición real, cancelable y con estado terminal; cascada y validación correctas;
  modo submit/auto; checklist §12 con capturas; suite verde.
