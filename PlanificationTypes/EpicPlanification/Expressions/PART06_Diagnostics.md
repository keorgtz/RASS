# PART06 — Diagnostics (errores de expresión accionables)

## 1. Purpose
Los diagnósticos del motor: errores de sintaxis con POSICIÓN (columna del token),
errores de datos (campo/función inexistente), errores de tipo (operación inválida) y su
recuperación, con mensajes accionables en es-MX.

## 2. Current State
El motor reporta errores de evaluación; Fase 28 encauzó los del editor con catch. Falta
formalizar la POSICIÓN del error (para subrayado en el editor), la categorización
(sintaxis/datos/tipo) y mensajes accionables consistentes.

## 3. Comparison against DevExpress
DevExpress subraya el error en el editor y da un mensaje. AegiReports debe al menos
igualar: posición + categoría + sugerencia. Auditar la calidad de cada mensaje.

## 4. Missing Features
- Posición (offset/columna) del diagnóstico para subrayar el token en el editor (PART07).
- Categorías: sintaxis / referencia (campo/función) / tipo / recurso (presupuesto).
- Sugerencia («¿quiso decir `Sum`?») para funciones/campos cercanos.

## 5. UX Problems
- El editor debe subrayar el token con error y mostrar el mensaje al pasar el cursor
  (PART07); el resultado tri-estado (valor/error sintaxis/error datos).

## 6. Backend Problems
- El parser debe conservar posiciones de token; el evaluador debe categorizar el fallo.

## 7. Frontend Problems
N/A (se refleja en el editor).

## 8. Technical Debt
- Mensajes es-MX consistentes; sin `Exception.Message` crudo hacia el usuario.

## 9. Required Improvements
1. Posición del diagnóstico + categorías + sugerencias.
2. Recuperación del parser (reportar varios errores, no solo el primero, donde sea útil).
3. Mensajes accionables es-MX consistentes.

## 10. Implementation Plan
1) Parser/evaluador: posiciones + categorías + sugerencias + tests.
2) Formato de diagnóstico común para el editor.
3) Recorrido manual introduciendo cada tipo de error.

## 11. Automated Test Plan
- Error de sintaxis con posición exacta; campo/función inexistente categorizado;
  error de tipo; sugerencia por cercanía (Levenshtein); recuperación multi-error.

## 12. Manual Validation Checklist
- [ ] `[Amount] * ` (incompleta) → error de sintaxis con posición del token
- [ ] `[NoExiste]` → error de referencia con nombre; sugerencia si hay uno cercano
- [ ] `Sum([Texto])` (tipo inválido) → error de tipo claro
- [ ] Expresión costosa → error de recurso (liga PART05)
- [ ] El editor subraya el token y muestra el mensaje (liga PART07)
- [ ] Mensajes en es-MX, accionables, sin excepción cruda

## 13. Technical Documentation to produce
`Expressions/Architecture.md` (diagnósticos, posiciones, categorías),
`Expressions/Troubleshooting.md` (errores comunes).

## 14. User Documentation to produce
Se integra en «Expresiones»: sección «Errores comunes y cómo corregirlos».

## 15. Acceptance Criteria
- Diagnósticos con posición, categoría y sugerencia, accionables es-MX; recuperación
  útil; checklist §12 con capturas; suite verde.
