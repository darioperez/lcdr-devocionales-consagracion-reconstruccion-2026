import type { Metadata } from "next";
import { cookies } from "next/headers";
import DayCard from "@/components/day-card";
import SubscribeButton from "@/components/subscribe-button";
import { formatDateEs } from "@/lib/format";
import {
  dateOfDay,
  dayStatus,
  getPlan,
  resolveUserTimeZone,
  todayInTimeZone,
} from "@/lib/plans";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Los 5 días",
};

export default async function DiasPage() {
  const plan = getPlan();
  const { config, dias } = plan;
  const userTz = resolveUserTimeZone(
    (await cookies()).get("tz")?.value,
    config.timezone,
  );
  const today = todayInTimeZone(userTz);

  const fechaInicio = formatDateEs(config.inicio, config.timezone);
  const fechaFin = formatDateEs(config.fin, config.timezone);

  return (
    <div className="rise-in mx-auto w-full max-w-3xl px-6 py-14 sm:py-20">
      <header>
        <p className="text-xs font-semibold tracking-[0.14em] text-clay-deep uppercase">
          Consagración⇒Reconstrucción
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Los 5 días
        </h1>
        <p className="mt-3 max-w-xl leading-relaxed text-smoke">
          {fechaInicio} — {fechaFin}. Cada día se desbloquea en la mañana de su
          fecha y permanece disponible para siempre.
        </p>
      </header>

      <section className="mt-10">
        <SubscribeButton />
      </section>

      <section className="mt-10">
        <ol className="space-y-3">
          {dias.map((dia) => {
            const date = dateOfDay(plan, dia.n);
            return (
              <DayCard
                key={dia.n}
                plan={plan}
                n={dia.n}
                titulo={dia.titulo}
                pasaje={dia.pasaje}
                imagen={dia.imagen}
                date={date}
                locked={dayStatus(date, today) === "locked"}
                today={dayStatus(date, today) === "open" && date === today}
              />
            );
          })}
        </ol>
      </section>

      <section className="mt-12 rounded-2xl border border-clay/30 bg-clay-soft/60 p-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-clay-deep uppercase">
          Viernes · Cierre de la semana
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          {config.cierre.titulo}
        </h2>
        <p className="mt-2 leading-relaxed text-ink/80">{config.cierre.detalle}</p>
      </section>
    </div>
  );
}
