# PART11 — Persistence (.aedashboard, migraciones, determinismo)

## 1. Purpose
La persistencia del dashboard: `AedashboardSerializer` (`.aedashboard` v1, XML
determinista byte a byte con el `QueryModel` completo + valores tipados),
`AedashboardMigrationPipeline` (contrato de `.aedocx`) y guardar/abrir desde el
diseñador y el Demo.

## 2. Current State
Funcional (Fase 26). Round-trip determinista; pipeline de migración; el undo del
diseñador usa snapshots del propio serializador.

## 3. Comparison against DevExpress
DevExpress persiste el dashboard en XML propio con versión. AegiReports equivalente con
determinismo byte a byte; auditar recientes, recuperación tras crash, y el mensaje al
abrir un dashboard con widgets de plugin no cargado.

## 4. Missing Features
- Recientes de dashboards + recuperación de borrador tras cierre inesperado.
- Mensaje accionable al abrir con widgets de terceros sin el plugin cargado (qué falta).
- Exportar/importar un dashboard como plantilla.

## 5. UX Problems
- Guardar sin ruta pide ruta; con ruta guarda directo + «Guardar como».
- Feedback de éxito y de error (diálogo Meridian) al guardar/abrir.

## 6. Backend Problems
- Contrato del reader: elemento desconocido del namespace propio = documento inválido con
  diagnóstico (como `.aedocx`); verificar que aplica a `.aedashboard`.
- Migración v1→futuras sin pérdida ni excepción para versiones desconocidas.

## 7. Frontend Problems
- Diálogos de archivo del host; documentar el contrato para hosts no-Demo.

## 8. Technical Debt
- Recientes/autosave son estado del host; ubicar en la capa reutilizable de sesión.

## 9. Required Improvements
1. Recientes + autosave/recuperación de dashboards.
2. Mensaje de plugin de widget faltante; versión desconocida → diagnóstico.
3. Exportar/importar plantilla de dashboard.

## 10. Implementation Plan
1) Host: recientes + autosave de dashboards; reader mapea widget desconocido → plugin.
2) Serializador: verificar contrato de versión y de elemento desconocido + tests.
3) Recorrido manual (guardar/abrir con widgets estándar y de plugin; recuperación).

## 11. Automated Test Plan
- Round-trip byte a byte con todos los widgets (incl. gauge/progreso/KPI de plugin);
  versión desconocida → diagnóstico; abrir sin plugin → mensaje; recientes round-trip.

## 12. Manual Validation Checklist
- [ ] Guardar nuevo (pide ruta), Guardar (usa ruta), Guardar como
- [ ] Guardar dashboard con KPI/gauge/chart/crosstab → reabrir idéntico
- [ ] Abrir `.aedashboard` con widget de plugin SIN cargar el plugin → mensaje accionable
- [ ] Recientes lista y abre
- [ ] Cerrar abruptamente → recuperar borrador al reabrir
- [ ] Exportar/importar plantilla
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado (Ctrl+S/O) · [ ] Mouse

## 13. Technical Documentation to produce
`Dashboard/Architecture.md` (serialización), `Dashboard/Migration.md` (versiones),
`Dashboard/Troubleshooting.md` (plugin faltante).

## 14. User Documentation to produce
«Guardar, abrir y recuperar dashboards».

## 15. Acceptance Criteria
- Recientes + autosave/recuperación; round-trip completo; mensaje de plugin faltante;
  migración robusta; checklist §12 con capturas; suite verde.
