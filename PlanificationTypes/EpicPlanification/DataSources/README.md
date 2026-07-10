# Epic: DataSources — backlog

**Prioridad:** P0 · **Complejidad:** Alta · **Completitud (8 puertas):** 45 % ·
**Estado:** PARTs detallados (pendiente de ejecución)

## Alcance

`Data` (IRecordSource, ObjectDataSource, JsonDataSource, DataRecord/DataShapeSchema,
binding, expansión, SchemaDiscovery), `Data.SqlServer` (SqlDataSource,
SqlClientCommandExecutor, InMemorySqlCommandExecutor, metadata), `Data.EfCore`
(EfCoreDataSource, EfMetadataProvider) y el wizard de fuentes
(`DataSourceWizardModel`, `DataProviderKind` SqlServer/EF/Json/Object).

## Objetivos

1. Los 4 proveedores con la MISMA UX y los mismos contratos de error accionables.
2. Modo EF utilizable en hosts reales (hoy el Demo no incluye DbContext — decidir
   muestra real o límite documentado).
3. Robustez: cancelación, timeouts, credenciales, esquemas grandes.
4. Documentación técnica y de usuario por proveedor.

## Dependencias

- Ninguna entrante crítica. Alimenta: QueryBuilder, Parameters, Designer (wizard).

## PARTs planificados (12)

- PART01_RecordPipeline — DataRecord/DataShapeSchema/RecordMaterializer/binding
- PART02_ObjectDataSource — POCOs/records/diccionarios, reflexión, DataMember
- PART03_JsonDataSource — archivo/stream/string, aplanado, rutas de colección
- PART04_SqlServerProvider — ejecutores real/sembrado, stored procs, cancelación
- PART05_EfCoreProvider — IQueryable, async, convenciones, muestra con DbContext
- PART06_SchemaDiscovery — descubrimiento por forma y por tipo, profundidad
- PART07_DataSourceWizard — pasos, validación, prueba, esquema, misma UX 4 proveedores
- PART08_ErrorContracts — mensajes accionables, seguridad de cadenas de conexión
- PART09_LiveParameters — WithParameters, recomposición, paridad entre ejecutores
- PART10_PerformanceLimits — volúmenes grandes, streaming, memoria
- PART11_TechnicalDocumentation
- PART12_UserDocumentation
