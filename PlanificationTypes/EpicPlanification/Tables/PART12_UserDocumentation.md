# PART12 — UserDocumentation (documentación de usuario de tablas)

## 1. Purpose
Generar toda la documentación de USUARIO FINAL declarada por PART01–PART10 del Epic Tables:
la guía completa de quien crea, agrupa, estiliza, exporta e imprime tablas en reportes, en
Markdown, integrable en el sitio (Epic Documentation).

## 2. Current State
El sitio `Docs` no tiene una guía de tablas paso a paso. Los PARTs especificaron los temas;
este PART los escribe al final del Epic.

## 3. Comparison against DevExpress
DevExpress ofrece tutoriales de tabla por tarea. Meta equivalente: un usuario crea una tabla
agrupada, estilizada y exportable siguiendo la guía.

## 4. Missing Features
Temas de usuario declarados por los PARTs:
- «Tablas: columnas, filas y celdas» (modelo, sizing) — PART01
- «Tablas largas y saltos de página» (encabezado repetido, keep-together) — PART02
- «Agrupar y totalizar en tablas» (grupos, subtotales) — PART03
- «Expandir y contraer grupos (drill-down)» — PART04
- «Editar tablas en el diseñador» (celdas, columnas, fusión) — PART05
- «Crea una tabla con el asistente» (tutorial) — PART06
- «Dar estilo y formato condicional a tablas» (zebra, reglas) — PART07
- «Exportar tablas» (notas por formato) — PART09
- Notas: «Guardar y abrir» (compatibilidad) — PART08, «Tablas grandes» — PART10

## 5. UX Problems
- Capturas post-completación (estado final MeridianUI); reusar `docs/screenshots/`.

## 6. Backend Problems
N/A.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
- Mantener capturas sincronizadas con la UI.

## 9. Required Improvements
Escribir cada tema como tutorial por tarea, con capturas reales y pasos numerados, en es-MX
impecable.

## 10. Implementation Plan
1) Tras cerrar PART01–10, redactar cada tema con capturas del recorrido de validación.
2) Tutorial «Crea un reporte de ingresos por hotel agrupado y estilizado».
3) Integrar en el índice del sitio (Epic Documentation).

## 11. Automated Test Plan
- Verificación de enlaces e imágenes; referencias a controles/menús coinciden con la app.

## 12. Manual Validation Checklist
- [ ] Un usuario nuevo crea una tabla agrupada siguiendo la guía sin ayuda
- [ ] Cada tema con capturas actuales y pasos correctos
- [ ] Tutorial de ingresos por hotel funciona siguiéndolo
- [ ] Referencias cruzadas a Crosstabs/Dashboard/Exportación coherentes
- [ ] es-MX sin errores ortográficos ni de acentuación

## 13. Technical Documentation to produce
N/A (es PART11).

## 14. User Documentation to produce
(este PART ES la producción) — todos los temas de §4.

## 15. Acceptance Criteria
- Todos los temas escritos con capturas reales y validados por recorrido; tutorial extremo a
  extremo funcional; es-MX impecable; integrados en el sitio.
