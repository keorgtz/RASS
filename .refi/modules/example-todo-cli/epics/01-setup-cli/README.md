# EPIC 01 — Setup CLI

**Prioridad:** P0 · **Complejidad:** M ·
**Completitud (8 puertas):** 0 % · **Estado:** PARTs detallados (pendiente de ejecución)

## Alcance

Construir el esqueleto del CLI y los comandos básicos `add`, `list`, `complete`,
más la persistencia en JSON. NO incluye `--help` por comando (eso vive en EPIC 02),
ni el comando `readme` (también EPIC 02).

## Objetivos

1. CLI ejecutable con `node bin/todo.js <subcommand>`.
2. Persistencia atómica en `./todos.json` con backup en cada escritura.
3. Sin dependencias externas (Node.js stdlib únicamente).
4. Cada subcomando imprime a stdout o stderr; códigos de salida estándar.

## Dependencias

- **Entrantes:** ninguna.
- **Salientes:** EPIC 02 (Help & Docs) consume la estructura de subcomandos.

## Complejidad y prioridad

- **Complejidad M:** archivo único, ~150 líneas, lógica directa.
- **P0:** sin este EPIC no hay CLI; todo lo demás depende.

## Files to Modify / Create

- `bin/todo.js` (NEW) — entry point y dispatch de subcomandos.
- `lib/store.js` (NEW) — lectura/escritura de `todos.json` con backup.
- `todos.json` (NEW, auto-generado en primer `add`) — persistencia.

## PARTs planificados

- PART01_CLISkeleton — entry point + dispatcher sin lógica; estructura lista.
- PART02_CommandsAddListComplete — implementación de los 3 comandos principales.
- PART03_PersistenceJSON — módulo `lib/store.js` con read/write atómico + backup.

## Definición de Done

EPIC cerrado cuando:

- `node bin/todo.js --help` lista los 4 subcomandos (`add`, `list`, `complete`,
  `done`).
- `node bin/todo.js add "x" && node bin/todo.js list` muestra "x".
- `node bin/todo.js complete 1` mueve el item a la lista de hechos.
- `node bin/todo.js done` (alias) produce el mismo efecto que `complete`.
- `todos.json` existe tras el primer `add` y es JSON válido.
- Los 3 PARTs tienen footer firmado (8 gates cerradas).