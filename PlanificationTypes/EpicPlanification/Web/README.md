# Epic: Web — backlog

**Prioridad:** P1 · **Complejidad:** Alta · **Completitud (8 puertas):** 30 % ·
**Estado:** Backlog

## Alcance

`Web` (WebPreviewViewModel, canales, LivePreviewHub, FontNegotiator, replay),
`Web.Canvas` (comandos Canvas 2D + SVG), el visor browser de `Server/wwwroot`,
`Designer.Web` (DesignIntent/RemoteDesignSession) y `Transport` (DTOs, protocolo v1).

## Objetivos

1. Visor web con paridad funcional razonable frente al visor WPF (zoom, navegación,
   búsqueda, parámetros) — hoy es básico; auditar contra DevExpress Web Viewer.
2. Designer web: decidir alcance 1.0 REAL del `RemoteDesignSession` (hoy modelos sin
   UI de navegador) — construir UI mínima o declarar post-1.0 formalmente.
3. Fidelidad tipográfica browser (FontNegotiator AEGI802) validada en Chromium/Firefox.
4. El recorrido manual de este Epic ES en navegador (regla de terminación: host web).

## Dependencias

- Server (transporte y endpoints). Alimenta: Deployment.

## PARTs planificados (12)

- PART01_TransportProtocol — DTOs, versionado, replay determinista
- PART02_CanvasRenderer — comandos 2D, SVG suplementario, fidelidad
- PART03_BrowserViewer — visor wwwroot: virtualización, zoom, navegación
- PART04_ViewerFeatures — búsqueda, parámetros, export desde browser
- PART05_LivePreview — WebSocket push, invalidación incremental
- PART06_Fonts — negociación, fallbacks, medición consistente
- PART07_WebDesignerScope — RemoteDesignSession: UI mínima o post-1.0 formal
- PART08_MobileResponsive — visor en pantallas táctiles/pequeñas
- PART09_BrowserMatrix — validación manual Chromium/Firefox/WebKit
- PART10_Performance — documentos grandes vía red, latencia
- PART11_TechnicalDocumentation
- PART12_UserDocumentation
