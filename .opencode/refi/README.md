# REFI · Ryou Enterprise Feature Implementation (v2 · Epic + PART)

REFI is the planning and execution packet system embedded into REASP. Version 2
adopts the **Epic + PART methodology** (validated in `PlanificationTypes/EpicPlanification/`)
to achieve better decomposition, fewer hallucinations, and a cleaner hand-off to
Ryou Orchestrator.

## Core Principle

> **Plan 100 % before any code.** Every PART of every EPIC is detailed **before**
> Ryou Orchestrator touches the codebase. Each PART then traverses the **8-gate
> cycle** before being marked `Terminated`.

## Two Passes · One Hand-off

```text
            ┌────────────── Ryou EFI Planner ──────────────┐
            │                                               │
            │   Pass 1 — Epic Breakdown                     │
            │   ├─ request.md                                │
            │   ├─ master-blueprint.md (con EPIC breakdown)  │
            │   ├─ epics/matrix.md                           │
            │   └─ epics/<epic>/README.md  (x N)             │
            │        ⤷ STOP · WAIT FOR USER ⤷                │
            │   Pass 2 — PART Detail (por EPIC)              │
            │   └─ epics/<epic>/parts/PARTnn.md (15 sec.)     │
            │        ⤷ STOP · entre EPICs ⤷                  │
            │   Pass 3 — Orchestration                       │
            │   └─ orchestration-map.md / progress.md /       │
            │      verification.md                           │
            │        ⤷ HANDOFF TO ORCHESTRATOR ⤷             │
            │                                               │
            │   Cada PART atraviesa 8 gates                  │
            │   1·Architecture  2·Scope  3·UX  4·Manual      │
            │   5·DefectClosure 6·TechDoc 7·UserDoc 8·SignOff│
            └───────────────────────────────────────────────┘
```

## Packet Contract · v2 Structure

Every new REFI v2 packet MUST live under `.refi/modules/<slug>/` and contain:

```text
.refi/modules/<slug>/
├── request.md                  # original request, preserved verbatim
├── master-blueprint.md         # EPIC breakdown + contract + risks
├── epics/                      # NEW — Epic-layer planning (mandatory for v2)
│   ├── matrix.md               # EPIC priority/deps/complexity/% matrix
│   └── <NN-epic-slug>/
│       ├── README.md           # Epic backlog (9 sections)
│       └── parts/
│           ├── PART01_<slug>.md
│           ├── PART02_<slug>.md
│           └── ...
├── domain-shards/              # OPTIONAL — for cross-cutting concerns only
│   └── 00-<cross-cutting>.md
├── orchestration-map.md        # EPIC order + per-EPIC PART order + 8 gates
├── progress.md                 # EPIC + PART state tracking
└── verification.md             # 8-gate evidence per PART + aggregated footer
```

### Required Files per Phase

| Pass end | Files that MUST exist |
|----------|------------------------|
| **Pass 1** | `request.md`, `master-blueprint.md`, `epics/matrix.md`, `epics/<epic>/README.md` × N |
| **Pass 2** | All of Pass 1 + `epics/<epic>/parts/PARTnn.md` for every planned PART |
| **Pass 3** | All of Pass 2 + `orchestration-map.md`, `progress.md`, `verification.md` |

### Naming Conventions

- `<NN>` — 2-digit zero-padded sequence, in planning order (`01`, `02`, …).
- `<slug>` — kebab-case, max 40 chars, ASCII only.
- PART files: `PARTnn_<slug>.md` (where `nn` is per-EPIC, NOT packet-wide).

## Epic + PART · Quick Reference

- **Epic** = subsystem-aligned planning unit. Lives in `epics/<NN-slug>/`.
- **PART** = 15-section execution unit. Lives in `epics/<epic>/parts/PARTnn.md`.
- **8 Gates** = mechanical cycle every PART must pass: Architecture · Scope · UX ·
  Manual · Defect Closure · Tech Doc · User Doc · Sign-off.
- **Baseline** = real artefact (code file / class / line / URL / competitor) cited in
  PART section 3 to anchor against reality.
- **Acceptance Criteria** = testable bullets in section 15 that close the PART.

For the canonical definitions and the full Epic anatomy + PART template spec, see
`rules/epic-glossary.md` and `rules/quality-gates.md` v2.

## Backward Compatibility

