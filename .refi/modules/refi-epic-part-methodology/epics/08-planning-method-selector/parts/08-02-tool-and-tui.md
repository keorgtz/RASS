# PART 08-02 — Tool and TUI Selector

> **EPIC**: `08-planning-method-selector`
> **Status**: `open`
> **Goal**: Expose planning method selection via `reasp_setup` tool and `/reasp-setup` slash command.

## 1. Files to Change

- `.opencode/plugin.js`
- `.opencode/tui.js`

## 2. plugin.js

### Add to `reasp_setup` schema

In the `properties` of the tool definition, add:

```js
method: {
  type: 'string',
  enum: ['phases', 'epic'],
  description: 'Planning method to activate (required for set-planning-method).',
}
```

Update description to mention:

```text
Use 'set-planning-method' to switch between 'phases' (legacy) and 'epic' (v2).
```

### Add case in switch

```js
case 'set-planning-method': {
  const method = args.method;
  const result = setPlanningMethod(method);
  return {
    content: [{ type: 'text', text: `Planning method set to "${result.planning_method}".` }],
    isError: false,
  };
}
```

### Update status response

When `action === 'status'`, include `planning_method` in the returned status text / JSON.

## 3. tui.js

### Import helpers

At the top where `rass-core` helpers are imported, add:

```js
getPlanningMethod,
setPlanningMethod,
```

### Add option in showSetupDialog

Insert after the "View Status" option:

```js
{
  title: 'Switch Planning Method',
  value: 'switch-planning-method',
  description: `Current: ${getPlanningMethod()} — Phases (legacy) or Epic + PART (v2)`,
},
```

### Add handler

Add case:

```js
case 'switch-planning-method': {
  dialog.replace(
    () => api.ui.DialogSelect({
      title: 'Select Planning Method',
      placeholder: 'Choose planning methodology...',
      options: [
        {
          title: 'Phases (legacy)',
          value: 'phases',
          description: 'Domain-shard planning: planning, architecture, implementation, verification, handoff',
        },
        {
          title: 'Epic + PART (v2)',
          value: 'epic',
          description: 'EPIC/PART planning with packets, quality gates, and anti-hallucination rules',
        },
      ],
      onSelect: (opt) => {
        try {
          setPlanningMethod(opt.value);
          dialog.clear();
          api.ui.toast({
            variant: 'success',
            title: 'Planning Method Updated',
            message: `REASP is now using "${opt.value}" planning methodology.`,
          });
        } catch (err) {
          dialog.clear();
          api.ui.toast({ variant: 'error', title: 'Error', message: err.message });
        }
      },
    }),
  );
  break;
}
```

### Update View Status toast

Include `planning_method`:

```js
message: `Workflow: ${reasp.default_workflow} | ModeProfile: ${status.current_modeprofile || 'none'} | REFI: ${refiEnabled ? 'enabled' : 'disabled'} | Planning: ${reasp.planning_method}`,
```

## 4. Verification

1. `/reasp-setup` → shows "Switch Planning Method" with current method.
2. Select "Epic + PART" → toast confirms, `reasp.config.json` updated.
3. `reasp_setup(action="status")` returns `planning_method: "epic"`.
4. Restart/reload → default still `"phases"` for new/corrupt configs.
