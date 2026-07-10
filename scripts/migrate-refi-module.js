#!/usr/bin/env node
/**
 * REFI v2 — Optional migration helper.
 *
 * Input:  .refi/modules/<slug>/   (legacy shape: master-blueprint.md + domain-shards/01-*.md)
 * Output: .refi/modules/<slug>-v2/ (v2 shape: epics/<epic>/parts/PARTnn.md + 8 gates footer)
 *
 * Behaviour:
 *  - Pure function: deterministic.
 *  - NEVER overwrites the original.
 *  - Creates a NEW folder with the migrated packet.
 *  - If the source shape does not match legacy, refuses and prints an error.
 *
 * Sections §3 (Comparison) and §15 (Acceptance Criteria) CANNOT be auto-derived
 * from a 7-section shard. The helper marks them with placeholders and the user
 * MUST fill them by hand.
 *
 * Usage:
 *   node scripts/migrate-refi-module.js <slug> [--dry-run] [--output=<new-slug>]
 *
 * Examples:
 *   node scripts/migrate-refi-module.js reasp-backup-manager --dry-run
 *   node scripts/migrate-refi-module.js reasp-backup-manager --output=reasp-backup-manager-v2
 *
 * Exit codes:
 *   0  success (or dry-run completed)
 *   1  bad arguments
 *   2  source packet not found or not in legacy shape
 *   3  write error
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----- argument parsing (stdlib only) -------------------------------------

function parseArgs(argv) {
  const args = { slug: null, dryRun: false, output: null, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--help' || a === '-h') args.help = true;
    else if (a.startsWith('--output=')) args.output = a.slice('--output='.length);
    else if (!args.slug) args.slug = a;
    else {
      process.stderr.write(`migrate-refi-module: unknown argument: ${a}\n`);
      process.exit(1);
    }
  }
  return args;
}

function printHelp() {
  process.stdout.write(
    [
      'REFI v2 — legacy packet migration helper',
      '',
      'Usage:',
      '  node scripts/migrate-refi-module.js <slug> [--dry-run] [--output=<new-slug>]',
      '',
      'Options:',
      '  --dry-run           print the plan without writing files',
      '  --output=<slug>     output slug (default: <slug>-v2)',
      '  --help, -h          show this help',
      '',
      'Behaviour:',
      '  - Reads .refi/modules/<slug>/ as legacy.',
      '  - Writes a new packet under .refi/modules/<output>/ in v2 (Epic + PART) shape.',
      '  - NEVER touches the original.',
      '  - Sections §3 (Comparison) and §15 (Acceptance Criteria) require manual filling.',
      '',
    ].join('\n')
  );
}

// ----- path helpers --------------------------------------------------------

function refiRoot() {
  // scripts/ lives next to .refi/. Resolve relative to this file.
  return path.resolve(__dirname, '..', '.refi');
}

function sourceDir(slug) {
  return path.join(refiRoot(), 'modules', slug);
}

// ----- legacy packet detection ---------------------------------------------

function isLegacyShape(slug) {
  const root = sourceDir(slug);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) return false;
  const hasMaster = fs.existsSync(path.join(root, 'master-blueprint.md'));
  const hasDomainShards = fs.existsSync(path.join(root, 'domain-shards'));
  return hasMaster && hasDomainShards;
}

function listLegacyShards(slug) {
  const dir = path.join(sourceDir(slug), 'domain-shards');
  return fs
    .readdirSync(dir)
    .filter((f) => /^\d{2}-.*\.md$/i.test(f))
    .sort();
}

// ----- v2 packet synthesis -------------------------------------------------

function partTemplate(n, name, body) {
  return `# PART${String(n).padStart(2, '0')} — ${name}

> **EPIC:** 00-legacy-shards · **Priority:** P0 (migrated) · **Complexity:** M
> **Status:** Migrated from legacy shard ${name}
>
> Sections 2, 3, 5, 7, 8 may be marked \`N/A — greenfield\` / \`N/A — no UI\` per
> the canonical rules in \`.opencode/refi/rules/epic-glossary.md\` §3.

## 1. Purpose

${body.purpose || 'TODO — fill from legacy shard "Objective" / "Included Work".'}

## 2. Current State

TODO — fill from legacy shard (often "Files/Areas Likely Affected" or new).

## 3. Comparison against baseline

TODO — fill with real files / classes / lines from the codebase, or
\`N/A — greenfield\` with justification. **Cannot be auto-derived from a legacy shard.**

## 4. Missing / Required Scope

TODO — fill from legacy shard "Included Work" + any gaps not in the shard.

## 5. UX Problems

N/A — confirm during execution if UI surface exists.

## 6. Backend / Logic Problems

TODO — fill from legacy shard "Hard Rules" + "Implementation Notes".

## 7. Frontend / Presentation Problems

N/A — confirm during execution if UI surface exists.

## 8. Technical Debt

TODO — review against actual code.

## 9. Required Improvements

TODO — derive from legacy shard "Included Work" using verb + object + measurable outcome.

## 10. Implementation Plan

${body.implementation || 'TODO — fill from legacy shard "Implementation Notes" + "Files/Areas Likely Affected".'}

## 11. Automated Test Plan

TODO — fill from legacy shard "Verification Before Advancing".

## 12. Manual Validation Checklist

TODO — fill from legacy shard "Verification Before Advancing".

## 13. Technical Documentation to produce

TODO — list any docs the legacy shard referenced but did not produce.

## 14. User Documentation to produce

TODO — list user docs this PART enables.

## 15. Acceptance Criteria

TODO — **Cannot be auto-derived from a legacy shard.** Write testable bullets:
each one must run via script, test, command, or visual inspection.

---

## Gates Evidence

- Gate 1 (Architecture Review): pending (manual).
- Gate 2 (Scope & Completeness Audit): pending (manual).
- Gate 3 (UX/Design Review): N/A — confirm during execution.
- Gate 4 (Manual / Runtime Validation): pending (manual).
- Gate 5 (Defect Closure): pending (manual).
- Gate 6 (Technical Documentation): pending (manual).
- Gate 7 (User Documentation): pending (manual).
- Gate 8 (Final Review & Sign-off): pending (manual).

**Signed by:** _______________  **Date:** _______________
`;
}

function extractShardBody(slug, shardFile) {
  const text = fs.readFileSync(path.join(sourceDir(slug), 'domain-shards', shardFile), 'utf8');
  const objectiveMatch = text.match(/## Objective\s+([\s\S]*?)(?=\n##\s|\n*$)/);
  const implMatch = text.match(/## Implementation Notes\s+([\s\S]*?)(?=\n##\s|\n*$)/);
  return {
    purpose: objectiveMatch ? objectiveMatch[1].trim() : '',
    implementation: implMatch ? implMatch[1].trim() : '',
  };
}

function buildEpicReadme(slug, shardCount) {
  const lines = Array.from(
    { length: shardCount },
    (_, i) =>
      `- PART${String(i + 1).padStart(2, '0')}_* — derivado del shard \`${String(i + 1).padStart(2, '0')}-*.md\` legacy.`
  );
  return `# EPIC 00 — Legacy Shards (migrated)

**Prioridad:** P0 · **Complejidad:** M ·
**Completitud (8 puertas):** 0 % · **Estado:** Backlog (migrated from ${slug})

## Alcance

Contenedor de los PARTs migrados del packet legacy \`.refi/modules/${slug}/\`.
Cada PART corresponde 1:1 a un shard \`NN-*.md\` del legacy.

## Objetivos

1. Migrar la planificación del packet legacy a la estructura Epic + PART.
2. Rellenar manualmente las secciones §3 (Comparison) y §15 (Acceptance Criteria)
   para cada PART — no son auto-derivables de un shard de 7 secciones.

## Dependencias

- **Entrantes:** packet legacy \`.refi/modules/${slug}/\`.
- **Salientes:** ninguna.

## Complejidad y prioridad

- **Complejidad M:** ${shardCount} PARTs generados; contenido manual por completar.
- **P0 migrado:** mantener trazabilidad con el legacy mientras se rellena a mano.

## Files to Modify / Create

- \`epics/00-legacy-shards/parts/PART01_*.md\` … \`PART${String(shardCount).padStart(2, '0')}_*.md\` (NEW).
- \`epics/00-legacy-shards/README.md\` (NEW — este archivo).

## PARTs planificados

${lines.join('\n')}

## Definición de Done

EPIC cerrado cuando todos los PARTs tienen §3 (Comparison) y §15 (Acceptance
Criteria) rellenadas a mano y los 8 gates firmados en sus footers.
`;
}

function buildMatrix(slug, shardCount) {
  return `# Epic Matrix · ${slug} (migrated)

| # | Epic | Prioridad | Depende de | Complejidad | Duración | % | Estado |
|---|---|---|---|---|---|---|---|
| 1 | Legacy Shards (migrated) | P0 | — | M | ${shardCount} | 0 % | Backlog (migrated) |

**Total:** 1 EPIC · ${shardCount} PARTs · ~${shardCount} sesiones de trabajo.
`;
}

function buildRequest(slug) {
  return `# Request · ${slug} (migrated)

> Migrated from legacy packet \`.refi/modules/${slug}/\`. The original request lives
> in the legacy \`request.md\`; this file is a placeholder until the user refreshes it.
`;
}

function buildOrchestrationMap(slug, shardCount) {
  return `# Orchestration Map · ${slug} (migrated)

> Single EPIC. ${shardCount} PARTs in order.

## Execution Order

\`\`\`text
EPIC 00 — Legacy Shards
  → PART01 → PART02 → … → PART${String(shardCount).padStart(2, '0')}
\`\`\`

## Stop Conditions

- A PART cannot be \`Terminated\` without §3, §15, and 8 gates signed.
`;
}

function buildProgress(slug) {
  return `# Progress · ${slug} (migrated)

- Initial state: just migrated. All PARTs marked Backlog.
`;
}

function buildVerification(slug, shardCount) {
  const parts = Array.from({ length: shardCount }, (_, i) => {
    return `### PART${String(i + 1).padStart(2, '0')}

- Gate 1: pending
- Gate 2: pending
- Gate 3: pending (N/A — confirm UI)
- Gate 4: pending
- Gate 5: pending
- Gate 6: pending
- Gate 7: pending
- Gate 8: pending

**Signed by:** ____  **Date:** ____
`;
  });
  return `# Verification · ${slug} (migrated)

> Mirrors the 8-gate footer of each PART.

## EPIC 00 — Legacy Shards

${parts.join('\n')}

## Aggregated Gates

- PARTs: ${shardCount}
- Gates expected: ${shardCount * 8}
`;
}

// ----- file writer (atomic) ------------------------------------------------

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeFile(p, content) {
  ensureDir(path.dirname(p));
  const tmp = p + '.tmp';
  fs.writeFileSync(tmp, content, 'utf8');
  fs.renameSync(tmp, p);
}

// ----- main flow ------------------------------------------------------------

function buildPlan(slug) {
  if (!isLegacyShape(slug)) return null;
  const shards = listLegacyShards(slug);
  return {
    slug,
    outputSlug: slug + '-v2',
    shardCount: shards.length,
    shards,
  };
}

function run(args) {
  if (args.help) {
    printHelp();
    return 0;
  }
  if (!args.slug) {
    process.stderr.write('migrate-refi-module: missing <slug>\n');
    printHelp();
    return 1;
  }

  const plan = buildPlan(args.slug);
  if (!plan) {
    process.stderr.write(
      `migrate-refi-module: '${args.slug}' is not a legacy REFI packet.\n` +
        `Expected: .refi/modules/${args.slug}/master-blueprint.md + domain-shards/.\n`
    );
    return 2;
  }

  const outputSlug = args.output || plan.outputSlug;
  const out = path.join(refiRoot(), 'modules', outputSlug);

  process.stdout.write(`migrate-refi-module: source = .refi/modules/${args.slug}/\n`);
  process.stdout.write(`migrate-refi-module: output = ${out}\n`);
  process.stdout.write(`migrate-refi-module: legacy shards = ${plan.shardCount}\n`);

  if (args.dryRun) {
    process.stdout.write('\n--- DRY RUN · no files written ---\n');
    process.stdout.write('Planned files:\n');
    process.stdout.write(`  ${outputSlug}/request.md\n`);
    process.stdout.write(`  ${outputSlug}/epics/matrix.md\n`);
    process.stdout.write(`  ${outputSlug}/epics/00-legacy-shards/README.md\n`);
    process.stdout.write(
      `  ${outputSlug}/epics/00-legacy-shards/parts/PART01..${String(plan.shardCount).padStart(2, '0')}_*.md\n`
    );
    process.stdout.write(`  ${outputSlug}/orchestration-map.md\n`);
    process.stdout.write(`  ${outputSlug}/progress.md\n`);
    process.stdout.write(`  ${outputSlug}/verification.md\n`);
    return 0;
  }

  try {
    writeFile(path.join(out, 'request.md'), buildRequest(args.slug));
    writeFile(path.join(out, 'epics', 'matrix.md'), buildMatrix(args.slug, plan.shardCount));
    writeFile(
      path.join(out, 'epics', '00-legacy-shards', 'README.md'),
      buildEpicReadme(args.slug, plan.shardCount)
    );
    for (let i = 0; i < plan.shards.length; i++) {
      const shardFile = plan.shards[i];
      const shardBase = shardFile.replace(/^\d{2}-/, '').replace(/\.md$/, '');
      const partName = `${String(i + 1).padStart(2, '0')}_${shardBase}`;
      const body = extractShardBody(args.slug, shardFile);
      writeFile(
        path.join(out, 'epics', '00-legacy-shards', 'parts', `PART${partName}.md`),
        partTemplate(i + 1, shardBase, body)
      );
    }
    writeFile(
      path.join(out, 'orchestration-map.md'),
      buildOrchestrationMap(args.slug, plan.shardCount)
    );
    writeFile(path.join(out, 'progress.md'), buildProgress(args.slug));
    writeFile(path.join(out, 'verification.md'), buildVerification(args.slug, plan.shardCount));
  } catch (err) {
    process.stderr.write(`migrate-refi-module: write error: ${err.message}\n`);
    return 3;
  }

  process.stdout.write(`\nmigrate-refi-module: done. ${plan.shardCount} PARTs migrated.\n`);
  process.stdout.write(
    `\nNext steps (manual):\n` +
      `  1. Fill §3 (Comparison) and §15 (Acceptance Criteria) in each PART.\n` +
      `  2. Fill §9 (Required Improvements) using verb + object + measurable outcome.\n` +
      `  3. Walk the 8 gates per PART and sign each footer.\n` +
      `  4. When all PARTs are Terminated, the legacy '${args.slug}' can be archived.\n`
  );
  return 0;
}

process.exit(run(parseArgs(process.argv.slice(2))));