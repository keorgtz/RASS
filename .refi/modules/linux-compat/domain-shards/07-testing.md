# Domain Shard 07 · Testing & Validation Matrix

## Objetivo

Ejecutar y documentar todos los verification gates en el sistema Linux real del maintainer (Fedora 44). Este shard es de ejecución, no de código.

## Pre-conditions

- Todos los shards 02–06 implementados y en rama `linux-compat`.
- Sistema Linux (Fedora 44) con acceso al terminal.
- Al menos OpenCode instalado en el sistema Linux.
- Claude Code instalado (para Gate 4).
- El repo REASP con permisos correctos: `sudo chown -R $USER:$USER /home/ryou/Keorsoft/KeorAI/REASP/`.

## Test Matrix

### T1 — Verificar el estado pre-test

```bash
# Ver versión de Node y npm
node --version    # debe ser >= 18.0.0
npm --version

# Ver prefix npm global
npm config get prefix

# Ver si opencode está en PATH
which opencode || echo "opencode no está en PATH"
opencode --version

# Ver si claude está en PATH  
which claude || echo "claude no está en PATH"
claude --version

# Ver el estado del bit +x
git ls-files -s scripts/reasp
# Esperado: 100755 ...
```

### T2 — npm install global en Linux

```bash
cd /home/ryou/Keorsoft/KeorAI/REASP

# Si npm prefix es /usr/local (requiere sudo):
sudo npm install -g .
# O con prefix de usuario:
npm install -g .

# Verificar que el bin quedó disponible
which reasp
reasp --help
```

**Pass:** `reasp --help` muestra el menú de ayuda sin errores.

### T3 — reasp detect en Linux

```bash
reasp detect
# O directamente:
node /home/ryou/Keorsoft/KeorAI/REASP/installer/index.js detect
```

**Registrar output completo.** Verificar:
- OpenCode: detected / not detected (debe coincidir con realidad)
- Claude Code: detected / not detected (debe coincidir)
- Gemini: estado
- Codex: estado
- Antigravity: estado

**Pass:** El output refleja exactamente los agentes instalados en el sistema.

### T4 — reasp install OpenCode (bug file:/// crítico)

```bash
# Primero: dry run para verificar sin cambios reales
node /home/ryou/Keorsoft/KeorAI/REASP/installer/index.js install --agents opencode --dry-run

# Si dry-run OK, hacer el install real:
node /home/ryou/Keorsoft/KeorAI/REASP/installer/index.js install --agents opencode
```

**Verificaciones post-install:**
```bash
# Verificar que los archivos se copiaron
ls ~/.config/opencode/
ls ~/.config/opencode/agents/
ls ~/.config/opencode/sdd-profiles/

# CRÍTICO: verificar URLs del plugin en opencode.json
cat ~/.config/opencode/opencode.json | grep -E "file://"
# Esperado: "file:///home/ryou/.config/opencode/plugin.js"  (3 barras)
# Bug a evitar: "file:////home/ryou/.config/opencode/plugin.js" (4 barras)

# Contar barras en la URL para confirmar
cat ~/.config/opencode/opencode.json | grep -oP "file://[/]+" | head -1
# Debe ser: file:///  (exactamente 3 barras)
```

**Pass:** URL en `opencode.json` tiene exactamente `file:///home/...` (3 barras).

### T5 — OpenCode carga el plugin sin errores de URL

```bash
# Iniciar OpenCode en una sesión nueva
opencode
# Dentro de OpenCode:
# /sdd  → debe mostrar lista de ModeProfiles
# /reasp-setup → debe responder el orchestrator
```

**Pass:** No aparecen errores de "Invalid URL", "ENOENT plugin.js" ni similares.

### T6 — reasp install Claude Code en Linux

```bash
node /home/ryou/Keorsoft/KeorAI/REASP/installer/index.js install --agents claude-code
```

**Verificaciones:**
```bash
# Verificar que CLAUDE.md fue creado/actualizado
ls -la ~/.claude/CLAUDE.md
cat ~/.claude/CLAUDE.md | head -20
# Debe contener el bloque REASP con comentarios de inicio/fin del bloque
```

**Pass:** `~/.claude/CLAUDE.md` contiene el bloque REASP correctamente formateado.

### T7 — Comportamiento REASP en Claude Code

```bash
claude
# En Claude Code, en un proyecto de prueba:
# Prompt: "Necesito implementar una feature siguiendo REFI."
```

**Pass:** Claude Code propone crear un packet `.refi/modules/<slug>/` con los archivos del contrato REFI.

### T7b — MeridianUI install en Linux

```bash
# Con contenido real en .MeridianUI/:
reasp install  # cualquier agente

# Verificar instalación
ls ~/.MeridianUI/
diff -r /home/ryou/Keorsoft/KeorAI/REASP/.MeridianUI ~/.MeridianUI
# No debe haber diferencias
```

**Pass:** `~/.MeridianUI/` contiene el mismo contenido que el repo.

### T7c — MeridianUI warning cuando vacío

```bash
# Temporalmente, renombrar contenido real:
# (verificar con solo .gitkeep en .MeridianUI/)
reasp install --agents opencode --dry-run
# Debe mostrar warning sobre MeridianUI vacío pero no fallar
```

**Pass:** Warning visible; no exception; install continúa.

### T8 — reasp uninstall en Linux

```bash
# Desinstalar solo Claude Code
node /home/ryou/Keorsoft/KeorAI/REASP/installer/index.js uninstall --agents claude-code

# Verificar que CLAUDE.md fue limpiado
cat ~/.claude/CLAUDE.md 2>/dev/null || echo "CLAUDE.md eliminado"
# O si tenía contenido pre-REASP: verificar que el bloque REASP fue removido

# Verificar que OpenCode sigue intacto
ls ~/.config/opencode/agents/ | head -5
```

**Pass:** REASP removido de Claude Code; OpenCode sin cambios.

### T9 — Git clone fresh en Linux (bit +x)

```bash
# Clonar en directorio temporal
git clone /home/ryou/Keorsoft/KeorAI/REASP /tmp/reasp-test-clone
ls -la /tmp/reasp-test-clone/scripts/reasp
# Debe mostrar: -rwxr-xr-x
# Verificar modo git
cd /tmp/reasp-test-clone && git ls-files -s scripts/reasp
# Debe mostrar: 100755 ...
rm -rf /tmp/reasp-test-clone
```

**Pass:** El script es ejecutable sin `chmod` manual tras un clone fresh.

## Registro de Resultados

| Test | Estado | Output / Notas | Fecha |
|------|--------|----------------|-------|
| T1 Pre-conditions | ⏳ | | |
| T2 npm install -g | ⏳ | | |
| T3 reasp detect | ⏳ | | |
| T4 install OpenCode (file:/// fix) | ⏳ | | |
| T5 OpenCode plugin load | ⏳ | | |
| T6 install Claude Code | ⏳ | | |
| T7 Claude Code behavior | ⏳ | | |
| T8 uninstall | ⏳ | | |
| T9 bit +x post-clone | ⏳ | | |

## Fallos Conocidos a Documentar

Si algún test falla por razones de entorno (ej: npm prefix sin write access, NVM no en PATH en sesiones no interactivas), documentar en `installer/TROUBLESHOOTING.md` en lugar de tratar de "arreglarlo" en el installer — son condiciones de entorno del usuario, no bugs del framework.

## Deliverables de este Shard

1. Tabla de resultados completa con estados y notas.
2. Lista de bugs adicionales encontrados durante testing (si los hay).
3. Issues de entorno documentados para TROUBLESHOOTING (Shard 08).
4. Sign-off en `verification.md` para los gates completados.
