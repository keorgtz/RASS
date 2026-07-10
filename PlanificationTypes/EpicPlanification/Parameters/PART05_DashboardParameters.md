# PART05 — DashboardParameters (parámetros globales del dashboard)

## 1. Purpose
Los parámetros globales del dashboard y su relación con los 6 filtros: los parámetros
alimentan el `DashboardDataEngine` (snapshot), y los lookups de la barra de filtros se
pueblan del snapshot SIN filtros; la coherencia con el modelo de parámetro de PART01.

## 2. Current State
Funcional (Fase 26). Parámetros globales + 6 filtros (Date/Lookup/Range/Text/Boolean/
Hierarchy); la barra de filtros del preview puebla lookups del snapshot sin filtros y
aplica cascada. Comparte alcance con Dashboard PART07 (este lidera el modelo de
parámetro; aquél la UI de filtros).

## 3. Comparison against DevExpress
DevExpress separa parámetros de dashboard de los filtros de item/master. AegiReports
tiene ambos; auditar la coherencia con `ReportParameterDefinition` (mismo modelo mental),
el multi-valor y los presets de fecha.

## 4. Missing Features
- Alinear los parámetros del dashboard con `ReportParameterDefinition` (mismo modelo,
  tipos, validaciones) — hoy conviven parámetros globales + filtros con su propia forma.
- Multi-valor y presets de fecha (coordinar PART06 y Dashboard PART07).
- Parámetro global que fluye a un ReportViewer widget incrustado.

## 5. UX Problems
- Distinguir parámetro global (afecta todo) de filtro (afecta objetivos) con claridad.
- Cascada de filtros con estado; casing de lookup documentado.

## 6. Backend Problems
- El snapshot con parámetros + filtros es determinista; solo el último publica.
- Propagar el parámetro global al reporte incrustado (Dashboard PART14).

## 7. Frontend Problems
N/A (se refleja en Dashboard PART07/PART10).

## 8. Technical Debt
- Dos formas de «entrada» (parámetro global vs filtro) — documentar cuándo usar cada una.

## 9. Required Improvements
1. Alinear parámetros del dashboard con el modelo de PART01.
2. Multi-valor + presets de fecha (con PART06).
3. Propagación del parámetro global al ReportViewer incrustado.

## 10. Implementation Plan
1) Modelo: reuso de `ReportParameterDefinition` en el dashboard; propagación al widget.
2) Coordinar con Dashboard PART07 (UI) y PART06 (multi-valor/rangos).
3) Recorrido manual con el dashboard de Reservas (@Channel + fechas + cascada).

## 11. Automated Test Plan
- Parámetro global + filtros producen el snapshot esperado; multi-valor; propagación al
  reporte incrustado; cascada puebla del snapshot sin filtros; solo la última publica.

## 12. Manual Validation Checklist
- [ ] Parámetro global recompone todos los widgets afectados
- [ ] Filtro afecta solo a sus objetivos; distinción clara con el global
- [ ] Multi-valor y presets de fecha (si en alcance)
- [ ] Cascada de filtros con estado; casing documentado
- [ ] Parámetro global fluye al ReportViewer incrustado
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Parameters/Architecture.md` (parámetros del dashboard), remite a `Dashboard/PART07`.

## 14. User Documentation to produce
Se integra en «Parámetros y filtros del dashboard» del Epic Dashboard.

## 15. Acceptance Criteria
- Parámetros del dashboard alineados con el modelo común; multi-valor/presets; propagación
  al widget incrustado; checklist §12 con capturas; suite verde.
