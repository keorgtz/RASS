# PART01 — ViewerShell (ventana y control raíz del visor)

## 1. Purpose
El contenedor del visor profesional: `ViewerShellControl` (Designer.Shell/Viewer), su
ciclo de vida (`Load(session, ViewerContext)`, `Dispose`), el layout raíz (command bar
48 px + sidebar con docking + área de páginas + status bar) y su apertura desde el Demo
y el estudio.

## 2. Current State
Funcional (Fase 24). Fase 28: el visor ABRE de forma fiable (la causa raíz del V4 —
falta de `SynchronizationContext` en el arranque del Demo— quedó resuelta) y aplica el
control theme Meridian. `ViewerContext` inyecta título, metadatos, parámetros y
`RefreshAsync` para recomposición.

## 3. Comparison against DevExpress
DevExpress Document Viewer: barra superior con grupos, panel lateral con pestañas
(marcadores/miniaturas/parámetros), status bar con página/zoom, y modo documento vs
diseño. AegiReports cubre lo esencial; falta auditar la persistencia del layout del
visor y el manejo de múltiples documentos abiertos.

## 4. Missing Features
- Recordar el layout del sidebar del visor entre sesiones (pestaña activa, anchos).
- Título de ventana con nombre del documento y origen (SQL/consulta/local).
- Recarga del documento actual sin perder posición/zoom (refresh preserva estado).

## 5. UX Problems
- El estado inicial de carga (sesión pesada) debe mostrar progreso no bloqueante con
  estado terminal garantizado (lección Fase 28).
- Documento vacío (0 páginas) sin mensaje orientador.

## 6. Backend Problems
- `Load` debe ser idempotente y liberar la sesión anterior (verificar Dispose de
  presenter/overlays al recargar).

## 7. Frontend Problems
- Verificar que `Dispose` libera timers de inercia, suscripciones y cache de páginas.

## 8. Technical Debt
- El cableado host↔visor (export/print/refresh) se comparte conceptualmente con el
  estudio; documentar el contrato `ViewerContext` como parte del SDK de hosting.

## 9. Required Improvements
1. Persistencia del layout del visor (pestaña activa, anchos del sidebar).
2. Título dinámico con documento + origen; estado vacío con mensaje.
3. Refresh que preserva página/zoom/scroll.

## 10. Implementation Plan
1) Host: servicio de layout del visor (JSON en %AppData%, contrato de `DockLayout`).
2) Shell: título, estado vacío, preservación de estado en refresh.
3) Recorrido manual desde Demo (muestra y escenario SQL) y estudio.

## 11. Automated Test Plan
- `ViewerContext`: construcción con/sin parámetros, metadatos, RefreshAsync invocado.
- Layout round-trip; estado preservado tras refresh (modelo puro del estado de vista).

## 12. Manual Validation Checklist
- [ ] Abrir visor desde Demo (muestra y escenario SQL) y desde estudio
- [ ] Documento de N páginas carga con progreso y estado terminal
- [ ] Documento vacío → mensaje orientador
- [ ] Refresh (parámetros) preserva página/zoom/scroll
- [ ] Cerrar y reabrir → layout del sidebar recordado
- [ ] Cerrar libera recursos (sin fuga tras abrir/cerrar 10 veces)
- [ ] Tema claro/oscuro · [ ] High DPI (150 %) · [ ] Solo teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Previewer/Architecture.md` (shell + ciclo de vida), `Previewer/Integration.md`
(contrato ViewerContext para hosts).

## 14. User Documentation to produce
«El visor de documentos» (tour de la ventana), «Abrir un documento en el visor».

## 15. Acceptance Criteria
- Visor abre fiable con progreso terminal; layout persistente; refresh preserva estado;
  sin fugas; checklist §12 con capturas; build 0/0; suite verde.
