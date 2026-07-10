# Epic: Crosstabs — backlog

**Prioridad:** P1 · **Complejidad:** Media · **Completitud (8 puertas):** 40 % ·
**Estado:** PARTs detallados (pendiente de ejecución)

## Alcance

`AegiReports.Crosstab` (engine una-pasada, CrosstabTableBuilder→TableControl, builder
XLSX con fórmulas SUM), el wizard de crosstab, el widget crosstab del dashboard con
formato condicional post-proceso.

## Objetivos

1. Paridad práctica con el Cross Tab de DevExpress: totales/subtotales por eje,
   ordenamiento de encabezados, formatos — clasificar existente/gap.
2. Validación manual con datos hoteleros (ocupación por tipo × mes, etc.).
3. Coherencia del formato condicional entre reporte y dashboard.

## Dependencias

- Tables (hereda paginación/exports del TableControl generado).

## PARTs planificados (10)

- PART01_Engine — pivoteo una-pasada, agregados, claves compuestas
- PART02_TotalsSubtotals — totales por fila/columna/gran total, orden
- PART03_BuilderOutput — generación de TableControl, estilos, medidas
- PART04_WizardUX — asistente de crosstab end-to-end
- PART05_DashboardWidget — widget, formato condicional de celdas, hit-áreas
- PART06_XlsxFormulas — export con fórmulas reales, fidelidad
- PART07_Performance — datasets anchos (muchas columnas pivote)
- PART08_Persistence — round-trip .aedocx del control
- PART09_TechnicalDocumentation
- PART10_UserDocumentation
