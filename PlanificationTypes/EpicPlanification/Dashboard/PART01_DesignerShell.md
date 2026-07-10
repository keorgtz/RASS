# PART01 — DesignerShell (ventana del diseñador de dashboards)

## 1. Purpose
El contenedor del diseñador de dashboards: `DashboardDesignerControl` /
`DashboardDesignerWindow` (Designer.Shell/Dashboard), su ciclo de vida (carga de
`DashboardDocument` + `DashboardHostServices`), el layout raíz (command bar + toolbox +
lienzo + propiedades/capas + parámetros/filtros + status), undo/redo por INSTANTÁNEAS
del serializador determinista, y la apertura desde el Demo.

## 2. Current State
Funcional (Fase 26). Undo/redo por snapshots del `.aedashboard`; diagnósticos vivos;
combos de página/tema. Fase 28: control theme Meridian, `MeridianDialog.ShowWarning` en
la publicación con errores, alineación de botones corregida.

## 3. Comparison against DevExpress
DevExpress Dashboard Designer: ribbon completo, múltiples páginas de dashboard con
pestañas, confirmación de cambios sin guardar, y galería de plantillas. AegiReports:
páginas gestionadas por combo; auditar dirty tracking, título con nombre y estado, y
confirmación de cierre.

## 4. Missing Features
- Dirty tracking (`IsDirty` por hash del snapshot) + asterisco en título + confirmación
  de cierre con cambios sin guardar.
- Nombre del dashboard visible en el encabezado/título de ventana.
- Estado vacío (dashboard sin widgets) con call-to-action.

## 5. UX Problems
- El status «Sin diagnósticos — listo para publicar» debe auditarse por consistencia
  con el panel de diagnósticos.
- Progreso no bloqueante al cargar dashboards con fuentes SQL pesadas (estado terminal).

## 6. Backend Problems
- Exponer `IsDirty` comparando el snapshot actual contra el último guardado.

## 7. Frontend Problems
- Verificar Dispose completo (preview, timers de auto-refresh, suscripciones).

## 8. Technical Debt
- Undo por snapshots es correcto para este caso; documentar por qué difiere del undo
  por comandos del designer de reportes.

## 9. Required Improvements
1. Dirty tracking + título dinámico + confirmación de cierre.
2. Estado vacío con call-to-action; progreso de carga terminal.
3. Auditoría de coherencia status↔diagnósticos.

## 10. Implementation Plan
1) Modelo: `IsDirty` (hash del serializador vs guardado) + tests.
2) Shell: título, `Closing` → Confirm si sucio, estado vacío.
3) Recorrido manual desde Demo (galería + nuevo dashboard).

## 11. Automated Test Plan
- Dirty: nuevo=limpio, editar=sucio, guardar=limpio, undo a snapshot=limpio.
- Título/formateo si se extrae formateador puro.

## 12. Manual Validation Checklist
- [ ] Abrir dashboard de la galería y «Nuevo dashboard» desde el Demo
- [ ] Editar → asterisco; Guardar → desaparece
- [ ] Cerrar con cambios → Confirm; Cancelar conserva la ventana
- [ ] Undo hasta el estado guardado → limpio
- [ ] Dashboard vacío → call-to-action
- [ ] Cerrar libera recursos (abrir/cerrar 10 veces sin fuga)
- [ ] Tema claro/oscuro · [ ] High DPI (150 %) · [ ] Solo teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Dashboard/Architecture.md` (shell + ciclo de vida + undo por snapshots),
`Dashboard/Integration.md` (DashboardHostServices).

## 14. User Documentation to produce
«El diseñador de dashboards» (tour), «Guardar y abrir dashboards».

## 15. Acceptance Criteria
- Dirty tracking + confirmación de cierre; título dinámico; sin fugas; checklist §12 con
  capturas; build 0/0; suite verde.
