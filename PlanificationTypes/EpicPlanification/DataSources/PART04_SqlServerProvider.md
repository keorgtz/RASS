# PART04 — SqlServerProvider (SQL Server)

## 1. Purpose
La fuente SQL Server: `SqlDataSource` sobre `ISqlCommandExecutor`
(`SqlClientCommandExecutor` real con Microsoft.Data.SqlClient parametrizado
anti-inyección + `InMemorySqlCommandExecutor` sembrable para test/Demo offline con el
MISMO contrato), con schema-only, cancelación, timeout y stored procedures.

## 2. Current State
Funcional (Fase 22). Contrato único `ISqlCommandExecutor`; el ejecutor real y el
sembrado son intercambiables (la cadena «Demo» usa el sembrado offline). Parametrizado
anti-inyección; `HotelDatabase.SeedMetadata` registra las mismas consultas del proveedor.

## 3. Comparison against DevExpress
DevExpress SQL Data Source: conexión, consulta/proc, parámetros, y builder visual.
AegiReports equivalente + intérprete offline honesto; auditar el manejo de credenciales,
timeouts configurables, reintentos, tipos SQL menos comunes y stored procs con parámetros
de salida.

## 4. Missing Features
- Timeout y política de reintentos configurables por fuente.
- Stored procs con parámetros de salida / múltiples result sets (alcance a definir).
- Manejo seguro de credenciales (no en claro en la definición/logs — coordina Security).
- Mapeo completo de tipos SQL (datetime2/decimal(p,s)/uniqueidentifier/varbinary).

## 5. UX Problems
- Prueba de conexión con mensaje claro (host/credencial/permiso); schema-only rápido.
- Errores de conexión → diálogo Meridian accionable, nunca excepción cruda.

## 6. Backend Problems
- Cancelación real que aborta el comando; timeout que no cuelga la UI.
- Anti-inyección: TODO parametrizado (auditar con Epic Security); nombres con corchetes
  escapados.

## 7. Frontend Problems
N/A (se refleja en el wizard/query builder).

## 8. Technical Debt
- Un solo código de descubrimiento (seed = real) — mantener disciplina.

## 9. Required Improvements
1. Timeout/reintentos configurables; cancelación robusta.
2. Manejo seguro de credenciales; mapeo de tipos completo.
3. Stored procs avanzados (salida/múltiples result sets) decididos.

## 10. Implementation Plan
1) Modelo: timeout/reintentos, credenciales seguras, tipos + tests con seed.
2) Prueba de conexión y schema-only con mensajes claros.
3) Recorrido manual con seed (offline) y con SQL real si disponible.

## 11. Automated Test Plan
- Con `InMemorySqlCommandExecutor`: parametrización, schema-only, cancelación, timeout;
  mapeo de tipos; stored proc básico; nombres con caracteres especiales.

## 12. Manual Validation Checklist
- [ ] Cadena «Demo» → ejecutor sembrado offline; consulta hotelera devuelve filas
- [ ] Probar conexión (éxito/credencial inválida/host inexistente) con mensaje claro
- [ ] Schema-only descubre columnas sin traer datos
- [ ] Cancelar una consulta lenta; timeout no cuelga
- [ ] Stored proc con parámetros
- [ ] Error de conexión → diálogo Meridian accionable
- [ ] SQL real (si disponible) con credenciales seguras

## 13. Technical Documentation to produce
`DataSources/Architecture.md` (SQL Server, ISqlCommandExecutor),
`DataSources/Security.md` (credenciales, parametrización) — coordina Epic Security.

## 14. User Documentation to produce
«Conectar a SQL Server» (conexión, consulta/proc, parámetros, offline Demo).

## 15. Acceptance Criteria
- Timeout/cancelación/reintentos robustos; credenciales seguras; tipos completos;
  parametrización auditada; checklist §12 con capturas; suite verde.
