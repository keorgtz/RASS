# PART22 — UserDocumentation (documentación de usuario del designer)

## 1. Purpose
Generar toda la documentación de USUARIO FINAL declarada por PART01–PART20 del Epic
Designer: la guía completa del autor de reportes sin código, en Markdown, integrable
en el sitio de documentación (Epic Documentation).

## 2. Current State
El sitio `Docs` tiene ~17 páginas generales; NO hay una guía de usuario del estudio
paso a paso. Los PARTs previos especificaron los temas; este PART los escribe.

## 3. Comparison against DevExpress
DevExpress ofrece tutoriales guiados con capturas por tarea. La meta es equivalente:
un usuario de negocio construye su reporte siguiendo la guía.

## 4. Missing Features
Los temas de usuario declarados por los PARTs:
- «El estudio de diseño» (tour) · «Guardar, abrir y recuperar reportes»
- «Comandos y atajos» · «La paleta de comandos»
- «Organizar el espacio de trabajo» (docking)
- «Agregar controles» (toolbox) · «Enlazar datos» (campos, calculados)
- «Estructura del reporte» (explorador) · «Editar propiedades»
- «Diseñar en la superficie» (snap, guías, clipboard, zoom)
- «Alinear y organizar» · «Trabajar con bandas»
- «Deshacer y rehacer»
- «Crear un reporte con el asistente» + «Asistentes de controles»
- «Expresiones» (con referencia de funciones generada)
- «Formato condicional» · «Estilos de reporte»
- «La vista previa en vivo» · «Uso con teclado y accesibilidad»
- «Tema claro y oscuro» · «Buenas prácticas» (límites de rendimiento)

## 5. UX Problems
- Las capturas deben ser post-completación (estado final, MeridianUI) y actualizarse
  si la UI cambia — reusar el corpus de `docs/screenshots/`.

## 6. Backend Problems
N/A.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
- Mantener capturas sincronizadas con la UI; documentar el proceso de recaptura.

## 9. Required Improvements
Escribir cada tema como tutorial orientado a tarea, con capturas reales y pasos
numerados, en es-MX impecable.

## 10. Implementation Plan
1) Tras cerrar PART01–20, redactar cada tema con capturas del recorrido de validación.
2) Un tutorial extremo-a-extremo «De los datos al PDF» que hila varios temas.
3) Integrar en el índice del sitio (coordinar con Epic Documentation).

## 11. Automated Test Plan
- Verificación de enlaces e imágenes (sin rotas); los pasos referencian comandos/
  atajos que existen (cruce con el catálogo de PART02).

## 12. Manual Validation Checklist
- [ ] Un usuario nuevo sigue «Crear un reporte con el asistente» y lo logra sin ayuda
- [ ] Cada tema tiene capturas actuales y pasos correctos
- [ ] El tutorial extremo-a-extremo produce un PDF real siguiéndolo
- [ ] Referencias a atajos/comandos coinciden con la app
- [ ] es-MX sin errores ortográficos ni de acentuación

## 13. Technical Documentation to produce
N/A (es PART21).

## 14. User Documentation to produce
(este PART ES la producción) — todos los temas listados en §4.

## 15. Acceptance Criteria
- Todos los temas escritos con capturas reales y validados por recorrido de un usuario;
  tutorial extremo-a-extremo funcional; es-MX impecable; integrados en el sitio.
