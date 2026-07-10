# PART11 — TechnicalDocumentation (documentación técnica de gráficas)

## 1. Purpose
Generar TODA la documentación técnica declarada por PART01–PART10 del Epic Charts,
consolidada y coherente, en Markdown, para el desarrollador que construye, estiliza, enlaza a
datos, persiste o exporta gráficas.

## 2. Current State
No existe documentación técnica dedicada de gráficas; hay docs XML de API. Los PARTs
especificaron qué producir; este PART lo GENERA al final del Epic.

## 3. Comparison against DevExpress
DevExpress documenta el chart por API y escenarios. Meta equivalente para integradores.

## 4. Missing Features
Documentos declarados por los PARTs, aún inexistentes:
- `Architecture.md` (modelo, binding reporte vs dashboard, tipos incl. pie/área, escala/ejes,
  leyenda/etiquetas, geometría/hit-áreas, highlight, esquema `.aedocx`)
- `API.md` (construir gráficas por código: `ChartControl`/`ChartSeries`/`ChartDataPoint`,
  paleta, opciones)
- `Integration.md` (handler de layout, fragmentos de arco/polígono por backend, widget del
  dashboard, hit-áreas)
- `Limitations.md` (highlight por punto si se acota, XLSX, diferencias por formato)

## 5. UX Problems
N/A.

## 6. Backend Problems
- Reflejar el CÓDIGO REAL tras cerrar PART01–10 (tipos nuevos, negativos, etiquetas, binding).

## 7. Frontend Problems
N/A.

## 8. Technical Debt
- Ejemplos deben compilar (verificados en el Epic Documentation).

## 9. Required Improvements
Redactar los documentos con diagramas (regiones del chart, pipeline de fragmentos),
referencias a tipos reales y ejemplos verificables.

## 10. Implementation Plan
1) Tras cerrar PART01–10, redactar cada documento desde el código final.
2) Enlazar entre sí y desde el README; coordinar con Dashboard, Exporting y Expressions.

## 11. Automated Test Plan
- Verificación de enlaces; snippets compilables delegados al Epic Documentation.

## 12. Manual Validation Checklist
- [ ] Cada documento existe y cubre lo declarado por su PART origen
- [ ] Referencias a tipos coinciden con el código actual
- [ ] Un integrador construye una gráfica por código siguiendo API.md
- [ ] Diagramas legibles; enlaces internos funcionan

## 13. Technical Documentation to produce
(este PART ES la producción) — los documentos de §4.

## 14. User Documentation to produce
N/A (es PART12).

## 15. Acceptance Criteria
- Documentos completos, coherentes con el código final, enlazados; ejemplos verificables;
  revisión editorial pasada.
