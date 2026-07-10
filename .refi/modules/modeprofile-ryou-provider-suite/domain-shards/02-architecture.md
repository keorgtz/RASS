# Domain Shard 02 · Architecture

## 1. Architecture overview

REASP/RASS almacena los **SDD ModeProfiles** como archivos JSON planos en `.opencode/sdd-profiles/`. Cada archivo es autónomo y contiene:

- `name`: nombre legible del perfil.
- `description`: descripción corta.
- `phases`: array ordenado de fases a ejecutar.
- `model_strategy`: `"single"` o `"per-phase"`.
- `default`: configuración por defecto (`primary`, `effort`, `fallbacks`).
- Una entrada por fase con `primary`, `effort` y `fallbacks` (cuando `model_strategy` es `per-phase`).

El nombre del archivo (`<id>.json`) es el identificador canónico del perfil. El sistema lo resuelve mediante `getModeProfilePath(name)` en `rass-core.js`.

### 1.1 Runtime flow (sin perfiles por agente)

```text
sdd-profiles/<id>.json
        │
        ▼
   getModeProfile(id)
        │
        ▼
   resolveRuntime(mp) ──▶ runtime/runtime.generated.json
        │
        ▼
   resolveAgentModels(mp) ──▶ ~/.config/opencode/opencode.json (agent.model / model / small_model)
        │
        ▼
   current-modeprofile.json (estado activo)
```

### 1.2 Runtime flow con perfiles por agente

```text
reasp.config.json
        │
        ├── default_modeprofile ──▶ fallback para agentes no listados
        └── agent_modeprofiles
                │
                ├── ryou-orchestrator → ryougo
                │                           │
                │                           ▼
                │                   resolveAgentModel(ryou-orchestrator, ryougo)
                │                           │
                │                           ▼
                │                   ~/.config/opencode/opencode.json
                │                           (agent.ryou-orchestrator.model)
                │
                └── ryou-efi-planner → ryoukimi
                                            │
                                            ▼
                                    resolveAgentModel(ryou-efi-planner, ryoukimi)
                                            │
                                            ▼
                                    ~/.config/opencode/opencode.json
                                            (agent.ryou-efi-planner.model)
```

La función `refreshAllAgentModels()` itera sobre todos los agentes configurados, consulta su perfil asignado en `agent_modeprofiles` (o el default), y escribe el modelo correspondiente en `~/.config/opencode/opencode.json`.

### 1.2 Referencias críticas

- `sdd.config.json` y `reasp.config.json` contienen el default usado cuando no hay perfil activo o cuando un agente no tiene perfil asignado.
- `reasp.config.json` añadirá `agent_modeprofiles` para asignar perfiles específicos a `ryou-orchestrator` y `ryou-efi-planner`.
- `rass-core.js` tiene defaults fallback `ryouset` en `refreshAllFromModeProfile`, `isRuntimeInSync`, `generateRuntime`, `getReaspConfig`, `getConfig`.
- `plugin.js` expone el tool `sdd_mode_profile` y `rass_setup`; menciona `ryouset` en la descripción de `name` y en mensajes de salida. Se extenderá para soportar `agent_modeprofiles`.
- `tui.js` renderiza el selector de perfil y usa `RyouSet` como label. Se extenderá para permitir asignar perfil por agente principal.
- `installer/` copia la configuración inicial y selecciona `ryouset` como recomendado.
- `scripts/` usan `ryouset` como fallback en tests y sincronización.

## 2. Estructura final esperada

```text
.opencode/
├── sdd-profiles/
│   ├── ryougo.json              ← renombrado desde ryouset.json
│   ├── ryoukimi.json            ← NUEVO
│   ├── ryouminimax.json         ← NUEVO
│   ├── fast.json
│   ├── architecture.json
│   ├── ui.json
│   ├── debug.json
│   ├── enterprise.json
│   ├── legacy.json
│   └── minimal.json
├── sdd.config.json              ← default_modeprofile: "ryougo"
├── reasp.config.json            ← default_modeprofile: "ryougo", agent_modeprofiles: {...}
├── runtime/
│   ├── current-modeprofile.json ← modeprofile: "ryougo"
│   └── runtime.generated.json   ← regenerado desde ryougo
├── plugin.js                    ← sin "ryouset"; soporta agent_modeprofiles
├── tui.js                       ← sin "RyouSet"; soporta asignación por agente
├── rass-core.js                 ← default fallback "ryougo"; resolveAgentModel, refreshAllAgentModels
└── agents/
    └── ryou-orchestrator.md     ← sin "RyouSet"
```

