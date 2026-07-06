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

---

## Linux / Unix Issues

### `reasp` command not found on Linux

**Symptom:** After `npm install -g .`, running `reasp` says `command not found`.

**Cause:** Usually one of these:

- The npm global bin directory is not in your PATH.
- You only ran `npm install` inside `installer/`, which installs local dependencies but does **not** install the global CLI command.

**Solutions:**

1. Find the global bin path and add it to your shell profile:
   ```bash
   npm bin -g
   # e.g. /home/you/.npm-global/bin — add to ~/.bashrc or ~/.zshrc
   export PATH="$(npm bin -g):$PATH"
   source ~/.bashrc
   ```

2. If using **nvm**, each Node version has its own global bin. Ensure the right version is active:
   ```bash
   nvm use 20
   npm install -g .
   reasp --help
   ```

3. If using **Volta**, Volta manages its own bin at `~/.volta/bin`. Ensure it is in PATH:
   ```bash
   echo $PATH | grep volta
   # if missing, add to ~/.bashrc:
   export PATH="$HOME/.volta/bin:$PATH"
   ```

4. As a fallback, use the wrapper script from the repo root:
   ```bash
   chmod +x scripts/reasp
   ./scripts/reasp install
   ```

5. If you installed from the `installer/` directory by mistake, install the CLI properly:
   ```bash
   # from the repo root
   npm install -g .

   # or directly from installer/
   npm install -g ./installer
   ```

---

### `scripts/reasp: Permission denied`

**Symptom:** Running `./scripts/reasp` gives a permission error.

**Cause:** The execute bit is not set on the file (can happen after certain git operations or clones on some systems).

**Solution:**

```bash
chmod +x scripts/reasp
./scripts/reasp --help
```

---

### OpenCode plugin fails to load on Linux — `ERR_INVALID_URL` or blank plugin

**Symptom:** After installing REASP into OpenCode on Linux, the plugin or TUI doesn't load. The OpenCode console or stderr shows an error containing `ERR_INVALID_URL` or `file:////home/...` (four slashes).

**Cause:** This was a bug in versions of REASP prior to the Linux compatibility update. The plugin URL was built with a hard-coded `file:///` prefix, producing `file:////home/...` on Linux (four slashes — invalid URL).

**Solution:** Update to the current version and reinstall:

```bash
git pull
reasp uninstall --agents opencode
reasp install --agents opencode
```

---

### OpenCode not detected on Linux even though it is installed

**Symptom:** `reasp detect` shows `✗ no detectado` for OpenCode, but `opencode --version` works.

**Cause:** OpenCode may be installed in a location REASP does not scan by default.

**Solutions:**

1. Ensure `opencode` is in your PATH:
   ```bash
   which opencode
   echo $PATH
   ```

2. If installed via **Volta**, verify Volta's bin is in PATH:
   ```bash
   volta which opencode
   export PATH="$HOME/.volta/bin:$PATH"
   ```

3. Use `--force` to bypass detection and install anyway:
   ```bash
   reasp install --agents opencode --force
   ```

---

### MeridianUI warning: `.MeridianUI/ is empty`

**Symptom:** During `reasp install`, you see:

```
⚠  .MeridianUI/ is empty or not yet populated in the repo — skipping MeridianUI install.
   Add your MeridianUI content to .MeridianUI/ and re-run `reasp install`.
```

**Cause:** The `.MeridianUI/` directory in the REASP repository contains only the `.gitkeep` placeholder — no real content has been added yet.

**Solution:** Add your MeridianUI content to `.MeridianUI/` in the repo root, then re-run `reasp install`:

```bash
# After adding content to .MeridianUI/:
reasp install
# ✓ MeridianUI installed → /home/<you>/.MeridianUI
```

This is expected behavior before MeridianUI content is populated — it is not an error.

---

### Node.js version too old

**Symptom:** The installer crashes immediately with a syntax error or `require is not defined`.

**Cause:** REASP requires Node.js ≥ 18 (ESM modules, `fs.promises.cp`, `util.parseArgs`).

**Solution:**

```bash
node --version   # must be v18.0.0 or higher

# Update via nvm
nvm install 20
nvm use 20

# Fedora / RHEL
sudo dnf install nodejs

# Ubuntu / Debian (NodeSource for v20+)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs
```

---

## Still stuck?

Open an issue with:

- The exact command you ran.
- Output of `reasp detect`.
- Output of `reasp status`.
- Output of `reasp snapshot list`.
- Your OS, Node version (`node --version`), and the agent versions involved.
