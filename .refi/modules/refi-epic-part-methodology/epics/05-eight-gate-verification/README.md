# EPIC 05 — 8-Gate Verification System

**Prioridad:** P0 · **Complejidad:** M · **Completitud (8 puertas):** 0 %
**Estado:** Backlog (este README; PARTs detallados en Pass 2)

## Alcance

Codificar el ciclo de 8 puertas como sistema verificable, no como guideline decorativo.

- Sustituir `.opencode/refi/rules/quality-gates.md` por una tabla numerada de 8 puertas
  con evidencia exigida.
- Reforzar `.opencode/refi/rules/anti-hallucination.md` con cláusulas específicas a
  secciones 3 y 15 del PART.
- Hacer que `modules/_template/verification.md` pida por gate, no genéricamente.

NO incluye: los templates concretos (EPIC 04), ni la documentación del usuario (EPIC 06).

## Objetivos

1. Todo PART terminado tiene evidencia explícita por gate.
2. El `verification.md` de un packet es la suma de las verificaciones de cada PART.
3. Las quality gates son ejecutables por un linter mínimo.

## Dependencias

- **Entrantes:** EPIC 01 (definición de las 8 puertas en PART04).
- **Salientes:** consumido por EPIC 02 (prompt), EPIC 04 (template verification.md).

## Files to Modify / Create

- **Update:** `.opencode/refi/rules/quality-gates.md`.
- **Update:** `.opencode/refi/rules/anti-hallucination.md`.
- **Update:** `.opencode/refi/modules/_template/verification.md`.

## PARTs planificados (3)

- **PART01_QualityGatesV2** — tabla de 8 puertas con evidencia mínima exigida.
- **PART02_AntiHallucinationV2** — cláusulas extras: sección 3 ancla; sección 15
  testeable; sección 10 archivos exactos; sin inventar.
- **PART03_VerificationMdTemplate** — plantilla del `verification.md` que pide una
  sub-sección por gate, una por PART, y una agregada a nivel packet.

## Definición de Done

- `rules/quality-gates.md` reemplazado por la nueva tabla.
- `rules/anti-hallucination.md` contiene las cláusulas nuevas.
- `modules/_template/verification.md` solicita las 8 subsecciones por PART.
