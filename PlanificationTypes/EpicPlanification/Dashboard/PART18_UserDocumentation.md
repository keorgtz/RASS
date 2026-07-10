# PART18 — UserDocumentation (documentación de usuario del dashboard)

## 1. Purpose
Generar toda la documentación de USUARIO FINAL declarada por PART01–PART16 del Epic
Dashboard: la guía completa del gerente/analista que construye e interpreta dashboards
sin código, en Markdown, integrable en el sitio (Epic Documentation).

## 2. Current State
El sitio `Docs` no tiene una guía del dashboard paso a paso. Los PARTs especificaron los
temas; este PART los escribe al final del Epic.

## 3. Comparison against DevExpress
DevExpress ofrece tutoriales de dashboard por tarea. Meta equivalente: un usuario de
negocio arma un dashboard hotelero interactivo siguiendo la guía.

## 4. Missing Features
Temas de usuario declarados por los PARTs:
- «El diseñador de dashboards» (tour) · «Guardar y abrir dashboards»
- «Organizar el lienzo» (grid, tamaños, responsive)
- «Agregar widgets al dashboard»
- «Conectar datos al dashboard» (fuentes, campos, binding)
- «Configurar widgets» (KPI, gráfico, crosstab, gauge…)
- «Contenedores y pestañas»
- «Parámetros y filtros del dashboard»
- «Interacciones del dashboard» (filtrado maestro, drill, navegación a reportes)
- «Temas del dashboard»
- «Ver e interactuar con un dashboard»
- «Validar un dashboard»
- «Publicar un dashboard»
- «Incrustar un reporte en el dashboard»
- (si aplica) «Widget de mapa»

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
1) Tras cerrar PART01–16, redactar cada tema con capturas del recorrido de validación.
2) Tutorial extremo a extremo «Arma el dashboard de Ingresos hotelero».
3) Integrar en el índice del sitio (Epic Documentation).

## 11. Automated Test Plan
- Verificación de enlaces e imágenes; referencias a widgets/interacciones coinciden con
  la app.

## 12. Manual Validation Checklist
- [ ] Un usuario nuevo sigue «Agregar widgets» y «Conectar datos» y logra un dashboard
- [ ] Cada tema con capturas actuales y pasos correctos
- [ ] Tutorial extremo a extremo produce el dashboard de Ingresos siguiéndolo
- [ ] Referencias a widgets/interacciones coinciden con la app
- [ ] es-MX sin errores ortográficos ni de acentuación

## 13. Technical Documentation to produce
N/A (es PART17).

## 14. User Documentation to produce
(este PART ES la producción) — todos los temas de §4.

## 15. Acceptance Criteria
- Todos los temas escritos con capturas reales y validados por recorrido; tutorial
  extremo a extremo funcional; es-MX impecable; integrados en el sitio.
