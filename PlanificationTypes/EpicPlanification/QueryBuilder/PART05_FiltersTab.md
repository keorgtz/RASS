# PART05 — FiltersTab (árbol de filtros anidados)

## 1. Purpose
La pestaña de filtros: árbol de condiciones anidadas AND/OR, operadores (=, <>, <, >,
BETWEEN, IN, LIKE, IS NULL…), valores literales o parámetros, y `PromoteToParameter`
(convertir un literal en `@Parametro`).

## 2. Current State
Funcional (Fase 25). Árbol anidado, operadores, PromoteToParameter. El generador SQL
siempre parametriza; **defecto corregido por test:** una condición con parámetro
declarado sin literal no registraba valor — el `TestValue` viaja en el bucle final.

## 3. Comparison against DevExpress
DevExpress Filter Editor: árbol AND/OR con grupos, operadores ricos y selector de valor
por tipo (fecha con calendario, lookup). AegiReports: árbol y operadores; auditar el
editor de valor por tipo, IN con lista y LIKE con comodines guiados.

## 4. Missing Features
- Editor de valor por tipo (calendario para fecha, lista para IN, lookup para FK).
- Comodines de LIKE guiados (contiene/empieza/termina) que generan el patrón.
- Grupos AND/OR reordenables y colapsables; negación (NOT) de un grupo.

## 5. UX Problems
- Un filtro incompleto (operador sin valor) debe avisar inline, no romper el SQL.
- IN con muchos valores: editor de lista cómodo (uno por línea o chips).

## 6. Backend Problems
- IN expande a múltiples parámetros; BETWEEN a dos; confirmar anti-inyección total y
  que el prune recursivo al quitar una tabla elimina filtros huérfanos (ya en PART03).

## 7. Frontend Problems
- Arrastrar para reordenar/reagrupar condiciones; feedback del anidamiento.

## 8. Technical Debt
- El valor por tipo se apoya en el esquema (tipos de columna) — reuso del explorer.

## 9. Required Improvements
1. Editor de valor por tipo (fecha/IN/lookup) + LIKE guiado.
2. Grupos reordenables/colapsables + NOT.
3. Aviso de filtro incompleto sin romper el SQL.

## 10. Implementation Plan
1) Modelo: valor por tipo, NOT en grupo, validación de condición completa + tests.
2) WPF: editores por tipo, reordenar/agrupar, avisos inline.
3) Recorrido manual con preset Reservas (@Canal, fechas) y filtros anidados.

## 11. Automated Test Plan
- Generación SQL de =/<>/BETWEEN/IN/LIKE/IS NULL parametrizados; PromoteToParameter;
  árbol AND/OR/NOT; condición incompleta detectada; prune al quitar tabla.

## 12. Manual Validation Checklist
- [ ] Construir filtro anidado (AND con un OR interno) → SQL correcto
- [ ] Operador por tipo: fecha con calendario, IN con lista, LIKE guiado
- [ ] PromoteToParameter convierte literal en @Parametro (aparece en pestaña Parámetros)
- [ ] NOT en un grupo; reordenar/colapsar grupos
- [ ] Condición incompleta → aviso inline, SQL no se rompe
- [ ] Quitar una tabla elimina sus filtros
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`QueryBuilder/Architecture.md` (árbol de filtros, parametrización),
`QueryBuilder/Security.md` (anti-inyección) — coordina con Epic Security.

## 14. User Documentation to produce
«Filtrar datos» (condiciones, grupos, parámetros).

## 15. Acceptance Criteria
- Filtros anidados con editor por tipo y NOT; parametrización siempre segura; avisos
  inline; checklist §12 con capturas; suite verde.
