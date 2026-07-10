# PART05 — ThumbnailsPanel (panel de miniaturas)

## 1. Purpose
El panel de miniaturas: `ThumbnailStrip` (virtualizada) + `EnsureThumbnailAsync`
(render diferido con `WpfImageExporter`), sincronización bidireccional con la vista
principal (clic en miniatura → salto; scroll de la vista → resalta la miniatura).

## 2. Current State
Funcional (Fases 20/24). Virtualización y sync bidireccional. Fase 28: el render de
miniatura ya está protegido con try/catch (conserva la anterior si falla).

## 3. Comparison against DevExpress
DevExpress muestra número de página bajo cada miniatura, resalta la actual y permite
tamaño de miniatura ajustable. AegiReports: resaltado sí; auditar número visible,
tamaño ajustable y rendimiento con cientos de páginas.

## 4. Missing Features
- Número de página bajo cada miniatura.
- Tamaño de miniatura ajustable (pequeño/mediano/grande).
- Cancelación del render de miniaturas fuera del viewport (no desperdiciar CPU).

## 5. UX Problems
- Placeholder mientras la miniatura se genera (evitar salto de layout).
- La miniatura activa debe centrarse en el scroll del panel al navegar.

## 6. Backend Problems
- `EnsureThumbnailAsync` debe cancelar renders obsoletos cuando la sesión cambia
  (verificado en Fase 24; formalizar con test).

## 7. Frontend Problems
- Virtualización correcta con 500+ páginas: solo renderizar visibles + margen.

## 8. Technical Debt
- Ninguna crítica.

## 9. Required Improvements
1. Número de página + tamaño ajustable + placeholder.
2. Cancelación de renders fuera de viewport; auto-centrado de la activa.
3. Verificación de virtualización con documento grande.

## 10. Implementation Plan
1) Modelo: estado del strip (rango visible, tamaño); cancelación por versión de sesión.
2) WPF: número, placeholder, tamaños, auto-centrado.
3) Recorrido manual con documento de 200+ páginas.

## 11. Automated Test Plan
- Sync bidireccional (página↔miniatura); cancelación al cambiar de sesión; solo el
  rango visible solicita render (modelo puro del rango).

## 12. Manual Validation Checklist
- [ ] Miniaturas se generan con placeholder, sin salto de layout
- [ ] Clic en miniatura salta; scroll de la vista resalta y centra la miniatura
- [ ] Número de página visible; tamaño ajustable
- [ ] Documento de 200+ páginas: scroll fluido, sin fuga, sin CPU en reposo
- [ ] Cambiar de documento cancela renders pendientes
- [ ] Fallo de render de una miniatura no rompe el panel
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado (flechas en el strip) · [ ] Mouse

## 13. Technical Documentation to produce
`Previewer/Architecture.md` (miniaturas, render diferido), `Previewer/Performance.md`.

## 14. User Documentation to produce
Sección «Panel de miniaturas» en la guía del visor.

## 15. Acceptance Criteria
- Virtualización eficiente, sync exacto, cancelación correcta, sin CPU en reposo;
  checklist §12 con capturas; suite verde.
