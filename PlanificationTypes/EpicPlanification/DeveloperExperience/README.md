# Epic: DeveloperExperience — backlog

**Prioridad:** P2 · **Complejidad:** Media · **Completitud (8 puertas):** 30 % ·
**Estado:** Backlog

## Alcance

La experiencia del desarrollador que INTEGRA AegiReports: API pública de arranque
(¿cuántas líneas para el primer PDF?), plantillas de proyecto, ejemplos de código por
escenario, mensajes de excepción, ergonomía del SDK, `Compatibility`
(ForeignReportInspector/RdlcMigrator) y `Diagnostics` (logger, probes, CrashReport).

## Objetivos

1. «Time to first PDF» < 10 líneas documentadas y verificadas.
2. Migración desde RDLC/otros auditada como historia real de adopción (AEGI910/911).
3. Diagnósticos consumibles: logging integrable, probes documentados.
4. Ejemplos de código compilables por escenario (consola, WPF, ASP.NET, worker).

## Dependencias

- SDK, Documentation. Alimenta: Release (historia de adopción).

## PARTs planificados (8)

- PART01_QuickstartApi — superficie de arranque, defaults sensatos
- PART02_CodeExamples — ejemplos compilables por escenario de host
- PART03_ProjectTemplates — plantillas dotnet new (decisión de alcance)
- PART04_Migration — inspector de formatos ajenos, migrador RDLC, guía
- PART05_DiagnosticsIntegration — IAegiLogger, probes, crash reports en host
- PART06_ExceptionQuality — auditoría de mensajes/tipos de excepción públicos
- PART07_TechnicalDocumentation
- PART08_UserDocumentation (guía del integrador)
