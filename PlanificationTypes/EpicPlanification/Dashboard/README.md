# Epic: Dashboard — backlog

**Prioridad:** P0 · **Complejidad:** Muy alta · **Completitud (8 puertas):** 40 % ·
**Estado:** PARTs detallados (pendiente de ejecución)

## Alcance

`AegiReports.Dashboard` completo (modelo, compositor→ReportDocument, layout responsive
12 col, DashboardState/InteractionEngine, DataEngine/WidgetDataShaper, 15 widgets,
`.aedashboard`, validador, SDK de widgets) + `Designer.Shell/Dashboard`
(DashboardDesignerControl, editores, DashboardPreviewControl) + galería hotelera +
publicación al server (`DashboardPublisher`).

## Objetivos

1. Paridad práctica con DevExpress Dashboard para el gerente sin código.
2. Resolver o excluir formalmente los límites declarados: Map sin proveedor
   (AEGIDB010), CrossHighlight por serie, fábrica síncrona en publicación.
3. Validación manual de las 6 interacciones y los 10 dashboards hoteleros.
4. Documentación técnica (SDK de widgets incluido) y de usuario.

## Dependencias

- QueryBuilder (las fuentes embebén QueryModel) y Charts (widget chart) — deberían
  cerrarse antes o en paralelo controlado.
- Designer (tema/diálogos compartidos).

## PARTs planificados (18)

- PART01_DesignerShell — ventana del diseñador, ciclo de vida, undo/redo
- PART02_Canvas — grid 12 col, drag/resize/snap, capas, overrides responsive
- PART03_Toolbox — grupos de widgets, búsqueda, alta al lienzo
- PART04_DataSources — explorador de fuentes, QueryBuilder embebido, filas estáticas
- PART05_WidgetEditors — editores KPI/chart/crosstab/gauge/progreso/texto/imagen
- PART06_ContainersTabs — container/tabs/stack/grid anidado
- PART07_ParametersFilters — parámetros globales + 6 tipos de filtro
- PART08_Interactions — cross-filter, highlight, master-detail, drill down/through
- PART09_Themes — temas del dashboard, editor de contraste
- PART10_Preview — vista previa interactiva, breadcrumb, F11, presentación
- PART11_Persistence — .aedashboard, migraciones, determinismo
- PART12_Validation — AEGIDB001–010, diagnósticos vivos
- PART13_Publishing — publicación al catálogo del server, ciclo asíncrono
- PART14_ReportViewerWidget — bands frescas del resolutor, navegación al visor
- PART15_MapWidget — decidir: proveedor mínimo o exclusión formal 1.0
- PART16_WidgetSdk — contrato de terceros, muestras, compatibilidad
- PART17_TechnicalDocumentation
- PART18_UserDocumentation
