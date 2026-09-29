# Changelog

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el versionado sigue [SemVer](https://semver.org/lang/es/).

## [1.7.0] - 2026-09-29

### Añadido

- Botón «Compartir» en cada día (Web Share API con respaldo de portapapeles) que envía el hook definido en el frontmatter (`compartir`) + el enlace; eventos `compartir_click` y `compartir_exito`
- Botón «Marcar como completado» con progreso en `localStorage`: insignia ✓ en la lista del plan y contador «N de 5» en la portada; evento `dia_completado`
- Cierre del plan: `acceso_hasta` en `content/plan.yaml` (2026-10-05). Desde esa fecha el plan queda bloqueado y la portada, la lista y los días muestran el mensaje «El plan ha terminado… ¡mantente atento!» sin CTA ni invitación a suscribirse
- Suite e2e ampliada a 23 pruebas con un proyecto dedicado al estado de plan terminado

## [1.6.0] - 2026-09-29

### Añadido

- Accesibilidad: enlace «Saltar al contenido», `focus-visible` en enlaces de navegación, `aria-current` en el enlace activo, foco automático en el `h1` tras cada navegación y contraste AA corregido en textos atenuados
- SEO: `sitemap.xml`, `robots.txt`, URLs canónicas y datos estructurados JSON-LD (Evento del cierre y BreadcrumbList por día)
- Suite e2e con Playwright (14 pruebas, desktop + móvil) integrada al CI de GitHub Actions
- El 404 de días bloqueados muestra la fecha de desbloqueo
- React Compiler habilitado (`reactCompiler: true`)

### Corregido

- Meta `theme-color`: al volver a «sistema» se restaura el comportamiento por `prefers-color-scheme` de cada meta (antes quedaba fijo en el último color forzado)
- `FAKE_TODAY` ya no puede congelar fechas en producción (opte-in explícito con `ALLOW_FAKE_TODAY=1`)
- `scripts/schedule-reminders.mjs`: títulos leídos desde el contenido (sin duplicación), idempotente (omite días ya programados) y con manejo de errores
- `Analytics` envuelto en `Suspense` (evita fallo si una página pasara a ser estática)

### Cambiado

- Nomenclatura unificada: la página del plan se llama «Plan» (nav, título, breadcrumbs y enlaces de vuelta)
- Etiqueta inerte «Día 1» eliminada de la navegación del primer día

## [1.5.2] - 2026-09-29

### Cambiado

- Logo LCDR con variante por tema: `logo-lcdr--light.png` en esquema claro y `logo-lcdr--dark.png` en oscuro (componente `BrandLogo`, header y footer)

## [1.5.1] - 2026-09-29

### Añadido

- Logo de LCDR en la barra superior (junto al wordmark) y en el pie de página

## [1.5.0] - 2026-09-28

### Añadido

- Eventos de analítica: `suscribirse_visto`, `suscribirse_click`, `dia_scroll` (50/100 %), `cta_click`, `dia_bloqueado` y `plan_completado`
- Detección de suscripción bloqueada (ad-blockers, Brave, modo incógnito): si el SDK de OneSignal no inicializa, el evento `suscribirse` registra `resultado: bloqueado` y el botón se reemplaza por un mensaje explicativo
- El evento `suscribirse` ahora cubre también `no_soportado` y `sin_configurar`

## [1.4.0] - 2026-09-28

### Añadido

- Analítica con Umami (OSS, sin cookies): vistas de página en navegación suave y eventos personalizados `dia_abierto`, `suscribirse`, `tema_cambiado` y `visita_notificacion`

### Corregido

- Recordatorios: ancla `send_after` a mediodía UTC para evitar entrega un día antes en zonas al oeste de UTC-4
- Los enlaces de los recordatorios incluyen `?origen=notificacion` para medir llegadas desde notificaciones

### Cambiado

- Revertido el desbloqueo temporal del día 1 (día de lanzamiento: el acceso vuelve a regirse por las fechas reales)

## [1.3.1] - 2026-09-28

### Cambiado

- Portada de la serie actualizada (`portada.jpeg`, 1080×1440) y dimensiones OG/Homepage ajustadas

## [1.3.0] - 2026-09-27

### Añadido

- Previsualización de enlaces (Open Graph/Twitter) con la portada de cada día al compartir en WhatsApp y otras redes; la página de inicio comparte la portada de la serie (`metadataBase` configurado vía `NEXT_PUBLIC_SITE_URL`)

### Corregido

- Fechas mostradas un día antes (ej. «Día 1 · Domingo»): el formateo ahora trata las fechas como etiquetas de calendario en UTC en lugar de convertirlas a la zona horaria del plan

## [1.2.0] - 2026-09-27

### Añadido

- Transición de páginas tipo iOS (push/slide) con orientación: avanzar entra desde la derecha empujando la página anterior, volver entra desde la izquierda; la dirección se infiere de la jerarquía de rutas (lista → día, día siguiente, volver a la lista o al inicio)
- Los clics durante la animación ya no se pierden (`pointer-events: none` en la superposición de view transitions)

## [1.1.1] - 2026-09-27

### Cambiado

- Copia de la serie: «hombres» en lugar de «varones», «Noche de Adoración para Hombres», cita de Nehemías 2:17 (NTV), descripción renovada y nombre de iglesia «Comunidad de Fe · La Casa del Rey»

## [1.1.0] - 2026-09-27

### Añadido

- Barra superior fija (sticky) con fondo translúcido y desenfoque, adaptada a ambos temas
- Desbloqueo por zona horaria del visitante: cada día se abre a la medianoche local del visitante (cookie `tz`, con America/Caracas como respaldo); la cuenta regresiva del inicio también usa la medianoche local

## [1.0.0] - 2026-09-26

### Cambiado

- Revertido el desbloqueo temporal del día 1: el acceso vuelve a regirse por las fechas del plan (día 1 se desbloquea el lunes 28 de septiembre a la medianoche, hora de Caracas)

## [0.4.1] - 2026-09-26

### Corregido

- `scripts/schedule-reminders.mjs`: acepta `NEXT_PUBLIC_ONESIGNAL_APP_ID`, usa filtros en lugar del segmento "Subscribed Users" (evita el error "All included players are not subscribed" y se evalúa al enviar, incluyendo suscriptores futuros), agrega `send_after` por día para que cada recordatorio llegue en su fecha y no todos a la vez, y reporta errores de la API de OneSignal
- Script npm `reminders` carga `.env` automáticamente (`--env-file-if-exists`)

## [0.4.0] - 2026-09-26

### Añadido

- Tema oscuro y claro con paleta cálida (papel/tinta/terracota) mediante variables CSS
- Tema automático según la preferencia del sistema (media query, sin parpadeo)
- Toggle de tres estados en la barra superior: sistema → claro → oscuro
- Persistencia de la elección en cookie, renderizada en el servidor (sin flash ni errores de hidratación)
- Sincronización del meta `theme-color` con el tema activo

### Corregido

- Error de hidratación de React (#418) en `SubscribeButton` y riesgo en `Countdown`: el estado dependiente del entorno ahora se resuelve después del montaje

## [0.3.1] - 2026-09-26

### Cambiado

- Portadas a ancho completo con relación 2:3, recorte priorizando la parte inferior de la imagen (`object-cover object-bottom`) en la portada de la serie y en cada día

## [0.3.0] - 2026-09-26

### Añadido

- Portadas de los devocionales (`public/images/`): portada de la serie en el hero de la página de inicio, portada de cada día en su página y miniaturas en la lista de días

## [0.2.1] - 2026-09-26

### Corregido

- Desbordamiento horizontal del título del hero en móviles y tablets (h1 ahora usa flex-wrap)
- Header: truncado del wordmark y navegación compacta en pantallas pequeñas
- Cuenta regresiva: tamaños responsivos para pantallas de 320 px
- CTA del hero: ancho completo en móvil y texto que ya no se desborda
- Áreas seguras (`safe-area-inset`) y `min-h-dvh` para PWA en iOS
- Objetivos táctiles de 44 px en la navegación anterior/siguiente del día

## [0.2.0] - 2026-09-26

### Añadido

- Sitio web completo del devocional «Consagración⇒Reconstrucción» (Next.js 16)
- Página de inicio con CTA según la fase del plan y cuenta regresiva
- Página «Los 5 días» (`/dias`) con estados bloqueado / disponible / hoy
- Páginas de día (`/dias/1` a `/dias/5`); los días futuros devuelven 404
- Lógica de fechas con zona horaria America/Caracas + 16 pruebas (vitest)
- Suscripción a recordatorios web push vía OneSignal (8:00 PM hora local)
- Script `scripts/schedule-reminders.mjs` para programar los 5 recordatorios
- Manifest PWA e íconos para soporte de iOS
- Transiciones de página con la API View Transitions
- CI en GitHub Actions (lint + test + build)

## [0.1.0] - 2026-09-26

### Añadido

- Arranque del proyecto: git, OpenSpec y propuesta de cambio `devocionales-web`
