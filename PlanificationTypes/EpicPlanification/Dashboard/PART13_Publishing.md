# PART13 — Publishing (publicación al servidor)

## 1. Purpose
La publicación del dashboard al servidor: `DashboardPublisher.Publish` →
`ReportDefinition` del `ReportCatalog` existente, con las opciones
(`DashboardPublicationOptions`: measurer, ejecutor, layout handlers), de modo que el
dashboard queda accesible como OTRO documento del catálogo (preview/export/web gratis).

## 2. Current State
Funcional (Fase 26). Publica al catálogo; el Demo lo demuestra. **Deuda declarada
(ADR-0028):** la fábrica de composición es SÍNCRONA y BLOQUEA el worker cuando la fuente
es SQL real.

## 3. Comparison against DevExpress
DevExpress publica dashboards a su Dashboard Server con actualización programada.
AegiReports publica al catálogo propio; auditar el ciclo asíncrono (no bloquear
workers), la actualización/versionado del publicado y la seguridad multi-tenant (Epic
Server).

## 4. Missing Features
- **Composición asíncrona** en la publicación (cerrar la deuda de ADR-0028: no bloquear
  el worker con SQL real).
- Republicar/actualizar un dashboard ya publicado (versionado) sin duplicar id.
- Programación de refresco del dashboard publicado (coordinar Epic Server Scheduler).

## 5. UX Problems
- Feedback de publicación: éxito con el id y conteo del catálogo; error con diálogo.
- Confirmar sobrescritura al republicar un id existente.

## 6. Backend Problems
- La fábrica síncrona con SQL bloquea el worker: convertir a asíncrona respetando el
  contrato del `ReportCatalog`/`RenderWorker`.

## 7. Frontend Problems
- El diseñador debe reflejar el estado de publicación (publicado/no, última fecha).

## 8. Technical Debt
- La composición síncrona es la deuda central de este PART (ADR-0028).

## 9. Required Improvements
1. Composición asíncrona en la publicación (cerrar ADR-0028).
2. Republicar/actualizar con versionado; confirmar sobrescritura.
3. Feedback y estado de publicación en el diseñador.

## 10. Implementation Plan
1) Publisher: ruta asíncrona de composición (coordinar Epic Server PART09).
2) Versionado de publicado + confirmación de sobrescritura.
3) Recorrido manual: publicar, ver en el catálogo/servidor, republicar.

## 11. Automated Test Plan
- Publish crea ReportDefinition; republicar versiona sin duplicar id; composición
  asíncrona no bloquea; error de fuente → resultado manejado.

## 12. Manual Validation Checklist
- [ ] Publicar un dashboard hotelero → aparece en el catálogo del servidor del Demo
- [ ] Verlo vía el servidor (preview/export web) — coordina Epic Server/Web
- [ ] Republicar el mismo id → confirma sobrescritura y versiona
- [ ] Publicar con fuente SQL real no bloquea la UI/worker
- [ ] Error de publicación → diálogo Meridian, sin fallo mudo
- [ ] Estado de publicación visible en el diseñador
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Dashboard/Integration.md` (publicación al catálogo), remite a `Server/*` (worker,
scheduler).

## 14. User Documentation to produce
«Publicar un dashboard» (al servidor, actualizar, programar).

## 15. Acceptance Criteria
- Composición asíncrona (deuda ADR-0028 cerrada); republicar con versionado; feedback y
  estado; checklist §12 con capturas; suite verde.
