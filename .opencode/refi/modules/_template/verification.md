# Verification · <Module Name>

> Strategy: the **8-gate cycle** (Architecture · Scope · UX · Manual · Defect Closure
> · Tech Doc · User Doc · Sign-off) is applied **per PART**. This page aggregates
> results at the packet level. Each PART's footer is the canonical record; this
> file mirrors those footers in a single readable page.

## EPIC <NN> — <Name>

### PART01 — <Name>

- Gate 1 (Architecture Review): <evidence-link-or-path>
- Gate 2 (Scope & Completeness Audit): <evidence-link-or-path>
- Gate 3 (UX/Design Review): <evidence-link-or-path or N/A — no UI>
- Gate 4 (Manual / Runtime Validation): <evidence-link-or-path>
- Gate 5 (Defect Closure): <evidence-link-or-path>
- Gate 6 (Technical Documentation): <evidence-link-or-path or N/A — section 13 = none>
- Gate 7 (User Documentation): <evidence-link-or-path or N/A — section 14 = none>
- Gate 8 (Final Review & Sign-off): build 0/0 + suite green + Acceptance Criteria ticked

**Signed by:** _______________  **Date:** _______________

### PART02 — <Name>

- Gate 1 (Architecture Review): <evidence-link-or-path>
- Gate 2 (Scope & Completeness Audit): <evidence-link-or-path>
- Gate 3 (UX/Design Review): <evidence-link-or-path or N/A — no UI>
- Gate 4 (Manual / Runtime Validation): <evidence-link-or-path>
- Gate 5 (Defect Closure): <evidence-link-or-path>
- Gate 6 (Technical Documentation): <evidence-link-or-path or N/A — section 13 = none>
- Gate 7 (User Documentation): <evidence-link-or-path or N/A — section 14 = none>
- Gate 8 (Final Review & Sign-off): build 0/0 + suite green + Acceptance Criteria ticked

**Signed by:** _______________  **Date:** _______________

## Aggregated Gates (packet level)

- **EPICs planned:** <N>
- **PARTs planned:** <M>
- **Total gates expected at packet completion:** `8 × M` = <8M>
- **Gates passed so far:** <X> of <8M>
- **PARTs `Terminado`:** <Y> of <M>
- **EPICs `Terminado`:** <Z> of <N>
- **Last update:** <date>
- **Status:** <planning-complete | execution-in-progress | finished>

## Packet-Level Gates (beyond per-PART)

### Gate A · Packet Contract Compliance

- [ ] `request.md` exists and matches the original user text.
- [ ] `master-blueprint.md` includes the EPIC breakdown.
- [ ] `epics/matrix.md` exists with all EPICs and 4 valid states per row.
- [ ] Each EPIC has `epics/<epic>/README.md` with all 9 sections.
- [ ] Each PART has 15 sections + footer of 8 gates.
- [ ] Orchestrator fills footers during execution.

### Gate B · Dual-Format Acceptance (Back-compat)

- [ ] All legacy packets still parse after enabling
      `epic_part.legacy_domain_shards_fallback: true` in `config.yaml`.

### Gate C · Worked-Example Validity

- [ ] Linter passes against the worked-example packet
      (`.refi/modules/example-todo-cli/` or equivalent).

### Gate D · Anti-Hallucination Cross-Reference

- [ ] Every PART §3 references a real artefact from the repo OR marks
      `N/A — greenfield` with justification.

## Final Sign-Off (packet)

- [ ] Gate A passed
- [ ] Gate B passed
- [ ] Gate C passed
- [ ] Gate D passed

**Signed by:** _______________  **Date:** _______________