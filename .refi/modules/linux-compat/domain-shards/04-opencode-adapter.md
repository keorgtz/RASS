# Domain Shard 04 · OpenCode Adapter — Auditoría Completa y Consolidación

## Objetivo

Auditar `installer/lib/targets/opencode.js` en su totalidad línea por línea para identificar cualquier asunción Windows restante no cubierta en los shards 02 y 03. Consolidar todos los fixes de opencode.js en un commit atómico y coherente.

## Por Qué un Shard Dedicado

`opencode.js` es el archivo más grande del proyecto (700+ líneas) y es el adapter con más lógica compleja. Los fixes de los shards 02 y 03 ya cubren los gaps críticos y altos, pero este archivo merece una lectura completa antes de cerrar para asegurar que no queden suposiciones ocultas.

## Estructura del Archivo a Auditar

Basado en la exploración, `opencode.js` contiene las siguientes secciones lógicas. Leer y anotar cada una:

| Sección | Líneas aprox. | Descripción | Riesgo Linux |
|---------|--------------|-------------|--------------|
| Imports y helpers top-level | 1–30 | `import`, `getHomeDir`, `getDefaultShell` | Bajo — ya tiene `win32` guard |
| MeridianUI glob detection | 50–60 | `meridianDir`, `meridianGlob` | Medio — backslash replace, G5 |
| CLI detection helpers | 70–140 | `findOpenCodeCmd`, `winPaths`, `safeExecVersion` | **ALTO** — G2, G3 |
| `install()` main function | 141–600 | Toda la lógica de instalación | Revisar sub-secciones |
| └─ `compileReaspBundle()` call | ~200 | Compilación de assets | Bajo — paths relativos |
| └─ `npm install` en globalDir | ~514 | Instala dependencias del plugin | Bajo — cross-platform |
| └─ Plugin registration | ~529–570 | `opencode plugin ... --global` + URLs | **CRÍTICO** — G1 |
| └─ `opencode.json` generation | ~400–500 | Escribe config JSON | Revisar paths en JSON |
| `uninstall()` function | ~600–700 | Limpieza de archivos | Revisar paths |

## Checklist de Auditoría Detallada

### Imports y helpers (líneas 1–30)
- [ ] ¿`pathToFileURL` ya está importado (desde Shard 02)?  Si no: agregarlo.
- [ ] `getDefaultShell()`: ¿retorna `'bash'` en Linux? → Debe retornar `'bash'` para cualquier `platform !== 'win32'`. ✓

### MeridianUI (líneas 50–60)
- [ ] `meridianDir`: ¿se construye con `path.join`? → Correcto en Linux.
- [ ] `meridianGlob`: `.replace(/\\/g, '/')` → sin efecto en Linux, resultado correcto.
- [ ] ¿El glob pattern es válido para la librería usada por OpenCode en Linux?
- [ ] ¿Hay manejo de espacios en el path si `~` tiene espacios?

### CLI Detection (líneas 70–140)
- [ ] `safeExecVersion('opencode --version')` → Correcto si OpenCode está en PATH.
- [ ] `safeExecVersion('npx opencode-ai --version')` → Correcto cross-platform.
- [ ] **`winPaths[]`**: ¿Está dentro de un guard `platform === 'win32'`?  Si no: agregarlo.
- [ ] ¿El resultado de detección falla silenciosamente en Linux si OpenCode no está en PATH pero sí en `~/.local/bin`? → Shard 03 agrega `linuxPaths[]` para este caso.

### `opencode.json` generation (líneas ~400–500)
- [ ] ¿Los paths escritos en el JSON usan separadores POSIX?
- [ ] ¿Hay algún path hardcoded Windows en el JSON generado (instrucciones, skills, plugins)?
- [ ] Las entradas `instructions[]`: ¿usan paths relativos o absolutos? ¿POSIX en Linux?
- [ ] Las entradas `skill[]`: mismo check.
- [ ] `config.shell`: ¿es `'bash'` en Linux? → `getDefaultShell()` lo provee, debe ser correcto.

### Plugin Registration (líneas ~529–570)
- [ ] ✅ Fix ya definido en Shard 02: usar `pathToFileURL`.
- [ ] ¿El comando `opencode plugin "<url>" --global --force` requiere alguna forma especial en Linux?
- [ ] ¿El comando falla si `opencode` no está en PATH? → La detección previa debería evitar esto.
- [ ] ¿El `execSync` tiene `cwd` correcto? ¿Trabaja en `globalDir` (POSIX path en Linux)?

### `npm install` (línea ~514)
- [ ] ¿El `execSync('npm install', { cwd: globalDir })` funciona en Linux con `globalDir = '/home/.../.config/opencode'`?
- [ ] ¿Requiere permisos especiales? → Si el usuario instaló npm global como root, `~/.config/opencode` puede tener conflictos. Documentar en TROUBLESHOOTING.
- [ ] ¿`package.json` en `globalDir` existe antes del `npm install`? → `compileReaspBundle()` debe haberlo copiado.

### `uninstall()` (líneas ~600–700)
- [ ] ¿Los paths para encontrar archivos a eliminar funcionan en Linux?
- [ ] ¿Usa alguna API Windows-específica para borrado?
- [ ] ¿`fs.rm`, `fs.rmdir`, `fs.unlink` → todos cross-platform en Node 18+.

## Fix Consolidation Strategy

Al implementar este shard, todos los cambios a `opencode.js` van en **un solo commit** atómico que incluye:

1. Import de `pathToFileURL` (de Shard 02)
2. Fix de URLs plugin/tui (de Shard 02)
3. `linuxPaths[]` con detección de binarios (de Shard 03)
4. Cualquier fix adicional encontrado en esta auditoría

**Mensaje de commit:**
```
feat(opencode): Linux compatibility — pathToFileURL, linuxPaths detection, full adapter audit

- Replace file:/// template literal with pathToFileURL() (fixes 4-slash bug on Linux)
- Add linuxPaths[] for OpenCode binary detection (npm global, ~/.local, NVM, Volta)
- Guard winPaths[] inside process.platform === 'win32' check
- Verify all generated JSON paths are POSIX-compatible
```

## Deliverables de este Shard

1. `opencode.js` auditado completamente con todos los fixes aplicados.
2. Lista de cualquier asunción Windows adicional encontrada (o confirmación de que no hay más).
3. Commit atómico con todos los cambios de opencode.js.

## Verification Gate

- `opencode.js` pasa lint sin errores.
- `reasp install --dry-run --agents opencode` en Linux no lanza excepciones.
- `reasp install --agents opencode` en Linux produce `opencode.json` válido con URLs `file:///home/...`.
- En Windows: comportamiento idéntico al estado pre-cambio.
