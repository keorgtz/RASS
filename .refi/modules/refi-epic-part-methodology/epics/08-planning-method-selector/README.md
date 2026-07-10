# EPIC 08 — Planning Method Selector

> **Status**: `open`
> **Owner**: Ryou EFI Planner / REASP runtime
> **Goal**: Permitir elegir el método de planificación desde la UI, CLI y tool, manteniendo `"phases"` como default y `"epic"` como opción v2.

## Context

REASP ahora soporta dos metodologías de planificación:

1. **Phases (legacy)** — shards por dominio (`planning`, `architecture`, `implementation`, `verification`, `handoff`).
2. **Epic + PART (v2)** — EPICs y PARTs con priorización, handoff y workflow de packet.

El usuario requiere que el método por defecto sea **Phases**, con **Epic + PART** disponible como alternativa seleccionable desde `/reasp-setup`, `reasp_setup` y al inicio de cada sesión de planificación.

## PARTs

| # | PART | Status | Output |
|---|------|--------|--------|
| 1 | `08-01-config-state` | open | `reasp.config.json` + `rass-core.js` helpers |
| 2 | `08-02-tool-and-tui` | open | `plugin.js` + `tui.js` selector |
| 3 | `08-03-dual-prompt` | open | `ryou-efi-planner.md` dual-mode + docs |

## Acceptance Criteria

- [ ] `reasp.config.json` incluye `"planning_method": "phases"` por defecto.
- [ ] `getPlanningMethod()` devuelve `"phases"` si no está configurado (backward compatible).
- [ ] `setPlanningMethod(method)` valida `phases` o `epic` y persiste.
- [ ] `reasp_setup(action="status")` expone `planning_method`.
- [ ] `reasp_setup(action="set-planning-method", method="epic")` actualiza el método.
- [ ] `/reasp-setup` muestra opción "Switch Planning Method" con sub-selección.
- [ ] `ryou-efi-planner.md` detecta `planning_method` al inicio y ejecuta el workflow correspondiente.
- [ ] Documentación raíz y REFI explican ambos modos y cómo cambiarlos.

## Dependencies

- EPIC 01 (glossary/rules), EPIC 02 (EFI planner), EPIC 03 (config). No depende de EPICs de contenido del packet.

## Verification Gate

Antes de cerrar este EPIC se debe ejecutar:

```text
> /reasp-setup → Switch Planning Method → Epic + PART
> reasp_setup(action="status")
```

y confirmar que `planning_method` es `"epic"`, luego revertir a `"phases"` y confirmar.
