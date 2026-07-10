# PART10 — UserDocumentation (documentación de usuario de parámetros)

## 1. Purpose
Generar toda la documentación de USUARIO FINAL declarada por PART01–PART08 del Epic
Parameters: la guía completa de quien define y usa parámetros en reportes, consultas,
visor y dashboards, en Markdown, integrable en el sitio (Epic Documentation).

## 2. Current State
El sitio `Docs` no tiene una guía de parámetros paso a paso. Los PARTs especificaron los
temas; este PART los escribe al final del Epic.

## 3. Comparison against DevExpress
DevExpress ofrece tutoriales de parámetros por tarea. Meta equivalente: un usuario crea y
usa parámetros (incluido multi-valor y rango) siguiendo la guía.

## 4. Missing Features
Temas de usuario declarados por los PARTs:
- «Parámetros» (qué son, tipos, validaciones) — PART01
- «Listas de valores y cascada» (lookups estáticos/dinámicos, dependencias) — PART02
- «Parámetros del reporte» (cambiar valores en el visor, enviar) — PART04
- «Parámetros multi-valor y de rango de fechas» — PART06
- «Crear y editar parámetros» (asistente, explorador) — PART07
- (referencias cruzadas) «Parámetros en las consultas» (QueryBuilder) y «Parámetros y
  filtros del dashboard» (Dashboard)

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
1) Tras cerrar PART01–08, redactar cada tema con capturas del recorrido de validación.
2) Tutorial «Agrega un parámetro de canal y un rango de fechas a tu reporte».
3) Integrar en el índice del sitio (Epic Documentation).

## 11. Automated Test Plan
- Verificación de enlaces e imágenes; referencias a tipos/editores coinciden con la app.

## 12. Manual Validation Checklist
- [ ] Un usuario nuevo sigue «Crear y editar parámetros» y agrega un @Canal sin ayuda
- [ ] Cada tema con capturas actuales y pasos correctos
- [ ] Tutorial de canal + rango de fechas funciona siguiéndolo
- [ ] Referencias cruzadas a consultas/dashboard coherentes
- [ ] es-MX sin errores ortográficos ni de acentuación

## 13. Technical Documentation to produce
N/A (es PART09).

## 14. User Documentation to produce
(este PART ES la producción) — todos los temas de §4.

## 15. Acceptance Criteria
- Todos los temas escritos con capturas reales y validados por recorrido; tutorial
  extremo a extremo funcional; es-MX impecable; integrados en el sitio.
