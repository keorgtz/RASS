# PART02 — LayoutPagination (layout y paginación de tablas)

## 1. Purpose
Auditar y endurecer `TableLayoutHandler`: dimensionamiento de columnas (Fixed/Auto/Star en
EMUs exactos), medición de filas con `WordWrap` por ancho de columna, puntos de corte entre
filas, encabezado repetido en continuaciones, prevención de viuda del pie y estados de
overflow (grow/shrink/clip/split). Es la garantía de que una tabla larga pagina bien.

## 2. Current State
Implementado y determinista (aritmética en EMUs, una medición por celda). Cortes permitidos
= límite posterior a cada fila de **cuerpo** salvo la última (el pie queda unido a la última
fila → sin viuda). `RepeatHeaderOnContinuation` acumula `headerHeight` para reinyectar el
encabezado. `ResolveVerticalFit` respeta `CanGrow`/`CanShrink`; overflow horizontal/split
señalizados. Reparto Star sobre el ancho restante tras Fixed/Auto.

## 3. Comparison against DevExpress
DevExpress repite encabezados, mantiene juntas filas (`KeepTogether`) y evita cortes feos.
AegiReports repite encabezado y evita viuda de pie; **falta `KeepTogether` por grupo**
(mantener encabezado de grupo junto a su primera fila de detalle) — hoy el corte solo mira
filas de cuerpo, no la semántica de banda de grupo.

## 4. Missing Features
- `KeepTogether` / «no romper» a nivel de grupo o de bloque de filas (huérfanas de grupo).
- Repetición del **encabezado de grupo** (no solo el header de tabla) en continuaciones.
- Corte dentro de una fila muy alta (fila que excede una página entera).

## 5. UX Problems
- Un encabezado de grupo puede quedar al pie de una página con su detalle en la siguiente.

## 6. Backend Problems
- Los puntos de corte se calculan por `TableRowKind`, sin conocimiento de a qué banda de
  grupo pertenece cada fila; enlazar con el resultado de `GroupedDocumentExpander` (PART03).
- Fila más alta que la página: hoy `RequiresSplit` sin política de corte intra-fila.

## 7. Frontend Problems
N/A (el visor consume el árbol de layout; el pintado es fiel).

## 8. Technical Debt
- La política «keep-together de grupo» requiere que layout reciba metadatos de grupo →
  coordinar con PART03. Decisión 1.0: implementar mínimo (header+1ª fila juntos) o acotar.

## 9. Required Improvements
1. `KeepTogether` mínimo: encabezado de grupo unido a su primera fila de detalle.
2. (Opcional 1.0) repetición de encabezados de grupo en continuación.
3. Política explícita para filas más altas que la página.

## 10. Implementation Plan
1) Auditar cortes con tablas largas reales (miles de filas) y multipágina.
2) Introducir metadato de agrupación en el layout de filas; aplicar keep-together mínimo.
3) Definir política de fila sobre-alta (cortar o clip documentado).

## 11. Automated Test Plan
- Tabla de N filas pagina en el número esperado de páginas; encabezado presente en cada una.
- Pie nunca queda solo (viuda) al inicio de página.
- (Keep-together) encabezado de grupo y su primera fila caen en la misma página.
- Reparto Star suma exactamente el ancho disponible (EMUs).

## 12. Manual Validation Checklist
- [ ] Reporte de 500+ filas: encabezado repetido en todas las páginas
- [ ] Ningún pie de tabla aislado al inicio de página
- [ ] Encabezado de grupo no queda huérfano al final de página
- [ ] Columnas Star llenan el ancho sin desbordar; Auto ajusta al contenido
- [ ] Idéntico corte en visor y PDF (determinismo)

## 13. Technical Documentation to produce
`Tables/Architecture.md` (layout, cortes, keep-together) — PART11.

## 14. User Documentation to produce
Tema «Tablas largas y saltos de página» — PART12.

## 15. Acceptance Criteria
- Keep-together mínimo implementado o acotado; encabezado repetido verificado; sin viudas;
  determinismo visor↔PDF; §12 con capturas; suite verde.
