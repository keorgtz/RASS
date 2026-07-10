# PART07 — StylesFormatting (estilos y formato condicional de tabla)

## 1. Purpose
Cerrar el estilizado de tablas: herencia tipográfica tabla→celda, estilo por celda
(`StyleName` + `Style` override), **filas alternadas (zebra)**, estilos por papel de fila
(Header/Body/Footer) y **formato condicional a nivel de celda**. Es lo que hace que una tabla
se vea profesional sin trabajo manual celda por celda.

## 2. Current State
Herencia implementada: `ResolveCellStyle` hace `tableStyle.Merge(cellStyle).Merge(override)`.
Cada celda referencia un estilo de la hoja del documento y/o un override. **No hay estilo de
fila alternada de primera clase** (habría que estilar celda por celda) ni un enganche de
formato condicional específico de tabla; el formato condicional del producto está en Designer
PART14 y **no persiste en `.aedocx` y aplica plano** (mayor deuda de formato condicional).

## 3. Comparison against DevExpress
DevExpress tiene `EvenStyleName`/`OddStyleName` en tablas y formato condicional con reglas
persistidas. AegiReports: **falta zebra de primera clase** y el formato condicional
comparte la deuda de persistencia de Designer PART14.

## 4. Missing Features
- Estilo de fila alternada (par/impar) de primera clase en `TableControl`/`TableRow`.
- Estilos por papel de fila reutilizables (Header/Footer con estilo temático).
- Formato condicional por celda **persistido** y evaluado (cerrar deuda de Designer PART14
  en el contexto de tablas).

## 5. UX Problems
- Sin zebra automática, el usuario estiliza celda a celda: tosco y propenso a error.

## 6. Backend Problems
- Zebra requiere resolver el índice de fila de detalle en `ResolveCellStyle` o en la
  expansión (`GroupedDocumentExpander` conoce el índice de detalle).
- Formato condicional persistido exige extender el serializador (PART08) y el modelo.

## 7. Frontend Problems
- Editor de estilos de tabla (zebra, papeles) en el estudio (coordina con Designer PART15).

## 8. Technical Debt
- **Formato condicional no persistido / plano** (Designer PART14): en tablas debe cerrarse
  para reglas por celda; decisión 1.0 conjunta con Designer.

## 9. Required Improvements
1. Zebra de primera clase (estilos par/impar) resuelta por índice de fila de detalle.
2. Estilos por papel de fila reutilizables.
3. Formato condicional por celda persistido y evaluado (cerrar deuda con Designer PART14).

## 10. Implementation Plan
1) Modelar zebra (par/impar) y resolverla en la expansión/layout por índice de detalle.
2) Persistir reglas de formato condicional de celda (coordinado con PART08 y Designer PART14).
3) Editor de estilos de tabla; recorrido manual.

## 11. Automated Test Plan
- Filas de detalle alternan estilo par/impar de forma determinista.
- Formato condicional por celda evalúa y persiste (round-trip).
- Herencia tabla→celda→override compone en el orden correcto.

## 12. Manual Validation Checklist
- [ ] Tabla con zebra se ve alternada correctamente en visor y PDF
- [ ] Estilo de encabezado/pie temático aplicado
- [ ] Regla de formato condicional (p. ej. negativos en rojo) evalúa por celda
- [ ] La regla persiste al guardar y reabrir (.aedocx)
- [ ] Tema claro/oscuro coherente

## 13. Technical Documentation to produce
`Tables/Architecture.md` (estilos, zebra, formato condicional) — PART11.

## 14. User Documentation to produce
Tema «Dar estilo y formato condicional a tablas» — PART12.

## 15. Acceptance Criteria
- Zebra de primera clase; formato condicional por celda persistido y evaluado (deuda de
  Designer PART14 cerrada para tablas); §12 con capturas; suite verde.
