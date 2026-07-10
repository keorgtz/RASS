# PART06 — ReportExplorer (explorador del documento)

## 1. Purpose
El panel de estructura del reporte: `ReportExplorerModel` — árbol documento→bandas→
controles, renombrar (F2), eliminar, reordenar (Alt+↑↓), selección bidireccional con
la superficie.

## 2. Current State
Funcional (Fase 23). Selección sincronizada en ambos sentidos; operaciones undoables.
Fase 28: TreeView con estilo Meridian implícito.

## 3. Comparison against DevExpress
DevExpress ofrece además: iconos por tipo de nodo, drag & drop para reparentar
controles entre bandas, multi-selección desde el árbol, y visibilidad (ojo) por nodo.
AegiReports: sin reparenting por árbol ni multi-selección desde el árbol.

## 4. Missing Features
- Reparenting por arrastre en el árbol (control → otra banda) — pendiente histórico
  («bands editing/reparenting») a decidir para 1.0.
- Multi-selección en el árbol (Ctrl/Shift) reflejada en la superficie.
- Iconos por tipo de nodo.

## 5. UX Problems
- Nombres default poco descriptivos (`TextControl1`); el árbol debería mostrar un
  extracto del contenido («[Amount]», «Título…») como texto secundario.

## 6. Backend Problems
- Reparent requiere comando undoable nuevo (`ReparentControlCommand`) con validación
  de banda destino.

## 7. Frontend Problems
- F2 inline edit: verificar commit/cancel con Enter/Esc y validación de duplicados.

## 8. Technical Debt
- Ninguna crítica.

## 9. Required Improvements
1. Multi-selección en árbol ↔ superficie.
2. Reparenting por arrastre con `ReparentControlCommand` (o exclusión formal 1.0
   documentada si el costo excede el valor — decidir en Architecture Review).
3. Iconos por tipo + texto secundario con extracto.

## 10. Implementation Plan
1) Modelo: extender selección a set (ya existe multi-selección en superficie);
   extracto por control (función pura).
2) Comando `ReparentControlCommand` + tests undo/redo.
3) WPF: iconos, drag en árbol, F2 robusto.
4) Recorrido manual.

## 11. Automated Test Plan
- Reparent: mover/undo/redo, banda inválida rechaza; renombrar duplicado rechaza;
  reorden Alt+↑↓ estable; extracto por tipo de control.

## 12. Manual Validation Checklist
- [ ] Árbol refleja documento real (bandas y controles, iconos)
- [ ] Clic en nodo selecciona en superficie y viceversa; multi-selección coherente
- [ ] F2 renombra; Esc cancela; duplicado rechazado con aviso
- [ ] Alt+↑/↓ reordena; undo/redo
- [ ] Arrastrar control a otra banda (si se aprueba reparenting) + undo
- [ ] Eliminar desde árbol + undo
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado completo · [ ] Mouse

## 13. Technical Documentation to produce
`Designer/Architecture.md` (ReportExplorer/selección), `Designer/Limitations.md`
(si reparenting queda fuera de 1.0).

## 14. User Documentation to produce
«Estructura del reporte» (explorador, renombrar, reordenar).

## 15. Acceptance Criteria
- Selección bidireccional exacta incluso múltiple; decisión de reparenting cerrada e
  implementada o documentada; checklist §12 con capturas; suite verde.
