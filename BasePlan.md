# Guía Maestra — Adaptive SDD Framework para OpenCode

## Ryou Adaptive SDD System (RASS)

Basado en tu workflow real, tu stack .NET y la filosofía del SDD multi-modelo/sub-agent.
Inspirado en tu guía SDD original, pero transformado a una arquitectura:

* pragmática
* modular
* configurable
* multi-perfil
* multi-modelo
* adaptable a OpenCode moderno

La guía SDD original define muy bien la separación de responsabilidades IA por fase. 

---

# OBJETIVO FINAL

Construir un sistema para OpenCode que permita:

```text id="h7c0a4"
Cambiar dinámicamente entre Modos SDD
```

Por ejemplo:

| Modo              | Objetivo           |
| ----------------- | ------------------ |
| Fast Mode         | velocidad          |
| Architecture Mode | sistemas complejos |
| UI Mode           | diseño/UI          |
| Debug Mode        | debugging          |
| Legacy Mode       | refactors legacy   |
| Enterprise Mode   | máxima robustez    |
| Minimal Mode      | bajo consumo       |
| Offline Mode      | sin internet       |
| Experimental Mode | pruebas            |

Y además:

✅ perfiles por modo
✅ modelos configurables por fase
✅ effort configurable
✅ fallbacks
✅ routing inteligente
✅ prompts por fase
✅ custom workflows
✅ switch dinámico en OpenCode

---

# FILOSOFÍA DEL SISTEMA

## El error de Gentle-AI

Gentle-AI asumía:

```text id="9drnfe"
“SIEMPRE usar pipeline completo”
```

Eso genera:

* sobrecoste
* sobreingeniería
* latencia
* prompts gigantes

---

# Adaptive SDD

Tu sistema debe funcionar así:

```text id="c4sqtx"
El workflow se adapta al tipo de tarea
```

---

# EJEMPLO

## CRUD simple

```text id="ny8ffg"
Orchestrator
→ Builder
→ Reviewer
```

---

## Refactor grande

```text id="cv3bpn"
Orchestrator
→ Explore
→ Propose
→ Builder
→ Reviewer
→ Documentation
```

---

## UI compleja

```text id="njxwtg"
Orchestrator
→ Design
→ Builder
→ Reviewer
```

---

# ARQUITECTURA FINAL

---

# 1. CORE SYSTEM

Ruta:

```text id="uxh1gs"
.opencode/
```

---

# ESTRUCTURA

```text id="g3m1ur"
.opencode
│
├── modes/
│   ├── fast/
│   ├── architecture/
│   ├── ui/
│   ├── debug/
│   ├── enterprise/
│   └── minimal/
│
├── profiles/
│   ├── premium/
│   ├── balanced/
│   ├── free/
│   └── local/
│
├── phases/
│   ├── orchestrator.md
│   ├── init.md
│   ├── explore.md
│   ├── propose.md
│   ├── design.md
│   ├── apply.md
│   ├── verify.md
│   └── archive.md
│
├── runtime/
│   ├── current-mode.json
│   ├── current-profile.json
│   └── cache/
│
├── scripts/
│   ├── switch-mode.ps1
│   ├── switch-profile.ps1
│   ├── generate-runtime.ps1
│   └── resolve-model.ps1
│
└── sdd.config.json
```

---

# 2. CONCEPTO CLAVE

---

# MODES

Definen:

```text id="yrtrqy"
QUÉ fases existen
```

---

# Ejemplo

## Fast Mode

```json id="bfy1ao"
[
  "orchestrator",
  "apply",
  "verify"
]
```

---

## Architecture Mode

```json id="2r4d0o"
[
  "orchestrator",
  "init",
  "explore",
  "propose",
  "apply",
  "verify",
  "documentation"
]
```

---

# 3. PROFILES

Definen:

```text id="zwkjyx"
QUÉ modelos usa cada fase
```

---

