# PART01 — REFI Demo · Pattern Reference

> **EPIC:** 00-demo · **Priority:** P0 · **Complexity:** B · **Status:** Backlog (demo)
>
> This PART is a **demo only**; it is intentionally marked `Backlog` and is not
> executed. It exists to illustrate the 15-section template + 8-gate footer.

## 1. Purpose

Demonstrate the canonical 15-section structure of a REFI v2 PART and the 8-gate
footer. Provide a copyable reference for future EPICs and PARTs.

## 2. Current State

N/A — greenfield (this is a demo template, not a real implementation).

## 3. Comparison against baseline

The baseline is **`.opencode/refi/templates/part-template.md`** itself (the empty
template) and **`PlanificationTypes/EpicPlanification/Designer/PART01_StudioShell.md`**
(a real-world example with the same structure).

Concrete references:

- `templates/part-template.md` — sections 1–15 in order, gates footer placeholder.
- `rules/epic-glossary.md` §3 — canonical definition of the 15-section template.
- `PlanificationTypes/EpicPlanification/00_MASTER_PRODUCT_COMPLETION.md` §8 —
  original template from which REFI v2 derives.

## 4. Missing / Required Scope

This PART is complete by design. There is no missing scope.

## 5. UX Problems

N/A — no UI.

## 6. Backend / Logic Problems

N/A — no backend logic; this is documentation.

## 7. Frontend / Presentation Problems

N/A — no presentation layer.

## 8. Technical Debt

None. The template is the source of truth; this demo simply illustrates it.

## 9. Required Improvements

1. **No improvements required** — this PART is documentation-only and is already
   canonical.

## 10. Implementation Plan

1. **No implementation** — this PART is a reference. Future users copy this file
   and rename it (`PART02_<their-slug>.md`, etc.) when they start a real EPIC.

## 11. Automated Test Plan

- **No new tests required.** A linter can verify that any file under
  `epics/<epic>/parts/` has 15 sections + a footer with 8 gate entries. Such a
  linter is not part of this PART (it lives in EPIC 04 follow-ups if needed).

## 12. Manual Validation Checklist

- [ ] Read this PART end-to-end and confirm it covers all 15 sections.
- [ ] Confirm the footer lists 8 gates in order 1 → 8.
- [ ] Confirm section 3 cites at least one real artefact
      (`templates/part-template.md` or `PlanificationTypes/...`).
- [ ] Confirm section 15 contains testable bullets (each bullet can be verified
      via a static check).

## 13. Technical Documentation to produce

- None — this PART IS the documentation.

## 14. User Documentation to produce

- None — internal reference only.

## 15. Acceptance Criteria

- The 15 sections appear in order with non-empty content.
- Section 3 cites at least one real artefact.
- Section 15 lists 4 manual checks that an external reader can perform.
- The footer contains exactly 8 numbered gate placeholders + a `Signed by / Date` line.
- Copying this file to `epics/<epic>/parts/PART01_<slug>.md` produces a valid PART
  scaffold (verified by reading the copy end-to-end).

---

## Gates Evidence

- Gate 1 (Architecture Review): N/A — documentation-only; aligned with `rules/global-rules.md` Three Passes.
- Gate 2 (Scope & Completeness Audit): N/A — no scope to audit; this PART is the template.
- Gate 3 (UX/Design Review): N/A — no UI.
- Gate 4 (Manual / Runtime Validation): manual checklist in §12 validated by reading this file end-to-end.
- Gate 5 (Defect Closure): no defects; first version.
- Gate 6 (Technical Documentation): N/A — this file IS the documentation.
- Gate 7 (User Documentation): N/A — internal reference.
- Gate 8 (Final Review & Sign-off): 15 sections present + footer complete + §15 testable.

**Signed by:** REFI Demo · **Date:** 2026-07-09