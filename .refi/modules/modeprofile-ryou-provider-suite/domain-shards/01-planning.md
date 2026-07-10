# Domain Shard 01 · Planning

## 1. Scope de este shard

Definir el plan de ejecución para:
1. Renombrar `RyouSet` → `RyouGo`.
2. Crear los perfiles `RyouKimi` y `RyouMinimax`.
3. Extender REASP/RASS para soportar **perfiles separados por agente principal**, permitiendo que `ryou-orchestrator` y `ryou-efi-planner` usen ModeProfiles distintos.

Incluye la identificación de archivos afectados, la secuencia de cambios y los puntos de verificación.

## 2. Inventory de archivos afectados

### 2.1 Archivos de perfil (obligatorios)

| Archivo | Acción | Razón |
|---------|--------|-------|
| `.opencode/sdd-profiles/ryouset.json` | **Renombrar** a `ryougo.json` | El ID del perfil es el nombre del archivo; el nombre legible vive en el campo `name`. |
| `.opencode/sdd-profiles/ryougo.json` | **Editar** campo `name` a `"RyouGo"` | Reflejar el nuevo nombre legible. |
| `.opencode/sdd-profiles/ryoukimi.json` | **Crear** | Nuevo perfil para proveedor Kimi for coding. |
| `.opencode/sdd-profiles/ryouminimax.json` | **Crear** | Nuevo perfil para proveedor minimax.io token plan. |

### 2.2 Archivos de configuración del sistema (obligatorios)

| Archivo | Campo | Cambio |
|---------|-------|--------|
| `.opencode/sdd.config.json` | `default_modeprofile` | `"ryouset"` → `"ryougo"` |
| `.opencode/reasp.config.json` | `default_modeprofile` | `"ryouset"` → `"ryougo"` |
| `.opencode/reasp.config.json` | `agent_modeprofiles` (nuevo) | `{ "ryou-orchestrator": "ryougo", "ryou-efi-planner": "ryougo" }` |
| `.opencode/runtime/current-modeprofile.json` | `modeprofile` | `"ryouset"` → `"ryougo"` (si estaba activo) |
| `.opencode/runtime/runtime.generated.json` | `active_modeprofile` | Regenerar desde `RyouGo` |

### 2.3 Archivos con referencias hardcodeadas (obligatorias)

| Archivo | Líneas / áreas | Tipo de cambio |
|---------|---------------|----------------|
| `.opencode/plugin.js` | Línea 70 (schema descripción), Línea 369 (deploy output), Línea 376 (validate output); posiblemente nuevo argumento en `rass_setup` | Reemplazar `ryouset` por `ryougo`; `RyouSet` por `RyouGo`; soportar `agent_modeprofiles`. |
| `.opencode/tui.js` | Líneas 1243-1244, 1352-1359; posiblemente nuevo menú para asignar perfil por agente | Reemplazar etiquetas y valores de `RyouSet` → `RyouGo`; soportar `agent_modeprofiles`. |
| `.opencode/rass-core.js` | Líneas 213, 287, 401, 473, 594; más nuevas funciones `getAgentModeProfile`, `resolveAgentModel`, `refreshAllAgentModels` | Reemplazar default fallback `ryouset` → `ryougo`; agregar resolución de perfil por agente. |
| `.opencode/agents/ryou-orchestrator.md` | Líneas 70, 80, 88 | Reemplazar referencias de perfil. |
| `installer/lib/constants.js` | Línea 27 | `DEFAULT_MODEPROFILE` → `"ryougo"`. |
| `installer/lib/tui.js` | Línea 323 | Etiqueta de perfil recomendado. |
| `installer/lib/targets/opencode.js` | Línea 416 | Default fallback → `"ryougo"`. |
| `scripts/rass-sync-validator.js` | Línea 174 | Default fallback → `"ryougo"`. |
| `scripts/test-e2e-tool.mjs` | Línea 126 | Default switch → `"ryougo"`. |
| `scripts/sync-reasp.js` | Línea 79 | Default fallback → `"ryougo"`. |
| `README.md` | Líneas 102, 148, 243, 323, 512, 605, 632, 679, 833 | Actualizar referencias a `RyouSet` → `RyouGo`. |
| `REASP-Guide.html` | Línea 861 | Actualizar referencias. |
| `AI/CONTEXT.md` | Línea 27, 112 | Actualizar lista de perfiles y tabla. |

