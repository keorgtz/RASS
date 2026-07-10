# Epic: Designer — backlog

**Prioridad:** P0 (primer Epic del programa) · **Complejidad:** Muy alta ·
**Completitud (8 puertas):** 40 % · **Estado:** PARTs detallados (pendiente de ejecución)

## Alcance

Todo el estudio de diseño de reportes WPF: `Designer` (modelos puros: DesignSession,
comandos undoables, SnapEngine, interacciones), `Designer.Wpf` (DesignSurfaceControl),
`Designer.Advanced` (reglas, smart guides, alineación, docking, property grid
buscable), `Designer.Wizards` (12 modelos de asistentes), `Designer.Shell`
(DesignerStudioControl: command bar, docking real, paneles, editores, tema Meridian,
MeridianDialog, MeridianControls.xaml) y su integración en el Demo. NO incluye el
visor (Epic Previewer), el query builder (Epic QueryBuilder) ni el dashboard designer
(Epic Dashboard), aunque comparten el tema y los diálogos de este Epic.

## Objetivos

1. Paridad práctica con el Report Designer de DevExpress para el flujo de un autor de
   reportes profesional (sin código).
2. Cero controles default, cero fallos mudos, experiencia de error uniforme.
3. Validación manual completa (checklists por PART) en Demo + estudio.
4. Documentación técnica y de usuario del designer completa.

## Dependencias

- Ninguna entrante (es el primer Epic). Salientes: Previewer/QueryBuilder/Dashboard
  reutilizan `Theme/Meridian*`; Samples y Documentation consumen sus resultados.

## Complejidad y prioridad

- Muy alta: es la superficie de UI más grande del producto (docking, superficie de
  diseño, 8 paneles, 12 wizards, 3 editores).
- P0: máximo impacto de negocio — es lo primero que evalúa un cliente.

## PARTs planificados (22)

- PART01_StudioShell — ventana/control raíz del estudio, ciclo de vida, layout
- PART02_CommandBar — menús, QAT, paleta de comandos, búsqueda difusa
- PART03_Docking — DockLayout/DesignerWorkspace, auto-hide, flotantes, persistencia
- PART04_Toolbox — catálogo de controles, búsqueda, favoritos, drag & drop
- PART05_FieldExplorer — árbol de campos del esquema, arrastre a superficie
- PART06_ReportExplorer — árbol del documento, renombrar, reordenar, selección
- PART07_PropertyGrid — grid buscable, editores por tipo, ƒx, validación
- PART08_DesignSurface — página, reglas, grid, guías inteligentes, snap, cursores
- PART09_SelectionOperations — multi-selección, alinear/distribuir/z-order/resize
- PART10_Bands — gestión de bandas (alta/baja/reorden/alturas)
- PART11_UndoRedo — historial de comandos, coalescencia, límites
- PART12_Wizards — los 12 asistentes y su ventana común
- PART13_ExpressionEditor — editor con resaltado, autocompletado, evaluación real
- PART14_ConditionalFormatting — reglas, aplicador, persistencia
- PART15_StyleEditor — catálogo de estilos, herencia, rename/delete seguros
- PART16_LivePreview — vista previa embebida con cancelación cooperativa
- PART17_DocumentPersistence — guardar/abrir .aedocx desde el estudio, recientes
- PART18_KeyboardAccessibility — atajos, orden de foco, accesibilidad
- PART19_Theming — claro/oscuro, High DPI, MeridianControls en todo el estudio
- PART20_Performance — documentos grandes, latencia de interacción, memoria
- PART21_TechnicalDocumentation — generación de la doc técnica declarada
- PART22_UserDocumentation — generación de la doc de usuario declarada
