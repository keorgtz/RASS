# PART09 — TechnicalDocumentation (documentación técnica de expresiones)

## 1. Purpose
Generar TODA la documentación técnica declarada por PART01–PART08 del Epic Expressions,
consolidada y coherente, en Markdown, para el desarrollador que integra o extiende el
motor.

## 2. Current State
No existe documentación técnica dedicada; hay ADR-0010 y docs XML de API. Los PARTs
especificaron qué producir; este PART lo GENERA al final del Epic.

## 3. Comparison against DevExpress
DevExpress documenta su lenguaje de expresiones por referencia y ejemplos. Meta
equivalente para integradores y autores de funciones.

## 4. Missing Features
Documentos declarados por los PARTs, aún inexistentes:
- `Architecture.md` (gramática, tipos, coerciones, null, agregados/alcances,
  sustitución de tokens, diagnósticos, editor)
- `API.md` (FunctionCatalog público, registrar una función propia)
- `Security.md` (sandbox, presupuestos, límites) — coordina Epic Security
- `Performance.md` (cache de parse, presupuestos) — coordina Epic Performance
- `Troubleshooting.md` (errores comunes de expresión)

## 5. UX Problems
N/A.

## 6. Backend Problems
- Reflejar el CÓDIGO REAL tras cerrar PART01–08.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
- Ejemplos deben compilar/evaluar (verificados en el Epic Documentation).

## 9. Required Improvements
Redactar los documentos con la gramática formal, referencias a tipos reales y ejemplos
verificables.

## 10. Implementation Plan
1) Tras cerrar PART01–08, redactar cada documento desde el código final.
2) Enlazar entre sí y desde el README; coordinar Security/Performance con sus Epics.

## 11. Automated Test Plan
- Verificación de enlaces; snippets/ejemplos evaluables delegados al Epic Documentation.

## 12. Manual Validation Checklist
- [ ] Cada documento existe y cubre lo declarado por su PART origen
- [ ] La gramática documentada coincide con el parser real
- [ ] Un desarrollador registra una función propia siguiendo API.md
- [ ] Diagramas legibles; enlaces internos funcionan

## 13. Technical Documentation to produce
(este PART ES la producción) — los documentos de §4.

## 14. User Documentation to produce
N/A (es PART10).

## 15. Acceptance Criteria
- Documentos completos, coherentes con el código final, enlazados; ejemplos evaluables;
  revisión editorial pasada.
