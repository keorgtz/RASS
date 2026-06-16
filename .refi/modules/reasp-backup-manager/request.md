# Request · REASP as Global CLI + Backup Manager

## Source Request

> "Haz que mi REASP sea instalable en la máquina para que sirva de Manager de instalación. Es decir, si quiero instalar mi REASP, primero se instala como herramienta en la máquina y ya instalado, al ejecutar en terminal con comando `reasp`, debe darme la opción de instalar, desinstalar, etc. las opciones que ya me da, pero además quiero un sistema de 'Snapshots': generar un backup de mis agentes por separado para tener copias de seguridad de Claude Code, OpenCode, Gemini CLI, Antigravity CLI, etc. Desde el mismo `reasp` debo poder generar snapshots manuales, restaurar snapshots de agentes por separado (si falló la instalación en Claude Code, poder abrir `reasp` y regresar a una snapshot sin daños), eliminar snapshots, y las snapshots deben ser completas, no solo de lo que toca REASP al instalarse. Así REASP no solo será un SDD Orchestrator y EFI Planner, sino también un Backup Manager."

## Owner

Kevin Keor / maintainer of REASP.

## Scope Inclusions

1. Make REASP installable as a global system CLI tool (`reasp` command in terminal).
2. Preserve and expose all existing installer commands (`install`, `uninstall`, `detect`, `status`, `local`).
3. Add a complete snapshot/backup system:
   - Create manual snapshots per agent.
   - Restore snapshots per agent.
   - List snapshots per agent or globally.
   - Delete snapshots (single or bulk purge).
   - Snapshots must be **complete** copies of the agent's config directory, not just REASP-managed files.
4. Automatic pre-install / pre-uninstall snapshot prompts (optional but recommended).
5. Store snapshots under `~/.reasp/snapshots/<agent>/`.
6. Snapshot metadata (JSON): timestamp, agent, name, original path, detected version, REASP version.
7. Cross-platform CLI (Windows, macOS, Linux).

## Scope Exclusions

- No cloud backup or remote storage.
- No snapshot compression/encryption in v1 (plain directory copies).
- No scheduling/auto-backup daemon in v1.
- No backup of the agent binaries themselves, only configuration directories.
- No modification of the core REASP orchestration/planning logic (`.opencode/`).

## Success Criteria

- After `npm install -g`, running `reasp` shows the main menu.
- `reasp install` detects agents and lets the user choose targets.
- `reasp snapshot create --agent claude-code --name before-reasp` creates a full copy of `~/.claude/`.
- `reasp snapshot restore --agent claude-code --name before-reasp` overwrites `~/.claude/` with the snapshot.
- `reasp snapshot list` and `reasp snapshot delete` work.
- Uninstall leaves snapshots intact unless explicitly purged.

## Language

Spanish / English mixed, consistent with existing REASP project.
