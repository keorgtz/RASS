# PART 08-01 — Config State in reasp.config.json and rass-core.js

> **EPIC**: `08-planning-method-selector`
> **Status**: `open`
> **Goal**: Persist and expose `planning_method` (default `"phases"`).

## 1. Files to Change

- `.opencode/reasp.config.json`
- `.opencode/rass-core.js`

## 2. Changes

### `.opencode/reasp.config.json`

Add top-level field:

```json
{
  "primary_workflow": "ryou-orchestrator",
  "refi": { ... },
  "planning_method": "phases"
}
```

### `.opencode/rass-core.js`

#### Add constant

```js
export const VALID_PLANNING_METHODS = ['phases', 'epic'];
export const DEFAULT_PLANNING_METHOD = 'phases';
```

#### Add helpers

```js
export function getPlanningMethod() {
  const config = loadReaspConfig();
  const method = config?.planning_method;
  if (VALID_PLANNING_METHODS.includes(method)) return method;
  return DEFAULT_PLANNING_METHOD;
}

export function setPlanningMethod(method) {
  if (!VALID_PLANNING_METHODS.includes(method)) {
    throw new Error(`Invalid planning_method "${method}". Must be one of: ${VALID_PLANNING_METHODS.join(', ')}`);
  }
  const config = loadReaspConfig();
  config.planning_method = method;
  saveReaspConfig(config);
  return { planning_method: method };
}
```

#### Update `getReaspStatus()`

Include:

```js
planning_method: getPlanningMethod()
```

in the returned object.

## 3. Verification

Run:

```js
import { getPlanningMethod, setPlanningMethod } from './rass-core.js';
console.log(getPlanningMethod()); // "phases"
setPlanningMethod('epic');
console.log(getPlanningMethod()); // "epic"
setPlanningMethod('phases');
```

Expected: no errors, `"phases"` when missing/invalid.
