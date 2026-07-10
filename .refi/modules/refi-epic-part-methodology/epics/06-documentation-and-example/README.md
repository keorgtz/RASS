# EPIC 06 — User Documentation & Worked Example

**Prioridad:** P1 · **Complejidad:** M · **Completitud (8 puertas):** 0 %
**Estado:** Backlog (este README; PARTs detallados en Pass 2)

## Alcance

Documentar la nueva metodología para usuarios y demostrar un ciclo completo con un
paquete REFI de ejemplo.

- Añadir una sección "REFI v2 · Epic + PART methodology" al `README.md` raíz.
- Añadir un diagrama simple (ASCII) del flujo de 3 pasadas.
- Crear un paquete REFI worked-example de demo bajo `.refi/examples/` (o un módulo
  completo bajo `.refi/modules/_example/`) que cubra el ciclo entero.

NO incluye: tutorial interactivo, vídeo, ni automatización de pruebas.

## Objetivos

1. Un humano nuevo puede leer el README y entender el método en 5 minutos.
2. Un paquete REFI worked-example demuestra: 2 EPICs, ~6 PARTs, gates firmados,
   hand-off completo.
3. El README raíz no aumenta más de 30 líneas netas.

## Dependencias

- **Entrantes:** EPICs 01–05 finalizados.
- **Salientes:** consumido por futuros módulos REFI como referencia.

## Files to Modify / Create

- **Update:** `README.md` (raíz del repo).
- **Create:** `.refi/modules/example-todo-cli/` (paquete demo) — alternativamente en
  `.refi/examples/`.

## PARTs planificados (4)

- **PART01_ReadmeMethodologySection** — bloque "REFI v2" en el root README.
- **PART02_DiagramThreePasses** — diagrama ASCII de Pass 1 → Pass 2 → Pass 3.
- **PART03_WorkedExampleEpicA_Part01** — demostrar un EPIC de demo (Setup CLI).
- **PART04_WorkedExampleEpicB_Part01** — demostrar un segundo EPIC (Documentation
  generator) con sus PARTs.

## Definición de Done

- `README.md` raíz explica el método y enlaza al paquete worked-example.
- `.refi/modules/example-todo-cli/` (o equivalente) tiene `epics/matrix.md`, 2 EPICs,
  6+ PARTs, gates firmados.
