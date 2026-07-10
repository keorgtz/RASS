# Domain Shard 03 · Implementation

## 1. Pre-requisito bloqueante

**Antes de implementar**, todos los modelos han sido confirmados por el usuario. Ver `master-blueprint.md` §5 y `02-architecture.md` §3.3.

- **RyouKimi:** `kimi-for-coding/k2p7` (primary), `kimi-for-coding/k2p6` (fallback/archive).
- **RyouMinimax:** `minimax-coding-plan/MiniMax-M3` (primary), `minimax-coding-plan/MiniMax-M2.7` (fallback/archive).

## 2. Implementación paso a paso

### Paso 1 — Renombrar RyouSet → RyouGo

1. **Mover/renombrar archivo**:
   ```bash
   mv .opencode/sdd-profiles/ryouset.json .opencode/sdd-profiles/ryougo.json
   ```
   En Windows (PowerShell):
   ```powershell
   Move-Item -Path .opencode\sdd-profiles\ryouset.json -Destination .opencode\sdd-profiles\ryougo.json
   ```

2. **Actualizar el campo `name`** dentro de `ryougo.json`:
   ```json
   "name": "RyouGo",
   ```

3. **Actualizar defaults del sistema**:
   - `.opencode/sdd.config.json`: `"default_modeprofile": "ryougo"`
   - `.opencode/reasp.config.json`: `"default_modeprofile": "ryougo"`
   - `.opencode/reasp.config.json`: agregar sección `agent_modeprofiles`:
     ```json
     "agent_modeprofiles": {
       "ryou-orchestrator": "ryougo",
       "ryou-efi-planner": "ryougo"
     }
     ```

4. **Actualizar runtime activo**:
   - `.opencode/runtime/current-modeprofile.json`: `"modeprofile": "ryougo"`
   - Regenerar `.opencode/runtime/runtime.generated.json` mediante `refreshAllFromModeProfile('ryougo')`.

### Paso 2 — Actualizar referencias hardcodeadas

Reemplazar todas las ocurrencias operativas de `ryouset`/`RyouSet` por `ryougo`/`RyouGo` en los archivos identificados en `01-planning.md` §2.3.

Ejemplo de cambios mínimos:

- `.opencode/plugin.js`:
  - Línea 70: `Available base modeprofiles: ryouset, ...` → `Available base modeprofiles: ryougo, ...`
  - Línea 369: `Configure SDD ModeProfile "ryouset" as default` → `"ryougo"`
  - Línea 376: `Run \`sdd_mode_profile(action="switch", name="ryouset")\`` → `"ryougo"`

- `.opencode/tui.js`:
  - Línea 1243: `title: 'Switch to RyouSet'` → `'Switch to RyouGo'`
  - Línea 1244: `value: 'ryouset'` → `'ryougo'`
  - Línea 1245: `description: 'Switch to RyouSet ModeProfile...'` → `RyouGo...`
  - Línea 1352: `case 'ryouset':` → `case 'ryougo':`
  - Línea 1354: `switchModeProfile('ryouset')` → `switchModeProfile('ryougo')`
  - Líneas 1358-1359: `RyouSet` → `RyouGo`

- `.opencode/rass-core.js`:
  - Línea 213: `modeProfileName = getCurrentModeProfile() || 'ryouset'` → `'ryougo'`
  - Línea 287: `modeProfileName = getCurrentModeProfile() || 'ryouset'` → `'ryougo'`
  - Línea 401: `const currentName = getCurrentModeProfile() || 'ryouset'` → `'ryougo'`
  - Línea 473: `default_modeprofile: 'ryouset'` → `'ryougo'`
  - Línea 594: `default_modeprofile: 'ryouset'` → `'ryougo'`

- `.opencode/agents/ryou-orchestrator.md`:
  - Reemplazar `RyouSet` → `RyouGo` y `ryouset` → `ryougo` donde aparezcan.

- `installer/lib/constants.js`:
  - Línea 27: `export const DEFAULT_MODEPROFILE = 'ryouset';` → `'ryougo';`

- `installer/lib/tui.js`:
  - Línea 323: `label: THEME.successBright(ICONS.star + ' RyouSet (Recommended)')` → `'RyouGo'`
  - Actualizar hint si contiene `RyouSet`.

- `installer/lib/targets/opencode.js`:
  - Línea 416: `const modeProfileName = bundle.modeProfile || ctx.modeProfile || 'ryouset';` → `'ryougo'`

- `scripts/rass-sync-validator.js`:
  - Línea 174: `readJson(...current-modeprofile.json')?.modeprofile || 'ryouset';` → `'ryougo'`

