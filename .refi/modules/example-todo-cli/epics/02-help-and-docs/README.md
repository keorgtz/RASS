# EPIC 02 — Help & Docs

**Prioridad:** P1 · **Complejidad:** M ·
**Completitud (8 puertas):** 0 % · **Estado:** PARTs detallados (pendiente de ejecución)

## Alcance

Capa de usabilidad del CLI: `--help` por comando, comando `readme` que imprime un
Markdown de la lista actual, y checklist de smoke manual.

## Objetivos

1. Cada subcomando expone `--help` con descripción, args, ejemplos.
2. `node bin/todo.js readme` imprime un Markdown listo para pegar en un README.
3. Checklist manual ejecutable end-to-end sin escribir nada a mano.

## Dependencias

- **Entrantes:** EPIC 01 (Setup CLI) — los comandos `add`, `list`, `complete`
  deben existir.
- **Salientes:** ninguna.

## Complejidad y prioridad

- **Complejidad M:** trabajo de texto + 1 generador simple.
- **P1:** importante pero no bloquea la adopción del CLI.

## Files to Modify / Create

- `bin/todo.js` (MODIFY) — añadir rama `--help` por subcomando.
- `lib/help.js` (NEW) — textos de ayuda centralizados.
- `lib/readme.js` (NEW) — generador de Markdown a partir de `todos.json`.

## PARTs planificados

- PART01_HelpTexts — textos de `--help` para cada subcomando; tabla canónica.
- PART02_ReadmeGen — comando `readme` que imprime Markdown con tablas.
- PART03_ManualSmoke — checklist de validación manual end-to-end (8 ítems).

## Definición de Done

EPIC cerrado cuando:

- `node bin/todo.js add --help`, `list --help`, `complete --help`, `readme --help`
  muestran texto útil.
- `node bin/todo.js --help` muestra la tabla general.
- `node bin/todo.js readme` produce Markdown válido con tablas.
- El checklist `PART03_ManualSmoke.md` §12 está firmado al 100 %.
- Los 3 PARTs tienen footer firmado (8 gates cerradas).