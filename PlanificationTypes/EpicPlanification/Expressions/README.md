# Epic: Expressions — backlog

**Prioridad:** P1 · **Complejidad:** Media · **Completitud (8 puertas):** 45 % ·
**Estado:** PARTs detallados (pendiente de ejecución)

## Alcance

`AegiReports.Expressions` (motor sandboxed: tokenizer, parser, evaluador, funciones,
agregados Sum/Count/etc., contexto de bandas), la sustitución `[Campo]`/`[Param.X]`/
`[Loc.X]` en el pipeline y el editor de expresiones del estudio
(`ExpressionEditorControl` + ExpressionTokenizer/ExpressionEditorModel del proyecto UX).

## Objetivos

1. Catálogo de funciones documentado y comparado contra DevExpress (fecha/texto/
   matemática/lógica/agregados) — cerrar gaps de funciones de alto uso.
2. Mensajes de error de expresión accionables (posición, sugerencia).
3. Sandbox verificado: sin acceso a tipos/reflection/IO desde expresiones.
4. Editor con autocompletado y evaluación real contra datos de diseño validado.

## Dependencias

- Ninguna entrante. Alimenta: Designer (editor), ConditionalFormatting, Tables.

## PARTs planificados (10)

- PART01_EngineCore — gramática, tipos, coerciones, null-semantics
- PART02_FunctionCatalog — inventario vs DevExpress, gaps a cerrar
- PART03_Aggregates — alcances de banda/grupo/reporte, anidamiento
- PART04_BindingSubstitution — [Campo]/[Param]/[Loc], rutas anidadas, DataRecord
- PART05_Sandbox — límites de seguridad, presupuesto de evaluación, recursión
- PART06_Diagnostics — errores con posición, códigos, recuperación
- PART07_EditorUX — resaltado, autocompletado, evaluación en vivo, ƒx del grid
- PART08_Performance — expresiones por millar de filas, cache de parse
- PART09_TechnicalDocumentation
- PART10_UserDocumentation
