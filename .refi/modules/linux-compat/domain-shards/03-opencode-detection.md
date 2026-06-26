# Domain Shard 03 · OpenCode Binary Detection en Linux

## Objetivo

Agregar detección de binario OpenCode para Linux en `opencode.js` y actualizar `detect.js` con rutas de instalación Linux para todos los agentes donde haga falta.

## Contexto — El Problema

### `opencode.js` (líneas 89–96)

El adapter de OpenCode intenta encontrar el binario de `opencode` verificando rutas específicas. Actualmente solo cubre paths de Windows:

```javascript
const appData = process.env.APPDATA || path.join(getHomeDir(), 'AppData', 'Roaming');
const winPaths = [
  path.join(appData, 'npm', 'opencode.exe'),
  path.join(appData, 'npm', 'node_modules', 'opencode-ai', 'bin', 'opencode.exe'),
  path.join(getHomeDir(), 'AppData', 'Roaming', 'npm', 'opencode.exe'),
  // ...
];
```

En Linux, `APPDATA` nunca existe, y los paths `AppData/Roaming/npm/` tampoco. El código cae al `safeExecVersion('opencode --version')` pero si `opencode` no está en el PATH default (frecuente con NVM o npm global sin configurar), la detección falla.

## Linux npm Global — Dónde Instala OpenCode

```text
Método de instalación npm       Binario                              Módulos
────────────────────────────────────────────────────────────────────────────
npm install -g (sistema/root)   /usr/local/bin/opencode              /usr/local/lib/node_modules/opencode-ai/
npm install -g (usuario, xdg)   ~/.local/bin/opencode                ~/.local/lib/node_modules/
npm install -g (prefix ~/.npm-global) ~/.npm-global/bin/opencode    ~/.npm-global/lib/node_modules/
NVM (Node Version Manager)      ~/.nvm/versions/node/<ver>/bin/opencode
Volta                           ~/.volta/bin/opencode
pnpm global                     ~/.local/share/pnpm/opencode
Homebrew (macOS, no aplica)     /usr/local/bin/opencode (macOS)
Fedora dnf (si existiera pkg)   /usr/bin/opencode
```

## Estrategia de Detección en Linux

Usar una cadena de 4 niveles, en orden de confiabilidad:

### Nivel 1 — PATH (más confiable)
```javascript
safeExecVersion('opencode --version')
// Si opencode está en PATH, esto funciona independientemente del método de instalación.
```

### Nivel 2 — npm root -g (resolve prefix real)
```javascript
const npmGlobalRoot = safeExec('npm root -g');
// npm root -g devuelve el path al node_modules global del npm actual.
// p.ej. "/usr/local/lib/node_modules" o "/home/user/.npm-global/lib/node_modules"
// El binario está en: path.join(path.dirname(npmGlobalRoot), '..', 'bin', 'opencode')
// o más simple: path.join(npmGlobalRoot, '..', '..', 'bin', 'opencode')
```

### Nivel 3 — Rutas conocidas por filesystem
```javascript
const linuxPaths = [
  '/usr/local/bin/opencode',
  '/usr/bin/opencode',
  path.join(home, '.local', 'bin', 'opencode'),
  path.join(home, '.npm-global', 'bin', 'opencode'),
  path.join(home, '.volta', 'bin', 'opencode'),
  path.join(home, '.local', 'share', 'pnpm', 'opencode'),
].filter(p => fs.existsSync(p));
```

### Nivel 4 — NVM paths (si .nvm existe)
```javascript
const nvmDir = process.env.NVM_DIR || path.join(home, '.nvm');
if (fs.existsSync(nvmDir)) {
  // Buscar en ~/.nvm/versions/node/*/bin/opencode
  // Usar la versión más reciente que tenga el binario
}
```

## Cambios Requeridos en `opencode.js`

### Regla de Oro para este Shard

> **El bloque `winPaths[]` existente NO se toca.** Se agrega un bloque `linuxPaths[]` en el `else`. El reviewer debe poder ver que el código Windows es byte-for-byte idéntico al original.

### Refactor de la sección de detección de binario (líneas 89–96)

