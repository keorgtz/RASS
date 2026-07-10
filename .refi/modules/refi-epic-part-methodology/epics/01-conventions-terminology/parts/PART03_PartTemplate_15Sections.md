# PART03 — PART Template · 15 Sections

## 1. Purpose
Fijar las 15 secciones obligatorias de un PART y declarar cuáles admiten "N/A — greenfield".

## 2. Current State
REFI v1 sólo usa el template `domain-shards/01-*.md` con 7 secciones (Objective, Included,
Excluded, Affected Areas, Hard Rules, Implementation Notes, Verification). Es muy laxo.

## 3. Comparison against baseline
EpicPlanification PART template: 15 secciones fijas (Purpose → Acceptance Criteria). El
template es ESTRICTO: cada PART tiene las 15 secciones o no es un PART válido.

## 4. Missing / Required Scope
Las 15 secciones, en orden:

1. **Purpose** — qué existe y por qué. (obligatoria)
2. **Current State** — as-is; **N/A — greenfield** si se construye desde cero.
3. **Comparison against baseline** — contra código real / competidor / convención;
   **N/A — greenfield** justificando que no existe baseline comparable.
4. **Missing / Required Scope** — inventario del gap. (obligatoria)
5. **UX Problems** — sólo si el PART toca UI; **N/A — no UI** en caso contrario.
6. **Backend / Logic Problems** — problemas de servidor, dominio, datos, infraestructura.
   (obligatoria)
7. **Frontend / Presentation Problems** — sólo si el PART toca presentación; **N/A — no UI**.
8. **Technical Debt** — compromisos heredados. (obligatoria; "ninguno" es aceptable).
9. **Required Improvements** — lista numerada, concreta, testeable. (obligatoria)
10. **Implementation Plan** — pasos ordenados, archivos afectados, orden de cambios.
    (obligatoria)
11. **Automated Test Plan** — unit + integration; "no new tests" es aceptable si se
    justifica. (obligatoria)
12. **Manual Validation Checklist** — viñetas con acciones en hosts reales. (obligatoria)
13. **Technical Documentation to produce** — sólo especificar; no generar. (obligatoria;
    "ninguno" es aceptable).
14. **User Documentation to produce** — sólo especificar; no generar. (obligatoria).
15. **Acceptance Criteria** — bullets verificables que cierran el PART. (obligatoria)

Adicionalmente, todo PART debe terminar con un **footer de gates** (definido en EPIC 05):

```md
---

## Gates Evidence

- Gate 1 (Architecture Review): …
- Gate 2 (Scope & Completeness Audit): …
- Gate 3 (UX/Design Review): …
- Gate 4 (Manual / Runtime Validation): …
- Gate 5 (Defect Closure): …
- Gate 6 (Technical Documentation): …
- Gate 7 (User Documentation): …
- Gate 8 (Final Review & Sign-off): …

**Signed by:** _______________  **Date:** _______________
```

## 5. UX Problems
N/A — sin UI.

## 6. Backend / Logic Problems
Sin la sección 3, no hay anclaje contra la realidad; las alucinaciones vuelven.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
`modules/_template/domain-shards/01-example.md` (7 secciones) y la nueva estructura PART
(15 secciones) coexisten temporalmente; ambos se soportan.

## 9. Required Improvements
1. Publicar `templates/part-template.md` con el bloque exacto de las 15 secciones.
2. Actualizar `modules/_template/` para que la nueva carpeta `epics/` tenga un
   `parts/PART01_example.md` de muestra con todas las secciones llenas.

## 10. Implementation Plan
1) Definir el bloque en este PART (cuerpo).
2) EPIC 04 lo vuelca a `templates/part-template.md`.

## 11. Automated Test Plan
- Test de compliance: linter en `templates/part-template.md` que verifica que las 15
  secciones existen y están en orden, en español o inglés.

## 12. Manual Validation Checklist
- [ ] Crear un PART de prueba siguiendo solamente este spec + la plantilla de EPIC 04.
- [ ] Verificar que cada sección N/A justificable queda explícitamente marcada.
- [ ] Verificar que el footer de gates contiene los 8 huecos a llenar.

## 13. Technical Documentation to produce
- `templates/part-template.md` (EPIC 04).

## 14. User Documentation to produce
EPIC 06.

## 15. Acceptance Criteria
- Las 15 secciones numeradas existen en `templates/part-template.md`.
- Las reglas N/A están explícitas.
- El footer de gates tiene 8 entradas placeholder.
