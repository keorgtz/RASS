# PART16 — WidgetSdk (SDK de widgets de terceros)

## 1. Purpose
El SDK de widgets: `IDashboardWidgetFactory` + `DashboardWidgetRegistry` (duplicados
lanzan; los 15 estándar por el MISMO camino) + `DashboardWidgetsPlugin` (registra gauge/
progreso/KPI en el `ExtensionRegistry`) — el contrato para que un tercero cree widgets
que se comportan como los integrados.

## 2. Current State
Funcional (Fase 26). Registry con duplicados que lanzan; los widgets estándar y los de
plugin siguen el mismo registro; materialización vía el contexto del widget.

## 3. Comparison against DevExpress
DevExpress tiene un modelo de extensión de dashboard items menos abierto. El SDK de
widgets es un diferencial de AegiReports; auditar la completitud del contrato
(materialización, hit-áreas, editor, serialización, icono) y la calidad de un ejemplo de
tercero.

## 4. Missing Features
- Contrato completo verificado: un widget de tercero puede aportar materialización +
  editor + hit-áreas + serialización `.aedashboard` + icono de toolbox.
- Un widget de EJEMPLO canónico de tercero (compilable standalone) que ejercite todo el
  contrato.
- Versionado/compatibilidad de widgets de terceros (MinimumSdkVersion).

## 5. UX Problems
- El widget de tercero debe verse y comportarse como uno integrado (tema, editor,
  interacciones).

## 6. Backend Problems
- Confirmar que el registro es la ÚNICA vía (los 15 estándar incluidos) y que un widget
  de tercero participa en interacciones/filtros como uno nativo.

## 7. Frontend Problems
- El editor del widget de tercero se abre desde el mismo flujo que los integrados.

## 8. Technical Debt
- Documentar el contrato completo es la mayor tarea (peso documental).

## 9. Required Improvements
1. Verificar/completar el contrato de widget (las 5-6 capacidades) con un ejemplo.
2. Widget de ejemplo canónico compilable standalone.
3. Versionado de widgets de terceros.

## 10. Implementation Plan
1) Auditar el contrato `IDashboardWidgetFactory` (capacidades faltantes).
2) Escribir un widget de ejemplo de tercero que ejercite todo.
3) Recorrido manual: cargar el plugin de ejemplo, usar el widget end-to-end.

## 11. Automated Test Plan
- Registry: duplicados lanzan; estándar y terceros por el mismo camino; el widget de
  ejemplo materializa, se edita, serializa y participa en interacciones.

## 12. Manual Validation Checklist
- [ ] Cargar un plugin con un widget de tercero → aparece en el toolbox con icono
- [ ] Insertarlo, editarlo (editor propio), bindear datos
- [ ] Participa en cross-filter/drill como uno nativo
- [ ] Guardar/reabrir `.aedashboard` conserva el widget
- [ ] Versión incompatible del widget → diagnóstico claro
- [ ] Tema claro/oscuro (el widget respeta el tema) · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Dashboard/API.md` (contrato de widget), `Dashboard/Examples.md` (widget de tercero
paso a paso) — coordina con Epic SDK.

## 14. User Documentation to produce
N/A directa (es doc de desarrollador; va en la guía del SDK).

## 15. Acceptance Criteria
- Contrato completo verificado con un widget de ejemplo end-to-end; versionado;
  paridad estándar↔terceros; checklist §12 con capturas; suite verde.
