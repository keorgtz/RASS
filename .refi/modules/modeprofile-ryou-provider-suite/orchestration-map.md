# Orchestration Map · ModeProfile Ryou Provider Suite

## 1. Execution order

```text
Phase 1: PLANNING COMPLETE (este packet)
   │
   ├── <GATE A> Modelos confirmados ✅
   │     ├── Kimi: `kimi-for-coding/k2p7`, `kimi-for-coding/k2p6`
   │     └── Minimax: `minimax-coding-plan/MiniMax-M3`, `minimax-coding-plan/MiniMax-M2.7`
   │
   ▼
Phase 2: RENAME RyouSet → RyouGo
   ├── 2.1 Renombrar ryouset.json → ryougo.json
   ├── 2.2 Actualizar campo name a "RyouGo"
   ├── 2.3 Actualizar sdd.config.json y reasp.config.json (incluir agent_modeprofiles)
   ├── 2.4 Actualizar current-modeprofile.json
   ├── 2.5 Regenerar runtime.generated.json
   └── <GATE B> Validar: ryougo existe, ryouset no existe, runtime en sync
   │
   ▼
Phase 3: UPDATE HARDCODED REFERENCES
   ├── 3.1 .opencode/plugin.js
   ├── 3.2 .opencode/tui.js
   ├── 3.3 .opencode/rass-core.js (incluir funciones por agente)
   ├── 3.4 .opencode/agents/ryou-orchestrator.md
   ├── 3.5 installer/lib/constants.js
   ├── 3.6 installer/lib/tui.js
   ├── 3.7 installer/lib/targets/opencode.js
   ├── 3.8 scripts/rass-sync-validator.js
   ├── 3.9 scripts/test-e2e-tool.mjs
   ├── 3.10 scripts/sync-reasp.js
   ├── 3.11 README.md
   ├── 3.12 REASP-Guide.html
   └── 3.13 AI/CONTEXT.md
   │
   ▼
Phase 4: CREATE RyouKimi
   ├── 4.1 Escribir .opencode/sdd-profiles/ryoukimi.json
   └── <GATE C> Validar JSON y provider
   │
   ▼
Phase 5: CREATE RyouMinimax
   ├── 5.1 Escribir .opencode/sdd-profiles/ryouminimax.json
   └── <GATE D> Validar JSON y provider
   │
   ▼
Phase 6: EXTEND AGENT-SPECIFIC PROFILES
   ├── 6.1 Implementar getAgentModeProfile, resolveAgentModel, refreshAllAgentModels en rass-core.js
   ├── 6.2 Exponer agent_modeprofiles en plugin.js / rass_setup
   ├── 6.3 Agregar opción en tui.js para asignar perfil por agente
   └── <GATE E> Validar que ryou-orchestrator y ryou-efi-planner pueden usar perfiles distintos
   │
   ▼
Phase 7: RUNTIME SYNC & VALIDATION
   ├── 7.1 Switch a ryougo
   ├── 7.2 Switch a ryoukimi
   ├── 7.3 Switch a ryouminimax
   ├── 7.4 Ejecutar tests automáticos
   └── <GATE F> Validar: list/switch/status, runtime en sync, tests pasan
   │
   ▼
Phase 8: DOCUMENTATION
   ├── 8.1 Actualizar README.md
   ├── 8.2 Actualizar REASP-Guide.html
   ├── 8.3 Actualizar AI/CONTEXT.md
   └── 8.4 Crear/actualizar AI/Summarys/summary-YYYY-MM-DD.html
   │
   ▼
Phase 9: HANDOFF COMPLETE
```

## 2. Verification gates

| Gate | Name | Location | Evidence |
|------|------|----------|----------|
| A | Modelos confirmados | `master-blueprint.md` §5 | Kimi: `kimi-for-coding/k2p7`, `kimi-for-coding/k2p6`; Minimax: `minimax-coding-plan/MiniMax-M3`, `minimax-coding-plan/MiniMax-M2.7`. |
| B | RyouGo rename OK | `04-verification.md` Gates 1-4 | `ryougo.json` existe, `ryouset.json` no existe, defaults a `ryougo`, no `ryouset` residual, `agent_modeprofiles` presente. |
| C | RyouKimi valid | `04-verification.md` Gate 2 | JSON válido, provider derivado `kimi-for-coding`. |
| D | RyouMinimax valid | `04-verification.md` Gate 2 | JSON válido, provider derivado `minimax-coding-plan`. Solo si se confirman modelos. |
| E | Agent-specific profiles OK | `04-verification.md` §6 | `resolveAgentModel` y `refreshAllAgentModels` funcionan; cada agente principal puede tener perfil distinto. |
| F | Runtime sync | `04-verification.md` Gates 5-10 | `sdd_mode_profile` list/switch/status OK, tests pasan. |
| G | Documentation updated | `04-verification.md` §6 | `README.md`, `REASP-Guide.html`, `AI/CONTEXT.md` y resumen diario actualizados. |

## 3. Critical path

La ruta crítica es:

```text
A (modelos confirmados) → 2 (rename) → 3 (references) → 4 (RyouKimi) → 5 (RyouMinimax) → 6 (agent profiles) → 7 (runtime sync) → 8 (docs) → 9 (handoff)
```

## 4. Rollback checkpoints

| Checkpoint | Acción de rollback |
|------------|-------------------|
| Después de Phase 2 | Renombrar `ryougo.json` → `ryouset.json`, restaurar defaults y referencias. |
| Después de Phase 4 | Eliminar `ryoukimi.json` y restaurar referencias si se agregó alguna. |
| Después de Phase 5 | Eliminar `ryouminimax.json` y restaurar referencias si se agregó alguna. |
| Después de Phase 6 | Restaurar `runtime.generated.json` y `current-modeprofile.json` desde backup. |

## 5. Handoff to Ryou Orchestrator

Cuando se llegue a la fase 9, el orchestrator debe:

1. Leer `03-implementation.md` y `04-verification.md`.
2. Ejecutar las fases en orden, deteniéndose en cada Gate.
3. No modificar archivos históricos de `.refi/modules/`.
4. Generar el resumen diario al finalizar.
