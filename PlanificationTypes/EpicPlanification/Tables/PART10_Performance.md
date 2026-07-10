# PART10 — Performance (rendimiento de tablas grandes)

## 1. Purpose
Garantizar que tablas de miles de filas expanden, paginan y renderizan con memoria y tiempo
acotados, aprovechando el diseño determinista (una medición por celda) y sin regresiones al
crecer el volumen. Coordina con Expressions PART08 (caché de árbol de parseo) y DataSources
PART10 (streaming/presupuestos).

## 2. Current State
`TableLayoutHandler` mide cada celda una sola vez y reutiliza alturas; toda la aritmética es
en EMUs exactos. `GroupedDocumentExpander` evalúa cada clave de orden una vez por registro.
Falta un banco de medición formal (filas × columnas × grupos) y presupuestos declarados.

## 3. Comparison against DevExpress
DevExpress maneja reportes largos con paginación perezosa. AegiReports pagina determinista;
auditar que el coste sea lineal en filas y que la expansión agrupada no degrade con muchos
grupos.

## 4. Missing Features
- Banco de rendimiento reproducible (p. ej. 1k/10k/50k filas) con umbrales.
- Presupuesto de memoria por documento expandido (coordina con DataSources PART10).
- Evitar materializar todo cuando no hace falta (streaming aguas arriba).

## 5. UX Problems
- Una tabla enorme no debe congelar el visor; feedback de progreso si excede un umbral
  (coordina con Previewer PART14 prefetch).

## 6. Backend Problems
- `RecordMaterializer.Materialize` materializa registros; con volúmenes altos, medir memoria
  y tiempo de expansión + evaluación de expresiones por celda.
- El coste de recomposición ante drill-down (PART04) escala con el tamaño.

## 7. Frontend Problems
- El pintado del visor debe virtualizar por página (no pintar todo el documento a la vez).

## 8. Technical Debt
- Presupuestos de rendimiento no declarados formalmente; sin banco, las regresiones pasan
  inadvertidas.

## 9. Required Improvements
1. Banco de rendimiento con umbrales de tiempo y memoria (1k/10k/50k filas).
2. Verificar linealidad en filas y comportamiento con muchos grupos.
3. Presupuesto de memoria y política ante exceso (coordina con DataSources PART10).

## 10. Implementation Plan
1) Definir escenarios y umbrales; medir expansión + layout + render.
2) Optimizar puntos calientes (evaluación por celda, materialización) sin romper
   determinismo.
3) Recorrido manual con reporte hotelero grande en el visor.

## 11. Automated Test Plan
- Escenarios 1k/10k filas dentro de umbral de tiempo/memoria (test de rendimiento marcado).
- Coste ~lineal en número de filas; sin fugas al repetir expansión.
- Muchos grupos no degradan de forma superlineal.

## 12. Manual Validation Checklist
- [ ] Reporte de 10k filas abre en el visor en tiempo aceptable
- [ ] Memoria estable al navegar páginas
- [ ] Drill-down en reporte grande responde sin congelar
- [ ] Exportar a PDF el reporte grande termina en tiempo acotado
- [ ] Sin degradación frente a la línea base tras cambios

## 13. Technical Documentation to produce
`Tables/Architecture.md` (rendimiento, presupuestos) — PART11.

## 14. User Documentation to produce
Nota de buenas prácticas «Tablas grandes» — PART12.

## 15. Acceptance Criteria
- Banco con umbrales verde; linealidad verificada; presupuestos declarados; §12 con
  mediciones; suite verde.
