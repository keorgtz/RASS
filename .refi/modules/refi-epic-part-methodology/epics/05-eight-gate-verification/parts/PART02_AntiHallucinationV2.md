# PART02 — Anti-Hallucination v2

## 1. Purpose
Reforzar `rules/anti-hallucination.md` con cláusulas específicas al PART nuevo.

## 2. Current State
El archivo actual (16 líneas) sólo cubre anti-invención genérica.

## 3. Comparison against baseline
EpicPlanification incluye la sección 3 (Comparison) como ancla contra realidad.

## 4. Missing / Required Scope
Añadir al archivo existente:

```md
## Extensiones para PARTs REFI v2

- **Sección 3 (Comparison against baseline)** — Obligatoria en TODOS los PARTs.
  Debe nombrar archivos, clases, líneas, rutas o URLs concretas del codebase /
  competidor / convención. Si NO hay baseline comparable, marcar `N/A — greenfield`
  con 1 línea de justificación.
- **Sección 9 (Required Improvements)** — Verbos concretos + objeto + medida
  esperada. Nunca "mejorar X" sin definir cómo se mide.
- **Sección 10 (Implementation Plan)** — Archivos del repo enumerados. Si no
  aplica, `N/A` con justificación.
- **Sección 15 (Acceptance Criteria)** — Lista de viñetas testeables. Cada bullet
  debe poder ejecutar en un test, un comando, un script o una inspección visual.
  Lo que no se puede verificar no es criterio de aceptación.
- **Inventario prohibido:** nunca inventar tablas, endpoints, columnas, jobs,
  servicios, ni APIs. Si no sabes, marca `UNKNOWN — investigate before
  implementing` y registra el bullet en §9.
```

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
Sin estas cláusulas, las secciones 3 y 15 se vuelven narrativas.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
N/A.

## 9. Required Improvements
1. Añadir el bloque §4 a `rules/anti-hallucination.md`.

## 10. Implementation Plan
1) Bloque arriba.
2) Insertarlo al final del archivo.

## 11. Automated Test Plan
- Linter: las 4 viñetas de §4 existen en el archivo y referencian las secciones
  correctas del PART.

## 12. Manual Validation Checklist
- [ ] Cláusulas presentes en el archivo.
- [ ] El bloque del EPIC 02 (PART03) coincide con este.

## 13. Technical Documentation to produce
- `rules/anti-hallucination.md` v2.

## 14. User Documentation to produce
EPIC 06.

## 15. Acceptance Criteria
- 5 cláusulas presentes.
- Anclaje a §3, §9, §10, §15 explícito.
