# Master Blueprint · REASP Linux Compatibility & MeridianUI Global Install

## 1. Problem Statement

REASP fue construido con Windows como plataforma primaria. Aunque el código usa `path.join()` y tiene algunos guards `process.platform === 'win32'`, existen asunciones implícitas de Windows y una funcionalidad ausente que requieren atención:

**A — Bugs de compatibilidad Linux:**
1. **Bug `file:///` URL**: `opencode.js` construye URLs de plugin con `file:///` + ruta absoluta Linux → `file:////home/...` (4 barras, inválida).
2. **Detección de binario OpenCode incompleta**: Solo busca ejecutables en `%APPDATA%\npm\`. En Linux no existe `APPDATA`.
3. **Detección general de agentes**: Algunas rutas Linux pueden estar incompletas en `detect.js`.
4. **Permisos de ejecución**: Bit `+x` de `scripts/reasp` puede perderse en git clone.

**B — Funcionalidad ausente en ambas plataformas:**
5. **MeridianUI no se instala globalmente**: El installer referencia `~/.MeridianUI` en instrucciones y globs, pero nunca copia la carpeta. El usuario debe tenerla instalada manualmente. Ahora se debe instalar desde `.MeridianUI/` del repo a `~/.MeridianUI/` en el sistema.

## 2. Goal

**Objetivo A**: Adaptar REASP para que se instale y opere correctamente en Linux sin romper ni alterar el comportamiento Windows existente.

**Objetivo B**: Instalar MeridianUI globalmente desde el repo en ambas plataformas (Windows y Linux) como parte del proceso estándar de instalación.

## 3. Core Design Principles

> **Additive, never replacement.** Todo el código Windows (`winPaths[]`, `APPDATA`, `.exe` suffixes, `pwsh` shell) permanece intacto. La compatibilidad Linux se agrega en paralelo con bloques `else` o arrays adicionales. El resultado es un installer truly cross-platform que funciona en ambos OS.

> **One source of truth for MeridianUI.** La carpeta `.MeridianUI/` en la raíz del repo REASP es la fuente canónica. El installer la copia a `~/.MeridianUI/` en el home del usuario, independientemente del OS. Los adapters de agentes referencian siempre `~/.MeridianUI/`.

## 4. Gap Matrix — Diagnóstico Completo

| # | Archivo | Líneas | Problema | Severidad | Fix |
|---|---------|--------|----------|-----------|-----|
| G0 | `installer/` (general) | — | MeridianUI no se copia a `~/.MeridianUI/` en ningún OS | **NUEVO/ALTO** | Nuevo step `installMeridianUI()` |
| G1 | `opencode.js` | 529–530 | `file:///` + `/home/...` → 4 barras | **CRÍTICO** (Linux) | `url.pathToFileURL()` |
| G2 | `opencode.js` | 89–96 | `winPaths[]` sin equivalente Linux (ADDITIVE fix) | **ALTO** (Linux) | Agregar `linuxPaths[]` |
| G3 | `detect.js` | 71–86 | Detección OpenCode Linux incompleta | **ALTO** (Linux) | Completar rutas Linux |
| G4 | `scripts/reasp` | — | Bit `+x` puede perderse en git | **ALTO** (Linux) | `git update-index --chmod=+x` + `prepare` |
| G5 | `opencode.js` | 54 | MeridianUI glob path backslash replace | **MEDIO** | Verificar en Linux |
| G6 | `_instructions.js` | 159 | MeridianUI path backslash replace | **BAJO** | Verificar |
| G7 | `README.md` | ~198 | Instrucciones instalación solo Windows | **ALTO** | Agregar sección Linux |
| G8 | `README.md` | — | MeridianUI no documentado en proceso install | **MEDIO** | Documentar |

**Lo que NO cambia (ya funciona cross-platform):**
- `path.join()` en todo el codebase ✅
- `tasklist` vs `ps -eo comm=` (safety.js) ✅
- `pwsh` vs `bash` shell default ✅
- `USERPROFILE || HOME || os.homedir()` fallback ✅
- `~/.config/opencode`, `~/.claude`, `~/.codex`, etc. ✅

## 5. MeridianUI Installation Architecture

### Source

```text
REASP/
└── .MeridianUI/          ← fuente canónica en el repo
    ├── [contenido UI]
    └── ...
```

### Destination (ambas plataformas)

```text
Windows: %USERPROFILE%\.MeridianUI\
Linux:   ~/.MeridianUI\
```

Ambas resultan en `path.join(os.homedir(), '.MeridianUI')` — Node.js resuelve correctamente en cada OS.

### Nuevo step en el installer: `installMeridianUI(ctx)`

```javascript
// installer/lib/meridianui.js  (nuevo archivo)
export async function installMeridianUI(ctx) {
  const sourceDir = path.join(ctx.repoRoot, '.MeridianUI');
  const destDir   = path.join(ctx.homeDir, '.MeridianUI');

  // Si la fuente no existe o está vacía: advertir, no fallar
  if (!fs.existsSync(sourceDir) || fs.readdirSync(sourceDir).length === 0) {
    ctx.log.warn('⚠️  .MeridianUI/ not found or empty in repo — skipping MeridianUI install');
    return { installed: false };
  }

  // Copiar recursivamente (preservar estructura)
  await fs.cp(sourceDir, destDir, { recursive: true });
  ctx.log.success(`✓ MeridianUI installed → ${destDir}`);
  return { installed: true, destDir };
}
```

**Cuándo se ejecuta:**
- Como paso compartido `pre-install`, antes de los adapters individuales.
- Se ejecuta una sola vez, independientemente de cuántos agentes se seleccionen.
- Si el usuario corre `reasp install --agents opencode,claude-code`, MeridianUI se instala una vez.

