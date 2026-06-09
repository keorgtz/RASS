# RASS — Ryou Adaptive SDD System

**v3.0.0** — OpenCode Native Plugin with Ryou Orchestrator

The definitive Sub-Agent Driven Development (SDD) framework for OpenCode. Stop wasting tokens on massive autonomous loops — start adapting dynamically to your tasks.

## Why Adaptive SDD?

The biggest mistake in AI-driven development is assuming you **ALWAYS** need a massive autonomous pipeline. That creates token waste, high latency, and over-engineering for simple tasks.

RASS adapts the pipeline's complexity to the actual task at hand:

- **Simple CRUD** → Fast (3 phases, low effort)
- **Complex architecture** → Architecture (8 phases, high reasoning)
- **UI work** → UI (4 phases, design-focused)
- **Debugging** → Debug (4 phases, explore-verify loop)
- **Full Ryou workflow** → RyouSet (8 phases, per-phase model routing)

**CONCEPTS > CODE**. We control the flow, the AI executes.

---

## RyouSet — Your Exact Configuration

**RyouSet** is the default ModeProfile that matches your exact OpenCode Go configuration:

- **Phases**: All 8 (orchestrator → init → explore → propose → design → apply → verify → archive)
- **Model strategy**: Per-phase — each phase has its own model, effort, and fallbacks
- **Model routing**: GLM-5.1 for orchestration/architecture, Kimi K2.6 for implementation, DeepSeek V4 Pro for review, DeepSeek V4 Flash for documentation
- **Agents**: 7 Ryou subagents (orchestrator, planner, builder, architect, reviewer, debugger, documentation)
- **Default agent**: `ryou-orchestrator`

When you install RASS globally, it automatically deploys the Ryou orchestrator and all subagents to your OpenCode configuration.

---

## Architecture

