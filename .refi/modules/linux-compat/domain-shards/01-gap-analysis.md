# Domain Shard 01 · Gap Analysis & Audit

## Objetivo

Confirmar y completar el gap matrix del `master-blueprint.md` mediante lectura directa de los archivos fuente. Este shard es lectura pura — no se toca código.

## Archivos a Auditar

Leer en este orden de prioridad:

| Prioridad | Archivo | Razón |
|-----------|---------|-------|
| P0 | `installer/lib/targets/opencode.js` | Adapter principal, 700+ líneas, más riesgo |
| P0 | `installer/lib/detect.js` | Detección de todos los agentes |
| P1 | `installer/lib/constants.js` | Paths canónicos del sistema |
| P1 | `installer/lib/targets/_instructions.js` | Shared helpers, backslash replace sospechoso |
| P1 | `installer/lib/safety.js` | Process detection (ya verificado OK) |
| P2 | `installer/lib/targets/claude-code.js` | Adapter menor |
| P2 | `installer/lib/targets/gemini.js` | Adapter menor |
| P2 | `installer/lib/targets/codex.js` | Adapter menor |
| P2 | `installer/lib/targets/antigravity.js` | Adapter menor, experimental |
| P2 | `installer/index.js` | Entry point del CLI |
| P3 | `.opencode/rass-core.js` | Runtime (probablemente OK) |
| P3 | `scripts/sync-reasp.js` | Sync script (probablemente OK) |
| P3 | `scripts/rass-sync-validator.js` | Validator (probablemente OK) |

## Checklist de Audit por Archivo

Para cada archivo, verificar:

- [ ] ¿Usa `process.env.APPDATA`? → Si sí: ¿tiene fallback o es código Windows-only?
- [ ] ¿Usa `process.env.USERPROFILE`? → Debe tener `|| process.env.HOME || os.homedir()`.
- [ ] ¿Construye URLs con template literals `` `file:///` ``? → Candidato al bug G1.
- [ ] ¿Usa `.replace(/\\/g, '/')` en paths? → Puede indicar normalización manual de backslashes.
- [ ] ¿Busca ejecutables con extensión `.exe`? → Debe estar dentro de un guard `win32`.
- [ ] ¿Usa comandos shell específicos de Windows (`tasklist`, `cmd.exe`, `wmic`)?
- [ ] ¿Hardcodea rutas como `AppData`, `Roaming`, `Local`, `Program Files`?
- [ ] ¿Usa `process.platform === 'win32'`? → Revisar que el bloque `else` sea correcto para Linux.
- [ ] ¿Usa `path.win32` o `path.posix` explícitamente?

## Principio Aditivo — Verificar en Cada Archivo

Para cada Gap encontrado, confirmar que el fix sea **aditivo**:
- El código Windows existente **no se modifica**. Solo se envuelve en `if (process.platform === 'win32') { ... }` si no lo está ya.
- El código Linux va en el bloque `else { ... }`.
- Si hay un bug que afecta ambas plataformas (ej: `pathToFileURL`), la corrección mejora ambas pero no elimina la lógica Windows.

## MeridianUI — Audit Adicional

Además del checklist general, buscar en todos los archivos:

- [ ] ¿Dónde se referencia `~/.MeridianUI` o `\.MeridianUI`?
- [ ] ¿Se asume que `~/.MeridianUI` ya existe, o se crea/copia?
- [ ] ¿El glob pattern de MeridianUI en `opencode.js:54` funciona en Linux?
- [ ] ¿`_instructions.js:159` produce el path correcto en Linux?
- [ ] ¿Hay algún archivo que hardcodee el path de MeridianUI como Windows-style?
- [ ] ¿`.gitignore` o `.gitattributes` excluyen `.MeridianUI/`?

## Gap Matrix a Confirmar/Extender

Al completar la lectura, llenar la siguiente tabla con los hallazgos reales:

| Gap ID | Archivo | Líneas exactas | Código problemático | Severidad confirmada | Fix type |
|--------|---------|----------------|--------------------|-----------------------|----------|
| G1 | opencode.js | 529–530 | `file:///` + Linux path | CRÍTICO | `pathToFileURL` |
| G2 | opencode.js | 89–96 | winPaths sin linuxPaths | ALTO | additive linuxPaths[] |
| G3 | detect.js | 71–86 | OpenCode Linux paths incompletos | ALTO | additive paths |
| G4 | scripts/reasp | — | Bit +x git | ALTO | .gitattributes + prepare |
| G5 | opencode.js | 54 | meridianGlob backslash replace | MEDIO | verificar |
| G6 | _instructions.js | 159 | MeridianUI path backslash | BAJO | verificar |
| _nuevo_ | | | | | |

## Deliverables de este Shard

1. Gap matrix completado y confirmado (puede agregar nuevas filas).
2. Lista de archivos que **no requieren cambios** (confirmados OK en Linux).
3. Lista de archivos que **sí requieren cambios** con líneas exactas.
4. Nota sobre cualquier hallazgo inesperado que cambie la estrategia del master-blueprint.

## Verification Gate

- Gap matrix completado antes de iniciar cualquier cambio de código.
- Todos los archivos P0 y P1 leídos y verificados.
- El implementador y el maintainer están de acuerdo en el scope de cambios antes de proceder al Shard 02.
