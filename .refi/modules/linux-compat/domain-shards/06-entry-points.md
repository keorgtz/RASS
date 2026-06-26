# Domain Shard 06 · Entry Points & npm Global Install en Linux

## Objetivo

Garantizar que el CLI `reasp` funcione correctamente al instalarse globalmente vía npm en Linux:
permisos de ejecución del script bash, preservación del bit `+x` en git, y flujo de `npm install -g .` en Linux.

## Contexto

### Cómo funciona el CLI en Linux

```text
npm install -g .     ← instala el paquete globalmente
  ↓
npm lee package.json → "bin": { "reasp": "./installer/index.js" }
  ↓
npm crea symlink: <prefix>/bin/reasp → <prefix>/lib/node_modules/reasp-cli/installer/index.js
  ↓
El usuario ejecuta: reasp [comando]
  ↓
Node.js ejecuta installer/index.js con shebang #!/usr/bin/env node
```

**Alternativa — via `scripts/reasp` wrapper:**
```text
package.json → "bin": { "reasp": "./scripts/reasp" }
  ↓
npm crea symlink al script bash
  ↓
bash ejecuta: node "$(dirname "$0")/../installer/index.js" "$@"
```

**¿Cuál usa el repo actualmente?**
Según `package.json`: `"bin": { "reasp": "./installer/index.js" }` — apunta directamente al JS.
El archivo `scripts/reasp` es un shim alternativo, pero el bin del package.json apunta al JS directamente.

Esto es positivo: Node.js es cross-platform y el shebang `#!/usr/bin/env node` funciona en Linux.

## Gap G4 — Bit `+x` en `scripts/reasp`

Aunque `package.json` apunta a `installer/index.js` (que no necesita ser ejecutable per se, ya que npm lo llama vía Node), el archivo `scripts/reasp` puede ser invocado directamente por usuarios Linux:

```bash
./scripts/reasp install     # invocación directa
```

Si el bit `+x` no está en git, este uso directo falla con `Permission denied`.

### Verificar el bit actual en git

```bash
git ls-files -s scripts/reasp
# Si el modo es 100644 → sin bit +x → problema
# Si el modo es 100755 → con bit +x → correcto
```

### Fix: Preservar bit `+x` en git

**Opción A — Corregir en git directamente:**
```bash
git update-index --chmod=+x scripts/reasp
git commit -m "chore: preserve execute bit on scripts/reasp for Linux"
```

**Opción B — `.gitattributes` (solo afecta line endings, no permisos):**
`.gitattributes` controla CRLF/LF pero **no** permisos Unix. No sirve para este propósito específico.

**Opción C — `package.json` scripts.prepare:**
```json
{
  "scripts": {
    "prepare": "node -e \"require('fs').chmodSync('./scripts/reasp', 0o755)\""
  }
}
```
Esto ejecuta `chmod` en JavaScript (cross-platform) cada vez que se instala el paquete.
En Windows, `chmod` no tiene efecto real en archivos batch, por lo que es seguro.

**Recomendación:** Usar la **Opción A** (más limpia, la corrección es permanente en git) + **Opción C** como fallback para clones donde git pierda permisos.

## Verificar `.gitattributes`

Crear (o actualizar) `.gitattributes` con LF para scripts Unix:

```gitattributes
# Forzar LF en scripts Unix para evitar CRLF en Linux
scripts/reasp text eol=lf
*.sh text eol=lf

# Scripts Windows mantienen CRLF
scripts/*.cmd text eol=crlf
```

Esto no arregla permisos pero evita que el script bash tenga `\r\n` al ser clonado en Windows y luego usado en Linux.

## Flujo `npm install -g .` en Linux — Problemas Conocidos

### Problema 1: npm global prefix sin write access

Si npm está configurado para instalar en `/usr/local` (común en sistemas Linux sin configuración de usuario), `npm install -g` requiere `sudo`:

```bash
sudo npm install -g .    # requiere sudo si prefix=/usr/local
# O configurar npm para instalar en home del usuario:
npm config set prefix '~/.npm-global'
export PATH="$HOME/.npm-global/bin:$PATH"
npm install -g .         # sin sudo
```

**Acción en este shard:** Documentar en README y TROUBLESHOOTING (el fix está en Shard 08).

### Problema 2: El shebang `#!/usr/bin/env node`

`installer/index.js` tiene este shebang. Funciona en Linux si `node` está en PATH.
Con NVM, `node` solo está en PATH en sesiones interactivas donde el profile de NVM fue sourcado.
Si el usuario instaló REASP en una sesión NVM pero ejecuta `reasp` en otra sin NVM activo → `node not found`.

**Acción:** Documentar en TROUBLESHOOTING (Shard 08). No hay fix a nivel de código.

### Problema 3: `npm install` dentro del installer (opencode adapter)

El adapter de OpenCode hace `npm install` dentro de `~/.config/opencode/` para instalar dependencias del plugin. En Linux:
- Si `npm` no está en PATH cuando se ejecuta `reasp install` (ej: sesión no interactiva), fallará.
- El `execSync` hereda el PATH del proceso padre.

**Acción:** Verificar en Shard 07 (testing). Documentar en TROUBLESHOOTING si es necesario.

## Cambios Concretos de este Shard

### 1. Corregir bit +x en git
```bash
git update-index --chmod=+x scripts/reasp
```

### 2. Crear/actualizar `.gitattributes`
```gitattributes
scripts/reasp text eol=lf
*.sh text eol=lf
scripts/*.cmd text eol=crlf
```

### 3. Agregar `prepare` script en `package.json`
```json
{
  "scripts": {
    "prepare": "node -e \"try{require('fs').chmodSync('./scripts/reasp',0o755)}catch(e){}\""
  }
}
```

### 4. Verificar shebang de `installer/index.js`
Confirmar que la primera línea es exactamente:
```
#!/usr/bin/env node
```
Sin CRLF, sin espacio extra.

## Deliverables de este Shard

1. `.gitattributes` creado o actualizado.
2. Bit `+x` corregido en git para `scripts/reasp`.
3. `package.json` con `scripts.prepare` agregado.
4. Confirmación de shebang en `installer/index.js`.
5. Commits atómicos para cada cambio (`.gitattributes` + `package.json prepare` pueden ir juntos).

## Verification Gate

- `git ls-files -s scripts/reasp` muestra modo `100755`.
- Tras `git clone` fresh del repo en Linux: `scripts/reasp` es ejecutable sin `chmod` manual.
- `npm install -g .` desde el repo en Linux completa sin errores de permisos (asumiendo prefix correcto).
- `reasp --help` responde correctamente en Linux.