```javascript
// ANTES (solo Windows):
const appData = process.env.APPDATA || path.join(getHomeDir(), 'AppData', 'Roaming');
const winPaths = [ /* solo .exe en AppData\npm */ ];

// DESPUÉS (cross-platform):
let detectedPaths = [];
if (process.platform === 'win32') {
  const appData = process.env.APPDATA || path.join(getHomeDir(), 'AppData', 'Roaming');
  detectedPaths = [
    path.join(appData, 'npm', 'opencode.exe'),
    path.join(appData, 'npm', 'node_modules', 'opencode-ai', 'bin', 'opencode.exe'),
    path.join(getHomeDir(), 'AppData', 'Roaming', 'npm', 'opencode.exe'),
  ].filter(p => fs.existsSync(p));
} else {
  // Linux / macOS
  const npmGlobalRoot = safeExec('npm root -g');
  const npmBinDir = npmGlobalRoot
    ? path.resolve(npmGlobalRoot, '..', '..', 'bin')
    : null;

  detectedPaths = [
    '/usr/local/bin/opencode',
    '/usr/bin/opencode',
    path.join(getHomeDir(), '.local', 'bin', 'opencode'),
    path.join(getHomeDir(), '.npm-global', 'bin', 'opencode'),
    path.join(getHomeDir(), '.volta', 'bin', 'opencode'),
    npmBinDir ? path.join(npmBinDir, 'opencode') : null,
  ].filter(Boolean).filter(p => fs.existsSync(p));

  // NVM fallback
  const nvmDir = process.env.NVM_DIR || path.join(getHomeDir(), '.nvm');
  if (fs.existsSync(nvmDir)) {
    // Agregar la búsqueda en versiones NVM activas
    // (implementación en el shard; puede usar fs.readdirSync o glob básico)
  }
}
```

**Nota:** La función `safeExec` ya existe en el codebase (ver `safety.js` o `detect.js`). Si no existe, es una simple wrapper de `execSync` con try/catch.

## Cambios Requeridos en `detect.js`

### Auditar detección de OpenCode

La función detect de OpenCode en `detect.js` debe cubrir:
- `opencode --version` en PATH
- `npx opencode-ai --version` como fallback
- Rutas filesystem Linux: `/usr/local/bin/opencode`, `~/.local/bin/opencode`

Verificar las líneas 71–86 para confirmar qué está cubierto y qué falta.

### Rutas Linux para otros agentes en `detect.js`

Verificar que cada agente tenga rutas Linux apropiadas:

| Agente | Rutas Linux que debe verificar |
|--------|-------------------------------|
| Claude Code | `/usr/local/bin/claude`, `/usr/bin/claude`, `~/.local/bin/claude` ← ya existen |
| Gemini CLI | `/usr/local/bin/gemini`, `~/.local/bin/gemini`, `~/.google/gemini` |
| Codex | `/usr/local/bin/codex`, `~/.local/bin/codex` |
| Antigravity | `/usr/local/bin/antigravity`, `~/.local/bin/antigravity` |

Para cada uno que falte, agregar al array `detectPaths` del agente correspondiente.

## Helper `safeExec` (si no existe)

Si el codebase no tiene una función `safeExec` que retorne la salida o `null`:

```javascript
function safeExec(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: 'pipe', timeout: 5000 }).trim();
  } catch {
    return null;
  }
}
```

Esta ya puede existir como `safeExecVersion` u otro nombre — auditar en Shard 01.

## Deliverables de este Shard

1. `opencode.js` con bloque de detección refactorizado para Linux (additive, sin romper Windows).
2. `detect.js` con rutas Linux verificadas/completadas para todos los agentes.
3. Commit atómico: `feat: add Linux binary detection paths for OpenCode and all agent adapters`.

## Verification Gate

- `reasp detect` en Linux muestra OpenCode como detected cuando está instalado vía npm global.
- `reasp detect` en Linux muestra OpenCode como detected cuando está instalado vía NVM.
- `reasp detect` retorna false/not-detected para agentes no instalados, sin errores ni excepciones.
- En Windows, `reasp detect` se comporta idéntico al estado pre-cambio.
