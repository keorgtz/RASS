# EPIC 01 — Conventions & Terminology

**Prioridad:** P0 · **Complejidad:** M · **Completitud (8 puertas):** 0 %
**Estado:** Backlog (este README; PARTs detallados en Pass 2)

## Alcance

Definir la nueva metodología de planificación REFI en términos explícitos:

- Definir formalmente **EPIC**, **PART**, **8-gate cycle**, **baseline comparison**.
- Especificar cómo interaccionan EPICs y PARTs (1 EPIC = N PARTs; N ≥ 1).
- Definir la regla de planificación 100 % antes de código.
- Definir qué se considera "complejidad válida" para crear un EPIC vs no.
- Declarar el glosario oficial REFI v2.

NO incluye: cambios al agente (EPIC 02), cambios al contrato del packet (EPIC 03),
cambios a templates (EPIC 04), cambios a las quality gates (EPIC 05). Esos viven en
sus propios EPICs.

## Objetivos

1. Single source-of-truth para los conceptos de la nueva metodología.
2. Reglas que reduzcan ambigüedad cuando un agente genera EPICs o PARTs nuevos.
3. Glosario alineado con `PlanificationTypes/EpicPlanification/` para coherencia externa.

## Dependencias

- **Entrantes:** ninguna (EPIC raíz).
- **Salientes:** EPIC 02 consume las definiciones para reescribir el prompt; EPIC 03–05
  reutilizan el glosario.

## Complejidad y prioridad

- **Complejidad M:** la mayoría son decisiones de redacción; no hay código a tocar.
- **P0:** sin este EPIC, los demás no pueden nombrar correctamente sus conceptos.

## Files to Modify / Create

- **Update:** `.opencode/refi/rules/global-rules.md` — añadir EPIC + PART + 8 gates.
- **Create (lives in EPIC 03 contract, content defined here):** `.opencode/refi/rules/epic-glossary.md`
  — glosario canónico.

## PARTs planificados (5)

- **PART01_GlossaryAndDefinitions** — término por término: Epic, PART, gate, baseline,
  Acceptance Criteria, etc.
- **PART02_EpicAnatomy** — estructura formal de un EPIC: qué secciones tiene su README,
  cómo se mide % de completitud.
- **PART03_PartTemplate_15Sections** — definir cada una de las 15 secciones del template
  PART; marcar cuáles pueden ser N/A en greenfield.
- **PART04_EightGatesCycle** — definir las 8 puertas en orden y el criterio de pase de
  cada una; qué evidencia requiere cada una.
- **PART05_Planning100PercentRule** — regla dura de "plan first, code later" y excepciones
  explícitas (tareas triviales sin EPIC).

## Definición de Done (EPIC level)

Este EPIC se considera terminado cuando los 5 PARTs tienen las 8 puertas cerradas y:

- `rules/global-rules.md` cita los nuevos términos correctamente.
- `rules/epic-glossary.md` existe con cross-links a ejemplos de
  `PlanificationTypes/EpicPlanification/`.
- Un humano puede leer este EPIC + sus PARTs y explicar el método sin consultar código.
