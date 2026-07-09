# REASP — Contexto del Proyecto para IAs

> Lee este archivo al inicio de cualquier sesión de trabajo en este repositorio.
> Contiene el estado actual, la arquitectura, y el historial de lo que se ha implementado.

---

## ¿Qué es REASP?

**REASP** (Ryou Enterprise Adaptive SDD Protocol) es un framework de orquestación multi-agente para IAs.
Combina **RASS** (workflow de implementación adaptativo) con **REFI** (planeación empresarial con packets y domain-shards).

- Se instala globalmente con `npm install -g .` → comando `reasp` disponible en todo el sistema.
- Soporta **5 agentes**: OpenCode, Claude Code, Gemini CLI, Codex, Antigravity CLI.
- Los assets canónicos viven en `.opencode/`; cada adapter traduce al formato nativo del agente.
- OpenCode es la **implementación de referencia** (plugins, slash commands, agentes nativos).
- Los demás agentes reciben el workflow como system instructions inyectadas en su archivo global.

---

## Estructura del Repositorio

```
REASP/
├── .opencode/              # Assets canónicos (agents, rules, phases, plugins, skills)
│   ├── agents/             # 8 prompts de agentes Ryou
│   ├── sdd-profiles/       # 8 ModeProfiles (ryouset, fast, architecture, ui, debug, enterprise, legacy, minimal)
│   ├── phases/             # System prompts por fase (orchestrator, init, explore, propose, design, apply, verify, archive)
│   ├── rules/              # global-rules.md, meridianui.md
│   ├── skills/             # refi-enterprise-feature-implementation (skill principal)
│   ├── plugin.js           # Server plugin OpenCode — tools: sdd_mode_profile, rass_setup, reasp_setup
│   ├── tui.js              # TUI plugin OpenCode — slash commands: /sdd, /reasp-setup, /rass-setup
│   └── rass-core.js        # Núcleo RASS — ModeProfile manager, runtime generator, agent sync, provider catalog
├── .MeridianUI/            # Design system (placeholder — depositar contenido aquí)
│   └── .gitkeep            # Placeholder vacío. reasp install copia todo a ~/.MeridianUI/
├── installer/
│   ├── index.js            # Orquestador principal — CLI entry point, TUI menu
│   ├── lib/
│   │   ├── constants.js    # Rutas canónicas, AGENT_TARGETS, getHomeDir(), REPO_ROOT
│   │   ├── detect.js       # Detección de agentes instalados (win32/unix)
│   │   ├── compile.js      # Construye el bundle REASP desde .opencode/
│   │   ├── meridianui.js   # Copia .MeridianUI/ → ~/.MeridianUI/ (Windows y Linux)
│   │   ├── snapshot-manager.js  # Snapshots completos por agente
│   │   ├── config-manager.js    # Configuración global de REASP (~/.reasp/config.json)
│   │   ├── safety.js            # Detecta procesos activos antes de modificar configs
│   │   ├── tui.js               # Componentes TUI compartidos (@clack/prompts)
│   │   └── targets/
│   │       ├── opencode.js      # Adapter OpenCode (referencia) — plugin, agents, json config
│   │       ├── claude-code.js   # Adapter Claude Code — inyecta bloque en CLAUDE.md
│   │       ├── gemini.js        # Adapter Gemini CLI — inyecta bloque en instructions.md
│   │       ├── codex.js         # Adapter Codex — inyecta bloque en instructions.md
│   │       ├── antigravity.js   # Adapter Antigravity CLI (experimental)
│   │       └── _instructions.js # Helpers compartidos para adapters de instruction-file
│   └── commands/
│       ├── snapshot.js     # Router comandos: snapshot create/list/restore/delete/purge
│       └── config.js       # Router comandos: config get/set
├── scripts/
│   ├── reasp                          # Wrapper bash Unix (mode 100755)
│   ├── reasp.cmd                      # Wrapper Windows CMD
│   ├── test-provider-support.mjs      # Tests unitarios provider support
│   └── test-e2e-tool.mjs              # Tests E2E del tool sdd_mode_profile
├── .gitattributes          # LF para scripts Unix, CRLF para .cmd
├── package.json            # Manifiesto npm CLI — bin: reasp → installer/index.js
├── AI/                     # Este directorio — contexto para IAs
│   ├── CONTEXT.md          # Este archivo
│   └── Summarys/           # HTML summaries por sesión
└── .refi/                  # Packets REFI de planeación interna
    ├── modules/linux-compat/                  # Compatibilidad Linux + MeridianUI
    └── modules/sdd-profile-provider-support/  # Soporte de selección explícita de provider
```

---

## Comandos CLI

