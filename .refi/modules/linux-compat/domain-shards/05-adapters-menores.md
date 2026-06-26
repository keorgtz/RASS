# Domain Shard 05 · Adapters Menores en Linux

## Objetivo

Verificar y corregir (si es necesario) los adapters de Claude Code, Gemini CLI, Codex y Antigravity CLI para asegurar funcionamiento correcto en Linux.

## Contexto

Estos adapters son significativamente más simples que `opencode.js`. La mayoría de su lógica consiste en:
1. Determinar el directorio de configuración del agente (e.g., `~/.claude`)
2. Generar un archivo de instrucciones markdown (o YAML/JSON)
3. Escribir el archivo al directorio correcto

Dado que todos usan `path.join(homeDir, '.<agentname>')`, que funciona correctamente en Linux, el riesgo es bajo. Este shard es principalmente auditoría con posibles cambios menores.

## Adapter: `claude-code.js`

### Checklist
- [ ] `globalConfigDir`: ¿`path.join(homeDir, '.claude')`? → Correcto en Linux (`~/.claude`)
- [ ] ¿Algún path Windows-específico?
- [ ] ¿Usa `process.env.USERPROFILE`? → Debe tener fallback `HOME`
- [ ] `detect()`: ¿cubre `/usr/local/bin/claude`, `/usr/bin/claude`, `~/.local/bin/claude`? (Según exploración: SÍ, ya los tiene)
- [ ] `install()`: ¿escribe `CLAUDE.md` correctamente con separadores POSIX?
- [ ] ¿Algún `execSync` con comando Windows-específico?
- [ ] ¿El bloque REASP generado en `CLAUDE.md` contiene paths absolutos que deben ser POSIX?

### Estado esperado: ✅ Probablemente OK sin cambios

Claude Code fue el primer adapter extra implementado y ya tiene rutas Linux en detect. Verificar y confirmar.

---

## Adapter: `gemini.js`

### Checklist
- [ ] `globalConfigDir`: ¿`path.join(homeDir, '.gemini')`? → Correcto en Linux
- [ ] ¿Archivos de config que escribe: format y encoding son cross-platform?
- [ ] `detect()`: ¿busca `gemini` en rutas Linux?
  - `/usr/local/bin/gemini`
  - `~/.local/bin/gemini`  
  - `~/.google/gemini` (si existe tal path)
  - `gemini --version` en PATH
- [ ] ¿Hay alguna referencia a Windows Registry o paths específicos Windows?
- [ ] ¿Usa `APPDATA` sin fallback?

### Estado esperado: ✅ Probablemente OK, confirmar rutas detect

Agregar rutas Linux a detect si faltan: `~/.local/bin/gemini`, `/usr/local/bin/gemini`.

---

## Adapter: `codex.js`

### Checklist
- [ ] `globalConfigDir`: ¿`path.join(homeDir, '.codex')`? → Correcto en Linux
- [ ] `detect()`: ¿busca `codex` en:
  - `/usr/local/bin/codex`
  - `~/.local/bin/codex`
  - `codex --version` en PATH
- [ ] ¿El formato del archivo de instrucciones (markdown o JSON) es cross-platform?
- [ ] ¿Algún path o comando Windows-específico?

### Estado esperado: ✅ Probablemente OK, confirmar rutas detect

---

## Adapter: `antigravity.js`

### Checklist (adapter experimental)
- [ ] `globalConfigDir`: ¿resuelve con `ANTIGRAVITY_CONFIG_PATH` env var o `path.join(homeDir, '.antigravity')`?
- [ ] En Linux, la variable `ANTIGRAVITY_CONFIG_PATH` puede estar o no definida — ¿manejo correcto?
- [ ] `detect()`: ¿busca `antigravity` en rutas Linux?
- [ ] ¿Usa algún path Windows-específico?
- [ ] El adapter está marcado como experimental — ¿tiene guards adicionales que puedan romperse en Linux?

### Estado esperado: ⚠️ Verificar — es experimental y menos probado

---

## Adapter compartido: `_instructions.js`

### Checklist
- [ ] Línea 159: `path.join(homeDir || '', '.MeridianUI').replace(/\\/g, '/')` → OK en Linux (replace sin efecto)
- [ ] ¿Genera paths absolutos embebidos en los archivos de instrucciones? Si sí: ¿son POSIX-compatible en Linux?
- [ ] ¿Hay algún path hardcoded con separadores Windows en los templates de markdown?

---

## Tabla de Estado por Adapter

| Adapter | Config Dir | Detect Linux | Install Linux | Acción |
|---------|-----------|--------------|---------------|--------|
| `claude-code.js` | `~/.claude` | ✅ ya tiene paths Linux | ✅ md file POSIX | Verificar, probablemente OK |
| `gemini.js` | `~/.gemini` | ⚠️ verificar | ✅ | Verificar + completar detect |
| `codex.js` | `~/.codex` | ⚠️ verificar | ✅ | Verificar + completar detect |
| `antigravity.js` | `~/.antigravity` (o env var) | ⚠️ verificar | ⚠️ | Verificar experimental |
| `_instructions.js` | shared | N/A | ⚠️ backslash | Confirmar OK en Linux |

## Deliverables de este Shard

1. Confirmación escrita del estado de cada adapter en Linux (OK o cambios aplicados).
2. Rutas de detección Linux completadas en todos los adapters que las necesiten.
3. Commit por adapter modificado, o un commit conjunto si los cambios son mínimos:
   `fix: verify and complete Linux detection paths in minor agent adapters`

## Verification Gate

- `reasp install --agents claude-code` en Linux produce `~/.claude/CLAUDE.md` con bloque REASP válido.
- `reasp install --agents gemini` produce el archivo de config correcto en `~/.gemini/`.
- `reasp install --agents codex` produce el archivo de config correcto en `~/.codex/`.
- `reasp detect` en Linux identifica correctamente gemini, codex y antigravity si están instalados.
