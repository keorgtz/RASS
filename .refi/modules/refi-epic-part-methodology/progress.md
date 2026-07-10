# Progress · REFI — Upgrade to Epic + PART Methodology

> This packet is its own first consumer of the new methodology. All 8 EPICs and their
> 30 PARTs have been detailed **before** any code is written. The state below mirrors
> `epics/matrix.md` and is updated as Ryou Orchestrator closes gates.

## Initial State

- REFI v1 plans enterprise work in `domain-shards/01-*.md` (7-section shards, 5 quality
  gates).
- Ryou EFI Planner prompts the user, then jumps to implementation.
- Demo EpicPlanification (`PlanificationTypes/EpicPlanification/`) shows a 26-Epic,
  PART-based workflow with 8 gates that has eliminated mid-flight replanning.

## Completed

- [x] Create REFI packet: `.refi/modules/refi-epic-part-methodology/`
- [x] Write `request.md` (captured source request verbatim).
- [x] Write `master-blueprint.md` with EPIC breakdown + new contract + risks.
- [x] Write `epics/matrix.md` with all 7 EPICs.
- [x] Write 8 EPIC READMEs (one per EPIC).
- [x] Write 30 PARTs (5 + 4 + 4 + 4 + 3 + 4 + 3 + 3).
- [x] Write `orchestration-map.md` with execution order, dependency arrows,
      per-EPIC PART order, and handoff text.
- [x] Write this `progress.md` and `verification.md`.

## Pending (execution phase · owned by Ryou Orchestrator)

- [x] **EPIC 01 — Conventions & Terminology** ✅ IMPLEMENTED 2026-07-09
  - [x] PART01 → `rules/epic-glossary.md` created
  - [x] PART02-04 → sections 2-4 of the glossary
  - [x] PART05 → `rules/global-rules.md` rewritten (v2, Three Passes)
- [x] **EPIC 05 — 8-Gate Verification System** ✅ IMPLEMENTED 2026-07-09
  - [x] PART01 → `rules/quality-gates.md` v2 (table of 8 gates with evidence)
  - [x] PART02 → `rules/anti-hallucination.md` v2 (clauses §3 / §9 / §10 / §15)
  - [x] PART03 → `modules/_template/verification.md` rewritten
- [x] **EPIC 02 — Ryou EFI Planner Agent Prompt** ✅ IMPLEMENTED 2026-07-09
  - [x] PART01 → `agents/ryou-efi-planner.md` rewritten (Three Passes)
  - [x] PART02 → Gate A + Gate B literal STOPs emitted exactly as specified
  - [x] PART03 → Anti-hallucination block applied to §3 / §9 / §10 / §15
  - [x] PART04 → Hand-off literal to Ryou Orchestrator in place
- [x] **EPIC 03 — REFI Packet Contract & Folder Structure** ✅ IMPLEMENTED 2026-07-09
  - [x] PART01 → packet layout documented in `refi/README.md`
  - [x] PART02 → required-files contract documented
  - [x] PART03 → `config.yaml` has 5 `epic_part.*` flags
  - [x] PART04 → backward-compat note + dual-format support
- [x] **EPIC 04 — Templates & Module Skeleton** ✅ IMPLEMENTED 2026-07-09
  - [x] PART01 → `templates/part-template.md` (15 sections + 8-gate footer)
  - [x] PART02 → `templates/epic-readme-template.md` (9 sections)
  - [x] PART03 → `templates/epic-matrix-template.md`
  - [x] PART04 → `modules/_template/epics/00-demo/` populated (PART01_demo)
- [x] **EPIC 06 — User Documentation & Worked Example** ✅ IMPLEMENTED 2026-07-09
  - [x] PART01 → README root has "REFI v2 · Epic + PART Methodology" section
  - [x] PART02 → ASCII diagram (3 Passes + 8 gates) included
  - [x] PART03 → `.refi/modules/example-todo-cli/epics/01-setup-cli/` (3 PARTs)
  - [x] PART04 → `.refi/modules/example-todo-cli/epics/02-help-and-docs/` (3 PARTs)
- [x] **EPIC 07 — Backward Compatibility & Migration Helper** ✅ IMPLEMENTED 2026-07-09
  - [x] PART01 → migration policy in `refi/README.md` "Backward compatibility"
  - [x] PART02 → `scripts/migrate-refi-module.js` (ESM, dry-run validated)
  - [x] PART03 → 6-step migration doc snippet in `refi/README.md`
- [x] **EPIC 08 — Planning Method Selector** ✅ IMPLEMENTED 2026-07-09
  - [x] PART01 → `reasp.config.json` + `rass-core.js` helpers (`getPlanningMethod`, `setPlanningMethod`)
  - [x] PART02 → `reasp_setup(action="set-planning-method")` + `/reasp-setup` TUI option
  - [x] PART03 → `ryou-efi-planner.md` rewritten as dual-mode (Phases default + Epic/PART opt-in)

## Current State

- **Status:** `planning-complete`. ALL 8 EPICs planned; ALL 30 PARTs detailed;
  legacy packets preserved; planning method selector implemented and documented.
- **Total 8-gates signed at packet level:** 240 (8 × 30) expected at execution.
- **Daily summary:** `AI/Summarys/summary-2026-07-09.html` (Sesión 5 + Sesión 6).
- **Next action by Orchestrator:** await the first real user request against the
  new planner and validate the STOP-gate flow in a live session; also validate
  `/reasp-setup` switching between `phases` and `epic`.
- **Deferral note:** none. EPIC 07 helper script is optional to run.

## Notes

- The 4 legacy modules (`reasp-backup-manager`, `linux-compat`, `multi-agent-compatibility`,
  `sdd-profile-provider-support`) are read-only in this packet; their packets are valid
  in REFI v1 form and continue to work because `config.yaml` keeps
  `legacy_domain_shards_fallback: true`.
- The `domain-shards/` folder is RETAINED in the new packet layout as an optional space
  for cross-cutting concerns that don't fit a single EPIC.
- ModeProfiles (`fast`, `architecture`, `ui`, `debug`, `enterprise`, `legacy`,
  `minimal`, `ryouset`) are NOT modified. They continue to drive the RASS phase pipeline
  inside each PART during execution.
