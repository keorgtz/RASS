# REASP Installer Troubleshooting

Common issues and how to resolve them.

## Agent installed but not detected

**Symptom:** `node installer/index.js detect` shows `no detectado` for an agent you have installed.

**Cause:** The CLI is not in your PATH, or it is installed in a non-standard location.

**Solutions:**

1. Ensure the agent CLI is in your PATH.
2. Run the installer with `--force` to allow installation even when not detected:
   ```bash
   node installer/index.js install --agents claude-code --force
   ```
3. Specify the exact agents with `--agents`.

---

## REASP block not loaded by my agent

**Symptom:** Claude Code / Codex / Gemini CLI / Antigravity CLI does not seem to follow the Ryou workflow.

**Cause:** Some agents do not reload global instructions automatically, or they read a different file than the one REASP wrote.

**Solutions:**

1. Restart the agent CLI.
2. Verify the instructions file exists and contains the REASP block:
   - Claude Code: `~/.claude/CLAUDE.md`
   - Codex: `~/.codex/instructions.md`
   - Gemini CLI: `~/.gemini/instructions.md`
   - Antigravity CLI: `~/.antigravity/instructions.md`
3. Check the agent's documentation to confirm which file it reads for system instructions.

---

## OpenCode stopped working after multi-agent install

**Symptom:** `/sdd` or `/reasp-setup` no longer work in OpenCode.

**Cause:** The OpenCode global config may be out of sync.

**Solution:**

```bash
node installer/index.js uninstall --agents opencode
node installer/index.js install --agents opencode
```

This restores the reference OpenCode installation without affecting other agents.

---

## I want to manually remove REASP from an agent

For instruction-file targets (Claude Code, Codex, Gemini CLI, Antigravity CLI):

1. Open the agent's instructions file.
2. Delete everything between (and including):
   ```markdown
   <!-- REASP-START -->
   ...
   <!-- REASP-END -->
   ```
3. Save the file and restart the agent.

For OpenCode:

```bash
reasp uninstall --agents opencode
```

---

## Uninstall left a backup file

**Symptom:** A `.reasp-backup` file remains after uninstall.

**Cause:** Backups are intentionally preserved so you can restore your previous instructions manually.

**Solution:** Delete the backup if you no longer need it:

```bash
rm ~/.claude/CLAUDE.md.reasp-backup
```

---

## reasp command not found

**Symptom:** After `npm install -g .`, running `reasp` says command not found.

**Cause:** The global npm bin directory is not in your PATH, or the shell has not reloaded.

**Solutions:**

1. Restart your terminal.
2. Check the global npm bin path:
   ```bash
   npm bin -g
   ```
3. Add that directory to your PATH.
4. As a fallback, use the wrapper script:
   - Windows: `scripts\reasp.cmd`
   - Unix: `scripts/reasp`

---

## Snapshot restore failed or left agent broken

**Symptom:** `reasp snapshot restore` reports an error or the agent no longer works.

**Cause:** The restore operation is atomic, but an unexpected failure may leave the agent in an intermediate state.

**Solution:**

1. Check `~/.reasp/snapshots/<agent>/` for an `auto-restore-backup-<timestamp>` snapshot.
2. Restore that snapshot:
   ```bash
   reasp snapshot restore --agent <agent> --name auto-restore-backup-<timestamp> --yes
   ```
3. If no auto-backup exists, manually copy the snapshot `data/` directory over the agent config dir.

---

## Out of disk space during snapshot

**Symptom:** Snapshot creation fails with disk space errors.

**Cause:** Snapshots are complete copies of agent config directories and can consume significant space.

**Solutions:**

1. List snapshots to see space usage:
   ```bash
   reasp snapshot list
   ```
2. Delete old snapshots:
   ```bash
   reasp snapshot purge --agent claude-code --keep 3
   ```
3. Move the snapshots directory to another drive:
   ```bash
   reasp config --snapshots-dir D:\reasp-snapshots
   ```

---

## Adding experimental agent support

If you want to test REASP with an unsupported agent or a custom Antigravity config path:

```bash
set ANTIGRAVITY_CONFIG_PATH=C:\path\to\your\instructions.md
reasp install --agents antigravity --force
```

---

## Dry-run shows no errors but real install fails

**Symptom:** `reasp install --dry-run ...` succeeds, but the real install fails.

**Cause:** Dry-run does not write files, run `npm install`, or execute CLI commands. A real install may fail due to permissions, missing CLI, or network issues during `npm install`.

**Solution:**

1. Run with `--verbose` to see the full error:
   ```bash
   reasp install --agents opencode --verbose
   ```
2. Check that the target global config directory is writable.
3. For OpenCode, ensure `opencode` is in PATH.

---

## Still stuck?

Open an issue with:

- The exact command you ran.
- Output of `reasp detect`.
- Output of `reasp status`.
- Output of `reasp snapshot list`.
- Your OS and the agent versions involved.
