# Domain Shard 02 · Path Resolution Layer

## Objetivo

Corregir el bug crítico de generación de URLs `file:///` (G1) y auditar/corregir el manejo de paths de MeridianUI (G5, G6). Este shard produce los cambios de menor superficie pero mayor impacto.

## Contexto

### Bug G1 — `file:///` en `opencode.js:529-530`

```javascript
// CÓDIGO ACTUAL (buggy en Linux):
const pluginUrl = `file:///${globalDir.replace(/\\/g, '/')}/plugin.js`;
const tuiUrl    = `file:///${globalDir.replace(/\\/g, '/')}/tui.js`;

// En Linux con globalDir = "/home/ryou/.config/opencode":
// → "file:////home/ryou/.config/opencode/plugin.js"  ← 4 barras, URL INVÁLIDA

// En Windows con globalDir = "C:\\Users\\ryou\\.config\\opencode":
// → "file:///C:/Users/ryou/.config/opencode/plugin.js"  ← correcto
```

### Root Cause

`file:///` + ruta absoluta Windows (`C:/...`) = correcto (el slash inicial del protocolo es parte de los 3 del scheme `file://` + 1 del path relativo a la raíz del drive).

`file:///` + ruta absoluta Linux (`/home/...`) = incorrecto (la ruta ya tiene su propio `/` inicial, resultando en `file:////`).

### Fix Canónico

Node.js provee `url.pathToFileURL(absPath)` exactamente para este propósito:

```javascript
import { pathToFileURL } from 'node:url';

// Linux:  pathToFileURL('/home/ryou/.config/opencode/plugin.js').href
//       → 'file:///home/ryou/.config/opencode/plugin.js'  ✓
// Windows: pathToFileURL('C:\\Users\\ryou\\.config\\opencode\\plugin.js').href
//       → 'file:///C:/Users/ryou/.config/opencode/plugin.js'  ✓
```

## Cambios Requeridos en Shard 02

### Cambio 1: `installer/lib/targets/opencode.js`

**Agregar import en la sección de imports:**
```javascript
import { pathToFileURL } from 'node:url';
```

**Reemplazar líneas 529–530:**
```javascript
// ANTES:
const pluginUrl = `file:///${globalDir.replace(/\\/g, '/')}/plugin.js`;
const tuiUrl    = `file:///${globalDir.replace(/\\/g, '/')}/tui.js`;

// DESPUÉS:
const pluginUrl = pathToFileURL(path.join(globalDir, 'plugin.js')).href;
const tuiUrl    = pathToFileURL(path.join(globalDir, 'tui.js')).href;
```

**Nota:** `path.join()` ya produce el separador correcto por plataforma; `pathToFileURL` lo convierte correctamente a `file://` URL en cualquier OS.

### Cambio 2: MeridianUI Glob (G5) — `opencode.js:54`

Auditar esta línea:
```javascript
const meridianGlob = meridianDir.replace(/\\/g, '/');
```

En Linux, `meridianDir` (resultado de `path.join(homeDir, '.MeridianUI')`) ya usa `/`, por lo que el `.replace` no hace nada dañino. Sin embargo:
- Verificar que el glob resultante sea compatible con la librería de globbing usada por OpenCode.
- Si OpenCode espera un path POSIX, el resultado en Linux es correcto.
- Si el path contiene espacios en el home dir, verificar que el glob esté correctamente escapado.

**Acción:** Verificar funcionamiento en Linux; si el glob no causa error, no cambiar. Si falla con espacios, usar comillas o escape correcto en el glob pattern.

### Cambio 3: MeridianUI path en `_instructions.js:159` (G6)

Auditar:
```javascript
const meridianPath = path.join(homeDir || '', '.MeridianUI').replace(/\\/g, '/');
```

En Linux: `path.join('/home/ryou', '.MeridianUI')` → `'/home/ryou/.MeridianUI'` → `.replace` sin efecto → resultado correcto.

**Acción:** No cambiar; confirmar que es correcto en Linux y documentarlo como OK.

## Deliverables de este Shard

1. `opencode.js` con `pathToFileURL` en lugar del template literal para plugin/tui URLs.
2. Import `pathToFileURL` agregado al archivo.
3. Confirmación escrita (en este shard o en progress.md) de que G5 y G6 son correctos en Linux sin cambios.
4. Commit atómico con message descriptivo: `fix: use pathToFileURL for plugin registration URLs (Linux compat)`.

## Verification Gate

- Las URLs en `opencode.json` post-install en Linux tienen exactamente 3 barras: `file:///home/...`.
- Las URLs en `opencode.json` post-install en Windows siguen siendo `file:///C:/...`.
- No hay errores de URL en la consola de OpenCode al cargar el plugin.
- `npm test` / linting pasa sin errores nuevos.
