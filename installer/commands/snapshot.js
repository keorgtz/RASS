/**
 * REASP Installer — Snapshot subcommand handler.
 *
 * Parses `reasp snapshot <create|list|restore|delete|purge>` and delegates
 * to `lib/snapshot-manager.js`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { TARGETS } from '../lib/targets/index.js';
import { detectAllAgents } from '../lib/detect.js';
import { loadReaspConfig } from '../lib/config-manager.js';
import {
  createSnapshot,
  listSnapshots,
  restoreSnapshot,
  deleteSnapshot,
  purgeSnapshots,
  getSnapshotDir,
  formatBytes,
} from '../lib/snapshot-manager.js';
import { isAgentProcessRunning } from '../lib/safety.js';
import {
  printSuccess,
  printWarning,
  printError,
  printInfo,
  printHeader,
  promptSelectAgent,
  promptSnapshotSelection,
  promptSnapshotName,
  promptSnapshotNote,
  confirm,
  isCancel,
  THEME,
  ICONS,
} from '../lib/tui.js';

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function buildContext() {
  return {
    homeDir: process.env.USERPROFILE || process.env.HOME,
  };
}

function parseAgentFlag(flags) {
  return flags.agent || flags.a || null;
}

function parseYesFlag(flags) {
  return !!flags.yes || !!flags.y;
}

function looksLikeSnapshotId(value) {
  return /^\d{4}-\d{2}-\d{2}T\d{6}Z-/.test(String(value));
}

function resolveSnapshotId(ctx, agentId, nameOrId) {
  if (!nameOrId) return null;

  const text = String(nameOrId).trim();
  if (looksLikeSnapshotId(text)) {
    const metadataPath = path.join(getSnapshotDir(ctx, agentId, text), 'snapshot.json');
    if (fs.existsSync(metadataPath)) {
      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        return { snapshotId: text, metadata };
      } catch {
        return null;
      }
    }
  }

  const snapshots = listSnapshots(ctx, agentId);
  const match = snapshots.find((s) => s.name === text);
  if (match) {
    return { snapshotId: match.id, metadata: match };
  }

  return null;
}

async function resolveAgentId(flags) {
  let agentId = parseAgentFlag(flags);
  if (agentId) return agentId;

  const detectedAgents = detectAllAgents();
  agentId = await promptSelectAgent(detectedAgents, false);
  if (!agentId) {
    printWarning('No agent selected.');
    process.exit(0);
  }
  return agentId;
}

function validateAgent(agentId) {
  if (!TARGETS[agentId]) {
    printError(`Unknown agent target: ${agentId}`);
    process.exit(1);
  }
}

function renderSnapshotTable(snapshots) {
  if (snapshots.length === 0) {
    printInfo('No snapshots found.');
    return;
  }

  const rows = snapshots.map((s) => ({
    agent: s.agentDisplayName || s.agentId,
    name: s.name,
    created: new Date(s.createdAt).toLocaleString(),
    size: formatBytes(s.sizeBytes),
    files: s.fileCount,
  }));

  const widths = {
    agent: Math.max(12, ...rows.map((r) => r.agent.length)),
    name: Math.max(10, ...rows.map((r) => r.name.length)),
    created: Math.max(18, ...rows.map((r) => r.created.length)),
    size: Math.max(8, ...rows.map((r) => r.size.length)),
    files: 5,
  };

  const header = [
    'Agent'.padEnd(widths.agent),
    'Name'.padEnd(widths.name),
    'Created'.padEnd(widths.created),
    'Size'.padStart(widths.size),
    'Files'.padStart(widths.files),
  ].join('  ');

  console.log(`  ${THEME.dim(header)}`);
  for (const row of rows) {
    const line = [
      row.agent.padEnd(widths.agent),
      row.name.padEnd(widths.name),
      row.created.padEnd(widths.created),
      row.size.padStart(widths.size),
      String(row.files).padStart(widths.files),
    ].join('  ');
    console.log(`  ${line}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMMANDS
// ═══════════════════════════════════════════════════════════════════════════════

async function cmdSnapshotCreate(ctx, flags) {
  let agentId = parseAgentFlag(flags);
  if (!agentId) {
    const detectedAgents = detectAllAgents();
    agentId = await promptSelectAgent(detectedAgents, false);
    if (!agentId) {
      printWarning('No agent selected.');
      return;
    }
  }
  validateAgent(agentId);

  const yes = parseYesFlag(flags);

  let name = flags.name || flags.n || null;
  if (!name) {
    if (yes) {
      name = `snapshot-${new Date().toISOString().replace(/[:.]/g, '-')}`;
    } else {
      name = await promptSnapshotName();
      if (!name) return;
    }
  }

  let note = flags.note || '';
  if (!note && !yes) {
    note = (await promptSnapshotNote()) || '';
  }

  const force = !!flags.force;

  const target = TARGETS[agentId];
  const sourceDir = target.getGlobalDir(ctx);

  if (!fs.existsSync(sourceDir)) {
    if (force) {
      printWarning(`Source directory does not exist; creating empty baseline: ${sourceDir}`);
      fs.mkdirSync(sourceDir, { recursive: true });
    } else {
      printError(`Source directory does not exist: ${sourceDir}`);
      printInfo('Use --force to snapshot an empty baseline anyway.');
      process.exit(1);
    }
  }

  if (!yes) {
    const confirmed = await confirm({
      message: `Create snapshot "${name}" for ${target.displayName}?`,
      initialValue: true,
    });
    if (isCancel(confirmed) || !confirmed) {
      printWarning('Cancelled');
      return;
    }
  }

  const result = createSnapshot(ctx, agentId, name, note);
  if (!result.success) {
    printError(result.message);
    process.exit(1);
  }

  // Optionally prune older snapshots if the user configured a limit.
  const config = loadReaspConfig(ctx);
  if (config.maxSnapshotsPerAgent > 0) {
    purgeSnapshots(ctx, agentId, config.maxSnapshotsPerAgent);
  }

  printSuccess(`Snapshot created: ${result.metadata.name} (${result.metadata.id})`);
  printInfo(`Files: ${result.metadata.fileCount} · Size: ${formatBytes(result.metadata.sizeBytes)}`);
  printInfo(`Path: ${result.metadata.dataPath}`);
}

async function cmdSnapshotList(ctx, flags) {
  const agentId = parseAgentFlag(flags);
  const snapshots = listSnapshots(ctx, agentId);

  if (flags.json) {
    console.log(JSON.stringify(snapshots, null, 2));
    return;
  }

  printHeader('Snapshots');
  renderSnapshotTable(snapshots);
}

async function cmdSnapshotRestore(ctx, flags) {
  const agentId = await resolveAgentId(flags);
  validateAgent(agentId);

  const nameOrId = flags.id || flags.name || flags.n || null;
  if (!nameOrId) {
    const snapshots = listSnapshots(ctx, agentId);
    const selected = await promptSnapshotSelection(snapshots);
    if (!selected) {
      printWarning('No snapshot selected.');
      return;
    }
    return restoreById(ctx, agentId, selected, flags);
  }

  const resolved = resolveSnapshotId(ctx, agentId, nameOrId);
  if (!resolved) {
    printError(`Snapshot not found: ${nameOrId}`);
    process.exit(1);
  }

  return restoreById(ctx, agentId, resolved.snapshotId, flags);
}

async function restoreById(ctx, agentId, snapshotId, flags) {
  const yes = parseYesFlag(flags || {});
  const target = TARGETS[agentId];

  if (isAgentProcessRunning(agentId)) {
    printWarning(`${target.displayName} appears to be running.`);
    printInfo('Close the agent before restoring to avoid conflicts.');
  }

  if (!yes) {
    const confirmed = await confirm({
      message: `Restore snapshot "${snapshotId}" over ${target.displayName}'s live config?`,
      initialValue: false,
    });
    if (isCancel(confirmed) || !confirmed) {
      printWarning('Cancelled');
      return;
    }
  }

  const result = restoreSnapshot(ctx, agentId, snapshotId);
  if (!result.success) {
    printError(result.message);
    process.exit(1);
  }

  printSuccess(result.message);
}

async function cmdSnapshotDelete(ctx, flags) {
  const agentId = await resolveAgentId(flags);
  validateAgent(agentId);

  const nameOrId = flags.id || flags.name || flags.n || null;
  let snapshotId;

  if (!nameOrId) {
    const snapshots = listSnapshots(ctx, agentId);
    snapshotId = await promptSnapshotSelection(snapshots);
    if (!snapshotId) {
      printWarning('No snapshot selected.');
      return;
    }
  } else {
    const resolved = resolveSnapshotId(ctx, agentId, nameOrId);
    if (!resolved) {
      printError(`Snapshot not found: ${nameOrId}`);
      process.exit(1);
    }
    snapshotId = resolved.snapshotId;
  }

  const yes = parseYesFlag(flags);
  if (!yes) {
    const confirmed = await confirm({
      message: `Permanently delete snapshot "${snapshotId}"?`,
      initialValue: false,
    });
    if (isCancel(confirmed) || !confirmed) {
      printWarning('Cancelled');
      return;
    }
  }

  const result = deleteSnapshot(ctx, agentId, snapshotId);
  if (!result.success) {
    printError(result.message);
    process.exit(1);
  }

  printSuccess(result.message);
}

async function cmdSnapshotPurge(ctx, flags) {
  const config = loadReaspConfig(ctx);
  let keep = parseInt(flags.keep, 10);
  if (Number.isNaN(keep)) {
    keep = config.maxSnapshotsPerAgent > 0 ? config.maxSnapshotsPerAgent : 5;
  }

  if (flags['all-agents']) {
    const yes = parseYesFlag(flags);
    if (!yes) {
      const confirmed = await confirm({
        message: `Purge snapshots for all agents, keeping the newest ${keep}?`,
        initialValue: false,
      });
      if (isCancel(confirmed) || !confirmed) {
        printWarning('Cancelled');
        return;
      }
    }

    const allSnapshots = listSnapshots(ctx);
    const agentIds = [...new Set(allSnapshots.map((s) => s.agentId))];
    let totalDeleted = 0;
    for (const agentId of agentIds) {
      const result = purgeSnapshots(ctx, agentId, keep);
      if (result.success) {
        totalDeleted += result.deleted.length;
      }
    }
    printSuccess(`Purged ${totalDeleted} snapshot(s) across ${agentIds.length} agent(s).`);
    return;
  }

  const agentId = await resolveAgentId(flags);
  validateAgent(agentId);

  const yes = parseYesFlag(flags);
  if (!yes) {
    const confirmed = await confirm({
      message: `Purge snapshots for ${TARGETS[agentId].displayName}, keeping the newest ${keep}?`,
      initialValue: false,
    });
    if (isCancel(confirmed) || !confirmed) {
      printWarning('Cancelled');
      return;
    }
  }

  const result = purgeSnapshots(ctx, agentId, keep);
  if (!result.success) {
    printError(result.message);
    process.exit(1);
  }

  printSuccess(result.message);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENTRYPOINT
// ═══════════════════════════════════════════════════════════════════════════════

export default async function cmdSnapshot(args, flags) {
  const ctx = buildContext();
  const subcommand = (args[0] || '').toLowerCase();

  switch (subcommand) {
    case 'create':
      await cmdSnapshotCreate(ctx, flags);
      break;
    case 'list':
      await cmdSnapshotList(ctx, flags);
      break;
    case 'restore':
      await cmdSnapshotRestore(ctx, flags);
      break;
    case 'delete':
      await cmdSnapshotDelete(ctx, flags);
      break;
    case 'purge':
      await cmdSnapshotPurge(ctx, flags);
      break;
    default:
      printHeader('Snapshot commands');
      console.log(`  ${THEME.success('reasp snapshot create')}  --agent <id> --name <name> [--note <text>] [--yes]`);
      console.log(`  ${THEME.info('reasp snapshot list')}     [--agent <id>] [--json]`);
      console.log(`  ${THEME.warning('reasp snapshot restore')}  --agent <id> --name|--id <value> [--yes]`);
      console.log(`  ${THEME.error('reasp snapshot delete')}   --agent <id> --name|--id <value> [--yes]`);
      console.log(`  ${THEME.error('reasp snapshot purge')}    --agent <id>|--all-agents [--keep <n>] [--yes]`);
      process.exit(subcommand === '--help' || subcommand === '-h' ? 0 : 1);
  }
}