REFI v1 packets (using `domain-shards/01-*.md` and the 7-section shard template)
remain fully valid. v2 introduces the new structure as **additive** — both formats
are accepted by the linter, and `config.yaml` exposes:

```yaml
epic_part:
  enabled: true                                    # planner proposes EPICs first
  require_part_detail_before_handoff: true         # no handoff without detailed PARTs
  legacy_domain_shards_fallback: true              # accept v1 packets
  min_epics_for_enterprise: 2                      # < 2 EPICs = trivial task
  max_parts_per_epic_soft_warning: 30              # EPICs grow beyond 30 → warn
```

The four legacy REFI modules — `reasp-backup-manager`, `linux-compat`,
`multi-agent-compatibility`, `sdd-profile-provider-support` — keep working
unchanged. Migration to v2 is **optional**.

### Migrating a legacy packet (optional)

If you have an existing packet under `.refi/modules/<slug>/` using
`domain-shards/01-*.md` and want to migrate it to the Epic + PART format:

1. **Decide first.** Both formats work; migration is optional.
2. **Dry-run the helper.**
   ```bash
   node scripts/migrate-refi-module.js <slug> --dry-run
   ```
   Review the printed plan.
3. **Apply with a new slug.**
   ```bash
   node scripts/migrate-refi-module.js <slug> --output=<slug>-v2
   ```
   The original stays intact. A new folder `<slug>-v2/` is created.
4. **Fill the gaps manually.** Sections §3 (Comparison) and §15 (Acceptance Criteria)
   cannot be auto-derived. Fill them by hand.
5. **Validate.** Run the linter and review `epics/matrix.md`.
6. **Switch.** Once you trust `<slug>-v2/`, rename or delete the legacy.

## Planning Method Selector

REASP can plan in two modes. The active mode is stored in `reasp.config.json` as
`planning_method` and is read by the planner at the start of every session.

| Method | Value | Description | Default |
|--------|-------|-------------|---------|
| **Phases** | `phases` | Legacy domain-shard planning (`domain-shards/01-*.md`) | ✅ yes |
| **Epic + PART** | `epic` | v2 EPIC/PART planning (`epics/<NN-slug>/parts/PARTnn.md`) | opt-in |

Switch methods any time:

- **TUI:** `/reasp-setup` → `Switch Planning Method`
- **Tool:** `reasp_setup(action="set-planning-method", method="epic")`
- **Tool:** `reasp_setup(action="set-planning-method", method="phases")`

The planner prompt (`agents/ryou-efi-planner.md`) is dual-mode: it calls
`reasp_setup(action="status")` at startup and follows **only** the workflow
matching the returned `planning_method`. If the field is missing or invalid, it
defaults to `"phases"`.

## Workflow

### When planning_method == "epic" (v2)

1. Preserve request.
2. Build master blueprint with EPIC breakdown.
3. Build EPIC matrix + per-Epic READMEs (planned PARTs only).
4. **STOP · wait for user confirmation.**
5. Detail PARTs per EPIC on user demand.
6. **STOP · wait for user confirmation between EPICs.**
7. Build orchestration map, progress, and verification.
8. Hand off to Ryou Orchestrator.

### When planning_method == "phases" (legacy)

1. Preserve request.
2. Build master blueprint with domain decomposition.
3. Build `domain-shards/<NN>-<shard>.md` for planning, architecture,
   implementation, verification, and handoff.
4. **STOP · wait for user confirmation.**
5. Hand off to Ryou Orchestrator.

In REASP, the typical usage is:

- Use **Ryou EFI Planner** for the packet and planning,
- Switch to **Ryou Orchestrator** for implementation.

## Cross-References

- `rules/global-rules.md` — process ordering (Three Passes).
- `rules/epic-glossary.md` — vocabulary + Epic anatomy + PART template + 8 gates.
- `rules/quality-gates.md` v2 — 8-gate evidence contract.
- `rules/anti-hallucination.md` v2 — section 3/9/10/15 anchors.
- `templates/part-template.md` — 15-section PART skeleton.
- `templates/epic-readme-template.md` — 9-section Epic skeleton.
- `templates/epic-matrix-template.md` — EPIC matrix skeleton.
- `modules/_template/` — copyable scaffold for new packets.
- `scripts/migrate-refi-module.js` — optional migration helper (EPIC 07).