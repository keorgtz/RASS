# AegiReports — Product Completion Program (roadmap maestro)

**Estado:** Vigente desde 2026-07-03 · **Reemplaza a:** desarrollo por Fases (1–28)
**Meta:** AegiReports **1.0.0 Stable** — cada subsistema con calidad de software
comercial de producción, sin excepciones.

---

## 1 · Cambio de metodología

Las Fases 1–28 completaron la arquitectura, el motor y la plataforma (66 proyectos,
1004 tests verdes, RC v1.0). A partir de este documento **el proyecto deja el
desarrollo por features y entra al Product Completion Program**:

- **Prohibido** implementar funcionalidad nueva salvo que un PART la declare como
  «Missing Feature» requerida para paridad comercial.
- El trabajo se organiza en **Epics de producto** independientes (no fases).
- **Nada avanza** hasta que el Epic en curso está completamente terminado.
- Cada PART de cada Epic atraviesa el mismo ciclo de 8 puertas (§3).
- La regla de terminación del repositorio (CLAUDE.md, vigente desde la Fase 28) aplica
  a TODO el programa: compilar + tests NO basta; se exige recorrido manual, MeridianUI
  de nivel comercial y aplicación en todos los hosts reales (WPF, web, Demo).

## 2 · Inventario completo del producto

### 2.1 Proyectos (65 src + 1 tests = 66)

| Área | Proyectos |
|---|---|
| **Núcleo del motor** | Abstractions, Core, Serialization, Layout, Pagination, Rendering, Transport |
| **Datos** | Data, Data.SqlServer, Data.EfCore, Expressions, QueryBuilder |
| **Composición avanzada** | Tables, Crosstab, Charts, Controls.Advanced, Components, Dashboard |
| **Salida** | Exporting, Exporting.Pdf, Exporting.Docx, Exporting.Xlsx, Printing |
| **Hosts WPF** | Wpf, Previewer, Previewer.Wpf, Previewer.Advanced, Designer, Designer.Wpf, Designer.Advanced, Designer.Wizards, Designer.Shell, Demo |
| **Hosts web/headless** | Web, Web.Canvas, Server, Designer.Web, Headless, Rendering.Skia, Platform |
| **Servidor enterprise** | Server.Hosting, Server.Queue, Server.Cluster, Storage, Operations, Deployment |
| **Plataforma comercial** | SDK, Plugins, Licensing, Licensing.Server, Licensing.Tool, Marketplace, Telemetry, Compatibility, Docs, Localization |
| **Gobernanza/Release** | Release, Upgrade, Security, CI, Governance, Benchmarks, Diagnostics, UX |
| **Muestras** | Samples (incluye Samples.Hotel embebido) |
| **Tests** | AegiReports.Tests (1004 verdes; 8 WpfPageRendererTests excluibles por entorno) |

### 2.2 Hosts reales del producto

1. **Demo WPF** (`AegiReports.Demo`) — showcase ejecutable, ciclo de autoría completo.
2. **Estudio del designer WPF** (`DesignerStudioControl`) — docking, wizards, editores.
3. **Visor profesional WPF** (`ViewerShellControl`).
4. **Query Builder WPF** (`QueryBuilderControl/Window`).
5. **Dashboard designer + preview WPF** (`DashboardDesignerControl/PreviewControl`).
6. **Servidor web** (`AegiReports.Server`, ASP.NET minimal API + visor browser).
7. **Headless/CI** (`Headless` + `Rendering.Skia`, sin WPF).
8. **CLI de licencias** (`Licensing.Tool`).

### 2.3 Superficies restantes del inventario

- **SDK público**: ControlExtension/ExporterExtension/PropertyEditor/DesignerPanel,
  IAegiPlugin, ExtensionRegistry, Dashboard Widget SDK, serializadores `.aedocx`.
- **Wizards** (12): nuevo reporte, fuente de datos, tabla, gráfica, crosstab, barcode,
  QR, subreporte, parámetro, agrupación, campo calculado, estilo.
- **Exporters** (9 formatos): PDF, DOCX, XLSX, HTML, CSV, TXT, PNG, JPEG, TIFF (+ MD
  de muestra vía SDK).
- **Plugins integrados**: BuiltInExtensions, ChartsPlugin, AdvancedControlsPlugin,
  DashboardWidgetsPlugin, SampleSdkPlugin.
