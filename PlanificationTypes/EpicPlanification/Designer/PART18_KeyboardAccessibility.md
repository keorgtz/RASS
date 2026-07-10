# PART18 — KeyboardAccessibility (teclado y accesibilidad)

## 1. Purpose
La operabilidad completa por teclado del estudio y su accesibilidad: atajos
(`KeyMap`/`KeyChord`), orden de foco, navegación entre paneles, `AccessibilityModel`
(nombres/roles UIA) y contraste.

## 2. Current State
Atajos definidos (Fases 17/20/23); `AccessibilityModel` existe. La cobertura real de
«todo se puede hacer sin mouse» y la exposición UIA completa NO están auditadas — de
hecho la automatización de la Fase 28 encontró botones con Name UIA vacío.

## 3. Comparison against DevExpress
DevExpress soporta navegación por teclado del ribbon (Alt), foco visible, y expone
automation peers. AegiReports: atajos sí; foco visible parcial (FocusVisual Meridian
existe); UIA con huecos (Name vacío en botones re-templateados).

## 4. Missing Features
- `AutomationProperties.Name` en TODOS los controles interactivos (botones de icono,
  items de lista con contenido complejo) — hallazgo directo de la Fase 28.
- Recorrido de foco completo y lógico por todos los paneles.
- Indicador de foco visible uniforme (FocusVisual en cada control interactivo).

## 5. UX Problems
- Trampas de foco potenciales en paneles flotantes/popups.
- Sin lista visible de atajos (liga PART02: tooltips con atajo).

## 6. Backend Problems
- Ninguno; es capa de presentación + metadatos UIA.

## 7. Frontend Problems
- Botones de la toolbar del Demo/estudio con contenido complejo necesitan
  `AutomationProperties.Name` explícito.

## 8. Technical Debt
- La automatización de pruebas manuales (ui.ps1) se beneficia directamente de UIA
  correcto — cerrar esto mejora la validación de TODOS los PARTs.

## 9. Required Improvements
1. Barrido de `AutomationProperties.Name/HelpText` en todos los controles
   interactivos del estudio (y del Demo).
2. Orden de foco (`TabIndex`/KeyboardNavigation) revisado panel por panel.
3. FocusVisual Meridian garantizado en cada control; sin trampas de foco.

## 10. Implementation Plan
1) Barrido UIA (nombres desde el mismo recurso es-MX de tooltips).
2) Revisión de TabIndex y KeyboardNavigation.Mode por contenedor.
3) Recorrido manual SOLO teclado de un flujo completo (crear→editar→guardar→exportar).

## 11. Automated Test Plan
- Test de humo UIA (donde sea posible desde la suite): controles clave exponen Name.
- Verificación de que todo comando del catálogo (PART02) tiene atajo o acceso por
  menú navegable.

## 12. Manual Validation Checklist
- [ ] Crear reporte, agregar control, editar propiedad, guardar y exportar SIN mouse
- [ ] Tab recorre paneles en orden lógico; Shift+Tab inverso
- [ ] Foco siempre visible (FocusVisual)
- [ ] Popups/flotantes no atrapan el foco; Esc cierra
- [ ] Lector de pantalla (Narrator) anuncia controles con nombre correcto
- [ ] Atajos de la lista funcionan
- [ ] Contraste AA en claro y oscuro · [ ] High DPI 150/200 % sin recortes

## 13. Technical Documentation to produce
`Designer/Architecture.md` (KeyMap, accesibilidad), `Designer/Accessibility.md`
(cobertura UIA, atajos).

## 14. User Documentation to produce
«Uso con teclado y accesibilidad» (atajos completos, lector de pantalla).

## 15. Acceptance Criteria
- Flujo completo sin mouse; UIA Name en todos los interactivos; foco visible sin
  trampas; contraste AA; checklist §12 con capturas; suite verde.
