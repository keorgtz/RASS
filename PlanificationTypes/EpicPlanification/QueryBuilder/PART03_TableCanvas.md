# PART03 — TableCanvas (diagrama de tablas y joins)

## 1. Purpose
El área de diagrama: tarjetas de tabla (con sus columnas y checkboxes de selección),
joins automáticos por FK (`AutoJoinDetector`) y manuales por arrastre columna→columna,
auto-layout (`QueryLayoutModel`, BFS) y la edición del tipo de join.

## 2. Current State
Funcional (Fase 25). Tarjetas, auto-join FK, join manual por arrastre, auto-layout BFS.
`QueryModel.AddTable` asigna alias únicos (r/r2); `RemoveTable` hace cascada total
(incluye prune recursivo de filtros que referencian la tabla).

## 3. Comparison against DevExpress
DevExpress: diagrama con líneas de join editables (doble clic → tipo INNER/LEFT/…),
reubicación de tablas, y menú contextual de tabla/join. AegiReports: auto/manual join y
auto-layout; auditar edición del tipo de join en la línea, reubicación manual persistente
y menú contextual.

## 4. Missing Features
- Editar el tipo de join haciendo doble clic en la línea (INNER/LEFT/RIGHT/FULL/CROSS).
- Reubicación manual de tarjetas conservada (no re-auto-layout que la pise).
- Menú contextual: quitar tabla, quitar join, seleccionar todas/ninguna columna.
- Aviso visual de tabla sin join (producto cartesiano no intencional → diagnóstico).

## 5. UX Problems
- Líneas de join legibles (evitar cruces); el auto-layout no debe sobrescribir posiciones
  que el usuario movió.
- Selección de columnas en la tarjeta clara (checkbox + « * todas»).

## 6. Backend Problems
- `RemoveTable` cascada ya correcta; verificar que quitar una tabla intermedia no deja
  joins colgantes.

## 7. Frontend Problems
- Arrastre de join: destino válido resaltado; soltar en columna incompatible avisa.

## 8. Technical Debt
- Ninguna crítica; el modelo es inmutable y bien testeado.

## 9. Required Improvements
1. Edición del tipo de join en la línea + menú contextual de tabla/join.
2. Posiciones manuales persistentes; auto-layout solo bajo demanda.
3. Aviso de tabla sin join (liga validador AEGIQB001/join faltante).

## 10. Implementation Plan
1) Modelo: posiciones en `QueryModel`/`QueryLayoutModel`; tipo de join editable.
2) WPF: doble clic en línea, menú contextual, resaltado de destino, aviso de cartesiano.
3) Recorrido manual con preset multi-tabla (Reservas 4 tablas).

## 11. Automated Test Plan
- AddTable alias únicos; RemoveTable cascada (joins/filtros); AutoJoinDetector propone
  el join FK correcto; cambiar tipo de join; layout BFS determinista; posiciones
  manuales preservadas.

## 12. Manual Validation Checklist
- [ ] Agregar tablas; auto-join FK aparece; join manual por arrastre
- [ ] Doble clic en la línea cambia el tipo (INNER/LEFT/RIGHT/FULL/CROSS)
- [ ] Mover una tarjeta y reordenar sin que el auto-layout la pise
- [ ] Menú contextual: quitar tabla/join, seleccionar columnas
- [ ] Quitar tabla intermedia no deja joins colgantes
- [ ] Tabla sin join → aviso de producto cartesiano
- [ ] Soltar join en columna incompatible → aviso
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`QueryBuilder/Architecture.md` (diagrama, joins, auto-layout), `QueryBuilder/API.md`
(QueryModel inmutable).

## 14. User Documentation to produce
«Agregar tablas y relaciones» (joins automáticos y manuales).

## 15. Acceptance Criteria
- Joins editables, posiciones persistentes, cascada correcta, aviso de cartesiano;
  checklist §12 con capturas; suite verde.
