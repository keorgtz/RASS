# PART14 — ConditionalFormatting (formato condicional)

## 1. Purpose
El formato condicional del estudio: `ConditionalFormattingWindow` (reglas por control
nombrado), `ConditionalFormatRule` + `ConditionalFormattingApplier` (post-expansión
plana, motor intacto) y su ciclo de vida en el `StudioAuthoringContext`.

## 2. Current State
Funcional (Fase 23). Fase 28: `MeridianDialog.ShowWarning` cuando no hay controles con
nombre; ventana tematizada. **Límite declarado (ADR-0025):** solo aplica en expansión
PLANA (no agrupada) y las reglas NO persisten en `.aedocx`.

## 3. Comparison against DevExpress
DevExpress persiste las reglas en el documento, aplica en cualquier modo de expansión
y ofrece galería de condiciones predefinidas (mayor que, top N, barras de datos…).
AegiReports: expresión libre (más potente) pero sin persistencia ni soporte agrupado —
ambos son gaps de producto REALES para 1.0.

## 4. Missing Features
- **Persistencia de reglas en `.aedocx`** (elemento propio del esquema, versionado) —
  sin esto la feature se pierde al guardar: prioridad máxima del PART.
- **Aplicación en expansión agrupada** (el applier debe operar también sobre
  `GroupedDocumentExpander`).
- Presets de condición comunes (>, <, entre, top N) que generan la expresión.

## 5. UX Problems
- La ventana lista reglas planas; falta vista por control y validación en vivo de la
  expresión (reusar editor del PART13).
- Vista previa del efecto (swatch del estilo resultante) ausente.

## 6. Backend Problems
- Persistencia: decidir esquema (`<ConditionalFormats>` en el documento) + migración;
  el applier agrupado debe mantener determinismo.

## 7. Frontend Problems
- Edición de la expresión en TextBox plano — debe abrir el editor completo.

## 8. Technical Debt
- El límite «solo plano, sin persistencia» es la mayor deuda declarada del designer;
  este PART la salda.

## 9. Required Improvements
1. Esquema y round-trip `.aedocx` de reglas (con tests byte a byte).
2. Applier sobre expansión agrupada + tests de equivalencia.
3. UI: presets, editor de expresiones embebido, swatch de vista previa.

## 10. Implementation Plan
1) Serialization: elemento de reglas + lectura/escritura + migración v1.
2) Applier agrupado (mismo contrato post-expansión) + tests.
3) UI: presets → expresión, ƒx, swatch.
4) Recorrido manual con reporte agrupado hotelero.

## 11. Automated Test Plan
- Round-trip .aedocx con N reglas; documento viejo sin reglas carga igual.
- Applier plano vs agrupado: mismas filas → mismos estilos.
- Presets generan expresiones válidas; regla sobre control renombrado/eliminado.

## 12. Manual Validation Checklist
- [ ] Crear regla (>, top N por preset, expresión libre) sobre reporte plano
- [ ] Aplicar sobre reporte AGRUPADO → celdas correctas
- [ ] Guardar .aedocx, cerrar, reabrir → reglas intactas y activas
- [ ] Renombrar control → la regla sigue o avisa; eliminar control → diagnóstico
- [ ] Editar expresión con el editor completo; inválida → error inline
- [ ] Undo/redo de alta/edición/baja de reglas
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Designer/Architecture.md` (applier), `Serialization` (esquema de reglas),
`Designer/Migration.md` (documentos previos sin reglas).

## 14. User Documentation to produce
«Formato condicional» (tutorial con presets y expresiones).

## 15. Acceptance Criteria
- Reglas persistentes y activas en plano Y agrupado; límite de ADR-0025 eliminado o
  reescrito; checklist §12 con capturas; suite verde.
