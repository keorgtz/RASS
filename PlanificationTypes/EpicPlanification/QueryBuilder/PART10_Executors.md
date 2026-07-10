# PART10 — Executors (intérprete, SQL real y objetos: contrato y equivalencia)

## 1. Purpose
Los ejecutores del `QueryModel`: `InMemoryQueryExecutor` (intérprete del MODELO sobre
`DataRecord`: joins INNER/LEFT/RIGHT/FULL/CROSS, filtros con parámetros, agregados,
orden multi-clave, TopN, paginación), `SqlQueryExecutor` (SQL Server real) y la
ejecución sobre objetos (vía `ObjectMetadataProvider.CreateTables`), todos bajo el
mismo contrato `IQueryExecutor`. `LinqPipelineBuilder` (modo EF, una entidad).

## 2. Current State
Funcional (Fases 25/28). El intérprete es la vista previa OFFLINE honesta con el mismo
contrato que el ejecutor real. `LinqPipelineBuilder` soporta UNA entidad (límite
documentado). Tests de equivalencia semántica intérprete↔generador existen.

## 3. Comparison against DevExpress
DevExpress ejecuta contra la base real (no tiene intérprete offline equivalente). El
intérprete es un diferencial de AegiReports (preview sin conexión). El riesgo: DIVERGENCIA
entre lo que el intérprete devuelve y lo que el SQL real devolvería.

## 4. Missing Features
- Suite de EQUIVALENCIA ampliada: para un corpus de consultas, intérprete y SQL real
  (contra la base sembrada relacional) deben coincidir fila a fila.
- Modo EF multi-entidad (joins entre `IQueryable`) — DECISIÓN DE ALCANCE 1.0 (extender o
  reafirmar «una entidad» documentado).
- Semántica de NULL/casing/collation alineada y documentada entre ejecutores.

## 5. UX Problems
N/A (capa de motor); impacta la confianza en la vista previa.

## 6. Backend Problems
- Casing de strings: el intérprete es case-SENSITIVE entre strings del mismo tipo (como
  el comparador) mientras SQL Server suele ser case-INSENSITIVE por collation — DIVERGENCIA
  conocida a resolver o documentar con precisión.
- Semántica de FULL/RIGHT JOIN y NULLs en agregados alineada.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
- La divergencia de casing es la deuda técnica central de este PART.

## 9. Required Improvements
1. Suite de equivalencia amplia contra la base relacional sembrada; documentar toda
   divergencia intencional (casing/collation).
2. Decisión EF multi-entidad; alinear NULL/casing o documentar.
3. Opción de casing configurable en el intérprete para emular collation (evaluar).

## 10. Implementation Plan
1) Architecture Review: catálogo de divergencias intérprete↔SQL; decisiones registradas.
2) Ampliar tests de equivalencia (corpus de 20+ consultas) + alineación posible.
3) Decisión EF; documentación de semántica.

## 11. Automated Test Plan
- Equivalencia: por cada consulta del corpus, `InMemoryQueryExecutor` vs `SqlQueryExecutor`
  (base sembrada) → mismas filas/orden; divergencias intencionales marcadas y justificadas.
- Contrato `IQueryExecutor`: paginación/cancelación/TopN idénticos entre ejecutores.

## 12. Manual Validation Checklist
- [ ] Ejecutar cada preset con intérprete y con SQL real (base sembrada) → mismos resultados
- [ ] Consulta con string en filtro: comportamiento de casing documentado y esperado
- [ ] FULL/RIGHT JOIN y agregados con NULL coinciden o divergencia documentada
- [ ] Cancelación y paginación idénticas entre ejecutores
- [ ] (si en alcance) EF multi-entidad o límite «una entidad» visible en UI
- [ ] Objetos: ejecutar QueryModel sobre ObjectDataSource coincide con lo esperado

## 13. Technical Documentation to produce
`QueryBuilder/Architecture.md` (ejecutores), `QueryBuilder/Limitations.md` (divergencias
intérprete↔SQL, EF una entidad).

## 14. User Documentation to produce
«Vista previa offline vs ejecución real» (qué esperar, diferencias documentadas).

## 15. Acceptance Criteria
- Equivalencia verificada por corpus amplio; toda divergencia documentada; decisión EF
  cerrada; contrato uniforme; checklist §12; suite verde.
