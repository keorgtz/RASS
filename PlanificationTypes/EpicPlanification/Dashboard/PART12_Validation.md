# PART12 — Validation (diagnósticos del dashboard)

## 1. Purpose
El `DashboardValidator` (AEGIDB001–010) y los diagnósticos vivos del diseñador: detectar
widgets sin binding, fuentes sin uso, referencias rotas, el widget Map sin proveedor
(AEGIDB010), y bloquear la publicación con errores.

## 2. Current State
Funcional (Fase 26). Validador con 10 códigos; diagnósticos vivos en el diseñador; la
publicación exige cero errores. Fase 28: `MeridianDialog.ShowWarning` al intentar
publicar con errores.

## 3. Comparison against DevExpress
DevExpress avisa de items mal configurados. AegiReports tiene 10 códigos; auditar la
cobertura (todos los estados inválidos tienen código), la navegabilidad de los
diagnósticos (clic → widget origen) y la distinción warning/error.

## 4. Missing Features
- Panel de diagnósticos navegable: clic en un diagnóstico enfoca el widget/fuente.
- Cobertura completa: cada configuración inválida posible tiene un código y mensaje.
- Distinción warning (publicable) vs error (bloquea) clara y consistente.

## 5. UX Problems
- Los diagnósticos deben ser accionables (qué falta y dónde), no genéricos.
- Conteo de errores/warnings visible en la barra de estado.

## 6. Backend Problems
- Validador puro; ampliar cobertura manteniendo determinismo y mensajes es-MX.

## 7. Frontend Problems
- Resaltar el widget con problema en el lienzo al seleccionar su diagnóstico.

## 8. Technical Debt
- Ninguna crítica.

## 9. Required Improvements
1. Panel de diagnósticos navegable + resaltado en lienzo.
2. Auditar/ampliar cobertura de los 10 códigos; mensajes accionables.
3. Conteo en barra de estado; warning vs error consistente.

## 10. Implementation Plan
1) Modelo: revisar cobertura de AEGIDB001–010; agregar códigos faltantes + tests.
2) WPF: panel navegable, resaltado, conteo.
3) Recorrido manual disparando cada diagnóstico.

## 11. Automated Test Plan
- Cada código AEGIDB se dispara con un caso construido; publicación bloqueada con error;
  warnings no bloquean; mensajes no vacíos y es-MX.

## 12. Manual Validation Checklist
- [ ] Widget sin binding → diagnóstico accionable; clic enfoca el widget
- [ ] Fuente sin uso → warning; referencia rota → error
- [ ] Map sin proveedor → AEGIDB010 con aviso honesto
- [ ] Publicar con error → bloqueado con MeridianDialog; con solo warnings → permite
- [ ] Conteo de errores/warnings en la barra de estado
- [ ] Corregir el problema limpia el diagnóstico en vivo
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Dashboard/Architecture.md` (validador, códigos), `Dashboard/Troubleshooting.md`
(catálogo AEGIDB001–010).

## 14. User Documentation to produce
«Validar un dashboard» (diagnósticos y cómo resolverlos).

## 15. Acceptance Criteria
- Cobertura completa de diagnósticos accionables y navegables; publicación bloqueada solo
  por errores; checklist §12 con capturas; suite verde.
