# Epic: Exporting — backlog

**Prioridad:** P0 · **Complejidad:** Alta · **Completitud (8 puertas):** 40 % ·
**Estado:** Backlog

## Alcance

`Exporting` (contratos, HTML/CSV/TXT/imagenes), `Exporting.Pdf` (writer PDF propio
determinista), `Exporting.Docx`, `Exporting.Xlsx` (OOXML nativos reproducibles byte a
byte), `ExporterExtension` del SDK, y los diálogos de export del visor/estudio/Demo.

## Objetivos

1. **Subsetting de fuentes PDF** (gap G1 de FINAL_PRODUCT_GAPS) y evaluación de
   CID/Unicode — decidir cierre o límite 1.0 documentado con precisión.
2. Fidelidad visual auditada formato por formato contra el Render Tree (suite de
   regresión con SnapshotStore).
3. Tamaños/perf de archivos competitivos; metadatos correctos (título, autor).
4. Documentación técnica (formatos soportados por control) y de usuario.

## Dependencias

- Ninguna entrante. Alimenta: Server, Printing, Previewer (diálogos ya del Epic 2).

## PARTs planificados (14)

- PART01_ExportContracts — IExporter, progreso, cancelación, streaming
- PART02_PdfWriter — estructura, determinismo, metadatos
- PART03_PdfFonts — subsetting (G1), CID/Unicode, fallback de glifos
- PART04_PdfFidelity — texto/líneas/imágenes/transparencias vs Render Tree
- PART05_Docx — layout a OOXML, estilos, tablas
- PART06_Xlsx — filas/celdas/números reales, fórmulas, anchos
- PART07_HtmlCsv — HTML fiel, CSV con la misma extracción tabular
- PART08_Images — PNG/JPEG/TIFF, DPI, multipágina TIFF
- PART09_TextThermal — TXT, evaluación ESC/POS (pendiente histórico) o exclusión
- PART10_SdkExporters — ExporterExtension de terceros, registro, ejemplo
- PART11_RegressionSuite — snapshots por hash, corpus de documentos
- PART12_Performance — documentos grandes, memoria, tiempos por formato
- PART13_TechnicalDocumentation
- PART14_UserDocumentation
