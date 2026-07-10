# PART02 — SchemaExplorer (explorador del catálogo)

## 1. Purpose
El panel de esquema del builder: árbol tablas/vistas → columnas (con tipo, PK, FK) del
`DatabaseSchema`, con búsqueda, favoritos y recientes, desde el cual se arrastran tablas
al canvas.

## 2. Current State
Funcional (Fase 25). Explorer con búsqueda/favoritos/recientes; el catálogo proviene de
`SqlServerMetadataProvider`, `EfMetadataProvider` u `ObjectMetadataProvider` (Fase 28).
Fase 28: TreeView Meridian.

## 3. Comparison against DevExpress
DevExpress muestra tablas/vistas separadas, iconos por tipo de columna, PK/FK marcadas y
tooltip con el tipo. AegiReports: búsqueda y estructura sí; auditar iconos por tipo,
distinción tabla/vista y marcas PK/FK visibles.

## 4. Missing Features
- Iconos por tipo de dato de columna y marcas visibles de PK/FK.
- Separación visual tablas vs vistas.
- Tooltip con tipo SQL/CLR y nulabilidad; conteo de columnas por tabla.

## 5. UX Problems
- Esquemas grandes (cientos de tablas): la búsqueda debe filtrar el árbol conservando
  el contexto; estado vacío de búsqueda claro.
- Doble clic en tabla debería agregarla al canvas (además del arrastre).

## 6. Backend Problems
- Ninguno; el modelo del explorer es puro. El descubrimiento vive en los providers
  (PART11).

## 7. Frontend Problems
- Arrastre sin ghost con el nombre de la tabla.

## 8. Technical Debt
- Ninguna crítica.

## 9. Required Improvements
1. Iconos por tipo + marcas PK/FK + separación tabla/vista + tooltips.
2. Doble clic agrega al canvas; ghost de arrastre.
3. Búsqueda con contexto de padres; estado vacío.

## 10. Implementation Plan
1) Modelo: metadatos de presentación por columna (icono/tooltip) como función pura.
2) WPF: iconos, marcas, doble clic, ghost, búsqueda contextual.
3) Recorrido manual con el catálogo hotelero (8 tablas + 3 vistas).

## 11. Automated Test Plan
- Árbol desde `DatabaseSchema` (orden estable, tablas vs vistas); búsqueda con acentos
  es-MX; favoritos/recientes round-trip; PK/FK reflejadas.

## 12. Manual Validation Checklist
- [ ] Catálogo hotelero: tablas y vistas separadas, PK/FK marcadas, iconos por tipo
- [ ] Buscar «reserva» filtra conservando padres; vacío muestra mensaje
- [ ] Arrastrar tabla al canvas (ghost) y doble clic la agrega
- [ ] Tooltip con tipo y nulabilidad; conteo de columnas
- [ ] Favorito y reciente persisten
- [ ] Esquema grande (simulado) no degrada la búsqueda
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`QueryBuilder/Architecture.md` (explorer + esquema).

## 14. User Documentation to produce
«Explorar el catálogo de datos» (tablas, vistas, columnas).

## 15. Acceptance Criteria
- Iconos/PK/FK/tooltips correctos; doble clic y ghost operativos; búsqueda contextual;
  checklist §12 con capturas; suite verde.
