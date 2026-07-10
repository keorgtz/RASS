# PART01 — ParameterModel (modelo de parámetro y validación)

## 1. Purpose
El modelo de parámetro del reporte: `ReportParameterDefinition` (9 tipos:
String/Integer/Decimal/Date/Boolean/Lookup/…, con Required/Min/Max/Regex, Prompt,
DefaultValue), su validador (AEGI900–901) y su serialización, como base única para el
visor, el dashboard y el wizard.

## 2. Current State
Funcional (Fase 15/22). 9 tipos con validaciones; el SDK valida (AEGI900–901) y sustituye
`[Param.X]`; el visor construye `ReportParameterDefinition` desde el contexto. El query
builder tiene su propio `ParameterModel` mapeado por `MapParameterType`.

## 3. Comparison against DevExpress
DevExpress Parameters: tipo, valor por defecto, visible, look-up (estático/dinámico),
multi-valor, y validación. AegiReports cubre los tipos y validaciones; auditar la
UNIFICACIÓN del modelo entre reporte/consulta (dos modelos hoy), la visibilidad
(oculto/visible) y el valor nulo permitido.

## 4. Missing Features
- Unificar o mapear formalmente `ReportParameterDefinition` ↔ `ParameterModel` del query
  builder (una sola verdad conceptual, con conversión documentada).
- Visibilidad del parámetro (visible en el panel vs interno/oculto).
- «Permite nulo/vacío» explícito además de Required.

## 5. UX Problems
- Mensajes de validación por tipo accionables (rango, regex) — reusados por visor/wizard.

## 6. Backend Problems
- Serialización tipada de valores (fecha/decimal) determinista y culture-invariant en el
  almacenamiento, es-MX en la UI.

## 7. Frontend Problems
N/A (se refleja en visor/dashboard/wizard).

## 8. Technical Debt
- Dos modelos de parámetro (reporte/consulta) — este PART define el mapeo canónico.

## 9. Required Improvements
1. Mapeo canónico reporte↔consulta documentado + `MapParameterType` bidireccional.
2. Visibilidad + «permite nulo» explícitos.
3. Serialización tipada culture-invariant + validaciones accionables.

## 10. Implementation Plan
1) Modelo: visibilidad, nulo, serialización tipada, mapeo bidireccional + tests.
2) Validador: mensajes accionables por tipo/regla.
3) Recorrido conceptual + tests (se valida vía visor/wizard).

## 11. Automated Test Plan
- Los 9 tipos con Required/Min/Max/Regex; serialización round-trip tipada; mapeo
  reporte↔consulta; visibilidad; valor nulo permitido/denegado.

## 12. Manual Validation Checklist
(vía visor/wizard)
- [ ] Declarar cada tipo de parámetro con validación (rango/regex) → mensajes claros
- [ ] Valor por defecto respetado; requerido bloquea si vacío
- [ ] Parámetro oculto no aparece en el panel del visor
- [ ] Fecha/decimal serializan y muestran en es-MX correcto
- [ ] Un parámetro del query builder se expone en el visor con el tipo correcto

## 13. Technical Documentation to produce
`Parameters/Architecture.md` (modelo, tipos, validación, mapeo reporte↔consulta).

## 14. User Documentation to produce
Base de «Parámetros» (qué son, tipos, validaciones).

## 15. Acceptance Criteria
- Modelo unificado/mapeado, visibilidad y nulo, serialización tipada; validaciones
  accionables; checklist §12 con capturas; build 0/0; suite verde.
