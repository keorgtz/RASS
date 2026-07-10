# PART11 — TechnicalDocumentation (documentación técnica de tablas)

## 1. Purpose
Generar TODA la documentación técnica declarada por PART01–PART10 del Epic Tables,
consolidada y coherente, en Markdown, para el desarrollador que construye, estiliza,
persiste o exporta tablas por código.

## 2. Current State
No existe documentación técnica dedicada de tablas; hay docs XML de API. Los PARTs
especificaron qué producir; este PART lo GENERA al final del Epic.

## 3. Comparison against DevExpress
DevExpress documenta `XRTable` por API y escenarios. Meta equivalente para integradores.

## 4. Missing Features
Documentos declarados por los PARTs, aún inexistentes:
- `Architecture.md` (modelo lógico, layout/paginación, agrupación/sumarios, drill-down,
  edición en superficie, estilos/zebra/formato condicional, esquema `.aedocx`, rendimiento)
- `API.md` (construir tablas por código: `TableControl`/`TableColumn`/`TableRow`/`TableCell`,
  `GroupingOptions`, `GroupedDocumentExpander`)
- `Integration.md` (registro del serializador, handler de layout, drill-down por opciones)
- `Limitations.md` (RowSpan si se acota, diferencias por formato de exportación)

## 5. UX Problems
N/A.

## 6. Backend Problems
- Reflejar el CÓDIGO REAL tras cerrar PART01–10 (RowSpan, zebra, formato condicional según
  lo decidido).

## 7. Frontend Problems
N/A.

## 8. Technical Debt
- Ejemplos deben compilar (verificados en el Epic Documentation).

## 9. Required Improvements
Redactar los documentos con diagramas (pipeline de tabla, contextos de grupo), referencias a
tipos reales y ejemplos verificables.

## 10. Implementation Plan
1) Tras cerrar PART01–10, redactar cada documento desde el código final.
2) Enlazar entre sí y desde el README; coordinar con Crosstabs (consume `TableControl`),
   Dashboard, Exporting y Expressions.

## 11. Automated Test Plan
- Verificación de enlaces; snippets compilables delegados al Epic Documentation.

## 12. Manual Validation Checklist
- [ ] Cada documento existe y cubre lo declarado por su PART origen
- [ ] Referencias a tipos coinciden con el código actual
- [ ] Un integrador construye una tabla agrupada por código siguiendo API.md
- [ ] Diagramas legibles; enlaces internos funcionan

## 13. Technical Documentation to produce
(este PART ES la producción) — los documentos de §4.

## 14. User Documentation to produce
N/A (es PART12).

## 15. Acceptance Criteria
- Documentos completos, coherentes con el código final, enlazados; ejemplos verificables;
  revisión editorial pasada.
