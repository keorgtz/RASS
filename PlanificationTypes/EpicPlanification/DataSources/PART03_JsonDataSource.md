# PART03 — JsonDataSource (archivos y contenido JSON)

## 1. Purpose
La fuente JSON: `JsonDataSource` (desde archivo/stream/string, con ruta de colección
`CollectionPath` y aplanado de objetos anidados a `DataRecord`), su descubrimiento de
esquema y su uso desde el wizard.

## 2. Current State
Funcional (Fase 22). `FromFile`/stream/string; `CollectionPath` selecciona el arreglo;
aplanado de anidados. El Demo lo ofrece como proveedor en el wizard.

## 3. Comparison against DevExpress
DevExpress JSON Data Source: URI/archivo/string, ruta al arreglo, y descubrimiento de
esquema con inferencia de tipos. AegiReports equivalente; auditar inferencia de tipos
(número/fecha/bool/null), arrays anidados (detalle) y JSON grande (streaming).

## 4. Missing Features
- Inferencia de tipos robusta (fechas ISO, números vs strings numéricos, bool, null).
- Arrays anidados como detalle (colección dentro de registro) para subreportes/tablas.
- Fuente JSON desde URL/endpoint (evaluar 1.0; hoy archivo/stream/string).
- Manejo de JSON grande por streaming (no cargar todo en memoria).

## 5. UX Problems
- En el wizard, la «ruta de la colección» necesita ayuda/validación (ejemplo
  `data.items`); previsualizar el esquema descubierto.

## 6. Backend Problems
- Aplanado: política de nombres de columna para anidados (`obj.sub`) documentada y
  estable; colisiones de nombres resueltas.
- Tipos: números grandes/decimales y fechas ISO mapeados consistentemente.

## 7. Frontend Problems
N/A (se refleja en el wizard).

## 8. Technical Debt
- La inferencia de tipos de JSON debe alinearse con la normalización del PART01.

## 9. Required Improvements
1. Inferencia de tipos robusta + arrays anidados como detalle.
2. Streaming para archivos grandes; (opcional) fuente por URL.
3. Ayuda/validación de `CollectionPath` en el wizard + preview de esquema.

## 10. Implementation Plan
1) Modelo: inferencia de tipos, detalle anidado, streaming + tests.
2) Wizard: ayuda de ruta, preview de esquema (coordina PART07).
3) Recorrido manual con un JSON hotelero real (reservas anidadas).

## 11. Automated Test Plan
- Parseo archivo/stream/string; `CollectionPath` selecciona el arreglo; aplanado y
  nombres; inferencia de tipos (fecha/número/bool/null); array anidado como detalle;
  JSON grande por streaming.

## 12. Manual Validation Checklist
- [ ] Cargar JSON desde archivo con `CollectionPath` → esquema correcto en el wizard
- [ ] Tipos inferidos: fecha, número, bool, null distinguibles
- [ ] Objeto anidado aplanado (`cliente.nombre`); array anidado como detalle
- [ ] JSON grande no agota memoria (streaming)
- [ ] Ruta de colección inválida → mensaje claro
- [ ] Reporte generado desde JSON idéntico a su equivalente

## 13. Technical Documentation to produce
`DataSources/Architecture.md` (JSON: aplanado, tipos, streaming),
`DataSources/Examples.md` (bind a JSON).

## 14. User Documentation to produce
«Reportar desde JSON» (archivo, ruta de colección, tipos).

## 15. Acceptance Criteria
- Inferencia de tipos robusta, detalle anidado y streaming; ayuda de ruta + preview;
  checklist §12 con capturas; suite verde.
