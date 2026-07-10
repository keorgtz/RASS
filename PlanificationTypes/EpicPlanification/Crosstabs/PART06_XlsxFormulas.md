# PART06 — XlsxFormulas (export XLSX con fórmulas)

## 1. Purpose
Auditar y cerrar `CrosstabXlsxBuilder`: exportar el crosstab a una hoja XLSX con encabezados
con estilo, **celdas numéricas reales** y **totales como fórmulas nativas `SUM`** —
un libro recalculable en Excel, no una captura. Verificar la fidelidad y la corrección de las
fórmulas frente a los agregados.

## 2. Current State
Implementado: encabezado (esquina + claves + Total), cuerpo con celdas numéricas (o vacías si
`null`) y **total de fila = `SUM(fila)`**, pie con **totales de columna y gran total =
`SUM(columna)`**. **Problema de corrección:** las fórmulas asumen que el total es una **suma**;
con agregados `Average`/`Min`/`Max` (PART02) el `SUM` es incorrecto — debe usar
`AVERAGE`/`MIN`/`MAX` o recomputar. Estilos fijos (encabezado/valor/total).

## 3. Comparison against DevExpress
DevExpress exporta pivotes a Excel con celdas nativas y subtotales coherentes con el agregado.
AegiReports tiene el enfoque correcto (fórmulas nativas) pero **la fórmula no sigue el
agregado** — gap de corrección heredado de PART02.

## 4. Missing Features
- Fórmula de total **según el agregado** (`AVERAGE`/`MIN`/`MAX`, no siempre `SUM`).
- Formato numérico de celda (moneda/%/es-MX) en la hoja (coordina con PART03).
- Fidelidad de estilos (fondo de encabezado, bordes) verificada al abrir en Excel.

## 5. UX Problems
- Un usuario que recalcula en Excel ve un «total» que no coincide con el agregado del pivote.

## 6. Backend Problems
- Emitir la función Excel correcta por agregado; para Count, contar celdas no vacías.
- Referencias de celda robustas ante filas/columnas de totales incluidas/excluidas.

## 7. Frontend Problems
N/A (export headless).

## 8. Technical Debt
- La fórmula fija `SUM` es la contraparte del bug de «total siempre suma» (PART02); cerrarlas
  juntas.

## 9. Required Improvements
1. Fórmula de total según el agregado de la definición.
2. Formato numérico de celda en la hoja.
3. Golden de la hoja (valores + fórmulas + estilos).

## 10. Implementation Plan
1) Mapear agregado → función Excel; emitir la fórmula correcta.
2) Aplicar formato numérico; verificar referencias.
3) Recorrido manual abriendo el XLSX en Excel y recalculando.

## 11. Automated Test Plan
- Total de fila/columna usa la función correcta por agregado.
- Celdas `null` vacías; referencias de fórmula correctas.
- Golden del `XlsxSheet` (celdas, fórmulas, estilos) estable.

## 12. Manual Validation Checklist
- [ ] Abrir el XLSX en Excel: totales recalculan y coinciden con el pivote
- [ ] Con Average, el total es promedio (no suma)
- [ ] Formato de moneda/es-MX visible en las celdas
- [ ] Encabezados con estilo y bordes fieles

## 13. Technical Documentation to produce
`Crosstabs/Architecture.md` (export XLSX, fórmulas por agregado) — PART09.

## 14. User Documentation to produce
Tema «Exportar la tabla cruzada a Excel» — PART10.

## 15. Acceptance Criteria
- Fórmulas correctas por agregado; formato numérico; golden verde; §12 con captura de Excel
  recalculando; suite verde.
