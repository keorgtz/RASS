# PART13 — ExpressionEditor (editor de expresiones)

## 1. Purpose
El editor de expresiones del estudio: `ExpressionEditorControl` (resaltado por tokens
vía `ExpressionTokenizer`, autocompletado de campos/funciones, evaluación REAL contra
los datos de diseño del `StudioAuthoringContext`) y sus puntos de entrada (ƒx del
property grid, formato condicional, campo calculado).

## 2. Current State
Funcional (Fases 17/23). Fase 28: tema aplicado, catch de evaluación con mensaje.

## 3. Comparison against DevExpress
DevExpress Expression Editor: árbol de categorías (campos/constantes/funciones/
operadores) con descripción y firma de cada función, inserción por doble clic, y
validación en vivo con subrayado del error. AegiReports: autocompletado sí; árbol
navegable de funciones con firmas/descripciones, parcial; subrayado de error puntual
a verificar.

## 4. Missing Features
- Panel de catálogo: funciones agrupadas con firma + descripción + ejemplo,
  inserción por doble clic (la fuente debe ser el catálogo REAL del motor, no una
  lista manual — única fuente de verdad).
- Subrayado del token con error (posición del diagnóstico del parser).

## 5. UX Problems
- El resultado de evaluación debe distinguir: valor, error de sintaxis (con posición)
  y error de datos (campo inexistente).
- Fuente monoespaciada y alto de editor cómodos (auditar).

## 6. Backend Problems
- El motor debe exponer su catálogo de funciones con metadatos (nombre, firma,
  categoría, descripción) — si hoy es interno, abrir API de solo lectura.

## 7. Frontend Problems
- Autocompletado: aceptar con Tab/Enter, descartar con Esc, no robar flechas.

## 8. Technical Debt
- Descripciones de funciones vivirán como recurso es-MX único (compartido con la
  documentación de usuario — misma fuente).

## 9. Required Improvements
1. API de catálogo de funciones en Expressions + panel con firmas/descr./ejemplos.
2. Subrayado por posición del diagnóstico + panel de resultado tri-estado.
3. UX de autocompletado pulida.

## 10. Implementation Plan
1) Expressions: `FunctionCatalog.Describe()` (puro, testeable, completo).
2) Editor: panel árbol + subrayado (adorner) + resultado tri-estado.
3) Recorrido manual desde los 3 puntos de entrada.

## 11. Automated Test Plan
- Catálogo: cada función registrada tiene firma/categoría/descripción no vacías (test
  de completitud — falla al agregar función sin documentar).
- Tokenizer/posiciones de error; evaluación con DataRecord de diseño.

## 12. Manual Validation Checklist
- [ ] Abrir desde ƒx, formato condicional y campo calculado
- [ ] Escribir `[Amount] * 1.16` → resaltado + resultado real
- [ ] Autocompletar campo y función (Tab acepta, Esc cierra)
- [ ] Error de sintaxis → subrayado en el punto + mensaje con posición
- [ ] Campo inexistente → error de datos claro
- [ ] Insertar función desde el catálogo por doble clic
- [ ] Aceptar aplica; Cancelar no toca el documento; undo tras aplicar
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Expressions/API.md` (catálogo público) — se coordina con el Epic Expressions;
`Designer/Architecture.md` (editor).

## 14. User Documentation to produce
«Expresiones en AegiReports» (sintaxis + referencia de funciones GENERADA del
catálogo — misma fuente que el panel).

## 15. Acceptance Criteria
- Catálogo completo con test de completitud; subrayado posicional; los 3 puntos de
  entrada validados; checklist §12 con capturas; suite verde.
