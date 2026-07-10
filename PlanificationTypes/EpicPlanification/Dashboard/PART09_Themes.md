# PART09 — Themes (temas del dashboard)

## 1. Purpose
Los temas del dashboard: paletas y estilos aplicados a los widgets al compilar, el combo
de tema del diseñador (p. ej. «Meridian claro») y el editor de contraste que verifica la
legibilidad de las combinaciones.

## 2. Current State
Funcional (Fase 26). Temas con editor de contraste; el combo de tema en el diseñador
aplica a la composición. Los temas son datos deterministas.

## 3. Comparison against DevExpress
DevExpress ofrece varios temas de dashboard y color schemes por item. AegiReports:
temas + editor de contraste; auditar temas oscuros del propio dashboard compuesto,
paletas de series de chart por tema y la coherencia con MeridianUI.

## 4. Missing Features
- Tema oscuro del dashboard COMPUESTO (no solo del diseñador) — el documento resultante
  debe poder ser oscuro.
- Paletas de series de chart por tema (coordinar Epic Charts).
- Guardar un tema personalizado y reutilizarlo entre dashboards.

## 5. UX Problems
- El editor de contraste debe señalar combinaciones que fallan AA con sugerencia.
- Previsualizar el tema aplicado a los widgets en vivo.

## 6. Backend Problems
- Los temas deben ser deterministas y versionables en el `.aedashboard`.

## 7. Frontend Problems
- El combo de tema y la vista previa deben reflejar el resultado real de la composición.

## 8. Technical Debt
- Alinear la paleta del dashboard con los tokens MeridianUI para coherencia de marca.

## 9. Required Improvements
1. Tema oscuro del dashboard compuesto + paletas de series por tema.
2. Temas personalizados guardables/reutilizables.
3. Editor de contraste con verificación AA y sugerencias.

## 10. Implementation Plan
1) Modelo: tema oscuro compuesto, paletas de series, tema personalizado + tests.
2) WPF: editor de contraste con AA, preview en vivo.
3) Recorrido manual aplicando temas claro/oscuro/personalizado.

## 11. Automated Test Plan
- Aplicar tema produce colores deterministas en la composición; contraste calculado por
  par; tema personalizado round-trip en `.aedashboard`.

## 12. Manual Validation Checklist
- [ ] Cambiar tema del dashboard → widgets reflejan la paleta
- [ ] Tema oscuro del dashboard compuesto (no solo del diseñador)
- [ ] Editor de contraste señala combinaciones que fallan AA
- [ ] Crear tema personalizado, guardarlo y reutilizarlo
- [ ] Paletas de series de chart por tema
- [ ] Guardar/reabrir conserva el tema
- [ ] Tema claro/oscuro del diseñador · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Dashboard/Architecture.md` (temas, contraste), remite a `Charts/*` para paletas.

## 14. User Documentation to produce
«Temas del dashboard» (aplicar, personalizar, contraste).

## 15. Acceptance Criteria
- Tema oscuro compuesto, paletas por tema y temas personalizados; editor de contraste
  AA; checklist §12 con capturas; suite verde.
