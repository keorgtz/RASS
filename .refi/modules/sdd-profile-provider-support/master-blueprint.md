# Master Blueprint · SDD Profile — Soporte de Selección Explícita de Proveedor

## 1. Problem Statement

REASP permite configurar qué modelo usa cada fase de un SDD ModeProfile, pero **no permite elegir explícitamente el proveedor**. El modelo se almacena como string `provider/model` (ej. `opencode-go/kimi-k2.7-code`), pero:

- **En el TUI** (`/sdd` → Edit ModeProfile → Configure Models): solo se muestra una lista plana de modelos con su `label` y `description`. El `provider` viene implícito en el ID pero el usuario no lo escoge — es un derivado de la elección del modelo.
- **En el tool** (`sdd_mode_profile`): el argumento `primary` acepta cualquier string, sin validación de que el provider exista o de que el modelo pertenezca a ese provider.
- El usuario maneja **varios proveedores** (múltiples cuentas `opencode-go`, o proveedores distintos como `opencode-go`, `anthropic`, `openai`) y quiere **combinar modelos de distintos providers en un mismo ModeProfile**, o forzar que un perfil use siempre un provider específico.

Esto resulta en:
1. Imposibilidad de validar que un modelo pertenece a un provider antes de guardar.
2. Imposibilidad de tener un ModeProfile que diga "usa cualquier modelo del provider X".
3. Imposibilidad de usar modelos custom (ej. `opencode-go/experimental-model`) que aún no están en el catálogo del provider.
4. Errores silenciosos cuando un provider desaparece o se renombra: el ModeProfile queda con un string que ya no es válido.

## 2. Goal

**Objetivo A — UI explícita:** Convertir la selección de modelo en un flujo de dos pasos en el TUI: **Proveedor → Modelo**, con opción de "Custom model" al final.

**Objetivo B — Validación:** Añadir el argumento `provider` al tool `sdd_mode_profile` y validar que el modelo pertenezca al provider elegido.

**Objetivo C — Compatibilidad:** No romper ModeProfiles existentes, no cambiar el formato en disco, no introducir regresiones en Windows o Linux.

**Objetivo D — Custom models:** Permitir a los usuarios escribir manualmente un string `provider/model` cuando su modelo aún no aparece en el catálogo.

## 3. Core Design Principles

> **Formato canónico en disco sin cambios.** `provider/model` se sigue almacenando como string en `sdd-profiles/*.json`. No introducimos un objeto `{provider, model}` ni duplicamos información.

> **El provider es opcional, no obligatorio.** Si un ModeProfile existente no especifica provider, sigue funcionando. La validación solo aplica cuando el usuario lo pide explícitamente.

> **El catálogo viene del runtime de OpenCode.** `api.state.provider` ya existe y expone la lista de providers y modelos. Lo consumimos tal cual — no mantenemos una lista paralela en RASS.

> **Custom model es un first-class citizen.** Los modelos no listados en el catálogo se aceptan como válidos (warning, no error). Esto cubre el caso de providers beta, modelos nuevos, y providers privados.

> **Cross-platform es trivial.** `api.state.provider` es idéntico en Windows y Linux (es un objeto JS serializado). No se introduce código platform-specific.

## 4. Gap Matrix — Diagnóstico Completo

| # | Archivo | Líneas | Problema | Severidad | Fix |
|---|---------|--------|----------|-----------|-----|
| G0 | `tui.js:32-65` | `discoverModels()` | Solo expone modelos planos, no providers separados | **ALTO** | Nueva `discoverProviders()` que devuelve `{id, name, models[]}` |
| G1 | `tui.js:352-369, 416-466, 698-734, 836-872` | 4 diálogos de selección de modelo | No hay paso previo de provider; lista plana | **CRÍTICO** | Insertar `showProviderSelectDialog()` antes de cada `showXxxModelDialog` |
| G2 | `plugin.js:71-74, 126-164` | argumento `primary` en `create`/`edit` | No hay argumento `provider`; sin validación | **ALTO** | Añadir `provider` opcional; validar `primary.startsWith(provider+'/')` |
| G3 | `rass-core.js` | sin export | Sin helpers `discoverProviders`, `validateModelInProvider` | **MEDIO** | Nuevas exports |
| G4 | `tui.js` (todos los `DialogSelect` de modelo) | sin opción custom | No hay forma de escribir un `provider/model` manualmente | **MEDIO** | Opción "+ Custom model" al final de cada lista |
| G5 | `tui.js:93-96` | `getModelLabel` | Solo busca por ID exacto, falla con strings custom | **BAJO** | Fallback a `modelId` cuando no se encuentra |
| G6 | `plugin.js:106-220` | output de acciones | No muestra provider en el output de switch/edit/create | **BAJO** | Mostrar provider derivado cuando es relevante |

