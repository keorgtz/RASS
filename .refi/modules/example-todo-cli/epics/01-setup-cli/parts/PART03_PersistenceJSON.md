# PART03 — Persistence JSON

> **EPIC:** 01-setup-cli · **Priority:** P0 · **Complexity:** M
> **Status:** PARTs detallados (pendiente de ejecución)

## 1. Purpose

Implement the persistence layer for the todo CLI: read/write `todos.json` with
atomic writes (write-temp-then-rename) and a 1-deep backup on every save.

## 2. Current State

PART01 created `bin/todo.js`. PART02 will reference `lib/store.js`. Neither exists yet.

## 3. Comparison against baseline

Baseline is the **atomic-write pattern** documented in Node.js `fs` API:

- `fs.writeFileSync(path, data)` overwrites directly — risky on crash.
- Recommended pattern: write to `path + '.tmp'`, then `fs.renameSync(tmp, path)`.
- Backup: keep `path + '.bak'` from the previous successful write.

Repo references:

- `installer/lib/constants.js` — example of `path.join` usage and config constants
  (style precedent).
- `installer/index.js` — precedent for safe file writes inside REASP.

## 4. Missing / Required Scope

- No `lib/` folder; create it.
- No `lib/store.js`; create it with `load()`, `save(state)`, `mutate(fn)`.

## 5. UX Problems

N/A — no UI.

## 6. Backend / Logic Problems

- Default state when `todos.json` does not exist: `{ nextId: 1, items: [] }`.
- Concurrent writers are not a concern (single-process CLI).
- File permissions: default `0o644` on Unix; not configurable.

## 7. Frontend / Presentation Problems

N/A.

## 8. Technical Debt

None — first version.

## 9. Required Improvements

1. `lib/store.js` exports `load()` returning a state object (default if missing).
2. `save(state)` writes atomically: backup current → write `.tmp` → rename.
3. `mutate(fn)` reads, applies `fn(state)`, writes; returns the new state.

## 10. Implementation Plan

1. Create `lib/store.js` (NEW):
   - `const FILE = path.join(process.cwd(), 'todos.json')`.
   - `load()`: try read JSON; on `ENOENT` return default; on parse error return
     default + log to stderr.
   - `save(state)`: stringify with 2-space indent; write `todos.json.tmp`;
     `fs.renameSync` over `todos.json`; copy previous `todos.json` to
     `todos.json.bak` (best-effort; ignore errors on first save).
2. Export `{ load, save, mutate, FILE }`.
3. Commands from PART02 consume `mutate`.

## 11. Automated Test Plan

- **No automated test framework.** Manual validation in EPIC 02 PART03:
  - Add an item, inspect `todos.json` directly (valid JSON, has `nextId: 2`).
  - Add a second item, inspect `todos.json.bak` (contains previous state).

## 12. Manual Validation Checklist

- [ ] Before any `add`, `todos.json` does NOT exist.
- [ ] After `add "x"`, `todos.json` exists and is valid JSON with `nextId: 2`.
- [ ] After a second `add`, `todos.json.bak` contains the prior state.
- [ ] `node -e "require('./lib/store.js').load()"` prints `{ nextId: 1, items: [] }`
      in a fresh dir.
- [ ] Killing the process mid-write (simulate by deleting `todos.json.tmp`) leaves
      `todos.json` intact.

## 13. Technical Documentation to produce

- JSDoc on `load`, `save`, `mutate` (input/output contracts).

## 14. User Documentation to produce

- None.

## 15. Acceptance Criteria

- `todos.json` is valid JSON after every successful command.
- `todos.json.bak` is best-effort and never required for correctness.
- A crash mid-write leaves either the old or the new content, never a partial file.
- `load()` returns a state object with `nextId` (number) and `items` (array).

---

## Gates Evidence

- Gate 1 (Architecture Review): atomic write pattern from Node.js fs API; no invented abstractions.
- Gate 2 (Scope & Completeness Audit): scope = load/save/mutate; covered.
- Gate 3 (UX/Design Review): N/A — no UI.
- Gate 4 (Manual / Runtime Validation): §12 covers 5 cases; runnable from a clean dir.
- Gate 5 (Defect Closure): no defects; first version.
- Gate 6 (Technical Documentation): JSDoc on `lib/store.js`.
- Gate 7 (User Documentation): N/A.
- Gate 8 (Final Review & Sign-off): §15 testable bullets; CLI runs without external deps.

**Signed by:** example-todo-cli · **Date:** 2026-07-09