```bash
reasp                          # TUI interactivo (menú principal)
reasp install                  # Instalar en todos los agentes detectados
reasp install --agents opencode,claude-code
reasp install --dry-run        # Preview sin escribir archivos
reasp install --force          # Instalar aunque el agente no esté detectado
reasp uninstall --agents opencode
reasp detect                   # Listar agentes instalados con versión
reasp status                   # Estado de instalación REASP por agente
reasp local                    # Instalar solo en workspace actual
reasp snapshot create --agent claude-code --name clean
reasp snapshot list --agent claude-code
reasp snapshot restore --agent claude-code --name clean
reasp snapshot purge --agent claude-code --keep 5 --yes
```

---

## Directorios Globales (post-install)

| Recurso | Windows | Linux / macOS |
|---------|---------|---------------|
| OpenCode | `%USERPROFILE%\.config\opencode` | `~/.config/opencode` |
| Claude Code | `%USERPROFILE%\.claude` | `~/.claude` |
| Codex | `%USERPROFILE%\.codex` | `~/.codex` |
| Gemini CLI | `%USERPROFILE%\.gemini` | `~/.gemini` |
| Antigravity | `%USERPROFILE%\.antigravity` | `~/.antigravity` |
| MeridianUI | `%USERPROFILE%\.MeridianUI` | `~/.MeridianUI` |
| REASP state | `%USERPROFILE%\.reasp` | `~/.reasp` |

---

## ModeProfiles Disponibles

| ID | Fases | Uso recomendado |
|----|-------|-----------------|
| `ryouset` | orchestrator→init→explore→propose→design→apply→verify→archive | Workflow completo Ryou (default) |
| `fast` | orchestrator→apply→verify | CRUDs, APIs simples |
| `architecture` | orchestrator→init→explore→propose→design→apply→verify→archive | Sistemas complejos |
| `ui` | orchestrator→design→apply→verify | UI/UX con MeridianUI |
| `debug` | orchestrator→explore→apply→verify | Debugging, bugs |
| `enterprise` | todas las fases | Misión crítica |
| `legacy` | orchestrator→init→explore→propose→apply→verify | Refactors legacy |
| `minimal` | orchestrator→explore→apply | Iteraciones rápidas |

---

## Reglas de Diseño Importantes (NO violar)

1. **Windows y Linux son aditivos, nunca reemplazantes.** `winPaths[]` y `unixPaths[]` coexisten. El código Windows NO se toca al agregar soporte Linux.

2. **Una sola fuente de verdad.** Los assets canónicos están en `.opencode/`. Ningún adapter tiene su propia copia de prompts o configuraciones — todos leen de `.opencode/` via `compile.js`.

3. **MeridianUI no se elimina en `uninstall`.** `reasp uninstall` elimina la config del agente, pero `~/.MeridianUI/` permanece.

4. **Warning, no error, cuando `.MeridianUI/` está vacía.** Si solo tiene `.gitkeep`, el installer advierte y continúa sin fallar.

5. **`pathToFileURL()` para URLs de plugins.** No construir URLs de archivos con concatenación de strings. Usar `import { pathToFileURL } from 'node:url'`.

6. **Snapshots sobreviven a la desinstalación.** Los snapshots en `~/.reasp/snapshots/` no se eliminan con `reasp uninstall`.

7. **Formato canónico de modelo = `provider/model`.** No introducir objeto `{provider, model}` en disco. El provider siempre va prefijado en el string. Esto preserva el contrato con OpenCode y el runtime.

8. **Validación de provider es opcional.** Si el usuario pasa `provider` al tool, se valida que `primary.startsWith(provider + '/')`. Si omite `provider`, no se valida (backward compat). Custom models con warning, no error.

9. **Custom model es first-class.** Modelos no listados en `api.state.provider` se aceptan con warning — cubre providers beta, modelos nuevos, providers privados.

---

## Estado Actual del Repositorio

```
Branch activo:  Master
Remoto:         https://github.com/keorgtz/REASP.git
Push pendiente: git push origin Master  (6 commits adelante del remoto)
```

### Pending (manual, requiere el usuario)

- [ ] `git push origin Master` — publicar en GitHub
- [ ] `reasp install --agents opencode` real en Linux → verificar que el plugin carga
- [ ] Depositar contenido en `.MeridianUI/` → `reasp install` lo desplegará a `~/.MeridianUI/`
- [ ] Validar el flujo de selección de provider en `/sdd` con OpenCode real

---

## Cómo correr los tests

```bash
npm test
# node --check en todos los archivos JS del installer

node scripts/test-provider-support.mjs
# 65 tests unitarios: provider catalog, validación, ModeProfile CRUD

node scripts/test-e2e-tool.mjs
# 21 tests E2E: simulación completa de sdd_mode_profile con provider
```

---

## Historial de Implementaciones

### Sesión 3 — 2026-07-08 | SDD Profile Provider Support
**Ver:** `AI/Summarys/summary-2026-07-08.html`

**Problema resuelto:** Al configurar un SDD ModeProfile, el usuario podía elegir un modelo pero NO el provider. El modelo se almacenaba como string `provider/model` (ej. `opencode-go/glm-5.1`), pero el provider venía implícito en el ID — no había forma de validar, forzar, o mezclar providers.

