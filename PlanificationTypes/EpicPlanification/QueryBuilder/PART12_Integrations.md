# PART12 — Integrations (wizard, dashboard, Demo, presets)

## 1. Purpose
La integración del builder con el resto del producto: botón «Diseñar consulta
visualmente…» en el wizard SQL (`queryBuilderFactory`), el builder como diseñador de
fuentes del dashboard (`DashboardHostServices.QueryDesigner`), el flujo del Demo
(«Consultas visuales…» → builder → reporte → visor con parámetros vivos) y los
`HotelQueryPresets`.

## 2. Current State
Funcional (Fase 25). El resultado del builder alimenta `SqlDataSource`; el Demo ejecuta
la consulta (intérprete offline o servidor), las filas alimentan el asistente de
reportes y el documento queda en el visor con `@Canal` vivo (`RefreshAsync`). El
`DataSourceDefinition` conserva el SQL parametrizado generado.

## 3. Comparison against DevExpress
DevExpress integra el query builder en el wizard de fuente de datos y en el dashboard.
AegiReports tiene ambas integraciones; auditar la coherencia del ciclo completo (una
consulta editada re-genera SQL y parámetros correctamente en todos los consumidores).

## 4. Missing Features
- Editar una consulta EXISTENTE (reabrir el builder con el `QueryModel` guardado) desde
  el reporte/dashboard, no solo crear nueva.
- Persistir el `QueryModel` en la definición de fuente (hoy se conserva SQL+params; el
  modelo visual completo permite re-editar sin perder el diagrama).
- Presets como punto de partida también en el wizard (no solo en la galería del Demo).

## 5. UX Problems
- Al volver del builder, feedback claro de cuántas filas/columnas trae y del tiempo.
- Un cambio de parámetros en el visor debe re-ejecutar el MODELO (ya ocurre; verificar
  en dashboard también).

## 6. Backend Problems
- Persistir `QueryModel` en `DataSourceDefinition` (serialización) para re-edición fiel.
- Limpieza de `_currentQuery` en los flujos que no son de consulta (evitar parámetros
  fantasma en el visor) — ya implementado; formalizar con test.

## 7. Frontend Problems
- El diseñador de fuentes del dashboard debe abrir/retornar el `QueryModel` sin pérdida.

## 8. Technical Debt
- Dos representaciones de la fuente (SQL+params vs QueryModel) — decidir cuál es canónica
  para re-edición y documentarlo.

## 9. Required Improvements
1. Re-edición de consultas existentes (persistir QueryModel en la definición).
2. Presets disponibles también en el wizard.
3. Tests del ciclo completo en los 3 consumidores (wizard, dashboard, Demo).

## 10. Implementation Plan
1) Serialización de `QueryModel` en `DataSourceDefinition` + re-apertura del builder.
2) Presets en el wizard; feedback de filas/tiempo al volver.
3) Recorrido manual de los 3 circuitos completos, incluyendo parámetros vivos.

## 11. Automated Test Plan
- Ciclo: builder → SqlGenerationResult → DataSourceDefinition → re-abrir builder produce
  el mismo QueryModel; parámetros vivos re-ejecutan el modelo; `_currentQuery` se limpia
  fuera del flujo de consulta.

## 12. Manual Validation Checklist
- [ ] Demo «Consultas visuales…»: preset → builder → aceptar → reporte en preview
- [ ] Abrir en visor: cambiar @Canal → recomposición con filas nuevas
- [ ] Wizard SQL: «Diseñar consulta visualmente…» → SQL y params vuelcan a la config
- [ ] Dashboard: diseñar la fuente con el builder → widget usa la consulta
- [ ] Re-editar una consulta existente conserva el diagrama (tablas/joins/filtros)
- [ ] Cambiar a otra muestra limpia parámetros fantasma en el visor
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`QueryBuilder/Integration.md` (wizard/dashboard/host + persistencia de QueryModel),
`QueryBuilder/Examples.md` (integrar el builder en un host propio).

## 14. User Documentation to produce
«De la consulta al reporte» (tutorial extremo a extremo), «Reeditar una consulta».

## 15. Acceptance Criteria
- Re-edición fiel de consultas; los 3 circuitos validados con parámetros vivos; sin
  parámetros fantasma; checklist §12 con capturas; suite verde.
