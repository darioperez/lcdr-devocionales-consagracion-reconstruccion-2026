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
npm run test       # pruebas de lógica de fechas
npm run lint
npm run build
```

> Tip: para probar estados de días específicos sin esperar a la fecha real,
> inicia el server con `FAKE_TODAY=2026-09-30 npm run dev` (solo afecta a
> `todayInTimeZone`, no a producción).

## Contenido

Todo el contenido vive en `content/`:

- `content/plan.yaml` — título, fechas (`inicio`/`fin`), `timezone` (America/Caracas), cierre e iglesia
- `content/dias/dia-1.md` … `dia-5.md` — frontmatter (`dia`, `titulo`, `pasaje`) + secciones `## Reflexión`, `## Acción del día`, `## Oración`

Reglas de acceso (implementadas en `src/lib/plans.ts`):

- Un día se desbloquea a la medianoche de su fecha en la **zona horaria del visitante** (detectada con una cookie `tz` en la primera visita); si no se conoce, se usa la zona horaria del plan (America/Caracas)
- Los días pasados y el actual son accesibles; los futuros muestran estado bloqueado y devuelven 404
- Añadir un nuevo plan = editar fechas y reemplazar los 5 archivos de días

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

Cada recordatorio se entrega a las **8:00 PM en la zona horaria local del suscriptor** (anclado a mediodía UTC de su fecha para evitar entregas un día antes) y abre la página del día con `?origen=notificacion`.

### Notas del plan gratuito de OneSignal

- Máximo 10.000 suscriptores por envío web push
- Registros inactivos 18 meses se eliminan; no incluye DPA ni soporte prioritario
- Confirma en el dashboard que **Timezone Delivery** está disponible en tu app gratuita

### iOS

En iPhone/iPad las notificaciones requieren iOS 16.4+ y agregar el sitio a la pantalla de inicio (Compartir → Añadir a pantalla de inicio). El botón de suscripción muestra esta indicación cuando el navegador no soporta push.

## Analítica (Umami)

El sitio usa [Umami](https://umami.is) (open source, sin cookies ni banner de consentimiento):

- `NEXT_PUBLIC_UMAMI_WEBSITE_ID` en Vercel habilita el tracking (`src/components/analytics.tsx` carga el script y registra vistas en cada navegación, incluida la navegación suave)
- Eventos personalizados: `dia_abierto` (`{ dia }`), `suscribirse` (`{ resultado }`), `tema_cambiado` (`{ tema }`) y `visita_notificacion` (`{ dia }`, cuando la URL trae `?origen=notificacion`)

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
