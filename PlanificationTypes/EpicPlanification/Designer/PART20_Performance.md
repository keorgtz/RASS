# PART20 — Performance (rendimiento del estudio)

## 1. Purpose
El rendimiento interactivo del estudio: latencia de arrastre/resize/selección con
documentos grandes, coste de la vista previa incremental, memoria con documentos de
muchas páginas/controles y fluidez del scroll/zoom de la superficie.

## 2. Current State
La superficie usa modelos puros eficientes; el preview es incremental
(`SessionDiff`). No hay presupuestos formales ni mediciones de latencia de
interacción del designer (el Epic Performance cubre el pipeline; ESTE PART cubre la
interacción del designer específicamente).

## 3. Comparison against DevExpress
DevExpress mantiene fluidez con reportes de cientos de controles. AegiReports debe
fijar y cumplir presupuestos equivalentes: arrastre a 60 fps, selección instantánea,
preview < X ms tras edición.

## 4. Missing Features
- Presupuestos de latencia de interacción documentados (arrastre, selección, undo,
  refresh de preview) y medidos.
- Virtualización de la superficie si el número de adorners/controles degrada el fps.

## 5. UX Problems
- Con muchos controles, el hit-test y el dibujo de manijas/guías pueden degradar el
  arrastre — medir y optimizar solo si excede presupuesto.

## 6. Backend Problems
- El `SmartGuideEngine` compara contra hermanos; con N grande puede ser O(N²) por
  frame — auditar y acotar (solo candidatos cercanos).

## 7. Frontend Problems
- Adorners: reutilizar en vez de recrear por frame; congelar brushes/pens.

## 8. Technical Debt
- Ninguna medida aún; este PART crea la línea base del designer.

## 9. Required Improvements
1. Tabla de presupuestos de interacción + arnés de medición (reusa Benchmarks).
2. Optimización dirigida SOLO donde falle (guías, hit-test, adorners).
3. Documento de estrés canónico (p. ej. 300 controles / 50 páginas) en el corpus.

## 10. Implementation Plan
1) Benchmarks: escenarios de interacción del designer con baseline comprometida.
2) Perfilar arrastre/selección/preview; optimizar guías/adorners si superan
   presupuesto.
3) Recorrido manual con el documento de estrés.

## 11. Automated Test Plan
- Micro-benchmarks (BenchmarkDotNet o harness propio) de: cálculo de guías con N=300,
  diff de preview, aplicación de comando de grupo. RegressionGate contra baseline.

## 12. Manual Validation Checklist
- [ ] Documento de 300 controles: arrastrar un control es fluido (sin lag perceptible)
- [ ] Selección por lazo de 100 controles responde
- [ ] Preview tras edición < presupuesto; UI nunca congela
- [ ] Zoom/scroll de la superficie fluido
- [ ] Undo/redo masivo no acumula memoria (medir working set antes/después)
- [ ] Abrir/cerrar 10 documentos grandes sin fuga (working set estable)
- [ ] Tema claro/oscuro sin impacto de perf · [ ] High DPI

## 13. Technical Documentation to produce
`Designer/Performance.md` (presupuestos, mediciones, técnicas).

## 14. User Documentation to produce
Nota en «Buenas prácticas»: límites recomendados de controles por reporte.

## 15. Acceptance Criteria
- Presupuestos definidos y cumplidos; sin fugas en el escenario de estrés;
  RegressionGate activo; checklist §12 con mediciones; suite verde.
