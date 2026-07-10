# PART09 — SelectionOperations (multi-selección y operaciones de grupo)

## 1. Purpose
Operaciones sobre selección múltiple: `SelectionOperations` + `AlignmentTools`
(6 alineaciones, 2 distribuciones), `ZOrderTools`, igualar tamaños/espaciar,
`GroupResizeInteraction`/`SizingTools.ScaleGroup`, aplicadas vía comandos undoables
(`ApplyBoundsCommand`, `ReorderControlsCommand`).

## 2. Current State
Funcional (Fases 20/23). Todas las operaciones son funciones puras testeadas; los
comandos del estudio las aplican con undo.

## 3. Comparison against DevExpress
DevExpress expone estas operaciones en toolbar contextual + menú Format, usa el
«control ancla» (último seleccionado, con manijas distintas) como referencia de
alineación, y permite igualar al más ancho/alto o al ancla. AegiReports: referencia de
alineación a auditar (¿primero o ancla visible?), manijas del ancla sin distinción.

## 4. Missing Features
- Concepto visible de ANCLA (manijas distintas) y alineación «al ancla».
- Igualar al más ancho/más alto (además de al ancla).
- Grupos persistentes (agrupar/desagrupar) — evaluar: probablemente post-1.0
  documentado (no existe en el modelo de documento).

## 5. UX Problems
- La toolbar contextual debe mostrar solo operaciones aplicables (≥2 para alinear,
  ≥3 para distribuir).

## 6. Backend Problems
- Ninguno; funciones puras correctas.

## 7. Frontend Problems
- Feedback de la operación (flash breve de las guías de alineación resultantes)
  ausente — opcional, motion ≤ 200 ms.

## 8. Technical Debt
- Ninguna.

## 9. Required Improvements
1. Ancla visible + política de referencia documentada y única.
2. Variantes «igualar al mayor» y toolbar contextual sensible al conteo.
3. Decisión formal sobre grupos persistentes (Limitations si queda fuera).

## 10. Implementation Plan
1) Modelo: parámetro de referencia en AlignmentTools (First/Anchor/Largest) + tests.
2) WPF: manijas de ancla, toolbar contextual condicionada.
3) Recorrido manual.

## 11. Automated Test Plan
- Alineaciones/distribuciones con cada referencia; casos de 2/3/N controles;
  igualar al mayor; undo/redo compuesto; z-order con solapamientos.

## 12. Manual Validation Checklist
- [ ] Seleccionar 3+ controles: alinear izquierda/centro/derecha/arriba/medio/abajo
- [ ] Distribuir horizontal/vertical
- [ ] Igualar ancho/alto/ambos (al ancla y al mayor)
- [ ] Espaciar; group resize proporcional con manijas de grupo
- [ ] Traer al frente/enviar al fondo/adelante/atrás con solapados
- [ ] Ancla visualmente distinta; cambiar ancla con clic
- [ ] Undo/redo de CADA operación
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado (menú Format) · [ ] Mouse

## 13. Technical Documentation to produce
`Designer/Architecture.md` (operaciones puras + comandos), `Designer/Limitations.md`
(grupos persistentes si aplica).

## 14. User Documentation to produce
«Alinear y organizar controles» (todas las operaciones con ilustraciones).

## 15. Acceptance Criteria
- Referencia de alineación única, visible y documentada; toolbar contextual correcta;
  checklist §12 con capturas; suite verde.
