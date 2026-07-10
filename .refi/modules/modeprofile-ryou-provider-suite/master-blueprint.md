# Master Blueprint · ModeProfile Ryou Provider Suite

## 1. Problem Statement

REASP/RASS mantiene un conjunto de **SDD ModeProfiles** bajo `.opencode/sdd-profiles/`. El perfil por defecto se llama `RyouSet` (archivo `ryouset.json`) y está configurado con modelos del proveedor `opencode-go`. El usuario quiere:

1. **Renombrar** `RyouSet` → `RyouGo` para que el nombre refleje explícitamente que está preparado para OpenCode Go.
2. **Crear dos perfiles adicionales** con la **misma estructura de fases, esfuerzo y potencias** pero usando proveedores distintos:
   - `RyouKimi` → proveedor **Kimi for coding** (`kimi-for-coding`).
   - `RyouMinimax` → proveedor **minimax-coding-plan**.
3. **Soportar perfiles separados por agente principal**: permitir que `ryou-orchestrator` y `ryou-efi-planner` usen **ModeProfiles distintos**, sin depender de un único perfil activo para ambos. El sistema mantiene un `default_modeprofile` como fallback para agentes no configurados explícitamente.

El cambio no es solo crear archivos JSON: el ID del perfil y su nombre aparecen hardcodeados en múltiples archivos de configuración, runtime, plugin, TUI, scripts, instalador y documentación. Además, la separación de perfiles por agente requiere extender el modelo de configuración de REASP. Si no se actualizan consistentemente, el sistema puede quedar con un perfil por defecto roto, runtime desfasado o agentes sincronizados con un modelo inexistente.

### 1.1 Baseline actual

- Archivo de perfil: `.opencode/sdd-profiles/ryouset.json` (ID `ryouset`, nombre `RyouSet`).
- Fases: `orchestrator → init → explore → propose → design → apply → verify → archive`.
- Estrategia: `per-phase`.
- Default primary: `opencode-go/kimi-k2.7-code` (effort `medium`).
- Modelos por fase (RyouSet/RyouGo): `opencode-go/kimi-k2.7-code`, `opencode-go/glm-5.1`, `opencode-go/deepseek-v4-pro`, `opencode-go/deepseek-v4-flash`.
- Defaults del sistema: `.opencode/sdd.config.json` y `.opencode/reasp.config.json` apuntan a `ryouset`.
- Runtime: `.opencode/runtime/current-modeprofile.json` tiene `modeprofile: ryouset`.
- Hardcoded `ryouset` en `.opencode/plugin.js`, `.opencode/tui.js`, `.opencode/rass-core.js`, `README.md`, `REASP-Guide.html`, `installer/`, `scripts/`.

## 2. Goal

Al finalizar el trabajo se debe cumplir:

1. El archivo `ryouset.json` se renombra a `ryougo.json` y su campo `name` pasa a `RyouGo`.
2. Los defaults de `sdd.config.json` y `reasp.config.json` apuntan a `ryougo`.
3. El runtime actual apunta a `ryougo` (si el usuario estaba usando `ryouset`).
4. Existen `.opencode/sdd-profiles/ryoukimi.json` y `.opencode/sdd-profiles/ryouminimax.json` con la misma estructura de fases y esfuerzos.
5. Todos los strings hardcodeados `ryouset` / `RyouSet` en los archivos operativos se migran a `ryougo` / `RyouGo`.
6. `reasp.config.json` soporta una sección `agent_modeprofiles` que permite asignar perfiles distintos a `ryou-orchestrator` y `ryou-efi-planner`.
7. Los perfiles nuevos son funcionales: se pueden listar, activar y sincronizar agentes sin errores.

## 3. Core Design Principles

