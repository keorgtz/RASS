# RASS — Ryou Adaptive SDD System

**v2.0.0** — OpenCode Native Plugin with Ryou Orchestrator

The definitive Sub-Agent Driven Development (SDD) framework for OpenCode. Stop wasting tokens on massive autonomous loops — start adapting dynamically to your tasks.

## Why Adaptive SDD?

The biggest mistake in AI-driven development is assuming you **ALWAYS** need a massive autonomous pipeline. That creates token waste, high latency, and over-engineering for simple tasks.

RASS adapts the pipeline's complexity to the actual task at hand:

- **Simple CRUD** → Fast mode (3 phases)
- **Complex architecture** → Architecture mode (7 phases)
- **UI work** → UI mode (4 phases)
- **Debugging** → Debug mode (5 phases)
- **Full Ryou workflow** → RyouSet mode (8 phases, your exact config)

**CONCEPTS > CODE**. We control the flow, the AI executes.

---

## RyouSet — Your Exact Configuration

**RyouSet** is the default mode and profile that matches your exact OpenCode Go configuration:

- **Mode**: All 8 phases (orchestrator → init → explore → propose → design → apply → verify → archive)
- **Profile**: GLM-5.1 for orchestration/architecture, Kimi K2.6 for implementation, DeepSeek V4 Pro for review, DeepSeek V4 Flash for documentation
- **Agents**: 7 Ryou subagents (orchestrator, planner, builder, architect, reviewer, debugger, documentation)
- **Default agent**: `ryou-orchestrator`

When you install RASS globally, it automatically deploys the Ryou orchestrator and all subagents to your OpenCode configuration.

---

## Architecture

```text
.opencode/
├── plugin.js          # Server plugin — AI tools (sdd_mode, sdd_profile, rass_setup)
├── tui.js             # TUI plugin — slash commands (/sdd-mode, /sdd-profile, /rass-setup)
├── rass-core.js       # Core logic — modes, profiles, runtime, agent deployment
├── package.json       # Plugin manifest
├── sdd.config.json    # Global RASS configuration
├── agents/            # Ryou agent prompts
│   ├── ryou-orchestrator.md
│   ├── planner.md
│   ├── builder.md
│   ├── architect.md
│   ├── reviewer.md
│   ├── debugger.md
│   └── documentation.md
├── rules/             # Global rules
│   ├── global-rules.md
│   └── meridianui.md
├── modes/             # Mode definitions (which phases to run)
│   ├── fast.json
│   ├── architecture.json
│   ├── ui.json
│   ├── debug.json
│   ├── enterprise.json
│   ├── legacy.json
│   ├── minimal.json
│   └── ryouset.json
├── profiles/          # Profile definitions (which models per phase)
│   ├── premium.json
│   ├── balanced.json
│   ├── minimal.json
│   ├── local.json
│   └── ryouset.json
├── phases/            # System prompts per phase
│   ├── orchestrator.md
│   ├── init.md
│   ├── explore.md
│   ├── propose.md
│   ├── design.md
│   ├── apply.md
│   ├── verify.md
│   └── archive.md
└── runtime/           # Current state and generated config
    ├── current-mode.json
    ├── current-profile.json
    └── runtime.generated.json
```
├── modes/             # Mode definitions (which phases to run)
│   ├── fast.json
│   ├── architecture.json
│   ├── ui.json
│   ├── debug.json
│   ├── enterprise.json
│   ├── legacy.json
│   └── minimal.json
├── profiles/          # Profile definitions (which models per phase)
│   ├── premium.json
│   ├── balanced.json
│   ├── minimal.json
│   └── local.json
├── phases/            # System prompts per phase
│   ├── orchestrator.md
│   ├── init.md
│   ├── explore.md
│   ├── propose.md
│   ├── design.md
│   ├── apply.md
│   ├── verify.md
│   └── archive.md
└── runtime/           # Current state and generated config
    ├── current-mode.json
    ├── current-profile.json
    └── runtime.generated.json
