# PART09 — ExportFidelity (fidelidad de tablas en exportación)

## 1. Purpose
Verificar que las tablas complejas (spans, encabezado repetido, agrupación con subtotales,
zebra, columnas Auto/Star) se exportan con fidelidad en los formatos del producto —PDF,
XLSX, DOCX, HTML— reusando el árbol de layout único (cero motor nuevo por formato).

## 2. Current State
El pipeline produce un Render Tree que los exportadores consumen; la tabla ya pagina
(`TableLayoutNode` con cortes/encabezado). Falta auditar formato por formato con casos
difíciles, en especial **XLSX** (¿celdas nativas o imagen?) y **DOCX** (tabla nativa vs
composición).

## 3. Comparison against DevExpress
DevExpress exporta tablas a Excel como celdas nativas (editables) y a Word como tablas
nativas. Auditar el nivel de AegiReports por formato y **clasificar existente/gap/límite**
(p. ej. XLSX nativo editable como objetivo o límite 1.0).

## 4. Missing Features
- XLSX: exportación como rango de celdas nativas (no imagen) — confirmar o acotar.
- DOCX: tabla nativa de Word con encabezado repetido de tabla.
- HTML: `<table>` semántica con `thead` repetible y `colspan`.
- Consistencia de zebra/estilos y de `ColumnSpan` en todos los formatos.

## 5. UX Problems
- Una tabla que se ve bien en visor pero mal en Excel (fusionada como imagen) frustra al
  usuario que espera datos manipulables.

## 6. Backend Problems
- Mapear `ColumnSpan` (y `RowSpan` si existe) a cada formato; encabezado repetido a la
  semántica nativa (thead/`RepeatHeaderRow` de Word).
- Cortes de página coherentes con el layout determinista.

## 7. Frontend Problems
N/A (exportación headless).

## 8. Technical Debt
- Diferencias inevitables entre formatos deben documentarse (`Limitations.md`), no
  descubrirse en producción.

## 9. Required Improvements
1. Matriz de fidelidad tabla × formato (PDF/XLSX/DOCX/HTML) con casos difíciles.
2. Cerrar gaps prioritarios (XLSX/DOCX nativo si entran en 1.0) o acotarlos.
3. Golden files por formato para regresión.

## 10. Implementation Plan
1) Construir corpus de tablas difíciles (spans, agrupada, zebra, Auto/Star, multipágina).
2) Exportar a los 4 formatos y comparar contra golden; cerrar/priorizar gaps.
3) Recorrido manual abriendo cada exportación en su app nativa.

## 11. Automated Test Plan
- Exportación de tabla compleja a cada formato coincide con golden.
- `ColumnSpan` y encabezado repetido presentes en la salida de cada formato.
- Determinismo: misma entrada → misma salida byte a byte (donde el formato lo permita).

## 12. Manual Validation Checklist
- [ ] PDF: tabla agrupada multipágina con encabezado repetido y subtotales correcta
- [ ] XLSX: abre en Excel con celdas manipulables (o límite documentado)
- [ ] DOCX: abre en Word como tabla nativa con encabezado repetido
- [ ] HTML: `<table>` semántica con `colspan` y `thead`
- [ ] Zebra y estilos coherentes entre formatos

## 13. Technical Documentation to produce
`Tables/Limitations.md` (diferencias por formato) — PART11.

## 14. User Documentation to produce
Tema «Exportar tablas» con notas por formato — PART12.

## 15. Acceptance Criteria
- Matriz de fidelidad completa; gaps prioritarios cerrados o acotados; golden files verdes;
  §12 con capturas de cada app nativa; suite verde.
