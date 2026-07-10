# PART08 — WizardEditor (asistente de gráfica y editor del dashboard)

## 1. Purpose
Cerrar la creación y edición de gráficas: el **asistente de inserción** en el estudio de
reportes (`InsertWizardModels`/`StudioWizards`) y el **editor de widget de gráfica** del
dashboard (`DashboardEditors`, `ChartDashboardWidget`), con selección de tipo, datos, paleta
y opciones, y acabado MeridianUI.

## 2. Current State
Existen ambos puntos: el asistente de inserción de gráfica en el estudio y el editor del
widget chart del dashboard (que ya enlaza datos vía `ShapedSeries`). Falta auditar que ambos
cubran: elegir tipo (incluidos los nuevos Pie/Área), campos de categoría/valor/serie,
agregación, paleta/tema y opciones (leyenda, etiquetas de datos), con vista previa en vivo.

## 3. Comparison against DevExpress
El Chart Wizard de DevExpress arma la gráfica con tipo, datos y apariencia en pasos, con
preview. Meta de paridad: crear una gráfica ligada a datos, estilizada, sin tocar el modelo.

## 4. Missing Features
- Selección de los tipos nuevos (Pie/Donut/Área) en asistente y editor.
- Campos de categoría/valor/serie + agregación en el asistente de **reporte** (depende del
  binding de PART01).
- Opciones de leyenda/etiquetas de datos/paleta desde el editor; vista previa en vivo.

## 5. UX Problems
- Asegurar navegación por teclado, validación por paso y MeridianUI (motion ≤ 200 ms,
  sin escala en hover).

## 6. Backend Problems
- El asistente de reporte debe emitir un `ChartControl` con el binding decidido en PART01
  (una sola ruta de construcción; sin modelo paralelo).
- El editor del dashboard ya usa el shaping; alinear opciones con el modelo.

## 7. Frontend Problems
- Vista previa embebida usa el pipeline real (cero motor nuevo); pulido visual de pasos.

## 8. Technical Debt
- Mantener asistente/editor sincronizados con los tipos y opciones nuevas (Pie/Área,
  etiquetas, negativos).

## 9. Required Improvements
1. Tipos nuevos y opciones (leyenda/etiquetas/paleta) en asistente y editor.
2. Campos de datos + agregación en el asistente de reporte (según PART01).
3. Vista previa en vivo; validación por paso; navegación por teclado.

## 10. Implementation Plan
1) Auditar asistente de reporte y editor del dashboard; listar huecos.
2) Añadir tipos/opciones y (si aplica) binding de datos; vista previa.
3) Recorrido manual: crear gráfica en reporte y en dashboard, ambos tipos nuevos incluidos.

## 11. Automated Test Plan
- El asistente/editor produce un `ChartControl`/`ChartDashboardWidget` con tipo, datos y
  opciones esperados.
- Validación por paso rechaza configuración incompleta.

## 12. Manual Validation Checklist
- [ ] Crear gráfica de columnas y de pie desde el asistente del reporte
- [ ] Editar widget chart del dashboard: tipo, campos, paleta, leyenda, etiquetas
- [ ] Vista previa refleja el resultado real
- [ ] Navegación por teclado y validación por paso; tema claro/oscuro, alto DPI

## 13. Technical Documentation to produce
`Charts/Architecture.md` (asistente/editor → modelo) — PART11.

## 14. User Documentation to produce
Tutoriales «Crea una gráfica en el reporte» y «Configura el widget de gráfica» — PART12.

## 15. Acceptance Criteria
- Asistente y editor completos (tipos nuevos, datos, opciones, preview) con acabado
  MeridianUI en WPF y web; §12 completo; suite verde.
