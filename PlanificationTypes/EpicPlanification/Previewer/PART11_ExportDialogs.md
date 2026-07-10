# PART11 — ExportDialogs (diálogos de exportación)

## 1. Purpose
Los diálogos de exportación del visor: selección de formato (9: PDF/DOCX/XLSX/HTML/CSV/
TXT/PNG/JPEG/TIFF), opciones por formato (DPI para imágenes, etc.), progreso,
cancelación y lista de recientes; enrutado al host para elegir archivo.

## 2. Current State
Funcional (Fase 24). XLSX vía `RenderDocumentXlsxBuilder`, CSV con la misma extracción
tabular. Progreso y cancelación. Fase 28: export desde el Demo con `RunSafely`.

## 3. Comparison against DevExpress
DevExpress ofrece un diálogo por formato con opciones ricas (rango de páginas, calidad
de imagen, PDF/A, seguridad PDF). AegiReports: formatos y DPI; auditar rango de páginas,
opciones de PDF (metadatos/seguridad) y calidad JPEG.

## 4. Missing Features
- Rango de páginas en el export (no solo documento completo).
- Opciones de PDF: metadatos (título/autor), y decisión sobre PDF/A y seguridad
  (coordinar con Epic Exporting).
- Calidad JPEG configurable; TIFF multipágina confirmado.

## 5. UX Problems
- Vista de opciones que cambia según el formato (sin campos irrelevantes).
- Estado terminal del progreso garantizado; cancelación limpia (archivo parcial
  eliminado).

## 6. Backend Problems
- Cancelar debe abortar la escritura y no dejar archivo corrupto a medio escribir.

## 7. Frontend Problems
- Recientes: mostrar y reabrir carpeta destino; nombres sugeridos por documento.

## 8. Technical Debt
- Las opciones ricas por formato dependen del Epic Exporting (orden: coordinar).

## 9. Required Improvements
1. Rango de páginas + opciones por formato dinámicas.
2. Metadatos PDF + calidad de imagen; cancelación sin archivo corrupto.
3. Recientes con carpeta destino y nombre sugerido.

## 10. Implementation Plan
1) Modelo: opciones por formato (con Epic Exporting), rango de páginas + tests.
2) WPF: UI dinámica por formato, progreso terminal, cancelación limpia, recientes.
3) Recorrido manual exportando los 9 formatos.

## 11. Automated Test Plan
- Rango de páginas produce el subconjunto correcto; cancelación no deja archivo;
  opciones por formato aplicadas (DPI/calidad); recientes round-trip.

## 12. Manual Validation Checklist
- [ ] Exportar los 9 formatos; abrir cada archivo y verificar contenido
- [ ] Rango de páginas exporta el subconjunto
- [ ] DPI de imagen y calidad JPEG aplican; TIFF multipágina
- [ ] Cancelar a mitad no deja archivo corrupto
- [ ] Progreso con estado terminal; recientes y carpeta destino
- [ ] Error de escritura (disco lleno/permite) → diálogo Meridian, sin fallo mudo
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Previewer/Integration.md` (opciones de export), remite a `Exporting/*` del Epic
Exporting para el detalle de cada formato.

## 14. User Documentation to produce
«Exportar un documento» (formatos, opciones, rango de páginas).

## 15. Acceptance Criteria
- Los 9 formatos exportan con opciones correctas y rango de páginas; cancelación limpia;
  errores no mudos; checklist §12 con capturas; suite verde.
