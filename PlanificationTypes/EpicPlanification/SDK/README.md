# Epic: SDK — backlog

**Prioridad:** P1 · **Complejidad:** Alta · **Completitud (8 puertas):** 50 % ·
**Estado:** Backlog

## Alcance

`AegiReports.SDK` completo: ControlExtension (layout handler + fragmentos + cloner +
inspector + serializador .aedocx), ExporterExtension, PropertyEditorExtension,
DesignerPanelExtension, IAegiPlugin/PluginManifest, ExtensionRegistry,
LocalizationCatalog, temas, parámetros del SDK, SdkVersion/compatibilidad y el
Dashboard Widget SDK.

## Objetivos

1. El SDK es EL contrato comercial con terceros: auditar la superficie pública
   completa (docs XML ya al 100 % — falta la narrativa), estabilidad y ergonomía.
2. Un plugin de ejemplo canónico por tipo de extensión, compilable por un tercero.
3. Política de compatibilidad SemVer del SDK verificada (MinimumSdkVersion).
4. Documentación técnica exhaustiva (es el epic con mayor peso documental).

## Dependencias

- Ninguna entrante. Alimenta: Plugins, DeveloperExperience, Documentation.

## PARTs planificados (11)

- PART01_ExtensionModel — ControlExtension end-to-end (las 6 capacidades)
- PART02_ExporterExtensions — registro, streaming, ejemplo canónico
- PART03_DesignerExtensions — property editors, paneles, toolbox de terceros
- PART04_PluginContract — IAegiPlugin, manifest, aislamiento AEGI700–702
- PART05_DashboardWidgetSdk — IDashboardWidgetFactory, materialización, hit-áreas
- PART06_Serialization — serializadores .aedocx de terceros, contratos de error
- PART07_Versioning — SdkVersion, SemVer, BreakingChangeDetector en CI
- PART08_SampleExtensions — plugin ejemplo por tipo, compilable standalone
- PART09_ApiSurfaceAudit — revisión de nombres/nullability/sellado antes de 1.0
- PART10_TechnicalDocumentation
- PART11_UserDocumentation (guía del desarrollador de extensiones)
