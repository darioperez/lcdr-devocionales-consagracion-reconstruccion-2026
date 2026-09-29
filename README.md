# Consagración⇒Reconstrucción

Sitio web público para el plan devocional de 5 días para hombres basado en la historia de Nehemías (lunes 28 de septiembre – viernes 2 de octubre de 2026).

- **Homepage** (`/`): descripción de la serie, cuenta regresiva y CTA según la fase del plan
- **Los 5 días** (`/dias`): lista de los días con estados bloqueado / disponible / hoy
- **Día** (`/dias/[1-5]`): reflexión, acción del día y oración; los días futuros devuelven 404
- **Recordatorios**: push vía OneSignal a las 8:00 PM hora local de cada suscriptor

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · `gray-matter` + `react-markdown` para el contenido · `vitest` para pruebas · OneSignal (Web Push) · desplegado en Vercel.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run test       # pruebas unitarias (lógica de fechas, navegación, formato)
npm run test:e2e   # pruebas end-to-end con Playwright (requiere build previo)
npm run lint
npm run build
```

> Tip: para probar estados de días específicos sin esperar a la fecha real,
> inicia el server con `FAKE_TODAY=2026-09-30 npm run dev`. En producción
> `FAKE_TODAY` se ignora salvo que `ALLOW_FAKE_TODAY=1` (usado por las
> pruebas e2e).

## Contenido

Todo el contenido vive en `content/`:

- `content/plan.yaml` — título, fechas (`inicio`/`fin`), `acceso_hasta` (fecha de cierre del plan), `timezone` (America/Caracas), cierre e iglesia
- `content/dias/dia-1.md` … `dia-5.md` — frontmatter (`dia`, `titulo`, `pasaje`, `imagen`, `compartir`) + secciones `## Reflexión`, `## Acción del día`, `## Oración`

Reglas de acceso (implementadas en `src/lib/plans.ts`):

- Un día se desbloquea a la medianoche de su fecha en la **zona horaria del visitante** (detectada con una cookie `tz` en la primera visita); si no se conoce, se usa la zona horaria del plan (America/Caracas)
- Los días pasados y el actual son accesibles; los futuros muestran estado bloqueado y devuelven 404
- Desde `acceso_hasta` el plan se bloquea por completo: los días devuelven 404 y la portada y el plan muestran un mensaje de despedida («El plan ha terminado… ¡mantente atento!») sin CTA ni invitación a suscribirse
- Añadir un nuevo plan = editar fechas y reemplazar los 5 archivos de días

## Progreso y compartir

- Cada día tiene un botón **«Marcar como completado»**; el progreso se guarda en `localStorage` (`src/lib/progress.ts`) y se refleja como insignia ✓ en la lista del plan y en el contador «N de 5» de la portada
- El botón **«Compartir»** usa la Web Share API (con respaldo de portapapeles) y envía el hook definido en el campo `compartir` de cada día + el enlace

## Recordatorios (OneSignal)

1. Crea una app gratuita en [OneSignal](https://onesignal.com) → **Web Push** → integración **Custom Code**
2. Copia el **App ID** a `NEXT_PUBLIC_ONESIGNAL_APP_ID`
3. En *Settings → Keys & IDs* genera una **REST API Key** y guárdala en `ONESIGNAL_REST_API_KEY`
4. El sitio ya incluye el SDK (`src/app/layout.tsx`), el worker (`public/OneSignalSDKWorker.js`), el botón de suscripción (`src/components/subscribe-button.tsx`) y el manifest PWA para iOS
5. Programa los 5 recordatorios (vista previa primero):

```bash
npm run reminders            # vista previa
npm run reminders -- --send  # programa los 5 envíos
npm run reminders -- --send --days=3,4,5  # solo algunos días
```

Cada recordatorio se entrega a las **8:00 PM en la zona horaria local del suscriptor** (anclado a mediodía UTC de su fecha para evitar entregas un día antes) y abre la página del día con `?origen=notificacion`. El script es idempotente: omite los días que ya tienen un recordatorio activo, y lee los títulos directamente de `content/dias/*.md`.

### Notas del plan gratuito de OneSignal

- Máximo 10.000 suscriptores por envío web push
- Registros inactivos 18 meses se eliminan; no incluye DPA ni soporte prioritario
- Confirma en el dashboard que **Timezone Delivery** está disponible en tu app gratuita

### iOS

En iPhone/iPad las notificaciones requieren iOS 16.4+ y agregar el sitio a la pantalla de inicio (Compartir → Añadir a pantalla de inicio). El botón de suscripción muestra esta indicación cuando el navegador no soporta push.

## Analítica (Umami)

El sitio usa [Umami](https://umami.is) (open source, sin cookies ni banner de consentimiento):

- `NEXT_PUBLIC_UMAMI_WEBSITE_ID` en Vercel habilita el tracking (`src/components/analytics.tsx` carga el script y registra vistas en cada navegación, incluida la navegación suave)
- Eventos personalizados:

| Evento | Datos | Cuándo |
|---|---|---|
| `dia_abierto` | `{ dia }` | Al abrir la página de un día |
| `plan_completado` | — | Al abrir el día 5 |
| `dia_scroll` | `{ dia, profundidad: 50\|100 }` | Progreso de lectura del artículo |
| `dia_bloqueado` | `{ dia }` | Visita a un día aún bloqueado (404) |
| `cta_click` | `{ fase, destino }` | Clic en el CTA del hero |
| `suscribirse_visto` | `{ pagina }` | Se muestra la invitación a suscribirse |
| `suscribirse_click` | — | Clic en «Suscribirme» |
| `suscribirse` | `{ resultado: exito \| denegado \| bloqueado \| no_soportado \| sin_configurar }` | Estado terminal de la suscripción |
| `tema_cambiado` | `{ tema }` | Cambio de tema claro/oscuro/sistema |
| `visita_notificacion` | `{ dia }` | Llegada desde un recordatorio (`?origen=notificacion`) |

El estado `bloqueado` de suscripción se detecta cuando el SDK de OneSignal no inicializa en 10 s (o 6 s tras un clic) — típico de bloqueadores de anuncios, Brave o modo incógnito — y muestra un mensaje explicativo en lugar del botón.

## Despliegue en Vercel

1. Crea un repositorio en GitHub y sube este proyecto
2. Importa el repo en Vercel (framework: Next.js, root: por defecto)
3. Variables de entorno: `NEXT_PUBLIC_ONESIGNAL_APP_ID` y `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (el resto solo se usan localmente o en scripts)
4. Despliega; luego corre `npm run reminders -- --send` con `BASE_URL` apuntando a la URL de producción

## Versiones (semver)

- Tags git con formato `vX.Y.Z`: `v0.x` para el desarrollo previo al lanzamiento, `v1.0.0` cuando el sitio esté en producción con el plan en curso
- Commits convencionales (`feat:`, `fix:`, `chore:`, `docs:`) para que el historial y los tags sean legibles

## Flujo con OpenSpec

El proyecto usa OpenSpec (`openspec/`): la propuesta del sitio vive en `openspec/changes/devocionales-web/`. Después del lanzamiento, archívala con `openspec archive devocionales-web` para consolidar las specs.