### Fuente Placeholder

Dado que el contenido de `.MeridianUI/` aún no está disponible, crear en el repo:

```text
REASP/
└── .MeridianUI/
    └── .gitkeep          ← placeholder hasta que el contenido sea añadido
```

El installer detecta que `.gitkeep` es el único archivo y trata el directorio como "vacío".

## 6. Fix Aditivo: Windows + Linux en Parallel (Design)

### Antes (solo Windows):
```javascript
const appData = process.env.APPDATA || path.join(getHomeDir(), 'AppData', 'Roaming');
const winPaths = [
  path.join(appData, 'npm', 'opencode.exe'),
  // ...
];
const found = winPaths.find(p => fs.existsSync(p));
```

### Después (Windows + Linux, aditivo):
```javascript
let platformPaths = [];

if (process.platform === 'win32') {
  // ── BLOQUE WINDOWS — SIN CAMBIOS ──────────────────────────────
  const appData = process.env.APPDATA || path.join(getHomeDir(), 'AppData', 'Roaming');
  platformPaths = [
    path.join(appData, 'npm', 'opencode.exe'),
    path.join(appData, 'npm', 'node_modules', 'opencode-ai', 'bin', 'opencode.exe'),
    path.join(getHomeDir(), 'AppData', 'Roaming', 'npm', 'opencode.exe'),
  ];
} else {
  // ── BLOQUE LINUX/macOS — NUEVO, ADITIVO ───────────────────────
  const npmGlobalRoot = safeExec('npm root -g');
  const npmBinDir = npmGlobalRoot
    ? path.resolve(npmGlobalRoot, '..', '..', 'bin')
    : null;
  platformPaths = [
    '/usr/local/bin/opencode',
    '/usr/bin/opencode',
    path.join(getHomeDir(), '.local', 'bin', 'opencode'),
    path.join(getHomeDir(), '.npm-global', 'bin', 'opencode'),
    path.join(getHomeDir(), '.volta', 'bin', 'opencode'),
    npmBinDir ? path.join(npmBinDir, 'opencode') : null,
  ].filter(Boolean);
}

const found = platformPaths.find(p => fs.existsSync(p));
```

**La lógica Windows es idéntica al estado original.** El bloque `else` es código completamente nuevo.

## 7. Fix `pathToFileURL` — Corrección Correcta en Ambas Plataformas

```javascript
import { pathToFileURL } from 'node:url';

// ANTES (template literal):
const pluginUrl = `file:///${globalDir.replace(/\\/g, '/')}/plugin.js`;
// Windows: ✓ file:///C:/Users/...  Linux: ✗ file:////home/...

// DESPUÉS (API nativa Node.js):
const pluginUrl = pathToFileURL(path.join(globalDir, 'plugin.js')).href;
// Windows: ✓ file:///C:/Users/...  Linux: ✓ file:///home/...
```

Este cambio mejora Windows (más correcto) y corrige Linux.

## 8. Archivo Layout Post-Cambio

```text
REASP/
├── .MeridianUI/                         ← NUEVO DIRECTORIO en repo (placeholder)
│   └── .gitkeep
├── .gitattributes                       ← NUEVO
├── package.json                         ← MODIFICADO: scripts.prepare
├── scripts/
│   ├── reasp                            ← SIN CAMBIO; +x en git
│   └── reasp.cmd                        ← SIN CAMBIO
├── installer/
│   └── lib/
│       ├── meridianui.js                ← NUEVO: installMeridianUI()
│       ├── detect.js                    ← MODIFICADO: rutas Linux
│       └── targets/
│           ├── opencode.js              ← MODIFICADO: linuxPaths[], pathToFileURL
│           ├── claude-code.js           ← VERIFICAR
│           ├── gemini.js                ← VERIFICAR
│           ├── codex.js                 ← VERIFICAR
│           └── antigravity.js           ← VERIFICAR
├── README.md                            ← MODIFICADO: Linux + MeridianUI docs
└── installer/AGENTS.md                  ← MODIFICADO: paths Linux verificados
```

## 9. Risks & Mitigations

| Riesgo | Mitigación |
|--------|------------|
| `npm root -g` falla si npm no está en PATH | try/catch en `safeExec`; continúa sin ese path |
| `.MeridianUI/` solo tiene `.gitkeep` | Check `readdirSync().filter(f => f !== '.gitkeep').length === 0` → warn, skip |
| `fs.cp()` no existe en Node < 16 | El proyecto requiere Node ≥ 18; `fs.cp` existe desde Node 16.7 |
| Windows regresión por el refactor del bloque `winPaths` | El bloque Windows es copia exacta del original dentro de `if (win32)` |
| `pathToFileURL` produce URL diferente en Windows que el template literal | Verificado: ambos producen `file:///C:/...` — `pathToFileURL` es más correcto |
| MeridianUI ya existe en `~/.MeridianUI/` del usuario | Usar `{ recursive: true }` en `fs.cp` — sobreescribe (merge implícito); añadir flag `--no-overwrite` opcional |

## 10. Open Questions

- ¿El contenido de `.MeridianUI/` tiene subdirectorios o es flat? (Afecta el glob pattern en `opencode.js:54`)
- ¿Debe MeridianUI instalarse también cuando se instala solo un adapter menor (claude-code solo, sin opencode)?  → Sí, es compartido.
- ¿Debe `reasp uninstall` remover `~/.MeridianUI/`? → Probablemente no, ya que es compartida entre todos los agentes.
