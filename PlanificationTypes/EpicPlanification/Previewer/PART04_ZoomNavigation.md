# PART04 — ZoomNavigation (zoom, ajuste y navegación)

## 1. Purpose
El zoom y la navegación: `ZoomController` (zoom focal alrededor de un punto, fit
width/page, tamaño real, % editable), `InertiaScroller` (momentum con fricción
exponencial determinista), página editable y la mano (pan).

## 2. Current State
Funcional (Fases 20/24). Zoom al cursor, inercia por frame, fit width/page. Escala
visual pura: jamás repagina.

## 3. Comparison against DevExpress
DevExpress: zoom con combo (25 %–500 %), Ctrl+rueda, ajustar a ancho/página, y
navegación por página/inicio/fin. AegiReports cubre lo esencial; auditar los niveles
de zoom preestablecidos, límites y Ctrl+0 = 100 %.

## 4. Missing Features
- Niveles preestablecidos en el combo (25/50/75/100/150/200/…​) además del % libre.
- Ctrl+rueda para zoom al cursor y Ctrl+0 = 100 % (verificar/agregar).
- Zoom «ajustar a selección» o a una región (opcional; evaluar 1.0).

## 5. UX Problems
- La inercia debe sentirse natural y detenerse limpiamente; fricción por segundo (no
  por frame) para consistencia entre tasas de refresco (revisar).
- Límites de zoom claros (no permitir zoom que rompa el layout).

## 6. Backend Problems
- `InertiaScroller`: confirmar determinismo independiente del framerate (fricción por
  tiempo, no por tick).

## 7. Frontend Problems
- Cursor de mano vs selección de texto: cambio de modo claro y con feedback.

## 8. Technical Debt
- Ninguna crítica; modelos puros testeados.

## 9. Required Improvements
1. Combo de niveles + % libre; Ctrl+rueda; Ctrl+0.
2. Fricción por tiempo verificada; límites de zoom.
3. Feedback de modo mano/selección.

## 10. Implementation Plan
1) Modelo: niveles preestablecidos, límites; auditar fricción temporal.
2) WPF: combo, atajos, cursores.
3) Recorrido manual (zoom al cursor en varias posiciones, inercia).

## 11. Automated Test Plan
- `ZoomController`: zoom focal mantiene el punto bajo el cursor; fit width/page exactos;
  límites; `InertiaScroller`: distancia determinista para una velocidad dada.

## 12. Manual Validation Checklist
- [ ] Zoom con combo, % libre, Ctrl+rueda al cursor, Ctrl+0 = 100 %
- [ ] Ajustar a ancho y a página correctos en varios tamaños de página
- [ ] Inercia natural, se detiene limpio; consistente a distintas tasas de refresco
- [ ] Mano hace pan; cambiar a selección de texto es claro
- [ ] Página editable salta; flechas/PgUp/PgDn navegan
- [ ] Límites de zoom respetados
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse/trackpad

## 13. Technical Documentation to produce
`Previewer/Architecture.md` (zoom/inercia), `Previewer/Performance.md` (scroll).

## 14. User Documentation to produce
«Zoom y navegación» (atajos, ajustes, pan).

## 15. Acceptance Criteria
- Zoom focal exacto; inercia determinista por tiempo; ajustes correctos; checklist §12
  con capturas; suite verde.