- **Muestras**: 5 de framework + 6 escenarios SQL hoteleros + 7 presets de consultas +
  10 dashboards hoteleros + plantillas.
- **Documentación**: sitio generado por `Docs` (~17 páginas), ADRs 0001–0030, docs de
  fase, auditorías de la Fase 27 (8 documentos).

## 3 · Ciclo de terminación por PART (las 8 puertas)

Ningún PART se declara terminado sin pasar, EN ORDEN:

1. **Architecture Review** — contraste del diseño real contra ADRs e invariantes
   (pipeline único, core sin WPF, determinismo, offline-first, SQL parametrizado).
2. **Feature Audit** — inventario de lo que existe vs lo que DevExpress ofrece;
   clasificación: completo / gap aceptado-documentado / gap a cerrar.
3. **UX Audit** — MeridianUI comercial: tokens, tipografía, radios, motion ≤ 200 ms,
   iconografía PackIcon, es-MX, sin controles a medio estilar.
4. **Manual Validation** — checklist del PART ejecutada en la app real (los tres hosts
   cuando aplique), con capturas en `docs/screenshots/`.
5. **Bug Fixing** — todo defecto encontrado por 1–4 se corrige en el MISMO PART.
6. **Technical Documentation** — los documentos técnicos que el PART declara.
7. **User Documentation** — la documentación de usuario final que el PART declara.
8. **Final Review** — build 0/0 + suite completa verde + relectura del PART completo
   contra sus Acceptance Criteria; se registra el resultado en el PART.

## 4 · Epics del producto (26)

Cada Epic es un flujo de trabajo independiente con carpeta propia en
`docs/ProductCompletion/<Epic>/` y un `README.md` de backlog (alcance, objetivos,
dependencias, complejidad, prioridad, % de completitud y PARTs planificados).

## 5 · Matriz maestra de seguimiento

Complejidad: B=Baja, M=Media, A=Alta, MA=Muy alta. Duración estimada en sesiones de
trabajo enfocadas. El % es honesto respecto al ciclo de 8 puertas (funcionalidad ya
existente ≠ PART terminado: casi ningún subsistema tiene aún las puertas 6–8).

| # | Epic | Prioridad | Depende de | Complejidad | Duración | % | Estado |
|---|---|---|---|---|---|---|---|
| 1 | Designer | P0 | — | MA | 8–12 | 40 % | PARTs detallados (pendiente de ejecución) |
| 2 | Previewer | P0 | Designer (tema/diálogos compartidos) | A | 5–7 | 40 % | PARTs detallados (pendiente de ejecución) |
| 3 | QueryBuilder | P0 | DataSources | A | 4–6 | 45 % | PARTs detallados (pendiente de ejecución) |
| 4 | Dashboard | P0 | QueryBuilder, Charts | MA | 6–9 | 40 % | PARTs detallados (pendiente de ejecución) |
| 5 | DataSources | P0 | — | A | 4–6 | 45 % | PARTs detallados (pendiente de ejecución) |
| 6 | Expressions | P1 | — | M | 3–4 | 45 % | PARTs detallados (pendiente de ejecución) |
| 7 | Parameters | P1 | DataSources | M | 3–4 | 45 % | PARTs detallados (pendiente de ejecución) |
| 8 | Tables | P1 | — | A | 4–5 | 45 % | PARTs detallados (pendiente de ejecución) |
| 9 | Charts | P1 | — | A | 5–7 | 35 % | PARTs detallados (pendiente de ejecución) |
| 10 | Crosstabs | P1 | Tables | M | 3–4 | 40 % | PARTs detallados (pendiente de ejecución) |
| 11 | Exporting | P0 | — | A | 5–7 | 40 % | Backlog |
| 12 | Printing | P1 | Previewer | M | 3–4 | 40 % | Backlog |
| 13 | Licensing | P2 | — | M | 2–3 | 55 % | Backlog |
| 14 | SDK | P1 | — | A | 4–5 | 50 % | Backlog |
| 15 | Plugins | P2 | SDK | M | 2–3 | 50 % | Backlog |
| 16 | Server | P1 | Exporting, Headless | A | 5–7 | 35 % | Backlog |
| 17 | Web | P1 | Server | A | 5–7 | 30 % | Backlog |
| 18 | Headless | P2 | — | M | 2–3 | 50 % | Backlog |
| 19 | Deployment | P2 | Server, Packaging | M | 3–4 | 30 % | Backlog |
| 20 | Samples | P2 | Designer, Dashboard | M | 2–3 | 50 % | Backlog |
| 21 | Documentation | P1 | todos (consume) | A | 5–7 | 25 % | Backlog |
| 22 | DeveloperExperience | P2 | SDK, Documentation | M | 3–4 | 30 % | Backlog |
| 23 | Performance | P1 | — | A | 4–5 | 35 % | Backlog |
| 24 | Security | P1 | — | M | 3–4 | 45 % | Backlog |
| 25 | Packaging | P1 | Licensing | M | 3–4 | 35 % | Backlog |
| 26 | Release | P0 | TODOS | A | 3–5 | 20 % | Backlog (cierre) |

