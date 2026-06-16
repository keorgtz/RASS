# Request · Multi-Agent Compatibility for REASP

## Source Request

> "Actualmente me gusta como funciona mi REASP, pero solo funciona en OpenCode. Quiero que sea compatible también con otros agentes de IA, como Claude Code, Antigravity CLI, Gemini CLI, Codex — principalmente esos de momento — y que al instalar me permita elegir a qué agentes sí se le instalaría y a cuáles no, y deben funcionar como funciona actualmente mi REASP en mi OpenCode."

## Owner

Kevin Keor / maintainer of REASP.

## Scope Inclusions

1. Preserve the existing OpenCode experience as the primary, fully-supported target.
2. Add support for installing REASP configuration/prompts into:
   - **Claude Code** (Anthropic CLI)
   - **Antigravity CLI**
   - **Gemini CLI** (Google)
   - **Codex** (OpenAI CLI)
3. Installer must detect which of these agents are present on the system.
4. Installer must let the user select which agents receive REASP (opt-in per agent).
5. The behavior of REASP on each supported agent should mirror OpenCode behavior as closely as the target allows:
   - Ryou Orchestrator workflow
   - Ryou EFI Planner workflow
   - REFI packet contract
   - Global rules, MeridianUI rules, REFI rules
   - SDD ModeProfile awareness
   - Implementation summaries
6. Provide a clean uninstall that removes REASP artifacts only from selected agents.

## Scope Exclusions

- No rewrite of the OpenCode plugin (`plugin.js`, `tui.js`, `rass-core.js`).
- No new AI model providers outside the existing OpenCode Go ecosystem for OpenCode itself.
- No real-time synchronization of state between different agent CLIs.
- No cloud-hosted or server-side orchestration service.
- No guarantee that tools/slash commands will work identically on agents that do not support plugins or MCP.

## Success Criteria

- Running the installer shows a list of detected AI agents and allows enabling/disabling each one.
- OpenCode installation continues to work exactly as before.
- At least one additional agent target (Claude Code) successfully loads REASP prompts/rules and follows the Ryou workflow.
- Uninstaller can remove REASP from any subset of installed targets without breaking the others.

## Language

Spanish / English mixed, following existing project convention.
