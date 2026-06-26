# Domain Shard 08 · Documentation Updates

## Objetivo

Actualizar `README.md`, `installer/AGENTS.md` y `installer/TROUBLESHOOTING.md` para reflejar el soporte Linux de manera clara, reproducible y sin ambigüedades.

## README.md

### Sección a agregar: "Linux Installation"

Ubicar después de la sección de instalación Windows existente. Contenido propuesto:

```markdown
### Linux (Fedora, Ubuntu, Arch)

**Prerequisitos:**
- Node.js >= 18 (`node --version`)
- npm (`npm --version`)
- Al menos un agente de IA CLI instalado: OpenCode, Claude Code, Gemini CLI, Codex, o Antigravity CLI

**Instalar REASP globalmente:**

\`\`\`bash
# Opción A — Si npm global está configurado con prefix de usuario (recomendado):
npm config set prefix '~/.npm-global'
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
npm install -g /ruta/al/repo/REASP

# Opción B — Si tienes acceso sudo y npm instala en /usr/local:
sudo npm install -g /ruta/al/repo/REASP

# Verificar instalación:
reasp --help
\`\`\`

**Instalar REASP en tus agentes:**
\`\`\`bash
reasp install              # interactivo — detecta agentes y permite selección
reasp install --agents opencode,claude-code   # no-interactivo
reasp detect               # ver qué agentes están instalados
\`\`\`

**Con NVM:**
Si usas NVM, asegúrate de que el nodo activo está en tu PATH antes de instalar:
\`\`\`bash
nvm use --lts              # o la versión que uses
npm install -g /ruta/REASP
\`\`\`
```

### Sección a actualizar: "Installation"

Cambiar el ejemplo de path Windows:
```markdown
# ANTES:
npm install -g C:\Users\TuUsuario\Keorsoft\KeorAI\REASP

# DESPUÉS — usar path relativo (funciona en ambas plataformas):
# Desde el directorio del repo:
npm install -g .
# O con path absoluto:
# Windows: npm install -g C:\Users\TuUsuario\Keorsoft\KeorAI\REASP
# Linux:   npm install -g /home/usuario/Keorsoft/KeorAI/REASP
```

---

## `installer/AGENTS.md`

### Tabla de paths por agente — completar columna Linux

La tabla ya existe con columnas Windows y Linux. Verificar y completar con paths reales confirmados en Shard 07:

| Agent | Windows Path | Linux Path |
|-------|-------------|------------|
| OpenCode | `%USERPROFILE%\.config\opencode` | `~/.config/opencode` |
| Claude Code | `%USERPROFILE%\.claude` | `~/.claude` |
| Codex | `%USERPROFILE%\.codex` | `~/.codex` |
| Gemini CLI | `%USERPROFILE%\.gemini` | `~/.gemini` |
| Antigravity CLI | `%USERPROFILE%\.antigravity` | `~/.antigravity` |

### Sección de detección de binarios en Linux

Agregar una subsección documentando cómo REASP detecta cada agente en Linux y qué paths verifica, para que un contributor pueda agregar un nuevo target.

---

## README.md — Sección MeridianUI

Agregar sección explicando cómo agregar el contenido de MeridianUI al repo:

```markdown
### MeridianUI

REASP instala automáticamente MeridianUI en `~/.MeridianUI/` durante `reasp install`.

**Agregar contenido MeridianUI al repo:**
1. Copia tu contenido MeridianUI a la carpeta `.MeridianUI/` en la raíz del repo REASP.
2. Ejecuta `reasp install` — el contenido se instala globalmente.
3. Para actualizar MeridianUI, actualiza la carpeta y corre `reasp install` nuevamente.

Si `.MeridianUI/` está vacío, el installer muestra un warning y continúa sin instalarlo.
```

---

## `installer/TROUBLESHOOTING.md`

### Agregar sección: "Linux — Problemas Comunes"

```markdown
## Linux — Problemas Comunes

### `npm install -g` falla con EACCES (Permission denied)

npm global está configurado para instalar en `/usr/local`, que requiere permisos de root.

**Solución recomendada (sin sudo):**
\`\`\`bash
npm config set prefix '~/.npm-global'
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
npm install -g /ruta/al/repo/REASP
\`\`\`

**Alternativa con sudo:**
\`\`\`bash
sudo npm install -g /ruta/al/repo/REASP
\`\`\`

---

### `reasp: command not found` después de instalar

El binario está instalado pero no está en PATH.

**Con npm prefix de usuario:**
\`\`\`bash
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
\`\`\`

**Con NVM:** El nodo activo al instalar difiere del nodo activo en la sesión actual.
\`\`\`bash
nvm use --lts
which reasp  # debe encontrarlo ahora
\`\`\`

---

### OpenCode no detectado en Linux

`reasp detect` muestra OpenCode como "not detected" aunque sí está instalado.

Verificar que `opencode --version` funciona en tu terminal:
\`\`\`bash
opencode --version
\`\`\`

Si no funciona: OpenCode no está en PATH. Agregarlo:
\`\`\`bash
# Encontrar dónde está instalado:
which opencode || find ~/.local ~/.npm-global ~/.nvm ~/.volta -name "opencode" 2>/dev/null
# Agregar el directorio al PATH en ~/.bashrc
\`\`\`

---

### `npm install` falla durante `reasp install` en el directorio de OpenCode

REASP ejecuta `npm install` en `~/.config/opencode/` para instalar dependencias del plugin.
Si npm no está en PATH en la sesión donde corres `reasp install`, este paso fallará.

**Solución:** Asegurarse de que `npm` está en PATH antes de correr `reasp install`.
Con NVM: `nvm use --lts && reasp install`.

---

### Plugin URL inválida en OpenCode (`file:////home/...`)

Si tienes una versión de REASP instalada antes del fix de compatibilidad Linux, el `opencode.json`
puede contener URLs inválidas con 4 barras. Para corregirlo:

\`\`\`bash
# Reinstalar REASP (sobrescribe opencode.json con URLs correctas):
reasp install --agents opencode
\`\`\`
```

---

## Deliverables de este Shard

1. `README.md` con sección Linux Installation agregada y ejemplo de path corregido.
2. `installer/AGENTS.md` con tabla de paths Linux verificados.
3. `installer/TROUBLESHOOTING.md` con sección Linux expandida.
4. Commit: `docs: add Linux installation guide, troubleshooting, and verified agent paths`.

## Verification Gate

- Un usuario que nunca ha instalado REASP puede seguir el README en Linux y completar la instalación exitosamente.
- Los paths documentados en AGENTS.md coinciden con los reales verificados en Shard 07.
- Los problemas documentados en TROUBLESHOOTING son los observados en Shard 07 o los canónicos de npm en Linux.
