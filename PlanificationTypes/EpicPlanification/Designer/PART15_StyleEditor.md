# PART15 — StyleEditor (catálogo de estilos)

## 1. Purpose
El editor de estilos del estudio: `StyleEditorWindow` sobre `StyleCatalogModel`
(rename actualiza referencias, delete reencadena herencia; `StyleSheet.Remove` en
Core), aplicación de estilos a controles y herencia entre estilos.

## 2. Current State
Funcional (Fase 23). Fase 28: tema aplicado, catch en operaciones. Rename/delete
seguros ya implementados.

## 3. Comparison against DevExpress
DevExpress: galería visual de estilos, asignación de estilos «impares/pares» a
detalle, herencia visible como árbol, y estilos de reporte reutilizables entre
documentos (biblioteca). AegiReports: rename/delete seguros y herencia sí; falta
galería visual, estilos alternados y biblioteca compartida.

## 4. Missing Features
- Vista de galería con preview de cada estilo (fondo/fuente/borde).
- Estilos alternados (par/impar) enlazables a bandas de detalle/tabla.
- Biblioteca de estilos exportable/importable entre reportes (evaluar 1.0 vs post).

## 5. UX Problems
- Árbol de herencia no visualizado; editar un estilo base no muestra qué hereda.
- Sin preview del efecto al seleccionar un estilo.

## 6. Backend Problems
- Estilos alternados: decidir modelo (propiedad de banda que referencia dos estilos).

## 7. Frontend Problems
- Editores de color/borde/fuente deben ser los mismos del property grid (PART07) —
  no duplicar.

## 8. Technical Debt
- Reutilizar editores ricos del PART07 (dependencia de orden: PART07 antes).

## 9. Required Improvements
1. Galería con preview + árbol de herencia visible.
2. Estilos alternados en bandas de detalle/tabla.
3. Biblioteca import/export (o límite formal si excede 1.0).

## 10. Implementation Plan
1) Modelo: herencia como árbol (función pura); alternado (referencia dual).
2) UI: galería, preview, editores compartidos con PART07.
3) Recorrido manual.

## 11. Automated Test Plan
- Rename/delete con referencias y herencia (existente, sin regresión).
- Herencia efectiva resuelta (base→derivado→control); alternado par/impar aplica.
- Import/export round-trip si se implementa.

## 12. Manual Validation Checklist
- [ ] Crear estilo, aplicarlo a control, ver preview
- [ ] Herencia: editar base propaga a derivados (árbol visible)
- [ ] Rename actualiza refs; delete reencadena sin romper
- [ ] Estilos alternados en detalle → filas par/impar distintas en preview
- [ ] Guardar/reabrir conserva estilos y asignaciones
- [ ] Undo/redo
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Designer/Architecture.md` (modelo de estilos/herencia).

## 14. User Documentation to produce
«Estilos de reporte» (crear, heredar, alternar, aplicar).

## 15. Acceptance Criteria
- Galería + herencia visible + alternados operativos; editores compartidos con PART07;
  checklist §12 con capturas; suite verde.
