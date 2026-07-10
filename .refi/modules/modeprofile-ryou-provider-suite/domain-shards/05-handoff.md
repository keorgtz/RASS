# Domain Shard 05 · Handoff

## 1. Handoff criteria

El handoff a Ryou Orchestrator solo puede ocurrir cuando:

1. El plan está completo y aprobado por el usuario.
2. Los modelos de proveedor para `RyouKimi` y `RyouMinimax` han sido confirmados.
3. Se ha acordado que `RyouGo` sigue siendo el perfil por defecto del sistema.
4. El usuario ha aceptado el alcance: renombrar + crear perfiles + separación de perfiles por agente + actualizar referencias operativas + documentación de usuario.

## 2. Deliverables esperados tras la implementación

| Deliverable | Location | Estado esperado |
|-------------|----------|-----------------|
| Perfil RyouGo | `.opencode/sdd-profiles/ryougo.json` | Existente, `name: "RyouGo"` |
| Perfil RyouKimi | `.opencode/sdd-profiles/ryoukimi.json` | Nuevo, modelos Kimi confirmados |
| Perfil RyouMinimax | `.opencode/sdd-profiles/ryouminimax.json` | Nuevo, modelos Minimax confirmados |
| Configuración del sistema | `.opencode/sdd.config.json`, `.opencode/reasp.config.json` | `default_modeprofile: "ryougo"` |
| Runtime | `.opencode/runtime/current-modeprofile.json`, `.opencode/runtime/runtime.generated.json` | Apuntando a `ryougo` o al perfil activo del usuario |
| `reasp.config.json` | `default_modeprofile: "ryougo"`, `agent_modeprofiles` configurado | Actualizado |
| Código actualizado | `.opencode/plugin.js`, `.opencode/tui.js`, `.opencode/rass-core.js`, `.opencode/agents/ryou-orchestrator.md` | Sin referencias `ryouset`/`RyouSet`; soporta `agent_modeprofiles` |
| Installer y scripts | `installer/lib/*`, `scripts/*` | Sin referencias `ryouset`/`RyouSet` |
| Documentación | `README.md`, `REASP-Guide.html`, `AI/CONTEXT.md` | Actualizada |
| Resumen diario | `AI/Summarys/summary-YYYY-MM-DD.html` | Creado/actualizado |

## 3. Handoff notes to Ryou Orchestrator

- **Todos los modelos han sido confirmados.** No quedan placeholders `UNKNOWN`.
- **Trabajar primero el renombrado y luego la creación.** El orden importa: si se crean primero los nuevos perfiles y luego se renombra el default, podría haber confusión en el runtime.
- **Implementar la separación de perfiles por agente antes de la sincronización final.** Esto asegura que `refreshAllAgentModels()` sincronice cada agente con su perfil asignado.
- **Usar `grep` para validar ausencia de `ryouset` residual.** Verificar `04-verification.md` Gate 4.
- **Regenerar runtime después de cada switch.** Usar `refreshAllFromModeProfile` o el tool `sdd_mode_profile(action="switch", name="...")`.
- **No modificar `.refi/modules/` históricos.** Esos packets son solo documentación.
- **Crear resumen diario** al finalizar, siguiendo `global-rules.md` §7.

## 4. Post-implementation user actions

Después de que Ryou Orchestrator termine, el usuario debería:

1. **Reiniciar OpenCode** para que la nueva configuración cargue (según skill `customize-opencode`).
2. Verificar que su agente por defecto sigue siendo el deseado (`ryou-orchestrator` o `ryou-efi-planner`).
3. Probar switchar entre `RyouGo` y `RyouKimi` (y `RyouMinimax` si se creó) para validar que cada uno sincroniza los modelos correctamente.
4. Verificar que `ryou-orchestrator` y `ryou-efi-planner` pueden tener perfiles distintos editando `agent_modeprofiles` en `reasp.config.json` y ejecutando `rass_setup(action="validate")`.
5. Revisar su `~/.config/opencode/opencode.json` para confirmar que los modelos de agente son los esperados.

## 5. Escalation triggers

Escalar (solicitar revisión humana) si:

- Algún test automático falla tras el renombrado.
- El runtime no logra sincronizarse (`Runtime in sync: no` persistente).
- Hay conflictos con git que no se pueden resolver automáticamente.
- El usuario decide cambiar el default a `RyouKimi` o `RyouMinimax` en lugar de `RyouGo` (cambio de alcance).
- La separación de perfiles por agente causa inconsistencias no anticipadas (por ejemplo, un agente principal termina con un modelo inesperado).