## 6 · Orden de ejecución oficial

El orden respeta impacto de negocio + dependencias:

1. **Designer** (primer Epic — máxima superficie de contacto con el usuario que paga)
2. Previewer → 3. QueryBuilder → 4. DataSources → 5. Dashboard
6. Exporting → 7. Printing
8. Tables → 9. Crosstabs → 10. Charts → 11. Expressions → 12. Parameters
13. SDK → 14. Plugins → 15. Samples
16. Server → 17. Web → 18. Headless
19. Performance → 20. Security
21. Licensing → 22. Packaging → 23. Deployment
24. Documentation → 25. DeveloperExperience
26. **Release** (siempre el último: ejecuta RELEASE_CHECKLIST y promueve a 1.0.0)

El orden puede refinarse al cerrar cada Epic, pero un Epic iniciado NO se abandona.

## 7 · Estrategia de ejecución (proceso oficial)

**Decisión del propietario (2026-07-03):** primero se DETALLAN por completo los PARTs de
TODOS los Epics (documentación), y solo después comienza la EJECUCIÓN (código) Epic por
Epic. Es decir, la fase de planeación produce el 100 % de los PARTs antes de tocar
código. Esto reemplaza la estrategia original de «solo el Epic en curso tiene PARTs».

Proceso:

1. **Este roadmap** + los 26 `README.md` de backlog se generan UNA vez.
2. Los PARTs completos de cada Epic se van generando Epic por Epic hasta cubrir los 26
   (fase de planeación). Progreso actual: Designer ✅, Previewer ✅, QueryBuilder ✅,
   Dashboard ✅, DataSources ✅, Expressions ✅, Parameters ✅, Tables ✅, Charts ✅,
   Crosstabs ✅; el resto pendiente.
3. Terminada la planeación, comienza la EJECUCIÓN en el orden de §6. Cada PART se
   implementa de forma independiente y atraviesa las 8 puertas (§3); el resultado de la
   validación manual y el Final Review se anexan AL PART.
4. Al cerrar un Epic (ya en ejecución): actualizar su % y estado en la matriz (§5),
   commit dedicado, y pasar al siguiente Epic según §6.
5. Ritual git: commits por Epic detallado (planeación) o por PART/grupo coherente
   (ejecución), con el trailer de coautoría; la suite completa corre antes de cada
   commit que toque código.

Estados de la matriz (§5): «Backlog» (solo README) → «PARTs detallados (pendiente de
ejecución)» (planeación completa) → «EN CURSO» (ejecutando PARTs) → «Terminado»
(8 puertas cerradas).

## 8 · Plantilla estándar de PART (obligatoria)

Todo PART usa EXACTAMENTE esta estructura:

```
# PARTnn — <Nombre>
1. Purpose
2. Current State
3. Comparison against DevExpress
4. Missing Features
5. UX Problems
6. Backend Problems
7. Frontend Problems
8. Technical Debt
9. Required Improvements
10. Implementation Plan
11. Automated Test Plan
12. Manual Validation Checklist
13. Technical Documentation to produce   (solo especificar, no generar)
14. User Documentation to produce        (solo especificar, no generar)
15. Acceptance Criteria
```

La checklist de validación manual (12) incluye siempre, cuando aplique: abrir/crear/
guardar/cargar/editar/eliminar/undo/redo/exportar/imprimir/cerrar/reabrir, tema claro
y oscuro, High DPI, teclado y mouse.

## 9 · Criterios de éxito del programa

- Todos los Epics cerrados con sus 8 puertas.
- Suite completa verde y build 0/0 en cada commit.
- Documentación técnica y de usuario existente para cada subsistema.
- `RELEASE_CHECKLIST` ejecutada → **AegiReports 1.0.0 Stable**.
