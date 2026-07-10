# Epic: Deployment — backlog

**Prioridad:** P2 · **Complejidad:** Media · **Completitud (8 puertas):** 30 % ·
**Estado:** Backlog

## Alcance

`Deployment` (DeploymentBundle: Dockerfile/compose/k8s deterministas,
EnvironmentValidator AEGI960, HealthProbe) más el despliegue de escritorio del
producto: instalador **MSIX** (gap G9 declarado), distribución del Demo/estudio y la
puesta en marcha del server.

## Objetivos

1. Instalador de escritorio firmado (MSIX o alternativa justificada) — gap G9.
2. Despliegue del server validado: docker compose up → visor browser funcionando,
   con guía paso a paso reproducible.
3. Bundles k8s probados en un clúster real o kind, con health probes.

## Dependencias

- Server, Packaging (artefactos NuGet/instalables). Alimenta: Release.

## PARTs planificados (9)

- PART01_DockerBundle — imagen, compose, variables, volúmenes
- PART02_KubernetesBundle — manifiestos, probes, drain
- PART03_DesktopInstaller — MSIX firmado del Demo/estudio (G9)
- PART04_EnvironmentValidation — prerequisitos, diagnóstico AEGI960
- PART05_UpgradePath — actualización en sitio, datos persistentes
- PART06_SmokeTests — despliegue → smoke suite automatizada
- PART07_TechnicalDocumentation
- PART08_UserDocumentation (guías de instalación)
- PART09_FinalAudit — despliegue limpio de punta a punta cronometrado