## 3. Reglas de modelado

### 3.1 Formato `provider/model`

Cada `primary` y cada entrada en `fallbacks` debe ser un string `provider/model`. Para `RyouGo` se mantiene `opencode-go/...`. Para `RyouKimi` y `RyouMinimax` se usará el ID de proveedor confirmado por el usuario.

### 3.2 Estrategia por fase

Los tres perfiles usan `model_strategy: "per-phase"`. La siguiente tabla muestra el esfuerzo y el rol esperado para cada fase:

| Fase | Effort | Rol |
|------|--------|-----|
| `orchestrator` | `medium` | Coordinación general |
| `init` | `low` | Inicialización ligera |
| `explore` | `medium` | Exploración de código |
| `propose` | `high` | Planificación profunda |
| `design` | `medium` | Diseño técnico |
| `apply` | `medium` | Implementación |
| `verify` | `high` | Revisión y verificación |
| `archive` | `low` | Documentación y cierre |

### 3.3 Modelos por proveedor

#### RyouGo (OpenCode Go) — baseline confirmada

| Fase | Primary | Fallbacks |
|------|---------|-----------|
| `default` | `opencode-go/kimi-k2.7-code` | `["opencode-go/glm-5.1"]` |
| `orchestrator` | `opencode-go/kimi-k2.7-code` | `["opencode-go/glm-5.1"]` |
| `init` | `opencode-go/kimi-k2.7-code` | `["opencode-go/deepseek-v4-flash"]` |
| `explore` | `opencode-go/kimi-k2.7-code` | `["opencode-go/glm-5.1"]` |
| `propose` | `opencode-go/glm-5.1` | `["opencode-go/kimi-k2.7-code"]` |
| `design` | `opencode-go/kimi-k2.7-code` | `["opencode-go/glm-5.1"]` |
| `apply` | `opencode-go/kimi-k2.7-code` | `["opencode-go/glm-5.1"]` |
| `verify` | `opencode-go/deepseek-v4-pro` | `["opencode-go/glm-5.1"]` |
| `archive` | `opencode-go/deepseek-v4-flash` | `[]` |

#### RyouKimi (Kimi for coding) — proveedor confirmado: `kimi-for-coding`

Distribución por nivel de esfuerzo:
- **Crítico (`high`)**: `k2p7` (top).
- **Mediano (`medium`)**: `k2p6` (balanceado).
- **Bajo (`low`)**: `k2p5`.

| Fase | Primary | Fallbacks |
|------|---------|-----------|
| `default` | `kimi-for-coding/k2p6` | `["kimi-for-coding/k2p5"]` |
| `orchestrator` | `kimi-for-coding/k2p6` | `["kimi-for-coding/k2p5"]` |
| `init` | `kimi-for-coding/k2p5` | `[]` |
| `explore` | `kimi-for-coding/k2p6` | `["kimi-for-coding/k2p5"]` |
| `propose` | `kimi-for-coding/k2p7` | `["kimi-for-coding/k2p6"]` |
| `design` | `kimi-for-coding/k2p6` | `["kimi-for-coding/k2p5"]` |
| `apply` | `kimi-for-coding/k2p6` | `["kimi-for-coding/k2p5"]` |
| `verify` | `kimi-for-coding/k2p7` | `["kimi-for-coding/k2p6"]` |
| `archive` | `kimi-for-coding/k2p5` | `[]` |

> **Razonamiento:** `k2p7` (top) se reserva para `propose` y `verify` (effort `high`). `k2p6` (balanceado) cubre la mayoría del trabajo (`orchestrator`, `explore`, `design`, `apply` con effort `medium`). `k2p5` (bajo) solo en `init` y `archive` (effort `low`).

#### RyouMinimax (minimax-coding-plan) — proveedor confirmado: `minimax-coding-plan`

Distribución por nivel de esfuerzo:
- **Crítico (`high`)**: `M3` (top).
- **Mediano (`medium`)**: `M2.7`.
- **Bajo (`low`)**: `M2.7` (no hay modelo más bajo en el catálogo actual).