- `scripts/test-e2e-tool.mjs`:
  - Línea 126: `switchModeProfile('ryouset');` → `'ryougo'`

- `scripts/sync-reasp.js`:
  - Línea 79: `mod.getCurrentModeProfile?.() || 'ryouset';` → `'ryougo'`

- `README.md` y `REASP-Guide.html`:
  - Reemplazar todas las ocurrencias de `RyouSet` → `RyouGo` y `ryouset` → `ryougo`.

- `AI/CONTEXT.md`:
  - Línea 27: `sdd-profiles/ # 8 ModeProfiles (ryouset, ...)` → `(ryougo, ...)`
  - Línea 112: tabla `ryouset` → `ryougo`.

### Paso 3 — Crear RyouKimi

Crear `.opencode/sdd-profiles/ryoukimi.json` con la misma estructura que `ryougo.json`, cambiando:

```json
{
  "name": "RyouKimi",
  "description": "Full pipeline using Kimi for coding models (k2p7 primary, k2p6 fallback/archive).",
  "phases": ["orchestrator", "init", "explore", "propose", "design", "apply", "verify", "archive"],
  "model_strategy": "per-phase",
  "default": {
    "primary": "kimi-for-coding/k2p7",
    "effort": "medium",
    "fallbacks": ["kimi-for-coding/k2p6"]
  },
  "orchestrator": { "primary": "kimi-for-coding/k2p7", "effort": "medium", "fallbacks": ["kimi-for-coding/k2p6"] },
  "init": { "primary": "kimi-for-coding/k2p7", "effort": "low", "fallbacks": ["kimi-for-coding/k2p6"] },
  "explore": { "primary": "kimi-for-coding/k2p7", "effort": "medium", "fallbacks": ["kimi-for-coding/k2p6"] },
  "propose": { "primary": "kimi-for-coding/k2p7", "effort": "high", "fallbacks": ["kimi-for-coding/k2p6"] },
  "design": { "primary": "kimi-for-coding/k2p7", "effort": "medium", "fallbacks": ["kimi-for-coding/k2p6"] },
  "apply": { "primary": "kimi-for-coding/k2p7", "effort": "medium", "fallbacks": ["kimi-for-coding/k2p6"] },
  "verify": { "primary": "kimi-for-coding/k2p7", "effort": "high", "fallbacks": ["kimi-for-coding/k2p6"] },
  "archive": { "primary": "kimi-for-coding/k2p6", "effort": "low", "fallbacks": [] }
}
```

### Paso 4 — Crear RyouMinimax

Crear `.opencode/sdd-profiles/ryouminimax.json` con la misma estructura, cambiando `name`, `description` y los modelos al proveedor `minimax-coding-plan`:

```json
{
  "name": "RyouMinimax",
  "description": "Full pipeline using minimax-coding-plan models (MiniMax-M3 primary, MiniMax-M2.7 fallback/archive).",
  "phases": ["orchestrator", "init", "explore", "propose", "design", "apply", "verify", "archive"],
  "model_strategy": "per-phase",
  "default": {
    "primary": "minimax-coding-plan/MiniMax-M3",
    "effort": "medium",
    "fallbacks": ["minimax-coding-plan/MiniMax-M2.7"]
  },
  "orchestrator": { "primary": "minimax-coding-plan/MiniMax-M3", "effort": "medium", "fallbacks": ["minimax-coding-plan/MiniMax-M2.7"] },
  "init": { "primary": "minimax-coding-plan/MiniMax-M3", "effort": "low", "fallbacks": ["minimax-coding-plan/MiniMax-M2.7"] },
  "explore": { "primary": "minimax-coding-plan/MiniMax-M3", "effort": "medium", "fallbacks": ["minimax-coding-plan/MiniMax-M2.7"] },
  "propose": { "primary": "minimax-coding-plan/MiniMax-M3", "effort": "high", "fallbacks": ["minimax-coding-plan/MiniMax-M2.7"] },
  "design": { "primary": "minimax-coding-plan/MiniMax-M3", "effort": "medium", "fallbacks": ["minimax-coding-plan/MiniMax-M2.7"] },
  "apply": { "primary": "minimax-coding-plan/MiniMax-M3", "effort": "medium", "fallbacks": ["minimax-coding-plan/MiniMax-M2.7"] },
  "verify": { "primary": "minimax-coding-plan/MiniMax-M3", "effort": "high", "fallbacks": ["minimax-coding-plan/MiniMax-M2.7"] },
  "archive": { "primary": "minimax-coding-plan/MiniMax-M2.7", "effort": "low", "fallbacks": [] }
}
```

### Paso 5 — Extender soporte de perfiles por agente

