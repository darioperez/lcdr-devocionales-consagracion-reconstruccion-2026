/**
 * Programa los recordatorios de OneSignal para los días del plan.
 *
 * Uso:
 *   node scripts/schedule-reminders.mjs            # vista previa (dry run)
 *   node scripts/schedule-reminders.mjs --send     # envía a OneSignal
 *   node scripts/schedule-reminders.mjs --send --days=3,4,5  # solo algunos días
 *
 * Variables de entorno requeridas (ver .env.example):
 *   NEXT_PUBLIC_ONESIGNAL_APP_ID, ONESIGNAL_REST_API_KEY, BASE_URL
 *
 * Cada recordatorio se entrega a las 8:00 PM en la zona horaria local de
 * cada suscriptor (delayed_option: "timezone", anclado a mediodía UTC de su
 * fecha) y abre la página del día con ?origen=notificacion.
 *
 * Idempotencia: los días que ya tienen un recordatorio activo se omiten.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { parse as parseYaml } from "yaml";

const root = process.cwd();
const plan = parseYaml(
  readFileSync(path.join(root, "content", "plan.yaml"), "utf8"),
);

const APP_ID =
  process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || process.env.ONESIGNAL_APP_ID;
const REST_KEY = process.env.ONESIGNAL_REST_API_KEY;
const BASE_URL = (process.env.BASE_URL ?? "").replace(/\/+$/, "");

const SEND = process.argv.includes("--send");
const daysArg = process.argv.find((a) => a.startsWith("--days="));
const DIAS = daysArg
  ? daysArg
      .split("=")[1]
      .split(",")
      .map((n) => Number(n.trim()))
  : [1, 2, 3, 4, 5];

function fail(msg) {
  console.error(`✖ ${msg}`);
  process.exit(1);
}

if (!APP_ID || !REST_KEY || !BASE_URL) {
  fail(
    "Faltan variables: NEXT_PUBLIC_ONESIGNAL_APP_ID, ONESIGNAL_REST_API_KEY y BASE_URL son obligatorias.",
  );
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Basic ${REST_KEY}`,
};

function tituloDeDia(n) {
  const file = path.join(root, "content", "dias", `dia-${n}.md`);
  const { data } = matter(readFileSync(file, "utf8"));
  return String(data.titulo);
}

function fecha(n) {
  const start = new Date(`${plan.inicio}T00:00:00Z`);
  const d = new Date(start);
  d.setUTCDate(start.getUTCDate() + (n - 1));
  return d.toISOString().slice(0, 10);
}

async function activosExistentes() {
  const res = await fetch(
    `https://api.onesignal.com/notifications?app_id=${APP_ID}&limit=50`,
    { headers },
  );
  if (!res.ok) {
    throw new Error(`No se pudo listar notificaciones: ${res.status}`);
  }
  const json = await res.json();
  return (json.notifications ?? []).filter(
    (n) => n.name?.startsWith("Devocional") && !n.canceled,
  );
}

const notificaciones = DIAS.map((n) => {
  const titulo = tituloDeDia(n);
  return {
    n,
    payload: {
      app_id: APP_ID,
      name: `Devocional · Día ${n}`,
      filters: [{ field: "session_count", relation: ">", value: "0" }],
      headings: {
        en: `Consagración⇒Reconstrucción · Día ${n}`,
        es: `Consagración⇒Reconstrucción · Día ${n}`,
      },
      contents: {
        en: `Es tiempo de edificar. No te pierdas el devocional de hoy, ${titulo}`,
        es: `Es tiempo de edificar. No te pierdas el devocional de hoy, ${titulo}`,
      },
      url: `${BASE_URL}/dias/${n}?origen=notificacion`,
      delayed_option: "timezone",
      delivery_time_of_day: "8:00PM",
      send_after: `${fecha(n)}T12:00:00Z`,
    },
  };
});

if (!SEND) {
  console.log("Vista previa (usa --send para programar):\n");
  for (const { n, payload } of notificaciones) {
    console.log(
      `  Día ${n} · ${fecha(n)} · 8:00 PM (hora local) · ${payload.url}`,
    );
  }
  console.log(
    `\n${notificaciones.length} recordatorios listos para programarse.`,
  );
  process.exit(0);
}

try {
  const activos = await activosExistentes();
  const nombresActivos = new Set(
    activos
      .filter((n) => !n.canceled)
      .map((n) => n.name),
  );

  let enviados = 0;
  for (const { n, payload } of notificaciones) {
    if (nombresActivos.has(payload.name)) {
      console.log(`· Día ${n}: ya tiene un recordatorio activo, se omite.`);
      continue;
    }
    const res = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.id || (body.errors && body.errors.length > 0)) {
      fail(`Día ${n}: ${res.status} ${JSON.stringify(body)}`);
    }
    enviados++;
    console.log(`✔ Día ${n} programado (id: ${body.id})`);
  }

  console.log(
    `\nListo. ${enviados} recordatorios programados; los demás ya estaban activos.`,
  );
} catch (err) {
  fail(String(err instanceof Error ? err.message : err));
}
