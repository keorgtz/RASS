# Epic: Security — backlog

**Prioridad:** P1 · **Complejidad:** Media · **Completitud (8 puertas):** 45 % ·
**Estado:** Backlog

## Alcance

`Security` (ArtifactSigner ECDSA, IntegrityManifest AEGI980, DependencyScanner
AEGI981) y las superficies de seguridad transversales: SQL siempre parametrizado,
expresiones sandboxed, anti-escape de rutas (Storage), deserialización segura de
`.aedocx`/`.aedashboard`/`.aegipkg`, manejo de cadenas de conexión, y el SECURITY_AUDIT
de la Fase 27 como línea base.

## Objetivos

1. Re-ejecutar y ampliar el SECURITY_AUDIT con enfoque adversarial por superficie:
   documentos maliciosos, expresiones hostiles, SQL injection en cada entrada, rutas.
2. Cadenas de conexión: política de almacenamiento/logging definida (nunca en claro
   en logs/crash reports — verificar).
3. Firma de artefactos integrada al pipeline de release.
4. Threat model documentado por host (escritorio, server, web).

## Dependencias

- Ninguna entrante. Alimenta: Release, Deployment.

## PARTs planificados (9)

- PART01_ThreatModel — por host y por superficie de entrada
- PART02_DocumentParsing — .aedocx/.aedashboard/.aegipkg hostiles, fuzzing básico
- PART03_ExpressionSandbox — presupuesto, recursión, denegación de acceso
- PART04_SqlInjection — auditoría de cada camino de SQL (builder, wizard, server)
- PART05_SecretsHandling — cadenas de conexión, logs, crash reports
- PART06_ArtifactSigning — firma/verificación en release y marketplace
- PART07_DependencyScanning — 5 dependencias externas, política de actualización
- PART08_TechnicalDocumentation
- PART09_UserDocumentation (guía de hardening)
