# Request · REASP Linux Compatibility & MeridianUI Global Install

## Source Request

> "Tengo mi repositorio aquí donde tengo un mini framework para Agentes de IA que ya funciona bastante bien, sobre todo en Opencode, pero pasa que solo lo hice para Windows, me hace falta adaptarlo a linux para que se instale y funcione correctamente en linux."

> "Mi Reasp no debe reemplazarse con la version para linux sino que debes agregarla junto a la de windows para que mi Reasp sea compatible con ambos sistemas. Modifica que mi MeridianUI también se instale tanto en windows como en linux — te dejaré la carpeta en la raíz del proyecto REASP llamada .MeridianUI y de ahí siempre se tendrá que basar para la UI o al menos inspirarse."

## Owner

Kevin Keor / maintainer de REASP.

## Scope Inclusions

### Linux Compatibility (aditiva — Windows se preserva sin cambios)

1. `npm install -g .` funciona correctamente desde Linux.
2. El CLI `reasp` es ejecutable en Linux (bit `+x` preservado en git).
3. Detección de agentes (`detect.js`) cubre rutas de instalación reales en Linux para los 5 targets.
4. El adapter de OpenCode encuentra el binario correctamente en Linux (npm global, NVM, Volta).
5. Corrección del bug `file:///` → `file:////` en Linux.
6. Todos los adapters menores funcionan sin suposiciones Windows-only.
7. **PRINCIPIO FUNDAMENTAL**: Las rutas Windows (`winPaths[]`, `APPDATA`, `.exe`) NO se eliminan. Se agrega compatibilidad Linux en paralelo. El resultado es un installer que funciona en ambas plataformas.

### MeridianUI Global Installation (nueva funcionalidad, ambas plataformas)

8. El directorio `.MeridianUI/` en la raíz del repo REASP es la fuente canónica de MeridianUI.
9. El installer copia `.MeridianUI/` a `~/.MeridianUI/` (Linux/macOS) y `%USERPROFILE%\.MeridianUI\` (Windows) como parte del proceso de instalación.
10. Si `.MeridianUI/` está ausente o vacío en el repo, el installer advierte pero no falla.
11. Los adapters OpenCode, Claude Code, Gemini CLI, Codex y Antigravity CLI todos referencian `~/.MeridianUI` correctamente después de la instalación.
12. La instalación de MeridianUI es un paso compartido (pre-install) independiente del agente seleccionado.

## Scope Exclusions

- No reescribir lógica de negocio de ningún adapter: solo detección de rutas, instalación de MeridianUI y fixes de paths.
- No eliminar soporte Windows en ningún archivo.
- No modificar `.opencode/plugin.js`, `.opencode/tui.js`, `.opencode/rass-core.js` más allá de corrección de URLs.
- No cambiar ModeProfiles, agent prompts, ni archivos de reglas.
- No agregar soporte para macOS en este ciclo (puede derivarse).

## Success Criteria

- `npm install -g .` y `reasp install` funciona en Linux Fedora 44 sin modificar código existente para Windows.
- `reasp install` en Windows sigue funcionando exactamente igual que antes.
- `reasp install` copia `.MeridianUI/` a `~/.MeridianUI/` tanto en Windows como en Linux.
- El plugin de OpenCode carga en Linux sin error de URL (sin `file:////`).
- Los 5 adapters de agentes referencian `~/.MeridianUI` correctamente post-install.

## Language

Español / inglés mixto, siguiendo la convención existente del proyecto.
