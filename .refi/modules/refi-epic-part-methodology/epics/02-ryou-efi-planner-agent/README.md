# EPIC 02 — Ryou EFI Planner Agent Prompt

**Prioridad:** P0 · **Complejidad:** M · **Completitud (8 puertas):** 0 %
**Estado:** Backlog (este README; PARTs detallados en Pass 2)

## Alcance

Reescribir el prompt del agente **Ryou EFI Planner** (`.opencode/agents/ryou-efi-planner.md`)
para que planifique en la nueva metodología:

- Pass 1 — Epic breakdown (request + master-blueprint + epics/matrix + epics/NN/README).
- Wait for user confirmation.
- Pass 2 — PART detail (15 sections, 8 gates footer) por EPIC.
- Wait for user confirmation (multi-EPIC).
- Pass 3 — Orchestration map + handoff to Ryou Orchestrator.

NO incluye: cambios a `ryou-orchestrator.md` (eso es EPIC 03 + EPIC 06); cambios al
instalador; cambios al TUI.

## Objetivos

1. El agente produce EPICs antes de tocar código, sin importar la presión del usuario.
2. El agente WAITS at the user gates (entre Pass 1 y Pass 2, y antes de ejecutar).
3. El agente aplica anti-hallucination en cada sección 3 (baseline) y 15 (Acceptance).
4. El agente cita siempre el glosario v2 (EPIC 01) y respeta las 8 gates.

## Dependencias

- **Entrantes:** EPIC 01 (glosario y reglas).
- **Salientes:** este EPIC es consumido por todos los EPICs siguientes; sin él, nada cambia.

## Complejidad y prioridad

- **Complejidad M:** un archivo de prompt, con cuidado editorial.
- **P0:** es el corazón de la nueva metodología.

## Files to Modify / Create

- **Rewrite:** `.opencode/agents/ryou-efi-planner.md`.

## PARTs planificados (4)

- **PART01_NewWorkflowTwoPasses** — codificar Pass 1 (Epic breakdown) y Pass 2 (PART
  detail) en el prompt.
- **PART02_GatingUserConfirmation** — declarar los dos "STOP" donde el agente espera
  al usuario; qué responde exactamente.
- **PART03_AntiHallucinationInPrompts** — cómo se invocan las reglas anti-alucinación
  dentro de cada PART (sección 3 obligatoria, sección 15 verificable).
- **PART04_HandoffContract** — formato del handoff a `ryou-orchestrator`: orden EPIC,
  por-EPIC orden de PART, 8 gates explícitos.

## Definición de Done

- El prompt reescrito está en `.opencode/agents/ryou-efi-planner.md`.
- Cita el glosario v2, las 8 gates y la regla 100 % planning.
- Una sesión simulada con un request típico produce los artifacts esperados en orden.
