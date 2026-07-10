# Request · example-todo-cli · Worked example

> **Original request:**
> > Necesito un CLI de TODOs para demostrar el flujo REFI v2. Quiero comandos
> > `add`, `list`, `complete`, `done` y persistencia en JSON. Sirve solo como
> > ejemplo dentro de `.refi/modules/` — NO se publica ni se distribuye.

## Owner

REASP · worked-example packet.

## Scope Inclusions

1. CLI con los subcomandos `add`, `list`, `complete`.
2. Persistencia en un archivo JSON local (`./todos.json`).
3. Documentación `--help` por comando.
4. Comando `readme` que imprime un README con la lista actual.

## Scope Exclusions

- No se publica a npm.
- No se integra con la nube ni con sistemas externos.
- No se añade TUI avanzada; salida en texto plano / tabla simple.
- No se modifica ningún archivo del repo fuera de `.refi/modules/example-todo-cli/`.

## Success Criteria

- `node .refi/modules/example-todo-cli/bin/todo.js add "Comprar pan"` añade y persiste.
- `node .refi/modules/example-todo-cli/bin/todo.js list` muestra la lista tabulada.
- `node .refi/modules/example-todo-cli/bin/todo.js complete 1` marca el item 1 como hecho.
- `node .refi/modules/example-todo-cli/bin/todo.js readme` imprime un Markdown.
- `node .refi/modules/example-todo-cli/bin/todo.js --help` muestra ayuda general.
- Cada subcomando tiene su propio `--help`.

## Language

es-MX / en-US mixed; consistent with REASP project style.