# Verification · REASP Global CLI + Backup Manager

## Pre-Verification Conditions

- All shards implemented.
- `reasp` command available globally after `npm install -g .`.
- At least two agents are available for snapshot testing (e.g., OpenCode and Claude Code).

## Gate 1 · Global CLI Installation

**Objective:** Prove `reasp` is callable from anywhere.

**Steps:**

1. From the repo root, run `npm install -g .`.
2. Open a new terminal in a different directory.
3. Run `reasp --help`.
4. Run `reasp detect`.

**Pass Criteria:** Commands execute without errors and show expected output.

## Gate 2 · Snapshot Create

**Objective:** Prove snapshots are created with correct metadata and complete data.

**Steps:**

1. Run `reasp snapshot create --agent claude-code --name clean --yes`.
2. Inspect `~/.reasp/snapshots/claude-code/<id>-clean/`.
3. Verify `snapshot.json` fields.
4. Verify `data/` contains a complete copy of `~/.claude/`.

**Pass Criteria:** Snapshot directory exists, metadata valid, data complete.

## Gate 3 · Snapshot Restore

**Objective:** Prove restore recovers the agent state.

**Steps:**

1. Create a file `~/.claude/test-reasp-restore.txt`.
2. Run `reasp snapshot create --agent claude-code --name with-test-file --yes`.
3. Delete `~/.claude/test-reasp-restore.txt`.
4. Run `reasp snapshot restore --agent claude-code --name with-test-file --yes`.
5. Verify the file is back.

**Pass Criteria:** File restored successfully.

## Gate 4 · Snapshot Delete

**Objective:** Prove snapshots can be removed.

**Steps:**

1. Run `reasp snapshot list --agent claude-code` and note an existing snapshot.
2. Run `reasp snapshot delete --agent claude-code --name <name> --yes`.
3. Run `reasp snapshot list --agent claude-code` again.

**Pass Criteria:** Snapshot no longer listed.

## Gate 5 · Pre-Install Snapshot Prompt

**Objective:** Prove install offers to snapshot first.

**Steps:**

1. Run `reasp install --agents claude-code` interactively.
2. Accept the snapshot prompt.
3. Verify a snapshot is created before installation proceeds.

**Pass Criteria:** Snapshot created and install continues.

## Gate 6 · Atomic Restore Failure

**Objective:** Prove restore failure does not corrupt live config.

**Steps:**

1. Create a snapshot of `~/.claude/`.
2. Simulate a failure during restore (e.g., make live dir read-only or inject an error in a test environment).
3. Run restore and confirm rollback leaves live dir unchanged.

**Pass Criteria:** Live config remains intact after failed restore.

## Gate 7 · Documentation Accuracy

**Objective:** Prove README examples work.

**Steps:**

1. A second person follows README to install `reasp` globally.
2. That person creates and restores a snapshot using only README instructions.

**Pass Criteria:** No blocking ambiguities.

## Verification Results (Initial Run)

Tests executed in isolated temp home directories and a temporary npm prefix:

- **Gate 1 · Global CLI Installation**: ✅ Passed — `npm install -g . --prefix <temp>` succeeded; `reasp --version` returned `1.0.0`; `reasp detect` listed agents correctly.
- **Gate 2 · Snapshot Create**: ✅ Passed — `reasp snapshot create --agent claude-code --name clean --yes` produced a snapshot with valid metadata and complete data copy.
- **Gate 3 · Snapshot Restore**: ✅ Passed — After mutating `~/.claude/CLAUDE.md`, restore returned it to the original content.
- **Gate 4 · Snapshot Delete**: ✅ Passed — `reasp snapshot delete --agent claude-code --name clean --yes` removed the snapshot.
- **Gate 5 · Pre-Install Snapshot Prompt**: ⏳ Not tested in live TUI; flag `--skip-snapshot` wired and auto-snapshot code present.
- **Gate 6 · Atomic Restore Failure**: ⏳ Not stress-tested; rollback code implemented in `lib/safety.js`.
- **Gate 7 · Documentation Accuracy**: ⏳ Pending human review.

## Final Sign-Off

- [x] Gate 1 passed
- [x] Gate 2 passed
- [x] Gate 3 passed
- [x] Gate 4 passed
- [ ] Gate 5 passed
- [ ] Gate 6 passed
- [ ] Gate 7 passed

**Signed by:** _______________  **Date:** _______________
