# Epic: Tables — backlog

**Prioridad:** P1 · **Complejidad:** Alta · **Completitud (8 puertas):** 45 % ·
**Estado:** PARTs detallados (pendiente de ejecución)

## Alcance

`AegiReports.Tables` (TableControl, TableLayoutHandler, grouping/GroupedDocumentExpander,
sumarios, drill-down por CollapsedGroupKeys), el wizard de tabla, la persistencia
`.aedocx` de tablas y su edición en el estudio.

## Objetivos

1. Paridad práctica con la tabla de DevExpress Reporting: edición celda a celda en el
   designer, merge, estilos por fila/columna alternada — clasificar existente/gap.
2. Paginación robusta de tablas largas (repetición de encabezados, keep-together).
3. Agrupación multinivel y sumarios validados manualmente con datos hoteleros.
4. Documentación técnica y de usuario.

## Dependencias

- Ninguna entrante. Alimenta: Crosstabs (builder produce TableControl), Dashboard.

## PARTs planificados (12)

- PART01_TableModel — columnas/filas/celdas, medidas, estilos
- PART02_LayoutPagination — cortes de página, encabezados repetidos, keep-together
- PART03_GroupingSummaries — grupos multinivel, subtotales, orden
- PART04_DrillDown — grupos colapsados, navegación
- PART05_DesignerEditing — edición en superficie: celdas, columnas, alturas
- PART06_WizardUX — asistente de tabla end-to-end
- PART07_StylesFormatting — estilos alternados, formato condicional en celdas
- PART08_Persistence — .aedocx round-trip byte a byte
- PART09_ExportFidelity — PDF/XLSX/DOCX/HTML con tablas complejas
- PART10_Performance — miles de filas, expansión, memoria
- PART11_TechnicalDocumentation
- PART12_UserDocumentation
