# PART06 — SchemaDiscovery (descubrimiento de esquema)

## 1. Purpose
El descubrimiento de esquema desde una fuente: `SchemaDiscovery.Discover(IRecordSource,
maxDepth)` (deriva `DataSchema` de la forma de los datos/tipos) y `DataShapeSchema`
(desde `DataRecord`), que alimentan el explorador de campos y los wizards.

## 2. Current State
Funcional (Fase 22). `Discover` recorre la forma hasta `maxDepth` (default 3);
`DataShapeSchema.FromRecords` infiere columnas/tipos de filas sin tipo CLR.

## 3. Comparison against DevExpress
DevExpress descubre el esquema con tipos e infiere campos calculados básicos.
AegiReports: descubrimiento por forma/tipo; auditar la profundidad de anidamiento, la
detección de colecciones (detalle) y la inferencia de tipos desde `DataRecord` sin tipo.

## 4. Missing Features
- Detección de nodos-colección (detalle) para binding maestro-detalle/subreportes.
- Inferencia de tipo desde `DataRecord` cuando la primera fila tiene nulos (muestrear
  varias filas).
- Profundidad configurable con protección contra ciclos en grafos de objetos.

## 5. UX Problems
- El esquema descubierto se muestra en el wizard/explorador; nombres y tipos claros.

## 6. Backend Problems
- Ciclos en grafos de objetos (A→B→A) deben cortarse por `maxDepth`/visitados sin
  desbordar.
- Tipo inferido de columna con nulos: muestrear N filas, no solo la primera.

## 7. Frontend Problems
N/A (se refleja en el explorador de campos, Designer PART05).

## 8. Technical Debt
- Un solo descubrimiento por forma para objetos y por metadata para SQL/EF/Object —
  documentar cuándo se usa cada uno.

## 9. Required Improvements
1. Detección de colecciones (detalle) + inferencia por muestreo de N filas.
2. Protección de ciclos + profundidad configurable.
3. Coherencia entre `Discover` (objetos) y los metadata providers (SQL/EF/Object).

## 10. Implementation Plan
1) Modelo: muestreo de tipos, detección de detalle, corte de ciclos + tests.
2) Alinear con los metadata providers (mismo `DataSchema`/tipos donde aplique).
3) Recorrido manual vía wizard/explorador con datos anidados.

## 11. Automated Test Plan
- `Discover` sobre grafos anidados/ciclos (no desborda); `FromRecords` con nulos en la
  primera fila infiere por muestreo; detección de nodo-colección; profundidad respetada.

## 12. Manual Validation Checklist
- [ ] Descubrir esquema de una fuente anidada → campos simples y de detalle
- [ ] Fuente con nulos en la primera fila infiere tipos correctos (muestreo)
- [ ] Grafo con ciclo no cuelga (cortado por profundidad)
- [ ] Esquema coherente entre objetos (Discover) y SQL/EF/Object (metadata)
- [ ] Explorador de campos muestra el esquema descubierto

## 13. Technical Documentation to produce
`DataSources/Architecture.md` (SchemaDiscovery, DataShapeSchema, relación con metadata).

## 14. User Documentation to produce
Se integra en «Conectar datos» (cómo se descubren los campos).

## 15. Acceptance Criteria
- Detección de detalle, muestreo de tipos y corte de ciclos; coherencia con metadata
  providers; checklist §12 verificada; suite verde.
