# PART07 — Search (búsqueda en el documento)

## 1. Purpose
La búsqueda de texto: `PreviewSearch` sobre el Render Tree con `SearchOptions`
(case-sensitive/whole-word, aditivas), overlays ámbar sobre las coincidencias con la
activa marcada, contador «n de m» y navegación cíclica siguiente/anterior sin
re-render.

## 2. Current State
Funcional (Fases 20/24). Búsqueda sobre el Render Tree (no re-renderiza), overlays como
presentación pura (`PageOverlay`), navegación cíclica, contador en la command bar.

## 3. Comparison against DevExpress
DevExpress: búsqueda con resaltado, siguiente/anterior, y opciones. AegiReports
equivalente; auditar rendimiento en documentos grandes, búsqueda incremental (mientras
se escribe) y salto automático a la primera coincidencia.

## 4. Missing Features
- Búsqueda incremental (resalta mientras se escribe) con debounce.
- Salto automático a la primera coincidencia al buscar.
- Lista de resultados con contexto (opcional; evaluar 1.0).

## 5. UX Problems
- La coincidencia activa debe centrarse en la vista y distinguirse (ámbar más
  saturado) de las demás.
- Estado «sin resultados» claro; el contador y los botones next/prev deshabilitan.

## 6. Backend Problems
- `PreviewSearch`: rendimiento en documentos de miles de fragmentos (índice o barrido
  acotado); búsqueda insensible a acentos opcional (es-MX).

## 7. Frontend Problems
- Overlays deben seguir el zoom/scroll exactamente (coordenadas del Render Tree → vista).

## 8. Technical Debt
- Ninguna crítica.

## 9. Required Improvements
1. Búsqueda incremental con debounce + salto a la primera.
2. Coincidencia activa centrada y saturada; estado sin resultados.
3. Rendimiento en documentos grandes; opción de ignorar acentos.

## 10. Implementation Plan
1) Modelo: búsqueda incremental, normalización opcional de acentos + tests.
2) WPF: overlays con zoom, centrado de la activa, estados.
3) Recorrido manual con documento grande y texto acentuado.

## 11. Automated Test Plan
- Coincidencias con/sin case/whole-word/acentos; navegación cíclica; contador correcto;
  overlays con coordenadas exactas tras zoom (transformación pura).

## 12. Manual Validation Checklist
- [ ] Buscar resalta todas las coincidencias; «n de m» correcto
- [ ] Incremental mientras se escribe (con debounce); salta a la primera
- [ ] Siguiente/anterior cíclico; activa centrada y distinguible
- [ ] Case-sensitive y whole-word cambian resultados
- [ ] Buscar «reservación» encuentra «Reservación» (con ignorar acentos activo)
- [ ] Sin resultados: contador 0, botones deshabilitados, mensaje
- [ ] Overlays siguen zoom/scroll
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado (Ctrl+F, F3, Esc) · [ ] Mouse

## 13. Technical Documentation to produce
`Previewer/Architecture.md` (búsqueda sobre Render Tree, overlays).

## 14. User Documentation to produce
«Buscar texto en el documento».

## 15. Acceptance Criteria
- Búsqueda incremental y cíclica exacta; overlays precisos con zoom; rendimiento en
  documentos grandes; checklist §12 con capturas; suite verde.
