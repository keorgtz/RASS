# Epic: Plugins — backlog

**Prioridad:** P2 · **Complejidad:** Media · **Completitud (8 puertas):** 50 % ·
**Estado:** Backlog

## Alcance

`AegiReports.Plugins` (PluginLoader con descubrimiento controlado determinista,
BuiltInExtensions), los plugins integrados (Charts, AdvancedControls,
DashboardWidgets, SampleSdk) y `Marketplace` (.aegipkg, VersionRange, PackageCatalog
con resolución topológica AEGI920/921, TemplatePackages).

## Objetivos

1. Ciclo de vida de plugin validado: descubrir → validar versión → cargar → registrar
   → convivir (duplicados lanzan) → diagnósticos de fallo aislados.
2. Marketplace utilizable: empaquetar, resolver dependencias, instalar plantillas —
   o alcance 1.0 reducido y documentado (catálogo local).
3. Los 5 plugins integrados pasan por el MISMO camino que un tercero (ya es así —
   verificarlo como contrato con test de paridad).

## Dependencias

- SDK (contrato). Alimenta: DeveloperExperience, Samples.

## PARTs planificados (8)

- PART01_PluginLoader — descubrimiento, orden determinista, aislamiento de fallos
- PART02_BuiltInParity — integrados por el mismo camino que terceros
- PART03_PackageFormat — .aegipkg, firma, reproducibilidad
- PART04_DependencyResolution — VersionRange, topología, conflictos
- PART05_TemplatePackages — plantillas instalables, catálogo
- PART06_HostIntegration — carga en Demo/estudio/server, diagnósticos visibles
- PART07_TechnicalDocumentation
- PART08_UserDocumentation
