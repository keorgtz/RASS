# Verification · REFI — Upgrade to Epic + PART Methodology

> Strategy: the 8-gate cycle (Architecture · Scope · UX · Manual · Defect Closure ·
> Tech Doc · User Doc · Sign-off) is applied per PART. This page aggregates results
> at the packet level. Each PART's footer is the canonical record; this file mirrors.

## Pre-Verification Conditions

- ALL 7 EPICs and ALL 27 PARTs have been detailed in this packet (planning-complete).
- `request.md` ↔ `master-blueprint.md` ↔ `epics/matrix.md` ↔ EPIC READMEs ↔ PARTs
  form a closed graph (no orphan refs, no over-declared items).
- No code has been touched. The verification gates evaluate the PLAN, not the code.

## EPIC 01 — Conventions & Terminology

### PART01 — Glossary & Definitions
- Gate 1 (Architecture Review): N/A — greenfield (no prior glossary). Anchored to `PlanificationTypes/EpicPlanification/00_MASTER_PRODUCT_COMPLETION.md` §2, §4.
- Gate 2 (Scope & Completeness Audit): 11 términos listados en §4 del PART; cross-link a `rules/epic-glossary.md` planificado.
- Gate 3 (UX/Design Review): N/A — doc artefact.
- Gate 4 (Manual / Runtime Validation): N/A — sin host real.
- Gate 5 (Defect Closure): N/A — sin código.
- Gate 6 (Technical Documentation): `rules/epic-glossary.md` will be created on execution.
- Gate 7 (User Documentation): No user-facing changes (handled by EPIC 06).
- Gate 8 (Final Review & Sign-off): Acceptance Criteria re-read; 2/3 gates are "to produce on execution" by design.

**Signed by:** pending (Ryou Orchestrator to sign on execution) · **Date:** pending

### PART02 — Epic Anatomy
- Gate 1: Anchored to EpicPlanification `Designer/README.md` format (real artefact).
- Gate 2: 9 sections of `epics/<epic>/README.md` explicitly enumerated; % formula stated.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: `templates/epic-readme-template.md` to be created by EPIC 04.
- Gate 7: N/A.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

### PART03 — PART Template · 15 Sections
- Gate 1: Anchored to `00_MASTER_PRODUCT_COMPLETION.md` §8 (real reference).
- Gate 2: 15 sections enumerated; N/A rules explicit; footer block of 8 gates listed.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: `templates/part-template.md` to be created by EPIC 04.
- Gate 7: N/A.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

### PART04 — Eight Gates Cycle
- Gate 1: Anchored to EpicPlanification §3.
- Gate 2: 8 gates in order with evidence per gate; gating rules stated.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: `rules/quality-gates.md` v2 to be created by EPIC 05.
- Gate 7: N/A.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

### PART05 — Planning 100 % Rule
- Gate 1: Anchored to EpicPlanification §7.
- Gate 2: Rule and 2 explicit exceptions listed.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: To be codified in `rules/global-rules.md` + planner prompt.
- Gate 7: N/A.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

## EPIC 02 — Ryou EFI Planner Agent

### PART01 — New Workflow · Two Passes
- Gate 1: 10-step flow anchored to EpicPlanification §7.
- Gate 2: All 10 steps enumerated; STOP gates at 4 and 7.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: Block literal to be inserted into the agent prompt.
- Gate 7: N/A.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

### PART02 — Gating · User Confirmation
- Gate 1: Anchored to EpicPlanification §6 and §7.
- Gate 2: 2 literal STOP messages defined.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: Block literal to be inserted into the agent prompt.
- Gate 7: N/A.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

### PART03 — Anti-Hallucination in Prompts
- Gate 1: Anchored to existing `rules/anti-hallucination.md`.
- Gate 2: 4 clauses (§3 anchor; §15 testable; §10 concrete files; no inventions).
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: Block to be inserted in BOTH the agent prompt and `rules/anti-hallucination.md` v2.
- Gate 7: N/A.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

### PART04 — Handoff Contract
- Gate 1: Anchored to orchestrator prompt contract.
- Gate 2: Handoff message literal; `orchestration-map.md` and `progress.md` outputs declared.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: Block literal in prompt.
- Gate 7: N/A.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

## EPIC 03 — REFI Packet Contract & Folder Structure

