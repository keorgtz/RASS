# PART06 — ContainersTabs (contenedores y pestañas)

## 1. Purpose
Los widgets contenedores: container (agrupa widgets), tabs (compone SOLO la pestaña
activa), stack panel y grid anidado — con su composición a `ReportDocument` (una banda
con hijos) y sus hit-áreas (encabezados de tabs en el mapa de interacción).

## 2. Current State
Funcional (Fase 26). Container/tabs/stack/grid anidado; tabs compone solo la activa; las
hit-áreas de encabezados de tabs entran al mapa de interacción.

## 3. Comparison against DevExpress
DevExpress ofrece grupos y tabs de items. AegiReports cubre container/tabs/stack/grid;
auditar el anidamiento profundo, el redimensionado dentro de contenedores y la edición
de tabs (agregar/renombrar/reordenar pestañas) desde el diseñador.

## 4. Missing Features
- Edición de tabs desde el diseñador: agregar/renombrar/reordenar/eliminar pestañas.
- Arrastrar widgets DENTRO de un contenedor (no solo colocarlos al crear).
- Layout interno del stack/grid configurable (dirección, gaps).

## 5. UX Problems
- Distinguir visualmente el contenedor activo y sus límites al editar su contenido.
- Anidamiento profundo debe seguir siendo legible (indentación/breadcrumb del contenedor).

## 6. Backend Problems
- Composición: confirmar que tabs compone solo la activa y que el anidamiento produce
  bandas/controles correctos y deterministas.

## 7. Frontend Problems
- Arrastre de widgets entre contenedor y lienzo raíz (reparent) con feedback.

## 8. Technical Debt
- Ninguna crítica.

## 9. Required Improvements
1. Edición completa de tabs + arrastre de widgets dentro/entre contenedores.
2. Layout interno del stack/grid configurable.
3. Feedback de contenedor activo y anidamiento.

## 10. Implementation Plan
1) Modelo: operaciones de tabs y reparent de widget a contenedor + tests de composición.
2) WPF: edición de tabs, arrastre interno, indicadores de anidamiento.
3) Recorrido manual con un dashboard de tabs y un stack anidado.

## 11. Automated Test Plan
- Tabs compone solo la activa; agregar/reordenar/eliminar pestañas; reparent de widget;
  anidamiento profundo compone a bandas/controles correctos.

## 12. Manual Validation Checklist
- [ ] Crear tabs; agregar/renombrar/reordenar/eliminar pestañas
- [ ] Solo la pestaña activa se compone en preview
- [ ] Arrastrar un widget dentro de un contenedor y sacarlo al lienzo raíz
- [ ] Stack/grid con dirección y gaps configurables
- [ ] Anidamiento profundo legible (breadcrumb/indentación)
- [ ] Undo/redo de operaciones de contenedor
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Dashboard/Architecture.md` (contenedores, composición de tabs).

## 14. User Documentation to produce
«Contenedores y pestañas» (agrupar widgets, organizar en tabs).

## 15. Acceptance Criteria
- Edición de tabs y reparent operativos; tabs compone solo la activa; anidamiento
  determinista; checklist §12 con capturas; suite verde.
