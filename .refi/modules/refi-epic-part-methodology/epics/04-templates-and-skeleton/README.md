# EPIC 04 — Templates & Module Skeleton

**Prioridad:** P0 · **Complejidad:** M · **Completitud (8 puertas):** 0 %
**Estado:** Backlog (este README; PARTs detallados en Pass 2)

## Alcance

Crear y poblar los templates nuevos que materializan la metodología Epic + PART, y
actualizar el esqueleto `modules/_template/`.

- Crear `templates/part-template.md` (15 secciones).
- Crear `templates/epic-readme-template.md` (9 secciones).
- Crear `templates/epic-matrix-template.md`.
- Actualizar `modules/_template/` con la nueva carpeta `epics/` y un PART de muestra.

NO incluye: las reglas (EPIC 01), el contrato (EPIC 03), las quality gates (EPIC 05).

## Objetivos

1. Cualquier agente puede generar un packet nuevo arrastrando los templates y
   rellenando secciones sin re-pensar la estructura.
2. La carpeta `modules/_template/epics/` sirve como "demo mínima viable".

## Dependencias

- **Entrantes:** EPIC 01 (definiciones), EPIC 03 (contrato).
- **Salientes:** EPIC 06 usa estos templates para crear el ejemplo worked-example.

## Files to Modify / Create

- **Create:** `.opencode/refi/templates/part-template.md`.
- **Create:** `.opencode/refi/templates/epic-readme-template.md`.
- **Create:** `.opencode/refi/templates/epic-matrix-template.md`.
- **Update:** `.opencode/refi/modules/_template/` — añadir `epics/00-demo/README.md`,
  `epics/00-demo/parts/PART01_demo.md`.

## PARTs planificados (4)

- **PART01_PartTemplate15Sections** — volcar las 15 secciones (EPIC 01 PART03).
- **PART02_EpicReadmeTemplate9Sections** — volcar las 9 secciones (EPIC 01 PART02).
- **PART03_EpicMatrixTemplate** — volcar la tabla de la matriz.
- **PART04_ModuleScaffoldUpdate** — poblar `modules/_template/` con `epics/00-demo/` y un
  PART de muestra con todas las secciones llenas.

## Definición de Done

- 4 archivos creados/actualizados con bloques no vacíos.
- Un humano puede clonar `modules/_template/` a `modules/<slug>/` y completar el packet
  sin re-leer el contrato.
