# PART04 — Backward-Compatible Folders

## 1. Purpose
Garantizar que los 4 paquetes existentes (linux-compat, multi-agent-compatibility,
reasp-backup-manager, sdd-profile-provider-support) sigan funcionando sin cambios.

## 2. Current State
Los 4 paquetes usan `domain-shards/01-*.md` y no tienen `epics/`. Se planea introducir
`epics/` como carpeta obligatoria para paquetes NUEVOS, sin tocar los viejos.

## 3. Comparison against baseline
Es la decisión inversa a "migración obligatoria": los paquetes viejos son evidencia
funcional y se preservan.

## 4. Missing / Required Scope

- En `config.yaml`, `epic_part.legacy_domain_shards_fallback: true`.
- En el planner (EPIC 02), una rama explícita: si el packet ya existe y no tiene
  `epics/`, tratarlo como legacy y NO intentar migrarlo automáticamente.
- El linter de validación debe aceptar ambas formas:
  - Nueva: `epics/matrix.md` + `epics/<epic>/README.md`.
  - Legacy: `master-blueprint.md` con secciones de shards + `domain-shards/01-*.md`.
- EPIC 07 ofrece migrar manualmente con un helper.

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
Si el planner intenta "arreglar" paquetes viejos automáticamente, puede romper su
información. La opción debe ser estrictamente manual.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
La deuda intencional es: los paquetes viejos divergen del nuevo contrato. Aceptable
y documentada.

## 9. Required Improvements
1. Bloque de fallback en `config.yaml` (cubierto por PART03).
2. Bloque de fallback en el prompt del agente (EPIC 02).

## 10. Implementation Plan
1) Reglas arriba en este PART.
2) Aplicar a config y prompt.

## 11. Automated Test Plan
- Test: el linter acepta ambos formatos.

## 12. Manual Validation Checklist
- [ ] Los 4 paquetes legacy siguen parseando.
- [ ] El flag fallback existe y está en `true` por defecto.

## 13. Technical Documentation to produce
- Notas en `refi/README.md` (apartado "Backward compatibility").

## 14. User Documentation to produce
EPIC 06.

## 15. Acceptance Criteria
- Linter dual: legacy + nuevo.
- Flag `legacy_domain_shards_fallback` documentado.
