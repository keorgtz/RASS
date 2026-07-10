# EPIC 03 — REFI Packet Contract & Folder Structure

**Prioridad:** P0 · **Complejidad:** M · **Completitud (8 puertas):** 0 %
**Estado:** Backlog (este README; PARTs detallados en Pass 2)

## Alcance

Actualizar el contrato formal del packet REFI: archivos mínimos, estructura de carpetas,
configuración, e invariantes.

- Extender `.opencode/refi/README.md` con la nueva metodología.
- Actualizar `.opencode/refi/config.yaml` con dos flags nuevos.
- Declarar la carpeta `epics/` como obligatoria en paquetes nuevos.

NO incluye: el contenido de los templates (EPIC 04), ni las quality gates específicas
(EPIC 05).

## Objetivos

1. Cualquier agente que vea el packet puede parsear la estructura sin instrucciones.
2. Los paquetes nuevos siguen la nueva metodología sin elección.
3. Los paquetes viejos siguen funcionando sin cambios.

## Dependencias

- **Entrantes:** EPIC 01 (definiciones), EPIC 02 (qué espera el agente).
- **Salientes:** EPIC 04 implementa los templates que materializan este contrato.

## Files to Modify / Create

- **Update:** `.opencode/refi/README.md`.
- **Update:** `.opencode/refi/config.yaml`.

## PARTs planificados (4)

- **PART01_PacketLayoutSpec** — declarar la nueva estructura `epics/` y la semántica de
  cada archivo.
- **PART02_RequiredFilesContract** — mínimo obligatorio de archivos en un packet nuevo.
- **PART03_ConfigYamlAdditions** — añadir `epic_part.enabled` y `epic_part.require_part_detail_before_handoff`.
- **PART04_BackwardCompatibleFolders** — garantizar que `domain-shards/` sobrevive para
  tareas cross-cutting (sin romper los 4 módulos existentes).

## Definición de Done

- `refi/README.md` documenta explícitamente la nueva estructura.
- `refi/config.yaml` contiene los dos flags nuevos con valores por defecto.
- `modules/_template/epics/` empieza a existir como carpeta placeholder (scaffold por
  EPIC 04).
