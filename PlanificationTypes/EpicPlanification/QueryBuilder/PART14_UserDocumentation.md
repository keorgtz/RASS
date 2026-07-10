# PART14 — UserDocumentation (documentación de usuario del query builder)

## 1. Purpose
Generar toda la documentación de USUARIO FINAL declarada por PART01–PART12 del Epic
QueryBuilder: la guía completa de quien construye consultas SQL 100 % visualmente, en
Markdown, integrable en el sitio (Epic Documentation).

## 2. Current State
El sitio `Docs` no tiene una guía del query builder paso a paso. Los PARTs
especificaron los temas; este PART los escribe al final del Epic.

## 3. Comparison against DevExpress
DevExpress ofrece tutoriales del query builder por tarea. Meta equivalente: un usuario
de negocio arma una consulta multi-tabla sin escribir SQL siguiendo la guía.

## 4. Missing Features
Temas de usuario declarados por los PARTs:
- «El diseñador de consultas» (tour) · «Abrir el diseñador de consultas»
- «Explorar el catálogo de datos»
- «Agregar tablas y relaciones» (joins automáticos y manuales)
- «Elegir columnas y calcular valores»
- «Filtrar datos» (condiciones, grupos, parámetros)
- «Parámetros en las consultas»
- «Ordenar y agrupar resultados»
- «Ver el SQL generado»
- «Ejecutar y ver resultados»
- «Vista previa offline vs ejecución real» (diferencias documentadas)
- «Conectar a una base de datos» (SQL Server, EF, objetos)
- «De la consulta al reporte» (tutorial extremo a extremo) · «Reeditar una consulta»

## 5. UX Problems
- Capturas post-completación (estado final MeridianUI); reusar `docs/screenshots/`.

## 6. Backend Problems
N/A.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
- Mantener capturas sincronizadas con la UI.

## 9. Required Improvements
Escribir cada tema como tutorial por tarea, con capturas reales y pasos numerados, en
es-MX impecable.

## 10. Implementation Plan
1) Tras cerrar PART01–12, redactar cada tema con capturas del recorrido de validación.
2) Tutorial extremo a extremo «Arma una consulta hotelera y conviértela en reporte».
3) Integrar en el índice del sitio (Epic Documentation).

## 11. Automated Test Plan
- Verificación de enlaces e imágenes; referencias a comandos/atajos coinciden con la app.

## 12. Manual Validation Checklist
- [ ] Un usuario nuevo sigue «Agregar tablas y relaciones» y arma un join sin ayuda
- [ ] Cada tema con capturas actuales y pasos correctos
- [ ] Tutorial extremo a extremo produce un reporte real siguiéndolo
- [ ] Referencias a operadores/parámetros coinciden con la app
- [ ] es-MX sin errores ortográficos ni de acentuación

## 13. Technical Documentation to produce
N/A (es PART13).

## 14. User Documentation to produce
(este PART ES la producción) — todos los temas de §4.

## 15. Acceptance Criteria
- Todos los temas escritos con capturas reales y validados por recorrido; tutorial
  extremo a extremo funcional; es-MX impecable; integrados en el sitio.
