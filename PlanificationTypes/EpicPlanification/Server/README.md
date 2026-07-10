# Epic: Server — backlog

**Prioridad:** P1 · **Complejidad:** Alta · **Completitud (8 puertas):** 35 % ·
**Estado:** Backlog

## Alcance

`Server` (ASP.NET minimal API, sesiones, endpoints de páginas/refresh/export/live),
`Server.Hosting` (ReportCatalog/MultiTenant, RenderCache, ReportServer, Scheduler,
DashboardComposer, DashboardPublisher), `Server.Queue` (jobs, claims, retry,
RenderWorker), `Server.Cluster` (registro, distribución), `Storage` (artefactos),
`Operations` (cuotas, telemetría, dashboard operativo).

## Objetivos

1. Servidor de reportes utilizable en producción single-node: catálogo, render bajo
   demanda, cache, schedule, export, colas — validado end-to-end con carga.
2. La publicación de dashboards deja de bloquear workers (fábrica síncrona con SQL
   real — deuda declarada en ADR-0028).
3. Autenticación/autorización para 1.0 definida (hoy no hay auth — decisión de
   alcance obligatoria) y multi-tenant verificado.
4. Historia operativa: health probes, draining, recuperación de claims.

## Dependencias

- Exporting, Headless. Alimenta: Web, Deployment.

## PARTs planificados (14)

- PART01_HttpApi — endpoints, DTOs, errores, versionado de protocolo
- PART02_SessionLifecycle — sesiones de preview, TTL, refresh incremental
- PART03_ReportCatalog — catálogo, multi-tenant, aislamiento
- PART04_RenderCache — TTL, claves deterministas, invalidación
- PART05_Scheduler — programación sin timers, entrega de artefactos
- PART06_JobQueue — claims atómicos, retry/backoff, stale claims, recovery
- PART07_Workers — RenderWorker stateless, ejecución de jobs, replay
- PART08_Cluster — registro, heartbeat, drain, distribución de carga
- PART09_DashboardPublishing — ciclo asíncrono, fuentes SQL reales
- PART10_AuthSecurity — autenticación/autorización 1.0 (decisión de alcance)
- PART11_Operations — cuotas, usage, health, draining
- PART12_LoadValidation — pruebas de carga y estabilidad prolongada
- PART13_TechnicalDocumentation
- PART14_UserDocumentation (guía de operación)
