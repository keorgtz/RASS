# PART12 — UserDocumentation (documentación de usuario de gráficas)

## 1. Purpose
Generar toda la documentación de USUARIO FINAL declarada por PART01–PART10 del Epic Charts:
la guía completa de quien crea, estiliza y exporta gráficas en reportes y dashboards, en
Markdown, integrable en el sitio (Epic Documentation).

## 2. Current State
El sitio `Docs` no tiene una guía de gráficas paso a paso. Los PARTs especificaron los temas;
este PART los escribe al final del Epic.

## 3. Comparison against DevExpress
DevExpress ofrece tutoriales de gráfica por tarea. Meta equivalente: un usuario crea una
gráfica ligada a datos, estilizada y exportable siguiendo la guía.

## 4. Missing Features
Temas de usuario declarados por los PARTs:
- «Gráficas: series, categorías y paleta» (modelo) — PART01
- «Tipos de gráfica: columnas, barras y líneas» — PART02
- «Gráficas de pastel y dona» — PART03
- «Gráficas de área» — PART04
- «Ejes, escalas y formato» (negativos, formato es-MX, títulos) — PART05
- «Leyendas y etiquetas de datos» — PART06
- «Crea una gráfica en el reporte» y «Configura el widget de gráfica» (tutoriales) — PART08
- «Exportar gráficas» (notas por formato) — PART10
- Nota «Interacción del dashboard con gráficas» (highlight) — PART09

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
2) Tutorial «Grafica los ingresos por mes y por hotel».
3) Integrar en el índice del sitio (Epic Documentation).

## 11. Automated Test Plan
- Verificación de enlaces e imágenes; referencias a controles/menús coinciden con la app.

## 12. Manual Validation Checklist
- [ ] Un usuario nuevo crea una gráfica de columnas y una de pie siguiendo la guía
- [ ] Cada tema con capturas actuales y pasos correctos
- [ ] Tutorial de ingresos por mes/hotel funciona siguiéndolo
- [ ] Referencias cruzadas a Dashboard/Exportación coherentes
- [ ] es-MX sin errores ortográficos ni de acentuación

## 13. Technical Documentation to produce
N/A (es PART11).

## 14. User Documentation to produce
(este PART ES la producción) — todos los temas de §4.

## 15. Acceptance Criteria
- Todos los temas escritos con capturas reales y validados por recorrido; tutorial extremo a
  extremo funcional; es-MX impecable; integrados en el sitio.
