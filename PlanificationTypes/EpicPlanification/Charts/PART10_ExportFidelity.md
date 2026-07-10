# PART10 — ExportFidelity (fidelidad de gráficas en exportación)

## 1. Purpose
Verificar que las gráficas —incluidos los tipos nuevos (Pie/Donut/Área) y sus primitivas
(arco, polígono relleno)— se exportan con fidelidad idéntica en PDF, imagen (PNG/Skia), XLSX
y web/HTML, reutilizando los fragmentos de layout (cero motor por formato).

## 2. Current State
Column/Bar/Line se componen como fragmentos (rectángulos/líneas/texto) que los renderers ya
consumen. Los **fragmentos de arco (PART03) y polígono relleno (PART04) son nuevos** y deben
renderizar en TODOS los backends con fidelidad. XLSX necesita decisión: ¿gráfica nativa de
Excel o imagen incrustada?

## 3. Comparison against DevExpress
DevExpress exporta gráficas como imagen fiel a PDF/imagen y como gráfica nativa a Excel.
AegiReports: fiel por fragmentos a PDF/imagen/web; **XLSX como imagen** es el punto a
confirmar o acotar.

## 4. Missing Features
- Renderizado de arco y polígono relleno con opacidad en cada backend (WPF/Skia/PDF/HTML).
- Decisión XLSX: imagen incrustada (probable 1.0) vs gráfica nativa (límite documentado).
- Golden files por tipo × backend, incluidos los nuevos tipos.

## 5. UX Problems
- Una gráfica que difiere entre visor y PDF/Excel rompe la confianza; la fidelidad debe ser
  pixel-consistente (dentro de tolerancia de rasterización).

## 6. Backend Problems
- Aproximación de arcos por Bézier en PDF; `AddArc`/`PathGeometry` en Skia/WPF; `<path>` en
  SVG/HTML — todos deben coincidir visualmente.
- Opacidad del área en cada backend.

## 7. Frontend Problems
N/A (exportación headless), salvo la paridad visor↔export.

## 8. Technical Debt
- Diferencias inevitables por backend deben documentarse (`Limitations.md`).

## 9. Required Improvements
1. Matriz de fidelidad gráfica × formato (5 tipos × PDF/imagen/XLSX/HTML).
2. Renderizado de arco/polígono relleno verificado por backend.
3. Golden files y decisión XLSX.

## 10. Implementation Plan
1) Corpus de gráficas (5 tipos, negativos, apilado, etiquetas) y export a los formatos.
2) Comparar contra golden; cerrar/priorizar diferencias; decidir XLSX.
3) Recorrido manual abriendo cada exportación en su app.

## 11. Automated Test Plan
- Export de cada tipo a cada backend coincide con golden.
- Arco y polígono relleno presentes y correctos en PDF/imagen/HTML.
- Determinismo: misma gráfica → misma salida.

## 12. Manual Validation Checklist
- [ ] Los 5 tipos se ven idénticos en visor, PDF, imagen y web
- [ ] Pie/donut (arco) y área (relleno) fieles en todos los formatos
- [ ] XLSX incrusta la gráfica (imagen) o el límite está documentado
- [ ] Negativos, apilado y etiquetas de datos correctos en export
- [ ] Tema claro/oscuro

## 13. Technical Documentation to produce
`Charts/Limitations.md` (diferencias por formato, XLSX) — PART11.

## 14. User Documentation to produce
Tema «Exportar gráficas» con notas por formato — PART12.

## 15. Acceptance Criteria
- Matriz de fidelidad completa; arco/área fieles por backend; XLSX decidido; golden verdes;
  §12 con capturas de cada app; suite verde.
