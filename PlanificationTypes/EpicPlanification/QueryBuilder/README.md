# Epic: QueryBuilder — backlog

**Prioridad:** P0 · **Complejidad:** Alta · **Completitud (8 puertas):** 45 % ·
**Estado:** PARTs detallados (pendiente de ejecución)

## Alcance

`AegiReports.QueryBuilder` (QueryModel inmutable, SqlQueryGenerator parametrizado,
QueryValidator AEGIQB001–010, InMemoryQueryExecutor, LinqPipelineBuilder,
ObjectMetadataProvider) + metadatos (SqlServerMetadataProvider, EfMetadataProvider) +
`Designer.Shell/QueryBuilder` (explorer, canvas de tablas/joins, tabs de columnas/
filtros/parámetros, SQL resaltado, resultados) + presets hoteleros + integración en
wizard/dashboard/Demo.

## Objetivos

1. Paridad práctica con el Query Builder de DevExpress (incluido ObjectDataSource,
   ya first-class desde la Fase 28).
2. Decidir el alcance 1.0 del modo EF (`LinqPipelineBuilder` una entidad — extender o
   documentar como límite).
3. Validación manual del circuito completo: catálogo → diseño → SQL → ejecución →
   reporte → parámetros vivos en el visor.
4. Documentación técnica y de usuario.

## Dependencias

- DataSources (proveedores/metadatos son la entrada del builder).
- Alimenta: Dashboard (fuentes embebidas), Parameters.

## PARTs planificados (14)

- PART01_BuilderShell — control/ventana modal, aceptar exige cero errores
- PART02_SchemaExplorer — catálogo, búsqueda, favoritos, recientes
- PART03_TableCanvas — tarjetas, auto-joins FK, joins manuales, auto-layout
- PART04_ColumnsTab — selección, alias, agregados, calculadas con guard léxico
- PART05_FiltersTab — árbol anidado AND/OR, operadores, PromoteToParameter
- PART06_ParametersTab — tipos, TestValue, lookups, dependencias
- PART07_SortingGrouping — orden multi-clave, GROUP BY, TopN
- PART08_SqlPreview — SQL resaltado, diagnósticos vivos, copia
- PART09_ResultsGrid — ejecución, paginación, cancelación, tiempos
- PART10_Executors — InMemory/SqlQueryExecutor/objetos: contrato y equivalencia
- PART11_MetadataProviders — SQL Server/EF/Object: cobertura y errores
- PART12_Integrations — wizard SQL, dashboard, Demo, presets hoteleros
- PART13_TechnicalDocumentation
- PART14_UserDocumentation
