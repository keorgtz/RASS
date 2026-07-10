# PART10 — PerformanceLimits (volúmenes, streaming y memoria)

## 1. Purpose
El comportamiento de las fuentes bajo volumen: materialización de grandes conjuntos,
streaming donde aplique (SQL/JSON), consumo de memoria y los presupuestos de rendimiento
del acceso a datos, evitando cargar en memoria más de lo necesario.

## 2. Current State
El pipeline soporta 5,000 filas < 30 s (test de la Fase 27). No hay presupuestos
formales del ACCESO A DATOS ni streaming sistemático; la mayoría de fuentes materializan
la colección completa (`RecordMaterializer` enumera una vez a lista).

## 3. Comparison against DevExpress
DevExpress maneja datasets grandes con paginación de datos y bajo consumo. AegiReports
debe fijar presupuestos y verificar que no duplica los datos en memoria (fila cruda +
DataRecord + bands).

## 4. Missing Features
- Streaming de lectura para SQL/JSON grandes (procesar por lotes, no toda la colección).
- Presupuestos de memoria/tiempo del acceso a datos por escenario.
- Materialización perezosa donde el pipeline lo permita (expansión por demanda).

## 5. UX Problems
- Con fuentes grandes, feedback de progreso de carga (filas leídas) y cancelación.

## 6. Backend Problems
- `RecordMaterializer` enumera a lista una vez (correcto para determinismo); evaluar
  streaming sin romper determinismo (orden estable).
- Evitar triple copia (fila del driver → DataRecord → banda).

## 7. Frontend Problems
N/A (impacta visor/preview con documentos grandes, cubierto por Epic Performance).

## 8. Technical Debt
- El Epic Performance cubre el pipeline global; este PART cubre específicamente el
  ACCESO A DATOS.

## 9. Required Improvements
1. Streaming/lotes para SQL/JSON grandes con orden determinista.
2. Presupuestos de memoria/tiempo del acceso a datos + medición.
3. Reducir copias intermedias donde sea seguro.

## 10. Implementation Plan
1) Modelo: lectura por lotes en SqlDataSource/JsonDataSource (opcional, determinista).
2) Benchmarks del acceso a datos (reusa Benchmarks) + baseline.
3) Recorrido manual con una fuente de 50k+ filas.

## 11. Automated Test Plan
- Materialización de 50k filas dentro del presupuesto de memoria/tiempo; orden estable;
  streaming no altera el resultado vs materialización completa; sin fuga tras 10 cargas.

## 12. Manual Validation Checklist
- [ ] Fuente de 50k+ filas: reporte compone dentro del presupuesto
- [ ] Progreso de carga con filas leídas; cancelable
- [ ] Memoria estable (sin triple copia perceptible); sin fuga tras cargas repetidas
- [ ] Streaming (si implementado) da el mismo resultado que materialización completa
- [ ] JSON grande por streaming no agota memoria (liga PART03)

## 13. Technical Documentation to produce
`DataSources/Performance.md` (presupuestos, streaming, memoria) — coordina Epic
Performance.

## 14. User Documentation to produce
Nota en «Buenas prácticas»: volúmenes recomendados y cómo manejar fuentes grandes.

## 15. Acceptance Criteria
- Presupuestos definidos y cumplidos; streaming determinista donde aplique; sin fugas;
  checklist §12 con mediciones; suite verde.
