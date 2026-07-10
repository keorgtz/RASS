# PART17 — DocumentPersistence (guardar/abrir .aedocx desde el estudio)

## 1. Purpose
La persistencia desde el estudio: guardar/abrir `.aedocx` (serializador de Core +
serializadores de controles de extensión de Fase 27), recientes, y el enrutado
Save/Open del estudio al host (Demo aporta los diálogos de archivo).

## 2. Current State
Funcional (Fases 3/27). Guardar con tabla/gráfica ya NO lanza (gap alto cerrado en
Fase 27). Fase 28: Open/Save vía `RunSafely`. Contrato del reader: elemento desconocido
del namespace propio = documento inválido con diagnóstico.

## 3. Comparison against DevExpress
DevExpress: lista de recientes, autosave/recuperación tras crash, y detección de
formato/versión al abrir. AegiReports: sin recientes en UI, sin autosave/recuperación,
versión de esquema validada (rechaza futura con diagnóstico).

## 4. Missing Features
- Lista de reportes recientes (menú Archivo → Recientes).
- Autosave/recuperación tras cierre inesperado (borrador en %AppData%/temp).
- Al abrir con extensiones sin plugin cargado → mensaje accionable (qué plugin falta).

## 5. UX Problems
- Guardar sin ruta previa debe pedir ruta; con ruta previa, guardar directo + «Guardar
  como».
- Feedback de éxito en status bar (ya existe en Demo; formalizar).

## 6. Backend Problems
- Autosave debe ser incremental y no bloquear; recuperación al arrancar detecta
  borrador huérfano.

## 7. Frontend Problems
- Diálogos de archivo son del host; el estudio expone eventos — documentar el
  contrato para hosts no-Demo.

## 8. Technical Debt
- Recientes/autosave son estado del host, no del documento — ubicar en una capa de
  «StudioSession» reutilizable.

## 9. Required Improvements
1. Recientes + Guardar/Guardar como con seguimiento de ruta actual (liga a PART01
   dirty tracking).
2. Autosave + recuperación con prueba de crash simulado.
3. Mensaje accionable al abrir documento con extensiones no registradas.

## 10. Implementation Plan
1) Host: servicio de recientes (persistente) + ruta actual + autosave temporizado.
2) Reader: mapear elemento desconocido → nombre de plugin sugerido (si es de un
   namespace conocido de plugin integrado).
3) Recorrido manual (guardar/abrir tabla+gráfica; recuperación).

## 11. Automated Test Plan
- Round-trip con todos los controles de extensión (existente Fase 27).
- Abrir sin plugin → diagnóstico que nombra el plugin.
- Recientes round-trip; autosave escribe/recupera borrador.

## 12. Manual Validation Checklist
- [ ] Guardar nuevo (pide ruta) y Guardar (usa ruta) y Guardar como
- [ ] Guardar reporte con TABLA y GRÁFICA → reabrir idéntico
- [ ] Abrir .aedocx con control de plugin SIN cargar el plugin → mensaje accionable
- [ ] Recientes lista y abre
- [ ] Cerrar la app abruptamente (kill) → al reabrir ofrece recuperar borrador
- [ ] Dirty tracking coherente con guardado (liga PART01)
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado (Ctrl+S/Ctrl+O) · [ ] Mouse

## 13. Technical Documentation to produce
`Designer/Integration.md` (contrato Save/Open para hosts), `Designer/Migration.md`
(esquema .aedocx, versiones), `Designer/Troubleshooting.md` (plugin faltante).

## 14. User Documentation to produce
«Guardar, abrir y recuperar reportes».

## 15. Acceptance Criteria
- Recientes + autosave/recuperación operativos; mensaje de plugin faltante; round-trip
  completo con extensiones; checklist §12 con capturas; suite verde.
