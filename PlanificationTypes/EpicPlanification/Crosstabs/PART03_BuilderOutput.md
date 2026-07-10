# PART03 — BuilderOutput (materialización a TableControl)

## 1. Purpose
Auditar y cerrar `CrosstabTableBuilder`: la materialización del `CrosstabResult` como
`TableControl` (encabezado esquina + columnas + total, cuerpo por fila, pie de totales), con
estilos, alineación y **formato numérico**. Es el puente por el que el crosstab hereda
paginación, preview y todos los exporters sin renderer nuevo.

## 2. Current State
Implementado: `Build` crea columnas Star, encabezado (esquina + claves + Total), filas de
cuerpo (clave + celdas de valor alineadas a la derecha + total de fila) y pie
(Total + subtotales + gran total). Estilos fijos: encabezado **negrita + fondo `#F2F3F7`**,
totales negrita. **Formato numérico fijo `"0.##"` en `InvariantCulture`** (opción
`NumberFormat` existe pero sin cultura es-MX ni moneda por medida). Sin zebra ni estilos
temáticos; sin formato condicional en el builder (solo dashboard, PART05).

## 3. Comparison against DevExpress
DevExpress estiliza el pivot con temas, bandas alternadas y formato por medida (moneda, %).
AegiReports: estructura correcta pero **estilo fijo y formato invariante** — por debajo del
mínimo comercial en presentación.

## 4. Missing Features
- Formato numérico con **cultura es-MX** y por medida (moneda/%/miles).
- Estilos temáticos: zebra de filas, estilo de esquina/encabezado configurable (reusar
  Tables PART07).
- Encabezados anidados si el engine pasa a multi-campo (PART01).

## 5. UX Problems
- Números en formato invariante (`1234.5` en vez de `1,234.5`) se ven poco profesionales.

## 6. Backend Problems
- Propagar formato/cultura desde las opciones al `ToString` de las celdas.
- La materialización debe seguir siendo determinista y reflejar el orden de PART02.

## 7. Frontend Problems
N/A (produce TableControl; el visor/exporters lo pintan).

## 8. Technical Debt
- El builder duplica decisiones de estilo que Tables PART07 va a generalizar (zebra, estilos
  por papel) — coordinar para no divergir.

## 9. Required Improvements
1. Formato numérico es-MX y por medida.
2. Estilos temáticos (zebra, encabezado configurable) reutilizando Tables.
3. Encabezados anidados si aplica multi-campo.

## 10. Implementation Plan
1) Propagar cultura/formato a las celdas; opciones por medida.
2) Aplicar estilos temáticos reutilizando el sistema de estilos de tabla.
3) Recorrido manual comparando visor y exportaciones.

## 11. Automated Test Plan
- Estructura de tabla (filas/columnas/celdas) correcta para un resultado dado.
- Formato es-MX aplicado; celdas `null` vacías; totales en su lugar.
- Zebra/estilos aplicados de forma determinista.

## 12. Manual Validation Checklist
- [ ] Crosstab con formato de moneda es-MX se ve profesional
- [ ] Zebra y estilo de encabezado aplicados
- [ ] Celdas sin datos vacías; totales correctos y resaltados
- [ ] Idéntico en visor y PDF; pagina bien (hereda de Tables)

## 13. Technical Documentation to produce
`Crosstabs/Architecture.md` (builder → TableControl, estilos, formato) — PART09.

## 14. User Documentation to produce
Tema «Dar formato y estilo a la tabla cruzada» — PART10.

## 15. Acceptance Criteria
- Formato es-MX/por medida; estilos temáticos; estructura correcta; §12 con capturas; suite
  verde.
