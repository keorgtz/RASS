# PART04 — BindingSubstitution ([Campo], [Param.X], [Loc.X])

## 1. Purpose
La sustitución de tokens en el pipeline: `[Campo]`/`[Obj.Sub]` (binding de datos vía
`BindingPathResolver`), `[Param.X]` (parámetros del reporte) y `[Loc.X]`
(localización), tanto en contenido de controles como dentro de expresiones.

## 2. Current State
Funcional (Fases 15/17/22). `[Campo]` enlaza al registro/banda; `[Param.X]` sustituye
valores de parámetro; `[Loc.X]` aplica localización sobre un clon (AEGI930). Coexisten
en el mismo pipeline.

## 3. Comparison against DevExpress
DevExpress usa `[FieldName]` y expression bindings, más `Parameters.X`. AegiReports
equivalente + `[Loc.X]`; auditar rutas anidadas, el escape de corchetes literales, y el
comportamiento ante token no resuelto (campo/param inexistente).

## 4. Missing Features
- Escape de corchetes literales (mostrar `[` sin interpretarlo como token).
- Comportamiento definido ante token no resuelto (vacío vs diagnóstico) — política clara.
- Rutas anidadas profundas y detalle (`[Records.X]`) uniformes con PART01.

## 5. UX Problems
- Un token mal escrito debe avisar en diseño (el editor/preview lo señala), no fallar
  silenciosamente en runtime.

## 6. Backend Problems
- Resolución de `[Campo]` vs `[Param.X]` vs `[Loc.X]` sin ambigüedad; precedencia
  documentada si un nombre colisiona.
- Token no resuelto: diagnóstico con el nombre, no excepción cruda.

## 7. Frontend Problems
N/A (se refleja en el editor/preview).

## 8. Technical Debt
- Coordinar con Localization (Epic Documentation/DeveloperExperience) para `[Loc.X]`.

## 9. Required Improvements
1. Escape de corchetes literales + política de token no resuelto (diagnóstico).
2. Rutas anidadas/detalle uniformes con el pipeline de registros (PART01).
3. Precedencia documentada Campo/Param/Loc.

## 10. Implementation Plan
1) Motor/sustitución: escape, token no resuelto → diagnóstico, rutas anidadas + tests.
2) Editor/preview: señalar tokens no resueltos en diseño.
3) Recorrido manual con reporte que use los tres tipos de token.

## 11. Automated Test Plan
- Sustitución de `[Campo]`/`[Param.X]`/`[Loc.X]`; rutas anidadas y detalle; escape de
  corchetes; token no resuelto → diagnóstico con nombre; precedencia en colisión.

## 12. Manual Validation Checklist
- [ ] `[Product]`, `[Cliente.Nombre]`, `[Param.Canal]`, `[Loc.Titulo]` sustituyen correcto
- [ ] Corchete literal escapado se muestra como `[`
- [ ] Campo/param inexistente → diagnóstico en diseño (no falla en silencio)
- [ ] `[Records.Total]` en un sumario funciona
- [ ] Cambiar el parámetro re-sustituye en el visor
- [ ] Localización aplica sobre el clon sin tocar el original

## 13. Technical Documentation to produce
`Expressions/Architecture.md` (sustitución, precedencia, escape), remite a
`DataSources/Architecture.md` (binding).

## 14. User Documentation to produce
«Insertar datos, parámetros y textos» ([Campo], [Param], [Loc], escape).

## 15. Acceptance Criteria
- Los tres tipos de token con escape, rutas anidadas y token-no-resuelto diagnosticado;
  precedencia documentada; checklist §12 con capturas; suite verde.
