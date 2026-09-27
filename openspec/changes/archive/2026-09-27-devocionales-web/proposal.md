# Proposal

## Why

The church runs a 5-day devotional for men ("Consagración⇒Reconstrucción", based on Nehemiah) from Monday September 28 to Friday October 2, 2026, and currently has no way to distribute it day-by-day or to remind participants. A public website lets participants follow the plan on schedule, keeps future days inaccessible until their date, and nudges them daily with a reminder at 8 PM local time.

## What Changes

- New public Spanish website deployed on Vercel (Next.js 16, TypeScript, Tailwind v4)
- Homepage (`/`) with series description and a context-aware CTA: "Iniciar Plan" before start, "Continuar · Día N" during the plan, "Ver plan completo" after it ends
- Plan detail page (`/dias`) listing the 5 days with locked/unlocked/today states
- Day pages (`/dias/[n]`, n = 1–5) rendering the full devotional (pasaje, reflexión, acción del día, oración) with prev/next navigation
- Day unlock at midnight in `America/Caracas`; present and past days are accessible, future days return 404
- Web push reminders via OneSignal: custom opt-in UI and 5 scheduled notifications (8 PM user-local time, one per plan day) linking to that day's page
- Content stored as git-tracked markdown (`content/plan.yaml` + `content/dias/dia-*.md`), migrated from `docs/devocionales.md`
- Minimal warm editorial UI (Fraunces/Inter, paper/stone palette, terracotta accent) with page transitions via React 19.2 `<ViewTransition>`

## Capabilities

### New Capabilities

- `plan-content`: Single devotional plan modeled in git-tracked markdown: plan metadata (title, start/end dates, timezone) and 5 ordered day documents, each with title, scripture passage, and body sections
- `day-access`: Timezone-aware access rules — each day unlocks at midnight America/Caracas on its date; unlocked days are readable, future days render locked in the UI and return 404
- `reminders`: Visitor push-notification subscription (OneSignal) and scheduled daily reminders at 8 PM in the subscriber's local timezone, one per plan day, deep-linking to that day's page

### Modified Capabilities

<!-- none -->

## Impact

- New Next.js app in the project root (currently empty besides docs/ and tooling)
- Dependencies: `gray-matter`, `react-markdown`, `remark-gfm`, `vitest` (dev); OneSignal Web SDK via script tag
- OneSignal account/app (free tier) with Web Push "Custom Code" integration; env vars `NEXT_PUBLIC_ONESIGNAL_APP_ID` and `ONESIGNAL_REST_API_KEY`
- Reminder scheduling script `scripts/schedule-reminders.mjs` run once per plan
- No database, no cron jobs, no authentication