**Solución:**
- **TUI** (`/sdd` → Edit/Create ModeProfile → Configure Models): flujo de 2 pasos (Proveedor → Modelo) con opción "Custom model" al final de cada lista. El provider actual se preselecciona automáticamente al editar.
- **Tool** `sdd_mode_profile`: nuevo argumento opcional `provider` que valida que `primary` pertenezca a ese provider. Si solo se pasa `provider`, resuelve al primer modelo del catálogo.
- **Helpers nuevos en `rass-core.js`**: `DEFAULT_PROVIDERS`, `discoverProviders(api)`, `validateModelInProvider()`, `deriveProviderFromModel()`, `getProviderLabel()`, `getModelsForProvider()`.
- **Output enriquecido**: `list`, `switch`, `edit`, `create`, `status` ahora muestran el provider derivado del default model.

**Archivos modificados:**
- `.opencode/rass-core.js` — +132 líneas (catálogo de providers + 5 funciones nuevas)
- `.opencode/tui.js` — +200 líneas, 4 diálogos refactorizados a flujo de 2 pasos
- `.opencode/plugin.js` — +85 líneas (schema con `provider` arg + validación en create/edit)

**Archivos nuevos:**
- `scripts/test-provider-support.mjs` — 65 tests unitarios
- `scripts/test-e2e-tool.mjs` — 21 tests E2E
- `AI/Summarys/summary-2026-07-08.html` — resumen visual
- `.refi/modules/sdd-profile-provider-support/` — packet REFI

**Verificado:**
- 65/65 tests unitarios ✅
- 21/21 tests E2E ✅
- `node --check` en installer/ y .opencode/ ✅
- Cross-platform simulado (Windows + Linux) ✅
- No regresión en ModeProfiles existentes (formato `provider/model` sin cambios) ✅
- Crash real del selector de proveedor corregido en repo y en `~/.config/opencode/tui.js`: los helpers del TUI usan `currentTuiApi` en vez de referenciar `api` fuera de scope ✅

---

### Sesión 2 — 2026-06-26 | Linux compatibility + MeridianUI global installer
**Ver:** `AI/Summarys/summary-2026-06-26.html`  
**Branch:** `linux-compat` (mergeado a `Master`)

**Problema resuelto:** REASP solo funcionaba en Windows. Se añadió soporte Linux/macOS de forma **aditiva** — el código Windows se preservó intacto.

**Bugs corregidos:**
- `installer/lib/targets/opencode.js` líneas 379-380 y 531-532:  
  `file:///` + `/home/...` = `file:////home/...` (4 barras, URL inválida en Linux).  
  Fix: `pathToFileURL(path.join(globalDir, 'plugin.js')).href` — genera el formato correcto en ambas plataformas.

**Features añadidas:**
- `installer/lib/meridianui.js` — copia `.MeridianUI/` del repo a `~/.MeridianUI/` al correr `reasp install`.
- `.MeridianUI/.gitkeep` — placeholder; depositar contenido UI aquí para se instale globalmente.
- `~/.volta/bin/opencode` añadido a `unixPaths[]` en `opencode.js`.
- `scripts/reasp` mode `100755` (execute bit en git index).
- `.gitattributes` — LF/CRLF según plataforma.
- `package.json scripts.prepare` — chmod fallback post `npm install -g`.

**Documentación actualizada:**
- `README.md` — sección Linux/Unix + sección MeridianUI
- `installer/AGENTS.md` — rutas Linux, Volta detection paths
- `installer/TROUBLESHOOTING.md` — 5 casos Linux nuevos

**Verificado en Fedora 44 Linux:**
- `reasp detect`: OpenCode v1.17.11, Claude Code v2.1.193, Gemini CLI ✅
- URL format `file:///home/...` (3 barras) ✅
- `scripts/reasp` mode 100755 en git tree ✅
- Warning MeridianUI vacía sin crash ✅

---

### Sesión 1 — 2026-06-16 | Multi-agente + CLI global + Backup Manager
**Ver:** `AI/Summarys/summary-2026-06-16.html`

- REASP evolucionó de instalador local de OpenCode a CLI global (`npm install -g .`).
- Soporte para 5 agentes: OpenCode, Claude Code, Gemini CLI, Codex, Antigravity CLI.
- Backup Manager completo: `reasp snapshot create/list/restore/delete/purge`.
- TUI unificado con menú principal interactivo.

**Archivos clave creados:**
- `installer/lib/snapshot-manager.js` — snapshots completos por agente
- `installer/lib/config-manager.js` — configuración global
- `installer/lib/safety.js` — detección de procesos activos
- `installer/commands/snapshot.js` y `config.js`
- `installer/lib/targets/` — 5 adapters (opencode, claude-code, gemini, codex, antigravity)
- `scripts/reasp` y `scripts/reasp.cmd` — wrappers multiplataforma

---

*Última actualización: 2026-07-08 — Sesión SDD Profile Provider Support*
