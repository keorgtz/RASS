# Epic: Licensing — backlog

**Prioridad:** P2 · **Complejidad:** Media · **Completitud (8 puertas):** 55 % ·
**Estado:** Backlog

## Alcance

`Licensing` (.aelic JSON + ECDSA P-256 offline, AelicValidator, período de gracia),
`Licensing.Server` (emisión/registro/revocación local), `Licensing.Tool` (CLI + TUI),
la validación en SDK (AEGI720) y el puente documentado entre capas.

## Objetivos

1. Ciclo comercial completo validado manualmente: emitir → activar → validar →
   gracia → revocar → expirar.
2. Política de licencias por edición/asiento definida y documentada (decisión de
   producto pendiente para 1.0).
3. Mensajería de licencia en hosts (Demo/estudio/server) profesional y no intrusiva.

## Dependencias

- Ninguna entrante. Alimenta: Packaging (SKUs), Release.

## PARTs planificados (9)

- PART01_LicenseFormat — .aelic, claims, firma, compatibilidad futura
- PART02_Validation — validador, gracia, reloj, offline total
- PART03_IssuerServer — emisión, registro, revocación
- PART04_CliTool — keys/create/validate, TUI, scripting
- PART05_HostIntegration — experiencia en Demo/estudio/server, watermarks de trial
- PART06_EditionPolicy — ediciones/SKUs/features por licencia (decisión 1.0)
- PART07_SecurityReview — rotación de claves, tampering, relojes manipulados
- PART08_TechnicalDocumentation
- PART09_UserDocumentation
