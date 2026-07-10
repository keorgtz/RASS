# PART08 — SqlPreview (SQL generado y diagnósticos vivos)

## 1. Purpose
El panel de SQL: `SqlQueryGenerator` produce T-SQL determinista SIEMPRE parametrizado
(`@p0…`/`@Nombre`, corchetes con escape `]]`), mostrado con resaltado, junto a los
diagnósticos vivos del `QueryValidator` (AEGIQB001–010) que se actualizan al editar.

## 2. Current State
Funcional (Fase 25). SQL resaltado, diagnósticos vivos. Generador anti-inyección:
IN expande params, BETWEEN dos, parámetros nombrados; determinista.

## 3. Comparison against DevExpress
DevExpress muestra el SQL resultante (a veces oculto). AegiReports lo expone SIEMPRE con
resaltado y diagnósticos vivos — un diferencial de transparencia. Auditar copia del SQL,
copia de parámetros, y que el SQL sea legible (indentado).

## 4. Missing Features
- Copiar SQL y copiar la lista de parámetros con sus valores de prueba.
- SQL indentado/formateado legible (no una sola línea).
- Panel de diagnósticos navegable: clic en un diagnóstico enfoca el elemento origen.

## 5. UX Problems
- Distinguir warning de error; contar diagnósticos; el SQL debe reflejar el estado ACTUAL
  (aunque haya errores, mostrar el mejor SQL posible o el motivo).
- Resaltado legible en tema oscuro.

## 6. Backend Problems
- Confirmar que NINGÚN camino concatena valores (todo parametrizado) — auditoría de
  seguridad (Epic Security PART04).
- El generador debe ser estable ante reordenamientos (determinismo byte a byte).

## 7. Frontend Problems
- Resaltado de T-SQL correcto (palabras clave, cadenas, parámetros, corchetes).

## 8. Technical Debt
- El validador y el generador comparten el `QueryModel`; mantener una sola fuente de
  verdad de nombres/aliases.

## 9. Required Improvements
1. SQL indentado + copiar SQL/parámetros.
2. Diagnósticos navegables (clic → foco al origen) con severidad y conteo.
3. Auditoría de que todo es parametrizado (test anti-concatenación).

## 10. Implementation Plan
1) Generador: opción de formato indentado (determinista) + tests byte a byte.
2) WPF: copiar, resaltado oscuro, panel de diagnósticos navegable.
3) Recorrido manual introduciendo cada tipo de error (AEGIQB001–010).

## 11. Automated Test Plan
- SQL determinista para consultas conocidas (byte a byte); parametrización de todos los
  operadores; los 10 códigos de validación se disparan con casos construidos; ningún
  literal de usuario aparece concatenado.

## 12. Manual Validation Checklist
- [ ] Editar la consulta actualiza el SQL en vivo, indentado y resaltado
- [ ] Copiar SQL y copiar parámetros con valores
- [ ] Introducir cada error (join faltante, alias duplicado, columna desconocida, etc.)
      → diagnóstico con severidad; clic enfoca el origen
- [ ] Valores de filtro nunca aparecen concatenados en el SQL (siempre @param)
- [ ] Resaltado legible en tema oscuro
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`QueryBuilder/Architecture.md` (generador/validador), `QueryBuilder/Security.md`
(parametrización) — coordina con Epic Security.

## 14. User Documentation to produce
«Ver el SQL generado» (transparencia, copiar, diagnósticos).

## 15. Acceptance Criteria
- SQL determinista, indentado, siempre parametrizado; diagnósticos navegables; auditoría
  anti-concatenación pasada; checklist §12 con capturas; suite verde.
