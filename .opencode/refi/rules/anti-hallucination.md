# REFI Anti-Hallucination Rules (v2)

> Companion to `rules/epic-glossary.md` (terms) and `rules/quality-gates.md` (8
> gates). v2 extends the original 4 invariants with PART-specific anchors that
> reduce hallucinations during planning and execution.

## 1 · Core Invariants (unchanged from v1)

Never invent:

- business requirements not requested,
- unnecessary infrastructure,
- tables, endpoints, screens, or jobs with no direct need,
- placeholder classes with no real consumer.

Ground decisions in:

- the original request,
- the current project stack,
- existing conventions,
- actual workflows,
- MeridianUI when UI is involved.

## 2 · Extensions for REFI v2 PARTs

These clauses bind the planner and the orchestrator at specific PART sections.
Violating any clause is grounds for rejecting the PART.

### Section 3 · Comparison against baseline (mandatory)

- Every PART must cite concrete files, classes, functions, lines, or URLs from the
  codebase / a competitor / a published standard.
- If no comparable baseline exists, the section MUST read exactly
  `N/A — greenfield` followed by a single-line justification.
- Generic phrases such as "industry standard", "best practice", or "modern approach"
  are NOT baselines and are rejected.

### Section 9 · Required Improvements

- Bullets must combine **verb + object + measurable outcome**.
- ❌ `Improve performance.`
- ✅ `Reduce p95 query latency on `SalesReport` from 850 ms to < 250 ms.`

### Section 10 · Implementation Plan

- Files referenced must exist in the repository or be explicitly declared as
  `NEW FILE: <path>` with the intended namespace.
- If a section is truly `N/A`, justify in one line ("N/A — declarative spec; no
  code yet").

### Section 15 · Acceptance Criteria

- Every bullet must be **testable** via a script, a test, a command, a screenshot
  comparison, or a structured visual inspection.
- Bullets that cannot be verified ("code is clean", "looks good") are rejected and
  must be rewritten before the PART is accepted.

### Inventory Forbidden (always)

Never invent — and never let an LLM invent:

- database tables / columns not declared by the user.
- HTTP endpoints, jobs, or scheduled tasks without explicit need.
- Services, classes, interfaces with no real consumer.
- Configuration keys without backing schema.
- Documentation files that are placeholders.

If something is genuinely unknown, the planner/orchestrator MUST mark:

```md
UNKNOWN — investigate before implementing
```

…and list the bullet in section 9 (`Required Improvements`) of the same PART.

## 3 · Self-Check Before Submitting a PART

Before writing the PART's footer, the planner/orchestrator MUST verify:

- [ ] Section 3 has at least one concrete reference OR a justified `N/A — greenfield`.
- [ ] Section 9 uses verb-object-measurement bullets.
- [ ] Section 10 names files that exist or are explicitly `NEW FILE`.
- [ ] Section 15 has only testable bullets.
- [ ] No invented tables / endpoints / services / configs anywhere in the PART.
- [ ] Unknown items are marked `UNKNOWN — investigate` and listed in §9.

PARTs that fail any of the above are returned to the planner for revision
(`planning-incomplete` state) and MUST NOT advance to execution.
