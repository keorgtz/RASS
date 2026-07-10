# PART03 — Documentation · How to Migrate

## 1. Purpose
Documentar el procedimiento manual para que un humano migre un paquete legacy.

## 2. Current State
No hay doc de migración.

## 3. Comparison against baseline
La documentación es parte del baseline EpicPlanification.

## 4. Missing / Required Scope
Snippet a incluir en `refi/README.md`:

```md
### Migrating a legacy packet (optional)

If you have an existing packet under `.refi/modules/<slug>/` using
`domain-shards/01-*.md` and want to migrate it to the Epic + PART format:

1. **Decide first.** Both formats work; migration is optional.
2. **Dry-run the helper.** Run:
   ```bash
   node scripts/migrate-refi-module.js <slug> --dry-run
   ```
   Review the printed plan.
3. **Apply with a new slug.**
   ```bash
   node scripts/migrate-refi-module.js <slug> --output=<slug>-v2
   ```
   The original stays intact. A new folder `<slug>-v2/` is created.
4. **Fill the gaps manually.** Sections §3 (Comparison) and §15
   (Acceptance Criteria) cannot be auto-derived. Fill them by hand.
5. **Validate.** Run the linter and review `epics/matrix.md`.
6. **Switch.** Once you trust `<slug>-v2/`, rename or delete the legacy.
```

## 5. UX Problems
N/A.

## 6. Backend / Logic Problems
Sin doc, la gente no migra o lo hace a mano y rompe consistencia.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
N/A.

## 9. Required Improvements
1. Insertar el snippet en `refi/README.md`.

## 10. Implementation Plan
1) Snippet arriba.
2) Aplicar.

## 11. Automated Test Plan
- Linter de markdown: la sección "Migrating a legacy packet" existe.

## 12. Manual Validation Checklist
- [ ] Snippet presente en `refi/README.md`.

## 13. Technical Documentation to produce
- `refi/README.md`.

## 14. User Documentation to produce
Este PART.

## 15. Acceptance Criteria
- Snippet presente con 6 pasos numerados.