### PART01 — Packet Layout Spec
- Gate 1: Anchored to EpicPlanification directory shape.
- Gate 2: Canonical tree + 4 rules (NN format, kebab-case, mandatory files, optional `domain-shards/`).
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: Block in `refi/README.md`.
- Gate 7: N/A.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

### PART02 — Required Files Contract
- Gate 1: Anchored to EpicPlanification `00_MASTER_PRODUCT_COMPLETION.md`.
- Gate 2: 4 + 5 + 3 file list with phases.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: Block in `refi/README.md`.
- Gate 7: N/A.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

### PART03 — Config YAML Additions
- Gate 1: Anchored to current `config.yaml`.
- Gate 2: 5 flags with safe defaults.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: Block in `config.yaml`.
- Gate 7: N/A.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

### PART04 — Backward-Compatible Folders
- Gate 1: Anchored to 4 legacy module packets.
- Gate 2: Dual-format acceptance + `legacy_domain_shards_fallback` flag.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: Notes in `refi/README.md` (Backward compatibility).
- Gate 7: N/A.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

## EPIC 04 — Templates & Module Skeleton

### PART01 — Part Template (15 sections)
- Gate 1: Anchored to EpicPlanification PART template.
- Gate 2: 15 sections + footer of 8 gates specified.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: `templates/part-template.md` to be created.
- Gate 7: N/A.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

### PART02 — Epic README Template (9 sections)
- Gate 1: Anchored to EpicPlanification `Designer/README.md`.
- Gate 2: 9 sections + meta-line specified.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: `templates/epic-readme-template.md` to be created.
- Gate 7: N/A.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

### PART03 — Epic Matrix Template
- Gate 1: Anchored to EpicPlanification §5.
- Gate 2: 8 columns; states; strategy block; update rule block.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: `templates/epic-matrix-template.md` to be created.
- Gate 7: N/A.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

### PART04 — Module Scaffold Update
- Gate 1: Anchored to current `modules/_template/`.
- Gate 2: Full tree + sample PART01_demo with 15 sections + footer.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: Files to be created under `modules/_template/epics/00-demo/`.
- Gate 7: N/A.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

## EPIC 05 — 8-Gate Verification System

### PART01 — Quality Gates v2
- Gate 1: Anchored to EpicPlanification §3 (8 gates) + existing `quality-gates.md` (5 bullets).
- Gate 2: Table of 8 gates with evidence per gate.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: `rules/quality-gates.md` v2 to be created (replaces v1).
- Gate 7: N/A.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

### PART02 — Anti-Hallucination v2
- Gate 1: Anchored to existing `rules/anti-hallucination.md`.
- Gate 2: 5 clauses covering §3, §9, §10, §15, and the explicit "no inventions" rule.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: Block to be appended.
- Gate 7: N/A.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

### PART03 — Verification.md Template
- Gate 1: Anchored to current `modules/_template/verification.md`.
- Gate 2: Block with 8 gate placeholders per PART + aggregated footer.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: Template to be replaced.
- Gate 7: N/A.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

## EPIC 06 — User Documentation & Worked Example

### PART01 — README Methodology Section
- Gate 1: Anchored to existing `README.md` and EpicPlanification §7.
- Gate 2: Block with 3 PASSES + 8 gates listed.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: Block to be inserted in `README.md`.
- Gate 7: This PART IS the user documentation.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

### PART02 — Diagram · Three Passes
- Gate 1: Anchored to EpicPlanification §3 + README.
- Gate 2: ASCII tree diagram; 8 gates in footer.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: Block to be inserted.
- Gate 7: This PART IS the user documentation.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

### PART03 — Worked Example · Epic A · "Setup CLI"
- Gate 1: Anchored to existing `package.json` (real artefact).
- Gate 2: Tree of 2 EPICs × ~3 PARTs each; §3 of PART01_CLISkeleton anchors to `package.json`.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: Worked-example tree.
- Gate 7: Worked-example tree.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

### PART04 — Worked Example · Epic B · "Help & Docs"
- Gate 1: Anchored to `commander` and `chalk` (real libraries).
- Gate 2: 3 PARTs with §3 baselines.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: Worked-example tree.
- Gate 7: Worked-example tree.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

## EPIC 07 — Backward Compatibility & Migration Helper

### PART01 — Migration Strategy & Exclusions
- Gate 1: Anchored to EpicPlanification (decision documented) + 4 legacy packets.
- Gate 2: 4-point policy (optional, dual-format, header marker, no silent rewrite).
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: Block in `refi/README.md`.
- Gate 7: N/A.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

