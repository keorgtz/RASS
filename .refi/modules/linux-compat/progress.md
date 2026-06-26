# Progress · REASP Linux Compatibility & MeridianUI Global Install

## Initial State

- REASP funciona completamente en Windows con OpenCode como target principal.
- El installer multi-agente está implementado y verificado en Windows.
- El repo está en rama `Master`; no existe branch `linux-compat`.
- No se han hecho pruebas de instalación en Linux.
- MeridianUI es referenciada en instrucciones pero nunca instalada por el installer.
- Gap analysis y plan maestro completados en sesión de planeación (2026-06-25).

## Completed

- [x] Crear REFI packet: `.refi/modules/linux-compat/`
- [x] Escribir `request.md` (actualizado con alcance MeridianUI)
- [x] Escribir `master-blueprint.md` con gap matrix completo + diseño MeridianUI
- [x] Escribir domain shards 01–09 (shard 09 nuevo: MeridianUI installer)
- [x] Escribir `orchestration-map.md` con shard 09 integrado
- [x] Escribir `verification.md` con gates MeridianUI
- [x] Escribir `progress.md` (este archivo)

## Pending

- [ ] Arreglar permisos del repo: `sudo chown -R $USER:$USER /home/ryou/Keorsoft/KeorAI/REASP/`
- [ ] Mover packet REFI del scratchpad al repo: `.refi/modules/linux-compat/`
- [ ] Crear rama `linux-compat` desde `Master`
- [ ] Crear `.MeridianUI/.gitkeep` en repo root (placeholder para el contenido UI)
- [ ] **Shard 01**: Auditar y confirmar gap matrix completo
- [ ] **Shard 02**: Fix `pathToFileURL` en `opencode.js:529-530`
- [ ] **Shard 03**: Agregar `linuxPaths[]` en `opencode.js` (aditivo); completar `detect.js`
- [ ] **Shard 04**: Auditoría completa de `opencode.js` y commit consolidado
- [ ] **Shard 09**: Crear `meridianui.js`, integrar en `index.js`, crear `REPO_ROOT` en constants
- [ ] **Shard 05**: Verificar adapters menores
- [ ] **Shard 06**: `.gitattributes`, `package.json prepare`, verificar `scripts/reasp`
- [ ] **Shard 07**: Ejecutar verification gates en Linux real
- [ ] **Shard 08**: Actualizar README, AGENTS.md, TROUBLESHOOTING.md

## Current Shard

`master-blueprint.md` — planeación completa. Pendiente aprobación del maintainer e inicio de implementación.

## Design Decisions Locked

| Decisión | Estado |
|----------|--------|
| Additive, no replacement: `winPaths[]` se preserva intacto | ✅ Confirmado |
| MeridianUI instala desde `.MeridianUI/` del repo a `~/.MeridianUI/` del usuario | ✅ Confirmado |
| MeridianUI es paso pre-install (no por adapter) | ✅ Confirmado |
| `reasp uninstall` NO elimina `~/.MeridianUI/` | ✅ Confirmado |
| `pathToFileURL` como fix del bug file:/// | ✅ Confirmado |
| `fs.promises.cp()` para MeridianUI install | ✅ Confirmado (Node ≥ 18) |

## Blockers

- **Permisos del repo**: El directorio `/home/ryou/Keorsoft/KeorAI/REASP/` es propiedad de `root`. Ejecutar: `sudo chown -R $USER:$USER /home/ryou/Keorsoft/KeorAI/REASP/` antes de iniciar implementación.
- **Contenido MeridianUI**: El maintainer agregará el contenido de `.MeridianUI/` más tarde. El installer ya maneja el caso vacío con warning.
