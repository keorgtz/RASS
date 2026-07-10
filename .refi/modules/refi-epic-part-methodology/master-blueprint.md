# Master Blueprint · REFI — Upgrade to Epic + PART Methodology

## 1. Problem Statement

REFI currently plans enterprise work in a single layer of "shards" inside `domain-shards/`.
That works for small/mid requests but has three weaknesses for big ones:

1. **Process-topical** — shards are scoped by execution concern (init/explore/apply), which
   fragments user-facing features across shards and makes prioritization/fork-track harder.
2. **No baseline-anchored PARTs** — there is no mandatory "comparison against existing code
   or competitor", which is the structural anchor that keeps hallucinations in check.
3. **Loose completion** — quality gates (`quality-gates.md`) are 5 bullets; they do not
   force concrete Acceptance Criteria, Validation Checklists, or per-PART docs.

The EpicPlanification reference (`PlanificationTypes/EpicPlanification/`) demonstrates a
methodology that solves all three by:

- Decomposing the request into **EPICs** (subsystem-aligned),
- Each EPIC containing 4–30 **PARTs** following a fixed 15-section template,
- Each PART traversing the same **8 mechanical gates** before sign-off,
- Adopting a hard rule: **all PARTs are 100% detailed before any code is written.**

This blueprint migrates REFI to that methodology while keeping REFI's existing shard
contract intact for cross-cutting work.

## 2. Goal

Teach REFI + Ryou EFI Planner a new planning vocabulary — **EPICs** (top) + **PARTs**
(bottom) — and a new planning workflow — **Epic plan → user confirmation → PART detail
pass → user confirmation → execution handoff** — without disturbing RASS, ModeProfiles,
the installer, or the agent ecosystem.

## 3. Core Design Principles

> **EPIC-first, PART-thorough, gate-honest.**
>
> **Plan 100 % before any code.**
>
> **Each PART compares against a real baseline.**
>
> **RASS phases still drive execution — Epic/PART drives planning.**

## 4. Conceptual Architecture (after upgrade)

```text
┌──────────────────────────────────────────────────────────────────────┐
│                       Ryou EFI Planner                               │
│                                                                      │
│   Pass 1 — EPIC BREAKDOWN                                            │
│   ├─ Capture original request                            (request.md)│
│   ├─ Detect request type & classify complexity                        │
│   ├─ Build EPIC matrix (priority, deps, complexity, %)  (epics/       │
│   │                                                     matrix.md)  │
│   └─ For each EPIC: backlog README with planned PARTs     (epics/   │
│                                                          <epic>/     │
│                                                          README.md) │
│         ⤷ STOP · WAIT FOR USER CONFIRMATION ⤷                       │
│                                                                      │
│   Pass 2 — PART DETAIL (per EPIC, on user demand)                    │
│   └─ Expand each PART using the 15-section template                  │
│      (Purpose · Current State · Comparison · Missing · UX ·          │
│       Backend · Frontend · Tech Debt · Improvements ·                │
│       Implementation · Auto Tests · Manual Checklist · Tech Docs ·   │
│       User Docs · Acceptance Criteria)                                │
│                                                                      │
│   Pass 3 — ORCHESTRATION MAP                                         │
│   ├─ EPIC execution order                                            │
│   ├─ Per-EPIC PART order                                             │
│   ├─ 8-gate cycle bound to each PART                                  │
│   └─ Handoff to Ryou Orchestrator                                    │
└──────────────────────────────────────────────────────────────────────┘
```

## 5. New REFI Packet Structure

```text
.refi/modules/<slug>/
├── request.md                  # Original request, scope, success criteria (UNCHANGED)
├── master-blueprint.md         # Problem, goal, principles, layers, EPIC breakdown (EXTENDED)
├── epics/                      # NEW — Epic-layer planning
│   ├── matrix.md               # Epic priority/deps/complexity/% matrix
│   ├── 01-<epic-slug>/
│   │   ├── README.md           # Epic backlog: scope, deps, PART list
│   │   └── parts/
│   │       ├── PART01_<slug>.md
│   │       ├── PART02_<slug>.md
│   │       └── ...
│   ├── 02-<epic-slug>/
│   │   └── ...
│   └── ...
├── domain-shards/              # RETAINED — for cross-cutting concerns not fitting an EPIC
│   └── 00-<cross-cutting>.md
├── orchestration-map.md        # EXTENDED — EPIC order + per-EPIC PART order + 8 gates
├── progress.md                 # EXTENDED — EPIC + PART state
└── verification.md             # EXTENDED — applies 8 gates per PART
```

