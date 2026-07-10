# PART02 — `readme` Generator

> **EPIC:** 02-help-and-docs · **Priority:** P1 · **Complexity:** M
> **Status:** PARTs detallados (pendiente de ejecución)

## 1. Purpose

Implement the `readme` subcommand: prints a Markdown rendering of the current todo
list to stdout. Useful for pasting into a project README or commit message.

## 2. Current State

EPIC 01 commands exist. `readme` does not.

## 3. Comparison against baseline

Baseline is the **Markdown table format** specified by GitHub Flavored Markdown
(GFM) — pipe-delimited rows with header separator. Stdlib only; no library.

Repo references:

- `PlanificationTypes/EpicPlanification/Designer/PART01_StudioShell.md` — uses
  pipe-tables inside its Acceptance Criteria section. Same pattern.
- `installer/README.md` — uses pipe-tables for command examples.

## 4. Missing / Required Scope

- No `lib/readme.js`; create it.
- No `bin/commands/readme.js`; create it.
- No dispatcher route for `readme`; wire in `bin/todo.js`.

## 5. UX Problems

- Empty list should produce a header + `(empty)`, not a malformed table.
- Truncate text > 80 chars with `…` to keep tables readable.

## 6. Backend / Logic Problems

- Read store via `lib/store.js` (PART03 of EPIC 01); no write.
- Output to stdout; no errors expected.

## 7. Frontend / Presentation Problems

N/A — text output.

## 8. Technical Debt

None.

## 9. Required Improvements

1. `lib/readme.js` exports `render(state)` returning a Markdown string.
2. `bin/commands/readme.js` calls `render(load())` and prints it.
3. Wire `"readme"` in `bin/todo.js` dispatcher.

## 10. Implementation Plan

1. Create `lib/readme.js` (NEW):
   - Header: `# My TODOs\n\nGenerated on <ISO date>.\n`.
   - Table header: `| ID | Status | Text |`.
   - Separator: `| --- | --- | --- |`.
   - Rows: one per item; truncate text to 80 chars.
   - Empty case: `| (empty) |  |  |`.
2. Create `bin/commands/readme.js` (NEW) calling `render(load())` and printing.
3. Wire dispatcher.

## 11. Automated Test Plan

- No automated test framework. Manual validation in EPIC 02 PART03.

## 12. Manual Validation Checklist

- [ ] With 0 items, `readme` prints header + `(empty)` row.
- [ ] With 3 items, `readme` prints 3 data rows in id order.
- [ ] With a 200-char text, the row truncates with `…` and stays in one line.
- [ ] Output starts with `# My TODOs`.
- [ ] Pasting the output into a Markdown preview renders a valid table.

## 13. Technical Documentation to produce

- JSDoc on `render`.

## 14. User Documentation to produce

- This PART IS the user-facing documentation generator.

## 15. Acceptance Criteria

- Output is valid GFM (header + table).
- Output ends with a trailing newline.
- Empty state is explicit, not blank.
- No external Markdown library is used.

---

## Gates Evidence

- Gate 1 (Architecture Review): GFM table format; stdlib only.
- Gate 2 (Scope & Completeness Audit): scope = readme render + dispatch; covered.
- Gate 3 (UX/Design Review): GFM rendered; truncation keeps width manageable.
- Gate 4 (Manual / Runtime Validation): §12 covers 5 cases.
- Gate 5 (Defect Closure): no defects; first version.
- Gate 6 (Technical Documentation): JSDoc.
- Gate 7 (User Documentation): this PART.
- Gate 8 (Final Review & Sign-off): §15 testable.

**Signed by:** example-todo-cli · **Date:** 2026-07-09