# Changelog

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el versionado sigue [SemVer](https://semver.org/lang/es/).

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
