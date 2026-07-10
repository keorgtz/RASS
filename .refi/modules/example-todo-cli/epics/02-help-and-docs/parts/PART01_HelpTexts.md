# PART01 — Help Texts

> **EPIC:** 02-help-and-docs · **Priority:** P1 · **Complexity:** M
> **Status:** PARTs detallados (pendiente de ejecución)

## 1. Purpose

Provide a `--help` text for every subcommand and a general help block for the
top-level CLI. Centralise the strings in `lib/help.js`.

## 2. Current State

CLI from EPIC 01 dispatches subcommands but has no help texts.

## 3. Comparison against baseline

Baseline is the **`--help` convention** documented by POSIX (`man 1 conventions`)
and reinforced by Node.js core CLIs (`node --help`).

Real-world reference outputs in the repo:

- `installer/index.js` — has its own `printHelp()` function (style reference for
  layout, not content).
- `node --help` — multi-section help output with `Usage:`, `Options:`, sections.

## 4. Missing / Required Scope

- No `lib/help.js`; create it.
- No per-command `--help`; wire `bin/todo.js` dispatcher to call help when first
  arg starts with `--help` or `-h`.

## 5. UX Problems

- Help must fit in a 80-column terminal without line wrap (use simple text).
- Each command's `--help` must list args and at least one example.

## 6. Backend / Logic Problems

- Unknown `--help` command (e.g., `node bin/todo.js bogus --help`) prints general
  help, not command-specific.

## 7. Frontend / Presentation Problems

N/A.

## 8. Technical Debt

None.

## 9. Required Improvements

1. `lib/help.js` exports `general()` and `forCommand(name)`.
2. `bin/todo.js` routes `--help`/`-h` after the subcommand name to
   `forCommand(name)`.
3. Default top-level `--help` prints `general()`.

## 10. Implementation Plan

1. Create `lib/help.js` (NEW) with two functions:
   - `general()` — 6-line block: usage, subcommand list, exit codes note.
   - `forCommand(name)` — switch on `name`, returns a multi-line block with
     `Usage:`, `Arguments:`, `Examples:`.
2. Update `bin/todo.js` to import `help` and route `--help`/`-h` accordingly.

## 11. Automated Test Plan

- No automated test framework. Manual validation in EPIC 02 PART03.

## 12. Manual Validation Checklist

- [ ] `node bin/todo.js --help` prints `general()` content.
- [ ] `node bin/todo.js add --help` prints `forCommand('add')` content.
- [ ] `node bin/todo.js bogus --help` prints `general()` (fallback).
- [ ] `node bin/todo.js -h` prints `general()`.
- [ ] Each help block fits in 80 columns.
- [ ] Each help block has at least one `Examples:` line.

## 13. Technical Documentation to produce

- Inline JSDoc in `lib/help.js`.

## 14. User Documentation to produce

- This PART IS the user-facing `--help` source.

## 15. Acceptance Criteria

- All 4 subcommands (`add`, `list`, `complete`, `readme`) have a `--help` text.
- The top-level `--help` lists all 4 subcommands.
- Help texts are ≤ 12 lines each.
- Unknown command + `--help` falls back to general help (does NOT crash).

---

## Gates Evidence

- Gate 1 (Architecture Review): aligned with POSIX `--help` conventions.
- Gate 2 (Scope & Completeness Audit): scope = help for 4 commands + general; covered.
- Gate 3 (UX/Design Review): text-only, 80-col friendly.
- Gate 4 (Manual / Runtime Validation): §12 covers 6 cases.
- Gate 5 (Defect Closure): no defects; first version.
- Gate 6 (Technical Documentation): JSDoc.
- Gate 7 (User Documentation): this PART.
- Gate 8 (Final Review & Sign-off): §15 testable.

**Signed by:** example-todo-cli · **Date:** 2026-07-09