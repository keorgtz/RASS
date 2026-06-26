# Domain Shard 09 · MeridianUI Global Installer

## Objetivo

Implementar la instalación global de MeridianUI como parte del proceso de `reasp install`. El contenido de `.MeridianUI/` en la raíz del repo se copia a `~/.MeridianUI/` en el sistema del usuario, en ambas plataformas (Windows y Linux).

## Contexto

### Estado actual

MeridianUI ya es referenciada en REASP:
- `opencode.js:54` — construye un glob `~/.MeridianUI/**` para las instrucciones de OpenCode.
- `_instructions.js:159` — construye el path `~/.MeridianUI` para incluirlo en archivos markdown de otros agentes.

Pero el installer **nunca copia** el directorio. Asume que el usuario ya tiene `~/.MeridianUI` instalado manualmente. Esto es un gap: si un usuario instala REASP por primera vez, el glob de instrucciones apuntará a un directorio vacío o inexistente.

### Nueva responsabilidad

El installer se encarga de copiar `.MeridianUI/` del repo al home del usuario como parte del setup. Esto:
1. Garantiza que `~/.MeridianUI` existe después de `reasp install`.
2. Permite actualizar MeridianUI re-ejecutando `reasp install`.
3. Funciona en Windows y Linux con el mismo código.

## Nuevo Archivo: `installer/lib/meridianui.js`

```javascript
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

// Retorna el path destino de MeridianUI según el OS.
// En ambas plataformas es path.join(home, '.MeridianUI').
export function getMeridianUIDestDir(homeDir) {
  return path.join(homeDir || os.homedir(), '.MeridianUI');
}

// Retorna el path fuente de MeridianUI (desde el repo).
// repoRoot es el directorio raíz del repo REASP.
export function getMeridianUISourceDir(repoRoot) {
  return path.join(repoRoot, '.MeridianUI');
}

// Verifica si el source dir tiene contenido real (no solo .gitkeep).
function hasRealContent(sourceDir) {
  if (!fs.existsSync(sourceDir)) return false;
  const entries = fs.readdirSync(sourceDir).filter(f => f !== '.gitkeep');
  return entries.length > 0;
}

// Instala MeridianUI del repo al home dir del usuario.
// ctx.repoRoot  — raíz del repo REASP
// ctx.homeDir   — home del usuario
// ctx.log       — logger (con .info(), .warn(), .success(), .error())
// ctx.dryRun    — si true, solo loguea sin escribir
export async function installMeridianUI(ctx) {
  const sourceDir = getMeridianUISourceDir(ctx.repoRoot);
  const destDir   = getMeridianUIDestDir(ctx.homeDir);

  // Caso: fuente no existe o está vacía (.gitkeep solamente)
  if (!hasRealContent(sourceDir)) {
    ctx.log.warn(
      '⚠️  .MeridianUI/ not found or empty in repo — skipping MeridianUI installation.\n' +
      '   Add content to .MeridianUI/ and re-run `reasp install` to install it.'
    );
    return { installed: false, reason: 'empty-source' };
  }

  if (ctx.dryRun) {
    ctx.log.info(`[dry-run] Would copy .MeridianUI/ → ${destDir}`);
    return { installed: false, reason: 'dry-run' };
  }

  try {
    // fs.cp es cross-platform y existe en Node ≥ 16.7 (requerimos ≥ 18)
    await fs.promises.cp(sourceDir, destDir, { recursive: true });
    ctx.log.success(`✓ MeridianUI installed → ${destDir}`);
    return { installed: true, destDir };
  } catch (err) {
    ctx.log.error(`✗ MeridianUI install failed: ${err.message}`);
    return { installed: false, reason: 'copy-error', error: err };
  }
}
```

**Notas de implementación:**
- `fs.promises.cp()` funciona en Windows y Linux sin distinción.
- El destino `path.join(homeDir, '.MeridianUI')` resuelve correctamente en ambas plataformas:
  - Windows: `C:\Users\ryou\.MeridianUI`
  - Linux: `/home/ryou/.MeridianUI`
- Si `~/.MeridianUI` ya existe, `fs.cp` con `recursive: true` lo actualiza/sobreescribe (merge).
- El `.gitkeep` se copia pero no tiene efecto funcional.

## Integración en `installer/index.js`

Agregar la llamada a `installMeridianUI` como paso **pre-install**, antes del loop de adapters:

