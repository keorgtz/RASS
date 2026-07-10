# PART01 — StudioShell (ventana y control raíz del estudio)

## 1. Purpose
El contenedor del estudio de diseño: `DesignerStudioControl` (Designer.Shell), su
ciclo de vida (Initialize/Dispose), el layout raíz (command bar + docking + superficie
+ status bar), el cableado de eventos al host (Save/Open/Export/Print/New/Close) y su
apertura desde el Demo (`OpenStudio`).

## 2. Current State
Funcional desde la Fase 23; Fase 28 agregó `Meridian.ApplyControlTheme(this)`, catch
de composición en `RefreshPreviewAsync` y `MeridianDialog` en «Acerca de». El host
(Demo) enruta File/Export/Print vía eventos con `RunSafely`. Al cerrar, el preview del
Demo se refresca con el documento editado.

## 3. Comparison against DevExpress
DevExpress Report Designer ofrece: ventana ribbon completa, MDI/tabs de múltiples
reportes, barra de estado con zoom/posición, confirmación de cambios sin guardar.
AegiReports tiene UNA instancia por ventana, sin tabs multi-documento y sin
confirmación de cierre con cambios pendientes.

## 4. Missing Features
- Confirmación al cerrar con cambios sin guardar (dirty tracking → `MeridianDialog.Confirm`).
- Título de ventana con nombre de documento y asterisco de sucio.
- Multi-documento (tabs): evaluar; probablemente post-1.0 documentado.

## 5. UX Problems
- El status bar del estudio debe auditarse: zoom, posición del cursor en mm, página.
- Estados vacíos (documento sin bandas) sin mensaje orientador.

## 6. Backend Problems
- Dirty tracking: la `DesignSession` tiene historial undo; falta exponer `IsDirty`
  (comparación contra snapshot guardado) al shell.

## 7. Frontend Problems
- Verificar liberación completa en `Dispose` (timers, suscripciones, preview).

## 8. Technical Debt
- El cableado de eventos host↔estudio está duplicado conceptualmente entre Demo y
  cualquier host futuro; documentar el contrato como parte del SDK de hosting.

## 9. Required Improvements
1. `IsDirty` en DesignSession + asterisco en título + confirmación de cierre.
2. Status bar completa (zoom %, posición mm, página, diagnósticos count).
3. Estado vacío con call-to-action («Agregue una banda…»).

## 10. Implementation Plan
1) Modelo: `DesignSession.IsDirty` (hash del serializador vs último guardado) + tests.
2) Shell: título dinámico, `Closing` → Confirm si sucio.
3) Status bar: fuentes de datos ya existentes (zoom del surface, selección).
4) Estado vacío en la superficie.
5) Recorrido manual + capturas.

## 11. Automated Test Plan
- `DesignSessionDirtyTests`: nuevo=limpio, editar=sucio, guardar=limpio, undo hasta
  snapshot=limpio.
- Test de título/formateo (modelo puro si se extrae `StudioTitleFormatter`).

## 12. Manual Validation Checklist
- [ ] Abrir estudio desde Demo (muestra y escenario SQL)
- [ ] Crear reporte nuevo vía wizard → estudio abre con datos de diseño
- [ ] Editar → asterisco aparece; Guardar → desaparece
- [ ] Cerrar con cambios → diálogo Confirm; Cancelar conserva la ventana
- [ ] Undo hasta estado guardado → limpio
- [ ] Export/Print/Open desde estudio funcionan (RunSafely, sin fallos mudos)
- [ ] Cerrar y reabrir → preview del Demo refleja la edición
- [ ] Tema claro y oscuro · [ ] High DPI (150 %) · [ ] Solo teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Designer/Architecture.md` (secciones shell + ciclo de vida), `Designer/Integration.md`
(contrato de hosting: eventos, StudioAuthoringContext).

## 14. User Documentation to produce
«El estudio de diseño» (tour de la ventana), «Guardar y abrir reportes».

## 15. Acceptance Criteria
- Cierre con cambios siempre confirma; título refleja documento y estado sucio.
- Checklist §12 completa con capturas; build 0/0; suite verde.
