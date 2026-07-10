# Epic: Documentation — backlog

**Prioridad:** P1 · **Complejidad:** Alta · **Completitud (8 puertas):** 25 % ·
**Estado:** Backlog

## Alcance

`AegiReports.Docs` (MarkdownRenderer, DocSiteGenerator, AegiDocsContent ~17 páginas,
API explorer por reflexión) + TODA la documentación técnica y de usuario que los demás
Epics declaran en sus PARTs (este Epic la integra, indexa y publica como sitio).

## Objetivos

1. Sitio de documentación completo: getting started, tutoriales por subsistema,
   referencia de API navegable, guías de operación, FAQ, troubleshooting.
2. La documentación declarada por cada Epic (puertas 6–7) se integra aquí con
   navegación y búsqueda coherentes.
3. Localización: base es-MX + evaluación de en-US (gap G10) para alcance 1.0.

## Dependencias

- TODOS los Epics (consume sus documentos). Se ejecuta en dos oleadas: infraestructura
  temprano, integración al final (antes de Release).

## PARTs planificados (10)

- PART01_DocSiteInfra — generador, navegación, búsqueda, tema MeridianUI
- PART02_GettingStarted — instalación, primer reporte, primer dashboard
- PART03_UserGuides — integración de la doc de usuario de todos los Epics
- PART04_DeveloperGuides — integración de la doc técnica + SDK
- PART05_ApiReference — explorador de API, ejemplos runtime verificados
- PART06_OperationsGuides — server, despliegue, licencias
- PART07_FaqTroubleshooting — consolidado transversal
- PART08_LocalizationEnUs — decisión y ejecución del alcance en-US (G10)
- PART09_TechnicalDocumentation (del propio generador)
- PART10_FinalAudit — revisión editorial completa del sitio
