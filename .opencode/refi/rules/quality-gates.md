# REFI Quality Gates (v2 · 8 Gates per PART)

> Replaces REFI v1 quality gates (5 generic bullets). Each PART must traverse ALL 8
> gates, in strict order, with concrete evidence recorded in its footer before
> sign-off. See `rules/epic-glossary.md` §4 for the canonical definitions; this file
> focuses on the evidence contract that gates must satisfy.

## Gate Order Is Strict

```
1·Architecture Review  →  2·Scope Audit  →  3·UX Review  →  4·Manual Validation
   ↓
5·Defect Closure  →  6·Tech Docs  →  7·User Docs  →  8·Final Sign-off
```

Skipping gate N blocks the sign-off at gate N+1. A PART cannot be `Terminated`
without all 8 footer entries holding evidence AND the `Signed by / Date` line filled.

## The 8 Gates · Evidence Contract

### Gate 1 · Architecture Review

**Objective:** Confirm the design fits project invariants and ADRs (when they exist).

**Evidence:**
- Notes contrasting the design with `.opencode/rules/global-rules.md` (Clean
  Architecture separation, async/await propagation, EF rules, etc.).
- IDs of any relevant ADRs (e.g. `docs/adr/0007-offline-first-sync.md`).
- If no ADR is relevant, record `N/A — no ADR applies; reviewed against global rules`.

### Gate 2 · Scope & Completeness Audit

**Objective:** Verify every declared deliverable actually exists.

**Evidence:**
- A `declared vs actual` table inside the PART footer (or linked artefact).
- Every gap classified as either `accepted` (intentional, justified) or `filled`
  (resolved by this PART).
- No gaps left in `unknown` state.

### Gate 3 · UX/Design Review

**Objective:** Confirm UI matches MeridianUI commercial standards OR non-UI surface
has consistent contracts.

**Evidence (if UI):**
- Screenshots committed under `docs/screenshots/<part-slug>/` (one per state:
  loading, empty, error, success, disabled, selected).
- Diffs of MeridianUI tokens used (color, radius, motion ≤ 200 ms).
- Reference to any custom controls re-used (no ad-hoc styling).

**Evidence (if not UI):**
- Contract or message diff for APIs/CLIs.
- Naming consistency check (es-MX where applicable).

### Gate 4 · Manual / Runtime Validation

**Objective:** Exercise the PART in real hosts and capture behavioural evidence.

**Evidence:**
- Section 12 (`Manual Validation Checklist`) executed end-to-end.
- Tickboxes (✅) per item with a 1-line evidence reference (path to log, screenshot,
  or test output).
- If a checklist item is impossible to execute in the current environment, mark it
  `⊘ skipped with justification` and re-target it for the next PART.

### Gate 5 · Defect Closure

**Objective:** Ensure every defect from gates 1–4 is fixed in this same PART.

**Evidence:**
- Link to issues, PRs, or inline notes resolving each defect.
- A `Defects Fixed` section in the footer (or linked commit list).
- Zero defects left open against this PART.

### Gate 6 · Technical Documentation

**Objective:** Produce the technical documentation the PART declared in section 13.

**Evidence:**
- Links or diffs to docs produced (e.g. `docs/architecture/<topic>.md`).
- If section 13 was `none`, evidence is a single line: `Tech docs: N/A — section 13 = none`.

### Gate 7 · User Documentation

**Objective:** Produce the user-facing documentation the PART declared in section 14.

**Evidence:**
- Links or diffs to user docs (e.g. `docs/user/<topic>.md`, in-app help text).
- If section 14 was `none`, evidence is a single line: `User docs: N/A — section 14 = none`.

### Gate 8 · Final Review & Sign-off

**Objective:** Final, holistic verification before declaring the PART `Terminated`.

**Evidence:**
- Build result: `Build: 0 errors / 0 warnings` (or equivalent).
- Test result: `Suite: <N> green / 0 red`.
- Acceptance Criteria (section 15) re-read and ticked.
- Footer signed: `**Signed by:** <name>  **Date:** <YYYY-MM-DD>`.

## Gate Footer Template

Every PART MUST end with this footer (per `templates/part-template.md`):

```md
---

## Gates Evidence

- Gate 1 (Architecture Review): <link or path or N/A justification>
- Gate 2 (Scope & Completeness Audit): <link or path>
- Gate 3 (UX/Design Review): <link or path or N/A — no UI>
- Gate 4 (Manual / Runtime Validation): <link or path>
- Gate 5 (Defect Closure): <link or path>
- Gate 6 (Technical Documentation): <link or path or N/A — section 13 = none>
- Gate 7 (User Documentation): <link or path or N/A — section 14 = none>
- Gate 8 (Final Review & Sign-off): build 0/0 + suite green + acceptance ticked

**Signed by:** _______________  **Date:** _______________
```

## Anti-Patterns (gates as decoration)

These are explicit failure modes:

- ❌ Gate signed without a real artefact (just a checkmark or "ok").
- ❌ Gate evidence pointing to a "TODO" or a placeholder file.
- ❌ Gates 6 / 7 claiming "N/A" when section 13 / 14 of the PART declared a deliverable.
- ❌ Gate 8 signing before gates 1–7 have evidence.
- ❌ Auto-signing via tool without human review (must be human).

Ryou Orchestrator must REJECT any PART whose footer fails the evidence contract.