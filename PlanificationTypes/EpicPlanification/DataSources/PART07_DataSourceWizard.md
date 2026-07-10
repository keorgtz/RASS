# PART07 — DataSourceWizard (asistente de fuente de datos)

## 1. Purpose
El asistente de fuente de datos: `DataSourceWizardModel` (desacoplado por delegados
`testConnection`/`previewSchema`), los pasos (SelectProvider → Configure → TestAndPreview
→ Done), `DataProviderKind` (SqlServer/EF/Json/Object) y las páginas del wizard en el
Shell, con la MISMA UX para los 4 proveedores.

## 2. Current State
Funcional (Fases 22/28). 4 proveedores con la misma UX; Fase 28 agregó Object y corrigió
el double-add del TextBlock de estado en «Prueba y esquema». Prueba de conexión y
descubrimiento de esquema por delegados (el host cablea los proveedores reales).

## 3. Comparison against DevExpress
DevExpress Data Source Wizard: elegir tipo, configurar, seleccionar consulta/tablas y
previsualizar. AegiReports equivalente; auditar mensajes de validación específicos por
paso, preview del esquema con tipos, y navegación por pasos visitados.

## 4. Missing Features
- Mensajes de validación específicos por paso (qué falta), no el genérico «Complete la
  configuración del paso».
- Preview del esquema descubierto con tipos e iconos (no solo lista de nombres).
- Navegación por clic a un paso ya visitado.
- Recordar el último proveedor/configuración usados.

## 5. UX Problems
- Prueba de conexión con progreso terminal; resultado (éxito/error) claro y accionable.
- Cada proveedor con su página coherente (SQL: conexión+comando+builder; JSON: ruta+
  colección; EF: consulta; Object: colección).

## 6. Backend Problems
- El modelo es puro y testeable con fakes; confirmar que `BuildDefinition` produce una
  `DataSourceDefinition` válida por proveedor.

## 7. Frontend Problems
- Focus inicial por paso; scroll correcto con muchos campos; el fix del double-add ya
  aplicado (formalizar con test).

## 8. Technical Debt
- Reusar editores/patrones del wizard general (Designer PART12) para no duplicar.

## 9. Required Improvements
1. Mensajes de validación específicos + navegación por pasos visitados.
2. Preview de esquema con tipos/iconos.
3. Recordar proveedor/configuración; test del double-add.

## 10. Implementation Plan
1) Modelo: mensajes por paso (StepError), preview enriquecido + tests.
2) Shell: navegación por chips, preview con tipos, memoria de proveedor.
3) Recorrido manual de los 4 proveedores end-to-end.

## 11. Automated Test Plan
- Navegación (adelante bloqueado sin validez, atrás siempre, salto a visitado);
  `BuildDefinition` por proveedor; testConnection/previewSchema vía fakes; el estado no
  se re-agrega dos veces (regresión del fix Fase 28).

## 12. Manual Validation Checklist
- [ ] Los 4 proveedores: SqlServer, EF, JSON, Object con su página propia
- [ ] Paso incompleto → mensaje ESPECÍFICO de qué falta
- [ ] Probar conexión (éxito/error) con progreso terminal
- [ ] Descubrir esquema → preview con tipos/iconos
- [ ] Navegar atrás y a un paso visitado por clic
- [ ] Cancelar no deja efectos; recordar último proveedor
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Solo teclado · [ ] Mouse

## 13. Technical Documentation to produce
`DataSources/Architecture.md` (wizard, delegados), `DataSources/Integration.md`
(cablear proveedores en el host).

## 14. User Documentation to produce
«Conectar una fuente de datos» (asistente, los 4 proveedores).

## 15. Acceptance Criteria
- Mensajes específicos, preview con tipos, navegación por pasos; los 4 proveedores con
  UX pareja; checklist §12 con capturas; suite verde.