### PART02 — Migration Helper Script (Optional)
- Gate 1: N/A — greenfield helper.
- Gate 2: Node.js skeleton, dry-run path, output determinism.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: `scripts/migrate-refi-module.js` to be created.
- Gate 7: N/A.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

### PART03 — Documentation · How to Migrate
- Gate 1: Anchored to `refi/README.md` (existing structure).
- Gate 2: 6-step migration snippet with code blocks.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: Snippet to be inserted in `refi/README.md`.
- Gate 7: This PART IS the user documentation for migration.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

## Aggregated Gates (packet level)

- **EPICs planned:** 8
- **PARTs planned:** 30
- **Total gates expected at packet completion:** 8 × 30 = **240**
- **Gates passed so far:** 0 of 240 (planning-complete; execution not started).
- **Status:** `planning-complete`
- **Last update:** EPIC 08 added; planning pass complete.

## Packet-Level Gates (extra, beyond per-PART)

### Gate A · Packet Contract Compliance
- [x] `request.md` exists and matches original user text.
- [x] `master-blueprint.md` includes EPIC breakdown.
- [x] `epics/matrix.md` exists with 7 EPICs and 4 valid states per row.
- [x] Each EPIC has `epics/<epic>/README.md`.
- [x] Each PART has 15 sections + footer of 8 gates.
- [ ] Orchestrator fills footers on execution.

### Gate B · Dual-Format Acceptance (Back-compat)
- [ ] Re-run linter against each of the 4 legacy packets; all pass after the change
  to `config.yaml` adds `legacy_domain_shards_fallback: true`.

### Gate C · Worked-Example Validity
- [ ] Run `node .opencode/...` (linter) over `.refi/modules/example-todo-cli/` once
  EPIC 06 PARTs are executed.

### Gate D · Anti-Hallucination Cross-Reference
- [ ] Every PART §3 references a real artefact from the repo OR marks `N/A — greenfield`
  with justification.

## Final Sign-Off (packet)

- [x] Gate A passed (planning)
- [ ] Gate B passed (after EPIC 03 PART04 execution)
- [ ] Gate C passed (after EPIC 06 execution)
- [ ] Gate D passed (after all PARTs executed)

## EPIC 08 — Planning Method Selector

### PART01 — Config State
- Gate 1: Anchored to `.opencode/reasp.config.json` (real artefact) and `getReaspConfig()` fallback.
- Gate 2: `VALID_PLANNING_METHODS`, `DEFAULT_PLANNING_METHOD`, `getPlanningMethod()`, `setPlanningMethod()` defined; fallback to `"phases"` documented.
- Gate 3: N/A.
- Gate 4: N/A — config helper; no runtime host.
- Gate 5: N/A.
- Gate 6: Code changes in `.opencode/rass-core.js`.
- Gate 7: Documented in `.opencode/refi/README.md`.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

### PART02 — Tool & TUI Selector
- Gate 1: Anchored to existing `reasp_setup` tool schema and `/reasp-setup` TUI dialog.
- Gate 2: `set-planning-method` action with enum `phases`/`epic`; TUI sub-menu with two options.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: Code changes in `.opencode/plugin.js` and `.opencode/tui.js`.
- Gate 7: Documented in `README.md` and `.opencode/refi/README.md`.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

### PART03 — Dual-Mode Planner Prompt
- Gate 1: Anchored to rewritten `ryou-efi-planner.md` v2 (Epic + PART) and legacy phase-based planning.
- Gate 2: Startup rule mandates `reasp_setup(action="status")`; two sections (`phases`, `epic`) with literals.
- Gate 3: N/A.
- Gate 4: N/A.
- Gate 5: N/A.
- Gate 6: Prompt rewritten in `.opencode/agents/ryou-efi-planner.md`.
- Gate 7: Documented in `.opencode/refi/README.md`.
- Gate 8: Pending.

**Signed by:** pending · **Date:** pending

## Final Sign-Off (packet)

- [x] Gate A passed (planning)
- [ ] Gate B passed (after EPIC 03 PART04 execution)
- [ ] Gate C passed (after EPIC 06 execution)
- [ ] Gate D passed (after all PARTs executed)
- [ ] Gate E passed (after EPIC 08 execution — planning method selector verified)

**Signed by:** _______________  **Date:** _______________
