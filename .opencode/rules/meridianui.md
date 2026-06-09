# MeridianUI · Regla de Design System

> **MeridianUI** es el lenguaje visual propio de **Keorsoft** (usado en SHEndevour y demás productos).
> Es la **única** fuente de verdad para UI/UX. Toda interfaz que se diseñe o implemente debe
> respetar MeridianUI **exactamente**, sin importar la tecnología.

---

## 0. Fuente de verdad (leer SIEMPRE primero)

El design system vive en:

```
C:\Users\kevin\.MeridianUI
```

**Antes de generar cualquier UI**, consultar estos archivos en ese directorio:

| Archivo | Para qué |
|---------|----------|
| `README.md` | Fuente de verdad: tono, contenido, color, tipografía, spacing, animación, iconografía, catálogo. |
| `colors_and_type.css` | **Todos** los tokens (color, tipo, spacing, radios, sombras, transiciones). Copiar/inlinar antes de escribir CSS. |
| `SKILL.md` | Reglas de trabajo del skill MeridianUI. |
| `preview/*.html` | Specimen cards de cada patrón (botones, KPI, tabla, sidebar, etc.). |
| `skills/meridianui-design/references/platform-*.md` | Guías de extrapolación a **Blazor / WPF / MAUI**. |
| `ui_kits/shendevour-blazor/*.razor` | Componentes Blazor listos (`MIcon`, `KpiCard`, `PageHeader`, `Shell`). |
| `tokens-wpf.xaml` / `tokens-maui.xaml` | Tokens ya portados a XAML. |

> **Nunca inventar valores** (hex, tamaños, radios). Si no está en `colors_and_type.css`, no se usa.

---

## 1. Principio de extrapolación (multi-tecnología)

MeridianUI está escrito en **HTML/CSS** como base de referencia, pero es **agnóstico de tecnología**.
El estilo debe reproducirse **idéntico** en cualquier stack de UI: **Blazor, WPF/XAML, MAUI, React, Tailwind**, etc.

- Los **tokens CSS** son la fuente. Cada plataforma los mapea con su convención:
  - **CSS/Blazor/React:** `var(--em)`, `var(--r-xl)`, clases `t-label`, `t-amount`, etc.
  - **WPF:** `{StaticResource EmBrush}`, `RadiusXl`, `Fs13` (ver `platform-wpf.md`).
  - **MAUI:** `{StaticResource Em}`, `RadiusXl`, `Fs13` (ver `platform-maui.md`).
  - **Tailwind:** mapear los tokens a `theme.extend` (colores `em/am/in/vi/or` con sus 5 niveles, radios, spacing base-4) — nunca usar la paleta default de Tailwind.
- Al portar a una tecnología nueva, **documentar el mapeo** token→recurso en comentarios de código.
- Reusar los componentes existentes del kit (`ui_kits/`) como punto de partida antes de crear nuevos.

---

## 2. Tokens esenciales (resumen — la fuente es `colors_and_type.css`)

### Color — sistema semántico de 5 niveles (`strong / mid / light / pale / bg`)

| Familia | Token base | Significado |
|---------|-----------|-------------|
| **Emerald** | `--em` `#10B981` | OK / ingreso / éxito / llegadas |
| **Amber** | `--am` `#F59E0B` | alerta / pendiente / salidas |
| **Indigo** | `--in` `#6366F1` | neutro / referencia / ocupación |
| **Violet** | `--vi` `#8B5CF6` | total / resumen / forecast |
| **Orange** | `--or` `#F97316` | gasto / advertencia |
| Pink | `--pk` `#EC4899` | acento secundario |

- **Primario de acción (CTA):** `--primary` `#1976D2`.
- **Neutros:** `--gray-dark` (texto), `--gray-700`, `--gray-muted` (labels), `--gray-line` (bordes), `--page-bg` `#F2F3F7`, `--white`.
- **Azules de marca Keorsoft** (`--kr-blue`…): **solo** chrome de marca (logos/splash), **nunca** data UI.

### Tipografía

- **`Inter`** (fallback `Segoe UI`) para **todo** el producto.
- **`Coco Gothic`** (`--font-brand`) **exclusivo** para wordmarks de marca (Keorsoft, SHEndevour) — se entrega como PNG/SVG, **nunca** como texto vivo en UI.
- Escala: `9 / 10 / 11 / 12 / 13 / 14 / 16 / 18 / 22 / 28 / 42` px. Body nunca < 12 px; metas mínimo 9 px.
- Pesos: `400 / 500 / 600 / 700 / 800`.
- Clases utilitarias: `h-page-title`, `h-section-title`, `h-module-title`, `t-kpi-value`, `t-label`, `t-meta`, `t-body`, `t-amount`.

### Espaciado, radios, sombras, transiciones

