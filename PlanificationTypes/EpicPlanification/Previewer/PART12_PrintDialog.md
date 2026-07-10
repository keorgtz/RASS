# PART12 — PrintDialog (diálogo de impresión del visor)

## 1. Purpose
El diálogo de impresión del visor: selección de impresora del sistema, rango de
páginas, copias y collate (`PrintSequence`, función pura), vista previa de la página a
imprimir, progreso y cancelación, sobre `DocumentPrinter`.

## 2. Current State
Funcional (Fase 24). Impresoras del sistema, rango, copies/collate aplicados vía
`PrintSequence`, preview, progreso, cancelación. Fase 28: la vista previa del diálogo
tiene try/catch (conserva la anterior si el render falla); print desde Demo con
`RunSafely`.

## 3. Comparison against DevExpress
DevExpress: diálogo con impresora/rango/copias/collate/dúplex/orientación y escalado
al papel. AegiReports cubre impresora/rango/copias/collate; **escalado de impresión NO**
(límite ADR-0026: media por página) y dúplex a auditar.

## 4. Missing Features
- **Escalado de impresión** (ajustar al papel / % ) — límite declarado; decidir cierre
  o reafirmación 1.0 (coordinar con Epic Printing).
- Dúplex y selección de bandeja si la impresora lo soporta.
- Impresión de páginas pares/impares.

## 5. UX Problems
- La vista previa debe reflejar copias/collate/rango elegidos.
- Estado terminal del progreso; cancelación detiene el spool.

## 6. Backend Problems
- Manejo de impresora offline / sin impresoras / error de spooler → diálogo Meridian,
  nunca excepción cruda.

## 7. Frontend Problems
- Campos de rango con validación inline; copias ≥ 1.

## 8. Technical Debt
- El escalado depende del Epic Printing; coordinar la decisión.

## 9. Required Improvements
1. Decisión sobre escalado + dúplex/bandeja/pares-impares (con Epic Printing).
2. Preview fiel a las opciones; cancelación real del spool.
3. Manejo de errores de impresora con diálogo profesional.

## 10. Implementation Plan
1) Modelo: `PrintSequence` con pares/impares; opciones de dúplex si el driver expone.
2) WPF: preview fiel, validación, manejo de errores.
3) Recorrido manual con impresora real y con «Microsoft Print to PDF».

## 11. Automated Test Plan
- `PrintSequence`: copias/collate/rango/pares-impares producen la secuencia correcta;
  rango inválido rechaza; sin impresoras → estado manejado.

## 12. Manual Validation Checklist
- [ ] Imprimir a «Microsoft Print to PDF»: rango, copias, collate correctos
- [ ] Preview refleja las opciones
- [ ] Pares/impares; dúplex (si soportado)
- [ ] Cancelar detiene el trabajo
- [ ] Sin impresoras / impresora offline → diálogo Meridian, sin fallo mudo
- [ ] Escalado (si en alcance) o límite documentado visible
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Previewer/Integration.md` (impresión), remite a `Printing/*` del Epic Printing.

## 14. User Documentation to produce
«Imprimir un documento» (impresora, rango, copias, collate).

## 15. Acceptance Criteria
- Impresión con rango/copias/collate/pares-impares correcta; errores no mudos; decisión
  de escalado cerrada; checklist §12 con capturas; suite verde.