**Lo que NO cambia (ya funciona):**
- Formato `provider/model` en disco ✅
- `DEFAULT_AGENT_MODELS` ✅
- `AVAILABLE_MODELS` fallback list ✅
- `pathToFileURL` y todo lo de linux-compat ✅
- `cross-platform` del installer ✅

## 5. Catálogo de Proveedores — Diseño

### Fuente: `api.state.provider` (OpenCode runtime)

```javascript
// Estructura que OpenCode expone (ya consumida en discoverModels):
api.state.provider = [
  {
    id: "opencode-go",
    name: "OpenCode Go",
    models: {
      "kimi-k2.7-code": { name: "Kimi K2.7 Code", family: "coding" },
      "glm-5.1":        { name: "GLM-5.1", family: "reasoning" },
      // ...
    }
  },
  {
    id: "anthropic",
    name: "Anthropic",
    models: { "claude-sonnet-4": { ... }, ... }
  },
  // ...
];
```

### Nuevo export en `rass-core.js`

```javascript
export const DEFAULT_PROVIDERS = [
  { id: 'opencode-go', name: 'OpenCode Go', models: [...] },
  { id: 'anthropic',   name: 'Anthropic',   models: [...] },
  { id: 'openai',      name: 'OpenAI',      models: [...] },
];

/**
 * Discover providers from OpenCode runtime.
 * If no runtime available, returns DEFAULT_PROVIDERS.
 */
export function discoverProviders(api) {
  if (api?.state?.provider && Array.isArray(api.state.provider)) {
    return api.state.provider.map(prov => ({
      id: prov.id,
      name: prov.name || prov.id,
      models: Object.entries(prov.models || {}).map(([mid, info]) => ({
        id: mid,
        fullId: `${prov.id}/${mid}`,
        label: info?.name || mid,
        description: info?.family || '',
      })),
    }));
  }
  return DEFAULT_PROVIDERS;
}

/**
 * Validate that a model belongs to a provider.
 * Returns { valid: boolean, reason?: string }.
 */
export function validateModelInProvider(modelId, providerId, providers) {
  if (!modelId || !providerId) return { valid: false, reason: 'missing input' };
  
  // Custom format: 'provider/model' — must start with providerId
  if (modelId.startsWith(`${providerId}/`)) {
    const prov = providers.find(p => p.id === providerId);
    if (!prov) return { valid: false, reason: `provider '${providerId}' not found` };
    const modelPart = modelId.slice(providerId.length + 1);
    const exists = prov.models.some(m => m.id === modelPart);
    return exists 
      ? { valid: true } 
      : { valid: true, warning: `model '${modelPart}' not in catalog of '${providerId}' (custom mode)` };
  }
  return { valid: false, reason: `model '${modelId}' does not start with provider '${providerId}/'` };
}

/**
 * Derive provider ID from a 'provider/model' string.
 * Returns the provider ID or null if format is invalid.
 */
export function deriveProviderFromModel(modelId, providers) {
  if (!modelId || typeof modelId !== 'string') return null;
  const idx = modelId.indexOf('/');
  if (idx === -1) return null;
  const provId = modelId.slice(0, idx);
  return providers.find(p => p.id === provId) ? provId : provId; // return even if unknown
}
```

## 6. TUI Flow — Selección en Dos Pasos