### 2.4 Archivos históricos REFI (NO tocar)

Los packets existentes en `.refi/modules/` documentan implementaciones pasadas. Sus referencias a `ryouset` son parte del registro histórico y **no deben modificarse**:

- `.refi/modules/sdd-profile-provider-support/*`
- `.refi/modules/multi-agent-compatibility/*`
- `.refi/modules/refi-epic-part-methodology/*`
- `AI/Summarys/summary-2026-07-08.html`
- `AI/Summarys/summary-2026-07-09.html`

## 3. Secuencia de ejecución

1. **Paso 0 — Confirmar modelos.** Todos los modelos han sido confirmados (ver `master-blueprint.md` §5).
2. **Paso 1 — Renombrar y ajustar `RyouGo`.** Mover `ryouset.json` → `ryougo.json`, cambiar `name` y actualizar defaults del sistema.
3. **Paso 2 — Actualizar referencias hardcodeadas.** Reemplazar `ryouset`/`RyouSet` por `ryougo`/`RyouGo` en todos los archivos operativos listados.
4. **Paso 3 — Crear `RyouKimi` y `RyouMinimax`.** Escribir los nuevos archivos JSON con la misma estructura de fases y esfuerzos.
5. **Paso 4 — Extender soporte de perfiles por agente.**
   - Agregar `agent_modeprofiles` a `.opencode/reasp.config.json`.
   - Implementar `getAgentModeProfile`, `resolveAgentModel` y `refreshAllAgentModels` en `rass-core.js`.
   - Actualizar `plugin.js` y `tui.js` para exponer la configuración.
6. **Paso 5 — Sincronizar runtime y agentes.** Regenerar `runtime.generated.json` y `opencode.json` global desde el perfil activo y los perfiles por agente.
7. **Paso 6 — Verificar.** Ejecutar tests, listar perfiles, switchar entre perfiles, validar sincronización de perfiles por agente.
8. **Paso 7 — Documentar.** Actualizar `AI/CONTEXT.md`, `README.md`, `REASP-Guide.html` y generar resumen diario.

## 4. Decisiones de planificación

- **Default del sistema:** Se mantiene `RyouGo` como default (confirmado por el usuario).
- **Estrategia de modelos:** Se conserva `per-phase` en los tres perfiles.
- **Mapeo de modelos:** Para `RyouKimi` y `RyouMinimax`, cada fase conserva el mismo esfuerzo (`low`, `medium`, `high`) pero el `primary` y `fallbacks` usan el proveedor correspondiente.
  - `RyouKimi`: `kimi-for-coding/k2p7` como primary en todas las fases excepto `archive` (usa `k2p6`); `k2p6` como fallback.
  - `RyouMinimax`: `minimax-coding-plan/MiniMax-M3` como primary en todas las fases excepto `archive` (usa `MiniMax-M2.7`); `MiniMax-M2.7` como fallback.
- **Fallbacks:** Los fallbacks dentro de cada fase se reemplazan por modelos del mismo proveedor. **No se mezclan proveedores dentro de un mismo perfil** para mantener la coherencia de "perfil de proveedor".
- **Perfiles por agente:** `reasp.config.json` declarará `agent_modeprofiles` con `ryou-orchestrator` y `ryou-efi-planner` apuntando a `RyouGo` por defecto, pero el sistema permitirá asignar perfiles distintos. Los subagentes no listados heredan el `default_modeprofile`.

## 5. What is NOT in scope

- No se modifica el catálogo `DEFAULT_PROVIDERS` en `rass-core.js` (a menos que el usuario lo solicite explícitamente).
- No se modifica el formato JSON del perfil.
- No se agregan nuevas fases.
- No se cambian los perfiles base (`fast`, `architecture`, `ui`, `debug`, `enterprise`, `legacy`, `minimal`).
- No se migran packets REFI históricos.
- Sí se extiende `plugin.js` y `tui.js` para soportar `agent_modeprofiles`, pero no se reimplementa por completo.
