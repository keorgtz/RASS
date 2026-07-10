# PART05 — Sandbox (aislamiento y límites de seguridad)

## 1. Purpose
La garantía de que las expresiones son SEGURAS: sin acceso a tipos/reflection/IO/red,
con presupuesto de evaluación (tiempo/pasos), límite de recursión y de tamaño de
resultado — una expresión de un `.aedocx` de origen no confiable no puede dañar el host.

## 2. Current State
El motor es sandboxed por diseño (sin Roslyn, gramática cerrada, funciones de una
whitelist). El `ComputedExpressionGuard` (query builder) valida léxicamente las
calculadas. Falta formalizar los límites de RECURSOS (tiempo/pasos/recursión) y una
auditoría adversarial.

## 3. Comparison against DevExpress
DevExpress evalúa expresiones en su propio lenguaje (no ejecuta C# arbitrario).
AegiReports es equivalente en cierre; el valor añadido es DEMOSTRARLO con presupuestos y
pruebas adversariales (documentos hostiles).

## 4. Missing Features
- Presupuesto de evaluación: límite de pasos/tiempo por expresión (evitar DoS por una
  expresión patológica).
- Límite de profundidad de recursión y de tamaño de string resultante.
- Prueba adversarial: corpus de expresiones hostiles que DEBEN rechazarse/acotarse.

## 5. UX Problems
- Una expresión que excede el presupuesto → diagnóstico claro («expresión demasiado
  costosa»), no cuelgue.

## 6. Backend Problems
- El evaluador debe respetar un token de cancelación/límite de pasos; strings acotados
  para no agotar memoria (p. ej. `PadLeft(x, 1e9)`).

## 7. Frontend Problems
N/A.

## 8. Technical Debt
- Coordina con Epic Security (PART03 ExpressionSandbox) — este PART es la vista del motor.

## 9. Required Improvements
1. Presupuesto de pasos/tiempo + límites de recursión/tamaño de resultado.
2. Corpus adversarial + verificación de que nada accede a tipos/IO/red.
3. Diagnóstico de «expresión demasiado costosa».

## 10. Implementation Plan
1) Motor: contador de pasos/límite de tiempo, límites de recursión/tamaño + tests.
2) Corpus adversarial (expansión exponencial, strings gigantes, recursión) rechazado.
3) Recorrido conceptual + revisión de seguridad con Epic Security.

## 11. Automated Test Plan
- Expresión patológica excede el presupuesto → abortada con diagnóstico; `PadLeft`/
  `Replace` gigantes acotados; recursión profunda cortada; ninguna función accede a
  tipos/reflection/IO (auditoría de la whitelist).

## 12. Manual Validation Checklist
- [ ] Expresión costosa (bucle de concatenación grande) → diagnóstico, sin cuelgue
- [ ] String resultante gigante acotado, sin OOM
- [ ] Ninguna función permite acceso a archivos/red/tipos
- [ ] Documento `.aedocx` con expresión hostil se abre sin dañar el host
- [ ] Diagnóstico claro de «expresión demasiado costosa»

## 13. Technical Documentation to produce
`Expressions/Security.md` (sandbox, presupuestos, límites) — coordina Epic Security.

## 14. User Documentation to produce
Nota en «Buenas prácticas»: límites de las expresiones (por qué existen).

## 15. Acceptance Criteria
- Presupuestos y límites activos; corpus adversarial rechazado; cero acceso a IO/tipos;
  diagnóstico de costo; checklist §12; suite verde.
