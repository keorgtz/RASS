# PART10 — UserDocumentation (documentación de usuario de crosstabs)

## 1. Purpose
Generar toda la documentación de USUARIO FINAL declarada por PART01–PART08 del Epic
Crosstabs: la guía completa de quien crea, totaliza, estiliza, formatea y exporta tablas
cruzadas en reportes y dashboards, en Markdown, integrable en el sitio (Epic Documentation).

## 2. Current State
El sitio `Docs` no tiene una guía de tablas cruzadas paso a paso. Los PARTs especificaron los
temas; este PART los escribe al final del Epic.

## 3. Comparison against DevExpress
DevExpress ofrece tutoriales de Cross Tab por tarea. Meta equivalente: un usuario crea un
pivote totalizado, formateado y exportable siguiendo la guía.

## 4. Missing Features
Temas de usuario declarados por los PARTs:
- «Tablas cruzadas: filas, columnas y valores» (modelo, agregados) — PART01
- «Totales, subtotales y orden» — PART02
- «Dar formato y estilo a la tabla cruzada» — PART03
- «Crea una tabla cruzada con el asistente» (tutorial) — PART04
- «Formato condicional en tablas cruzadas» — PART05
- «Exportar la tabla cruzada a Excel» — PART06
- Notas: «Tablas cruzadas anchas» (PART07), «Guardar y abrir» (PART08)

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
1) Tras cerrar PART01–08, redactar cada tema con capturas del recorrido de validación.
2) Tutorial «Ingreso por tipo de habitación y canal, con totales y formato condicional».
3) Integrar en el índice del sitio (Epic Documentation).

## 11. Automated Test Plan
- Verificación de enlaces e imágenes; referencias a controles/menús coinciden con la app.

## 12. Manual Validation Checklist
- [ ] Un usuario nuevo crea una tabla cruzada siguiendo la guía sin ayuda
- [ ] Cada tema con capturas actuales y pasos correctos
- [ ] Tutorial de ingreso por habitación/canal funciona siguiéndolo
- [ ] Referencias cruzadas a Tables/Dashboard/Exportación coherentes
- [ ] es-MX sin errores ortográficos ni de acentuación

## 13. Technical Documentation to produce
N/A (es PART09).

## 14. User Documentation to produce
(este PART ES la producción) — todos los temas de §4.

## 15. Acceptance Criteria
- Todos los temas escritos con capturas reales y validados por recorrido; tutorial extremo a
  extremo funcional; es-MX impecable; integrados en el sitio.