# Ejemplo

## premium.json

```json id="zjlwmv"
{
  "orchestrator": {
    "primary": "openai/gpt-5.5",
    "fallbacks": [
      "anthropic/claude-sonnet-4",
      "opencode-go/glm-5.1"
    ]
  },

  "apply": {
    "primary": "opencode-go/kimi-k2.6",
    "fallbacks": [
      "mistral/codestral",
      "google/gemma-4"
    ]
  }
}
```

---

# 4. EFFORT SYSTEM

MUY importante.

Cada fase debe poder configurar:

| Effort  | Objetivo          |
| ------- | ----------------- |
| low     | velocidad         |
| medium  | balance           |
| high    | reasoning         |
| extreme | análisis profundo |

---

# Ejemplo

```json id="7s0rk4"
"propose": {
  "primary": "openai/gpt-5.5",
  "effort": "high"
}
```

---

# 5. FASES

---

# ORCHESTRATOR

Responsabilidad:

* routing
* delegación
* selección de modo
* selección de perfil
* reducción de contexto

---

# INIT

Responsabilidad:

* leer proyecto
* entender stack
* identificar arquitectura

---

# EXPLORE

Responsabilidad:

* impacto
* dependencias
* riesgos
* módulos afectados

---

# PROPOSE

Responsabilidad:

* arquitectura
* decisiones
* tradeoffs

---

# DESIGN

Responsabilidad:

* MeridianUI
* layouts
* UX
* responsive
* accesibilidad

---

# APPLY

Responsabilidad:

* código
* implementación
* EF
* APIs
* XAML
* Blazor

---

# VERIFY

Responsabilidad:

* bugs
* SOLID
* performance
* UX consistency

---

# ARCHIVE

Responsabilidad:

* summaries
* changelogs
* docs

---

# 6. SWITCH SYSTEM

Aquí está lo importante.

---

# Comando

```powershell id="cujv1m"
sdd-mode architecture
```

Debe:

1. actualizar runtime/current-mode.json
2. regenerar config runtime
3. recargar orchestrator

---

# Ejemplo current-mode.json

```json id="yhz94w"
{
  "mode": "architecture"
}
```

---

# 7. GENERADOR DE RUNTIME

OpenCode NO debe leer 40 configs dinámicamente.

Debes generar:

```text id="jxsn5w"
runtime.generated.json
```

---

# Ejemplo

```json id="mwtprn"
{
  "active_mode": "architecture",
  "active_profile": "premium",

  "phases": {
    "orchestrator": {
      "model": "openai/gpt-5.5",
      "effort": "medium"
    },

    "propose": {
      "model": "openai/gpt-5.5",
      "effort": "high"
    },

    "apply": {
      "model": "opencode-go/kimi-k2.6",
      "effort": "medium"
    }
  }
}
```

---

# 8. TU MODOS RECOMENDADOS

---

# FAST MODE

Para:

* CRUDs
* UI simple
* APIs
* tareas rápidas

Pipeline:

```text id="h11i2g"
orchestrator
→ apply
→ verify
```

---

# ARCHITECTURE MODE

Para:

* offline-first
* billing
* sincronización
* refactors grandes

Pipeline:

```text id="bnq1sh"
orchestrator
→ init
→ explore
→ propose
→ apply
→ verify
→ archive
```

---

# UI MODE

Para:

* MeridianUI
* MAUI
* Blazor
* Avalonia

Pipeline:

```text id="s0wxwa"
orchestrator
→ design
→ apply
→ verify
```

---

# DEBUG MODE

Para:

* bugs complejos
* concurrencia
* memory leaks

Pipeline:

```text id="qmdr1t"
orchestrator
→ explore
→ verify
→ apply
→ verify
```

---

# LEGACY MODE

Para:

* sistemas viejos
* refactors masivos

Pipeline:

```text id="a5szt1"
orchestrator
→ init
→ explore
→ propose
→ apply
→ verify
```