```

---

## Installation

### Interactive TUI (Recommended)

```bash
cd installer
npm install
node index.js
```

This opens an interactive TUI where you can:
- **Install globally** — Register RASS as an OpenCode plugin for all projects
- **Install locally** — Copy RASS to the current workspace `.opencode/`
- **Uninstall** — Remove RASS globally from OpenCode

### CLI Commands

```bash
node installer/index.js install      # Install globally
node installer/index.js uninstall    # Uninstall globally
node installer/index.js local        # Install in current workspace
```

---

## Usage

### Slash Commands (TUI)

Once installed, use these commands inside OpenCode:

| Command | Alias | Description |
|---------|-------|-------------|
| `/sdd-mode` | `/sm` | Switch or create SDD modes |
| `/sdd-profile` | `/sp` | Switch or create SDD profiles |
| `/rass-setup` | `/rs` | View RASS status, switch to RyouSet, view Ryou agents |

Both `/sdd-mode` and `/sdd-profile` open interactive dialogs where you can:
- **List** available modes/profiles
- **Switch** to an existing mode/profile
- **Create** a new custom mode/profile with a guided setup

`/rass-setup` provides:
- **Status** — View current mode, profile, and phases
- **RyouSet** — One-click switch to RyouSet mode + profile
- **Agents** — View the 7 Ryou subagents and their configuration

### AI Tools (Server)

The plugin also exposes tools that AI agents can call directly:

| Tool | Actions | Description |
|------|---------|-------------|
| `sdd_mode` | `list`, `switch`, `create`, `status` | Manage SDD modes programmatically |
| `sdd_profile` | `list`, `switch`, `create`, `status` | Manage SDD profiles programmatically |
| `rass_setup` | `status`, `deploy`, `check` | View RASS status, check Ryou agents, get deployment info |

Example tool calls:
```
sdd_mode(action="list")
sdd_mode(action="switch", name="architecture")
sdd_mode(action="create", name="custom-api", phases="orchestrator,apply,verify", effort="medium")
sdd_profile(action="switch", name="premium")
sdd_profile(action="create", name="my-profile", primary="opencode-go/glm-5.1", effort="high")
```

---

## Modes

Modes define **which phases** are active in the SDD pipeline.

| Mode | Phases | Effort | Use Case |
|------|--------|--------|----------|
| **Fast** | orchestrator → apply → verify | low | CRUDs, simple UI, APIs |
| **Architecture** | orchestrator → init → explore → propose → apply → verify → archive | high | Complex systems, offline-first |
| **UI** | orchestrator → design → apply → verify | medium | MeridianUI, MAUI, Blazor, Avalonia |
| **Debug** | orchestrator → explore → verify → apply → verify | high | Bugs, concurrency, memory leaks |
| **Enterprise** | orchestrator → init → explore → propose → design → apply → verify → archive | extreme | Mission-critical, maximum robustness |
| **Legacy** | orchestrator → init → explore → propose → apply → verify | high | Legacy refactors, modernization |
| **Minimal** | explore → apply | low | Quick iterations, low consumption |
| **RyouSet** | orchestrator → init → explore → propose → design → apply → verify → archive | medium | Full Ryou workflow with your exact config |

---

## Profiles

Profiles define **which AI models** handle each phase and at what effort level.

| Profile | Orchestrator | Implementation | Review | Description |
|---------|-------------|----------------|--------|-------------|
| **Premium** | GLM-5.1 (high) | Kimi K2.6 (medium) | DeepSeek V4 Pro (high) | Maximum quality |
| **Balanced** | GLM-5.1 (medium) | Kimi K2.6 (medium) | DeepSeek V4 Pro (medium) | Quality/cost balance |
| **Minimal** | DeepSeek V4 Flash (low) | Kimi K2.6 (low) | — | Low cost, fast |
| **Local** | GLM-5.1 (medium) | GLM-5.1 (medium) | — | OpenCode Go only |
| **RyouSet** | GLM-5.1 (medium) | Kimi K2.6 (medium) | DeepSeek V4 Pro (high) | Your exact config with per-phase routing |

### Available Models (OpenCode Go)

| Model ID | Label | Best For |
|----------|-------|----------|
| `opencode-go/glm-5.1` | GLM-5.1 | Orchestration, planning, architecture, complex reasoning |
| `opencode-go/kimi-k2.6` | Kimi K2.6 | Implementation, refactors, C#/.NET code generation |
| `opencode-go/deepseek-v4-pro` | DeepSeek V4 Pro | Debugging, review, performance, risk analysis |
| `opencode-go/deepseek-v4-flash` | DeepSeek V4 Flash | Small tasks, documentation, summaries |

---

## Effort Levels

| Effort | Objective | Token Usage |
|--------|-----------|-------------|
| `low` | Speed — minimal reasoning | Low |
| `medium` | Balanced — standard reasoning | Medium |
| `high` | Deep reasoning — thorough analysis | High |
| `extreme` | Maximum analysis — exhaustive | Very High |

---

## Ryou Agents

When you install RASS globally, it deploys 7 specialized agents to your OpenCode configuration:

| Agent | Model | Role | Steps |
|-------|-------|------|-------|
| **ryou-orchestrator** | GLM-5.1 | Primary orchestrator — routes, delegates, coordinates | 40 |
| **planner** | GLM-5.1 | Planning — breaks work into phases, identifies risks | 14 |
| **builder** | Kimi K2.6 | Implementation — C#, .NET, EF Core, XAML, Blazor, MAUI | 40 |
| **architect** | GLM-5.1 | Architecture — boundaries, data flow, design tradeoffs | 16 |
| **reviewer** | DeepSeek V4 Pro | Review — bugs, regressions, performance, security | 18 |
| **debugger** | DeepSeek V4 Pro | Debug — root cause, failing tests, runtime errors | 26 |
| **documentation** | DeepSeek V4 Flash | Docs — Markdown, HTML summaries, changelogs | 12 |

The `ryou-orchestrator` is set as the default agent and includes SDD mode/profile awareness — it knows how to use `/sdd-mode` and `/sdd-profile` to adapt the pipeline to each task.

---

## How It Works

When you switch modes or profiles, RASS deterministically computes `runtime.generated.json` by combining the Mode's phase list with the Profile's model assignments. OpenCode reads this JSON and executes the resolved pipeline.

**No recursive agents. No infinite loops. No massive specs for trivial tasks.**

The system adapts complexity to the task. Simple tasks get minimal phases. Complex tasks get advanced pipelines.

---

## Creating Custom Modes and Profiles

### Via TUI (Interactive)

1. Type `/sdd-mode` or `/sdd-profile` in OpenCode
2. Select **"+ Create New..."**
3. Follow the guided setup dialog

### Via AI Tool

```
sdd_mode(action="create", name="custom-api", phases="orchestrator,apply,verify", effort="medium")
sdd_profile(action="create", name="focus-code", primary="opencode-go/kimi-k2.6", effort="high")
```

### Via JSON (Manual)

Create a new mode file at `.opencode/modes/my-mode.json`:

```json
{
  "name": "My Custom Mode",
  "description": "Description of what this mode is for",
  "phases": ["orchestrator", "apply", "verify"],
  "default_effort": "medium"
}
```

Create a new profile file at `.opencode/profiles/my-profile.json`:

```json
{
  "name": "My Custom Profile",
  "description": "Description of model preferences",
  "default": {
    "primary": "opencode-go/glm-5.1",
    "effort": "medium",
    "fallbacks": ["opencode-go/deepseek-v4-flash"]
  },
  "apply": {
    "primary": "opencode-go/kimi-k2.6",
    "effort": "high",
    "fallbacks": ["opencode-go/glm-5.1"]
  }
}
```

---

## Philosophy

> The problem today is not "having an AI" — it's "using the right model, with the right workflow, for the right task."

RASS solves this by:
1. **Adapting pipeline complexity** — Fast mode for simple tasks, Architecture mode for complex ones
2. **Routing models intelligently** — GLM-5.1 for orchestration, Kimi K2.6 for implementation, DeepSeek for review
3. **Controlling effort** — Low for speed, Extreme for deep analysis
4. **Keeping humans in control** — You direct, the AI executes

---

## License

KeorSoft — Private