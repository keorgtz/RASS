# PART08 — DesignSurface (superficie de diseño)

## 1. Purpose
La superficie: página con sombra, reglas (`RulerControl`), grid de 5 mm, guías
inteligentes (`SmartGuideEngine`) + snap (`SnapEngine`), mediciones vivas en mm
(`LiveMeasurements`), cursores (`CursorResolver`), toolbar contextual, edición de
texto in-place, zoom y arrastre/resize de controles (`DesignSurfaceControl`).

## 2. Current State
Funcional y maduro (Fases 9/20/23). Interacciones como modelos puros testeados; WPF
pinta. Es la pieza con más horas de vuelo del designer.

## 3. Comparison against DevExpress
DevExpress añade: zoom con Ctrl+rueda y combo de zoom, selección por lazo (rubber
band), copiar/pegar/duplicar controles con offset, nudge por teclado (flechas = 1 px/
grid), bloqueo de controles, y marcas de overflow (control fuera de banda).
AegiReports: verificar lazo, nudge, clipboard de controles y aviso de overflow.

## 4. Missing Features
- Clipboard de controles (copiar/cortar/pegar/duplicar con offset) — si falta, es
  gap P0 del designer.
- Selección por lazo (rubber band) — verificar; si falta, agregar.
- Nudge por flechas (mover 1 unidad de grid; Shift = fino) — verificar.
- Indicador visual de control desbordado de su banda.

## 5. UX Problems
- Zoom: atajos Ctrl+rueda/Ctrl+0 (100 %) y persistencia por sesión.
- El grid/guías deben respetar tema oscuro (líneas tenues, no negras).

## 6. Backend Problems
- Clipboard requiere serialización de fragmento (reusar serializadores .aedocx de
  controles — ya existen desde Fase 27) + comando pegar undoable.

## 7. Frontend Problems
- Edición in-place: verificar commit al perder foco y Esc para cancelar.

## 8. Technical Debt
- Ninguna crítica; los modelos puros están bien factorizados.

## 9. Required Improvements
1. Clipboard completo de controles (XML .aedocx como formato) + duplicar Ctrl+D.
2. Lazo de selección + nudge de teclado (si faltan tras auditoría).
3. Overflow visual + zoom UX (Ctrl+rueda, Ctrl+0, combo en status bar).

## 10. Implementation Plan
1) Auditoría de interacción (2 h con checklist §12 como guía) → confirmar faltantes.
2) Modelo: `ControlClipboard` (serializa/deserializa fragmento, offset de pegado),
   comandos Pegar/Duplicar; `NudgeOperation`; hit-test de lazo.
3) WPF: adorner de lazo, atajos, overflow badge, zoom UX.
4) Recorrido manual completo.

## 11. Automated Test Plan
- Clipboard: round-trip de cada tipo de control (incl. tabla/chart vía serializadores
  registrados), offset acumulado, pegar entre bandas.
- Nudge/lazo/overflow como funciones puras (rectángulos).
- Snap/guías/mediciones: suites existentes sin regresión.

## 12. Manual Validation Checklist
- [ ] Crear/mover/redimensionar con snap y guías; mediciones vivas correctas en mm
- [ ] Reglas siguen zoom y scroll; indicador de cursor
- [ ] Copiar/pegar/duplicar (mismo y otra banda) + undo
- [ ] Lazo selecciona; Shift+clic agrega; Esc deselecciona
- [ ] Flechas mueven; Shift+flechas fino; con snap activado/desactivado
- [ ] Editar texto in-place: Enter commit, Esc cancela
- [ ] Control desbordado marca overflow
- [ ] Ctrl+rueda zoom al cursor; Ctrl+0 = 100 %
- [ ] Tema claro/oscuro (grid/guías legibles) · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Designer/Architecture.md` (superficie/interacciones puras), `Designer/Performance.md`
(render de superficie con cientos de controles).

## 14. User Documentation to produce
«Diseñar en la superficie» (selección, snap, guías, clipboard, zoom, atajos).

## 15. Acceptance Criteria
- Clipboard/lazo/nudge operativos y undoables; cero interacciones toscas en el
  recorrido; checklist §12 con capturas; suite verde.
