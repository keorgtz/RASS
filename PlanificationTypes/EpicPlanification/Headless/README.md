# Epic: Headless — backlog

**Prioridad:** P2 · **Complejidad:** Media · **Completitud (8 puertas):** 50 % ·
**Estado:** Backlog

## Alcance

`Headless` (HeadlessComposer, HeadlessExportService), `Rendering.Skia` (medición y
raster sin WPF), `Platform` (HostCapabilities, CapabilityNegotiator AEGI800,
PlatformAudit) y la historia Linux/CI del producto.

## Objetivos

1. Pipeline completo verificado en Linux real (o contenedor) — no solo por diseño.
2. Equivalencia de medición WPF vs Skia cuantificada (corpus de documentos, tolerancia
   documentada) — hoy es «mismo algoritmo», falta la evidencia sistemática.
3. Los 8 `WpfPageRendererTests` excluidos por entorno: estrategia CI definitiva
   (runner con sesión interactiva, o raster Skia como referencia en CI — gap G8).

## Dependencias

- Ninguna entrante. Alimenta: Server (workers), Deployment, CI.

## PARTs planificados (8)

- PART01_HeadlessComposer — composición stateless, thread pool, sesiones
- PART02_SkiaParity — corpus WPF vs Skia, tolerancias, regresión
- PART03_LinuxValidation — ejecución real en Linux/contenedor, fuentes
- PART04_CapabilityNegotiation — perfiles de host, auditoría de plataforma
- PART05_CiRasterStrategy — resolver la exclusión de WpfPageRendererTests
- PART06_Performance — throughput headless, memoria por worker
- PART07_TechnicalDocumentation
- PART08_UserDocumentation
