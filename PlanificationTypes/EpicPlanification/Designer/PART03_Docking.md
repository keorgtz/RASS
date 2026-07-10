# PART03 — Docking (workspace, auto-hide, flotantes, persistencia)

## 1. Purpose
El sistema de docking del estudio: `DockLayout` (máquina de estados pura:
dock/float/auto-hide/pin/resize, serializable) + `DesignerWorkspace`
(`CreateCustom`/`FromJson`) + `DockHostControl` (WPF), compartido con el visor.
Persistencia del layout en %AppData%.

## 2. Current State
Funcional (Fases 20/23/24). Pestañas, auto-hide con peek, flotantes, persistencia
JSON. El visor reutiliza el mismo host (generalización de Fase 24).

## 3. Comparison against DevExpress
DevExpress ofrece drag & drop de paneles con guías visuales de destino (dock hints),
split anidado arbitrario, tamaño por pixel recordado por panel y reset de layout.
AegiReports: estados completos pero SIN dock hints visuales de arrastre y con zonas
de destino más limitadas.

## 4. Missing Features
- Dock hints visuales durante el arrastre de un panel (overlay de destinos).
- Comando «Restablecer layout» visible (existe default por código; falta UI).
- Recordar tamaño de flotantes entre sesiones (verificar cobertura actual).

## 5. UX Problems
- Peek de auto-hide: revisar timings ≤ 200 ms y easing Meridian.
- Bordes de agarre (splitters) delgados en High DPI.

## 6. Backend Problems
- `DockLayout` no versiona su JSON; un layout viejo tras cambios de paneles debe caer
  a defaults sin excepción (verificar y testear).

## 7. Frontend Problems
- Flotantes: verificar tema oscuro y ControlTheme aplicado a la ventana flotante.

## 8. Technical Debt
- Ninguna crítica conocida; documentar el contrato JSON.

## 9. Required Improvements
1. Overlay de dock hints en arrastre (mínimo: 5 destinos del host + tabs).
2. «Ver → Restablecer layout» + versión/fallback del JSON.
3. Splitters 6 px efectivos, flotantes tematizados.

## 10. Implementation Plan
1) Modelo: destinos válidos como función pura (`DockLayout.GetDropTargets`).
2) WPF: adorner de hints + drop.
3) Versión en JSON + fallback silencioso a defaults con diagnóstico en Salida.
4) Comando de reset en menú Ver.
5) Recorrido manual con capturas (incluye flotante en tema oscuro).

## 11. Automated Test Plan
- `DockLayout`: round-trip JSON, versión desconocida → defaults, drop targets por
  estado, pin/auto-hide/float transiciones legales e ilegales.
- Workspace del visor no regresiona (mismas APIs).

## 12. Manual Validation Checklist
- [ ] Arrastrar cada panel a cada destino con hints visibles
- [ ] Auto-hide: peek al hover, pin/unpin
- [ ] Flotar panel, mover a segundo monitor, cerrar y reabrir → posición recordada
- [ ] Restablecer layout desde menú
- [ ] Borrar JSON de %AppData% → defaults sin error
- [ ] JSON corrupto → defaults + aviso en Salida
- [ ] Tema claro/oscuro (flotantes incluidos) · [ ] High DPI · [ ] Teclado (foco
      entre paneles) · [ ] Cerrar/reabrir estudio conserva layout

## 13. Technical Documentation to produce
`Designer/Architecture.md` (docking), `Designer/API.md` (paneles del SDK en el
workspace), `Designer/Troubleshooting.md` (layout corrupto/reset).

## 14. User Documentation to produce
«Organizar el espacio de trabajo» (paneles, auto-hide, flotantes, reset).

## 15. Acceptance Criteria
- Hints visibles en todo arrastre; layout persiste y se restablece; JSON viejo jamás
  lanza; checklist §12 con capturas; suite verde.