- **Spacing base 4 px:** `--s1`(4) … `--s8`(40).
- **Radios:** `--r-sm`(6, inputs) · `--r-md`(10, botones/chips) · `--r-lg`(14, tablas) · `--r-xl`(20, KPI/caja) · `--r-full`.
- **Elevación:** `--shadow` (Dp1) · `--shadow-2` (Dp2) · `--shadow-3` (Dp3). Sin `text-shadow`, sin insets.
- **Transiciones:** `--t-fast`(120ms) · `--t-base`(150ms) · `--t-slow`(200ms). Easing `ease`/`ease-in-out`.

---

## 3. Iconografía

- **Material Symbols Rounded** (Google Fonts, variable). Siempre **Rounded** (no Outlined/Sharp).
- Cargar el `<link>` de Google Fonts y usar `<span class="material-symbols-rounded">name</span>`.
- Estado activo/relleno → clase `.fill` (`FILL 1, wght 500`).
- En WPF/MAUI: instalar la TTF y referenciar por codepoint.
- **Nunca** emoji. **Nunca** SVG hand-rolled para iconos. Sin icon-font propietario.
- Unicode decorativo permitido: solo `●` (estado) y `›` (breadcrumb).

---

## 4. Reglas visuales NO negociables

- **Fondos sólidos:** página `#F2F3F7`, cards blancas. **Sin gradientes de fondo, sin texturas, sin imágenes de fondo.** Único gradiente permitido: logo (Emerald→Indigo) y avatar (Violet→Indigo), siempre en superficies ≤ 64 px.
- **Bordes de tarjeta = sombra Dp1**, nunca borde de color. Excepción: strip footer de mini-KPI.
- **Máximo 5 colores** por vista.
- **No mezclar verdes semánticos** entre módulos (Emerald éxito ≠ verde Material de abono/CFDI).
- **Importes:** siempre `font-variant-numeric: tabular-nums` (clase `t-amount`).
- **Animación ≤ 200 ms**, easing `ease`/`ease-in-out`. Sin bounce, elastic, overshoot ni scale en hover/press.
- **Hover sutil:** cambio de fondo/sombra, no escala. Cards/KPI no tienen hover.
- **Focus inputs:** `border-color: var(--primary)`, sin glow. **Sin glassmorphism / sin `backdrop-filter: blur()`.**
- Considerar siempre los **estados**: loading, vacío, error, éxito, disabled, selected, active.

### Layout de apps de escritorio/web densas

- Shell fijo: **titlebar 48 px** (sticky top) + **sidebar 220 px** (fijo) + **statusbar 28 px** (sticky bottom). El contenido scrollea en el centro; el shell no.
- Sidebar item activo: bg `--in-bg`, texto/ícono `--in`, peso 600, radio `--r-md`, sombra índigo suave. Hover: bg `#F0F4FF`.
- Grid de KPI: 4 columnas iguales (5 para Reproceso).

---

## 5. Contenido y copy

- **Español neutro de México (es-MX)** por defecto. Tono **enterprise-soft**: funcional, denso, sin voz de marketing, sin exclamaciones, sin emoji.
- **Casing:**
  - Títulos de módulo: `UPPERCASE` con letter-spacing (`REPROCESO`, `RESUMEN DEL DÍA`); nombres largos en Title Case.
  - Labels/KPI/meta: `UPPERCASE` 9–11 px, letter-spacing 0.06–0.12em.
  - Botones: Sentence case (`Buscar`, `Actualizar`); excepción acción destacada/destructiva en `UPPERCASE`.
  - Tabla y body: Sentence case.
- Términos fiscales se mantienen (CFDI, SAT, ticket, abono, cargo).
- Fechas: `dddd, d 'de' MMMM 'de' yyyy` con CultureInfo `es-MX`.

---

## 6. Anti-patterns (❌ nunca)

- Gradientes en fondo de página o cards (solo logo y avatar).
- `drop-shadow`/`text-shadow` en texto.
- Más de 5 colores por vista, o font-size < 9 px.
- Animaciones > 300 ms en interacciones de lista.
- Bordes de tarjeta con color (salvo mini-KPI footer).
- Íconos sin label en sidebar expandido.
- Tablas sin `sticky thead` cuando hay scroll.
- Botones sin estado disabled durante una acción async.
- Mezclar colores semánticos entre módulos.
- `Coco Gothic` en cualquier cosa que no sea un wordmark de marca.
- Emoji o íconos custom en lugar de Material Symbols Rounded.

---

## 7. Checklist al implementar una vista

1. ¿Leíste `README.md` y `colors_and_type.css` de `C:\Users\kevin\.MeridianUI`?
2. ¿Importaste/mapeaste los tokens antes de escribir estilos? (sin hex inventados)
3. ¿Iconografía = Material Symbols Rounded?
4. ¿Copy en es-MX, casing correcto, sin emoji?
5. ¿Estados cubiertos (loading/vacío/error/éxito/disabled)?
6. ¿Cero gradientes de fondo, bordes de card = sombra, animaciones ≤ 200 ms?
7. ¿Importes con tabular-nums?
8. Si es plataforma nueva (Tailwind/React/etc.): ¿documentaste el mapeo de tokens?
