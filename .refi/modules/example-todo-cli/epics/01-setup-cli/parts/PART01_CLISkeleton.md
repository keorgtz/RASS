# PART01 — CLI Skeleton

> **EPIC:** 01-setup-cli · **Priority:** P0 · **Complexity:** M
> **Status:** PARTs detallados (pendiente de ejecución)

## 1. Purpose

Create the CLI entry point and subcommand dispatcher without any business logic.
After this PART, `node bin/todo.js <subcommand>` parses the input and routes to a
handler function (yet to be implemented in PART02).

## 2. Current State

N/A — greenfield (no prior CLI exists for `todo.js` in the repo).

## 3. Comparison against baseline

The baseline is the **Node.js stdlib `process.argv` parsing** pattern, well-known
since Node 0.x. We deliberately avoid `commander`, `yargs`, and `minimist` to keep
the example self-contained.

Concrete references in the repo:

- `package.json` — declares `node >=18` and `type: "module"` would NOT apply here
  (we use CommonJS for the example).
- Existing CLI conventions: `installer/index.js` uses `#!/usr/bin/env node` shebang
  and parses `process.argv` minimally. Reference file:
  `installer/index.js` lines ~1–40 (entry-point + arg parsing pattern).
- Node.js stdlib docs: `process.argv` is the canonical way to read CLI args without
  dependencies. Anchor: Node.js API docs (`docs/node-stdlib/process.html`).

## 4. Missing / Required Scope

- No `bin/todo.js` exists; create it.
- No subcommand router; create a `switch` on `process.argv[2]`.
- No help printer yet (handled in EPIC 02 PART01).

## 5. UX Problems

N/A — no UI yet.

## 6. Backend / Logic Problems

- `process.argv[0]` is `node`, `process.argv[1]` is the script path; subcommand
  lives at `process.argv[2]`. Confirmed pattern.
- Unknown subcommand should print a usage hint to stderr and exit with code 1.

## 7. Frontend / Presentation Problems

N/A.

## 8. Technical Debt

None — first version.

## 9. Required Improvements

1. Provide a `bin/todo.js` that runs on Node ≥ 18 without external deps.
2. Dispatch on `process.argv[2]`; pass `process.argv.slice(3)` to the handler.
3. Print `Usage: node todo.js <subcommand> [...args]` to stderr on unknown
   subcommand; exit code 1.

## 10. Implementation Plan

1. Create `bin/todo.js` (NEW) with shebang `#!/usr/bin/env node`.
2. Implement `main(argv)` that reads `argv[2]` and routes:
   - `"add"` → `require('./commands/add.js')(argv.slice(3))` (added in PART02).
   - `"list"` → `require('./commands/list.js')(argv.slice(3))` (added in PART02).
   - `"complete"` → `require('./commands/complete.js')(argv.slice(3))` (added in PART02).
   - `"done"` → alias of `complete` (added in PART02).
   - `"--help"` / `"-h"` / undefined → print general help; exit 0.
   - default → unknown subcommand error; exit 1.
3. Use `module.exports = { main }` so PART02 can unit-test the dispatcher.

## 11. Automated Test Plan

- **No new test framework.** A single shell test under `verification.md` PART03
  covers dispatch behaviour:
  - `node bin/todo.js` → exit 0, prints general help.
  - `node bin/todo.js bogus` → exit 1, prints usage to stderr.

## 12. Manual Validation Checklist

- [ ] `node bin/todo.js` exits 0 and prints a 4-line help block.
- [ ] `node bin/todo.js bogus` exits 1 and prints `Usage: …` to stderr.
- [ ] `node bin/todo.js --help` exits 0 with same content as no-arg.
- [ ] `node bin/todo.js add ...` reaches the `add` stub (after PART02).

## 13. Technical Documentation to produce

- Inline header comment in `bin/todo.js` (purpose + dispatch map).

## 14. User Documentation to produce

- None yet (deferred to EPIC 02).

## 15. Acceptance Criteria

- Running `node bin/todo.js` prints a help block and exits 0.
- Running `node bin/todo.js bogus` prints a usage hint to stderr and exits 1.
- The dispatcher is testable by `require('./bin/todo.js').main(argv)` returning
  an integer exit code.
- No external `npm install` is required to run the example.

---

## Gates Evidence

- Gate 1 (Architecture Review): aligned with `rules/global-rules.md` (stdlib only, no invented deps).
- Gate 2 (Scope & Completeness Audit): scope = dispatch + help; covered.
- Gate 3 (UX/Design Review): N/A — no UI.
- Gate 4 (Manual / Runtime Validation): checklist §12; runnable via `node bin/todo.js`.
- Gate 5 (Defect Closure): no defects; first version.
- Gate 6 (Technical Documentation): inline header comment in `bin/todo.js`.
- Gate 7 (User Documentation): N/A — deferred to EPIC 02.
- Gate 8 (Final Review & Sign-off): §15 acceptance criteria testable; no external deps.

**Signed by:** example-todo-cli · **Date:** 2026-07-09