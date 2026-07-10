# PART07 — PropertyGrid (grid de propiedades buscable)

## 1. Purpose
El panel de propiedades: `SearchablePropertyGrid` sobre `PropertyEditorModel`
(búsqueda, favoritos, recientes), editores por tipo (`PropertyValueParser`), botón ƒx
hacia el editor de expresiones, reset a default, validación y color swatch.

## 2. Current State
Funcional (Fases 17/20/23). Ediciones undoables vía comandos de sesión. Fase 28:
TextBox/ComboBox internos ya Meridian.

## 3. Comparison against DevExpress
DevExpress agrupa por categorías colapsables, muestra descripción de la propiedad al
pie, ofrece editores ricos (colecciones, fuentes con preview, bordes visuales) y
multi-edición (propiedades comunes de la selección múltiple). AegiReports: sin
descripción al pie, editores ricos parciales, multi-edición a verificar.

## 4. Missing Features
- Multi-edición: aplicar una propiedad común a toda la selección (con un solo undo).
- Panel de descripción de la propiedad seleccionada.
- Editor de bordes visual (lados/grosor/color en un solo control).
- Editor de fuente con preview.

## 5. UX Problems
- Valores modificados vs default deben distinguirse (negrita, como los IDE).
- El reset debe ser descubrible (icono al hover, no solo menú contextual).

## 6. Backend Problems
- Multi-edición requiere comando compuesto (`ApplyPropertyToSelectionCommand`).

## 7. Frontend Problems
- Validación de entrada: errores mostrados inline (borde ámbar + tooltip), sin
  diálogos.

## 8. Technical Debt
- `PropertyValueParser` centraliza parsing; asegurar es-MX correcto en medidas
  («12.5 mm» vs coma decimal — política única documentada).

## 9. Required Improvements
1. Multi-edición con undo único + negrita de no-default + descripción al pie.
2. Editor de bordes visual y fuente con preview.
3. Política de cultura de entrada documentada y testeada (punto y coma decimales).

## 10. Implementation Plan
1) Modelo: intersección de propiedades de la selección; comando compuesto; metadata
   de descripción por propiedad (recurso es-MX).
2) WPF: pie de descripción, negrita, reset al hover, editores de borde/fuente.
3) Cultura: parser acepta ambas convenciones, muestra es-MX; tests.
4) Recorrido manual.

## 11. Automated Test Plan
- Parser: medidas/colores/enums/fechas con ambas convenciones decimales; inválidos.
- Multi-edición: aplica a N controles, un undo revierte todo; propiedades no comunes
  excluidas.
- Modelo de búsqueda/favoritos (existente) sin regresión.

## 12. Manual Validation Checklist
- [ ] Seleccionar control → propiedades correctas; buscar propiedad
- [ ] Editar medida con coma y con punto → ambas aceptadas, display es-MX
- [ ] Valor inválido → borde ámbar + tooltip, sin diálogo
- [ ] ƒx abre editor de expresiones y el resultado queda enlazado
- [ ] Reset a default; negrita solo en modificadas
- [ ] Selección múltiple → editar Width aplica a todos; un undo revierte
- [ ] Color swatch, editor de bordes, fuente con preview
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado (tab entre filas) · [ ] Mouse

## 13. Technical Documentation to produce
`Designer/API.md` (PropertyEditorExtension del SDK), `Designer/Architecture.md`
(pipeline de edición→comando).

## 14. User Documentation to produce
«Editar propiedades» (grid, multi-edición, expresiones en propiedades).

## 15. Acceptance Criteria
- Multi-edición y validación inline operativas; cultura de entrada única documentada;
  checklist §12 con capturas; suite verde.
