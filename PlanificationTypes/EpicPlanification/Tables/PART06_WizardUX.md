# PART06 — WizardUX (asistente de tabla end-to-end)

## 1. Purpose
Cerrar el asistente de inserción de tabla del estudio (`InsertWizardModels` / `StudioWizards`):
elegir origen de datos/campos, generar columnas con encabezados, papel de fila
(Header/Body/Footer), agrupación inicial y estilo, produciendo un `TableControl` listo y
correcto en un flujo guiado con acabado comercial.

## 2. Current State
Existe soporte de inserción de tabla vía los modelos de asistente
(`InsertWizardModels.cs`, `StudioWizards.cs`). Falta auditar que el flujo cubra selección de
campos → columnas + encabezados → agrupación opcional → estilo, y que el resultado sea un
`TableControl` bien formado (columnas coherentes, filas Header/Body, expresiones `[Campo]`).

## 3. Comparison against DevExpress
El Table/Report Wizard de DevExpress arma tabla con campos, agrupación y estilo en pasos.
Meta de paridad: un usuario produce una tabla agrupada y estilizada sin tocar el modelo a
mano.

## 4. Missing Features
- Paso de agrupación inicial (elegir campo de grupo → generar bandas + subtotales).
- Vista previa en vivo dentro del asistente.
- Elección de estilo/tema de tabla (alternado) desde el asistente (coordina con PART07).

## 5. UX Problems
- Asegurar navegación por teclado, validación por paso y estados de error claros
  (MeridianUI, motion ≤ 200 ms, sin escala en hover).

## 6. Backend Problems
- El asistente debe emitir el mismo `TableControl` que la edición manual (una sola ruta de
  construcción; sin modelo paralelo).

## 7. Frontend Problems
- Pulido visual de los pasos; vista previa embebida usa el pipeline real (cero motor nuevo).

## 8. Technical Debt
- Mantener el asistente sincronizado con nuevas capacidades del modelo (RowSpan, estilos).

## 9. Required Improvements
1. Flujo completo: datos/campos → columnas+encabezados → agrupación → estilo → vista previa.
2. Validación por paso y navegación por teclado.
3. Salida = `TableControl` idéntico al de edición manual.

## 10. Implementation Plan
1) Auditar los pasos actuales del asistente y el `TableControl` resultante.
2) Añadir paso de agrupación y de estilo; vista previa en vivo.
3) Recorrido manual: crear tabla agrupada y estilizada desde cero.

## 11. Automated Test Plan
- El asistente, dados campos/opciones, produce un `TableControl` con columnas/filas/
  expresiones esperadas y (si se eligió) bandas de grupo.
- Validación por paso rechaza configuraciones incompletas.

## 12. Manual Validation Checklist
- [ ] Crear tabla desde el asistente eligiendo campos genera columnas + encabezados
- [ ] Paso de agrupación produce bandas y subtotales
- [ ] Vista previa refleja el resultado real
- [ ] Navegación por teclado y validación por paso
- [ ] Tema claro/oscuro, alto DPI; el resultado abre en el visor

## 13. Technical Documentation to produce
`Tables/Architecture.md` (asistente → modelo) — PART11.

## 14. User Documentation to produce
Tutorial «Crea una tabla con el asistente» — PART12.

## 15. Acceptance Criteria
- Asistente completo (campos→columnas→agrupación→estilo→preview) con salida correcta y
  acabado MeridianUI; §12 completo; suite verde.
