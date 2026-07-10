# REFI Epic + PART · Glossary & Conventions (v2)

> Single source-of-truth for the REFI v2 planning methodology. This file replaces
> the loose terminology of REFI v1 with the strict Epic + PART vocabulary, mirrored
> from `PlanificationTypes/EpicPlanification/00_MASTER_PRODUCT_COMPLETION.md` and
> adapted for REASP.

---

## 1 · Core Terms

### REFI
**Ryou Enterprise Feature Implementation.** The enterprise planning-packet system
embedded into REASP. Turns broad enterprise requests into a controlled packet
before implementation expands.

### REFI Packet
The folder `.refi/modules/<slug>/` that contains the complete planning artefacts for
one logical unit of work. A packet can be **legacy** (uses `domain-shards/`) or
**v2** (uses `epics/<epic>/parts/`); both are valid formats (see EPIC 07 policy).

### Epic
A **subsystem-aligned** planning unit that groups 4–30 PARTs. Lives at
`epics/<NN-slug>/`. Always has its own `README.md` (backlog). An Epic answers
*what subsystem / capability is being shipped?* — NOT *what phase is this?*

### PART
A **15-section planning unit** inside an Epic. Lives at
`epics/<NN-slug>/parts/PARTnn_<slug>.md`. A PART answers *what specific deliverable,
how tested, how validated, how documented?*. A PART is the unit of execution handed
to Ryou Orchestrator.

### 8 Gates (Verification Cycle)
The mechanical cycle every PART must traverse in strict order before being marked
**Terminated**:

1. **Architecture Review** — design vs project invariants / ADRs.
2. **Scope & Completeness Audit** — declared vs actually implemented; gaps classified.
3. **UX/Design Review** — MeridianUI if UI; else interface consistency (APIs/CLI/contracts).
4. **Manual / Runtime Validation** — checklist on real host(s); evidence captured.
5. **Defect Closure** — every defect from gates 1–4 fixed in this same PART.
6. **Technical Documentation** — declared tech docs produced and linked.
7. **User Documentation** — declared user docs produced and linked.
8. **Final Review & Sign-off** — build 0/0 + suite green + Acceptance Criteria re-read
   + footer signed.

Detailed evidence per gate → see `.opencode/refi/rules/quality-gates.md` v2.

### Baseline
The **anchor against reality** that a PART's section 3 ("Comparison against baseline")
must reference. By default the baseline is the **codebase itself**; it can also be a
competitor product, a published standard, or a project convention. If no baseline
exists, the section must read `N/A — greenfield` with a one-line justification.

### Acceptance Criteria
Testable bullets that close the PART (section 15). Every bullet must be executable
via a script, a test, a command, or a visual inspection. **What cannot be verified is
not acceptance.**

### Quality Gate Evidence
The concrete artefact (link, file path, log snippet, screenshot, diff, or test output)
recorded in a PART's footer that proves the corresponding gate passed. Decoration is
not evidence.

### Planning 100 % Rule (Hard Rule)
**No code is written before all EPICs of a packet have their PARTs detailed.**
Three explicit exceptions:

1. **Trivial tasks** (single file change, config tweak, doc fix) — plan as a single
   PART inside one Epic `00-trivials` and execute immediately.
2. **Production hotfixes** — registered retroactively as a PART inside one Epic
   `zz-hotfixes` for audit; do not block other EPICs.
3. **Explicit user override** — only when the user types `plan-then-execute`; the
   planner aborts with structured error otherwise.

### Shards (Legacy)
REFI v1 execution unit. Lives in `domain-shards/01-*.md`. Survives for cross-cutting
tasks that do not fit a single Epic. Read-only from the perspective of v2.

### ModeProfile vs Epic/PART
- **ModeProfile** decides which **RASS phases** (orchestrator/init/explore/propose/
  design/apply/verify/archive) execute INSIDE each PART.
- **Epic/PART** decides the OUTER planning structure: what subsystems ship, in what
  order, with what acceptance.

They are **complementary layers**; one does not replace the other.

---

## 2 · Epic Anatomy (9-section README)

Every `epics/<NN-slug>/README.md` MUST contain, IN ORDER:

1. **Title** (`# EPIC NN — <Name>`)
2. **Header meta** — Prioridad (P0–P2), Complejidad (B/M/A/MA), % completitud (8 puertas),
   Estado (Backlog / PARTs detallados / EN CURSO / Terminado).
3. **Alcance** — qué subsistemas / capabilities; qué NO entra.
4. **Objetivos** — 3–7 viñetas con criterio verificable.
5. **Dependencias** — entrantes (EPICs previos) y salientes (consumidores).
6. **Complejidad y prioridad** — justificación en 2–4 líneas.
7. **Files to Modify / Create** — rutas exactas, no especulativas.
8. **PARTs planificados** — lista numerada con una línea de descripción por PART.
9. **Definition of Done (EPIC level)** — qué condiciones cierran el EPIC.

### Epic % Formula

```text
% completion = (PARTs that passed all 8 gates) / (PARTs planned)
```

### Epic Lifecycle States (only these four are valid)

| State | Meaning |
|-------|---------|
| `Backlog` | Only the Epic README exists; no PARTs detailed yet. |
| `PARTs detallados` | All planned PARTs are detailed; EPIC is ready to execute. |
| `EN CURSO` | Ryou Orchestrator is executing the EPIC's PARTs. |
| `Terminado` | All PARTs have footer signed; EPIC moves to next. |

