# PART10 — Bands (gestión de bandas)

## 1. Purpose
La edición de la estructura de bandas del documento en el estudio: alta/baja/reorden
(`Remove/MoveBandCommand`), alturas (arrastre del divisor y propiedad), tipos
(Report/Page Header/Footer, Detail, Group Header/Footer multinivel) y su
representación visual en la superficie (encabezados de banda, colapso visual).

## 2. Current State
Los comandos de banda existen (Fase 23) y las alturas se editan; la gestión completa
desde UI (menú de superficie «Insertar banda…», divisores arrastrables entre bandas)
es el pendiente histórico «bands editing» declarado desde Fase 11.

## 3. Comparison against DevExpress
DevExpress: encabezado visual por banda con nombre/tipo, arrastre del borde inferior
para altura, menú contextual de banda (insertar/eliminar/propiedades), colapso de
bandas en diseño, y niveles de grupo gestionados desde el propio designer.
AegiReports: alturas sí; encabezados visuales y menú de banda a auditar/completar.

## 4. Missing Features
- Encabezado visual de banda (nombre + tipo + agarre) en la superficie.
- Menú contextual de banda: insertar arriba/abajo por tipo, eliminar, propiedades.
- Colapso visual de banda en diseño (no afecta composición).
- Gestión de niveles de grupo (agregar GroupHeader/Footer pareados) desde UI.

## 5. UX Problems
- Sin encabezados, el usuario no distingue límites de banda con claridad (solo el
  wizard de agrupación los crea hoy).

## 6. Backend Problems
- Insertar GroupHeader requiere validar pareo con GroupFooter y niveles contiguos
  (regla del motor) — comando con validación.

## 7. Frontend Problems
- Divisor de altura entre bandas: cursor y snap a grid.

## 8. Technical Debt
- «bands editing/reparenting» aparece como pendiente desde ADR-0013 — este PART lo
  salda o lo convierte en límite documentado (la recomendación es saldarlo: es
  esperable en un designer comercial).

## 9. Required Improvements
1. Encabezados de banda + divisores arrastrables con snap.
2. Menú contextual de banda completo con comandos undoables validados.
3. Colapso visual por banda (estado de vista, no de documento).

## 10. Implementation Plan
1) Modelo: `InsertBandCommand` con validaciones de tipo/pareo/orden + tests.
2) WPF: encabezados, divisores, menú, colapso (solo presentación).
3) Recorrido manual con documento multinivel real (escenario hotelero agrupado).

## 11. Automated Test Plan
- InsertBand: cada tipo en cada posición legal/ilegal; grupos pareados; undo/redo.
- Altura: mínimo por contenido, snap; MoveBand estable.

## 12. Manual Validation Checklist
- [ ] Encabezados de banda visibles con nombre/tipo
- [ ] Arrastrar divisor cambia altura con snap; propiedad refleja
- [ ] Insertar cada tipo de banda desde menú contextual; eliminar; undo/redo
- [ ] Agregar nivel de grupo → header/footer pareados; quitar nivel
- [ ] Colapsar banda en diseño; la composición no cambia (preview igual)
- [ ] Guardar/reabrir conserva estructura
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Designer/Architecture.md` (modelo de bandas en diseño), `Designer/Limitations.md`
(lo que quede fuera).

## 14. User Documentation to produce
«Trabajar con bandas» (tipos, alturas, grupos multinivel).

## 15. Acceptance Criteria
- Estructura de bandas 100 % editable desde el estudio sin wizard; pendiente
  histórico saldado o formalmente documentado; checklist §12 con capturas; suite verde.