```javascript
// En la función principal de install, ANTES del forEach de targets:

import { installMeridianUI } from './lib/meridianui.js';

// ... (detección de agentes, selección, etc.)

// ── Pre-install: MeridianUI ────────────────────────────────────
const ctx = {
  repoRoot: getRepoRoot(),       // directorio del repo REASP
  homeDir:  getHomeDir(),         // home del usuario
  dryRun:   options.dryRun || false,
  log:      logger,
};
await installMeridianUI(ctx);

// ── Per-agent install ──────────────────────────────────────────
for (const target of selectedTargets) {
  await TARGETS[target].install(ctx, bundle);
}
```

**`getRepoRoot()`** — función que retorna el directorio raíz del repo. Se puede determinar como:
```javascript
// installer/lib/constants.js
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, '..', '..');
// __dirname = installer/lib → ../../ = REASP/
```

## Placeholder en el Repo

Crear en la raíz del repo:

```text
REASP/
└── .MeridianUI/
    └── .gitkeep
```

El `.gitkeep` permite que git trackee el directorio vacío. El installer detecta que solo hay un `.gitkeep` y muestra el warning, sin fallar.

## Uninstall — Decisión de Diseño

**MeridianUI NO se elimina en `reasp uninstall`.**

Razones:
1. Es compartida entre todos los agentes (OpenCode, Claude Code, etc.) — eliminarla rompería todos.
2. El usuario puede haberla personalizado manualmente.
3. Es una UI global del sistema, no un artefacto por-agente.

Si el usuario quiere eliminarla: `rm -rf ~/.MeridianUI` manual. Documentar en TROUBLESHOOTING.

## Referencias en Adapters Existentes

### `opencode.js` — Línea 54 (G5)

```javascript
// ACTUAL:
const meridianDir  = path.join(getHomeDir(), '.MeridianUI');
const meridianGlob = meridianDir.replace(/\\/g, '/');
```

Después de la instalación (Shard 09), `~/.MeridianUI` siempre existe. El glob apunta correctamente.
- **Windows**: `C:\Users\ryou\.MeridianUI` → replace → `C:/Users/ryou/.MeridianUI` ✓
- **Linux**: `/home/ryou/.MeridianUI` → replace (sin efecto) → `/home/ryou/.MeridianUI` ✓

**Acción:** Verificar que el glob pattern funcione en Linux. Si el glob incluye `**`, confirmar que la librería de globbing de OpenCode soporte paths POSIX.

### `_instructions.js` — Línea 159 (G6)

```javascript
const meridianPath = path.join(homeDir || '', '.MeridianUI').replace(/\\/g, '/');
```

- **Windows**: `C:\Users\ryou\.MeridianUI` → `C:/Users/ryou/.MeridianUI` ✓
- **Linux**: `/home/ryou/.MeridianUI` → sin cambio ✓

**Acción:** No cambiar. Confirmar como correcto en Shard 01.

## .gitignore — Asegurar que `.MeridianUI/` no sea ignorado

Verificar que `.gitignore` (si existe) no excluya el directorio `.MeridianUI/`. Si hay una regla `.*` o `.MeridianUI`, removerla.

```gitignore
# Verificar que esto NO esté en .gitignore:
# .MeridianUI/
# .*          ← excluiría .MeridianUI junto con .git, .opencode, etc.
```

## Deliverables de este Shard

1. `installer/lib/meridianui.js` creado con `installMeridianUI()`, `getMeridianUIDestDir()`, `getMeridianUISourceDir()`.
2. `installer/index.js` actualizado para llamar `installMeridianUI(ctx)` pre-install.
3. `installer/lib/constants.js` actualizado con `REPO_ROOT` export.
4. `.MeridianUI/.gitkeep` creado en repo root.
5. `.gitignore` verificado (no excluye `.MeridianUI/`).
6. Commits:
   - `feat: add MeridianUI global installer (Windows + Linux)`
   - `chore: add .MeridianUI/ placeholder directory`

## Verification Gate

- `reasp install` en Linux copia `.MeridianUI/` (con contenido real) a `~/.MeridianUI/`.
- `reasp install` en Windows copia `.MeridianUI/` a `%USERPROFILE%\.MeridianUI\`.
- Si `.MeridianUI/` solo tiene `.gitkeep`, el installer muestra warning y continúa sin error.
- `reasp uninstall` NO elimina `~/.MeridianUI/`.
- OpenCode en Linux carga las instrucciones de MeridianUI desde `~/.MeridianUI/` correctamente.
