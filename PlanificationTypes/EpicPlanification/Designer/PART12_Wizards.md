# PART12 — Wizards (los 12 asistentes)

## 1. Purpose
Los asistentes del estudio y su infraestructura común: `WizardWindow`/`WizardAdapter`/
`WizardUi` + modelos puros (Designer.Wizards): nuevo reporte (8 pasos), fuente de
datos (4 proveedores), tabla, gráfica, crosstab, barcode, QR, subreporte, parámetro,
agrupación, campo calculado y estilo.

## 2. Current State
Funcionales (Fases 22/23). Fase 28: control theme aplicado, pasos como chips,
validación por paso, fix del double-add en «Prueba y esquema», página Object nueva.

## 3. Comparison against DevExpress
DevExpress Report Wizard incluye vista previa del layout resultante en el último
paso, plantillas de estilo visuales (galería) y navegación por clic en los pasos.
AegiReports: chips no navegables por clic, paso de estilo textual sin galería visual,
sin preview del resultado.

## 4. Missing Features
- Clic en un chip de paso YA visitado navega a él.
- Galería visual de estilos en el paso Estilo (swatches, no solo nombres).
- Mini-preview del layout en el paso final del wizard de nuevo reporte.

## 5. UX Problems
- Mensajes de validación por paso: auditar que cada paso incompleto explica QUÉ falta
  (no el genérico «Complete la configuración del paso»).
- Tamaños de ventana fijos: contenido largo (muchos campos) necesita scroll correcto.

## 6. Backend Problems
- Ninguno estructural; modelos puros bien testeados.

## 7. Frontend Problems
- Focus inicial por paso (primer control editable) inconsistente.

## 8. Technical Debt
- `WizardUi` estático crece; aceptable, pero documentar el patrón para nuevos pasos.

## 9. Required Improvements
1. Navegación por chips visitados + mensajes de validación específicos por paso.
2. Galería de estilos con swatches + mini-preview final (compone en miniatura real —
   reusar presenter, sin motor nuevo).
3. Focus inicial consistente.

## 10. Implementation Plan
1) Modelos: mensajes por paso (función StepError ampliada por wizard).
2) WizardWindow: chips clicables hacia atrás; focus por página.
3) Paso estilo: swatches desde ThemeCatalog; paso final: miniatura compuesta.
4) Recorrido manual de LOS 12 wizards (uno por uno, checklist por wizard).

## 11. Automated Test Plan
- Modelos: navegación legal (adelante bloqueado sin validez, atrás siempre, salto a
  visitado), StepError específico por estado, Build() de cada wizard produce
  documento/definición válida (suites existentes + casos de mensajes).

## 12. Manual Validation Checklist
(ejecutar POR wizard; lista común)
- [ ] Abrir desde su punto de entrada real (menú/panel/Demo)
- [ ] Completar flujo feliz → resultado correcto en estudio/preview
- [ ] Intentar avanzar con paso inválido → mensaje ESPECÍFICO
- [ ] Volver atrás y cambiar una decisión → pasos posteriores coherentes
- [ ] Clic en chip visitado navega
- [ ] Cancelar no deja efectos
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Solo teclado (tab/enter/esc)
- Casos especiales: fuente de datos (4 proveedores + prueba/esquema), nuevo reporte
  (SQL Demo, JSON y Object end-to-end), subreporte (parámetros), agrupación
  (multinivel).

## 13. Technical Documentation to produce
`Designer/Architecture.md` (infraestructura de wizards), `Designer/API.md`
(wizard de fuente para hosts).

## 14. User Documentation to produce
«Crear un reporte con el asistente» (tutorial), «Asistentes de controles» (referencia
por wizard).

## 15. Acceptance Criteria
- 12/12 wizards con checklist completa y capturas; mensajes específicos; navegación
  por chips; suite verde.
