# PART10 — Inspector (inspector del documento)

## 1. Purpose
El panel inspector: `DocumentInspectionModel` — fuentes usadas, imágenes, marcadores y
dimensiones del Render Tree del documento compuesto, como herramienta de diagnóstico
para el autor/soporte.

## 2. Current State
Funcional (Fase 24). Lista fuentes/imágenes/bookmarks/dimensiones a partir del Render
Tree.

## 3. Comparison against DevExpress
DevExpress no expone un inspector equivalente en el viewer estándar (es una ventaja
diferencial de AegiReports). El objetivo es que sea ÚTIL para diagnóstico: fuentes no
embebidas, imágenes pesadas, páginas fuera de tamaño.

## 4. Missing Features
- Marcas de advertencia: fuente no disponible/no embebida, imagen de baja resolución,
  contenido desbordado.
- Tamaño estimado por recurso (peso de imágenes) para diagnóstico de export pesado.
- Salto desde el inspector al elemento en la vista (clic en imagen → página/posición).

## 5. UX Problems
- Agrupar por categoría (Fuentes/Imágenes/Marcadores/Dimensiones) con conteos.
- Copiar la información (para reportes de soporte).

## 6. Backend Problems
- Recolección eficiente sobre el Render Tree sin duplicar recorridos.

## 7. Frontend Problems
- Panel legible en tema oscuro; valores numéricos con formato es-MX.

## 8. Technical Debt
- Ninguna crítica.

## 9. Required Improvements
1. Advertencias accionables (fuente/imagen/overflow) con severidad.
2. Peso estimado por recurso; salto al elemento.
3. Agrupación con conteos y copia a portapapeles.

## 10. Implementation Plan
1) Modelo: extender `DocumentInspectionModel` con advertencias y pesos + tests.
2) WPF: agrupación, salto, copia.
3) Recorrido manual con documento que tenga imágenes y fuentes variadas.

## 11. Automated Test Plan
- Inspección de un Render Tree conocido: fuentes/imágenes/dimensiones exactas;
  advertencias disparadas por casos construidos (fuente ausente, overflow).

## 12. Manual Validation Checklist
- [ ] Inspector lista fuentes, imágenes, marcadores y dimensiones reales
- [ ] Advertencias por fuente no embebida / imagen baja / overflow
- [ ] Clic en un recurso salta a su ubicación en la vista
- [ ] Peso estimado por imagen; conteos por categoría
- [ ] Copiar información
- [ ] Tema claro/oscuro · [ ] High DPI · [ ] Teclado · [ ] Mouse

## 13. Technical Documentation to produce
`Previewer/Architecture.md` (inspector), `Previewer/Troubleshooting.md` (diagnóstico
con el inspector).

## 14. User Documentation to produce
«Inspeccionar un documento» (fuentes, imágenes, diagnóstico).

## 15. Acceptance Criteria
- Advertencias accionables y salto al elemento operativos; datos exactos; checklist §12
  con capturas; suite verde.
