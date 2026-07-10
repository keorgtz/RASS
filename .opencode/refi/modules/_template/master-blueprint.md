# Master Blueprint · <Module Name>

## 1. Problem Statement

<!-- 1–3 paragraphs framing the user's request. -->

## 2. Goal

<!-- 1 paragraph stating the outcome. -->

## 3. Core Design Principles

<!-- 3–5 bullets that capture the design intent. -->

- …

## 4. Conceptual Architecture

<!-- ASCII diagram showing the moving parts. -->

```text
…
```

## 5. New REFI v2 Packet Structure (if introducing any)

```text
…
```

## 6. Workflow (Three Passes)

| Pass | Action | Output | Wait? |
|------|--------|--------|-------|
| 1    | Epic Breakdown | `request.md`, `master-blueprint.md`, `epics/matrix.md`, EPIC READMEs | **YES** |
| 2    | PART Detail (per EPIC) | `epics/<epic>/parts/PARTnn.md` | **YES** (between EPICs) |
| 3    | Orchestration & Hand-off | `orchestration-map.md`, `progress.md`, `verification.md` | no |

## 7. PART Template · 15 Sections

<!-- Reference to templates/part-template.md. Inline reminder of N/A rules. -->

## 8. The 8 Gates (per PART)

<!-- Reference to rules/quality-gates.md v2. -->

## 9. Interaction with RASS Phases (unchanged)

- RASS phases execute INSIDE each PART, chosen by the active ModeProfile.
- Epic/PART is the OUTER planning layer; RASS is the INNER execution layer.

## 10. Affected Layers

| Layer | Change |
|-------|--------|
| … | … |

## 11. Persistence / Configuration Impact

- …

## 12. UI / UX Surfaces

- …

## 13. Risks and Anti-Patterns

| Risk | Mitigation |
|------|------------|
| … | … |

## 14. Execution Shards (= EPICs of this packet)

<!-- This is the section that drives Pass 1 output. -->

1. **EPIC <NN> — <name>** — short description.
2. **EPIC <NN> — <name>** — short description.
3. …

Total: N EPICs · ~M PARTs · ~X sesiones.

## 15. Verification Strategy

The 8-gate cycle applies to every PART. At the packet level, see
`verification.md` template for the aggregation.

## 16. Open Questions

- …

## 17. Excluded From This Packet

- …
