# PART02 — Gating · User Confirmation

## 1. Purpose
Declarar los DOS puntos exactos donde el agente espera al usuario antes de continuar.

## 2. Current State
El prompt actual no tiene waits explícitos; el agente suele continuar implementando.

## 3. Comparison against baseline
EpicPlanification §3 separa planeación y ejecución físicamente; sin gates explícitos,
los agentes eligen.

## 4. Missing / Required Scope

**Gate A · End of Pass 1 (after `epics/<epic>/README.md` x N)**
- Mensaje literal del agente:

> "He generado `request.md`, `master-blueprint.md`, `epics/matrix.md` y N EPICs con sus
> backlogs (`epics/<epic>/README.md`). Los PARTs aún NO están detallados.
>
> ¿Cuál es el siguiente paso?
> 1) 'Detalla los PARTs de TODOS los EPICs' — escribo los PARTs de todos.
> 2) 'Detalla los PARTs de EPIC 01' — voy uno por uno, pidiendote confirmación
>    entre EPICs.
> 3) 'Detalla sólo el PART01 del EPIC 02' — granularidad por PART.
>
> No iniciaré implementación hasta que confirmes."

**Gate B · End of Pass 2 (after all EPICs have PARTs)**
- Mensaje literal del agente:

> "Todos los EPICs del packet tienen sus PARTs detallados.
>
> Voy a generar `orchestration-map.md` (orden de ejecución, gates por PART) y haré
> hand-off a Ryou Orchestrator.
>
> ¿Procedo? (sí / no — dame cambios primero)"

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
Sin Gate A, el agente implementa prematuramente. Sin Gate B, el handoff llega sin
revisión humana.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
No existe today.

## 9. Required Improvements
1. Insertar el bloque Gate A al final del "Pass 1 Workflow".
2. Insertar el bloque Gate B al final del "Pass 2 Workflow".

## 10. Implementation Plan
1) Definir los mensajes exactos en este PART.
2) Aplicarlos al prompt del agente.

## 11. Automated Test Plan
- Test: el prompt, al ser invocado, pide confirmación textual antes de seguir (assert).

## 12. Manual Validation Checklist
- [ ] Gate A aparece textualmente en el prompt.
- [ ] Gate B aparece textualmente en el prompt.
- [ ] Ningún paso de implementación aparece antes del Gate A.

## 13. Technical Documentation to produce
- Líneas literales en el prompt del agente.

## 14. User Documentation to produce
EPIC 06.

## 15. Acceptance Criteria
- Existen los dos bloques literales en el prompt.
- Cada bloque es ejecutable (texto exacto, no paráfrasis).
