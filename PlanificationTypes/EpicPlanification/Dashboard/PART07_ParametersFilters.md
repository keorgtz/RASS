# PART07 — ParametersFilters (parámetros globales y filtros)

## 1. Purpose
Los parámetros globales del dashboard y los 6 tipos de filtro (Date/Lookup/Range/Text/
Boolean/Hierarchy) que el `DashboardDataEngine` aplica al snapshot, incluida la barra de
filtros con jerarquía en cascada (lookups poblados del snapshot sin filtros).

## 2. Current State
Funcional (Fase 26). Parámetros globales + 6 filtros con la semántica del intérprete
(lookup entre strings case-SENSITIVE); la barra de filtros del preview puebla los
lookups del snapshot sin filtros y aplica cascada.

## 3. Comparison against DevExpress
DevExpress: filtros de dashboard (item filter + master filter) y parámetros con editores
por tipo. AegiReports: 6 filtros + parámetros globales; auditar el filtro rango de
fechas con presets (este mes/trimestre), multi-valor y el diseño de la barra de filtros.

## 4. Missing Features
- Presets de rango de fecha (hoy/semana/mes/trimestre/año, personalizado).
- Filtros multi-valor (lookup con selección múltiple).
- Diseñar qué filtros aparecen en la barra y su orden desde el diseñador.
- Estado «filtro activo» claramente visible (chips con valor y limpiar).

## 5. UX Problems
- Cascada: al cambiar un filtro padre, los hijos se recargan mostrando estado.
- Lookup case-SENSITIVE puede confundir (Directo vs directo) — documentar/normalizar.

## 6. Backend Problems
- Confirmar que la cascada puebla lookups del snapshot correcto y que el orden de
  aplicación de filtros es determinista.

## 7. Frontend Problems
- Editores de filtro por tipo consistentes; chips de filtro activo con limpiar.

## 8. Technical Debt
- El case-sensitive de lookup es coherente con el intérprete (QueryBuilder PART10);
  decidir si el dashboard normaliza o documenta.

## 9. Required Improvements
1. Presets de rango de fecha + multi-valor.
2. Diseño de la barra de filtros (cuáles/orden) + chips con limpiar.
3. Normalización o documentación del casing de lookup.

## 10. Implementation Plan
1) Modelo: presets de fecha, multi-valor, orden de barra + tests de cascada.
2) WPF: editores por tipo, chips, diseño de barra.
3) Recorrido manual con el dashboard de Reservas (@Channel, fechas, cascada).

## 11. Automated Test Plan
- Los 6 filtros aplican al snapshot; cascada puebla lookups; multi-valor (IN); presets
  de fecha calculan el rango; orden de aplicación determinista.

## 12. Manual Validation Checklist
- [ ] Aplicar cada tipo de filtro (Date/Lookup/Range/Text/Boolean/Hierarchy)
- [ ] Rango de fecha con presets (este mes) y personalizado
- [ ] Lookup multi-valor filtra por varios valores
- [ ] Cascada: cambiar padre recarga hijos con estado de carga
- [ ] Chips de filtro activo con limpiar; parámetro global recompone
- [ ] Casing de lookup: comportamiento documentado/esperado
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Dashboard/Architecture.md` (parámetros/filtros, cascada), remite a `Parameters/*`.

## 14. User Documentation to produce
«Parámetros y filtros del dashboard».

## 15. Acceptance Criteria
- 6 filtros + presets de fecha + multi-valor + cascada correctos; barra diseñable;
  casing documentado; checklist §12 con capturas; suite verde.
