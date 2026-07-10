# PART04 — DataSources (fuentes de datos del dashboard)

## 1. Purpose
El explorador de datos del dashboard: `DashboardDataSource` (embebe un `QueryModel` del
query builder o filas estáticas), el `DashboardDataEngine` (sobre `IQueryExecutor` con
parámetros globales), el `WidgetDataShaper` (categorías en orden de aparición + 5
agregados) y el diseño de fuentes con el `QueryBuilderWindow` incrustado.

## 2. Current State
Funcional (Fase 26). Fuente = QueryModel o filas estáticas; `QueryDesigner` del host
abre el query builder; el data engine ejecuta con parámetros globales. El binding de
widget a campos (categoría/valor/serie) se define en los editores (PART05).

## 3. Comparison against DevExpress
DevExpress: múltiples fuentes por dashboard, con Data Source Wizard y binding
drag-and-drop de campos a «argumentos/valores/series». AegiReports: fuentes con
QueryModel y binding por editor; auditar múltiples fuentes, el explorador de campos por
fuente y el binding drag-and-drop.

## 4. Missing Features
- Explorador de campos por fuente (lista de columnas arrastrables a los slots del widget).
- Binding drag-and-drop de campo → slot (categoría/valor/serie) además del editor.
- Renombrar/eliminar fuentes; ver qué widgets usan cada fuente (dependencias).
- Vista previa de datos de la fuente (primeras N filas) desde el explorador.

## 5. UX Problems
- Al cambiar/eliminar una fuente usada por widgets → aviso de impacto.
- Estado sin fuentes con call-to-action («Diseñar consulta…»).

## 6. Backend Problems
- `DashboardDataEngine`: los parámetros globales y los 6 filtros producen el snapshot;
  confirmar cancelación y que solo el último snapshot publica (como el preview).

## 7. Frontend Problems
- El query builder incrustado debe retornar el `QueryModel` sin pérdida (liga
  QueryBuilder PART12).

## 8. Technical Debt
- La semántica de lookup entre strings es case-SENSITIVE (como el intérprete) — coherente
  con QueryBuilder PART10; documentar la implicación en filtros del dashboard.

## 9. Required Improvements
1. Explorador de campos por fuente + binding drag-and-drop + vista previa de datos.
2. Múltiples fuentes con renombrar/eliminar y dependencias visibles.
3. Avisos de impacto al modificar fuentes.

## 10. Implementation Plan
1) Modelo: explorador de campos desde el esquema de la fuente; dependencias widget↔fuente.
2) WPF: drag-and-drop a slots, vista previa, gestión de fuentes.
3) Recorrido manual: diseñar fuente con el builder, bindear un chart y una tabla.

## 11. Automated Test Plan
- DataEngine: parámetros globales + filtros producen el snapshot esperado; cancelación;
  shaper (orden de categorías + 5 agregados); dependencias widget↔fuente.

## 12. Manual Validation Checklist
- [ ] Diseñar una fuente con el query builder incrustado (QueryModel sin pérdida)
- [ ] Explorador de campos lista columnas; vista previa de datos
- [ ] Arrastrar campo a categoría/valor/serie de un widget
- [ ] Múltiples fuentes; renombrar/eliminar con aviso de impacto
- [ ] Filas estáticas como fuente alternativa
- [ ] Cambiar un parámetro global recompone los widgets afectados
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Dashboard/Architecture.md` (fuentes, data engine, shaper), `Dashboard/Integration.md`
(QueryDesigner del host).

## 14. User Documentation to produce
«Conectar datos al dashboard» (fuentes, campos, binding).

## 15. Acceptance Criteria
- Múltiples fuentes con explorador de campos y binding drag-and-drop; dependencias y
  avisos de impacto; snapshot cancelable; checklist §12 con capturas; suite verde.
