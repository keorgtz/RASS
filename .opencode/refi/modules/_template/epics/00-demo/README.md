# EPIC 00 — REFI Demo · EPIC + PART Pattern

**Prioridad:** P0 (demo) · **Complejidad:** B ·
**Completitud (8 puertas):** 0 % · **Estado:** Backlog (PARTs detallados como muestra)

## Alcance

EPIC de demostración del patrón Epic + PART. Sirve como ejemplo vivo de la estructura
de un packet REFI v2. No debe ejecutarse; existe solo como referencia dentro de
`modules/_template/`.

## Objetivos

1. Mostrar las 9 secciones del EPIC README canónicas.
2. Servir de plantilla visible para futuros packets.
3. Validar que la estructura completa se puede clonar y renombrar sin perder coherencia.

## Dependencias

- **Entrantes:** ninguna.
- **Salientes:** ninguna (es solo demo).

## Complejidad y prioridad

- **Complejidad B:** contenido demostrativo; sin código real.
- **P0 demo:** nunca se ejecuta; se mantiene como referencia visual.

## Files to Modify / Create

- `epics/00-demo/README.md` — este archivo (plantilla llena de demo).
- `epics/00-demo/parts/PART01_demo.md` — un PART de ejemplo con las 15 secciones + footer.

## PARTs planificados

- PART01_demo — Plantilla visible de un PART completo: las 15 secciones + footer de 8 gates.

## Definición de Done

EPIC terminado = el contenido de demo está completo y sirve de referencia clara.
**Este EPIC NO se ejecuta**; su estado permanece en `Backlog` indefinidamente.

### PARTs planificados (1)

- PART01_demo — ejemplo canónico con 15 secciones + footer firmado a modo de demo.