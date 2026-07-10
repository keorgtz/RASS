# PART03 — PageLayout (modos de página y cache)

## 1. Purpose
El cálculo de disposición de páginas: `PageLayoutCalculator` (continuo, página única,
dos páginas/libro con columns + `GetPageLeft`), `PageContentCache` (LRU de páginas
rasterizadas/presentadas), `SetViewColumns` preservando cache y la virtualización del
área de páginas.

## 2. Current State
Funcional (Fases 14/24). Two-up aditivo con cache intacta; virtualización por
viewport. Reutilizado por el visor web (WebPreviewViewModel).

## 3. Comparison against DevExpress
DevExpress: continuo, página única, dos páginas, y ajustes de margen entre páginas.
AegiReports cubre los tres modos; falta auditar márgenes/gutter configurables y el
comportamiento en documentos de tamaños de página mixtos.

## 4. Missing Features
- Tamaños de página mixtos en un mismo documento (p. ej. una página apaisada):
  verificar que el layout no asume tamaño uniforme.
- Gutter/margen entre páginas coherente por modo.
- Salto a «primera/última página» y a página par/impar en modo libro.

## 5. UX Problems
- En modo dos páginas, la primera página debería poder mostrarse sola (portada) —
  opción de «primera página en solitario».
- Transición entre modos debe conservar la página visible (no saltar al inicio).

## 6. Backend Problems
- Cache: invalidación correcta al cambiar de modo/columnas sin recomponer páginas no
  afectadas.

## 7. Frontend Problems
- Scroll suave al cambiar de modo; sin parpadeo de la cache.

## 8. Technical Debt
- Documentar el contrato de `PageContentCache` (política LRU, tamaño, claves).

## 9. Required Improvements
1. Soporte robusto de tamaños mixtos + gutter por modo.
2. Portada en solitario (modo libro) + preservar página visible al cambiar de modo.
3. Saltos primera/última/par/impar.

## 10. Implementation Plan
1) Modelo: `PageLayoutCalculator` con tamaños por página y opción de portada + tests.
2) WPF: preservación de página visible, scroll suave, saltos.
3) Recorrido manual con documento de tamaños mixtos.

## 11. Automated Test Plan
- Layout: posiciones en continuo/único/libro con tamaños uniformes y mixtos; portada
  en solitario; `SetViewColumns` no invalida cache innecesaria; saltos correctos.

## 12. Manual Validation Checklist
- [ ] Alternar continuo/página única/dos páginas conserva la página visible
- [ ] Documento con una página apaisada se dispone correctamente
- [ ] Modo libro con portada en solitario
- [ ] Saltar a primera/última página; navegar por pares/impares
- [ ] Scroll fluido, sin parpadeo de cache
- [ ] Documento grande (100+ páginas) virtualiza sin fugas
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado (PgUp/PgDn/Home/End) · [ ] Mouse

## 13. Technical Documentation to produce
`Previewer/Architecture.md` (layout + cache), `Previewer/Performance.md`
(virtualización, LRU).

## 14. User Documentation to produce
«Modos de visualización» (continuo, página, libro).

## 15. Acceptance Criteria
- Tamaños mixtos y portada soportados; cambio de modo preserva posición; cache correcta;
  checklist §12 con capturas; suite verde.
