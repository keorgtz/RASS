# REFI Global Rules (v2 · Epic + PART)

> Single source-of-truth for REFI process ordering. Companion file:
> `rules/epic-glossary.md` (terms), `rules/quality-gates.md` (8 gates),
> `rules/anti-hallucination.md` (anti-aliasing + section 3/15 rules).

## 1 · Five Core Directives

1. **Move immediately** — capture the request into `request.md` first.
2. **Plan 100 % before any code** — no PART is implemented before every EPIC in the
   packet has its PARTs detailed (see `rules/epic-glossary.md` §5). Exceptions
   limited to trivial tasks, hotfixes, and explicit `plan-then-execute` overrides.
3. **Keep scope explicit** — every PART has 15 mandatory sections including
   baseline comparison (§3) and testable acceptance criteria (§15).
4. **Gate-honest execution** — no PART is `Terminated` without all 8 gates signed
   (see `rules/quality-gates.md` v2).
5. **Verify before progressing** — Ryou Orchestrator advances PART-by-PART, never
   skipping gates.

## 2 · Mandatory Order (Three Passes)

### Pass 1 — Epic Breakdown

1. Preserve request → `request.md`.
2. Build master blueprint with EPIC breakdown → `master-blueprint.md`.
3. Build EPIC matrix + per-Epic READMEs (backlog only — PARTs not yet detailed) →
   `epics/matrix.md` + `epics/<NN-slug>/README.md`.
4. **STOP · WAIT FOR USER CONFIRMATION** before detailing PARTs.

### Pass 2 — PART Detail (per EPIC, on user demand)

5. For each planned PART of the chosen EPIC, write
   `epics/<NN-slug>/parts/PARTnn_<slug>.md` using the 15-section template
   (`templates/part-template.md`).
6. **STOP · WAIT FOR USER CONFIRMATION** between EPICs (if user asks EPIC-by-EPIC).
7. Repeat 5–6 until all EPICs of the packet have their PARTs detailed.

### Pass 3 — Orchestration & Hand-off

8. Write `orchestration-map.md` (EPIC order + per-Epic PART order + 8-gate cycle).
9. Write `progress.md` (planning-complete state) and `verification.md` (aggregated gates).
10. Hand off to Ryou Orchestrator with the literal handoff message defined in
    `.opencode/agents/ryou-efi-planner.md`.

## 3 · Forbidden Moves

- Implementing before Pass 2 is 100 % complete.
- Skipping gate N to reach gate N+1.
- Closing a PART whose Acceptance Criteria is not testable.
- Marking an EPIC `Terminado` while any of its PARTs is not `Terminated`.
- Auto-migrating a legacy `domain-shards/` packet without explicit user request
  (see `rules/epic-glossary.md` §1 "Shards (Legacy)" and EPIC 07 policy).

## 4 · Cross-References

- `rules/epic-glossary.md` — full glossary + Epic anatomy + PART template + 8 gates
  + Planning 100 % Rule.
- `rules/quality-gates.md` v2 — gate evidence requirements.
- `rules/anti-hallucination.md` v2 — section 3 anchor + section 15 testability rules.