### Antes (un solo paso, lista plana)

```text
Configure models for "my-profile" — Single model for all phases
  ✓ GLM-5.1
    Kimi K2.7 Code
    DeepSeek V4 Pro
    ...
  ← Back to edit menu
```

### Después (dos pasos + custom)

```text
Select provider for "my-profile" — Configure models
  OpenCode Go         (12 models)  ← selected
  Anthropic            (8 models)
  OpenAI               (6 models)
  + Custom model (provider/model)   ← advanced
  ← Back to edit menu
```

```text
OpenCode Go — Select model for "my-profile"
  GLM-5.1                  reasoning
  Kimi K2.7 Code           coding
  DeepSeek V4 Pro          reasoning
  DeepSeek V4 Flash        coding
  ... 
  + Custom model (provider/model)   ← abre DialogPrompt
  ← Back to provider list
```

### Cambios en `tui.js`

| Diálogo | Acción |
|---------|--------|
| `showCreateSingleModelDialog` | Insertar paso previo `showCreateSingleProviderDialog` |
| `showCreatePerPhasePhaseDialog` | Insertar paso previo por fase |
| `showEditSingleModelDialog` | Insertar paso previo `showEditSingleProviderDialog` |
| `showEditPerPhaseModelDialog` | Insertar paso previo por fase |
| Todos los `DialogSelect` de modelos | Añadir `+ Custom model (provider/model)` que abre `DialogPrompt` |

### Helper: `showProviderSelectDialog`

```javascript
const showProviderSelectDialog = (dialog, title, providers, onSelect, allowCustom = true) => {
  const options = providers.map(p => ({
    title: p.name || p.id,
    value: p.id,
    description: `${p.models?.length || 0} models available`,
  }));
  
  if (allowCustom) {
    options.push({
      title: '+ Custom model (provider/model)',
      value: '__custom__',
      description: 'Enter a model string manually (e.g., opencode-go/experimental)',
    });
  }
  
  options.push({
    title: '← Back',
    value: '__back__',
    description: 'Return to previous menu',
  });
  
  dialog.replace(() => api.ui.DialogSelect({
    title,
    placeholder: 'Select a provider...',
    options,
    onSelect: (option) => {
      if (option.value === '__back__') {
        // Caller decides what "back" means
        return;
      }
      if (option.value === '__custom__') {
        return showCustomModelPrompt(dialog, onSelect);
      }
      onSelect(option.value);
    },
  }));
};
```

### Helper: `showCustomModelPrompt`

```javascript
const showCustomModelPrompt = (dialog, onConfirm) => {
  dialog.replace(() => api.ui.DialogPrompt({
    title: 'Custom model — enter "provider/model"',
    placeholder: 'e.g., opencode-go/experimental-model',
    onConfirm: (input) => {
      const trimmed = (input || '').trim();
      if (!trimmed.includes('/')) {
        // Show error and re-open
        api.ui.toast({ variant: 'error', title: 'Invalid format', message: 'Must be "provider/model"' });
        return showCustomModelPrompt(dialog, onConfirm);
      }
      onConfirm(trimmed);
    },
  }));
};
```

## 7. Plugin Tool — Argumento `provider`

### Schema actualizado

```javascript
sdd_mode_profile: tool({
  args: {
    action: ...,
    name: ...,
    phases: ...,
    model_strategy: ...,
    primary: tool.schema.string().optional()
      .describe('Primary model (e.g., "opencode-go/kimi-k2.7-code"). Any valid model string is accepted.'),
    provider: tool.schema.string().optional()
      .describe('Provider ID to validate the primary model against (e.g., "opencode-go"). If provided, primary must start with "<provider>/"'),
    effort: ...,
    description: ...,
    updates: ...,
  },
  // ...
})
```

### Lógica de validación

