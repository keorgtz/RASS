# Verification · REASP Linux Compatibility & MeridianUI Global Install

## Automated Gates (Passed — 2026-06-25)

| Gate | Test | Result |
|------|------|--------|
| Syntax | `npm test` (node --check all files) | ✅ PASS |
| Detect | `reasp detect` on Fedora 44 | ✅ PASS — OpenCode v1.17.11, Claude Code v2.1.193, Gemini CLI detected |
| Dry-run | `reasp install --dry-run --agents opencode` | ✅ PASS — TUI boots, no crash |
| File mode | `git ls-files -s scripts/reasp` | ✅ PASS — mode 100755 |

## Pre-Verification Conditions (Manual Gates)

- Todos los shards 01–09 implementados y en rama `linux-compat`.
- Sistema Linux (Fedora 44) disponible con OpenCode y Claude Code instalados.
- `.MeridianUI/` en repo root tiene contenido real (no solo `.gitkeep`).
- `npm` disponible en PATH con permisos correctos.

---

## Gate 1 · npm global install en Linux

**Objetivo:** `npm install -g .` completa sin errores en Linux.

**Pasos:**
1. Desde el repo en Linux: `npm install -g .`
2. `which reasp` — debe encontrarse en PATH.
3. `reasp --help` — responde sin error.

**Pass:** CLI `reasp` disponible en PATH post-install.

---

## Gate 2 · Detección de agentes en Linux

**Objetivo:** `reasp detect` lista correctamente los agentes instalados.

**Pasos:**
1. `reasp detect`
2. Confirmar que OpenCode aparece con versión y path correcto.
3. Confirmar que agentes no instalados aparecen como `not detected`.

**Pass:** Output refleja exactamente los agentes presentes en el sistema.

---

## Gate 3 · OpenCode install en Linux — bug file:/// corregido

**Objetivo:** Plugin carga sin error de URL; `opencode.json` tiene URLs válidas.

**Pasos:**
1. `reasp install --agents opencode`
2. Verificar URLs en `opencode.json`:
   ```bash
   cat ~/.config/opencode/opencode.json | grep "file://"
   # Esperado: "file:///home/..." (3 barras)
   # Bug a evitar: "file:////home/..." (4 barras)
   ```
3. Iniciar OpenCode → `/sdd` → ModeProfiles aparecen.
4. `/reasp-setup` → responde el orchestrator.

**Pass:** URL con 3 barras; OpenCode carga el plugin sin errores en consola.

---

## Gate 4 · Regresión Windows — código aditivo no rompió nada

**Objetivo:** En Windows, el comportamiento es idéntico al estado pre-cambio.

**Pasos:**
1. En Windows (o CI con Windows): `node installer/index.js install --agents opencode`
2. Verificar `opencode.json`:
   - URLs: `file:///C:/Users/...` ✓
   - Agents, instructions, skills, plugins presentes.
3. `winPaths[]` sigue siendo el mecanismo de detección en Windows.
4. OpenCode carga el plugin sin errores.

**Pass:** Comportamiento Windows idéntico al pre-cambio. `winPaths[]` intacto.

---

## Gate 5 · MeridianUI install en Linux

**Objetivo:** `.MeridianUI/` del repo se copia a `~/.MeridianUI/` en Linux.

**Pasos:**
1. Verificar que `.MeridianUI/` en repo tiene contenido real.
2. `reasp install` (cualquier agente).
3. `ls ~/.MeridianUI/` — debe contener el mismo contenido que el repo.
4. Verificar que el contenido es idéntico: `diff -r /ruta/repo/.MeridianUI ~/.MeridianUI`

**Pass:** `~/.MeridianUI/` existe y tiene el contenido del repo.

---

## Gate 6 · MeridianUI install en Windows

**Objetivo:** `.MeridianUI/` se copia a `%USERPROFILE%\.MeridianUI\` en Windows.

**Pasos:**
1. `reasp install` en Windows.
2. Verificar: `dir %USERPROFILE%\.MeridianUI` — tiene contenido.
3. OpenCode en Windows incluye las instrucciones de MeridianUI sin error de path.

**Pass:** `%USERPROFILE%\.MeridianUI\` existe con contenido del repo.

---

## Gate 7 · MeridianUI warning cuando está vacío

**Objetivo:** El installer no falla si `.MeridianUI/` solo tiene `.gitkeep`.

**Pasos:**
1. Eliminar contenido real de `.MeridianUI/` (dejar solo `.gitkeep`).
2. `reasp install --agents opencode`
3. Verificar que el install continúa (no crash).
4. Verificar que el warning aparece en consola.

**Pass:** Install completa con warning; no hay error ni excepción.

---

## Gate 8 · MeridianUI no se elimina en uninstall

**Objetivo:** `reasp uninstall` preserva `~/.MeridianUI/`.

**Pasos:**
1. Con MeridianUI instalado: `reasp uninstall --agents opencode`
2. `ls ~/.MeridianUI/` — debe seguir existiendo.

**Pass:** `~/.MeridianUI/` intacto después del uninstall.

---

## Gate 9 · Claude Code install en Linux

**Objetivo:** Claude Code recibe CLAUDE.md con bloque REASP.

**Pasos:**
1. `reasp install --agents claude-code`
2. `cat ~/.claude/CLAUDE.md` — contiene bloque REASP.
3. En Claude Code: "Necesito diseñar una feature empresarial siguiendo REFI."
4. Claude Code propone packet `.refi/modules/<slug>/`.

**Pass:** `CLAUDE.md` generado; comportamiento REFI observable.

---

## Gate 10 · Permiso +x en scripts/reasp post-clone

**Pasos:**
1. `git clone <repo> /tmp/reasp-test`
2. `ls -la /tmp/reasp-test/scripts/reasp` → `-rwxr-xr-x`
3. `git ls-files -s /tmp/reasp-test/scripts/reasp` → `100755 ...`
4. `rm -rf /tmp/reasp-test`

**Pass:** Script ejecutable sin `chmod` manual.

---

## Verification Results

| Gate | Estado | Notas |
|------|--------|-------|
| Gate 1 · npm global Linux | ⏳ | |
| Gate 2 · Detect agentes | ⏳ | |
| Gate 3 · OpenCode + file:/// fix | ⏳ | |
| Gate 4 · Regresión Windows | ⏳ | |
| Gate 5 · MeridianUI install Linux | ⏳ | |
| Gate 6 · MeridianUI install Windows | ⏳ | |
| Gate 7 · MeridianUI warning empty | ⏳ | |
| Gate 8 · MeridianUI preservado en uninstall | ⏳ | |
| Gate 9 · Claude Code Linux | ⏳ | |
| Gate 10 · scripts/reasp +x | ⏳ | |

## Final Sign-Off

- [ ] Gates 1–10 passed (o waived con justificación)

**Signed by:** _______________  **Date:** _______________
