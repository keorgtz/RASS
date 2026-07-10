# PART03 — Config YAML Additions

## 1. Purpose
Añadir dos flags de comportamiento a `.opencode/refi/config.yaml` para activar y forzar
la nueva metodología.

## 2. Current State
`config.yaml` v1 tiene `system`, `defaults`, `project_profile`, `packet`, `quality_gates`.
No hay flags para Epic/PART.

## 3. Comparison against baseline
EpicPlanification está controlado por una decisión del propietario; REFI traduce eso a
flags explícitos para que el comportamiento sea revisable.

## 4. Missing / Required Scope
Añadir a `config.yaml`:

```yaml
epic_part:
  enabled: true                                    # El planner propone EPICs primero.
  require_part_detail_before_handoff: true         # No se llega a handoff sin PARTs.
  legacy_domain_shards_fallback: true              # Acepta packets legacy (sólo domain-shards/).
  min_epics_for_enterprise: 2                      # Trabajar con < 2 EPICs se considera trivial.
  max_parts_per_epic_soft_warning: 30              # Aviso si un EPIC crece demasiado.
```

Defaults seguros: los 3 primeros en `true`, los 2 últimos como umbrales.

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
Sin defaults, agentes podrían desactivar la regla con un `false` accidental.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
Ninguna.

## 9. Required Improvements
1. Insertar el bloque `epic_part:` en `config.yaml`.

## 10. Implementation Plan
1) Bloque arriba.
2) Aplicar a `config.yaml`.

## 11. Automated Test Plan
- Test: el YAML parsea y los flags están presentes con sus defaults.

## 12. Manual Validation Checklist
- [ ] El bloque aparece y los defaults son correctos.
- [ ] El planner (EPIC 02) respeta `require_part_detail_before_handoff`.

## 13. Technical Documentation to produce
- Bloque YAML.

## 14. User Documentation to produce
EPIC 06.

## 15. Acceptance Criteria
- Bloque insertado con 5 flags y defaults.