```text
.opencode/
├── plugin.js          # Server plugin — AI tools (sdd_mode_profile, rass_setup)
├── tui.js             # TUI plugin — slash commands (/sdd, /rass-setup)
├── rass-core.js       # Core logic — ModeProfiles, runtime, agent deployment
├── package.json       # Plugin manifest
├── sdd.config.json     # Global RASS configuration
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
├── sdd-profiles/      # Unified ModeProfile definitions (phases + model routing)
│   ├── ryouset.json
│   ├── fast.json
│   ├── architecture.json
│   ├── ui.json
│   ├── debug.json
│   ├── enterprise.json
│   ├── legacy.json
│   └── minimal.json
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
    ├── current-modeprofile.json
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
| `/sdd` | `/s` | Switch, create, edit, or delete SDD ModeProfiles |
| `/sdd-mode` | `/sm` | Alias for `/sdd` (backward compatible) |
| `/sdd-profile` | `/sp` | Alias for `/sdd` (backward compatible) |
| `/rass-setup` | `/rs` | View RASS status, switch to RyouSet, view Ryou agents |

`/sdd` opens an interactive dialog where you can:
- **List** available ModeProfiles with phases and model strategy
- **Switch** to an existing ModeProfile
- **Create** a new ModeProfile with a guided setup:
  1. Enter a name
  2. Enter a description
  3. Select phases (toggle on/off)
  4. Choose model strategy: **single model** or **one model per phase**
  5. If single: choose model → effort → fallbacks → save
  6. If per-phase: for each phase → choose model → effort → fallbacks → next phase → save
- **Edit** an existing ModeProfile (phases, strategy, default model, per-phase overrides, description)
- **Delete** a ModeProfile

`/rass-setup` provides:
- **Status** — View current ModeProfile, phases, and model strategy
- **RyouSet** — One-click switch to RyouSet ModeProfile
- **Agents** — View the 7 Ryou subagents and their configuration

### AI Tools (Server)

The plugin also exposes tools that AI agents can call directly:

| Tool | Actions | Description |
|------|---------|-------------|
| `sdd_mode_profile` | `list`, `switch`, `create`, `status` | Manage unified SDD ModeProfiles programmatically |
| `rass_setup` | `status`, `deploy`, `check` | View RASS status, check Ryou agents, get deployment info |

Example tool calls:
```
sdd_mode_profile(action="list")
sdd_mode_profile(action="switch", name="architecture")
sdd_mode_profile(action="create", name="custom-api", phases="orchestrator,apply,verify", model_strategy="per-phase", primary="opencode-go/glm-5.1", effort="medium")
sdd_mode_profile(action="status")
```

---

## ModeProfiles

ModeProfiles combine **which phases run** (formerly "modes") with **which models handle each phase** (formerly "profiles") into a single unified concept.

| ModeProfile | Phases | Strategy | Use Case |
|-------------|--------|----------|----------|
| **RyouSet** | orchestrator → init → explore → propose → design → apply → verify → archive | per-phase | Full Ryou workflow with your exact config |
| **Fast** | orchestrator → apply → verify | per-phase | CRUDs, simple UI, APIs |
| **Architecture** | orchestrator → init → explore → propose → design → apply → verify → archive | per-phase | Complex systems, offline-first |
| **UI** | orchestrator → design → apply → verify | per-phase | MeridianUI, MAUI, Blazor, Avalonia |
| **Debug** | orchestrator → explore → apply → verify | per-phase | Bugs, concurrency, memory leaks |
| **Enterprise** | orchestrator → init → explore → propose → design → apply → verify → archive | per-phase | Mission-critical, maximum robustness |
| **Legacy** | orchestrator → init → explore → propose → apply → verify | per-phase | Legacy refactors, modernization |
| **Minimal** | orchestrator → explore → apply | per-phase | Quick iterations, low consumption |

### Model Strategy

Each ModeProfile has a `model_strategy` field:

- **`single`** — One model, effort, and fallback set applies to every phase. Simple and fast to configure.
- **`per-phase`** — Each phase has its own model, effort, and fallbacks. Maximum control and quality.

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

The `ryou-orchestrator` is set as the default agent and includes SDD ModeProfile awareness — it knows how to use `/sdd` to adapt the pipeline to each task.

---

## How It Works

When you switch ModeProfiles, RASS deterministically computes `runtime.generated.json` by resolving each phase's model, effort, and fallbacks based on the ModeProfile's configuration and model strategy. OpenCode reads this JSON and executes the resolved pipeline.

**No recursive agents. No infinite loops. No massive specs for trivial tasks.**

The system adapts complexity to the task. Simple tasks get minimal phases. Complex tasks get advanced pipelines with per-phase model routing.

---

## Creating Custom ModeProfiles

### Via TUI (Interactive)

1. Type `/sdd` in OpenCode
2. Select **"+ Create New ModeProfile..."**
3. Enter a name
4. Enter a description (optional)
5. Select phases (toggle on/off)
6. Choose model strategy:
   - **Single model** — Pick one model, effort, and fallbacks for all phases
   - **Per-phase** — For each phase, pick model → effort → fallbacks individually
7. Save

### Via AI Tool

```
sdd_mode_profile(action="create", name="custom-api", phases="orchestrator,apply,verify", model_strategy="per-phase", primary="opencode-go/glm-5.1", effort="medium")
```

### Via JSON (Manual)

Create a new ModeProfile file at `.opencode/sdd-profiles/my-profile.json`:

```json
{
  "name": "My Custom Profile",
  "description": "Description of what this ModeProfile is for",
  "phases": ["orchestrator", "apply", "verify"],
  "model_strategy": "per-phase",
  "default": {
    "primary": "opencode-go/glm-5.1",
    "effort": "medium",
    "fallbacks": ["opencode-go/deepseek-v4-flash"]
  },
  "orchestrator": {
    "primary": "opencode-go/glm-5.1",
    "effort": "medium",
    "fallbacks": ["opencode-go/deepseek-v4-flash"]
  },
  "apply": {
    "primary": "opencode-go/kimi-k2.6",
    "effort": "high",
    "fallbacks": ["opencode-go/glm-5.1"]
  },
  "verify": {
    "primary": "opencode-go/deepseek-v4-pro",
    "effort": "high",
    "fallbacks": ["opencode-go/glm-5.1"]
  }
}
```

For a single-model strategy:

```json
{
  "name": "Quick and Simple",
  "description": "One model for everything",
  "phases": ["orchestrator", "apply", "verify"],
  "model_strategy": "single",
  "default": {
    "primary": "opencode-go/deepseek-v4-flash",
    "effort": "low",
    "fallbacks": ["opencode-go/kimi-k2.6"]
  }
}
```

---

## Philosophy

> The problem today is not "having an AI" — it's "using the right model, with the right workflow, for the right task."

RASS solves this by:
1. **Adapting pipeline complexity** — Fast for simple tasks, Architecture for complex ones
2. **Routing models intelligently** — GLM-5.1 for orchestration, Kimi K2.6 for implementation, DeepSeek for review
3. **Controlling effort** — Low for speed, Extreme for deep analysis
4. **Keeping humans in control** — You direct, the AI executes

---

## License

KeorSoft — Private