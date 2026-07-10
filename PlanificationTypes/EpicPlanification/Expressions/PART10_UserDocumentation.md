# PART10 — UserDocumentation (documentación de usuario de expresiones)

## 1. Purpose
Generar toda la documentación de USUARIO FINAL declarada por PART01–PART08 del Epic
Expressions: la guía completa de quien escribe expresiones (calculadas, formato
condicional, bindings) sin programar, en Markdown, integrable en el sitio (Epic
Documentation). Incluye la referencia de funciones GENERADA del catálogo (PART02).

## 2. Current State
El sitio `Docs` no tiene una guía de expresiones paso a paso ni una referencia de
funciones generada. Los PARTs especificaron los temas; este PART los escribe al final
del Epic.

## 3. Comparison against DevExpress
DevExpress ofrece referencia de expresiones con ejemplos por función. Meta equivalente:
un usuario escribe una expresión útil siguiendo la guía, con la referencia a mano.

## 4. Missing Features
Temas de usuario declarados por los PARTs:
- «Expresiones en AegiReports» (sintaxis, operadores) — base de PART01
- «Referencia de funciones» (GENERADA del catálogo del PART02)
- «Totales y agregados» (subtotales, acumulados, porcentajes) — PART03
- «Insertar datos, parámetros y textos» ([Campo]/[Param]/[Loc], escape) — PART04
- «El editor de expresiones» (resaltado, autocompletado, evaluación) — PART07
- «Errores comunes y cómo corregirlos» — PART06
- «Buenas prácticas» (expresiones eficientes y sus límites) — PART05/PART08

## 5. UX Problems
- Capturas post-completación (estado final MeridianUI); reusar `docs/screenshots/`.

## 6. Backend Problems
- La referencia de funciones se GENERA del catálogo (PART02), no se escribe a mano.

## 7. Frontend Problems
N/A.

## 8. Technical Debt
- Mantener la referencia sincronizada con el catálogo (regeneración).

## 9. Required Improvements
Escribir cada tema como tutorial/referencia por tarea, con capturas reales y ejemplos
evaluables, en es-MX impecable.

## 10. Implementation Plan
1) Tras cerrar PART01–08, redactar cada tema; generar la referencia del catálogo.
2) Tutorial «Crea una columna calculada y un formato condicional».
3) Integrar en el índice del sitio (Epic Documentation).

## 11. Automated Test Plan
- Verificación de enlaces e imágenes; la referencia coincide con el catálogo real;
  los ejemplos evalúan al resultado documentado.

## 12. Manual Validation Checklist
- [ ] Un usuario nuevo sigue «Totales y agregados» y crea un subtotal sin ayuda
- [ ] La referencia de funciones coincide con el editor (misma fuente)
- [ ] Cada tema con capturas actuales y ejemplos que evalúan correcto
- [ ] Tutorial de calculada + formato condicional funciona siguiéndolo
- [ ] es-MX sin errores ortográficos ni de acentuación

## 13. Technical Documentation to produce
N/A (es PART09).

## 14. User Documentation to produce
(este PART ES la producción) — todos los temas de §4, incluida la referencia generada.

## 15. Acceptance Criteria
- Todos los temas escritos con capturas/ejemplos evaluables y validados por recorrido;
  referencia generada del catálogo; es-MX impecable; integrados en el sitio.
