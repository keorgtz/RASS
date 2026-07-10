# PART05 — FieldExplorer (explorador de campos del esquema)

## 1. Purpose
El panel de campos: `FieldExplorerModel` (árbol desde `DataSchema` con búsqueda,
favoritos y recientes; `FieldTreeBuilder`) y el arrastre de un campo a la superficie
para crear un TextControl enlazado (`[Campo]`) con formato inferido por tipo.

## 2. Current State
Funcional (Fases 22/23). El estudio recibe el esquema vía `StudioAuthoringContext`
(wizard o escenario SQL). Con contexto vacío, el panel queda sin contenido.

## 3. Comparison against DevExpress
DevExpress muestra fuente de datos → tablas → campos con tipos e iconos, permite
crear campos calculados desde el panel y arrastrar creando el control apropiado por
tipo (checkbox para bool, etc.). AegiReports crea TextControl siempre y el campo
calculado vive en un wizard aparte.

## 4. Missing Features
- Control apropiado por tipo al arrastrar (bool→checkbox visual? decidir: TextControl
  formateado es aceptable si se documenta).
- Crear/editar campo calculado desde el menú contextual del panel.
- Iconos por tipo de dato (número/fecha/texto/bool).

## 5. UX Problems
- Estado vacío (sin fuente) debe ofrecer acción: «Conectar fuente de datos…».
- Rutas anidadas largas truncadas sin tooltip.

## 6. Backend Problems
- Ninguno conocido; el modelo es puro.

## 7. Frontend Problems
- El arrastre no muestra ghost con el nombre del campo.

## 8. Technical Debt
- Ninguna crítica.

## 9. Required Improvements
1. Iconos por tipo + tooltip con ruta completa y tipo.
2. Estado vacío accionable (abre wizard de fuente).
3. Menú contextual: «Nuevo campo calculado…» (reusa wizard existente) e «Insertar
   como…» (etiqueta+campo).
4. Ghost de arrastre con formato inferido visible.

## 10. Implementation Plan
1) Modelo: tipo→icono/formato en tabla pura; entrada de calculados en el árbol.
2) WPF: tooltips, estado vacío, menú contextual, ghost.
3) Recorrido manual con esquema hotelero real.

## 11. Automated Test Plan
- Árbol desde esquemas anidados (profundidad, orden estable); búsqueda con acentos;
  formato inferido por tipo (fecha/moneda/entero); favoritos/recientes round-trip.

## 12. Manual Validation Checklist
- [ ] Abrir estudio desde escenario SQL → campos reales listados con iconos
- [ ] Arrastrar campo → TextControl con binding y formato correcto
- [ ] Buscar campo, favorito, reciente
- [ ] Sin fuente → estado vacío con botón que abre el wizard
- [ ] Nuevo campo calculado desde el panel → aparece y se puede arrastrar
- [ ] Undo tras insertar
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Designer/Architecture.md` (FieldExplorer/AuthoringContext), `Designer/API.md`
(inyección de esquema por el host).

## 14. User Documentation to produce
«Enlazar datos a un reporte» (explorador de campos, campos calculados).

## 15. Acceptance Criteria
- Arrastre crea binding correcto con formato por tipo; estado vacío accionable;
  checklist §12 con capturas; suite verde.