1. **Agregar `agent_modeprofiles` a `.opencode/reasp.config.json`**:
   ```json
   {
     "default_modeprofile": "ryougo",
     "agent_modeprofiles": {
       "ryou-orchestrator": "ryougo",
       "ryou-efi-planner": "ryougo"
     }
   }
   ```

2. **Implementar funciones en `.opencode/rass-core.js`**:
   - `getAgentModeProfile(agentName)`: devuelve el perfil asignado al agente, o `default_modeprofile` si no tiene.
   - `resolveAgentModel(agentName, modeProfileName)`: resuelve el modelo para un agente específico desde su perfil asignado.
   - `refreshAllAgentModels()`: itera sobre `RYOU_AGENTS`, obtiene el perfil asignado a cada uno, resuelve su modelo y escribe en `~/.config/opencode/opencode.json`.
   - Mantener `refreshAllFromModeProfile(modeProfileName)` como compatibilidad, delegando en `refreshAllAgentModels()` cuando aplique.

3. **Actualizar `.opencode/plugin.js`**:
   - Exponer la capacidad de ver `agent_modeprofiles` en `rass_setup(action="status")`.
   - Opcionalmente, agregar un argumento `agent` a `rass_setup` para forzar sincronización de un agente específico.

4. **Actualizar `.opencode/tui.js`**:
   - Agregar opción en el menú de SDD para "Assign ModeProfile to agent" o similar.
   - Permitir seleccionar un agente principal (`ryou-orchestrator`, `ryou-efi-planner`) y asignarle un perfil distinto.

### Paso 6 — Sincronizar runtime y agentes

Después de todos los cambios, ejecutar:

```bash
node scripts/sync-reasp.js
# o
node scripts/test-e2e-tool.mjs
# o invocar el tool:
# sdd_mode_profile(action="switch", name="ryougo")
```

Esto regenera:
- `.opencode/runtime/runtime.generated.json`
- `~/.config/opencode/opencode.json` (agentes y root model)

## 3. Verificación de implementación (smoke tests)

Después de los cambios, ejecutar:

```bash
node scripts/test-e2e-tool.mjs
```

Y verificar manualmente:

1. `sdd_mode_profile(action="list")` muestra `ryougo`, `ryoukimi`, `ryouminimax`.
2. `sdd_mode_profile(action="switch", name="ryougo")` no falla.
3. `sdd_mode_profile(action="switch", name="ryoukimi")` no falla.
4. `sdd_mode_profile(action="switch", name="ryouminimax")` no falla.
5. `rass_setup(action="validate")` sincroniza todos los agentes según `agent_modeprofiles`.
6. Al cambiar `agent_modeprofiles` en `reasp.config.json` (ej. `ryou-efi-planner` → `ryoukimi`) y ejecutar `rass_setup(action="validate")`, el modelo de `ryou-efi-planner` en `~/.config/opencode/opencode.json` se actualiza a `kimi-for-coding/k2p7`.
7. El runtime actual (`runtime.generated.json`) está en sync con el perfil activo.
8. No queda archivo `ryouset.json` en `sdd-profiles/`.
9. No hay strings `ryouset`/`RyouSet` en `.opencode/plugin.js`, `.opencode/tui.js`, `.opencode/rass-core.js`, `installer/lib/constants.js`, `installer/lib/tui.js`, `installer/lib/targets/opencode.js`, `scripts/`, `README.md`, `REASP-Guide.html`, `AI/CONTEXT.md`.

## 4. Documentación a actualizar

1. `AI/CONTEXT.md` — actualizar lista de perfiles y tabla.
2. `README.md` — actualizar referencias a `RyouSet` → `RyouGo`, agregar `RyouKimi` y `RyouMinimax` si se desea documentarlos.
3. `REASP-Guide.html` — actualizar referencias.
4. `AI/Summarys/summary-YYYY-MM-DD.html` — crear/actualizar resumen del día con cambios, archivos afectados y decisiones.

## 5. Rollback plan

Si algo falla, el rollback consiste en:

1. Revertir los cambios en los archivos de configuración (`sdd.config.json`, `reasp.config.json` y eliminar `agent_modeprofiles`).
2. Renombrar `ryougo.json` de vuelta a `ryouset.json` y cambiar `name` a `"RyouSet"`.
3. Restaurar las referencias hardcodeadas a `ryouset`/`RyouSet`.
4. Eliminar `ryoukimi.json` y `ryouminimax.json` si se crearon.
5. Restaurar `current-modeprofile.json` a `ryouset`.
6. Regenerar runtime y agentes.

Se recomienda hacer un commit de git antes de iniciar la implementación.
