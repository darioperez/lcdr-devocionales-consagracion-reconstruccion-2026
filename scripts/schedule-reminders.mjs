/**
 * Programa los recordatorios de OneSignal para los 5 días del plan.
 *
 * Uso:
 *   node scripts/schedule-reminders.mjs            # vista previa (dry run)
 *   node scripts/schedule-reminders.mjs --send     # envía a OneSignal
 *
 * Variables de entorno requeridas (ver .env.example):
 *   ONESIGNAL_APP_ID, ONESIGNAL_REST_API_KEY, BASE_URL
 *
 * Cada recordatorio se entrega a las 8:00 PM en la zona horaria local de
 * cada suscriptor (delayed_option: "timezone") y abre la página del día.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

const root = process.cwd();
const plan = parseYaml(
  readFileSync(path.join(root, "content", "plan.yaml"), "utf8"),
);

const APP_ID = process.env.ONESIGNAL_APP_ID;
const REST_KEY = process.env.ONESIGNAL_REST_API_KEY;
const BASE_URL = (process.env.BASE_URL ?? "").replace(/\/+$/, "");

const SEND = process.argv.includes("--send");

function fail(msg) {
  console.error(`✖ ${msg}`);
  process.exit(1);
}

if (!APP_ID || !REST_KEY || !BASE_URL) {
  fail(
    "Faltan variables: ONESIGNAL_APP_ID, ONESIGNAL_REST_API_KEY y BASE_URL son obligatorias.",
  );
}

function fecha(n) {
  const start = new Date(`${plan.inicio}T00:00:00Z`);
  const d = new Date(start);
  d.setUTCDate(start.getUTCDate() + (n - 1));
  return d.toISOString().slice(0, 10);
}

const titulos = {
  1: "Oración que sostiene",
  2: "Visión que levanta",
  3: "Manos que edifican",
  4: "Palabra que aviva",
  5: "Pacto que consagra",
};

const notificaciones = [1, 2, 3, 4, 5].map((n) => ({
  app_id: APP_ID,
  name: `Devocional · Día ${n}`,
  included_segments: ["Subscribed Users"],
  headings: {
    en: `Consagración⇒Reconstrucción · Día ${n}`,
    es: `Consagración⇒Reconstrucción · Día ${n}`,
  },
  contents: {
    en: titulos[n],
    es: titulos[n],
  },
  url: `${BASE_URL}/dias/${n}`,
  delayed_option: "timezone",
  delivery_time_of_day: "8:00PM",
}));

if (!SEND) {
  console.log("Vista previa (usa --send para programar):\n");
  for (const n of notificaciones) {
    console.log(
      `  Día ${notificaciones.indexOf(n) + 1} · ${fecha(notificaciones.indexOf(n) + 1)} · 8:00 PM (hora local) · ${n.url}`,
    );
  }
  console.log(
    `\n${notificaciones.length} recordatorios listos para programarse.`,
  );
  process.exit(0);
}

for (const n of notificaciones) {
  const res = await fetch("https://api.onesignal.com/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${REST_KEY}`,
    },
    body: JSON.stringify(n),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    fail(`Día ${notificaciones.indexOf(n) + 1}: ${res.status} ${JSON.stringify(body)}`);
  }
  console.log(
    `✔ Día ${notificaciones.indexOf(n) + 1} programado (id: ${body.id})`,
  );
}

console.log("\nListo. Los recordatorios llegarán a las 8:00 PM hora local.");
