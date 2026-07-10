# PART06 — ParametersTab (parámetros de la consulta)

## 1. Purpose
La pestaña de parámetros: `ParameterModel` (nombre, tipo `QueryParameterType`,
`TestValue`, lookups, `DependsOnParameter`) — declarar, editar y probar los parámetros
que las condiciones usan (`@Parametro`) y que luego se exponen en el visor/dashboard.

## 2. Current State
Funcional (Fase 25). Tipos, TestValue, lookups y cascada. El TestValue alimenta la
vista previa y viaja al SQL parametrizado.

## 3. Comparison against DevExpress
DevExpress: parámetros con tipo, valor por defecto, visibilidad, y look-up estático o
por consulta. AegiReports: tipos/lookup/cascada; auditar valores por defecto vs de
prueba, lookups dinámicos desde otra consulta y multi-valor.

## 4. Missing Features
- Distinción entre valor de PRUEBA (builder) y valor por DEFECTO (runtime del visor).
- Lookups dinámicos poblados por una consulta (no solo lista estática).
- Multi-valor (para IN) — coordinar con Epic Parameters.
- Prompt/etiqueta amigable del parámetro para el visor.

## 5. UX Problems
- Parámetro declarado pero no usado → aviso (AEGIQB de parámetro sin uso).
- Cascada: mostrar la dependencia visualmente (este depende de aquel).

## 6. Backend Problems
- La coherencia de tipos entre el parámetro y la columna que compara (validador de
  tipos incompatibles).

## 7. Frontend Problems
- Editor de lookup (pares valor/etiqueta) cómodo; import desde columnas.

## 8. Technical Debt
- El modelo de parámetros del builder debe alinearse con `ReportParameterDefinition`
  del visor (Epic Parameters unifica) — documentar el mapeo (ya existe `MapParameterType`).

## 9. Required Improvements
1. Valor de prueba vs por defecto; prompt amigable.
2. Lookups dinámicos por consulta + multi-valor.
3. Aviso de parámetro sin uso; dependencia de cascada visible.

## 10. Implementation Plan
1) Modelo: default vs test, prompt, lookup dinámico, multi-valor (con Epic Parameters).
2) WPF: editor de lookup, indicador de cascada, avisos.
3) Recorrido manual: @Canal como lookup, un parámetro dependiente.

## 11. Automated Test Plan
- Declarar/editar/eliminar parámetro; cascada (padre→hijo); tipo incompatible detectado;
  lookup estático/dinámico; parámetro sin uso avisado; mapeo a ReportParameterDefinition.

## 12. Manual Validation Checklist
- [ ] Declarar @Canal (lookup Directo/OTA/Corporativo) con valor de prueba
- [ ] Parámetro dependiente en cascada; el hijo recarga al cambiar el padre
- [ ] Valor de prueba alimenta la vista previa; valor por defecto se expone al visor
- [ ] Parámetro sin uso → aviso
- [ ] Tipo incompatible con la columna → diagnóstico
- [ ] Lookup dinámico poblado por consulta
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`QueryBuilder/Architecture.md` (parámetros), remite a `Parameters/*` del Epic Parameters.

## 14. User Documentation to produce
«Parámetros en las consultas» (declarar, probar, lookups).

## 15. Acceptance Criteria
- Default vs prueba, lookups dinámicos y cascada operativos; avisos de uso/tipo;
  mapeo al visor correcto; checklist §12 con capturas; suite verde.
