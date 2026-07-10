# PART02 — CommandBar (menús, QAT y paleta de comandos)

## 1. Purpose
La barra de comandos del estudio: menús Archivo…Ayuda generados desde
`DesignerCommandCatalog` (modelo puro), Quick Access Toolbar, búsqueda difusa de
comandos (Ctrl+Shift+P, `CommandPalette`) y el enrutado de cada comando a su acción.

## 2. Current State
Funcional (Fase 23). Catálogo puro testeado; menús MeridianUI; paleta difusa del
proyecto UX. Fase 28: «Acerca de» ya usa MeridianDialog.

## 3. Comparison against DevExpress
DevExpress usa Ribbon con galerías, estados enabled/disabled por contexto, tooltips
con atajo, y personalización del QAT por el usuario. AegiReports tiene menús planos +
QAT fijo; el enablement por contexto existe parcialmente.

## 4. Missing Features
- Enablement/checked por contexto COMPLETO (p. ej. Pegar solo con clipboard válido,
  Deshacer con tooltip de la acción a deshacer).
- Tooltips con atajo de teclado en TODOS los comandos.
- Personalización del QAT (evaluar; puede ser post-1.0 documentado).

## 5. UX Problems
- Auditar iconografía: cada comando del catálogo con PackIcon coherente.
- Menús largos sin separadores de grupo semántico en algunos casos.

## 6. Backend Problems
- El catálogo no expone `CanExecute` observable uniforme; algunos comandos validan al
  ejecutarse (tarde).

## 7. Frontend Problems
- La paleta difusa debe mostrar el atajo y respetar tema oscuro (verificar con
  MeridianControls).

## 8. Technical Debt
- Strings de comandos dispersos; consolidar en el catálogo con recurso único es-MX.

## 9. Required Improvements
1. `CanExecute` por comando en el catálogo (función pura sobre estado del estudio).
2. Tooltip = nombre + atajo, generado del `KeyMap` (una sola fuente).
3. Iconos completos + separadores de grupo.

## 10. Implementation Plan
1) Extender `DesignerCommandCatalog` con `CanExecute(StudioState)` y estado checked.
2) Generar tooltips desde KeyMap; test de que todo atajo tiene comando y viceversa.
3) Barrido de iconos/grupos; paleta con atajos visibles.
4) Recorrido manual.

## 11. Automated Test Plan
- Catálogo: unicidad de ids, todo comando con texto es-MX e icono; mapa KeyMap↔
  comandos biyectivo donde aplique.
- `CanExecute`: matrices de estado (sin selección, sin undo, sin clipboard…).
- Paleta: ranking difuso determinista para consultas conocidas.

## 12. Manual Validation Checklist
- [ ] Recorrer TODOS los menús: cada ítem ejecuta o está deshabilitado con razón
- [ ] QAT funciona; tooltips muestran atajos
- [ ] Ctrl+Shift+P: buscar «alinear», «exportar», «tema» → ejecutar desde paleta
- [ ] Deshacer/Rehacer reflejan disponibilidad real
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Navegación solo teclado (Alt, flechas)

## 13. Technical Documentation to produce
`Designer/Architecture.md` (catálogo de comandos), `Designer/API.md` (extender
comandos desde el SDK).

## 14. User Documentation to produce
«Comandos y atajos del estudio» (tabla completa), «La paleta de comandos».

## 15. Acceptance Criteria
- Cero comandos sin icono/tooltip/atajo documentado; enablement correcto en todos los
  estados de la matriz; checklist §12 con capturas; suite verde.
