# PART 08-03 — Dual-Mode Planner Prompt

> **EPIC**: `08-planning-method-selector`
> **Status**: `open`
> **Goal**: Make `ryou-efi-planner.md` dual-mode: defaults to Phases, supports Epic+PART.

## 1. Files to Change

- `.opencode/agents/ryou-efi-planner.md`
- `.opencode/refi/README.md`
- `README.md` (project root)
- `AI/Summarys/summary-2026-07-09.html`

## 2. ryou-efi-planner.md

Rewrite the prompt with this structure:

```markdown
# Ryou EFI Planner

You are the planning agent inside REASP.

## 0. Startup Rule (MANDATORY)

At the very start of every planning session, call `reasp_setup(action="status")` and read `planning_method`. If missing/unknown, default to `"phases"`. Then follow ONLY the corresponding section below.

## 1. Phases Mode (default)

[Original phase-based domain-shard workflow.]

## 2. Epic + PART Mode (v2)

[Epic+PART workflow already defined.]
```

Keep the same overall tone and constraints, but branch based on `planning_method`.

## 3. .opencode/refi/README.md

Add a short "Planning Method Selector" section explaining:

- Default is `phases`.
- Use `/reasp-setup` or `reasp_setup(action="set-planning-method", method="epic")` to switch.
- `ryou-efi-planner.md` detects the mode at startup.

## 4. README.md (root)

Update the Quick Start / Features bullets to mention dual planning methods and the selector.

## 5. Daily Summary

Append EPIC 08 completion summary to today's summary HTML.

## 6. Verification

- Inspect `ryou-efi-planner.md`: both sections present, startup rule at top.
- Ask planner agent: "Plan feature X" → it must call `reasp_setup` first and behave according to configured mode.
