 # REFI · Ryou Enterprise Feature Implementation

 REFI is the planning and execution packet system embedded into REASP.

 Its purpose is to turn broad enterprise requests into a controlled packet before implementation expands.

 ## Core Principle

 From the user perspective, the AI should move immediately.

 From the system perspective, the AI must still create the packet, shard the work, and verify before advancing.

 ## Packet Contract

 Every large module request should create:

 ```text
 .refi/modules/<slug>/
 ├── request.md
 ├── master-blueprint.md
 ├── orchestration-map.md
 ├── progress.md
 ├── verification.md
 └── domain-shards/
     ├── 01-*.md
     ├── 02-*.md
     └── ...
 ```

 ## Workflow

 1. Preserve request.
 2. Build master blueprint.
 3. Split into domain shards.
 4. Write orchestration map.
 5. Implement shard by shard.
 6. Verify before moving on.

 In REASP, the typical usage is:

 - use **Ryou EFI Planner** for the packet and planning,
 - switch to **Ryou Orchestrator** for implementation.
