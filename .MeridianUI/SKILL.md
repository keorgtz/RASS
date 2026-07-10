---
name: MeridianUI
description: Use this skill before creating or modifying ANY UI for Keorsoft / SHEndevour / VestaRest products — WPF/XAML, .NET MAUI, Blazor Web, HTML/CSS, React/JSX, or Avalonia. MeridianUI is the single source of truth for design tokens, components, layout, color, typography, iconography and accessibility for these products. Trigger this whenever the user asks for a dashboard, dialog, CRUD screen, form, sidebar, KPI card, data table, or any visual/styled element in SHEndevour, VestaRest, or any Keorsoft product — even if they don't say "MeridianUI" or "design system" explicitly.
---

# MeridianUI

MeridianUI is the Keorsoft design system — it is the only source of truth for UI/UX across SHEndevour (Desktop WPF + Web) and related products. Visual language: Fluent Design surfaces + Material Expressive color/iconography + MaterialDesignInXaml as the WPF technical base, tuned for dense, comfortable back-office tooling ("Enterprise-soft" — no gradients, no glassmorphism, no decorative noise, animation ≤200ms).

## Required reading before UI work

Always start with:
- `README.md` — full source of truth: tone, content rules, color, typography, spacing, animation, iconography, UI-kit catalogue.
- `colors_and_type.css` — every CSS variable / token in the system. Copy or import this before writing any CSS.

Then read whatever is relevant to the task:
- Relevant specimen files under `preview/` (palettes, typography, buttons, KPI card, table card, nota card, sidebar, titlebar, caja footer, dialogs, forms, icons, logo, etc.) — these are small focused examples of each pattern.
- Relevant platform guide under `references/` (see table below).
- Relevant kit under `ui_kits/`.
- `reference/` for full original design specs of existing dashboards (densest source of real bindings/patterns).

## Platform mapping

| Platform | Tokens | Components / Kit | Platform guide |
|---|---|---|---|
| WPF / XAML | `tokens-wpf.xaml` | `reference/MetricsDashboard_Design.md`, `reference/AccountStateDashboard_Design.md`, `reference/SHEDashboard_Design.md` | `references/platform-wpf.md` |
| .NET MAUI | `tokens-maui.xaml` | (reuse same tokens, build custom controls) | `references/platform-maui.md` |
| Blazor Web | `colors_and_type.css` | `ui_kits/shendevour-blazor/*.razor` | `references/platform-blazor.md` |
| HTML/CSS/React | `colors_and_type.css` | `ui_kits/shendevour-web/components/*.jsx` | — |
| Avalonia (Linux) | map MeridianUI tokens into Avalonia resources before building controls | — | — |

## When invoked without other context, ask:

1. ¿Qué están construyendo? (prototipo desechable / mock, slide interno, o código de producción)
2. ¿Qué plataforma? (WPF · MAUI · Blazor · HTML/React · Avalonia)
3. ¿Qué producto / módulo? (SHEndevour Desktop / SHEndevour Web son el target canónico; trátalo como un módulo nuevo que debe encajar con los existentes si es otro)
4. ¿Contenido en español (default) o inglés?

## Non-negotiables

- Do not invent colors, shadows, radii, spacing, font sizes, or icon systems — pull everything from the tokens.
- Do not modify MeridianUI itself (tokens, README, kits) unless explicitly requested.
- Use Material Symbols Rounded for icons when the platform supports it.
- Cover loading, empty, error, success, disabled, selected, and active states when relevant.
- Keep interfaces dense, clear, accessible, and consistent with existing screens.
- Avoid gradients, glassmorphism, text shadows, decorative backgrounds, and ad-hoc styling not backed by a token.
- For WPF specifically: follow Kevin's existing convention — AddEditDialog pattern for CRUDs, services injected via DI in `App.xaml.cs`, Material Expressive as the preferred modern visual style.

## Output expectations

For every UI task, explicitly state:
- Which MeridianUI files were inspected.
- Which design tokens were reused.
- Which components or UI patterns were reused (or which existing dashboard/dialog it was modeled after).
- If a required component doesn't exist yet, say so explicitly and build it following MeridianUI conventions (same token usage, same density, same states) rather than inventing a new style.
