 ---
 name: refi-enterprise-feature-implementation
 description: Use when the user asks for a module, subsystem, enterprise workflow, or large feature and needs a REFI packet before implementation or a clean handoff from Ryou EFI Planner to Ryou Orchestrator.
 ---

 # REFI inside REASP

 Use this skill when the request needs:

 - request preservation,
 - a master blueprint,
 - domain shards,
 - orchestration mapping,
 - verification gates,
 - or a planning packet before implementation.

 ## Required Packet

 Create `.refi/modules/<slug>/` with:

 1. `request.md`
 2. `master-blueprint.md`
 3. `domain-shards/*.md`
 4. `orchestration-map.md`
 5. `progress.md`
 6. `verification.md`

 ## Execution Rules

 - Preserve the original request verbatim.
 - Infer only what is justified by the project and request.
 - Split large work into numbered shards.
 - Keep progress current.
 - Verify each shard before advancing.

 ## REASP Usage Pattern

 - Use **Ryou EFI Planner** to generate the packet and planning.
 - Use **Ryou Orchestrator** to implement the planned work.
