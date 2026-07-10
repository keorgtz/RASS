# Epic: Previewer — backlog

**Prioridad:** P0 · **Complejidad:** Alta · **Completitud (8 puertas):** 40 % ·
**Estado:** PARTs detallados (pendiente de ejecución)

## Alcance

El visor profesional de documentos: `Previewer` (view-models puros, PageLayoutCalculator,
PageContentCache, búsqueda, selección de texto, overlays), `Previewer.Wpf`
(DocumentPreviewControl, PageElement, presenter), `Previewer.Advanced` (zoom focal,
inercia, miniaturas, minimap, prefetch), `Designer.Shell/Viewer` (ViewerShellControl,
paneles, diálogos de impresión/export) y su integración en Demo y estudio.

## Objetivos

1. Paridad práctica con el Document Viewer de DevExpress (navegación, búsqueda,
   parámetros, export, print, modos de página).
2. Cablear los modelos verdes sin UI (`MiniMap`, `PredictivePrefetch`) o declarar
   formalmente su exclusión de 1.0.
3. Selección de texto exacta por glifo o límite documentado y aceptado.
4. Validación manual completa + documentación técnica y de usuario.

## Dependencias

- Designer (tema Meridian, MeridianDialog compartidos — se cierran primero).
- Alimenta: Printing (diálogos), Web (paridad de visor browser).

## PARTs planificados (16)

- PART01_ViewerShell — ventana/control, ciclo de vida, carga de sesión
- PART02_CommandBar — catálogo de comandos del visor, búsqueda con contador
- PART03_PageLayout — modos continuo/página única/dos páginas, columnas, cache
- PART04_ZoomNavigation — zoom focal, fit width/page, tamaño real, página editable
- PART05_ThumbnailsPanel — miniaturas virtualizadas, sync bidireccional
- PART06_BookmarksOutline — marcadores, esquema del documento, TOC
- PART07_Search — búsqueda con opciones, overlays, navegación cíclica
- PART08_ParametersPanel — formulario, cascada, recomposición real
- PART09_TextSelection — selección por arrastre/palabra/línea, copiar
- PART10_Inspector — fuentes/imágenes/bookmarks/dimensiones del Render Tree
- PART11_ExportDialogs — 9 formatos, progreso, cancelación, recientes
- PART12_PrintDialog — impresoras, rango, copias, collate, preview, progreso
- PART13_FullscreenPresentation — F11, presentación, dos páginas libro
- PART14_MiniMapPrefetch — cablear o excluir formalmente MiniMap/PredictivePrefetch
- PART15_TechnicalDocumentation
- PART16_UserDocumentation
