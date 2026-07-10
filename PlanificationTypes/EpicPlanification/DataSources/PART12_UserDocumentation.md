# PART12 — UserDocumentation (documentación de usuario de fuentes de datos)

## 1. Purpose
Generar toda la documentación de USUARIO FINAL declarada por PART01–PART10 del Epic
DataSources: la guía completa de quien conecta datos a un reporte/dashboard sin código,
en Markdown, integrable en el sitio (Epic Documentation).

## 2. Current State
El sitio `Docs` no tiene una guía de conexión de datos paso a paso por proveedor. Los
PARTs especificaron los temas; este PART los escribe al final del Epic.

## 3. Comparison against DevExpress
DevExpress ofrece tutoriales de data source por tipo. Meta equivalente: un usuario
conecta SQL Server, JSON, EF u objetos siguiendo la guía.

## 4. Missing Features
Temas de usuario declarados por los PARTs:
- «Conectar una fuente de datos» (asistente, los 4 proveedores)
- «Conectar a SQL Server» (conexión, consulta/proc, parámetros, offline Demo)
- «Reportar desde JSON» (archivo, ruta de colección, tipos)
- «Reportar sobre objetos en memoria» (POCOs, records, colecciones)
- «Conectar a Entity Framework Core» (DbContext, entidades, límites)
- «Resolver problemas de conexión» (errores comunes y solución)
- «Buenas prácticas» (volúmenes recomendados, fuentes grandes)
- Base conceptual: «¿Qué es una fuente de datos en AegiReports?»

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
1) Tras cerrar PART01–10, redactar cada tema con capturas del recorrido de validación.
2) Tutorial «Conecta la base hotelera y crea tu primer reporte».
3) Integrar en el índice del sitio (Epic Documentation).

## 11. Automated Test Plan
- Verificación de enlaces e imágenes; referencias a proveedores/opciones coinciden con
  la app.

## 12. Manual Validation Checklist
- [ ] Un usuario nuevo sigue «Conectar a SQL Server» y conecta la base Demo sin ayuda
- [ ] Cada tema con capturas actuales y pasos correctos
- [ ] Tutorial de la base hotelera produce un reporte real siguiéndolo
- [ ] «Resolver problemas» cubre los errores reales de los mensajes del producto
- [ ] es-MX sin errores ortográficos ni de acentuación

## 13. Technical Documentation to produce
N/A (es PART11).

## 14. User Documentation to produce
(este PART ES la producción) — todos los temas de §4.

## 15. Acceptance Criteria
- Todos los temas escritos con capturas reales y validados por recorrido; tutorial
  extremo a extremo funcional; es-MX impecable; integrados en el sitio.
