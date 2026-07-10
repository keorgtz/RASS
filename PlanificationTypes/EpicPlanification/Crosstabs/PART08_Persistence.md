# PART08 — Persistence (persistencia del crosstab)

## 1. Purpose
Definir y cerrar la persistencia del crosstab: hoy en un **reporte** solo se guarda la
**tabla horneada** (`.aedocx` vía `TableControlXmlSerializer`), no la **definición** del
crosstab; en el **dashboard** sí se persiste `CrosstabDashboardWidget` (campos, agregado,
totales, formato, `FormatRules`) vía `AedashboardSerializer`. Resolver la asimetría según la
decisión de PART01 (vivo vs horneado).

## 2. Current State
- **Reporte:** el crosstab se construye por código a `TableControl` y se persiste como tabla
  aplanada — **la definición del pivote se pierde** (no se puede re-editar como crosstab).
- **Dashboard:** `AedashboardSerializer` guarda `RowField`/`ColumnField`/`ValueField`/
  `Aggregate`/`RowTotals`/`ColumnTotals`/`Format`/`FormatRules` — round-trip completo del
  widget.

## 3. Comparison against DevExpress
En DevExpress el pivote se guarda como control con su definición y se re-edita. AegiReports lo
logra en dashboard pero **no en reporte** (tabla horneada, no re-editable como crosstab).

## 4. Missing Features
- Persistencia de la **definición** del crosstab en el reporte (si PART01 introduce
  `CrosstabControl` vivo): serializador `.aedocx` del control con campos/agregado/opciones/
  formato condicional.
- Migración si el esquema del widget/control cambia (nuevos campos multi-dimensión).
- Coherencia del formato condicional persistido entre ambos lados (PART05).

## 5. UX Problems
- Un usuario que guarda un reporte con crosstab y lo reabre no puede re-editarlo como pivote
  (solo como tabla) — pérdida de intención.

## 6. Backend Problems
- Si entra `CrosstabControl`, añadir su serializador y registro en todos los hosts (como el
  de Table/Chart en Plugins/Charts) + migración.
- Mantener el round-trip del widget del dashboard sin regresión.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
- **Reporte guarda tabla horneada, no la definición**: consecuencia directa de «no hay
  CrosstabControl» (PART01). Cerrar juntas o documentar el límite.

## 9. Required Improvements
1. (Si vivo) serializador `.aedocx` del `CrosstabControl` con round-trip completo.
2. Migración de esquema; registro del serializador en todos los hosts.
3. Verificar round-trip del widget del dashboard (regresión).

## 10. Implementation Plan
1) Según PART01: si vivo, serializar la definición del control; si horneado, documentar el
   límite en `Limitations.md`.
2) Migración + registro en Demo/Server/Headless.
3) Recorrido de guardar/reabrir en reporte y dashboard.

## 11. Automated Test Plan
- (Si control) round-trip `.aedocx` del crosstab: definición idéntica tras cargar.
- Round-trip del `CrosstabDashboardWidget` (campos/agregado/formato/reglas) sin pérdida.
- Migración de versión previa sin error.

## 12. Manual Validation Checklist
- [ ] Guardar reporte con crosstab y reabrir: re-editable como crosstab (si vivo) o límite
      claro
- [ ] Guardar dashboard con crosstab + reglas y reabrir: idéntico
- [ ] Formato condicional persiste coherente en ambos lados
- [ ] Persistencia igual en Demo, Server y Headless

## 13. Technical Documentation to produce
`Crosstabs/Architecture.md` (persistencia reporte vs dashboard) y `Limitations.md` — PART09.

## 14. User Documentation to produce
Nota en «Guardar y abrir» sobre re-edición del crosstab — PART10.

## 15. Acceptance Criteria
- Definición del crosstab persistida (o límite documentado); widget del dashboard sin
  regresión; migración; §12 con capturas; suite verde.