A state transition requires ALL conditions of the source state to be satisfied.
Cross-state jumps (e.g., `Backlog → EN CURSO`) are forbidden.

---

## 3 · PART Template · 15 Sections

Every PART must contain, IN ORDER, all 15 sections. Sections may be marked
`N/A — greenfield` ONLY where explicitly allowed.

| # | Section | Allowed `N/A`? |
|---|---------|----------------|
| 1 | Purpose | No |
| 2 | Current State | Yes — `N/A — greenfield` if building from scratch |
| 3 | Comparison against baseline | Yes — `N/A — greenfield` only with justification |
| 4 | Missing / Required Scope | No |
| 5 | UX Problems | Yes — `N/A — no UI` |
| 6 | Backend / Logic Problems | No |
| 7 | Frontend / Presentation Problems | Yes — `N/A — no UI` |
| 8 | Technical Debt | No ("none" is an acceptable value) |
| 9 | Required Improvements | No (must be numbered, concrete, testable) |
| 10 | Implementation Plan | No (must enumerate exact files) |
| 11 | Automated Test Plan | No ("no new tests" only with justification) |
| 12 | Manual Validation Checklist | No (must enumerate behavioural checks) |
| 13 | Technical Documentation to produce | No ("none" is acceptable) |
| 14 | User Documentation to produce | No |
| 15 | Acceptance Criteria | No (must be testable bullets) |

After section 15, every PART MUST contain a **Gates Evidence** footer with 8
numbered entries (one per gate) and a final `Signed by / Date` line.

The full template lives at `.opencode/refi/templates/part-template.md`.

---

## 4 · The 8 Gates (detail)

| # | Gate | Evidence Minimum |
|---|------|------------------|
| 1 | **Architecture Review** | Notes contrasting the design with project invariants + ID of relevant ADRs (if any). |
| 2 | **Scope & Completeness Audit** | A `declared vs actual` table closing every gap as `accepted` or `filled`. |
| 3 | **UX/Design Review** | Screenshots if UI; or diffs of MeridianUI tokens; or contract/error-message diffs for non-UI. |
| 4 | **Manual / Runtime Validation** | Section 12 checklist executed; tickboxes with evidence per item. |
| 5 | **Defect Closure** | Issues / PRs / inline notes resolving every defect from gates 1–4. |
| 6 | **Technical Documentation** | Links or diffs to the declared technical docs. |
| 7 | **User Documentation** | Links or diffs to the declared user docs. |
| 8 | **Final Review & Sign-off** | Build 0/0 + suite green + Acceptance Criteria re-read + footer signed. |

### Gate Ordering Rule (strict)

Gates traverse **in order 1 → 8**. Skipping gate N blocks the sign-off at gate N+1.
A PART cannot move to `Terminated` until all 8 footer entries have evidence AND the
`Signed by / Date` line is filled.

---

## 5 · Planning 100 % Rule (Hard Rule)

> **No code is written before all EPICs of a packet have their PARTs detailed.**

### Violation Signals

Ryou EFI Planner aborts with structured error if ANY of these are detected:

- `epics/matrix.md` does not exist.
- At least one EPIC in the matrix has no `epics/<epic>/README.md`.
- At least one EPIC's state is `EN CURSO` while its PARTs are not all detailed.
- The user requests implementation (`Implement`, `Apply`, `Code`, `Build`) while the
  packet is not in `PARTs detallados` state.

### Allowed Exceptions

| Exception | Treatment |
|-----------|-----------|
| **Trivial task** (config tweak, doc fix, single-file change) | Single PART inside Epic `00-trivials`; allowed to skip the wait. |
| **Production hotfix** | Retroactive PART inside Epic `zz-hotfixes`; audit-only. |
| **Explicit user override** (`plan-then-execute`) | Allowed; recorded in `progress.md` with timestamp. |

---

## 6 · Cross-References

- **Templates:**
  - `templates/part-template.md` — 15-section PART skeleton.
  - `templates/epic-readme-template.md` — 9-section Epic skeleton.
  - `templates/epic-matrix-template.md` — EPIC matrix table.
- **Rules:**
  - `rules/global-rules.md` — overall REFI process (this file is linked from it).
  - `rules/quality-gates.md` v2 — 8-gate evidence requirements.
  - `rules/anti-hallucination.md` v2 — section 3, 9, 10, 15 clauses.
- **Reference material:**
  - `PlanificationTypes/EpicPlanification/00_MASTER_PRODUCT_COMPLETION.md` — origin.
  - `PlanificationTypes/EpicPlanification/Designer/README.md` — concrete Epic example.
  - `PlanificationTypes/EpicPlanification/Designer/PART01_StudioShell.md` —
    concrete PART example with 15 sections + footer of 8 gates.

---

## 7 · Anti-Aliasing

| Avoid | Prefer |
|-------|--------|
| "phase", "shard", "domain shard" (when referring to v2) | `Epic` / `PART` |
| "implement phase N" | `execute PARTnn of EPIC NN` |
| "we passed the gates" (without evidence) | evidence-link per gate in footer |
| "looks done" | Acceptance Criteria ticked with evidence |
| "we'll figure it out while coding" | EPIC + PART detailed first; 100 % rule |