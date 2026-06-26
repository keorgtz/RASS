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

## Completed (Implementation — Phase 1)

- [x] Arreglar permisos del repo — hecho por maintainer
- [x] Crear rama `linux-compat` desde `Master`
- [x] Mover packet REFI del scratchpad al repo
- [x] Crear `.MeridianUI/.gitkeep` en repo root
- [x] **Shard 01**: Auditoría completa — gap matrix confirmado y corregido vs código real
- [x] **Shard 02**: Fix `pathToFileURL` — `opencode.js` líneas 379-380 y 531-532
- [x] **Shard 03**: `unixPaths[]` ya existía; agregado `.volta` path (additive)
- [x] **Shard 04**: Auditoría completa de `opencode.js` — G1 y Volta eran los únicos pendientes
- [x] **Shard 09**: `meridianui.js` creado; integrado en `index.js` pre-install; `REPO_ROOT` en constants
- [x] **Shard 05**: Adapters menores verificados — todos OK sin cambios requeridos
- [x] **Shard 06**: `.gitattributes` creado; `scripts/reasp` modo 100755; `package.json prepare`

## Pending

- [ ] **Shard 07**: Ejecutar verification gates en Linux real
- [ ] **Shard 08**: Actualizar README (sección Linux + MeridianUI), AGENTS.md, TROUBLESHOOTING.md
- [ ] Agregar contenido real a `.MeridianUI/` y verificar Gate 5

## Current Shard

`Shard 07` — código completo; listo para testing en Linux real.

## Audit Findings — Gap Matrix Real

| Gap | Estado Real | Acción |
|-----|------------|--------|
| G0 MeridianUI no instalada | Confirmado | `meridianui.js` creado ✓ |
| G1 file:/// bug × 2 | Confirmado | `pathToFileURL` ✓ |
| G2 winPaths sin Linux | **YA RESUELTO** en código | Solo Volta agregado ✓ |
| G3 detect Linux incompleto | **YA RESUELTO** en código | Sin cambios ✓ |
| G4 scripts/reasp sin +x | Confirmado | 100755 ✓ |
| G5 MeridianUI glob backslash | OK en Linux | Sin cambios ✓ |
| G6 _instructions.js backslash | OK en Linux | Sin cambios ✓ |

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
