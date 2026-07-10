# PART03 — GroupingSummaries (agrupación multinivel y sumarios)

## 1. Purpose
Auditar `GroupedDocumentExpander`: orden estable y determinista, partición en grupos
anidados, emisión encabezado→detalles→pie por grupo, y sumarios (subtotales/totales,
número de fila/grupo) mediante los agregados del motor de expresiones sobre contextos en
capas (`GroupScope`/`DetailScope`). Es el corazón de los reportes agrupados.

## 2. Current State
Implementado y robusto. `SortRecords` evalúa cada clave una vez por registro y usa `OrderBy`
estable (empates conservan orden de la fuente). `Partition` agrupa registros adyacentes con
clave igual (`ExpressionValues.AreEqual`). Cadena de contextos raíz → `GroupScope` (por
nivel) → `DetailScope` → registro resuelve `[Key]`, `[Records…]`, `[RowNumber]`,
`[SeenRecords…]`. Emite diagnóstico `GroupBandMissing` si falta la banda de un nivel. Es el
sucesor del expander plano para todo escenario con datos.

## 3. Comparison against DevExpress
DevExpress agrupa multinivel con `GroupHeaderBand`/`GroupFooterBand` y funciones de sumario
(`sumSum`, `sumCount`, running totals). AegiReports tiene paridad conceptual vía agregados de
expresiones. Auditar: presencia del catálogo completo de agregados de grupo y running totals
(coordina con **Expressions PART03_Aggregates**).

## 4. Missing Features
- Confirmar cobertura de agregados de grupo (Sum/Avg/Min/Max/Count/Distinct) y **running
  totals** acumulados a través de grupos.
- Orden de grupo por un agregado (p. ej. grupos ordenados por total descendente), no solo
  por la clave.

## 5. UX Problems
- Si falta la banda de un nivel se emite warning, pero el usuario del designer no lo ve como
  guía visual (coordinar con Designer PART10_Bands).

## 6. Backend Problems
- Todo correcto; verificar que el orden por clave y por `DetailSort` compone bien con
  agregados y que el determinismo se mantiene con claves nulas/mixtas.

## 7. Frontend Problems
N/A (produce documento expandido; el visor lo pinta).

## 8. Technical Debt
- Ordenar grupos por un agregado exige un paso extra tras particionar → decisión 1.0.
- Coordinar el catálogo de agregados con Expressions (fuente única de funciones).

## 9. Required Improvements
1. Auditar/completar agregados de grupo y running totals contra Expressions PART03.
2. (Opcional 1.0) ordenación de grupos por agregado.
3. Corpus de pruebas con datos hoteleros (ingresos por hotel→mes→tipo de habitación).

## 10. Implementation Plan
1) Inventariar agregados usados por reportes hoteleros y verificar cobertura.
2) Cerrar huecos coordinando con Expressions; añadir tests deterministas.
3) Recorrido manual con reporte agrupado de 3 niveles.

## 11. Automated Test Plan
- Orden estable: empates conservan orden de origen.
- Partición correcta multinivel; subtotales por grupo y total general exactos.
- `[Key]`/`[RowNumber]`/agregados resuelven en la banda correcta.
- Claves nulas/mixtas agrupan de forma determinista.

## 12. Manual Validation Checklist
- [ ] Reporte hotelero agrupado hotel→mes: subtotales por grupo correctos
- [ ] Total general coincide con la suma de subtotales
- [ ] Numeración de fila reinicia/continúa según lo esperado
- [ ] Grupos ordenados de forma estable y reproducible
- [ ] Falta de banda de nivel produce diagnóstico visible

## 13. Technical Documentation to produce
`Tables/Architecture.md` (agrupación, contextos en capas, sumarios) — PART11.

## 14. User Documentation to produce
Tema «Agrupar y totalizar en tablas» — PART12.

## 15. Acceptance Criteria
- Agregados de grupo auditados/completos; determinismo probado; corpus hotelero verde;
  §12 con capturas; suite verde.
