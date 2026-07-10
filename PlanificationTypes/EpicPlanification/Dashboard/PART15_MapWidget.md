# PART15 — MapWidget (widget de mapa)

## 1. Purpose
Decidir el destino del widget Map, hoy SOLO arquitectura: `IMapWidgetRenderer` sin
proveedor → diagnóstico AEGIDB010 + aviso honesto en el widget. Este PART decide para
1.0: proveer un renderer mínimo o excluir formalmente el widget.

## 2. Current State
El widget Map existe como contrato (`IMapWidgetRenderer`) sin implementación; al usarse
produce AEGIDB010 y un aviso honesto en el lienzo/preview (no una caja rota).

## 3. Comparison against DevExpress
DevExpress Dashboard incluye mapas geográficos (choropleth, pins) con datos de shapes.
Es una feature grande. AegiReports debe decidir: un mapa mínimo (p. ej. choropleth por
región con shapes embebidos) vs excluir de 1.0 (los otros 14 widgets cubren el valor
central).

## 4. Missing Features
Según la decisión del Architecture Review:
- **Opción A (mínimo):** renderer choropleth con un conjunto de shapes embebido (p. ej.
  estados de México), binding región→valor, escala de color.
- **Opción B (excluir 1.0):** retirar el widget del toolbox por defecto o marcarlo
  claramente como no soportado, y documentar en `Limitations.md`.

## 5. UX Problems
- Si A: leyenda de escala, tooltip por región, selección para cross-filter.
- Si B: el toolbox no debe ofrecer un widget que solo produce un aviso.

## 6. Backend Problems
- Un renderer real debe compilar a controles del pipeline (formas/paths) de forma
  determinista, sin motor de mapas externo (coherente con «cero motores nuevos»).

## 7. Frontend Problems
- Si A: render de shapes a la escala del widget; hit-test por región.

## 8. Technical Debt
- Un contrato sin implementación es deuda; este PART la resuelve (A o B).

## 9. Required Improvements
Según la decisión:
- A: renderer choropleth mínimo + shapes embebidos + leyenda + cross-filter por región.
- B: exclusión formal, ajuste del toolbox, documentación.

## 10. Implementation Plan
1) Architecture Review: valor vs coste de un mapa mínimo → decisión A/B registrada.
2) A: shapes embebidos, renderer a paths del pipeline, binding, leyenda, hit-test.
   B: quitar/marcar el widget, documentar en Limitations.
3) Recorrido manual (si A) o verificación de que no se ofrece un widget roto (si B).

## 11. Automated Test Plan
- A: binding región→valor produce colores deterministas; hit-test por región; leyenda.
- B: el toolbox por defecto no incluye Map; usarlo (si se fuerza) da AEGIDB010 claro.

## 12. Manual Validation Checklist
(si Opción A)
- [ ] Agregar mapa, bindear región→valor → choropleth con escala de color
- [ ] Tooltip por región; leyenda; cross-filter al seleccionar región
- [ ] Export/preview del dashboard con el mapa
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse
(si Opción B)
- [ ] El toolbox no ofrece Map (o lo marca no soportado)
- [ ] `Limitations.md` documenta la exclusión con razón

## 13. Technical Documentation to produce
`Dashboard/Limitations.md` (decisión y razón), y si A `Dashboard/Architecture.md`
(renderer de mapa) + `Dashboard/API.md` (IMapWidgetRenderer de terceros).

## 14. User Documentation to produce
Si A: «Widget de mapa». Si B: nota de límite en la guía.

## 15. Acceptance Criteria
- Decisión A/B tomada y registrada; sin contrato huérfano ni widget roto ofrecido; si A,
  checklist §12 con capturas; suite verde.