- **No inventar modelos ni proveedores.** Los IDs exactos de los modelos de Kimi for coding y minimax.io token plan son **parcialmente confirmados**. Se usarán los valores confirmados (`kimi-for-coding` y `kimi-for-coding/k2p7`; `minimax-coding-plan` como proveedor) y se marcarán como `UNKNOWN` solo los modelos de Minimax que faltan. En el plan se usan placeholders marcados como `UNKNOWN — investigate before implementing`.
- **Backward compatibility.** Los ModeProfiles existentes (`fast`, `architecture`, `ui`, `debug`, `enterprise`, `legacy`, `minimal`) no se tocan. La nueva funcionalidad de `agent_modeprofiles` es opt-in: si no está presente, todo funciona como antes usando `default_modeprofile`.
- **Formato en disco sin cambios.** Se mantiene el formato `provider/model` en cada campo `primary` y `fallbacks`.
- **Single source of truth.** El archivo `*.json` en `sdd-profiles/` es la fuente; el runtime y `opencode.json` se regeneran desde él.
- **Perfil por agente = opt-in.** `reasp.config.json` puede declarar `agent_modeprofiles`; los agentes no listados usan `default_modeprofile`.
- **No modificar documentación histórica de REFI.** Los packets antiguos bajo `.refi/modules/` se dejan intactos; solo se actualizan los archivos operativos y la documentación de usuario (`README.md`, `REASP-Guide.html`, `AI/CONTEXT.md`).

## 4. Domain Decomposition

| # | Domain | Description | Key Files |
|---|--------|-------------|-----------|
| D1 | **Rename & Default Migration** | Renombrar `ryouset.json` → `ryougo.json`, actualizar `name`, y cambiar defaults del sistema. | `sdd-profiles/ryouset.json`, `sdd.config.json`, `reasp.config.json`, `runtime/current-modeprofile.json` |
| D2 | **Hardcoded Reference Update** | Actualizar strings `ryouset`/`RyouSet` en plugin, TUI, rass-core, scripts, instalador y docs. | `plugin.js`, `tui.js`, `rass-core.js`, `installer/`, `scripts/`, `README.md`, `REASP-Guide.html`, `AI/CONTEXT.md` |
| D3 | **Create RyouKimi Profile** | Crear `ryoukimi.json` con misma estructura, usando modelos del proveedor Kimi for coding. | `sdd-profiles/ryoukimi.json` |
| D4 | **Create RyouMinimax Profile** | Crear `ryouminimax.json` con misma estructura, usando modelos del proveedor minimax-coding-plan. | `sdd-profiles/ryouminimax.json` |
| D5 | **Per-Profile Runtime Sync** | Regenerar `runtime.generated.json`, sincronizar agentes, validar perfiles y ejecutar tests. | `runtime/runtime.generated.json`, `opencode.json` (global), scripts de test |
| D6 | **Agent-Specific ModeProfiles** | Extender `reasp.config.json` y `rass-core.js` para permitir que `ryou-orchestrator` y `ryou-efi-planner` usen perfiles distintos. | `reasp.config.json`, `rass-core.js`, `plugin.js`, `tui.js` |

## 5. Open Questions / Unknowns

| # | Question | Impact | Resolution |
|---|----------|--------|------------|
| Q1 | ¿Cuáles son los **modelos concretos** de Kimi for coding para cada fase? | Determina los `primary`/`fallbacks` de `ryoukimi.json`. | **Resuelto:** `kimi-for-coding/k2p7` (principal) y `kimi-for-coding/k2p6` (fallback/anterior). |
| Q2 | ¿Cuáles son los **modelos concretos** del proveedor `minimax-coding-plan` para cada fase? | Bloquea la escritura de `ryouminimax.json`. | **Resuelto:** `minimax-coding-plan/MiniMax-M3` (principal) y `minimax-coding-plan/MiniMax-M2.7` (fallback/anterior). |
| Q3 | ¿El usuario quiere que `RyouGo` siga siendo el default del sistema, o prefiere que el default sea uno de los nuevos? | Afecta `sdd.config.json` y `reasp.config.json`. | **Confirmado:** `RyouGo` será el default del setup. |
| Q4 | ¿Los subagentes (`planner`, `builder`, `architect`, `reviewer`, `debugger`, `documentation`) deben heredar el perfil del agente principal que los invoca, o usar siempre el `default_modeprofile`? | Afecta la lógica de `resolveAgentModel` en `rass-core.js`. | **Confirmado:** usar `default_modeprofile` a menos que se configure un perfil explícito para ellos en `agent_modeprofiles`. |

