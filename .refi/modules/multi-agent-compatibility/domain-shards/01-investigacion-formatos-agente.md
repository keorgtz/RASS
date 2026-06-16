# Domain Shard 01 · Research Agent Configuration Formats

## Objective

Determine the exact global configuration files, directory locations, and supported features for each target agent so the installer can emit valid configurations.

## Targets to Research

| Priority | Agent | Status |
|----------|-------|--------|
| P0 | OpenCode | Known (reference) |
| P1 | Claude Code | To verify |
| P1 | Codex (OpenAI CLI) | To verify |
| P2 | Gemini CLI | To verify |
| P2 | Antigravity CLI | To verify |

## Research Checklist

For each agent, answer:

1. **Global config directory**
   - Windows path
   - macOS / Linux path
2. **Config file name(s)** and **format** (JSON, Markdown, YAML, TOML)
3. **How to inject system instructions / system prompt**
   - Global level
   - Project level
4. **How to define multiple personas / modes / agents**
   - Native support?
   - Workaround via prompt sections?
5. **Plugin / extension / MCP support**
   - Can we register a local plugin?
   - Can we expose an MCP server?
   - Can we add custom slash commands?
6. **Permission model**
   - Can REASP restrict file edits, bash, external directories?
   - If not, how do we document boundaries?
7. **Model selection**
   - Does the agent support model routing per task or per mode?
   - How are OpenCode Go model IDs mapped?
8. **Detection command**
   - CLI command that proves the agent is installed and returns version.

## Deliverables

- `installer/lib/targets/<agent>.js` skeleton per target with verified constants.
- A markdown table in this shard summarizing findings.
- Update `master-blueprint.md` capability mapping if findings differ from assumptions.

## Verification Gate

- Each target file includes a `detect()` function that returns true on the researcher's machine for installed agents.
- At least OpenCode and one additional target are verified end-to-end.
