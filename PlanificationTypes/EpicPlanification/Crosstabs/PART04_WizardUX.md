# PART04 — WizardUX (asistente de tabla cruzada)

## 1. Purpose
Cerrar el asistente de crosstab del estudio (`InsertWizardModels`/`StudioWizards`): elegir
campo de fila, campo de columna, medida y agregado, opciones de totales y formato, con vista
previa en vivo y acabado MeridianUI, produciendo el crosstab correcto (control vivo o tabla
horneada según la decisión de PART01).

## 2. Current State
Existe soporte de inserción de crosstab vía los modelos de asistente. Falta auditar que el
flujo cubra: origen de datos → campo fila/columna → medida + agregado → totales/formato →
preview, y que valide combinaciones (p. ej. medida obligatoria salvo Count).

## 3. Comparison against DevExpress
El Cross Tab Wizard de DevExpress arma el pivot con campos y opciones en pasos, con preview.
Meta de paridad: crear un crosstab ligado a datos sin tocar el modelo.

## 4. Missing Features
- Selección de agregado y de formato/cultura desde el asistente.
- Vista previa en vivo con datos reales (pipeline real, cero motor nuevo).
- (Si multi-campo, PART01) añadir varios campos por eje.

## 5. UX Problems
- Navegación por teclado, validación por paso, estados de error claros (MeridianUI, motion
  ≤ 200 ms, sin escala en hover).

## 6. Backend Problems
- El asistente debe emitir el mismo artefacto que la construcción manual (un solo camino;
  sin modelo paralelo) — control vivo o tabla horneada según PART01.

## 7. Frontend Problems
- Pulido visual de los pasos; preview embebido fiel.

## 8. Technical Debt
- Mantener el asistente sincronizado con las capacidades del engine (multi-campo, agregados,
  formato).

## 9. Required Improvements
1. Flujo completo: datos → fila/columna → medida+agregado → totales/formato → preview.
2. Validación por paso y navegación por teclado.
3. Salida coherente con la decisión de PART01.

## 10. Implementation Plan
1) Auditar los pasos actuales y el artefacto resultante.
2) Añadir agregado/formato y preview en vivo; validación.
3) Recorrido manual: crear un crosstab hotelero desde cero.

## 11. Automated Test Plan
- El asistente, dados campos/opciones, produce el crosstab esperado (definición o tabla).
- Validación por paso rechaza configuración incompleta (medida faltante salvo Count).

## 12. Manual Validation Checklist
- [ ] Crear crosstab tipo × canal desde el asistente
- [ ] Elegir agregado (Sum/Average) y formato es-MX
- [ ] Vista previa refleja el resultado real
- [ ] Navegación por teclado y validación por paso; tema claro/oscuro, alto DPI

## 13. Technical Documentation to produce
`Crosstabs/Architecture.md` (asistente → artefacto) — PART09.

## 14. User Documentation to produce
Tutorial «Crea una tabla cruzada con el asistente» — PART10.

## 15. Acceptance Criteria
- Asistente completo (campos/agregado/formato/preview) con salida correcta y acabado
  MeridianUI; §12 completo; suite verde.
