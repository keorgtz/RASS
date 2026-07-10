# PART02 — LookupsCascade (lookups y cascada)

## 1. Purpose
Los lookups del parámetro (`LookupItem` valor/etiqueta) estáticos o dinámicos, y la
cascada (`DependsOnParameter`): al cambiar un parámetro padre, los hijos recargan sus
opciones filtradas por el valor del padre.

## 2. Current State
Funcional (Fase 22/24). Lookups con opciones (estáticas en el Demo: Directo/OTA/
Corporativo) y cascada con auto-refresh; el visor puebla y recarga en cascada.

## 3. Comparison against DevExpress
DevExpress: look-up estático (lista) o dinámico (por consulta), con cascada por
parámetros dependientes. AegiReports cubre estático + cascada; auditar el lookup
DINÁMICO poblado por una consulta y el comportamiento cuando el padre no tiene valor.

## 4. Missing Features
- Lookup dinámico poblado por una consulta/fuente (no solo lista estática).
- Estado del hijo cuando el padre está vacío (deshabilitado/vacío con mensaje).
- Cache de opciones de lookup para no re-consultar en cada cambio menor.

## 5. UX Problems
- La cascada debe mostrar estado de carga del hijo al cambiar el padre.
- Lookup con muchas opciones: búsqueda dentro del selector.

## 6. Backend Problems
- Poblar lookup dinámico ejecuta una consulta parametrizada por el valor del padre;
  cancelación de recargas superadas (solo la última puebla).
- Casing de comparación coherente con el resto (QueryBuilder/Expressions).

## 7. Frontend Problems
N/A (se refleja en visor/dashboard/wizard).

## 8. Technical Debt
- Reusar el ejecutor del query builder para lookups dinámicos (no motor nuevo).

## 9. Required Improvements
1. Lookup dinámico por consulta + cache de opciones.
2. Estado del hijo con padre vacío; búsqueda en el selector.
3. Cancelación de recargas; solo la última puebla.

## 10. Implementation Plan
1) Modelo: lookup dinámico (delegado que devuelve opciones por valor de padre) + cache.
2) Cascada con estado de carga y cancelación + tests.
3) Recorrido manual: @Canal (estático) + un lookup dinámico dependiente.

## 11. Automated Test Plan
- Cascada (padre→hijo recarga con el filtro correcto); lookup dinámico ejecuta consulta;
  padre vacío → hijo vacío/deshabilitado; cache evita re-consulta; solo la última puebla.

## 12. Manual Validation Checklist
- [ ] Lookup estático (@Canal) selecciona valor/etiqueta
- [ ] Lookup dinámico poblado por consulta según el padre
- [ ] Cambiar el padre recarga el hijo con estado de carga
- [ ] Padre vacío → hijo vacío/deshabilitado con mensaje
- [ ] Selector con búsqueda si hay muchas opciones
- [ ] Cambios rápidos del padre: solo la última recarga puebla

## 13. Technical Documentation to produce
`Parameters/Architecture.md` (lookups, cascada, dinámico), remite a `QueryBuilder/*`.

## 14. User Documentation to produce
«Listas de valores y cascada» (lookups estáticos/dinámicos, dependencias).

## 15. Acceptance Criteria
- Lookup dinámico + cascada con estado y cancelación; cache; padre vacío manejado;
  checklist §12 con capturas; suite verde.
