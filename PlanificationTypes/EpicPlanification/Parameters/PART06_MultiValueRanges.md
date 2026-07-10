# PART06 — MultiValueRanges (multi-valor y rangos de fecha)

## 1. Purpose
Decidir e implementar para 1.0 el soporte de parámetros MULTI-VALOR (selección múltiple
para condiciones `IN`) y RANGO DE FECHAS (desde/hasta con presets), transversal a
reporte, consulta, visor y dashboard.

## 2. Current State
Los tipos base existen (Lookup, Date); NO hay un tipo multi-valor nativo ni un rango de
fecha con presets. Las consultas soportan `IN` (expande parámetros) pero el parámetro
de reporte no expone multi-selección en el panel.

## 3. Comparison against DevExpress
DevExpress: parámetros multi-valor (checkbox list) y rango de fechas con presets
integrados — de uso muy común en reportes de negocio. Es un gap real de producto.

## 4. Missing Features
- Tipo/atributo multi-valor en `ReportParameterDefinition` + editor de selección múltiple.
- Rango de fecha (desde/hasta) como parámetro con presets (hoy/semana/mes/trimestre/año/
  personalizado).
- Traducción de multi-valor a `IN` parametrizado y de rango a `BETWEEN`.

## 5. UX Problems
- Editor multi-valor: checkbox list con «seleccionar todo/ninguno» y búsqueda.
- Rango de fecha: dos calendarios + presets; validación desde ≤ hasta.

## 6. Backend Problems
- Multi-valor viaja a `IN` (expande a `@p0,@p1,…` — ya soportado en el generador);
  rango a `BETWEEN` (dos parámetros). Cache key determinista con colecciones.

## 7. Frontend Problems
- Consistencia del editor entre visor, wizard y dashboard.

## 8. Technical Debt
- Impacta PART01 (modelo), PART04 (visor), PART05 (dashboard) y QueryBuilder PART06 —
  este PART centraliza la decisión y el modelo.

## 9. Required Improvements
1. Multi-valor nativo + editor de selección múltiple.
2. Rango de fecha con presets + validación desde/hasta.
3. Traducción a IN/BETWEEN; cache key con colecciones/rangos.

## 10. Implementation Plan
1) Architecture Review: alcance 1.0 (multi-valor + rango) confirmado.
2) Modelo: multi-valor y rango + traducción SQL + cache key + tests.
3) Editores en visor/wizard/dashboard; recorrido manual.

## 11. Automated Test Plan
- Multi-valor → `IN` parametrizado con N valores; rango → `BETWEEN`; validación desde≤
  hasta; presets calculan el rango; cache key determinista con colecciones/rangos.

## 12. Manual Validation Checklist
- [ ] Parámetro multi-valor: seleccionar varios → filtra por `IN`
- [ ] «Seleccionar todo/ninguno» y búsqueda en el editor
- [ ] Rango de fecha con presets (este mes) y personalizado; desde≤hasta validado
- [ ] Multi-valor y rango funcionan en visor, wizard y dashboard
- [ ] Cambiar valores recompone (SQL/intérprete)
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Parameters/Architecture.md` (multi-valor, rangos, traducción SQL).

## 14. User Documentation to produce
«Parámetros multi-valor y de rango de fechas».

## 15. Acceptance Criteria
- Multi-valor y rango de fecha operativos en los 3 hosts, con traducción IN/BETWEEN y
  cache key correcta; checklist §12 con capturas; suite verde.
