# PART09 — TextSelection (selección de texto)

## 1. Purpose
La selección de texto del visor: `TextSelectionModel` (arrastre = líneas, doble clic =
palabra proporcional, triple = línea, Ctrl+C copia), con los overlays de selección como
presentación pura sobre `PageElement`.

## 2. Current State
Funcional (Fase 24). Selección exacta POR LÍNEA (límite declarado en ADR-0026: no
por glifo). Copiar al portapapeles operativo.

## 3. Comparison against DevExpress
DevExpress permite selección por carácter (glifo) y copiar con formato básico.
AegiReports selecciona por línea/palabra/párrafo — el límite de glifo está declarado.
Este PART decide: cerrar el gap (selección por carácter) o reafirmar el límite 1.0.

## 4. Missing Features
- Selección por carácter/glifo (hoy por línea) — DECISIÓN DE ALCANCE 1.0.
- Selección que cruza páginas (arrastre continuo entre páginas).
- Copiar preservando saltos de línea/estructura razonable.

## 5. UX Problems
- El resaltado de selección debe seguir zoom/scroll exactamente.
- Cursor I-beam en modo selección; feedback claro del modo activo.

## 6. Backend Problems
- Selección por glifo requiere posiciones de carácter del Render Tree (medición) — coste
  a evaluar; si se difiere, documentar con precisión el comportamiento por línea.

## 7. Frontend Problems
- Doble/triple clic y arrastre coexistiendo con la mano (pan) sin ambigüedad.

## 8. Technical Debt
- El límite «por línea» es la deuda visible de este PART; resolverlo o reescribir el
  límite con justificación de producto.

## 9. Required Improvements
1. Decidir e implementar selección por glifo, o reafirmar «por línea» documentado.
2. Selección multi-página; copiar con estructura.
3. Resaltado exacto con zoom; I-beam y modos claros.

## 10. Implementation Plan
1) Architecture Review: coste/beneficio de selección por glifo (medición del Render
   Tree) → decisión registrada.
2) Modelo: extender `TextSelectionModel` según la decisión + multi-página + copiar.
3) WPF: overlays con zoom, cursores, coexistencia con pan.
4) Recorrido manual.

## 11. Automated Test Plan
- Selección por palabra/línea/(glifo si se implementa); multi-página; copiado produce
  el texto esperado con saltos; coordenadas con zoom.

## 12. Manual Validation Checklist
- [ ] Arrastrar selecciona; doble clic palabra; triple clic línea/párrafo
- [ ] Selección cruza páginas (si en alcance)
- [ ] Ctrl+C copia; pegar en un editor conserva estructura razonable
- [ ] Resaltado sigue zoom/scroll
- [ ] Cambiar entre mano y selección sin ambigüedad; I-beam correcto
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado (Ctrl+A/Ctrl+C) · [ ] Mouse

## 13. Technical Documentation to produce
`Previewer/Architecture.md` (selección), `Previewer/Limitations.md` (granularidad de
selección si queda por línea).

## 14. User Documentation to produce
«Seleccionar y copiar texto».

## 15. Acceptance Criteria
- Granularidad de selección decidida e implementada o límite reescrito con
  justificación; copiado correcto; resaltado exacto; checklist §12 con capturas;
  suite verde.
