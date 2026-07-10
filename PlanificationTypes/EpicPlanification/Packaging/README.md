# Epic: Packaging — backlog

**Prioridad:** P1 · **Complejidad:** Media · **Completitud (8 puertas):** 35 % ·
**Estado:** Backlog

## Alcance

El empaquetado NuGet centralizado (Directory.Build.props: snupkg, metadatos), la
definición de los paquetes públicos (¿un metapaquete? ¿paquetes por área?), iconos/
readme/licencia por paquete, versionado 1.0.0 y la matriz de qué proyectos se
publican (Demo/Benchmarks/Tests = no).

## Objetivos

1. Taxonomía de paquetes NuGet comercial definida y justificada (núcleo, WPF, web,
   server, SDK, exporters) con dependencias mínimas por paquete.
2. Cada paquete instala y funciona en un proyecto virgen (validación real por
   paquete: restore + compile + hello-report).
3. Metadatos completos: readme, icono, licencia comercial, source link, snupkg.

## Dependencias

- Licensing (términos). Alimenta: Deployment, Release.

## PARTs planificados (8)

- PART01_PackageTaxonomy — mapa proyecto→paquete, metapaquetes
- PART02_Metadata — readme/icono/licencia/tags/sourcelink por paquete
- PART03_DependencyMatrix — dependencias mínimas, sin arrastre WPF a core
- PART04_InstallValidation — proyecto virgen por paquete, smoke real
- PART05_VersioningPolicy — 1.0.0, canales, SemVer del SDK
- PART06_FeedStrategy — nuget.org/feed privado, firmas
- PART07_TechnicalDocumentation
- PART08_UserDocumentation (qué paquete instalar según escenario)
