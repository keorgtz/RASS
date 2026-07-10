# PART11 — UndoRedo (historial de comandos)

## 1. Purpose
El sistema undo/redo del estudio: comandos undoables de `DesignSession` (bounds,
propiedades, alta/baja, reorden, bandas, estilos), coalescencia de ediciones
continuas (arrastres), límites de historial y su exposición en UI (comandos, tooltips
descriptivos).

## 2. Current State
Funcional desde Fase 9, ampliado en 23 (ApplyBounds/Reorder/Remove/MoveBand). Los
arrastres generan un solo comando por gesto. Dashboard designer usa instantáneas del
serializador (mecanismo distinto, correcto para su caso).

## 3. Comparison against DevExpress
DevExpress ofrece tooltips «Deshacer: mover control» y profundidad amplia. Sin
dropdown de historial (tampoco lo exige la paridad). AegiReports: verificar
descripciones por comando y política de límite.

## 4. Missing Features
- Descripción legible por comando («Deshacer: Alinear a la izquierda») en tooltip.
- Límite de historial configurable con default documentado (¿100?).

## 5. UX Problems
- Sin feedback de qué se deshizo (el tooltip lo resuelve).

## 6. Backend Problems
- Auditar TODA mutación del documento pasa por comando (barrido: cualquier setter
  directo desde UI es un bug de esta parte).

## 7. Frontend Problems
- Ctrl+Z/Ctrl+Y deben funcionar con el foco en cualquier panel (no solo superficie),
  salvo dentro de TextBox en edición.

## 8. Technical Debt
- Dos mecanismos de undo (comandos vs instantáneas en dashboard) — aceptable, pero
  debe quedar documentado con su razón.

## 9. Required Improvements
1. `Description` en cada comando + tooltips dinámicos en Deshacer/Rehacer.
2. Límite de historial + test de recorte.
3. Barrido anti-mutación-directa + atajos globales con excepción de edición de texto.

## 10. Implementation Plan
1) Modelo: propiedad Description; auditoría de call-sites de mutación.
2) Shell: tooltips, routing global de atajos.
3) Recorrido manual de estrés (50 operaciones mixtas, undo total, redo total).

## 11. Automated Test Plan
- Cada tipo de comando: do/undo/redo idempotente; secuencias largas; coalescencia de
  arrastre (un gesto = un comando); límite recorta el extremo antiguo; descripciones
  no vacías.

## 12. Manual Validation Checklist
- [ ] 20 operaciones variadas → undo total → documento inicial exacto (preview igual)
- [ ] Redo total → estado final exacto
- [ ] Arrastre largo = UN undo
- [ ] Tooltips describen la operación
- [ ] Ctrl+Z con foco en propiedades/árbol funciona; dentro de un TextBox edita texto
- [ ] Editar tras undo intermedio poda el redo
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Designer/Architecture.md` (patrón de comandos; nota instantáneas del dashboard).

## 14. User Documentation to produce
Sección «Deshacer y rehacer» dentro de la guía del estudio.

## 15. Acceptance Criteria
- Ninguna mutación fuera de comandos; undo/redo exactos en estrés; tooltips
  descriptivos; checklist §12; suite verde.
