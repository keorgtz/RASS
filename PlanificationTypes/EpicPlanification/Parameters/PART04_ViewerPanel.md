# PART04 — ViewerPanel (panel de parámetros del visor)

## 1. Purpose
El panel de parámetros del visor: `ParameterFormModel` con editores por tipo,
validación, cascada con auto-refresh y el enlace a `ViewerContext.RefreshAsync` que
recompone el documento REAL con los nuevos valores.

## 2. Current State
Funcional (Fase 24). Editores por tipo, cascada, auto-refresh → recomposición real (el
Demo demuestra @Channel). Este PART es la vista de visor del modelo de PART01 (comparte
alcance con Previewer PART08 — este lidera el modelo, aquél valida la integración).

## 3. Comparison against DevExpress
DevExpress: panel de parámetros con «Submit», editores por tipo y cascada. AegiReports
tiene auto-refresh; auditar el modo SUBMIT (acumular y recomponer al pulsar) vs auto, el
reset a defaults y la consistencia de editores con el property grid.

## 4. Missing Features
- Modo «Enviar» explícito (acumular cambios, recomponer al pulsar) vs auto-refresh,
  configurable — recomponer en cada tecla es caro.
- Reset a valores por defecto.
- Editores por tipo compartidos con el property grid (no reinventar).

## 5. UX Problems
- Progreso de recomposición no bloqueante con estado terminal (lección Fase 28).
- Validación inline (borde ámbar + tooltip), nunca diálogos.

## 6. Backend Problems
- `RefreshAsync` cancela recomposiciones anteriores (solo la última publica) — patrón
  del LivePreviewController.

## 7. Frontend Problems
- Cascada: al cambiar el padre, los hijos recargan mostrando estado.

## 8. Technical Debt
- Compartir editores con Designer PART07 (property grid) — coordinar.

## 9. Required Improvements
1. Modo submit/auto configurable + reset a defaults.
2. Editores compartidos + validación inline.
3. Recomposición cancelable con estado terminal.

## 10. Implementation Plan
1) Modelo: modo submit, reset + tests de cascada/validación.
2) WPF: editores compartidos, progreso terminal, validación inline.
3) Recorrido manual con @Channel (SQL) y con consulta parametrizada.

## 11. Automated Test Plan
- Cascada; validaciones por tipo; submit acumula vs auto; RefreshAsync solo la última
  publica; reset a defaults.

## 12. Manual Validation Checklist
- [ ] Cambiar @Channel → recomposición con filas nuevas
- [ ] Modo submit acumula; modo auto recompone al instante
- [ ] Cascada: cambiar padre recarga hijos con estado
- [ ] Validación inline (requerido/rango/regex) sin diálogos
- [ ] Reset a defaults
- [ ] Recomposición larga: UI responde, estado terminal
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Parameters/Architecture.md` (panel del visor), remite a `Previewer/PART08`.

## 14. User Documentation to produce
«Parámetros del reporte» (cambiar valores, cascada, enviar).

## 15. Acceptance Criteria
- Recomposición real, cancelable, con estado terminal; submit/auto + reset; cascada y
  validación correctas; checklist §12 con capturas; suite verde.
