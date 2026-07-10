# PART07 — WizardUX (asistente de parámetro y edición)

## 1. Purpose
El asistente de parámetro (uno de los 12 wizards) y la edición de parámetros desde el
explorador del reporte: declarar tipo, prompt, valor por defecto, validaciones, lookups
y cascada, con la misma UX que los demás asistentes.

## 2. Current State
Funcional (Fase 23). El wizard de parámetro crea `ReportParameterDefinition`; el
explorador permite gestionarlos. Fase 28: WizardWindow con control theme y validación
por paso.

## 3. Comparison against DevExpress
DevExpress edita parámetros en un panel dedicado con todas sus propiedades y look-up
settings. AegiReports usa wizard + explorador; auditar la edición completa (todas las
propiedades, lookups dinámicos, cascada) y la previsualización del control resultante.

## 4. Missing Features
- Edición completa de un parámetro existente (no solo crear): todas las propiedades,
  lookups, cascada.
- Previsualizar el editor que verá el usuario en el visor (según el tipo).
- Reordenar parámetros y agruparlos (orden en el panel del visor).

## 5. UX Problems
- Validación específica por paso (qué falta); prompts amigables sugeridos por nombre.
- Editor de lookup (pares valor/etiqueta) cómodo; importar desde una columna.

## 6. Backend Problems
- El wizard produce un `ReportParameterDefinition` válido; edición no rompe referencias
  en expresiones/filtros que usan `[Param.X]`.

## 7. Frontend Problems
- Focus inicial; scroll con muchos campos; consistencia con los otros wizards.

## 8. Technical Debt
- Reusar editores/patrón del wizard general (Designer PART12) — coordinar.

## 9. Required Improvements
1. Edición completa + preview del editor resultante.
2. Reordenar/agrupar parámetros; validación específica por paso.
3. Editor de lookup con importar desde columna.

## 10. Implementation Plan
1) Modelo: edición completa, orden/grupo + tests.
2) Wizard/explorador: preview del editor, editor de lookup, reordenar.
3) Recorrido manual: crear y editar parámetros de cada tipo.

## 11. Automated Test Plan
- Wizard crea/edita cada tipo; validación por paso; reordenar; renombrar un parámetro
  actualiza/avisa las referencias `[Param.X]`.

## 12. Manual Validation Checklist
- [ ] Crear parámetro de cada tipo con validaciones y lookups
- [ ] Editar un parámetro existente (todas las propiedades)
- [ ] Preview del editor que verá el usuario según el tipo
- [ ] Reordenar/agrupar parámetros → refleja en el panel del visor
- [ ] Renombrar un parámetro usado en una expresión → actualiza/avisa
- [ ] Cancelar no deja efectos; undo tras aplicar
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Solo teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Parameters/Architecture.md` (wizard/edición), remite a Designer PART12.

## 14. User Documentation to produce
«Crear y editar parámetros» (asistente, explorador, lookups).

## 15. Acceptance Criteria
- Edición completa + preview + reordenar; validación por paso; referencias `[Param.X]`
  coherentes; checklist §12 con capturas; suite verde.
