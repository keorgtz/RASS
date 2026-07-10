# PART06 — BookmarksOutline (marcadores y esquema)

## 1. Purpose
Los paneles de marcadores y esquema: `TocNavigator` sobre `NavigationMapDto`
(marcadores/TOC construidos por `NavigationMapBuilder`) y `DocumentOutlineModel`
(esquema del documento: bandas nombradas jerárquicas), con búsqueda, seguimiento de la
ubicación actual y salto animado al destino.

## 2. Current State
Funcional (Fases 15/24). Marcadores como árbol de bandas nombradas; esquema separado;
búsqueda dentro del panel; salto con animación ≤ 200 ms.

## 3. Comparison against DevExpress
DevExpress muestra un árbol de marcadores jerárquico con expansión/colapso y
seguimiento de la posición. AegiReports: árbol y seguimiento sí; auditar la jerarquía
real (¿plana o anidada?) y la coherencia entre marcadores y esquema.

## 4. Missing Features
- Jerarquía anidada real de marcadores (grupos dentro de grupos) si el documento la
  define.
- Expandir/colapsar todo; recordar estado de expansión.
- Diferenciar claramente «Marcadores» (definidos por el reporte) de «Esquema»
  (estructura de bandas) — o unificar con criterio documentado.

## 5. UX Problems
- El nodo de la posición actual debe resaltarse y auto-revelarse (scroll into view).
- Búsqueda filtra el árbol conservando el contexto de los padres.

## 6. Backend Problems
- `NavigationMapBuilder`: verificar que la jerarquía refleja el anidamiento real de
  grupos del documento.

## 7. Frontend Problems
- Salto animado no debe desorientar (duración ≤ 200 ms, easing Meridian).

## 8. Technical Debt
- Aclarar en docs la relación marcadores↔esquema para el usuario.

## 9. Required Improvements
1. Jerarquía anidada + expandir/colapsar todo + estado recordado.
2. Auto-reveal de la posición actual; búsqueda con contexto de padres.
3. Distinción o unificación documentada de marcadores/esquema.

## 10. Implementation Plan
1) Modelo: jerarquía anidada en `NavigationMapDto`/`DocumentOutlineModel` + tests.
2) WPF: expansión, auto-reveal, búsqueda contextual.
3) Recorrido manual con reporte agrupado multinivel.

## 11. Automated Test Plan
- Construcción de la jerarquía desde un documento multinivel; seguimiento de posición
  (página → nodo); filtro conserva padres; salto calcula destino correcto.

## 12. Manual Validation Checklist
- [ ] Marcadores reflejan la jerarquía de grupos del reporte agrupado
- [ ] Clic salta con animación breve; la posición actual se resalta y revela
- [ ] Expandir/colapsar todo; estado recordado al reabrir
- [ ] Buscar filtra conservando padres
- [ ] Esquema muestra la estructura de bandas; relación con marcadores clara
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado (flechas, Enter salta) · [ ] Mouse

## 13. Technical Documentation to produce
`Previewer/Architecture.md` (mapa de navegación, esquema).

## 14. User Documentation to produce
«Marcadores y esquema» (navegar documentos largos).

## 15. Acceptance Criteria
- Jerarquía anidada correcta; seguimiento y salto exactos; distinción documentada;
  checklist §12 con capturas; suite verde.
