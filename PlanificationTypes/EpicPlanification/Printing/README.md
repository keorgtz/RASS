# Epic: Printing — backlog

**Prioridad:** P1 · **Complejidad:** Media · **Completitud (8 puertas):** 40 % ·
**Estado:** Backlog

## Alcance

`AegiReports.Printing` (DocumentPrinter, PrintOptions, PrintSequence copies/collate),
el diálogo de impresión del visor, la impresión desde estudio/Demo y la impresión
térmica (documentos continuos de 80 mm).

## Objetivos

1. Paridad práctica con la impresión de DevExpress: selección de impresora, rango,
   copias, collate, orientación/tamaño — y **escalado de impresión** (límite declarado
   en ADR-0026: decidir cierre o exclusión formal).
2. Impresión térmica validada con hardware real o simulador documentado.
3. Manejo de errores de spooler/impresora sin excepciones crudas.

## Dependencias

- Previewer (diálogo de impresión vive en el visor).

## PARTs planificados (9)

- PART01_PrintPipeline — DocumentPrinter, media por página, orientación
- PART02_PrintDialog — impresoras del sistema, rango, copies/collate, preview
- PART03_PrintScaling — escalar al papel o exclusión formal 1.0
- PART04_ThermalPrinting — 80 mm continuo, cortes, validación real
- PART05_ErrorHandling — spooler, impresora offline, cancelación
- PART06_HostIntegration — visor/estudio/Demo con la misma experiencia
- PART07_Performance — documentos largos, memoria durante spool
- PART08_TechnicalDocumentation
- PART09_UserDocumentation
