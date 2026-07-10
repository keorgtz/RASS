# PART03 — Manual Smoke Checklist

> **EPIC:** 02-help-and-docs · **Priority:** P1 · **Complexity:** M
> **Status:** PARTs detallados (pendiente de ejecución)

## 1. Purpose

Provide an end-to-end manual smoke test that exercises every CLI command from a
clean directory and confirms persistence + help behaviour in one sitting.

## 2. Current State

EPIC 01 and EPIC 02 PARTs exist. This PART is the gate that closes them all.

## 3. Comparison against baseline

Baseline is the **smoke-test convention** used in CI for tiny CLIs: run a sequence
of commands and assert expected outputs. We use shell `&&` chains.

Repo references:

- `installer/README.md` "Quick examples" section — same pattern (`npm install -g .`
  followed by `reasp --help`).
- Node.js docs on `node:fs` — to understand the atomic-write behaviour observed.

## 4. Missing / Required Scope

- The smoke test sequence is captured here as §15.
- A one-liner `bin/todo.js` run chain documented for new users.

## 5. UX Problems

- Sequence must be runnable in any order of fresh terminals (no global state).
- Each step's expected output is captured in §15.

## 6. Backend / Logic Problems

- Each step is independent; no shared mutable state outside `todos.json`.
- After completing all steps, the directory contains `todos.json` and
  `todos.json.bak`.

## 7. Frontend / Presentation Problems

N/A.

## 8. Technical Debt

None.

## 9. Required Improvements

1. Provide an 8-step smoke sequence in §15 that new users can copy-paste.
2. Each step lists the command, the expected output, and the expected exit code.

## 10. Implementation Plan

1. No new code. This PART is purely a checklist + acceptance criteria.
2. Document the smoke sequence in §12 and §15.

## 11. Automated Test Plan

- A future CI step could run §15 as a shell script. Not in scope here.

## 12. Manual Validation Checklist

Run from a fresh, empty directory. Each step is one terminal command.

- [ ] `node /abs/path/to/bin/todo.js --help` — exits 0; prints general help.
- [ ] `node … add "Buy milk"` — exits 0; prints `Added #1`.
- [ ] `node … add "Read REFI v2 spec"` — exits 0; prints `Added #2`.
- [ ] `node … list` — exits 0; prints two open rows.
- [ ] `node … complete 1` — exits 0; prints `Completed #1`.
- [ ] `node … done 2` — exits 0; prints `Completed #2` (alias).
- [ ] `node … readme` — exits 0; prints Markdown with both items as `done`.
- [ ] `node … add --help` — exits 0; prints `add` help.

## 13. Technical Documentation to produce

- Inline `## Smoke Test` block in `bin/todo.js` header comment.

## 14. User Documentation to produce

- This PART IS the user-facing smoke checklist.

## 15. Acceptance Criteria

- All 8 steps in §12 succeed in order, from a fresh directory.
- After step 7, `todos.json` has `{ nextId: 3, items: [{id:1, status:'done', …},
  {id:2, status:'done', …}] }`.
- `todos.json.bak` exists and is valid JSON.
- No step requires an `npm install`.

---

## Gates Evidence

- Gate 1 (Architecture Review): aligned with `installer/README.md` "Quick examples" pattern.
- Gate 2 (Scope & Completeness Audit): scope = smoke checklist; covered.
- Gate 3 (UX/Design Review): clear sequence + expected outputs; copy-pasteable.
- Gate 4 (Manual / Runtime Validation): §12 covers 8 steps end-to-end.
- Gate 5 (Defect Closure): no defects; first version.
- Gate 6 (Technical Documentation): inline header comment.
- Gate 7 (User Documentation): this PART.
- Gate 8 (Final Review & Sign-off): §15 testable bullets.

**Signed by:** example-todo-cli · **Date:** 2026-07-09