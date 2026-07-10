# PART08 — CacheKeys (claves de cache deterministas)

## 1. Purpose
La clave de cache determinista a partir de los valores de parámetro (SDK, AEGI900–901):
dos ejecuciones con los mismos valores producen la misma clave (cache hit); valores
distintos, claves distintas — incluidos tipos tipados (fecha/decimal), multi-valor y
rangos.

## 2. Current State
Funcional (Fase 15). El SDK genera una cache key con valores; el `RenderCache` del
server la usa (TTL, reloj inyectable). Falta verificar el determinismo con los NUEVOS
tipos (multi-valor/rango del PART06) y con cultura.

## 3. Comparison against DevExpress
DevExpress cachea documentos por parámetros. AegiReports equivalente; auditar el
determinismo culture-invariant, el orden estable en multi-valor (mismo conjunto = misma
clave sin importar orden) y la colisión (valores distintos nunca comparten clave).

## 4. Missing Features
- Cache key determinista para multi-valor (orden-insensible) y rangos (desde/hasta).
- Culture-invariance total (una fecha produce la misma clave en cualquier cultura).
- Normalización de valores equivalentes (p. ej. `1.0` == `1`) documentada.

## 5. UX Problems
N/A (infraestructura); impacta el rendimiento del server (cache hit ratio).

## 6. Backend Problems
- Serialización canónica de valores para la clave: fecha/decimal culture-invariant;
  multi-valor ordenado; null representado sin ambigüedad.
- Sin colisiones: valores distintos → claves distintas (hash con dominio suficiente).

## 7. Frontend Problems
N/A.

## 8. Technical Debt
- Coordina con Epic Server (RenderCache) y Epic Performance (cache hit ratio).

## 9. Required Improvements
1. Cache key determinista para multi-valor/rango + culture-invariance.
2. Normalización de equivalentes documentada; null sin ambigüedad.
3. Garantía de no-colisión práctica.

## 10. Implementation Plan
1) Modelo: serialización canónica de valores + clave; multi-valor ordenado + tests.
2) Verificar culture-invariance y no-colisión.
3) Recorrido vía server (cache hit con mismos valores; miss con distintos).

## 11. Automated Test Plan
- Mismos valores → misma clave (incl. multi-valor en distinto orden, fecha en distinta
  cultura); valores distintos → claves distintas; null y equivalentes normalizados.

## 12. Manual Validation Checklist
(vía server/preview)
- [ ] Ejecutar con los mismos parámetros → cache hit (mismo resultado, más rápido)
- [ ] Cambiar un valor → cache miss (recompone)
- [ ] Multi-valor {A,B} == {B,A} → mismo cache
- [ ] Misma fecha en distinta cultura → misma clave
- [ ] Valores distintos nunca comparten resultado cacheado

## 13. Technical Documentation to produce
`Parameters/Architecture.md` (cache keys), remite a `Server/*` (RenderCache) y
`Performance/*`.

## 14. User Documentation to produce
Nota en «Buenas prácticas»/operación: cómo el cache acelera parámetros repetidos.

## 15. Acceptance Criteria
- Cache key determinista y culture-invariant para todos los tipos (incl. multi-valor/
  rango); sin colisiones; checklist §12 con capturas; suite verde.
