# PART08 — ErrorContracts (contratos de error y seguridad de conexión)

## 1. Purpose
La experiencia de error uniforme de las fuentes: mensajes accionables (host/credencial/
permiso/archivo/colección), manejo seguro de cadenas de conexión (nunca en claro en
logs/crash reports) y la traducción de excepciones de proveedor a diagnósticos
profesionales.

## 2. Current State
Parcial. El Demo y el wizard muestran mensajes; Fase 28 encauzó errores por `RunSafely`/
`MeridianDialog`. Falta una política transversal: cada proveedor traduce sus fallos a
mensajes accionables y las credenciales no aparecen en diagnósticos.

## 3. Comparison against DevExpress
DevExpress muestra errores de conexión con detalle. AegiReports debe ser al menos
equivalente y además NO filtrar credenciales. Auditar cada proveedor: qué mensaje da
ante host inexistente, credencial inválida, permiso denegado, archivo faltante,
colección inexistente, timeout.

## 4. Missing Features
- Catálogo de errores por proveedor con mensaje accionable es-MX (no el `Exception.Message`
  crudo del driver).
- Redacción de credenciales en cualquier diagnóstico/log/crash report (masking de la
  cadena de conexión).
- Distinción error transitorio (reintentar) vs permanente (corregir config).

## 5. UX Problems
- Los errores llegan como `MeridianDialog.ShowError` con detalle técnico expandible; el
  RESUMEN debe ser humano, el DETALLE técnico.
- Nunca exponer contraseñas en el detalle del diálogo.

## 6. Backend Problems
- Masking: la `DataSourceDefinition`/logs deben ocultar `Password=...`/tokens.
- Mapear códigos de error del driver (SqlException numbers) a categorías accionables.

## 7. Frontend Problems
- El detalle técnico del diálogo debe venir ya con credenciales enmascaradas.

## 8. Technical Debt
- Coordina con Epic Security (PART05 SecretsHandling) — este PART es la vista de datos.

## 9. Required Improvements
1. Catálogo de errores accionables por proveedor (es-MX).
2. Masking de credenciales en definición/logs/crash/diálogos.
3. Clasificación transitorio/permanente + sugerencia.

## 10. Implementation Plan
1) Modelo: traducción de excepciones→diagnóstico por proveedor; masking central.
2) Verificar TODOS los puntos que serializan/loguean la definición.
3) Recorrido manual forzando cada tipo de error.

## 11. Automated Test Plan
- Cada error de proveedor mapea al mensaje accionable esperado; masking oculta
  password/token en definición/log/crash; clasificación transitorio/permanente.

## 12. Manual Validation Checklist
- [ ] Host inexistente / credencial inválida / permiso denegado → mensaje accionable
- [ ] Archivo JSON faltante / colección Object inexistente → mensaje claro
- [ ] Timeout → clasificado transitorio con sugerencia
- [ ] El detalle del diálogo NO muestra la contraseña
- [ ] Crash report / log no contienen credenciales
- [ ] Errores nunca como excepción cruda (siempre MeridianDialog)

## 13. Technical Documentation to produce
`DataSources/Troubleshooting.md` (catálogo de errores por proveedor),
`DataSources/Security.md` (masking) — coordina Epic Security.

## 14. User Documentation to produce
«Resolver problemas de conexión» (mensajes comunes y solución).

## 15. Acceptance Criteria
- Errores accionables por proveedor; cero credenciales filtradas en logs/diálogos/crash;
  clasificación transitorio/permanente; checklist §12 con capturas; suite verde.
