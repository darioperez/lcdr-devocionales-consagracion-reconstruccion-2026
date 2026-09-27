import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { parse as parseYaml } from "yaml";

export interface PlanConfig {
  titulo: string;
  subtitulo: string;
  descripcion: string;
  inicio: string;
  fin: string;
  timezone: string;
  cierre: { titulo: string; detalle: string };
  iglesia: { nombre: string; linea: string };
}

export interface PlanDay {
  n: number;
  titulo: string;
  pasaje: string;
  contenido: string;
}

export interface Plan {
  config: PlanConfig;
  dias: PlanDay[];
}

export type PlanPhase = "before" | "during" | "after";
export type DayStatus = "locked" | "open";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function todayInTimeZone(timeZone: string, now: Date = new Date()): string {
  const override = process.env.FAKE_TODAY;
  if (override) return override;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function planPhase(start: string, end: string, today: string): PlanPhase {
  if (today < start) return "before";
  if (today > end) return "after";
  return "during";
}

export function dayStatus(date: string, today: string): DayStatus {
  return today < date ? "locked" : "open";
}

export function currentDayNumber(plan: Plan, today: string): number | null {
  if (planPhase(plan.config.inicio, plan.config.fin, today) !== "during") return null;
  const day = plan.dias.find((d) => dateOfDay(plan, d.n) === today);
  return day?.n ?? null;
}

export function dateOfDay(plan: Plan, n: number): string {
  const start = new Date(`${plan.config.inicio}T00:00:00Z`);
  const date = new Date(start);
  date.setUTCDate(start.getUTCDate() + (n - 1));
  return date.toISOString().slice(0, 10);
}

let cachedPlan: Plan | null = null;

export function getPlan(): Plan {
  if (cachedPlan) return cachedPlan;

  const config = parseYaml(
    readFileSync(path.join(CONTENT_DIR, "plan.yaml"), "utf8"),
  ) as PlanConfig;

  const files = readdirSync(path.join(CONTENT_DIR, "dias"))
    .filter((f) => f.endsWith(".md"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const dias = files.map((file) => {
    const raw = readFileSync(path.join(CONTENT_DIR, "dias", file), "utf8");
    const { data, content } = matter(raw);
    return {
      n: Number(data.dia),
      titulo: String(data.titulo),
      pasaje: String(data.pasaje),
      contenido: content.trim(),
    } satisfies PlanDay;
  });

  cachedPlan = { config, dias };
  return cachedPlan;
}

export function getDay(plan: Plan, n: number): PlanDay | undefined {
  return plan.dias.find((d) => d.n === n);
}
