# Global Rules

> Reglas globales que OpenCode debe respetar **siempre**, en todos los proyectos.
> Filosofía base: **pragmatismo, simplicidad y código pensado para humanos.**

---

## 1. Filosofía general

- Priorizar **simplicidad antes que sobreingeniería**.
- Preferir **soluciones pragmáticas** sobre soluciones "académicamente correctas".
- Evitar **patrones enterprise innecesarios** y **abstracciones que no aportan valor real**.
- Preferir **código mantenible** por encima de código "ingenioso".
- Crear **código entendible para humanos**: nombres claros, intención evidente, flujo lineal.
- **No duplicar lógica** (DRY), pero sin crear abstracciones forzadas solo para evitar duplicación trivial.
- Antes de añadir una capa, una interfaz o un patrón, preguntar: *¿esto resuelve un problema real que existe hoy?* Si no, no añadirlo (YAGNI).
- Seguir siempre las **convenciones y patrones ya presentes en el proyecto** antes de introducir nuevos.

---

## 2. Arquitectura

- Preferir **arquitectura limpia (Clean Architecture)** con separación clara de responsabilidades:
  - Dominio independiente de infraestructura.
  - Dependencias apuntando hacia el dominio, nunca al revés.
- Mantener separación de capas (Dominio / Aplicación / Infraestructura / Presentación) **sin sobre-fragmentar**: tantas capas como el proyecto necesite, no más.
- Separar modelos de dominio de **DTOs / ViewModels**: no exponer entidades directamente en la API ni en la UI.
- Mantener cada componente con una **responsabilidad clara** (cohesión alta, acoplamiento bajo).

---

## 3. C# / .NET

- Usar **async/await correctamente**:
  - `async` de extremo a extremo; evitar `.Result`, `.Wait()` y `async void` (salvo event handlers).
  - Propagar `CancellationToken` cuando esté disponible.
- Aprovechar el **sistema de tipos**: nullable reference types activado, evitar `null` implícitos, modelar estados imposibles como imposibles.
- Preferir **inmutabilidad** donde sea natural (records, propiedades `init`).
- Manejo de errores **explícito**: no `catch` silenciosos; capturar lo que se puede manejar y dejar propagar el resto.
- Nunca poner **secretos hardcodeados** en el código (usar configuración / variables de entorno / secret manager).

---

## 4. Entity Framework

- Usar **IQueryable de forma eficiente**: construir la consulta y dejar que se traduzca a SQL.
- **Evitar `ToList()` prematuros**: no materializar antes de filtrar, proyectar o paginar.
- Proyectar a lo necesario con `Select` (evitar traer columnas/entidades que no se usan).
- **Evitar el problema N+1**: usar `Include`/proyecciones de forma consciente.
- **Paginar** siempre las consultas que puedan devolver muchos registros.
- Usar tracking solo cuando se necesite; preferir `AsNoTracking()` para lecturas.

---

## 5. UI / UX

- Usar **siempre el Design System MeridianUI** para todo lo relacionado con UI/UX.
- **Optimizar la UX** en todas las interfaces: flujos claros, mínima fricción, feedback inmediato.
- Cuidar **accesibilidad (a11y)**: contraste adecuado, navegación por teclado, etiquetas/aria correctas, foco visible.
- Diseñar **responsive** por defecto.
- Mantener consistencia visual y de comportamiento con los componentes y tokens de MeridianUI (no inventar estilos ad-hoc cuando ya existe un componente o token).
- Considerar siempre los estados de la interfaz: **loading, vacío, error y éxito.**

---

## 6. Documentación

- Generar **documentación clara siempre**, en **ambos formatos**: **Markdown** y **HTML**.
- La documentación debe ser precisa, concisa y centrada en lo importante (qué hace, por qué, cómo usarlo).
- Comentar el **porqué**, no el **qué**: el código debe explicar el "qué" por sí mismo.
- Mantener la documentación actualizada cuando cambia el comportamiento que describe.

---

## 7. Resúmenes diarios de implementación (obligatorio)

Cada vez que se genere una implementación:

- Crear/actualizar en la **raíz del proyecto** dentro de `AI/Summarys/` un **resumen del día**.
- **Un archivo por día**: si ya existe el del día actual, **actualizarlo**; si es un día nuevo, **crear uno nuevo** (para llevar seguimiento histórico).
- Formato de nombre sugerido: `AI/Summarys/summary-YYYY-MM-DD.html`.
- Los resúmenes deben ser **siempre HTML**, **muy visuales**, con información **clara, precisa e importante**:
  - Qué se implementó y por qué.
  - Archivos/áreas afectadas.
  - Decisiones técnicas relevantes.
  - Pendientes / próximos pasos.
- Mantener un estilo visual coherente con MeridianUI en estos resúmenes.

---

## 8. Calidad y consistencia

- Escribir código **consistente** con el estilo del archivo y proyecto que se está editando (naming, formato, idioma de comentarios).
- Validar las entradas en los **bordes** del sistema (API, formularios, integraciones).
- Añadir **pruebas donde aporten valor real** (lógica de negocio, casos límite), de forma pragmática y sin dogmatismo.
- Preferir funciones/métodos **cortos y enfocados**.
- Dejar el código **mejor de como se encontró**, sin refactors masivos no solicitados.
