# PART02 — Canvas (lienzo con grid responsive)

## 1. Purpose
El lienzo del diseñador: grid de 12 columnas, colocación de widgets (`GridPlacement` +
overrides Wide/Medium/Narrow), arrastre/redimensionado con snap al grid, capas
(z-order), y el `DashboardLayoutEngine` puro que resuelve el layout responsive
(Narrow = reflow a una columna).

## 2. Current State
Funcional (Fase 26). Grid 12 col, drag/resize/snap, overrides responsive, capas. El
breakpoint lo decide el ancho real del host. El layout es puro y testeado.

## 3. Comparison against DevExpress
DevExpress Dashboard usa un layout de items con flujo y tamaños relativos, más free-form
opcional. AegiReports usa grid 12 col con overrides responsive (más predecible).
Auditar: guías de alineación entre widgets, selección múltiple de widgets, y previsualizar
los breakpoints (Wide/Medium/Narrow) desde el diseñador.

## 4. Missing Features
- Previsualizar cada breakpoint (Wide/Medium/Narrow) sin salir del diseñador.
- Guías de alineación entre widgets al arrastrar; snap a bordes de vecinos.
- Selección múltiple de widgets (mover/alinear/igualar en grupo).
- Editar los overrides responsive por widget desde una UI clara (no solo propiedad).

## 5. UX Problems
- Feedback del grid (columnas visibles al arrastrar); celda destino resaltada.
- Widget que se sale del grid o se solapa: aviso visual.

## 6. Backend Problems
- `DashboardLayoutEngine`: confirmar determinismo del reflow Narrow y de los overrides;
  colisiones de colocación resueltas de forma estable.

## 7. Frontend Problems
- Redimensionado con snap a unidades de columna/fila; manijas usables en High DPI.

## 8. Technical Debt
- Ninguna crítica; el motor es puro y testeado.

## 9. Required Improvements
1. Preview de breakpoints + edición clara de overrides por widget.
2. Guías de alineación + snap a vecinos + selección múltiple.
3. Aviso de solapamiento/salida de grid.

## 10. Implementation Plan
1) Modelo: API de preview por breakpoint; guías/colisiones como funciones puras.
2) WPF: grid visible, guías, selección múltiple, editor de overrides.
3) Recorrido manual con un dashboard de 5+ widgets en los 3 breakpoints.

## 11. Automated Test Plan
- Layout: colocación por GridPlacement + overrides; reflow Narrow determinista;
  colisiones estables; selección múltiple mueve el grupo coherente.

## 12. Manual Validation Checklist
- [ ] Arrastrar/redimensionar widgets con snap al grid; celda destino resaltada
- [ ] Previsualizar Wide/Medium/Narrow; el Narrow reflowa a una columna
- [ ] Editar override responsive de un widget y verlo aplicado
- [ ] Selección múltiple: mover/alinear en grupo
- [ ] Solapamiento/salida de grid → aviso
- [ ] Capas: traer al frente/enviar al fondo
- [ ] Undo/redo de colocación
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado (flechas mueven) · [ ] Mouse

## 13. Technical Documentation to produce
`Dashboard/Architecture.md` (layout responsive, grid, overrides).

## 14. User Documentation to produce
«Organizar el lienzo» (grid, tamaños, responsive).

## 15. Acceptance Criteria
- Preview de breakpoints, guías y selección múltiple operativas; reflow determinista;
  checklist §12 con capturas; suite verde.