## 6. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Se omite alguna referencia hardcodeada a `ryouset` y el sistema queda inconsistente. | Media | Alta | Usar `grep` global para identificar **todas** las ocurrencias; separar en "operativas" (sí se cambian) y "históricas REFI" (no se cambian). |
| El proveedor Kimi/Minimax no está en `DEFAULT_PROVIDERS` ni en `api.state.provider`, causando validaciones o listados fallidos. | Media | Media | No modificar el catálogo fallback a menos que el usuario lo pida; si el proveedor existe en su OpenCode, el perfil funciona en runtime. Si no, se mostrará como custom. |
| Se rompe el runtime actual si el perfil activo queda apuntando a `ryouset` después de renombrar. | Baja | Alta | Actualizar `current-modeprofile.json` y regenerar `runtime.generated.json` inmediatamente después del renombrado. |
| Se usan model IDs inexistentes en los nuevos perfiles. | Baja | Alta | Todos los modelos fueron confirmados por el usuario (`k2p7`, `k2p6`, `MiniMax-M3`, `MiniMax-M2.7`). No se usan placeholders en la implementación. |
| Se afectan los perfiles base existentes (`fast`, `architecture`, etc.). | Baja | Baja | Trabajar solo sobre los archivos de perfil indicados; no tocar los demás `.json` de `sdd-profiles/`. |
| La separación de perfiles por agente introduce inconsistencias si un agente principal apunta a un perfil eliminado. | Baja | Alta | Validar que todo perfil en `agent_modeprofiles` exista; si falta, usar `default_modeprofile` y loggear warning. |

## 7. Success Criteria (Packet Level)

- [ ] El archivo `.opencode/sdd-profiles/ryougo.json` existe y contiene `name: "RyouGo"`.
- [ ] El archivo `.opencode/sdd-profiles/ryouset.json` **no** existe.
- [ ] `.opencode/sdd.config.json` y `.opencode/reasp.config.json` tienen `default_modeprofile: "ryougo"`.
- [ ] `.opencode/reasp.config.json` contiene una sección `agent_modeprofiles` que permite asignar perfiles distintos a `ryou-orchestrator` y `ryou-efi-planner`.
- [ ] `.opencode/runtime/current-modeprofile.json` tiene `modeprofile: "ryougo"` (si el usuario estaba activo en `ryouset`).
- [ ] Existen `.opencode/sdd-profiles/ryoukimi.json` y `.opencode/sdd-profiles/ryouminimax.json` con fases y esfuerzos idénticos a `RyouGo`.
- [ ] Los modelos de `RyouKimi` y `RyouMinimax` pertenecen a sus respectivos proveedores (según el prefijo `provider/`).
- [ ] No quedan strings operativos `ryouset`/`RyouSet` en `.opencode/`, `installer/`, `scripts/` ni documentación de usuario.
- [ ] `sdd_mode_profile(action="list")` muestra `ryougo`, `ryoukimi` y `ryouminimax` sin errores.
- [ ] `sdd_mode_profile(action="switch", name="ryougo")` sincroniza agentes correctamente.
- [ ] `sdd_mode_profile(action="switch", name="ryoukimi")` y `ryouminimax` funcionan sin error de validación de proveedor.
- [ ] Se puede configurar `ryou-orchestrator` y `ryou-efi-planner` con perfiles distintos y `refreshAllAgentModels()` sincroniza ambos correctamente.
- [ ] Se genera un resumen diario en `AI/Summarys/` al finalizar la implementación.
