# PART02 — CommandBar (barra de comandos del visor)

## 1. Purpose
La barra superior de 48 px del visor generada desde `ViewerCommandCatalog` (modelo
puro): export, print, refresh, búsqueda con contador «n de m», toggles de paneles,
navegación con página editable, zoom % editable, fit width/page, tamaño real, modos
continuo/página única/dos páginas, mano, selección de texto, F11 y presentación.

## 2. Current State
Funcional (Fase 24). Catálogo puro testeado; barra MeridianUI con iconos PackIcon.
Fase 28: estilos implícitos alcanzan los controles de la barra.

## 3. Comparison against DevExpress
DevExpress agrupa comandos en secciones con tooltips y estados por contexto (export
deshabilitado sin documento). AegiReports tiene los comandos; falta auditar
enablement por contexto, tooltips con atajo y agrupación visual.

## 4. Missing Features
- `CanExecute` por comando (p. ej. navegación deshabilitada en 1 página; búsqueda
  siguiente/anterior solo con resultados).
- Tooltips con nombre + atajo desde una única fuente (KeyMap).
- Agrupación visual con separadores (Navegación · Zoom · Vista · Buscar · Salida).

## 5. UX Problems
- Iconografía coherente en TODOS los comandos (PackIcon); estados activos (modo de
  página seleccionado) visualmente marcados.
- Campos editables (página, zoom): validación inline y commit con Enter.

## 6. Backend Problems
- El catálogo debe exponer estado (enabled/checked) como función pura del estado del
  visor (página actual, conteo, resultados de búsqueda, modo).

## 7. Frontend Problems
- El toggle de cada panel debe reflejar el estado real del sidebar (marcado si visible).

## 8. Technical Debt
- Strings de comandos en recurso único es-MX (compartido con la doc de usuario).

## 9. Required Improvements
1. `CanExecute`/`IsChecked` por comando (función pura + tests de matriz).
2. Tooltips con atajos desde KeyMap; agrupación con separadores.
3. Campos editables con validación inline.

## 10. Implementation Plan
1) Extender `ViewerCommandCatalog` con estado por comando.
2) Barra: separadores, iconos completos, marcado de modo activo, campos validados.
3) Recorrido manual.

## 11. Automated Test Plan
- Catálogo: unicidad de ids, todo comando con texto es-MX e icono; estado por matriz
  (1 página, sin resultados, modo activo); página/zoom parseados con límites.

## 12. Manual Validation Checklist
- [ ] Todos los comandos ejecutan o están deshabilitados con razón
- [ ] Editar número de página salta; zoom % editable aplica; Enter commit
- [ ] Modo de página activo marcado; toggles de panel reflejan el sidebar
- [ ] Búsqueda muestra «n de m»; siguiente/anterior habilitados solo con resultados
- [ ] Tooltips con atajo
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Solo teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Previewer/Architecture.md` (catálogo de comandos del visor).

## 14. User Documentation to produce
«Barra de herramientas del visor» (referencia de comandos y atajos).

## 15. Acceptance Criteria
- Enablement/checked correctos en toda la matriz; cero comandos sin icono/tooltip/
  atajo; checklist §12 con capturas; suite verde.
