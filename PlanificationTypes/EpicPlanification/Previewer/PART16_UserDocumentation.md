# PART16 — UserDocumentation (documentación de usuario del visor)

## 1. Purpose
Generar toda la documentación de USUARIO FINAL declarada por PART01–PART14 del Epic
Previewer: la guía completa de quien consulta, navega, busca, parametriza, exporta e
imprime documentos, en Markdown, integrable en el sitio (Epic Documentation).

## 2. Current State
El sitio `Docs` no tiene una guía del visor paso a paso. Los PARTs especificaron los
temas; este PART los escribe (al final del Epic).

## 3. Comparison against DevExpress
DevExpress ofrece tutoriales del viewer por tarea. Meta equivalente: un usuario opera
el visor siguiendo la guía.

## 4. Missing Features
Temas de usuario declarados por los PARTs:
- «El visor de documentos» (tour) · «Abrir un documento en el visor»
- «Barra de herramientas del visor» (comandos y atajos)
- «Modos de visualización» (continuo/página/libro)
- «Zoom y navegación»
- «Panel de miniaturas»
- «Marcadores y esquema»
- «Buscar texto en el documento»
- «Parámetros del reporte»
- «Seleccionar y copiar texto»
- «Inspeccionar un documento»
- «Exportar un documento»
- «Imprimir un documento»
- «Pantalla completa y presentación»
- (si aplica) «Minimapa»

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
1) Tras cerrar PART01–14, redactar cada tema con capturas del recorrido de validación.
2) Un tutorial «Consultar, parametrizar y exportar un reporte» de extremo a extremo.
3) Integrar en el índice del sitio (Epic Documentation).

## 11. Automated Test Plan
- Verificación de enlaces e imágenes; referencias a atajos/comandos coinciden con el
  catálogo del visor (PART02).

## 12. Manual Validation Checklist
- [ ] Un usuario nuevo sigue «Abrir un documento» y opera el visor sin ayuda
- [ ] Cada tema con capturas actuales y pasos correctos
- [ ] Tutorial extremo-a-extremo produce un PDF real siguiéndolo
- [ ] Referencias a atajos/comandos coinciden con la app
- [ ] es-MX sin errores ortográficos ni de acentuación

## 13. Technical Documentation to produce
N/A (es PART15).

## 14. User Documentation to produce
(este PART ES la producción) — todos los temas de §4.

## 15. Acceptance Criteria
- Todos los temas escritos con capturas reales y validados por recorrido; tutorial
  extremo-a-extremo funcional; es-MX impecable; integrados en el sitio.
