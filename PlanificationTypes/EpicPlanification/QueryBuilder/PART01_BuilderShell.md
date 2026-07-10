# PART01 — BuilderShell (control/ventana del query builder)

## 1. Purpose
El contenedor del diseñador visual de consultas: `QueryBuilderControl` (superficie +
paneles) y `QueryBuilderWindow` (modal cuyo Aceptar exige cero errores de validación),
su ciclo de vida (carga de `QueryBuilderContext` = esquema + ejecutor), y su apertura
desde el wizard SQL, el dashboard designer y el Demo.

## 2. Current State
Funcional (Fase 25). Control con explorer + canvas + tabs + SQL + resultados;
`QueryBuilderWindow` modal con `Query` de salida solo si no hay errores. Fase 28:
control theme Meridian aplicado, apertura sin fallos mudos.

## 3. Comparison against DevExpress
DevExpress Query Builder: ventana con panel de tablas, área de diagrama, grid de
columnas y preview, con Aceptar/Cancelar y validación. AegiReports equivalente en
estructura; auditar la persistencia del layout interno (anchos de paneles), estados de
carga del contexto y el manejo de un contexto sin conexión.

## 4. Missing Features
- Recordar el layout interno del builder (anchos de explorer/canvas/tabs) entre usos.
- Indicador de contexto: qué fuente/esquema está activo (SQL Server real vs Demo vs
  objetos).
- Título/encabezado con el nombre de la consulta en edición.

## 5. UX Problems
- Carga de esquema pesada (SQL real) debe mostrar progreso no bloqueante con estado
  terminal (lección Fase 28).
- Aceptar deshabilitado con errores debe explicar POR QUÉ (resumen de diagnósticos).

## 6. Backend Problems
- `QueryBuilderContext`: verificar liberación de recursos del ejecutor real al cerrar.

## 7. Frontend Problems
- Confirmar Dispose de suscripciones (diagnósticos vivos, SQL) al cerrar la ventana.

## 8. Technical Debt
- El contrato de apertura (factory de contexto) se comparte entre wizard/dashboard/Demo;
  documentarlo como parte del SDK de hosting.

## 9. Required Improvements
1. Persistencia del layout interno + indicador de contexto activo.
2. Aceptar con resumen de por qué está bloqueado; progreso terminal en carga.
3. Título con nombre de consulta.

## 10. Implementation Plan
1) Host: layout persistente del builder (JSON) + indicador de contexto.
2) Shell: progreso de carga terminal, resumen de bloqueo en Aceptar, título.
3) Recorrido manual desde los 3 puntos de entrada (wizard, dashboard, Demo).

## 11. Automated Test Plan
- `QueryBuilderWindow`: Aceptar retorna `Query` solo con cero errores; Cancelar retorna
  null; layout round-trip; contexto offline vs real seleccionado correctamente.

## 12. Manual Validation Checklist
- [ ] Abrir desde el Demo («Consultas visuales…»), desde el wizard SQL y desde el
      dashboard (diseñador de fuentes)
- [ ] Carga de esquema con progreso terminal
- [ ] Indicador de contexto activo visible
- [ ] Aceptar bloqueado con errores muestra el porqué; con cero errores retorna la consulta
- [ ] Cancelar no produce efectos
- [ ] Cerrar y reabrir recuerda el layout interno
- [ ] Cerrar libera recursos (abrir/cerrar 10 veces sin fuga)
- [ ] Tema claro/oscuro · [ ] High DPI (150 %) · [ ] Solo teclado · [ ] Mouse

## 13. Technical Documentation to produce
`QueryBuilder/Architecture.md` (shell + contexto), `QueryBuilder/Integration.md`
(factory de contexto para hosts).

## 14. User Documentation to produce
«El diseñador de consultas» (tour), «Abrir el diseñador de consultas».

## 15. Acceptance Criteria
- Aceptar/Cancelar con contrato claro; layout persistente; carga con progreso terminal;
  sin fugas; checklist §12 con capturas; build 0/0; suite verde.