**Key rule:** a new REFI packet must contain at minimum:
- `request.md`,
- `master-blueprint.md`,
- `epics/matrix.md`,
- one `epics/NN-*/README.md` per EPIC.

`epics/NN-*/parts/PARTnn*.md` and `orchestration-map.md` are added in Pass 2/3.
`domain-shards/` remains optional (used only for cross-cutting tasks).

## 6. New Planning Workflow (Ryou EFI Planner)

| Step | Action | Output | Wait? |
|------|--------|--------|-------|
| 1 | Preserve the original request | `request.md` | No |
| 2 | Build master blueprint with EPIC breakdown | `master-blueprint.md` | No |
| 3 | Build EPIC matrix + per-EPIC README (planned PARTs, not detailed) | `epics/matrix.md`, `epics/<epic>/README.md` | **YES — wait for user** |
| 4 | User says "detalla los PARTs de EPIC X" (or "de todos") | `epics/<epic>/parts/PARTnn*.md` | **YES — wait for user if multiple EPICs** |
| 5 | After all EPICs have PARTs, build orchestration map | `orchestration-map.md` | No |
| 6 | Hand off to Ryou Orchestrator | n/a | No |

This is the exact "plan 100 % before any code" rule EpicPlanification enforces.

## 7. New 15-section PART Template (mandatory, adapted from EpicPlanification)

```
# PARTnn — <Name>

1. Purpose                       — What this PART exists for.
2. Current State                 — As-is reality; "N/A" only for greenfield.
3. Comparison against baseline   — Existing code / competitor / convention.
4. Missing / Required Scope      — Gap inventory.
5. UX Problems                   — UI/UX defects; "N/A" if not UI.
6. Backend / Logic Problems      — Server, domain, EF, infra defects.
7. Frontend / Presentation Problems — Presentation defects; "N/A" if not UI.
8. Technical Debt                — Carried forward compromises.
9. Required Improvements         — Numbered, concrete, testable.
10. Implementation Plan          — Steps + model + files + order.
11. Automated Test Plan          — Unit + integration; "no new tests" explicitly stated.
12. Manual Validation Checklist  — Behavioural checks on the real host(s).
13. Technical Documentation to produce — Only specify; do not generate yet.
14. User Documentation to produce — Only specify; do not generate yet.
15. Acceptance Criteria           — Bullet list; testable; ties to gates.
```

Sections 2, 3, 5, 7, 8 may be marked **"N/A — greenfield"** when the PART is building
something brand new.

## 8. New 8-Gate Verification Cycle (per PART)

Every PART must traverse, in order:

1. **Architecture Review** — design vs project invariants/ADRs.
2. **Scope & Completeness Audit** — declared vs actually-implemented; gaps classified.
3. **UX/Design Review** — MeridianUI if UI; else interface consistency (APIs/CLI/contracts).
4. **Manual / Runtime Validation** — checklist executed on real host(s), evidence captured.
5. **Defect Closure** — every defect from gates 1–4 fixed in this same PART.
6. **Technical Documentation** — declared tech docs produced and linked.
7. **User Documentation** — declared user-facing docs produced and linked.
8. **Final Review & Sign-off** — build 0/0 + suite green + Acceptance Criteria re-read +
   result recorded in the PART's footer.

Ryou Orchestrator cannot promote a PART to "Terminated" without all 8 boxes ticked and
evidence linked inside `epics/<epic>/parts/PARTnn*.md`.

## 9. Interaction with RASS Phases (UNCHANGED)

- RASS phases (`orchestrator, init, explore, propose, design, apply, verify, archive`)
  continue to execute INSIDE each PART, chosen by the active ModeProfile.
- Epic/PART is the OUTER planning layer; RASS is the INNER execution layer.
- A PART may itself be a long-running flow that cycles through several RASS phases.
- No new tools, slash commands, or TUI screens are introduced.

## 10. Affected Layers

| Layer | Change |
|-------|--------|
| `.opencode/agents/ryou-efi-planner.md` | Rewritten to follow EPIC-first / PART-thorough workflow. |
| `.opencode/refi/README.md` | Extended with Epic/PART methodology. |
| `.opencode/refi/config.yaml` | Adds `epic-part` mode flag and packet-required files. |
| `.opencode/refi/rules/global-rules.md` | Adds EPIC-first / PART-thorough / gate-honest rules. |
| `.opencode/refi/rules/quality-gates.md` | Replaced by the 8-gate cycle. |
| `.opencode/refi/rules/anti-hallucination.md` | Reinforced with PART-level baseline anchoring. |
| `.opencode/refi/templates/*` | New templates for `epic-matrix`, `epic-readme`, `part`. |
| `.opencode/refi/modules/_template/*` | New empty scaffolds aligned with new structure. |
| `.refi/modules/<new>/*` | New modules use the EPIC/PART structure by default. |
| `.refi/modules/<existing>/*` | Migration helper available; not required. |
| Root `README.md` | One paragraph noting the methodology change. |

