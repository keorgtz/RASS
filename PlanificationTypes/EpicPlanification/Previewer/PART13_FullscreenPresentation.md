# PART13 — FullscreenPresentation (pantalla completa y presentación)

## 1. Purpose
Los modos inmersivos del visor: pantalla completa (F11) y modo presentación (avance
por página a pantalla completa, sin cromo), incluida la vista de dos páginas/libro en
estos modos.

## 2. Current State
Funcional (Fase 24). F11 y presentación operativos; two-up disponible.

## 3. Comparison against DevExpress
El viewer de escritorio de DevExpress no enfatiza un modo presentación; es un
diferencial de AegiReports. El objetivo es que sea pulido: transiciones, controles
mínimos y salida clara.

## 4. Missing Features
- Barra de controles mínima autooculta en presentación (aparece al mover el mouse).
- Navegación por teclado completa (flechas/espacio avanza, Esc sale).
- Indicador de página discreto (n / m) en presentación.

## 5. UX Problems
- Transición a/desde pantalla completa sin parpadeo; recordar el modo de página.
- En multi-monitor, presentar en el monitor correcto.

## 6. Backend Problems
- Ninguno; es estado de vista + ventana.

## 7. Frontend Problems
- Ocultar/mostrar cromo con motion ≤ 200 ms; cursor se oculta en reposo.

## 8. Technical Debt
- Ninguna crítica.

## 9. Required Improvements
1. Barra mínima autooculta + indicador de página + navegación por teclado completa.
2. Transición sin parpadeo; recordar modo de página; multi-monitor.

## 10. Implementation Plan
1) WPF: ventana fullscreen, autohide del cromo, atajos, selección de monitor.
2) Recorrido manual en uno y dos monitores.

## 11. Automated Test Plan
- Estado de vista: entrar/salir preserva página/zoom/modo (modelo puro del estado).

## 12. Manual Validation Checklist
- [ ] F11 entra/sale de pantalla completa sin parpadeo
- [ ] Presentación: flechas/espacio avanzan, Esc sale; cromo autooculto
- [ ] Indicador de página discreto; cursor se oculta en reposo
- [ ] Dos páginas/libro funciona en presentación
- [ ] Multi-monitor: presenta en el monitor esperado
- [ ] Al salir, se restaura página/zoom/modo previos
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Previewer/Architecture.md` (modos inmersivos, estado de vista).

## 14. User Documentation to produce
«Pantalla completa y presentación».

## 15. Acceptance Criteria
- F11 y presentación pulidos, con navegación por teclado, autohide y multi-monitor;
  estado preservado al salir; checklist §12 con capturas; suite verde.
