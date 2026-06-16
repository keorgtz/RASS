# Domain Shard 07 · Documentation & README Update

## Objective

Update user-facing documentation to explain multi-agent support and installation options.

## Changes to `README.md`

1. Update tagline from "for OpenCode" to "for OpenCode, Claude Code, Gemini CLI, Codex, and Antigravity CLI".
2. Add a "Supported Agents" section with a table:
   - Agent
   - Detection method
   - What gets installed
   - Known limitations
3. Update installation instructions to show:
   - Interactive selection of agents.
   - CLI flags (`--agents`, `--only-detected`, `--dry-run`).
4. Add "How It Works" subsection explaining the adapter model.
5. Update uninstall instructions.

## New File: `installer/AGENTS.md`

A technical reference for maintainers:

- Global config paths per OS.
- Capabilities matrix.
- How to add a new agent target.
- Troubleshooting detection.

## New File: `installer/TROUBLESHOOTING.md`

Common issues:

- Agent detected but install fails.
- Agent not detected despite being installed.
- How to manually apply REASP to an unsupported agent.

## Verification Gate

- README accurately reflects supported agents and installation flags.
- A new maintainer can read `AGENTS.md` and implement a sixth agent target.
