# Request · SDD Profile — Soporte de Selección Explícita de Proveedor

## Source Request

> "estamos en mi proyecto de REASP, y quiero implementar unos cambios, lo primero es que a la hora de escoger un modelo en el Sdd-profile no me permite elegir de que proovedor especificamente quiero gastar ese modelo, ya que manejo varios, asi que quiero que agregues el soporte para que a la hora de elegir un modelo en la configuracion de un SDD profile me permita tambien elegir el proovedor especifico y asi manejar perfiles mucho mas configurables correctamente, implementa eso correctamente para windows y linux, pruebalo, y cuando quede correctamente funcional generame el summary.html para ver lo implementado"

## Owner

Kevin Keor / maintainer de REASP.

## Contexto Detectado

El modelo se almacena actualmente como string `provider/model` (ej. `opencode-go/kimi-k2.7-code`) en:
- `.opencode/sdd-profiles/*.json` → `default.primary`, `default.fallbacks[]`, `<phase>.primary`, `<phase>.fallbacks[]`
- `~/.config/opencode/opencode.json` → `model`, `small_model`, `agent[<name>].model`

El usuario maneja **varios proveedores** (puede tener múltiples credenciales, regiones, o variantes de `opencode-go`) y necesita:
1. **En el TUI** (`/sdd`): flujo de selección de dos pasos — primero proveedor, luego modelo.
2. **En el tool** (`sdd_mode_profile`): un argumento `provider` explícito que valide que el modelo pertenece a ese proveedor.
3. **Fallback "Custom model"**: opción para escribir manualmente un `provider/model` cuando no aparece en el catálogo (proveedor recién añadido, modelo beta, etc).
4. **Cross-platform**: el catálogo de proveedores viene de `api.state.provider` (OpenCode) y es idéntico en Windows y Linux. La validación debe ser platform-agnostic.

## Scope Inclusions

### 1. Rass Core — Catálogo de proveedores + validación
1. Exportar `discoverProviders(api)` que devuelva un catálogo `{id, name, models[]}` desde `api.state.provider`.
2. Exportar `validateModelInProvider(modelId, providerId, providers)` que confirme que `provider/model` es válido.
3. Mantener el formato canónico `provider/model` en disco (no se cambia la estructura de `sdd-profiles/*.json`).
4. Añadir `provider` opcional a la metadata de cada phase config para *resolución explícita* (si está presente, se prefiere sobre el parsing del string).

### 2. TUI — Flujo de selección de dos pasos
5. En `showCreateSingleModelDialog`, `showCreatePerPhasePhaseDialog`, `showEditSingleModelDialog` y `showEditPerPhaseModelDialog`: añadir un paso previo de **selección de proveedor**.
6. Cada lista de modelos se filtra por el proveedor elegido.
7. Al final de cada lista de modelos, agregar una opción **"+ Custom model (provider/model)"** que abre un `DialogPrompt` para escribir manualmente.
8. Mostrar el proveedor activo en el título y en las descripciones de cada opción.

### 3. Plugin tool — Argumento `provider`
9. Añadir `provider` opcional a `sdd_mode_profile` (action=create/edit).
10. Si `provider` y `primary` se dan juntos: validar que `primary.startsWith(provider + '/')` antes de guardar; rechazar con error si no coincide.
11. Si solo `primary` se da (sin provider): derivar el provider del string `provider/model` y aceptarlo si existe en el catálogo; si no, aceptar de todos modos (compatibilidad con strings custom) pero registrarlo en output.
12. Si solo `provider` se da (sin primary): resolver al primer modelo del catálogo del provider y usarlo como default.

### 4. Cross-platform
13. Toda la lógica nueva es JS puro sobre `api.state.provider` — funciona idéntico en Windows y Linux.
14. `pathToFileURL` y similares ya fueron validados en `linux-compat`; este módulo no introduce código platform-specific.
15. Los tests del módulo `linux-compat` deben seguir pasando sin cambios.

### 5. Documentación y Summary
16. Actualizar `AI/CONTEXT.md` con la nueva sección "Sesión — SDD provider support".
17. Generar `AI/Summarys/summary-<fecha>.html` con el resumen visual de la implementación.

## Scope Exclusions

- No cambiar el formato de almacenamiento en disco (sigue siendo string `provider/model`).
- No eliminar la lista actual `AVAILABLE_MODELS` — se usa solo como fallback cuando `api.state.provider` no está disponible (TUI sin OpenCode cargado, tests, etc).
- No modificar el installer ni los adapters de agentes.
- No tocar prompts, reglas, ni skill de REFI.
- No añadir UI a los slash commands de setup de workflows (`/reasp-setup`); el cambio es **solo en `/sdd` → Edit/Create ModeProfile → Configure Models**.
- No añadir soporte para múltiples modelos por fase en la UI (ya existe como `fallbacks[]` y se mantiene sin cambios).

## Success Criteria

- `node --check` pasa en `.opencode/rass-core.js`, `.opencode/tui.js`, `.opencode/plugin.js`.
- `npm test` pasa sin cambios en el script de testing.
- En `/sdd` → Create/Edit ModeProfile → Configure Models: el usuario ve primero la lista de proveedores, luego los modelos filtrados, con opción "Custom model" al final.
- El `sdd_mode_profile` tool acepta `provider` y valida que `primary` pertenezca a ese provider.
- Crear un ModeProfile de prueba con un provider específico (ej. `opencode-go`) y un modelo custom (`opencode-go/experimental-model`) funciona end-to-end.
- El JSON resultante tiene el string correcto `provider/model` en `default.primary` y en `default.fallbacks[]`.
- `summary-<fecha>.html` generado y referenciado en `AI/CONTEXT.md`.

## Language

Español / inglés mixto, siguiendo la convención existente del proyecto.
