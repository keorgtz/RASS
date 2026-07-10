# PART04 — Handoff Contract

## 1. Purpose
Definir el contrato exacto del hand-off de Ryou EFI Planner a Ryou Orchestrator.

## 2. Current State
No existe contrato; el handoff se hace ad-hoc.

## 3. Comparison against baseline
EpicPlanification §6 y §7 fijan el orden y la estrategia de ejecución; el handoff
debe entregar esto a Orchestrator.

## 4. Missing / Required Scope
Al cerrar Pass 2, el agente debe entregar literal a Ryou Orchestrator:

1. Lista de EPICs en orden de ejecución (de `orchestration-map.md`).
2. Por cada EPIC: lista numerada de PARTs en orden interno.
3. Por cada PART: ruta a su archivo, sus Acceptance Criteria (§15), su Validation
   Checklist (§12), y los 8 gates que debe atravesar.
4. Estado: `planning-complete`, listo para `execution-start`.

Mensaje literal del hand-off:

> "Hand-off a Ryou Orchestrator.
>
> EPICs (N total, orden):
>   01 — <epic>  →  PART01, PART02, …, PARTnn
>   02 — <epic>  →  …
>
> Por cada PART, esperar 8 gates en orden (ver orchestrator prompt).
>
> Estado del packet: planning-complete. NO comenzar hasta que confirmes."

Y el handoff se materializa, además, en `orchestration-map.md` y en `progress.md`.

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
Sin contrato, Ryou Orchestrator decide cuándo y cómo ejecutar; vuelve el caos.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
No existe contrato hoy.

## 9. Required Improvements
1. Bloque literal en el prompt de Ryou EFI Planner.
2. Bloque simétrico en `ryou-orchestrator.md` que diga "espera este hand-off"
   (no se reescribe orchestrator aquí; se anota en EPIC 06 como pointer).

## 10. Implementation Plan
1) Definir mensaje literal.
2) Aplicarlo al prompt.

## 11. Automated Test Plan
- Test: agent's last emitted text en Pass 2 debe terminar con la cadena literal
  "Hand-off a Ryou Orchestrator." más la lista.

## 12. Manual Validation Checklist
- [ ] Mensaje literal en el prompt.
- [ ] `orchestration-map.md` se crea en Pass 3.
- [ ] `progress.md` se actualiza con `planning-complete`.

## 13. Technical Documentation to produce
- Bloque literal en el prompt.

## 14. User Documentation to produce
EPIC 06.

## 15. Acceptance Criteria
- Existe el mensaje literal.
- `orchestration-map.md` y `progress.md` se generan.
