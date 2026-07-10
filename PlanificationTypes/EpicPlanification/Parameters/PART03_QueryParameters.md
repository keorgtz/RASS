# PART03 — QueryParameters (parámetros del query builder)

## 1. Purpose
Los parámetros del query builder (`ParameterModel`: nombre, `QueryParameterType`,
TestValue, lookups, DependsOnParameter) y su tránsito al SQL SIEMPRE parametrizado y al
visor/dashboard como `ReportParameterDefinition` (vía `MapParameterType`).

## 2. Current State
Funcional (Fase 25). Los `@param` del builder generan SQL parametrizado; `MapParameterType`
convierte al modelo del visor. **Defecto corregido por test (Fase 25):** condición con
parámetro declarado sin literal no registraba valor — el TestValue viaja en el bucle
final.

## 3. Comparison against DevExpress
DevExpress integra parámetros de consulta y de reporte de forma unificada. AegiReports
tiene dos modelos con mapeo; auditar que la conversión no pierde información (lookups,
cascada, multi-valor) y que el valor de prueba vs el de runtime están bien separados.

## 4. Missing Features
- Conversión SIN pérdida `ParameterModel` → `ReportParameterDefinition` (lookups,
  cascada, multi-valor) — hoy `MapParameterType` cubre el tipo; ampliar a todo.
- Separar valor de PRUEBA (builder) del valor por DEFECTO (runtime) al exponer al visor.
- Parámetro de consulta usado en múltiples condiciones coherente.

## 5. UX Problems
- Al pasar del builder al visor, el usuario ve los mismos parámetros con prompts amigables.

## 6. Backend Problems
- Todo parámetro viaja parametrizado al SQL (auditar con Epic Security); IN expande;
  BETWEEN dos.

## 7. Frontend Problems
N/A (se refleja en builder/visor).

## 8. Technical Debt
- El mapeo reporte↔consulta es la unificación de PART01; este PART lo ejercita.

## 9. Required Improvements
1. Conversión sin pérdida (lookups/cascada/multi-valor) builder→visor.
2. Prueba vs defecto separados al exponer.
3. Coherencia de un parámetro en múltiples condiciones.

## 10. Implementation Plan
1) Ampliar `MapParameterType`/conversión para todo el metadato + tests de no-pérdida.
2) Separar prueba/defecto en la definición de fuente.
3) Recorrido manual: builder con @Canal + fecha → visor con los mismos parámetros.

## 11. Automated Test Plan
- Conversión round-trip builder↔visor preserva tipo/lookups/cascada/multi-valor;
  parámetro sin literal registra el TestValue (regresión Fase 25); IN/BETWEEN
  parametrizados.

## 12. Manual Validation Checklist
- [ ] Declarar @Canal (lookup) y @Desde/@Hasta (fecha) en el builder
- [ ] Abrir en visor: mismos parámetros con prompts amigables y lookups
- [ ] Cambiar valores re-ejecuta la consulta (SQL parametrizado)
- [ ] Cascada preservada del builder al visor
- [ ] Valor de prueba (builder) ≠ valor por defecto (visor)
- [ ] Un parámetro usado en dos condiciones se comporta coherente

## 13. Technical Documentation to produce
`Parameters/Architecture.md` (parámetros de consulta, mapeo), remite a `QueryBuilder/*`.

## 14. User Documentation to produce
Se integra en «Parámetros en las consultas» del Epic QueryBuilder + «Parámetros».

## 15. Acceptance Criteria
- Conversión builder→visor sin pérdida; prueba/defecto separados; parametrización
  auditada; checklist §12 con capturas; suite verde.
