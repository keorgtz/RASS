# Verification · example-todo-cli

> Strategy: the 8-gate cycle applies per PART. Each PART's footer is the canonical
> record; this file mirrors those footers in one readable page.

## EPIC 01 — Setup CLI

### PART01 — CLI Skeleton

- Gate 1 (Architecture Review): aligned with `rules/global-rules.md` (stdlib only, no invented deps).
- Gate 2 (Scope & Completeness Audit): scope = dispatch + help; covered.
- Gate 3 (UX/Design Review): N/A — no UI.
- Gate 4 (Manual / Runtime Validation): checklist §12; runnable via `node bin/todo.js`.
- Gate 5 (Defect Closure): no defects; first version.
- Gate 6 (Technical Documentation): inline header comment in `bin/todo.js`.
- Gate 7 (User Documentation): N/A — deferred to EPIC 02.
- Gate 8 (Final Review & Sign-off): §15 acceptance criteria testable; no external deps.

**Signed by:** example-todo-cli · **Date:** 2026-07-09

### PART02 — Commands: add / list / complete

- Gate 1 (Architecture Review): aligned with Node.js stdlib patterns; `process.exit` only for errors.
- Gate 2 (Scope & Completeness Audit): scope = 3 commands + 1 alias; covered.
- Gate 3 (UX/Design Review): N/A — no UI.
- Gate 4 (Manual / Runtime Validation): §12 covers 6 cases; runnable end-to-end after PART03.
- Gate 5 (Defect Closure): no defects; first version.
- Gate 6 (Technical Documentation): JSDoc per command module.
- Gate 7 (User Documentation): N/A — deferred to EPIC 02.
- Gate 8 (Final Review & Sign-off): §15 testable bullets; CLI runs without external deps.

**Signed by:** example-todo-cli · **Date:** 2026-07-09

### PART03 — Persistence JSON

- Gate 1 (Architecture Review): atomic write pattern from Node.js fs API; no invented abstractions.
- Gate 2 (Scope & Completeness Audit): scope = load/save/mutate; covered.
- Gate 3 (UX/Design Review): N/A — no UI.
- Gate 4 (Manual / Runtime Validation): §12 covers 5 cases; runnable from a clean dir.
- Gate 5 (Defect Closure): no defects; first version.
- Gate 6 (Technical Documentation): JSDoc on `lib/store.js`.
- Gate 7 (User Documentation): N/A.
- Gate 8 (Final Review & Sign-off): §15 testable bullets; CLI runs without external deps.

**Signed by:** example-todo-cli · **Date:** 2026-07-09

## EPIC 02 — Help & Docs

### PART01 — Help Texts

- Gate 1 (Architecture Review): aligned with POSIX `--help` conventions.
- Gate 2 (Scope & Completeness Audit): scope = help for 4 commands + general; covered.
- Gate 3 (UX/Design Review): text-only, 80-col friendly.
- Gate 4 (Manual / Runtime Validation): §12 covers 6 cases.
- Gate 5 (Defect Closure): no defects; first version.
- Gate 6 (Technical Documentation): JSDoc.
- Gate 7 (User Documentation): this PART.
- Gate 8 (Final Review & Sign-off): §15 testable.

**Signed by:** example-todo-cli · **Date:** 2026-07-09

### PART02 — `readme` Generator

- Gate 1 (Architecture Review): GFM table format; stdlib only.
- Gate 2 (Scope & Completeness Audit): scope = readme render + dispatch; covered.
- Gate 3 (UX/Design Review): GFM rendered; truncation keeps width manageable.
- Gate 4 (Manual / Runtime Validation): §12 covers 5 cases.
- Gate 5 (Defect Closure): no defects; first version.
- Gate 6 (Technical Documentation): JSDoc.
- Gate 7 (User Documentation): this PART.
- Gate 8 (Final Review & Sign-off): §15 testable.

**Signed by:** example-todo-cli · **Date:** 2026-07-09

### PART03 — Manual Smoke Checklist

- Gate 1 (Architecture Review): aligned with `installer/README.md` "Quick examples" pattern.
- Gate 2 (Scope & Completeness Audit): scope = smoke checklist; covered.
- Gate 3 (UX/Design Review): clear sequence + expected outputs; copy-pasteable.
- Gate 4 (Manual / Runtime Validation): §12 covers 8 steps end-to-end.
- Gate 5 (Defect Closure): no defects; first version.
- Gate 6 (Technical Documentation): inline header comment.
- Gate 7 (User Documentation): this PART.
- Gate 8 (Final Review & Sign-off): §15 testable bullets.

**Signed by:** example-todo-cli · **Date:** 2026-07-09

## Aggregated Gates (packet level)

- **EPICs planned:** 2
- **PARTs planned:** 6
- **Total gates expected at packet completion:** `8 × 6 = 48`
- **Gates passed so far:** 48 of 48 (planning-complete; PARTs detail-level signed)
- **PARTs `Terminado`:** 0 of 6 (planning-complete only; execution not started)
- **EPICs `Terminado`:** 0 of 2
- **Last update:** 2026-07-09
- **Status:** `planning-complete`

## Packet-Level Gates (beyond per-PART)

### Gate A · Packet Contract Compliance

- [x] `request.md` exists and matches original user text.
- [x] `master-blueprint.md` includes the EPIC breakdown.
- [x] `epics/matrix.md` exists with 2 EPICs and 4 valid states per row.
- [x] Each EPIC has `epics/<epic>/README.md` with 9 sections.
- [x] Each PART has 15 sections + footer of 8 gates.
- [ ] Orchestrator fills footers during execution with real evidence.

### Gate B · Dual-Format Acceptance (Back-compat)

- [x] This packet follows the v2 (Epic + PART) format.
- [ ] All 4 legacy packets still parse after `epic_part.legacy_domain_shards_fallback: true`.

### Gate C · Worked-Example Validity

- [x] Worked-example packet (this file) demonstrates the full structure.
- [ ] Smoke test runs `node bin/todo.js --help` and matches §15 criteria (after execution).

### Gate D · Anti-Hallucination Cross-Reference

- [x] Every PART §3 references a real artefact from the repo
      (`installer/index.js`, `package.json`, `PlanificationTypes/...`)
      OR marks `N/A — greenfield` with justification.

## Final Sign-Off (packet)

- [x] Gate A passed (planning)
- [ ] Gate B passed (after EPIC 03 PART04 execution — applies to global REFI config)
- [ ] Gate C passed (after EPIC 06 execution)
- [x] Gate D passed (planning)

**Signed by:** example-todo-cli · **Date:** 2026-07-09