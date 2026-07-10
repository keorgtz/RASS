# PART01 — EngineCore (gramática, tipos y evaluación)

## 1. Purpose
El núcleo del motor de expresiones (`AegiReports.Expressions`): tokenizer, parser,
árbol de expresión y evaluador — operadores aritméticos/lógicos/comparación/concatenación,
tipos (número/decimal/texto/bool/fecha/null), coerciones y semántica de null.

## 2. Current State
Funcional y maduro. Motor sandboxed determinista sin Roslyn; evalúa contra un contexto
de banda/registro. Es la base de bindings, formato condicional y campos calculados.

## 3. Comparison against DevExpress
DevExpress Expression Language: operadores, funciones, `Iif`, `?:`, `[FieldName]`,
operadores de fecha, y coerciones. AegiReports cubre el núcleo; auditar la cobertura de
operadores (módulo, potencia, bit a bit si aplica), la precedencia completa y la
semántica de null en operaciones mixtas.

## 4. Missing Features
- Cobertura de operadores contra DevExpress (módulo `%`, ternario, `In`, `Like` como
  operador) — clasificar existente/gap.
- Coerciones explícitas (`ToStr`/`ToDecimal`) y reglas de promoción numérica
  documentadas.
- Semántica de null uniforme (null-propagation vs error) documentada.

## 5. UX Problems
N/A (motor); impacta el editor (PART07) y los mensajes (PART06).

## 6. Backend Problems
- Precedencia y asociatividad de operadores verificadas contra una tabla canónica.
- Comparación de tipos mixtos (número vs texto) con reglas claras, no comportamiento
  implícito sorpresa.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
- El casing de comparación de strings debe alinearse con el intérprete del query builder
  (QueryBuilder PART10) — documentar la política única.

## 9. Required Improvements
1. Tabla canónica de operadores/precedencia + cobertura de gaps de alto uso.
2. Coerciones explícitas y promoción numérica documentadas y testeadas.
3. Semántica de null uniforme.

## 10. Implementation Plan
1) Auditar operadores/precedencia contra DevExpress; cerrar gaps de alto uso.
2) Coerciones + null-semantics con tests exhaustivos.
3) Documentar la gramática formal.

## 11. Automated Test Plan
- Precedencia/asociatividad por tabla; operadores y coerciones; null-propagation;
  comparación de tipos mixtos; casos límite (división por cero, overflow decimal).

## 12. Manual Validation Checklist
(vía editor de expresiones con datos de diseño)
- [ ] `[Amount] * 1.16 + 10` evalúa con precedencia correcta
- [ ] Operaciones con null → resultado documentado (null o error claro)
- [ ] Comparación número vs texto → regla esperada
- [ ] Módulo/ternario/coerciones (si en alcance) funcionan
- [ ] División por cero → error claro, no crash
- [ ] Mismo resultado determinista en repetición

## 13. Technical Documentation to produce
`Expressions/Architecture.md` (gramática, tipos, coerciones, null).

## 14. User Documentation to produce
Base de «Expresiones en AegiReports» (sintaxis y operadores).

## 15. Acceptance Criteria
- Operadores/precedencia/coerciones/null completos y documentados; casing alineado con
  el query builder; checklist §12 con capturas; build 0/0; suite verde.
