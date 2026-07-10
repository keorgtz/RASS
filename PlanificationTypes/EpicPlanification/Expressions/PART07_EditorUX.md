# PART07 — EditorUX (editor de expresiones)

## 1. Purpose
La experiencia del editor de expresiones: `ExpressionEditorControl` — resaltado por
tokens (`ExpressionTokenizer`), autocompletado de campos/funciones, panel de catálogo
(firmas/descripciones/ejemplos del PART02), subrayado del error por posición (PART06),
evaluación en vivo contra los datos de diseño, y sus puntos de entrada (ƒx del property
grid, formato condicional, campo calculado).

## 2. Current State
Funcional (Fases 17/23). Resaltado + autocompletado + evaluación real. Fase 28: tema y
catch. Este PART unifica catálogo (PART02) + diagnósticos (PART06) en una UX pulida.
Nota: es el mismo alcance que Designer PART13 — este PART lidera y aquél lo referencia.

## 3. Comparison against DevExpress
DevExpress Expression Editor: árbol de categorías (campos/funciones/operadores) con
descripción, inserción por doble clic, validación con subrayado y resultado.
AegiReports: autocompletado sí; panel de catálogo navegable con firmas y subrayado por
posición a completar.

## 4. Missing Features
- Panel de catálogo navegable (campos + funciones agrupadas con firma/descr./ejemplo,
  desde el catálogo real del PART02) con inserción por doble clic.
- Subrayado del token con error (posición del PART06) + tooltip del mensaje.
- Resultado tri-estado (valor / error de sintaxis / error de datos) visible.

## 5. UX Problems
- Autocompletado: aceptar con Tab/Enter, cerrar con Esc, sin robar flechas.
- Fuente monoespaciada, alto cómodo, resaltado legible en tema oscuro.

## 6. Backend Problems
- El editor consume el catálogo (PART02) y los diagnósticos (PART06) — no listas
  manuales propias.

## 7. Frontend Problems
- Coexistencia del popup de autocompletado con el subrayado de error sin parpadeo.

## 8. Technical Debt
- Unificar con Designer PART13 (mismo control): este PART es la fuente; PART13 valida su
  uso desde el estudio.

## 9. Required Improvements
1. Panel de catálogo navegable + inserción por doble clic.
2. Subrayado por posición + tooltip + resultado tri-estado.
3. UX de autocompletado pulida; oscuro legible.

## 10. Implementation Plan
1) Editor: panel de catálogo (del PART02), subrayado (del PART06), resultado tri-estado.
2) UX de autocompletado; tema oscuro.
3) Recorrido manual desde ƒx, formato condicional y campo calculado.

## 11. Automated Test Plan
- Tokenizer/resaltado; autocompletado propone campos/funciones correctas; el panel
  refleja el catálogo real; posición de error subrayada; evaluación con DataRecord de
  diseño.

## 12. Manual Validation Checklist
- [ ] Abrir desde ƒx, formato condicional y campo calculado
- [ ] `[Amount] * 1.16` → resaltado + resultado real
- [ ] Autocompletar campo y función (Tab acepta, Esc cierra)
- [ ] Panel de catálogo: navegar, ver firma/ejemplo, insertar por doble clic
- [ ] Error de sintaxis subraya el token + tooltip; error de datos claro
- [ ] Aceptar aplica; Cancelar no toca el documento; undo tras aplicar
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Expressions/Architecture.md` (editor), remite a Designer PART13 para el uso en estudio.

## 14. User Documentation to produce
«El editor de expresiones» (resaltado, autocompletado, catálogo, evaluación en vivo).

## 15. Acceptance Criteria
- Panel de catálogo + subrayado por posición + resultado tri-estado; consume catálogo/
  diagnósticos reales; los 3 puntos de entrada validados; checklist §12 con capturas;
  suite verde.
