# PART19 — Theming (claro/oscuro, High DPI, MeridianUI en todo el estudio)

## 1. Purpose
La consistencia visual total del estudio: `Theme/Meridian.cs` (1:1 con tokens-wpf.xaml),
`MeridianControls.xaml` (estilos implícitos + brushes dinámicos), `MeridianDialog`,
tema claro/oscuro completo, High DPI y cero controles con apariencia default.

## 2. Current State
Fase 28 aplicó estilos implícitos en 14 raíces + Demo, brushes dinámicos para tema
oscuro, MeridianDialog. Límites declarados: calendario del DatePicker y estructura de
MenuItem conservan plantilla del sistema.

## 3. Comparison against DevExpress
DevExpress ofrece varios skins y un editor de skin; el modo oscuro es completo. La
meta de AegiReports NO es multi-skin sino UN sistema (MeridianUI) impecable en claro y
oscuro. La barra está en «sin un solo control default».

## 4. Missing Features
- Modo oscuro del ESTUDIO completo (Fase 28 lo hizo en el Demo; verificar que el
  estudio/visor/query builder/dashboard también sobreescriben los brushes al cambiar
  de tema, no solo el Demo).
- Cerrar los límites declarados: calendario del DatePicker y MenuItem estructural, o
  reafirmarlos como aceptables 1.0 con justificación.

## 5. UX Problems
- Verificar TODAS las superficies en oscuro: popups, tooltips, scrollbars, adorners,
  reglas/guías de la superficie de diseño (líneas legibles, no negras sobre negro).

## 6. Backend Problems
- El cambio de tema en caliente debe repintar sin reabrir ventanas (sobreescritura de
  brushes dinámicos en cada raíz, como el Demo).

## 7. Frontend Problems
- High DPI: iconos PackIcon nítidos, sin recortes de layout a 150/200 %, splitters y
  manijas de tamaño usable.

## 8. Technical Debt
- Consolidar la paleta oscura en un único lugar reutilizable (hoy el override vive en
  `DemoWindow.OverrideControlBrushes`; extraer a `Meridian` para todos los hosts).

## 9. Required Improvements
1. `Meridian.ApplyTheme(root, dark)` reutilizable (mover el override del Demo) y
   aplicarlo en estudio/visor/query builder/dashboard.
2. Auditoría oscuro superficie por superficie (adorners/reglas/guías/overlays).
3. Cerrar o reafirmar los 2 límites declarados; High DPI verificado.

## 10. Implementation Plan
1) Extraer override de brushes a `Meridian`; un toggle de tema por host.
2) Barrido oscuro (checklist §12) sobre CADA host WPF.
3) Recorrido High DPI 150/200 %.

## 11. Automated Test Plan
- Test de recursos: cada clave `Meridian.*` existe en claro y oscuro; contraste
  mínimo calculado (texto vs fondo) sobre pares clave.

## 12. Manual Validation Checklist
- [ ] Estudio en oscuro: todos los paneles, popups, tooltips, scrollbars, reglas,
      guías, adorners legibles
- [ ] Visor, query builder, dashboard designer en oscuro (mismo estándar)
- [ ] Cambio de tema en caliente sin reabrir
- [ ] MeridianDialog en claro/oscuro
- [ ] High DPI 100/150/200 %: iconos nítidos, sin recortes, manijas usables
- [ ] Ningún control con apariencia default (barrido visual)
- [ ] Límites declarados (DatePicker/MenuItem) documentados y aceptables

## 13. Technical Documentation to produce
`Designer/Architecture.md` (theming, tokens, brushes dinámicos),
`Designer/Limitations.md` (límites de theming declarados).

## 14. User Documentation to produce
«Tema claro y oscuro» (cómo alternar, dónde se recuerda).

## 15. Acceptance Criteria
- Oscuro completo en los 4 hosts WPF; override reutilizable; High DPI sin defectos;
  cero controles default; checklist §12 con capturas; suite verde.
