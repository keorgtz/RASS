# Epic Matrix · <Module Name>

> Strategy: **plan 100 % before any code.** Each PART's 8 gates are signed before
> the next PART starts. EPICs in execution order below; dependency arrows show
> hard constraints (must finish all PARTs of an EPIC before starting the next).

Complexity: **B** = Baja · **M** = Media · **A** = Alta · **MA** = Muy alta.
Duration: sesiones de trabajo enfocadas.

| # | Epic | Prioridad | Depende de | Complejidad | Duración | % | Estado |
|---|---|---|---|---|---|---|---|
| 1 | <epic-slug> | P0 | — | M | 2 | 0 % | Backlog |
| 2 | <epic-slug> | P1 | EPIC 01 | A | 3 | 0 % | Backlog |
| … | … | … | … | … | … | … | … |

**Total:** N EPICs · M PARTs planificados · ~X sesiones de trabajo.

## Execution Order

1. **EPIC <NN>** — justificación de 1 línea.
2. **EPIC <NN>** — justificación de 1 línea.
3. …

## EPIC ↔ Ryou-Orchestrator Mapping

Cada EPIC se entrega a **Ryou Orchestrator** como una unidad. Orchestrator ejecuta
los PARTs del EPIC en el orden declarado, aplicando las 8 gates a cada PART antes de
avanzar. **Ningún PART puede saltarse una gate.**

## Status Update Rule

Cuando un PART cierra las 8 gates:

- El footer del PART registra fecha + firma.
- El `%` del EPIC en esta matriz sube proporcionalmente.
- `progress.md` del packet se actualiza.

Cuando un EPIC cierra todos sus PARTs:

- Se crea un commit con trailer de coautoría.
- Esta matriz se actualiza (`Backlog` → `Terminado`).
- Orchestrator pasa al siguiente EPIC según el orden de ejecución.

## Promotion Rules

- Un EPIC **no** puede pasar de `Backlog` a `EN CURSO` sin antes pasar por
  `PARTs detallados`.
- Un EPIC **no** puede pasar de `PARTs detallados` a `EN CURSO` hasta que el
  packet completo esté en `planning-complete` (todos los demás EPICs también en
  `PARTs detallados` o `Terminado`).
- Un EPIC pasa a `Terminado` solo cuando su `% = 100 %`.