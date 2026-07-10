<div align="center">

<!-- ═══════════════════════════════════════════════════════════════════════════════ -->
<!-- RASS — Visual Header Banner -->
<!-- ═══════════════════════════════════════════════════════════════════════════════ -->

# ✦ REASP ✦

### ◈ Ryou Enterprise Adaptive SDD Protocol ◈

*RASS orchestration + REFI enterprise planning — for OpenCode, Claude Code, Gemini CLI, Codex, and Antigravity CLI*

---

<!-- Badges Row 1 -->
<p align="center">
  <img src="https://img.shields.io/badge/version-3.0.0-00d4ff?style=for-the-badge&logo=github&logoColor=white" alt="Version 3.0.0">
  <img src="https://img.shields.io/badge/Multi--CLI-OpenCode%2B4-ff00ff?style=for-the-badge&logo=codeium&logoColor=white" alt="Multi-CLI">
  <img src="https://img.shields.io/badge/.NET-9-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET 9">
  <img src="https://img.shields.io/badge/C%23-Modern-239120?style=for-the-badge&logo=csharp&logoColor=white" alt="C# Modern">
  <img src="https://img.shields.io/badge/MeridianUI-Design-00d4ff?style=for-the-badge&logo=figma&logoColor=white" alt="MeridianUI">
</p>

<!-- Badges Row 2 - AI Models -->
<p align="center">
  <img src="https://img.shields.io/badge/🧠_GLM--5.1-Orchestration-00d4ff?style=flat-square&logoColor=white" alt="GLM-5.1">
  <img src="https://img.shields.io/badge/🔨_Kimi_K2.6-Implementation-ff00ff?style=flat-square&logoColor=white" alt="Kimi K2.6">
  <img src="https://img.shields.io/badge/🔍_DeepSeek_V4_Pro-Review-ff6b6b?style=flat-square&logoColor=white" alt="DeepSeek V4 Pro">
  <img src="https://img.shields.io/badge/📝_DeepSeek_V4_Flash-Docs-ffd93d?style=flat-square&logoColor=black" alt="DeepSeek V4 Flash">
</p>

<!-- Feature Icons Row -->
<p align="center">
  <img src="https://img.shields.io/badge/⚡_Adaptive_Pipeline-8A2BE2?style=flat-square" alt="Adaptive">
  <img src="https://img.shields.io/badge/🎯_Per--Phase_Routing-8A2BE2?style=flat-square" alt="Routing">
  <img src="https://img.shields.io/badge/🤖_7_AI_Agents-8A2BE2?style=flat-square" alt="Agents">
  <img src="https://img.shields.io/badge/🎨_Modern_TUI-8A2BE2?style=flat-square" alt="TUI">
  <img src="https://img.shields.io/badge/📊_8_ModeProfiles-8A2BE2?style=flat-square" alt="Profiles">
</p>

</div>

---

<!-- ═══════════════════════════════════════════════════════════════════════════════ -->
<!-- Table of Contents -->
<!-- ═══════════════════════════════════════════════════════════════════════════════ -->

## 📋 Table of Contents

