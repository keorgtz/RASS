# Progress · example-todo-cli

> Mirrors `epics/matrix.md`. Updated as Ryou Orchestrator closes gates per PART.

## Initial State

- No CLI exists under `.refi/modules/example-todo-cli/`.
- This packet documents a worked example of the REFI v2 (Epic + PART) methodology.
- This packet is itself the first consumer of the new methodology.

## Completed

- [x] REFI packet created under `.refi/modules/example-todo-cli/`.
- [x] `request.md` captured.
- [x] `master-blueprint.md` written with EPIC breakdown.
- [x] `epics/matrix.md` written with 2 EPICs.
- [x] EPIC 01 README (Setup CLI) written.
- [x] EPIC 02 README (Help & Docs) written.
- [x] 6 PARTs detailed (3 per EPIC) with 15 sections + footer of 8 gates.
- [x] `orchestration-map.md` written.
- [x] `progress.md` (this file) written.
- [x] `verification.md` written with per-PART gate placeholders.

## Pending (execution phase · owned by Ryou Orchestrator)

- [ ] **EPIC 01 — Setup CLI**
  - [ ] PART01_CLISkeleton
  - [ ] PART02_CommandsAddListComplete
  - [ ] PART03_PersistenceJSON
- [ ] **EPIC 02 — Help & Docs**
  - [ ] PART01_HelpTexts
  - [ ] PART02_ReadmeGen
  - [ ] PART03_ManualSmoke

## Current State

- **Status:** `planning-complete`. ALL PARTs detailed. NO code touched yet.
- **Next action by Orchestrator:** start with EPIC 01, PART01. Walk through 8 gates
  per PART. Update `epics/matrix.md` as % moves.

## Notes

- This packet does NOT modify any file outside `.refi/modules/example-todo-cli/`.
- PART §3 of each PART anchors to real artefacts in the repo
  (`installer/index.js`, `package.json`, `PlanificationTypes/...`) to demonstrate the
  anti-hallucination baseline anchoring in action.
- The 8-gate footer of every PART is signed with placeholder values for documentation
  artefacts; on execution, Ryou Orchestrator should re-sign with real evidence.