# PART16 — LivePreview (vista previa embebida del estudio)

## 1. Purpose
La vista previa dentro del estudio: `LivePreviewController` (composición en background
con cancelación cooperativa — cada refresh cancela el anterior; solo el más reciente
publica), su integración en `DesignerStudioControl.RefreshPreviewAsync` y la
publicación de diagnósticos al panel de errores.

## 2. Current State
Funcional (Fases 11/23). Fase 28: `RefreshPreviewAsync` captura fallos de composición
→ panel de errores + Salida (antes el controller solo capturaba cancelación → los
errores morían como Task no observado).

## 3. Comparison against DevExpress
DevExpress tiene una pestaña Preview separada que compone bajo demanda. AegiReports
tiene preview EN VIVO junto al diseño (ventaja), con recomposición incremental por
página (`SessionDiff`). El disparo del refresh (¿cada edición? ¿debounce?) debe
auditarse para no recomponer en cada tecla.

## 4. Missing Features
- Debounce configurable del refresh (evitar recomponer en cada micro-edición).
- Toggle «preview en vivo / manual» + botón de refresh explícito.
- Indicador de «componiendo…» no bloqueante (spinner sutil) con estado terminal.

## 5. UX Problems
- Durante recomposición de un documento grande, el preview no debe congelar la UI
  (ya es async; verificar que el hilo de UI queda libre).
- Diagnósticos: distinguir warning de error visualmente en el panel.

## 6. Backend Problems
- Confirmar que la cancelación realmente aborta el trabajo pesado (tokens en el
  pipeline) y no solo descarta el resultado.

## 7. Frontend Problems
- El indicador de progreso debe alcanzar SIEMPRE estado terminal (lección de la Fase
  28: nunca «Componiendo…» colgado).

## 8. Technical Debt
- El manejo de errores quedó cubierto en Fase 28; formalizar con test.

## 9. Required Improvements
1. Debounce (p. ej. 250 ms) + modo manual con refresh explícito.
2. Spinner sutil con estado terminal garantizado (éxito/error).
3. Cancelación efectiva verificada en el pipeline.

## 10. Implementation Plan
1) Controller: debounce, modo manual, propagación de token al pipeline.
2) Shell: spinner, toggle, panel de diagnósticos con severidad.
3) Recorrido manual con documento grande (estrés).

## 11. Automated Test Plan
- Controller: solo la última solicitud publica (existente); cancelación aborta;
  excepción de composición → resultado de error observable (no unobserved).
- Debounce: N ediciones rápidas → 1 composición.

## 12. Manual Validation Checklist
- [ ] Editar → preview se actualiza (con debounce, sin parpadeo por tecla)
- [ ] Documento grande → UI responde durante composición; estado terminal siempre
- [ ] Forzar error de composición (expresión inválida) → panel de errores, sin cuelgue
- [ ] Modo manual: editar no recompone hasta pulsar refresh
- [ ] Diagnósticos con warning y error distinguibles
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Designer/Architecture.md` (LivePreviewController, cancelación),
`Designer/Performance.md` (debounce, incremental).

## 14. User Documentation to produce
«La vista previa en vivo» (modo en vivo/manual, diagnósticos).

## 15. Acceptance Criteria
- Estado terminal garantizado; debounce operativo; cancelación efectiva; errores
  nunca mudos; checklist §12 con capturas; suite verde.
