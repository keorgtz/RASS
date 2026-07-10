# PART02 — Commands: add / list / complete

> **EPIC:** 01-setup-cli · **Priority:** P0 · **Complexity:** M
> **Status:** PARTs detallados (pendiente de ejecución)

## 1. Purpose

Implement the three core subcommands: `add`, `list`, `complete`, plus the `done`
alias. Each is a small module under `bin/commands/` that receives parsed args and
returns an exit code.

## 2. Current State

Skeleton from PART01 exists. No command implementations yet.

## 3. Comparison against baseline

Baseline is the **classic UNIX-style CLI contract** (see `man 1 conventions`):
subcommand, args, exit code, stdout vs stderr. Real-world precedents:

- `git add`, `git commit`, `git status` — multi-verb CLIs with consistent exit codes.
- `npm install`, `npm run` — subcommands with `--help` and aliases (we add `done`
  as an alias of `complete`, mirroring `git` behaviour).
- Node.js stdlib: `fs.writeFileSync`, `fs.readFileSync` for the persistence layer
  (covered in PART03).

Repo references:

- `bin/todo.js` (created in PART01) — dispatcher and `argv` parsing.

## 4. Missing / Required Scope

- No `bin/commands/` folder; create it.
- No command modules; create `add.js`, `list.js`, `complete.js`.
- No `done` alias; route to `complete`.

## 5. UX Problems

- `add` without args should print a usage hint and exit 1.
- `complete <id>` with non-numeric id should print error and exit 1.
- `list` should print a numbered table even when empty.

## 6. Backend / Logic Problems

- `complete` writes to `todos.json` (delegated to PART03's `lib/store.js`).
- `add` and `complete` need a stable id strategy: monotonic counter stored in
  `todos.json` (e.g., `state.nextId`).

## 7. Frontend / Presentation Problems

N/A — CLI text output only.

## 8. Technical Debt

None.

## 9. Required Improvements

1. Create `bin/commands/add.js` that takes a single positional `<text>` and appends
   to the store.
2. Create `bin/commands/list.js` that prints `ID  STATUS  TEXT` table; empty table
   prints `(empty list)`.
3. Create `bin/commands/complete.js` that takes `<id>`, flips status to `done`.
4. Wire `done` as an alias of `complete` in `bin/todo.js`.

## 10. Implementation Plan

1. `bin/commands/add.js` — signature `module.exports = function add(args) { … }`.
   - Validates `args.length === 1`.
   - Reads store via `lib/store.js` (PART03); appends `{id, text, status: 'open'}`.
   - Writes via `lib/store.js`; prints `Added #<id>` to stdout; returns 0.
2. `bin/commands/list.js` — reads store, prints aligned columns:
   `<id>\t<status>\t<text>`. Returns 0.
3. `bin/commands/complete.js` — parses `<id>` as integer; flips status; writes;
   prints `Completed #<id>`; returns 0 on success, 1 on invalid id.
4. Update `bin/todo.js` dispatcher to map `"done"` → `complete.js`.

## 11. Automated Test Plan

- No automated test framework. Manual validation in EPIC 02 PART03.

## 12. Manual Validation Checklist

- [ ] `node bin/todo.js add "x"` → prints `Added #1`, exits 0.
- [ ] `node bin/todo.js add` → prints usage to stderr, exits 1.
- [ ] `node bin/todo.js list` → prints `1  open  x`.
- [ ] `node bin/todo.js complete 1` → prints `Completed #1`, exits 0.
- [ ] `node bin/todo.js done 1` → same as `complete 1`.
- [ ] `node bin/todo.js complete abc` → prints `Invalid id`, exits 1.

## 13. Technical Documentation to produce

- Inline JSDoc for each command module.

## 14. User Documentation to produce

- Deferred to EPIC 02 PART01 (`--help` texts).

## 15. Acceptance Criteria

- `add` accepts exactly one argument; rejects 0 or 2+ with exit 1.
- `list` prints at least `ID`, `STATUS`, `TEXT` columns in that order.
- `complete` accepts a numeric id and updates the store; exits 1 on non-numeric.
- `done` is a functional alias of `complete`.
- After `add` + `list`, the table reflects the new row with the next id.

---

## Gates Evidence

- Gate 1 (Architecture Review): aligned with Node.js stdlib patterns; `process.exit` only for errors.
- Gate 2 (Scope & Completeness Audit): scope = 3 commands + 1 alias; covered.
- Gate 3 (UX/Design Review): N/A — no UI.
- Gate 4 (Manual / Runtime Validation): §12 covers 6 cases; runnable end-to-end after PART03.
- Gate 5 (Defect Closure): no defects; first version.
- Gate 6 (Technical Documentation): JSDoc per command module.
- Gate 7 (User Documentation): N/A — deferred to EPIC 02.
- Gate 8 (Final Review & Sign-off): §15 testable bullets; CLI runs without external deps.

**Signed by:** example-todo-cli · **Date:** 2026-07-09