# PART02 — FunctionCatalog (catálogo de funciones)

## 1. Purpose
El catálogo de funciones del motor (fecha/texto/matemática/lógica/conversión) y su
exposición como metadatos (`FunctionCatalog.Describe()` — nombre, firma, categoría,
descripción, ejemplo) que alimenta tanto el editor (autocompletado/ayuda) como la
documentación de usuario, desde UNA sola fuente de verdad.

## 2. Current State
El motor tiene funciones registradas usadas por bindings/calculadas. NO existe aún una
API de catálogo con metadatos completos; el editor usa autocompletado pero la lista de
funciones no está formalizada como fuente única.

## 3. Comparison against DevExpress
DevExpress ofrece un catálogo amplio agrupado (Date-Time, Math, String, Logical) con
firma y descripción por función en el editor. AegiReports debe fijar su catálogo,
cerrar gaps de funciones de alto uso y exponer metadatos.

## 4. Missing Features
- API `FunctionCatalog.Describe()` con firma/categoría/descripción/ejemplo por función.
- Cobertura contra DevExpress: fecha (AddDays, DateDiff, Today, Year/Month/Day), texto
  (Substring, Upper/Lower, Trim, PadLeft, Replace, Contains, Len), matemática (Round,
  Ceiling, Floor, Abs, Min/Max), lógica (Iif, IsNull, IsNullOrEmpty), conversión
  (ToStr, ToDecimal, ToInt) — clasificar existente/gap.
- Test de completitud: cada función registrada DEBE tener metadatos (falla al agregar
  una sin documentar).

## 5. UX Problems
- El editor debe mostrar la firma y un ejemplo al seleccionar una función (PART07).

## 6. Backend Problems
- Una sola fuente de verdad: el catálogo del motor genera tanto el autocompletado como
  la referencia de la documentación de usuario (sin listas manuales duplicadas).

## 7. Frontend Problems
N/A (se refleja en el editor).

## 8. Technical Debt
- Descripciones como recurso es-MX único, compartido con la doc de usuario.

## 9. Required Improvements
1. API de catálogo con metadatos completos + test de completitud.
2. Cerrar gaps de funciones de alto uso (fecha/texto/matemática/lógica/conversión).
3. Recurso es-MX único para descripciones/ejemplos.

## 10. Implementation Plan
1) `FunctionCatalog.Describe()` puro + registrar metadatos de cada función.
2) Auditar cobertura vs DevExpress; implementar gaps de alto uso.
3) Generar la referencia de usuario DESDE el catálogo.

## 11. Automated Test Plan
- Completitud: toda función registrada tiene firma/categoría/descripción/ejemplo no
  vacíos y es-MX; cada función evalúa su ejemplo al resultado documentado.

## 12. Manual Validation Checklist
- [ ] Editor: autocompletar lista funciones agrupadas con firma y ejemplo
- [ ] Funciones de fecha/texto/matemática/lógica/conversión de alto uso presentes
- [ ] El ejemplo de cada función evalúa al resultado mostrado
- [ ] La referencia de usuario coincide con el catálogo (misma fuente)
- [ ] Tema claro/oscuro (panel de funciones) · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Expressions/API.md` (catálogo público y cómo extenderlo).

## 14. User Documentation to produce
«Referencia de funciones» (GENERADA del catálogo, no manual).

## 15. Acceptance Criteria
- Catálogo con metadatos completos + test de completitud; gaps de alto uso cerrados;
  referencia generada de una sola fuente; checklist §12 con capturas; suite verde.