---

# 9. TU PERFILES RECOMENDADOS

---

# PREMIUM

Máxima calidad.

Usa:

* GPT
* Claude
* OpenCode GO

---

# BALANCED

Tu perfil principal.

Usa:

* GPT
* OpenCode GO
* Gemini Flash
* Mistral

---

# MINIMAL

Bajo costo.

Usa:

* Gemma
* Qwen
* GLM
* Flash Lite

---

# LOCAL

Offline/local.

Usa:

* llama.cpp
* qwen local
* deepseek local

---

# 10. INTEGRACIÓN CON OPENCODE

---

# Comando custom

```powershell id="k99w29"
sdd-mode fast
```

---

# Alias PowerShell

```powershell id="laj5zn"
function sdd-mode {
    param($mode)

    pwsh ./.opencode/scripts/switch-mode.ps1 $mode
}
```

---

# 11. PROMPT MAESTRO PARA GENERAR EL SISTEMA

Este es el prompt que debes darle a tus IAs.

---

# PROMPT

Build an Adaptive SDD (Sub-Agent Driven Development) Framework for OpenCode.
The System Name Is "Ryou Adaptative SDD System" Or "RASS"

The system must support:

* Multiple SDD modes
* Multiple profiles
* Dynamic model routing
* Dynamic effort configuration
* Runtime generation
* Multi-provider support
* Manual mode switching
* Manual profile switching
* Configurable phases
* Configurable fallbacks
* Configurable prompts
* PowerShell integration
* OpenCode compatibility

The architecture must be modular and maintainable.

# Main Requirements

Implement:

* runtime generator
* mode switcher
* profile switcher
* phase resolver
* model resolver
* fallback resolver
* runtime cache
* OpenCode integration

# Required Folder Structure

.opencode/
modes/
profiles/
phases/
runtime/
scripts/

# SDD Modes

Implement:

* fast
* architecture
* ui
* debug
* legacy
* enterprise
* minimal

Each mode defines:

* enabled phases
* phase order
* default effort
* routing rules

# Profiles

Implement:

* premium
* balanced
* minimal
* local

Profiles define:

* model per phase
* fallbacks
* effort overrides
* provider preferences

# Supported Phases

* orchestrator
* init
* explore
* propose
* design
* apply
* verify
* archive

# Runtime

Generate:

runtime.generated.json

This file must contain:

* active mode
* active profile
* resolved models
* resolved effort
* resolved fallbacks
* enabled phases

# Switching

Implement PowerShell commands:

sdd-mode 
sdd-profile 

These commands must:

* update runtime config
* regenerate runtime
* reload OpenCode runtime state

# Design Goals

* pragmatic
* lightweight
* fast
* maintainable
* low token waste
* context efficient
* compatible with OpenCode Go
* compatible with OpenAI OAuth
* compatible with Gemini API
* compatible with OpenRouter

# Important Philosophy

Do NOT create:

* recursive agents
* infinite loops
* massive autonomous workflows
* giant specs for trivial tasks

The system must adapt complexity to the task.

Simple tasks:

* minimal phases

Complex tasks:

* advanced pipelines

# Primary Stack

* .NET 9
* C#
* WPF
* AvaloniaUI
* ASP.NET Core
* Blazor
* Entity Framework Core
* SQL Server
* SQLite

# Design System

MeridianUI is globally available at:

C:\Users\kevin.MeridianUI

Always reuse MeridianUI before generating new UI.

---

# CONCLUSIÓN REAL

Lo que estás intentando construir ya NO es:

> “configurar OpenCode”

Estás construyendo:

```text id="lh3k2v"
un sistema operativo de desarrollo IA adaptativo
```

Y honestamente:
la idea es MUY buena.

Porque el problema REAL hoy NO es:

> “tener una IA”

Es:

> “usar el modelo correcto, con el workflow correcto, para la tarea correcta”.