- [🎯 What is REASP?](#-what-is-reasp)
- [🤖 Supported AI Agents](#-supported-ai-agents)
- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
  - [🐧 Linux / Unix](#-linux--unix)
- [🎨 MeridianUI](#-meridianui)
- [🎮 Usage](#-usage)
- [🧠 ModeProfiles](#-modeprofiles)
- [🤖 Ryou Agents](#-ryou-agents)
- [🏗️ Architecture](#️-architecture)
- [⚙️ Customization](#️-customization)
- [📊 Use Cases](#-use-cases)
- [🎨 Philosophy](#-philosophy)
- [📜 License](#-license)

---

<!-- ═══════════════════════════════════════════════════════════════════════════════ -->
<!-- What is REASP? -->
<!-- ═══════════════════════════════════════════════════════════════════════════════ -->

## 🎯 What is REASP?

**REASP** (Ryou Enterprise Adaptive SDD Protocol) is the unified distribution of **RASS** and **REFI**.

REASP now supports **multiple AI agent CLIs** through a target adapter architecture — install once and get the Ryou workflow in OpenCode, Claude Code, Gemini CLI, Codex, and Antigravity CLI. Each agent receives the same REASP content adapted to its native format.

It combines:

- **RASS** for adaptive orchestration and implementation workflows.
- **REFI** for enterprise packet planning, domain sharding, and implementation handoff.

REASP keeps the original **Phases** planning method as the default, while making
**Epic + PART** available as an explicit, user-selectable alternative. Switch
methods any time via `/reasp-setup` or `reasp_setup(action="set-planning-method")`.

Instead of forcing one agent to do everything, REASP lets you:

1. plan deeply with **Ryou EFI Planner**,
2. switch to **Ryou Orchestrator**,
3. implement with the existing RASS subagent ecosystem.

Instead of using a one-size-fits-all massive autonomous pipeline, **REASP adapts dynamically** to each task's complexity:

```
┌─────────────────────────────────────────────────────────────────┐
│  Simple CRUD  →  Fast Mode      (3 phases, low effort)            │
│  Complex Arch →  Architecture   (8 phases, deep reasoning)        │
│  UI Design    →  UI Mode        (4 phases, design-focused)        │
│  Debugging    →  Debug Mode      (4 phases, explore-verify loop)  │
│  Full Workflow→  RyouSet        (8 phases, per-phase routing)     │
└─────────────────────────────────────────────────────────────────┘
```

> **The problem today is not "having an AI" — it's "using the right model, with the right workflow, for the right task."**

REASP solves this by combining **adaptive pipeline complexity**, **planning packets**, and **intelligent model routing**:

| Aspect | Traditional AI | REASP |
|--------|---------------|------|
| **Pipeline** | Fixed, always full | Adaptive to task complexity |
| **Model Usage** | Single model for everything | Per-phase model routing |
| **Token Efficiency** | High waste on simple tasks | Optimized per task type |
| **Latency** | Slow for everything | Fast for simple, thorough for complex |
| **Control** | Black box | Human-directed, AI-executed |

---

<!-- ═══════════════════════════════════════════════════════════════════════════════ -->
<!-- Supported AI Agents -->
<!-- ═══════════════════════════════════════════════════════════════════════════════ -->

## 🤖 Supported AI Agents

REASP can be installed into the following AI agent CLIs. Each target receives the same
REASP workflow adapted to its native configuration format.

| Agent | Installation target | Native features | Notes |
|-------|---------------------|-----------------|-------|
| **OpenCode** | `~/.config/opencode/` | Agents, plugins, slash commands, tools | Full reference implementation |
| **Claude Code** | `~/.claude/CLAUDE.md` | System instructions | REASP block injected as global prompt |
| **Codex** | `~/.codex/instructions.md` | System instructions | REASP block injected as global prompt |
| **Gemini CLI** | `~/.gemini/instructions.md` | System instructions | REASP block injected as global prompt |
| **Antigravity CLI** | `~/.antigravity/instructions.md` | System instructions | Experimental; least documented format |

> **Degradación elegante:** Los agentes que no soportan plugins, MCP, o subagentes reciben el mismo flujo de trabajo Ryou expresado como instrucciones de sistema + guía de fases. El núcleo de REASP se conserva sin importar el CLI.

---

<!-- ═══════════════════════════════════════════════════════════════════════════════ -->
<!-- Features -->
<!-- ═══════════════════════════════════════════════════════════════════════════════ -->

## ✨ Features

### 🎛️ Adaptive Pipeline System
- **8 Built-in ModeProfiles**: Fast, Architecture, UI, Debug, Enterprise, Legacy, Minimal, RyouSet
- **Dynamic Phase Selection**: Enable/disable phases per task
- **Effort Levels**: Low → Medium → High → Extreme
- **Zero Overhead**: Simple tasks use minimal phases, complex tasks get full pipeline
- **Multi-Agent Install**: Choose target agents at install time via TUI or CLI flags
- **Agent Backup Manager**: Snapshot, restore, and purge agent configs before destructive changes

### 🧠 Intelligent Model Routing
- **Per-Phase Model Assignment**: Different AI model for each development phase
- **4 Premium Models**: GLM-5.1, Kimi K2.6, DeepSeek V4 Pro, DeepSeek V4 Flash
- **Fallback Chains**: Automatic fallback when primary model is unavailable
- **Multi-Platform**: Models mapped via instructions — works across OpenCode, Claude Code, Codex, Gemini CLI, and Antigravity CLI

### 🤖 8 Specialized Ryou Agents
- **Ryou EFI Planner**: REFI packet planning, shard generation, implementation handoff (GLM-5.1)
- **Orchestrator**: Routes, delegates, coordinates (GLM-5.1)
- **Planner**: Breaks work into phases, identifies risks (GLM-5.1)
- **Builder**: C#, .NET, EF Core, XAML, Blazor, MAUI implementation (Kimi K2.6)
- **Architect**: Boundaries, data flow, design tradeoffs (GLM-5.1)
- **Reviewer**: Bugs, regressions, performance, security (DeepSeek V4 Pro)
- **Debugger**: Root cause, failing tests, runtime errors (DeepSeek V4 Pro)
- **Documentation**: Markdown, HTML summaries, changelogs (DeepSeek V4 Flash)

### 🎨 Modern TUI Installer
- **Interactive Terminal UI**: Beautiful prompts with `@clack/prompts`
- **ASCII Art Banner**: Elegant cursive Ryou logo with shadow effects
- **Smooth Progress Bar**: Granular 0-100% with visual feedback
- **One-Click Deploy**: Automatic agent synchronization with ModeProfile

### ⚡ Slash Commands
- `/sdd` — Switch, create, edit, or delete ModeProfiles
- `/sdd-mode` / `/sm` — Quick mode switch
- `/sdd-profile` / `/sp` — Quick profile switch
- `/rass-setup` / `/rs` — Legacy alias for REASP setup
- `/reasp-setup` / `/reasp` — Switch between Ryou EFI Planner and Ryou Orchestrator, toggle REFI, and select the planning method

### 🔧 AI Tools (Server-Side)
- `sdd_mode_profile` — Programmatic ModeProfile management
- `rass_setup` — Backward-compatible RASS/REASP status tool
- `reasp_setup` — REASP status, workflow switching, REFI toggling, and planning-method selection
  - `reasp_setup(action="set-planning-method", method="phases")` — legacy domain-shard planning
  - `reasp_setup(action="set-planning-method", method="epic")` — Epic + PART v2 planning

---

<!-- ═══════════════════════════════════════════════════════════════════════════════ -->
<!-- Quick Start -->
<!-- ═══════════════════════════════════════════════════════════════════════════════ -->

## 🚀 Quick Start

### Install REASP as a system tool

```bash
# From inside the repository
npm install -g .

# Or from a local checkout
npm install -g C:\path\to\REASP

reasp --help
```

Once installed globally, the `reasp` command is available everywhere. If you prefer not to install globally, run `node installer/index.js` or `./scripts/reasp` from the repo root instead.

### 1. Install REASP

```bash
# Clone the repository
git clone https://github.com/kevinkeor/RASS.git
cd RASS

# Run the interactive installer (choose agents, ModeProfile, workflow)
reasp
```

The installer will:
- **Detect** installed AI agents (OpenCode, Claude Code, Codex, Gemini CLI, Antigravity CLI)
- **Prompt** you to select which agents to install into
- **Ask** for your preferred ModeProfile and workflow agent
- **Install** the adapted REASP configuration into each selected agent

### 2. Choose Your ModeProfile

After installation, activate your ModeProfile via your agent's interface:

```bash
# Inside your AI agent CLI, type (OpenCode example):
/sdd

# Select your ModeProfile:
# • fast        — Quick tasks, CRUDs, simple UI
# • architecture — Complex systems, offline-first
# • ui          — UI/UX work with MeridianUI
# • debug       — Bug investigation, concurrency
# • ryouset     — Full Ryou workflow (default)
```

> **Note:** Slash commands (`/sdd`, `/reasp-setup`) are native only in OpenCode. In other agents, the equivalent workflow is described in the REASP system instructions block. Refer to your agent's prompt for available verbs.

### 3. Start Developing

REASP automatically routes your tasks to the right agent with the right model:

```
You: "Necesito diseñar una nueva feature empresarial"

REASP:
  ├─ Ryou EFI Planner       → Crea request, blueprint, shards y orchestration map
  └─ /reasp-setup         → Cambias al Ryou Orchestrator para ejecutar
```

```
You: "Create a user registration API endpoint"

RASS (Fast Mode):
  ├─ Orchestrator (GLM-5.1)  → Analyzes request
  ├─ Builder (Kimi K2.6)     → Implements API + EF Core
  └─ Reviewer (DeepSeek V4)  → Reviews code quality

Done in 3 phases instead of 8. Efficient. Fast. Precise.
```

---

<!-- ═══════════════════════════════════════════════════════════════════════════════ -->
<!-- REFI v2 · Epic + PART Methodology -->
<!-- ═══════════════════════════════════════════════════════════════════════════════ -->

## 🧭 REFI v2 · Epic + PART Methodology

REFI supports both the original **Phases** planning method and the new **Epic +
PART** methodology. The active method is selected in `reasp.config.json` via
`planning_method` and is honored by `ryou-efi-planner.md` at the start of every
planning session. Phases is the default; Epic + PART is opt-in through
`/reasp-setup` or `reasp_setup(action="set-planning-method", method="epic")`.

```text
            ┌────────────── Ryou EFI Planner ──────────────┐
            │                                               │
            │   Pass 1 — Epic Breakdown                     │
            │   ├─ request.md                                │
            │   ├─ master-blueprint.md (con EPIC breakdown)  │
            │   ├─ epics/matrix.md                           │
            │   └─ epics/<epic>/README.md  (x N)             │
            │        ⤷ STOP · WAIT FOR USER ⤷                │
            │   Pass 2 — PART Detail (por EPIC)              │
            │   └─ epics/<epic>/parts/PARTnn.md (15 sec.)     │
            │        ⤷ STOP · entre EPICs ⤷                  │
            │   Pass 3 — Orchestration                       │
            │   └─ orchestration-map.md / progress.md /       │
            │      verification.md                           │
            │        ⤷ HANDOFF TO ORCHESTRATOR ⤷             │
            │                                               │
            │   Cada PART atraviesa 8 gates                  │
            │   1·Architecture  2·Scope  3·UX  4·Manual      │
            │   5·DefectClosure 6·TechDoc 7·UserDoc 8·SignOff│
            └───────────────────────────────────────────────┘
```

**What changed**

| Layer | Before (REFI v1) | After (REFI v2) |
|---|---|---|
| Top-level concept | Domain shards | **EPICs** (subsystem-aligned) |
| Execution unit | 7-section shard | **PART** with **15 sections** + footer of 8 gates |
| Quality gates | 5 generic bullets | **8 mechanical gates** with evidence minimum |
| Planner workflow | 7 linear steps (no user waits) | **3 passes** with **2 STOP gates** waiting for user |
| Code kickoff | After 1 shard detailed | **After ALL EPICs × ALL PARTs detailed** (100 % rule) |

**What did NOT change**

- RASS phases (`orchestrator → init → explore → propose → design → apply → verify
  → archive`) still execute INSIDE each PART, chosen by the active ModeProfile.
- ModeProfiles (Fast / Architecture / UI / Debug / Enterprise / Legacy / Minimal /
  RyouSet) unchanged.
- Legacy REFI packets using `domain-shards/` keep working — migration is optional.

For the canonical vocabulary, see `.opencode/refi/rules/epic-glossary.md`. For a
worked example, see `.refi/modules/example-todo-cli/`.

---

<!-- ═══════════════════════════════════════════════════════════════════════════════ -->
<!-- Installation -->
<!-- ═══════════════════════════════════════════════════════════════════════════════ -->

## 📦 Installation

### Interactive TUI (Recommended)

```bash
cd installer
npm install
node index.js
```

> `npm install` inside `installer/` only installs local dependencies for the TUI. It does **not** register the global `reasp` command. To make `reasp` available in your terminal, run `npm install -g .` from the repository root, or `npm install -g ./installer`.

The interactive installer will guide you through:
1. **Select AI Agents** — Choose which installed agents receive REASP (OpenCode, Claude Code, Gemini CLI, Codex, Antigravity CLI).
2. **Install Globally** — Register REASP as a plugin/prompt for the selected agents.
3. **Install Locally** — Copy REASP to the current workspace `.opencode/`.
4. **Uninstall** — Remove REASP from any subset of agents.

### CLI Commands

```bash
# Interactive TUI (recommended)
cd installer
npm install
node index.js

# Install into specific agents
reasp install --agents opencode,claude-code

# Install into all currently detected agents
reasp install --only-detected

# Preview changes without writing files
reasp install --dry-run --agents opencode,codex

# Detect installed AI agents
reasp detect

# Show REASP installation status per agent
reasp status

# Install in current workspace only
reasp local

# Uninstall from specific agents
reasp uninstall --agents claude-code

# Uninstall from OpenCode (legacy default)
reasp uninstall
```

<!-- ═══════════════════════════════════════════════════════════════════════════════ -->
<!-- Linux / Unix -->
<!-- ═══════════════════════════════════════════════════════════════════════════════ -->

## 🐧 Linux / Unix

REASP works on Linux and macOS without modification. The same `reasp install` command handles both platforms; the installer detects the OS and uses the correct paths automatically.

### Requirements

| Requirement | Version |
|-------------|---------|
| Node.js | ≥ 18.0.0 |
| npm | ≥ 7 (bundled with Node 18+) |
| Git | Any recent version |

### Quick install on Linux

```bash
# 1. Clone and enter the repo
git clone https://github.com/kevinkeor/REASP.git
cd REASP

# 2. Install globally (makes `reasp` available system-wide)
npm install -g .

# 3. Run the interactive installer
reasp install
```

If `reasp` is not in your PATH after `npm install -g .`, see [reasp command not found on Linux](#reasp-command-not-found-on-linux) in the troubleshooting guide.

### Shell wrapper (no global install)

If you prefer not to install globally, use the shell wrapper directly:

```bash
# Make it executable (only needed once)
chmod +x scripts/reasp

# Run from the repo root
./scripts/reasp install
./scripts/reasp detect
```

### nvm / Volta users

REASP detects OpenCode installed via **nvm**, **Volta**, or system PATH. If OpenCode was installed with Volta:

```bash
# Volta installs binaries to ~/.volta/bin — ensure it is in PATH
echo $PATH | grep volta   # should print ~/.volta/bin
volta which opencode      # should show the path

# Then run normally
reasp install --agents opencode
```

### Global directories on Linux

| Agent | Linux global dir |
|-------|-----------------|
| OpenCode | `~/.config/opencode/` |
| Claude Code | `~/.claude/` |
| Codex | `~/.codex/` |
| Gemini CLI | `~/.gemini/` |
| Antigravity CLI | `~/.antigravity/` |
| MeridianUI | `~/.MeridianUI/` |
| REASP state | `~/.reasp/` |

---

## 💾 Snapshots & Backup Manager

REASP can take complete snapshots of an agent's global configuration before install, uninstall, or any manual change. Snapshots are stored under `~/.reasp/snapshots/<agent>/<timestamp>-<name>/` and include the full `data/` directory plus a `snapshot.json` metadata file.

### Why snapshots exist

- **Recover from a bad install** — restore a known-good config in seconds.
- **Experiment safely** — snapshot first, then tweak your agent setup.
- **Migrate between machines** — copy the snapshot directory to another system.

### Quick examples

```bash
# Snapshot Claude Code's current config
reasp snapshot create --agent claude-code --name clean

# List snapshots for an agent
reasp snapshot list --agent claude-code

# Restore a snapshot (creates an automatic backup of the live state first)
reasp snapshot restore --agent claude-code --name clean

# Delete a snapshot
reasp snapshot delete --agent claude-code --name clean

# Keep only the newest 5 snapshots
reasp snapshot purge --agent claude-code --keep 5 --yes
```

You can also manage snapshots from the interactive TUI by choosing **Snapshots** in the main menu.

### What Gets Installed

```
.opencode/
├── plugin.js              # Server plugin — AI tools
├── tui.js                 # TUI plugin — slash commands
├── rass-core.js           # Core logic — ModeProfiles, runtime
├── package.json           # Plugin manifest
├── sdd.config.json        # Global RASS modeprofile configuration
├── reasp.config.json      # Combined REASP workflow state
├── agents/                # 8 Ryou agent prompts
│   ├── ryou-orchestrator.md
│   ├── ryou-efi-planner.md
│   ├── planner.md
│   ├── builder.md
│   ├── architect.md
│   ├── reviewer.md
│   ├── debugger.md
│   └── documentation.md
├── rules/                 # Global rules
│   ├── global-rules.md
│   └── meridianui.md
├── sdd-profiles/          # 8 ModeProfile definitions
│   ├── ryouset.json
│   ├── fast.json
│   ├── architecture.json
│   ├── ui.json
│   ├── debug.json
│   ├── enterprise.json
│   ├── legacy.json
│   └── minimal.json
├── phases/                # System prompts per phase
│   ├── orchestrator.md
│   ├── init.md
│   ├── explore.md
│   ├── propose.md
│   ├── design.md
│   ├── apply.md
│   ├── verify.md
│   └── archive.md
└── runtime/               # Current state
    ├── current-modeprofile.json
    └── runtime.generated.json
scripts/
├── sync-reasp.js          # Repo ↔ global config sync (push/pull)
└── rass-sync-validator.js # Consistency checker
```

---

<!-- ═══════════════════════════════════════════════════════════════════════════════ -->
<!-- MeridianUI -->
<!-- ═══════════════════════════════════════════════════════════════════════════════ -->

## 🎨 MeridianUI

**MeridianUI** is the design system and UI library used by REASP for all UI/UX work. REASP ships a placeholder directory at `.MeridianUI/` in the repository root; when you run `reasp install`, its contents are automatically copied to `~/.MeridianUI/` on your machine (both Windows and Linux).

### Adding MeridianUI to your REASP

1. Drop your MeridianUI content into the `.MeridianUI/` directory at the root of this repository:

   ```
   REASP/
   └── .MeridianUI/
       ├── components/
       ├── tokens/
       ├── themes/
       └── ... (your content)
   ```

2. Re-run `reasp install` to deploy it globally:

   ```bash
   reasp install
   # ✓ MeridianUI installed → /home/<you>/.MeridianUI
   ```

3. REASP agents that perform UI work (especially the `ui` ModeProfile) will reference `~/.MeridianUI/` as their design system source.

> If `.MeridianUI/` contains only the `.gitkeep` placeholder (no real content yet), the installer will warn you and skip the copy — it will not fail. Add your content and re-run `reasp install`.

### MeridianUI and agents

- `rules/meridianui.md` inside `.opencode/` contains the MeridianUI rules injected into every agent.
- The **UI** ModeProfile (`/sdd` → `ui`) activates the design-focused pipeline that uses MeridianUI components as its output reference.
- Non-OpenCode agents (Claude Code, Codex, Gemini CLI, Antigravity CLI) receive the MeridianUI rules as part of their system instructions block.

### Uninstall behavior

`reasp uninstall` removes REASP from an agent's config. It does **not** remove `~/.MeridianUI/` — your globally installed design system is preserved.

---

<!-- ═══════════════════════════════════════════════════════════════════════════════ -->
<!-- Usage -->
<!-- ═══════════════════════════════════════════════════════════════════════════════ -->

## 🎮 Usage

### Slash Commands (Interactive)

| Command | Alias | Description |
|---------|-------|-------------|
| `/sdd` | `/s` | Switch, create, edit, or delete ModeProfiles |
| `/sdd-mode` | `/sm` | Quick alias for `/sdd` |
| `/sdd-profile` | `/sp` | Quick alias for `/sdd` |
| `/rass-setup` | `/rs` | Legacy alias for REASP setup |
| `/reasp-setup` | `/reasp` | Switch workflow between Ryou EFI Planner and Ryou Orchestrator |

#### `/sdd` — ModeProfile Manager

```
┌─────────────────────────────────────────┐
│  SDD ModeProfile Manager                │
│                                         │
│  Current: ryouset                       │
│                                         │
│  [•] List all ModeProfiles              │
│  [•] Switch to existing                 │
│  [•] + Create New ModeProfile...       │
│  [•] Edit existing                      │
│  [•] Delete ModeProfile                 │
└─────────────────────────────────────────┘
```

**Creating a new ModeProfile:**
1. Enter name
2. Enter description (optional)
3. Select phases (toggle on/off)
4. Choose model strategy:
   - **Single model** — One model for all phases
   - **Per-phase** — Different model per phase
5. Configure models, effort, fallbacks
6. Save

#### `/reasp-setup` — REASP Control Center

```
┌─────────────────────────────────────────┐
│  RASS Setup                             │
│                                         │
│  [•] Status — View current config       │
│  [•] RyouSet — Switch to RyouSet        │
│  [•] Agents — View 7 Ryou agents        │
└─────────────────────────────────────────┘
```

### AI Tools (Programmatic)

The plugin exposes tools that AI agents can call directly:

```javascript
// List all ModeProfiles
sdd_mode_profile(action="list")

// Switch to architecture mode
sdd_mode_profile(action="switch", name="architecture")

// Create custom ModeProfile
sdd_mode_profile(
  action="create",
  name="custom-api",
  phases="orchestrator,apply,verify",
  model_strategy="per-phase",
  primary="opencode-go/glm-5.1",
  effort="medium"
)

// Check RASS status
rass_setup(action="status")

// Deploy Ryou agents
rass_setup(action="deploy")
```

---

<!-- ═══════════════════════════════════════════════════════════════════════════════ -->
<!-- ModeProfiles -->
<!-- ═══════════════════════════════════════════════════════════════════════════════ -->

## 🧠 ModeProfiles

ModeProfiles combine **which phases run** with **which models handle each phase** into a single unified concept.

### Built-in ModeProfiles

| ModeProfile | Phases | Strategy | Best For |
|-------------|--------|----------|----------|
| **🌟 RyouSet** | orchestrator → init → explore → propose → design → apply → verify → archive | per-phase | Full Ryou workflow with your exact config |
| **⚡ Fast** | orchestrator → apply → verify | per-phase | CRUDs, simple UI, APIs |
| **🏗️ Architecture** | orchestrator → init → explore → propose → design → apply → verify → archive | per-phase | Complex systems, offline-first |
| **🎨 UI** | orchestrator → design → apply → verify | per-phase | MeridianUI, MAUI, Blazor, Avalonia |
| **🐛 Debug** | orchestrator → explore → apply → verify | per-phase | Bugs, concurrency, memory leaks |
| **🏢 Enterprise** | orchestrator → init → explore → propose → design → apply → verify → archive | per-phase | Mission-critical, maximum robustness |
| **📜 Legacy** | orchestrator → init → explore → propose → apply → verify | per-phase | Legacy refactors, modernization |
| **🔬 Minimal** | orchestrator → explore → apply | per-phase | Quick iterations, low consumption |

### Model Strategy

- **`single`** — One model, effort, and fallback set for every phase. Simple and fast to configure.
- **`per-phase`** — Each phase has its own model, effort, and fallbacks. Maximum control and quality.

### Available Models (OpenCode Go)

| Model ID | Label | Best For |
|----------|-------|----------|
| `opencode-go/glm-5.1` | GLM-5.1 | Orchestration, planning, architecture, complex reasoning |
| `opencode-go/kimi-k2.6` | Kimi K2.6 | Implementation, refactors, C#/.NET code generation |
| `opencode-go/deepseek-v4-pro` | DeepSeek V4 Pro | Debugging, review, performance, risk analysis |
| `opencode-go/deepseek-v4-flash` | DeepSeek V4 Flash | Small tasks, documentation, summaries |

### Effort Levels

| Effort | Objective | Token Usage |
|--------|-----------|-------------|
| `low` | Speed — minimal reasoning | Low |
| `medium` | Balanced — standard reasoning | Medium |
| `high` | Deep reasoning — thorough analysis | High |
| `extreme` | Maximum analysis — exhaustive | Very High |

---

<!-- ═══════════════════════════════════════════════════════════════════════════════ -->
<!-- Ryou Agents -->
<!-- ═══════════════════════════════════════════════════════════════════════════════ -->

## 🤖 Ryou Agents

When you install REASP globally, it deploys **8 specialized agents** to your OpenCode configuration, including **Ryou EFI Planner** for planning and **Ryou Orchestrator** for implementation.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RYOU AGENT ECOSYSTEM                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────┐                                                        │
│   │  🎯 Ryou        │  Primary Orchestrator                                  │
│   │  Orchestrator   │  Routes, delegates, coordinates                        │
│   │  GLM-5.1        │  40 steps • Default agent                              │
│   └────────┬────────┘                                                        │
│            │                                                                 │
│   ┌────────┴────────┬────────────────┬────────────────┐                      │
│   │                 │                │                │                      │
│   ▼                 ▼                ▼                ▼                      │
│ ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐                    │
│ │ 📋      │    │ 🏗️      │    │ 🔍      │    │ 🐛      │                    │
│ │ Planner │    │Architect│    │Reviewer │    │Debugger │                    │
│ │GLM-5.1  │    │GLM-5.1  │    │DS V4 Pro│    │DS V4 Pro│                    │
│ │14 steps │    │16 steps │    │18 steps │    │26 steps │                    │
│ └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘                    │
│      │              │              │              │                         │
│      └──────────────┴──────────────┘              │                         │
│                     │                             │                         │
│                     ▼                             ▼                         │
│               ┌─────────┐                   ┌─────────┐                      │
│               │ 🔨      │                   │ 📝      │                      │
│               │ Builder │                   │Documentation│                │
│               │Kimi K2.6│                   │DS V4 Flash│                    │
│               │40 steps │                   │12 steps │                      │
│               └─────────┘                   └─────────┘                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Agent Details

| Agent | Model | Role | Steps | When to Use |
|-------|-------|------|-------|-------------|
| **ryou-orchestrator** | GLM-5.1 | Primary orchestrator — routes, delegates, coordinates | 40 | Every task — default agent |
| **planner** | GLM-5.1 | Planning — breaks work into phases, identifies risks | 14 | Multi-file work, unclear path |
| **builder** | Kimi K2.6 | Implementation — C#, .NET, EF Core, XAML, Blazor, MAUI | 40 | Code generation, implementation |
| **architect** | GLM-5.1 | Architecture — boundaries, data flow, design tradeoffs | 16 | Clean Architecture, major refactors |
| **reviewer** | DeepSeek V4 Pro | Review — bugs, regressions, performance, security | 18 | After implementation, risky changes |
| **debugger** | DeepSeek V4 Pro | Debug — root cause, failing tests, runtime errors | 26 | Failing tests, runtime errors |
| **documentation** | DeepSeek V4 Flash | Docs — Markdown, HTML summaries, changelogs | 12 | After implementation, docs needed |

### Agent Synchronization

When you switch ModeProfiles with `/sdd`, RASS **automatically synchronizes** agent models:

```javascript
// Example: Switching to Architecture mode
/sdd → select "architecture"

// RASS automatically updates:
// • ryou-orchestrator → GLM-5.1 (orchestrator phase)
// • planner → GLM-5.1 (propose phase)
// • builder → Kimi K2.6 (apply phase)
// • reviewer → DeepSeek V4 Pro (verify phase)
// • etc.
```

---

<!-- ═══════════════════════════════════════════════════════════════════════════════ -->
<!-- Architecture -->
<!-- ═══════════════════════════════════════════════════════════════════════════════ -->

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           RASS ARCHITECTURE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         OPENCODE GO                                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────────┐  │   │
│  │  │   TUI       │  │   Server    │  │      Agent System           │  │   │
│  │  │  Plugin     │  │   Plugin    │  │  ┌─────────────────────┐   │  │   │
│  │  │             │  │             │  │  │  ryou-orchestrator  │   │  │   │
│  │  │ • /sdd      │  │ • sdd_mode  │  │  │  planner            │   │  │   │
│  │  │ • /rass-setup│  │   _profile  │  │  │  builder            │   │  │   │
│  │  │             │  │ • rass_setup│  │  │  architect          │   │  │   │
│  │  └──────┬──────┘  └──────┬──────┘  │  │  reviewer           │   │  │   │
│  │         │                │         │  │  debugger           │   │  │   │
│  │         └────────────────┘         │  │  documentation      │   │  │   │
│  │                   │                  │  └─────────────────────┘   │  │   │
│  └───────────────────┼──────────────────┘                              │   │
│                      │                                                │   │
│                      ▼                                                │   │
│  ┌─────────────────────────────────────────────────────────────────┐  │   │
│  │                      RASS CORE (rass-core.js)                    │  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │  │   │
│  │  │ ModeProfile  │  │   Runtime   │  │    Agent Deployment     │ │  │   │
│  │  │ Manager      │  │   Generator │  │    & Sync               │ │  │   │
│  │  │              │  │             │  │                         │ │  │   │
│  │  │ • list       │  │ • resolve   │  │ • deploy agents        │ │  │   │
│  │  │ • switch     │  │   models    │  │ • sync with profile    │ │  │   │
│  │  │ • create     │  │ • resolve   │  │ • check configuration  │ │  │   │
│  │  │ • edit       │  │   effort    │  │                         │ │  │   │
│  │  │ • delete     │  │ • generate  │  │                         │ │  │   │
│  │  │              │  │   runtime   │  │                         │ │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘ │  │   │
│  └─────────────────────────────────────────────────────────────────┘  │   │
│                      │                                                │   │
│                      ▼                                                │   │
│  ┌─────────────────────────────────────────────────────────────────┐  │   │
│  │                      CONFIGURATION LAYER                         │  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │  │   │
│  │  │ sdd-profiles/│  │   phases/    │  │    agents/              │ │  │   │
│  │  │              │  │              │  │                         │ │  │   │
│  │  │ • ryouset    │  │ • orchestrator│  │ • ryou-orchestrator   │ │  │   │
│  │  │ • fast       │  │ • init       │  │ • planner              │ │  │   │
│  │  │ • architecture│  │ • explore    │  │ • builder              │ │  │   │
│  │  │ • ui         │  │ • propose    │  │ • architect            │ │  │   │
│  │  │ • debug      │  │ • design     │  │ • reviewer             │ │  │   │
│  │  │ • enterprise │  │ • apply      │  │ • debugger             │ │  │   │
│  │  │ • legacy     │  │ • verify     │  │ • documentation        │ │  │   │
│  │  │ • minimal    │  │ • archive    │  │                         │ │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘ │  │   │
│  └─────────────────────────────────────────────────────────────────┘  │   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### How It Works

1. **Task Arrives** → Orchestrator analyzes complexity
2. **ModeProfile Selected** → Appropriate pipeline chosen (Fast/Architecture/UI/etc.)
3. **Runtime Generated** → `runtime.generated.json` created with resolved models per phase
4. **Agents Deployed** → Ryou agents synchronized with ModeProfile configuration
5. **Pipeline Executes** → Each phase runs with its assigned model and effort level
6. **Results Verified** → Reviewer checks quality, debugger catches issues
7. **Documentation** → Summary generated for future reference

**No recursive agents. No infinite loops. No massive specs for trivial tasks.**

---

<!-- ═══════════════════════════════════════════════════════════════════════════════ -->
<!-- Customization -->
<!-- ═══════════════════════════════════════════════════════════════════════════════ -->

## ⚙️ Customization

### Creating Custom ModeProfiles

#### Via TUI (Interactive)

```bash
# Inside OpenCode
/sdd

# Select "+ Create New ModeProfile..."
# 1. Enter name: "my-custom-api"
# 2. Enter description: "Optimized for API development"
# 3. Select phases: [✓] orchestrator [✓] apply [✓] verify
# 4. Choose strategy: per-phase
# 5. Configure per-phase models
# 6. Save
```

#### Via AI Tool

```javascript
sdd_mode_profile(
  action="create",
  name="custom-api",
  phases="orchestrator,apply,verify",
  model_strategy="per-phase",
  primary="opencode-go/glm-5.1",
  effort="medium"
)
```

#### Via JSON (Manual)

Create `.opencode/sdd-profiles/my-profile.json`:

```json
{
  "name": "My Custom Profile",
  "description": "Optimized for API development",
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

### Single Model Strategy

For simple configurations:

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

### Customizing Agent Prompts

Edit files in `.opencode/agents/` to customize agent behavior:

```markdown
# .opencode/agents/builder.md

## Custom Rules
- Always use async/await for I/O operations
- Prefer record types for DTOs
- Use primary constructors where applicable
```

---

<!-- ═══════════════════════════════════════════════════════════════════════════════ -->
<!-- Use Cases -->
<!-- ═══════════════════════════════════════════════════════════════════════════════ -->

## 📊 Use Cases

### 🚀 Simple CRUD API

```
Task: "Create a user registration endpoint"

ModeProfile: Fast
Pipeline:
  ├─ Orchestrator (GLM-5.1)     → "Simple API task, route to builder"
  ├─ Builder (Kimi K2.6)          → Implements controller + DTOs + EF
  └─ Reviewer (DeepSeek V4 Pro)   → "Looks good, no issues"

Result: ✅ Done in 3 phases, minimal tokens
```

### 🏗️ Complex Architecture

```
Task: "Design offline-first sync system with conflict resolution"

ModeProfile: Architecture
Pipeline:
  ├─ Orchestrator (GLM-5.1)       → "Complex task, full pipeline"
  ├─ Init (Kimi K2.6)              → Analyzes existing codebase
  ├─ Explore (Kimi K2.6)           → Identifies sync patterns, risks
  ├─ Propose (GLM-5.1)            → Designs architecture, tradeoffs
  ├─ Design (Kimi K2.6)            → MeridianUI components, data flow
  ├─ Builder (Kimi K2.6)           → Implements sync service, repositories
  ├─ Reviewer (DeepSeek V4 Pro)    → Reviews concurrency, EF queries
  └─ Archive (DeepSeek V4 Flash)   → Documents architecture decisions

Result: ✅ Thoroughly designed, implemented, and documented
```

### 🎨 UI Development

```
Task: "Create responsive dashboard with data visualization"

ModeProfile: UI
Pipeline:
  ├─ Orchestrator (GLM-5.1)       → "UI task, include design phase"
  ├─ Design (Kimi K2.6)            → MeridianUI components, layouts
  ├─ Builder (Kimi K2.6)           → Implements Blazor components
  └─ Reviewer (DeepSeek V4 Pro)    → Checks accessibility, responsive

Result: ✅ Beautiful, accessible, responsive UI
```

### 🐛 Debugging

```
Task: "Fix memory leak in background service"

ModeProfile: Debug
Pipeline:
  ├─ Orchestrator (GLM-5.1)       → "Debug task, investigate first"
  ├─ Explore (Kimi K2.6)           → Analyzes memory patterns
  ├─ Builder (Kimi K2.6)           → Implements fix
  └─ Reviewer (DeepSeek V4 Pro)    → Verifies fix, checks for regressions

Result: ✅ Root cause identified, fixed, verified
```

---

<!-- ═══════════════════════════════════════════════════════════════════════════════ -->
<!-- Philosophy -->
<!-- ═══════════════════════════════════════════════════════════════════════════════ -->

## 🎨 Philosophy

> **"The problem today is not 'having an AI' — it's 'using the right model, with the right workflow, for the right task."**

### Core Principles

1. **Adaptive Complexity** — Fast for simple tasks, Architecture for complex ones
2. **Intelligent Routing** — GLM-5.1 for orchestration, Kimi K2.6 for implementation, DeepSeek for review
3. **Controlled Effort** — Low for speed, Extreme for deep analysis
4. **Human Control** — You direct, the AI executes
5. **Token Efficiency** — No waste on unnecessary phases
6. **Quality Assurance** — Every task gets appropriate verification

### What RASS Is NOT

❌ **Not** a massive autonomous pipeline that runs everything every time  
❌ **Not** a black box that makes decisions without your input  
❌ **Not** a one-size-fits-all solution  
❌ **Not** recursive or prone to infinite loops  

### What RASS IS

✅ **Is** adaptive — complexity matches the task  
✅ **Is** transparent — you control the pipeline  
✅ **Is** efficient — minimal tokens for maximum results  
✅ **Is** specialized — right model for each phase  
✅ **Is** pragmatic — simple solutions over complex abstractions  

---

<!-- ═══════════════════════════════════════════════════════════════════════════════ -->
<!-- License -->
<!-- ═══════════════════════════════════════════════════════════════════════════════ -->

## 📜 License

**KeorSoft Open Development License (KODL) v1.0**

Free and open source for use in developing any commercial or non-commercial tool or software. RASS itself may not be sold, resold, or commercialized as a standalone product. See [LICENSE.md](./LICENSE.md) for full terms.

Built with ❤️ by Kevin Keor for OpenCode, Claude Code, Gemini CLI, Codex, and Antigravity CLI.

---

<div align="center">

<p>
  <strong>RASS</strong> — Ryou Adaptive SDD System v3.0.0
</p>

<p>
  <em>Concepts > Code. We control the flow, the AI executes.</em>
</p>

<p>
  <a href="#-table-of-contents">⬆ Back to Top</a>
</p>

</div>
│   └── refi-enterprise-feature-implementation/
├── refi/                  # REFI toolkit installed with REASP
│   ├── README.md
│   ├── config.yaml
│   ├── rules/
│   └── templates/
