# Epic: Performance — backlog

**Prioridad:** P1 · **Complejidad:** Alta · **Completitud (8 puertas):** 35 % ·
**Estado:** Backlog

## Alcance

`Benchmarks` (harness reproducible, SnapshotStore, BenchmarkBaseline + RegressionGate
AEGI990) y el rendimiento transversal del producto: composición, expansión de datos,
export, preview (virtualización/cache), designer (latencia de interacción), server
(throughput) y memoria.

## Objetivos

1. Presupuestos de rendimiento OFICIALES por escenario (p. ej. 5,000 filas < 30 s ya
   existe como test — formalizar la tabla completa y medirla en hardware de
   referencia).
2. RegressionGate activo en CI con líneas base comprometidas.
3. Perfilado real de los hot paths (composición, medición de texto, export PDF) con
   optimizaciones dirigidas SOLO donde el presupuesto falle.
4. Escenarios de estrés: documentos de 1,000+ páginas, dashboards con 50 widgets,
   sesiones de preview prolongadas (fugas).

## Dependencias

- Ninguna entrante dura. Transversal: se ejecuta tras los Epics de superficie mayores.

## PARTs planificados (9)

- PART01_Budgets — tabla oficial de presupuestos por escenario
- PART02_Baselines — líneas base en hardware de referencia, RegressionGate en CI
- PART03_CompositionPerf — pipeline, expansión, medición de texto
- PART04_ExportPerf — PDF/XLSX/imagenes con documentos grandes
- PART05_InteractivePerf — preview (scroll/zoom), designer (drag/undo), latencias
- PART06_ServerThroughput — jobs/seg, cache hit ratio, memoria por worker
- PART07_MemoryLeaks — sesiones prolongadas, weak refs, imágenes
- PART08_TechnicalDocumentation
- PART09_UserDocumentation (guía de tuning)
