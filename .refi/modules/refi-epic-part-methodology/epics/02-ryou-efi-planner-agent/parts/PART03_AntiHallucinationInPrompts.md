# PART03 — Anti-Hallucination in Prompts

## 1. Purpose
Inyectar en el prompt del agente las reglas anti-alucinación ESPECÍFICAS para la
planificación EPIC + PART.

## 2. Current State
`rules/anti-hallucination.md` v1 es genérico. No aplica al detalle de PARTs.

## 3. Comparison against baseline
EpicPlanification obliga la sección 3 de cada PART (Comparison against DevExpress) como
ancla contra realidad. REFI v2 debe pedirlo equivalente.

## 4. Missing / Required Scope
El prompt del agente debe incluir, dentro de las instrucciones de Pass 2, este bloque:

> **REGLA ANTI-ALUCINACIÓN EN PARTs:**
> - Toda sección 3 ("Comparison against baseline") DEBE nombrar archivos, clases,
>   funciones, líneas, o URLs concretas del codebase / competidor / convención. Si no
>   existen, marcar `N/A — greenfield` y justificar 1 línea.
> - Toda sección 9 ("Required Improvements") debe ser concreta y verificable (verbo +
>   objeto + medida esperada).
> - Toda sección 10 ("Implementation Plan") debe enumerar archivos exactos del
>   repositorio o declarar `N/A` con justificación.
> - Toda sección 15 ("Acceptance Criteria") debe ser una lista de viñetas TESTEABLES.
>   Cada bullet debe poder ejecutar en un script, test, comando, o inspección visual;
>   si no es testeable, no es criterio de aceptación.
> - Nunca inventar: archivos, APIs, columnas, endpoints, servicios. Si dudas, marca
>   `UNKNOWN — investigate before implementing` y enumera el bullet en §9.

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
Sin este bloque, las secciones 3 y 15 se vuelven narrativas; las alucinaciones entran.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
Prompts viejos permitían llenar §3 sin ancla; este bloque elimina esa puerta.

## 9. Required Improvements
1. Insertar el bloque literal en el prompt del agente.
2. Aplicar también en `rules/anti-hallucination.md` v2 (EPIC 05).

## 10. Implementation Plan
1) Definir el bloque arriba.
2) Aplicar a ambos sitios.

## 11. Automated Test Plan
- Linter: cualquier PART nuevo debe tener §3 con al menos un ancla concreta O `N/A —
  greenfield` justificado.

## 12. Manual Validation Checklist
- [ ] El bloque existe en el prompt.
- [ ] El bloque existe en `rules/anti-hallucination.md` v2.
- [ ] Las dos copias son idénticas.

## 13. Technical Documentation to produce
- `rules/anti-hallucination.md` v2 (EPIC 05).
- Bloque en el prompt del agente.

## 14. User Documentation to produce
EPIC 06.

## 15. Acceptance Criteria
- Bloque literal presente en dos sitios.
- Cobertura de §3, §9, §10, §15 explícita.