| Fase | Primary | Fallbacks |
|------|---------|-----------|
| `default` | `minimax-coding-plan/MiniMax-M2.7` | `[]` |
| `orchestrator` | `minimax-coding-plan/MiniMax-M2.7` | `[]` |
| `init` | `minimax-coding-plan/MiniMax-M2.7` | `[]` |
| `explore` | `minimax-coding-plan/MiniMax-M2.7` | `[]` |
| `propose` | `minimax-coding-plan/MiniMax-M3` | `["minimax-coding-plan/MiniMax-M2.7"]` |
| `design` | `minimax-coding-plan/MiniMax-M2.7` | `[]` |
| `apply` | `minimax-coding-plan/MiniMax-M2.7` | `[]` |
| `verify` | `minimax-coding-plan/MiniMax-M3` | `["minimax-coding-plan/MiniMax-M2.7"]` |
| `archive` | `minimax-coding-plan/MiniMax-M2.7` | `[]` |

> **Razonamiento:** `M3` (top) se reserva para `propose` y `verify` (effort `high`). `M2.7` cubre el resto (medium y low). Si en el futuro aparece un modelo más económico del proveedor, se asignará a `init` y `archive`.

## 4. Cross-cutting concerns

### 4.1 Backward compatibility

El formato JSON del perfil no cambia. La extensión `agent_modeprofiles` en `reasp.config.json` es opt-in: si no existe, el sistema se comporta exactamente como antes, usando `default_modeprofile` para todos los agentes. Los perfiles base existentes siguen funcionando sin modificaciones.

### 4.2 Case sensitivity

Los IDs de proveedor y modelo son case-sensitive en OpenCode. El archivo de perfil y el campo `name` pueden tener mayúsculas (`RyouGo`), pero el ID del archivo debe ser lowercase kebab-case (`ryougo`).

### 4.3 Agent sync

`refreshAllAgentModels()` (nueva función) escribe en `~/.config/opencode/opencode.json`. Itera sobre cada agente configurado y, para cada uno, resuelve el modelo desde su perfil asignado (`agent_modeprofiles`) o desde `default_modeprofile` si no tiene asignación. La función `refreshAllFromModeProfile` se conserva como alias para compatibilidad, pero internamente delegará en `refreshAllAgentModels()`.

Si el usuario usa otro path para `opencode.json`, el installer/scripts deben respetarlo. El plan debe incluir una validación manual de que los modelos de los agentes se actualizan correctamente.

### 4.4 Agent-specific profiles

La configuración de `agent_modeprofiles` en `reasp.config.json` permite asignar un perfil distinto a cada agente principal:

```json
{
  "default_modeprofile": "ryougo",
  "agent_modeprofiles": {
    "ryou-orchestrator": "ryougo",
    "ryou-efi-planner": "ryoukimi"
  }
}
```

- Si un agente está en `agent_modeprofiles`, se usa ese perfil para resolver su modelo.
- Si un agente **no** está en `agent_modeprofiles`, se usa `default_modeprofile`.
- Los subagentes (`planner`, `builder`, `architect`, `reviewer`, `debugger`, `documentation`) también pueden aparecer en `agent_modeprofiles`; si no aparecen, usan `default_modeprofile`.
- `resolveAgentModel(agentName, modeProfileName)` resuelve el modelo de un agente individual desde el perfil indicado.
- `refreshAllAgentModels()` lee `reasp.config.json`, itera sobre `RYOU_AGENTS` y actualiza cada `agent.<name>.model` en `~/.config/opencode/opencode.json`.

### 4.5 Perfil activo vs. perfiles por agente

- `current-modeprofile.json` sigue representando el "perfil activo del sistema" y se usa para generar `runtime.generated.json`.
- `agent_modeprofiles` es una capa adicional que decide qué modelo se escribe en cada agente de `opencode.json`.
- No se elimina el concepto de perfil activo; se complementa con la asignación por agente.

- No hardcodear `ryouset`/`RyouSet` en nuevos lugares.
- No dejar el archivo `ryouset.json` residual.
- No mezclar proveedores dentro de un mismo perfil (por ejemplo, que `RyouKimi` tenga un fallback de `opencode-go`).
- No modificar el formato de disco a un objeto más complejo; mantener `provider/model` como string.
- No actualizar documentación histórica REFI.
- No romper `refreshAllFromModeProfile`; mantenerlo como alias/compatibilidad.
- No asumir que todos los agentes tienen un perfil asignado; siempre usar `default_modeprofile` como fallback.
