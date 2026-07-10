# Domain Shard 04 · Verification

## 1. Verification strategy

La verificación se divide en cuatro niveles:

1. **Static verification** — sintaxis JSON, ausencia de `ryouset` residual, existencia de archivos.
2. **Functional verification** — el plugin/TUI listan, switchan y sincronizan los perfiles correctamente.
3. **Runtime verification** — `runtime.generated.json` y `opencode.json` están en sync con el perfil activo.
4. **Agent-specific verification** — cada agente principal puede tener asignado un perfil distinto y `refreshAllAgentModels` sincroniza correctamente.

## 2. Static verification gates

### Gate 1 — Archivos de perfil correctos

```bash
# PowerShell
Test-Path .opencode\sdd-profiles\ryougo.json
Test-Path .opencode\sdd-profiles\ryoukimi.json
Test-Path .opencode\sdd-profiles\ryouminimax.json
Test-Path .opencode\sdd-profiles\ryouset.json -PathType Leaf  # debe ser FALSE
```

### Gate 2 — JSON válido

```bash
node -e "JSON.parse(require('fs').readFileSync('.opencode/sdd-profiles/ryougo.json'))"
node -e "JSON.parse(require('fs').readFileSync('.opencode/sdd-profiles/ryoukimi.json'))"
node -e "JSON.parse(require('fs').readFileSync('.opencode/sdd-profiles/ryouminimax.json'))"
```

### Gate 3 — Defaults del sistema actualizados

```bash
node -e "console.log(require('./.opencode/sdd.config.json').default_modeprofile)"  # ryougo
node -e "console.log(require('./.opencode/reasp.config.json').default_modeprofile)" # ryougo
node -e "console.log(JSON.stringify(require('./.opencode/reasp.config.json').agent_modeprofiles))" # {"ryou-orchestrator":"ryougo","ryou-efi-planner":"ryougo"}
```

### Gate 4 — No hay strings `ryouset`/`RyouSet` operativos residuales

```bash
# Excluir .refi/modules/, AI/Summarys/ históricos, .git y node_modules
rg -i "ryouset|RyouSet" .opencode/ installer/ scripts/ README.md REASP-Guide.html AI/CONTEXT.md
```

El resultado debe estar vacío o solo contener archivos históricos REFI que **no** deben tocarse.

## 3. Functional verification gates

### Gate 5 — Listado de perfiles

Invocar:
```text
sdd_mode_profile(action="list")
```

Esperado:
```text
Available SDD ModeProfiles:
  **ryougo** ...
  **ryoukimi** ...
  **ryouminimax** ...
  ... (otros perfiles base)
```

### Gate 6 — Switch a cada perfil

Invocar secuencialmente:
```text
sdd_mode_profile(action="switch", name="ryougo")
sdd_mode_profile(action="switch", name="ryoukimi")
sdd_mode_profile(action="switch", name="ryouminimax")
```

Cada uno debe retornar éxito y mostrar el provider derivado correctamente.

### Gate 7 — Validación de provider

Para `RyouKimi`, verificar que el provider derivado del `default.primary` sea `kimi-for-coding`. Para `RyouMinimax`, debe ser `minimax-coding-plan`. Si el proveedor no está en `DEFAULT_PROVIDERS` pero sí en `api.state.provider`, el switch debe funcionar sin error.

Si el usuario ejecuta:
```text
sdd_mode_profile(action="status")
```

Debe mostrar:
```text
Default model: kimi-for-coding/k2p7 (provider: kimi-for-coding)
```
para `RyouKimi`, y equivalente para `RyouMinimax`.

## 4. Runtime verification gates

### Gate 8 — Runtime en sync

```text
sdd_mode_profile(action="status")
```

Debe reportar `Runtime in sync: yes`.

### Gate 9 — Agent models sincronizados

Verificar `~/.config/opencode/opencode.json`:

```json
{
  "agent": {
    "ryou-orchestrator": { "model": "<provider>/<model>" },
    "ryou-efi-planner": { "model": "<provider>/<model>" },
    "planner": { "model": "<provider>/<model>" },
    "builder": { "model": "<provider>/<model>" },
    "architect": { "model": "<provider>/<model>" },
    "reviewer": { "model": "<provider>/<model>" },
    "debugger": { "model": "<provider>/<model>" },
    "documentation": { "model": "<provider>/<model>" }
  }
}
```

### Gate 10 — Tests automáticos

Ejecutar los scripts de test existentes:

```bash
node scripts/test-e2e-tool.mjs
node scripts/test-provider-support.mjs
node scripts/rass-sync-validator.js
```

Todos deben pasar sin errores. Si alguno falla por el cambio de default, ajustar el script (ya contemplado en `03-implementation.md` §2).

## 5. Agent-specific verification gates

### Gate 11 — Configuración por agente

Verificar que `reasp.config.json` contiene:

```json
{
  "agent_modeprofiles": {
    "ryou-orchestrator": "ryougo",
    "ryou-efi-planner": "ryoukimi"
  }
}
```

### Gate 12 — Resolución de modelo por agente

Invocar:
```text
rass_setup(action="validate")
```

Esperado: cada agente principal (`ryou-orchestrator`, `ryou-efi-planner`) tiene el modelo correspondiente a su perfil asignado.

### Gate 13 — Switch de perfil por agente

Después de cambiar `agent_modeprofiles` (por ejemplo, `ryou-efi-planner` → `ryouminimax` cuando esté disponible), ejecutar `refreshAllAgentModels()` o `rass_setup(action="validate")` y verificar que los modelos de agente se actualizan sin errores.

## 6. UX verification gates

### Gate 14 — TUI

Si el usuario interactúa con el TUI (`/sdd` o similar), verificar que:

- El perfil recomendado se muestra como `RyouGo`.
- Switching a `RyouKimi` y `RyouMinimax` funciona.
- No aparecen errores de "perfil no encontrado".
- Existe una opción para asignar un perfil diferente a `ryou-orchestrator` y `ryou-efi-planner`.

## 7. Verification summary checklist

- [ ] Archivos `ryougo.json`, `ryoukimi.json` y `ryouminimax.json` existen y son JSON válidos.
- [ ] `ryouset.json` no existe.
- [ ] `sdd.config.json` y `reasp.config.json` apuntan a `ryougo`.
- [ ] `reasp.config.json` contiene `agent_modeprofiles`.
- [ ] `current-modeprofile.json` apunta a `ryougo` (o al perfil que el usuario haya activado manualmente).
- [ ] No hay strings `ryouset`/`RyouSet` en archivos operativos.
- [ ] `sdd_mode_profile(action="list")` muestra los 3 perfiles.
- [ ] `sdd_mode_profile(action="switch")` funciona para los 3 perfiles.
- [ ] `sdd_mode_profile(action="status")` reporta `Runtime in sync: yes`.
- [ ] `rass_setup(action="validate")` sincroniza modelos de agentes según `agent_modeprofiles`.
- [ ] Tests automáticos pasan.
- [ ] Documentación actualizada (`README.md`, `REASP-Guide.html`, `AI/CONTEXT.md`).
- [ ] Resumen diario creado/actualizado en `AI/Summarys/`.
