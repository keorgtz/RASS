# PART04 — Toolbox (catálogo de controles y drag & drop)

## 1. Purpose
El panel Toolbox: `ToolboxModel` (búsqueda/favoritos/recientes, catálogo materializado
por `ExtensionRegistry.CreateToolboxCatalog`) y el alta de controles en la superficie
por arrastre o doble clic, incluidos los controles de plugins de terceros.

## 2. Current State
Funcional (Fases 11/20/23). Los controles integrados y de plugins aparecen por el
mismo camino. Fase 28: estilos implícitos alcanzan el panel.

## 3. Comparison against DevExpress
DevExpress agrupa por categorías colapsables con iconos por control, arrastre con
ghost preview del control y tamaño default inteligente por tipo. AegiReports tiene
grupos y búsqueda; el ghost de arrastre y los tamaños default por tipo requieren
auditoría.

## 4. Missing Features
- Ghost/preview del control durante el arrastre (hoy: cursor + inserción al soltar).
- Tamaño default por tipo documentado (label vs tabla vs chart) — auditar tabla real.
- Iconos específicos por control de terceros (fallback genérico hoy).

## 5. UX Problems
- Favoritos/recientes: persistencia entre sesiones (verificar; si no, agregar).
- Estado vacío de búsqueda sin mensaje.

## 6. Backend Problems
- Ninguno conocido; `ToolboxModel` es puro y testeado.

## 7. Frontend Problems
- Doble clic inserta en posición fija; debería insertar en el centro visible de la
  banda activa.

## 8. Technical Debt
- Ninguna crítica.

## 9. Required Improvements
1. Ghost de arrastre (adorner con nombre+icono, snap visible).
2. Tabla de tamaños default por tipo en el modelo (testeable) + inserción centrada.
3. Persistencia de favoritos/recientes en %AppData%; icono por manifest del plugin.

## 10. Implementation Plan
1) Modelo: `ToolboxDefaults.SizeFor(kind)` + persistencia favoritos.
2) WPF: adorner de arrastre, inserción centrada con snap.
3) SDK: campo de icono opcional en la extensión (si falta, fallback actual).
4) Recorrido manual.

## 11. Automated Test Plan
- Tamaños default por tipo; favoritos round-trip; búsqueda (casos existentes +
  acentos es-MX); catálogo incluye extensiones de un plugin de prueba.

## 12. Manual Validation Checklist
- [ ] Arrastrar cada control integrado a la superficie (ghost + snap + tamaño correcto)
- [ ] Doble clic inserta centrado en banda activa
- [ ] Buscar «código» encuentra Barcode/QR; vacío muestra mensaje
- [ ] Favorito y reciente persisten tras reabrir
- [ ] Control de plugin (SampleSdkPlugin) aparece y se inserta
- [ ] Undo tras insertar elimina el control
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado (foco, Enter inserta) · [ ] Mouse

## 13. Technical Documentation to produce
`Designer/API.md` (controles de terceros en el toolbox), `Designer/Examples.md`
(plugin con control e icono).

## 14. User Documentation to produce
«Agregar controles al reporte» (toolbox, arrastre, favoritos).

## 15. Acceptance Criteria
- Todo control (integrado o de plugin) se inserta con ghost, snap y tamaño sensato;
  favoritos persisten; checklist §12 con capturas; suite verde.
