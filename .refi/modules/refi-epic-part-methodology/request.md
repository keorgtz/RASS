# Request · REFI — Upgrade to Epic + PART Methodology

## Source Request

> "Quiero mejorar mi Ryou EFI Planner, ya que este utiliza una forma de planificacion que llame REFI, pero quiero mejorarla ya que esta es funcional pero quiero que sea todavia mas capaz. Revisa y analiza el ejemplo en `PlanificationTypes/EpicPlanification`, es de un proyecto donde se uso una planificacion basada en Epics y cada Epic tiene sus PARTs. Lo que quiero es que el REFI y mi Agente Ryou EFI Planner utilizen esa metodologia mezclada con la que actualmente tienen. En vez de hacer solo fases (que es la metodologia actual), primero cada plan se generara como ahorita se hace pero con EPICs. Ya que se genero con eso, pasare a pedirte detallar los PARTs de cada uno de los EPICs generados. Y ya que esten toda la planeacion que haces, los EPICs (que remplazaran a las fases) y los PARTs de cada Epic bien detallados, ahora si se podra proceder con la implementacion de ese plan. Lo que busco es que esta forma se desgloce mejor una implementacion y sea mucho mas eficiente y alucine lo menos posible. Asi que generame el plan para adaptar como te comento esa metodologia en mi REASP."

## Owner

Kevin Keor / maintainer of REASP.

## Why This Upgrade

1. **Better decomposition** — EPICs are domain-aligned (subsystem, surface, capability), not
   process-aligned (orchestrator → apply → verify). This better matches how engineers think
   about shipping features.
2. **Lower hallucination rate** — Every PART is forced to:
   - Compare against a baseline (existing code, competitor, project convention).
   - Declare concrete Acceptance Criteria up front.
   - Specify Technical + User documentation to produce.
   - Pass 8 mechanical gates before being marked done.
3. **Cleaner handoff to Ryou Orchestrator** — Orchestrator receives a fully-detailed PART
   plan instead of having to re-reason through the work.
4. **Two-pass planning rule** — REFI now commits to producing **all EPICs AND all PARTs**
   before any code is touched, matching the proven EpicPlanification workflow.

## Scope Inclusions

1. Extend REFI's planning methodology with the Epic + PART hierarchy.
2. Mix the new methodology with the current shard-based contract (NOT replace it 1:1 —
   `domain-shards/` are re-framed as PARTs grouped under EPICs).
3. Update **Ryou EFI Planner** agent prompt so it plans in EPICs and expands PARTs only
   when explicitly asked.
4. Add a **single 8-gate Verification cycle** applied to every PART before sign-off.
5. Provide a **migration path** for the four existing REFI modules
   (`reasp-backup-manager`, `linux-compat`, `multi-agent-compatibility`,
   `sdd-profile-provider-support`) — optional but documented.
6. Document the new methodology in the user-facing README of REASP.

## Scope Exclusions

- **RASS phases stay unchanged.** The inner execution pipeline (`orchestrator → init →
  explore → propose → design → apply → verify → archive`) runs INSIDE each PART. The
  Epic/PART layer is the OUTER planning layer; ModeProfiles continue to choose which
  RASS phases each PART uses.
- No new AI tools, slash commands, or TUI screens.
- No changes to the installer, snapshots, CLI, or reasp.config.json.
- No new repositories or external services.
- No forced migration of existing REFI modules — they keep working as shards; the new
  structure is additive (`epics/` folder coexists with `domain-shards/`).

## Success Criteria

- A user request to Ryou EFI Planner produces `epics/matrix.md` plus one README per EPIC,
  then WAITS for the user before expanding PARTs.
- A user request to "detalla los PARTs del EPIC X" produces one PART file per planned
  PART in that EPIC, each following the 15-section template, and waits again.
- Only when all EPICs have all PARTs detailed does the planner produce a clean
  `orchestration-map.md` and hand off to Ryou Orchestrator.
- Each PART file declares Acceptance Criteria, Test Plan, Validation Checklist, and
  documentation targets; Orchestrator cannot mark a PART done without producing the
  Validation evidence.

## Language

Spanish / English mixed, consistent with the existing REASP project style.

## Reference Material Reviewed

- `PlanificationTypes/EpicPlanification/00_MASTER_PRODUCT_COMPLETION.md`
- `PlanificationTypes/EpicPlanification/Designer/README.md`
- `PlanificationTypes/EpicPlanification/Designer/PART01_StudioShell.md`
- `PlanificationTypes/EpicPlanification/Designer/PART08_DesignSurface.md`
- `.opencode/agents/ryou-efi-planner.md` (current)
- `.opencode/refi/config.yaml` (current)
- `.opencode/refi/README.md` (current)
- `.opencode/refi/rules/global-rules.md` (current)
- `.opencode/refi/rules/anti-hallucination.md` (current)
- `.opencode/refi/rules/quality-gates.md` (current)
- `.opencode/refi/templates/*` (current)
- `.refi/modules/reasp-backup-manager/*` (existing module, full packet for reference)
- `.opencode/rules/global-rules.md` (project-level philosophy)
