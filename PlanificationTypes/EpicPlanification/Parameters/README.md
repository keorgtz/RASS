# Epic: Parameters — backlog

**Prioridad:** P1 · **Complejidad:** Media · **Completitud (8 puertas):** 45 % ·
**Estado:** PARTs detallados (pendiente de ejecución)

## Alcance

`ReportParameterDefinition`/`ParameterFormModel` (9 tipos, Required/Min/Max/Regex,
lookups en cascada), parámetros del SDK (validador AEGI900–901, cache key, sustitución
`[Param.X]`), parámetros del QueryBuilder (`ParameterModel`, tipos, TestValue),
paneles de parámetros del visor y del dashboard, y el wizard de parámetro.

## Objetivos

1. Un solo modelo mental de parámetros a través de reporte/consulta/dashboard —
   auditar coherencia de tipos, defaults y cascada en las tres superficies.
2. Paridad con DevExpress: multi-valor, rangos de fecha, listas dinámicas desde
   consulta — clasificar como existente/gap a cerrar/límite.
3. Validación manual de cascada + recomposición viva en visor y dashboard.

## Dependencias

- DataSources (lookups dinámicos). Alimenta: Previewer, Dashboard, QueryBuilder.

## PARTs planificados (10)

- PART01_ParameterModel — 9 tipos, validaciones, defaults, serialización
- PART02_LookupsCascade — opciones estáticas/dinámicas, DependsOnParameter
- PART03_QueryParameters — @params del builder, TestValue, generación SQL
- PART04_ViewerPanel — formulario del visor, auto-refresh, recomposición
- PART05_DashboardParameters — parámetros globales, filtros, snapshot sin filtros
- PART06_MultiValueRanges — decidir alcance 1.0 (multi-valor, rango de fechas)
- PART07_WizardUX — asistente de parámetro, edición desde el explorador
- PART08_CacheKeys — determinismo del cache key con valores tipados
- PART09_TechnicalDocumentation
- PART10_UserDocumentation
