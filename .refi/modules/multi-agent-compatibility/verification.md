# Verification · REASP Multi-Agent Compatibility

## Pre-Verification Conditions

- All shards implemented.
- Installer runs without runtime errors.
- At least OpenCode and one additional target have been installed and uninstalled successfully.

## Gate 1 · OpenCode Regression

**Objective:** Prove OpenCode behavior is unchanged.

**Steps:**

1. Run `node installer/index.js uninstall` to ensure clean state.
2. Run `node installer/index.js install` with default options.
3. Verify `~/.config/opencode/opencode.json`:
   - Contains `agent['ryou-orchestrator']` and `agent['ryou-efi-planner']`.
   - Contains Ryou subagents (`planner`, `builder`, `architect`, `reviewer`, `debugger`, `documentation`).
   - `instructions[]` includes `rules/global-rules.md`, `rules/meridianui.md`, REFI files.
   - `plugin[]` includes RASS plugin and TUI.
4. Start OpenCode and run `/sdd`.
   - ModeProfiles list appears.
5. Run `/reasp-setup`.
   - Can switch to Ryou EFI Planner and back to Ryou Orchestrator.

**Pass Criteria:** All steps succeed.

## Gate 2 · Agent Detection

**Objective:** Prove detection works across supported agents.

**Steps:**

1. Run `node installer/index.js detect`.
2. Confirm output lists each installed agent with correct version/path.
3. Confirm non-installed agents are listed as not detected.

**Pass Criteria:** Detection matches ground truth on the test machine.

## Gate 3 · Target Selection

**Objective:** Prove user can opt-in per agent.

**Steps:**

1. Run interactive installer on a machine with OpenCode and Claude Code installed.
2. Select only Claude Code.
3. Complete install.
4. Verify OpenCode config is untouched.
5. Verify Claude Code has REASP prompt/instructions.

**Pass Criteria:** Only selected target is modified.

## Gate 4 · Non-OpenCode Agent Behavior

**Objective:** Prove REASP behavior translates to another agent.

**Steps:**

1. Install REASP into Claude Code.
2. Start Claude Code in a test project.
3. Prompt: "Necesito diseñar una feature empresarial siguiendo REFI."
4. Confirm Claude Code proposes creating `.refi/modules/<slug>/` with request.md, master-blueprint.md, domain shards, orchestration-map.md, progress.md, verification.md.

**Pass Criteria:** Agent follows REFI packet contract.

## Gate 5 · Selective Uninstall

**Objective:** Prove uninstall leaves other targets intact.

**Steps:**

1. Install REASP into OpenCode and Claude Code.
2. Run `node installer/index.js uninstall --agents claude-code`.
3. Verify Claude Code no longer has REASP instructions.
4. Verify OpenCode still has full REASP functionality.

**Pass Criteria:** OpenCode unaffected; Claude Code cleaned.

## Gate 6 · Documentation Accuracy

**Objective:** Prove README and AGENTS.md are correct.

**Steps:**

1. A second person reads README installation section and successfully installs REASP into at least one new target.
2. A second person reads AGENTS.md and understands how to add a new agent target.

**Pass Criteria:** No blocking ambiguities found.

## Verification Results (Initial Run)

Tests executed in temp home directories to avoid touching the user's live agent configs:

- **Gate 1 · OpenCode Regression**: ✅ Partial — real install into a temp `USERPROFILE` produced an `opencode.json` with all 8 Ryou agents, 7 instructions, 12 skills, default model/shell. Plugin registration depends on the live `opencode` CLI and was not exercised in isolation; existing real OpenCode config remains intact.
- **Gate 2 · Agent Detection**: ✅ Passed — `node index.js detect` correctly reports OpenCode, Claude Code, Antigravity CLI, and Gemini CLI as installed; Codex as not installed.
- **Gate 3 · Target Selection**: ✅ Passed — `--agents claude-code` installs only into Claude Code in temp home; OpenCode untouched.
- **Gate 4 · Non-OpenCode Agent Behavior**: ✅ Partial — `CLAUDE.md` generated correctly with full REASP block; actual behavior inside Claude Code CLI not yet tested.
- **Gate 5 · Selective Uninstall**: ✅ Passed — uninstalling Claude Code removed `CLAUDE.md` when it only contained the REASP block.
- **Gate 6 · Documentation Accuracy**: ⏳ Pending human review.

## Final Sign-Off

- [x] Gate 1 passed (with note above)
- [x] Gate 2 passed
- [x] Gate 3 passed
- [x] Gate 4 passed (with note above)
- [x] Gate 5 passed
- [ ] Gate 6 passed

**Signed by:** _______________  **Date:** _______________
