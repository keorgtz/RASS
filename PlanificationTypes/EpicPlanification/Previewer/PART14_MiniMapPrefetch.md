# PART14 — MiniMapPrefetch (minimapa y prefetch predictivo)

## 1. Purpose
Decidir el destino de los modelos verdes SIN UI de `Previewer.Advanced`: `MiniMap`
(documento↔viewport) y `PredictivePrefetch` + `PageLoadTracker` (carga anticipada de
páginas). O se cablean a la UI del visor, o se excluyen formalmente de 1.0 con
justificación.

## 2. Current State
`MiniMap`, `PredictivePrefetch` y `PageLoadTracker` existen como modelos puros
testeados (Fase 20) pero SIN UI dedicada — candidatos menores señalados como «fase
futura» en la memoria del proyecto.

## 3. Comparison against DevExpress
Ninguno de los dos es estándar en DevExpress viewer; son diferenciales opcionales. La
decisión debe basarse en valor real para el usuario vs coste de UI y mantenimiento.

## 4. Missing Features
- UI del minimapa (overlay navegable en documentos largos) — si se cablea.
- Integración del prefetch con el scroll real del visor — si se cablea.

## 5. UX Problems
- El minimapa solo aporta en documentos MUY largos; en cortos estorba → mostrar
  condicionalmente (umbral de páginas).

## 6. Backend Problems
- El prefetch debe respetar la cache LRU y la cancelación; no competir con el render
  visible.

## 7. Frontend Problems
- Minimapa: overlay discreto, arrastrable, sincronizado con el viewport.

## 8. Technical Debt
- Modelos verdes sin uso son deuda latente (código sin consumidor). Este PART la
  resuelve: cablear o retirar/excluir con decisión registrada.

## 9. Required Improvements
Según la decisión del Architecture Review:
- **Opción A (cablear):** minimapa condicional + prefetch integrado al scroll.
- **Opción B (excluir 1.0):** marcar los modelos como experimentales/no-soportados,
  documentar en `Limitations.md`, y quitarlos de la superficie pública si aplica.

## 10. Implementation Plan
1) Architecture Review: valor vs coste → decisión A/B registrada en el PART.
2) A: UI de minimapa + integración prefetch + tests de integración.
   B: mover a experimental + documentar + ajustar superficie pública.
3) Recorrido manual (si A) o verificación de que no hay código muerto expuesto (si B).

## 11. Automated Test Plan
- A: minimapa mapea viewport↔documento; prefetch anticipa el rango correcto sin
  exceder cache.
- B: la superficie pública ya no expone tipos experimentales sin marca.

## 12. Manual Validation Checklist
(si Opción A)
- [ ] Minimapa aparece solo en documentos largos; arrastrar navega
- [ ] Prefetch reduce el tiempo de aparición al hacer scroll rápido
- [ ] Sin competir con el render visible ni causar fugas
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse
(si Opción B)
- [ ] `Limitations.md` documenta la exclusión con razón
- [ ] No hay tipos experimentales sin marcar en la API pública

## 13. Technical Documentation to produce
`Previewer/Limitations.md` (decisión y razón), y si A también `Previewer/Architecture.md`.

## 14. User Documentation to produce
Si A: sección «Minimapa» en la guía del visor. Si B: nada (excluido).

## 15. Acceptance Criteria
- Decisión A/B tomada y registrada; sin modelos verdes huérfanos expuestos; si A,
  checklist §12 con capturas; suite verde.