```javascript
case 'create': {
  // ... existing logic ...
  
  if (args.provider && args.primary) {
    if (!args.primary.startsWith(`${args.provider}/`)) {
      return {
        title: 'Error',
        output: `Primary model '${args.primary}' does not belong to provider '${args.provider}'. ` +
                `Expected format: '${args.provider}/<model>'.`,
      };
    }
  }
  
  if (args.provider && !args.primary) {
    // Resolve default model for the provider
    const prov = providers.find(p => p.id === args.provider);
    if (!prov || prov.models.length === 0) {
      return { title: 'Error', output: `Provider '${args.provider}' has no models or doesn't exist.` };
    }
    primary = prov.models[0].fullId;
  }
  
  // ... rest of create logic ...
}
```

### Output enriquecido

El output de `switch`, `edit`, `create`, `status` ahora muestra el provider derivado del default model:

```text
Active ModeProfile: **ryouset**
Phases: orchestrator → init → explore → propose → design → apply → verify → archive
Model strategy: per-phase
Default model: opencode-go/kimi-k2.7-code (provider: opencode-go)
...
```

## 8. Cambios en `rass-core.js`

### Nuevos exports

| Función | Propósito |
|---------|-----------|
| `DEFAULT_PROVIDERS` | Catálogo de fallback (igual estilo que `AVAILABLE_MODELS`) |
| `discoverProviders(api)` | Lee `api.state.provider` y devuelve catálogo normalizado |
| `validateModelInProvider(modelId, providerId, providers)` | Valida pertenencia con warning si es custom |
| `deriveProviderFromModel(modelId, providers)` | Extrae provider del string `provider/model` |
| `getProviderLabel(providerId, providers)` | Helper para UI |

### Funciones actualizadas (no breaking)

- `resolveAgentModels()`: ahora también devuelve el provider derivado.
- `resolveRuntime()`: la estructura interna no cambia; `model` sigue siendo string.
- `refreshAllFromModeProfile()`: sin cambios.

## 9. Archivo Layout Post-Cambio

```text
.opencode/
├── rass-core.js           ← MODIFICADO: +discoverProviders, +validate, +DEFAULT_PROVIDERS
├── tui.js                 ← MODIFICADO: 2-step selection + custom model
├── plugin.js              ← MODIFICADO: +provider arg + validation
└── sdd-profiles/*.json    ← SIN CAMBIOS en formato

AI/
├── CONTEXT.md             ← MODIFICADO: nueva sección sesión
└── Summarys/
    └── summary-<fecha>.html  ← NUEVO

.refi/modules/sdd-profile-provider-support/  ← Este packet
```

## 10. Risks & Mitigations

| Riesgo | Mitigación |
|--------|------------|
| `api.state.provider` no disponible en tests o sin OpenCode | Fallback a `DEFAULT_PROVIDERS` (igual patrón que `AVAILABLE_MODELS`) |
| Custom model string mal formado (sin `/`) | `showCustomModelPrompt` valida con `includes('/')` y rechaza con toast |
| Regresión en ModeProfiles existentes | El formato `provider/model` en disco no cambia; `provider` es opcional en todas las APIs nuevas |
| TUI se vuelve más profundo (más pasos) | Cada paso tiene un "← Back" claro; se mantiene la opción de custom para saltarse la navegación |
| `validateModelInProvider` rechaza modelos que el usuario quiere usar | La validación se hace **solo cuando el usuario pasa `provider`**. Si omite `provider`, no hay validación — comportamiento idéntico al actual |
| Tool output cambia formato y rompe integraciones | Los cambios en output son aditivos (líneas nuevas); los campos existentes (`Default model:`) siguen apareciendo igual |

## 11. Open Questions

Ninguna bloqueante. El plan es ejecutable con la información actual.

Decisiones tomadas con defaults razonables:
- **Default fallback providers** → `DEFAULT_PROVIDERS` con `opencode-go`, `anthropic`, `openai`, `google`.
- **Custom model format** → solo `provider/model` (un solo `/`). Si el modelo no tiene provider, se rechaza.
- **Provider case-sensitivity** → case-sensitive (consistente con cómo OpenCode maneja los IDs).
- **Multiple providers en un ModeProfile** → ya soportado: cada phase puede tener su propio `primary`, así que mezclar providers es natural y no requiere nada nuevo.