## 11. Persistence / Configuration Impact

- No DB, file format, or schema change.
- `config.yaml` gains two boolean keys (default values preserve existing behaviour):
  - `epic_part.enabled: true`  (Planner always proposes EPIC plan first)
  - `epic_part.require_part_detail_before_handoff: true`
- No migration of runtime state; behaviour is gated by the planner prompt.

## 12. UI / UX Surfaces

None added. No CLI flag, no TUI screen, no `/reasp` command. The methodology is purely a
planner contract — invisible to the end user.

## 13. Risks and Anti-Patterns

| Risk | Mitigation |
|------|------------|
| Planner produces too many EPICs for small tasks | Hard rule: ≤ 1 EPIC for trivial tasks; 2–4 for typical; 6+ only for true enterprise scope. |
| Planner "detail PARTs" without being asked | Prompt explicitly states Pass 1 ends at EPIC matrix + READMEs. |
| PARTs become long-winded speculative specs | 15-section template + Acceptance Criteria checklist force concreteness. |
| Existing modules break | `domain-shards/` retained; new structure is additive. |
| Templates miss a section | Single source-of-truth template in `templates/part-template.md`. |
| Orchestrator marks PART done without gates | `verification.md` per module + EPIC footer section are required by EPIC 05. |
| Anti-hallucination drifts back | Section 3 (Comparison) is mandatory and invoked by Anti-Hallucination rule update. |

## 14. Execution Shards (= EPICs of this REFI packet)

This REFI packet itself is the first consumer of its own new methodology. The EPICs:

1. **EPIC 01 — Conventions & Terminology.** Define Epic, PART, 8 gates, baseline comparison,
   Acceptance Criteria. Update `rules/global-rules.md`.
2. **EPIC 02 — Ryou EFI Planner Agent Prompt.** Rewrite `.opencode/agents/ryou-efi-planner.md`
   to follow the new workflow (two passes, two user gates).
3. **EPIC 03 — REFI Packet Contract & Folder Structure.** Update `refi/README.md`,
   `refi/config.yaml`, and the new `epics/` folder convention.
4. **EPIC 04 — Templates & Module Skeleton.** Create `templates/part-template.md`,
   `templates/epic-readme-template.md`, `templates/epic-matrix-template.md`, and update
   `modules/_template/*`.
5. **EPIC 05 — 8-Gate Verification System.** Update `rules/quality-gates.md`,
   `rules/anti-hallucination.md`, and `modules/_template/verification.md` to require the
   8-gate cycle per PART.
6. **EPIC 06 — User Documentation & Worked Example.** Document the methodology in the root
   `README.md` and add an end-to-end worked example under `.refi/examples/` (or as a fresh
   module).
7. **EPIC 07 — Backward Compatibility & Migration Helper.** Add a small helper note
   (in-repo doc + script) that lifts an existing `domain-shards/*` packet into an
   `epics/` packet auto-generated as a single "Legacy EPIC".

Total: ~28 PARTs across 7 EPICs.

## 15. Verification Strategy

The 8-gate cycle applies to every PART. At the packet level:

- **Gate A — Packet contract.** `request.md` + `master-blueprint.md` + `epics/matrix.md`
  + N × `epics/<epic>/README.md` exist; nothing invented outside the original request.
- **Gate B — Each PART passes its own 8 gates** during execution (Ryou Orchestrator).
- **Gate C — Migration proof.** Run the migration helper on `reasp-backup-manager` and
  confirm the resulting EPIC is information-equivalent to the original module's plan.

## 16. Open Questions

- None blocking. All material decisions captured in EPICs 01–05.
- Optional: provide an `/sdd` menu entry to enable/disable the Epic-PART method per
  ModeProfile — flagged as EPIC 07 PART but not required for v1.

## 17. Excluded From This Packet

- Changes to RASS phases, ModeProfiles, ModelStrategies.
- New TUI screens, slash commands, or AI tools.
- Touching `installer/`, `scripts/`, or `package.json`.
- New memory/state files outside `.refi/` and `.opencode/refi/`.
