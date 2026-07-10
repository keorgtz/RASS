# PART08 — Persistence (persistencia `.aedocx` de tablas)

## 1. Purpose
Auditar la persistencia `.aedocx` de tablas (`TableControlXmlSerializer`): round-trip fiel de
columnas (sizing/ancho/peso), filas (papel/alto), celdas (texto/wordwrap/span/estilos) y
`RepeatHeaderOnContinuation`, con determinismo del esquema y versionado/migraciones.

## 2. Current State
Implementado en `AegiReports.Plugins.TableControlXmlSerializer` (registrado como extensión):
`Write`/`Read` cubren `RepeatHeaderOnContinuation` (solo si `false`), columnas
(`Sizing`, `Width` para Fixed, `Weight` para Star≠1), filas (`Kind`, `Height`) y celdas
(`Text`, `WordWrap`, `ColumnSpan`, `StyleName`, `Style` embebido). «Cierra la persistencia de
tablas prevista desde la Fase 6». Falta: auditar campos nuevos (RowSpan si PART01, formato
condicional si PART07) y round-trip byte a byte de casos complejos.

## 3. Comparison against DevExpress
DevExpress serializa tablas en su `.repx`. AegiReports equivalente en `.aedocx`; la meta es
round-trip sin pérdida y migración ante cambios de esquema.

## 4. Missing Features
- Persistir `RowSpan` (si PART01 lo aprueba) y **formato condicional de celda** (PART07).
- Verificación de round-trip byte a byte con spans, estilos embebidos y grupos.
- Migración documentada si el esquema de tabla cambia (nuevo atributo → versión + upgrade).

## 5. UX Problems
N/A (infraestructura); su fallo se ve como pérdida al reabrir.

## 6. Backend Problems
- Cualquier campo nuevo del modelo (RowSpan, reglas condicionales) debe añadirse a
  `Write`/`Read` **y** a la migración; olvidarlo = pérdida silenciosa.
- Confirmar culture-invariance de `Weight`/`Width` (ya usa `InvariantCulture` en Weight).

## 7. Frontend Problems
N/A.

## 8. Technical Debt
- El serializador vive en `AegiReports.Plugins` (extensión), no en el core: mantener el
  registro incluido en todos los hosts (Demo/Server/Headless) — verificar paridad de hosts.

## 9. Required Improvements
1. Auditoría de round-trip byte a byte (spans, estilos, grupos, encabezado repetido).
2. Añadir campos nuevos (RowSpan/formato condicional) a Write/Read + migración.
3. Confirmar que el serializador está registrado en todos los hosts reales.

## 10. Implementation Plan
1) Suite de round-trip: construir tablas complejas → guardar → cargar → comparar modelo.
2) Extender esquema para campos nuevos con versión + migración.
3) Verificar registro del serializador en Demo/Server/Headless.

## 11. Automated Test Plan
- Round-trip: modelo → `.aedocx` → modelo idéntico (columnas/filas/celdas/spans/estilos).
- Documento de versión previa migra sin pérdida.
- `Width`/`Weight` culture-invariant (mismo XML en cualquier cultura).

## 12. Manual Validation Checklist
- [ ] Guardar reporte con tabla compleja y reabrir: idéntico (visor y designer)
- [ ] Spans, estilos por celda y encabezado repetido preservados
- [ ] Abrir un `.aedocx` de versión previa migra sin error
- [ ] La tabla persiste igual en Demo, Server y Headless
- [ ] Sin pérdida de estilos embebidos

## 13. Technical Documentation to produce
`Tables/Architecture.md` (esquema `.aedocx` de tabla, migraciones) — PART11.

## 14. User Documentation to produce
Nota en «Guardar y abrir» sobre compatibilidad de tablas — PART12.

## 15. Acceptance Criteria
- Round-trip byte a byte verificado; campos nuevos persistidos con migración; serializador
  registrado en todos los hosts; §12 con capturas; suite verde.
