import Countdown from "@/components/countdown";
import ViewLink from "@/components/view-link";
import { ArrowRightIcon } from "@/components/icons";
import SubscribeButton from "@/components/subscribe-button";
import { formatDateEs } from "@/lib/format";
import {
  currentDayNumber,
  getPlan,
  planPhase,
  todayInTimeZone,
} from "@/lib/plans";

export const dynamic = "force-dynamic";

export default function Home() {
  const plan = getPlan();
  const { config } = plan;
  const today = todayInTimeZone(config.timezone);
  const phase = planPhase(config.inicio, config.fin, today);
  const currentN = currentDayNumber(plan, today);

  const fechaInicio = formatDateEs(config.inicio, config.timezone);
  const fechaFin = formatDateEs(config.fin, config.timezone);
  const targetStart = `${config.inicio}T00:00:00-04:00`;

  return (
    <div className="rise-in mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
      <section className="flex flex-col items-center text-center">
        <p className="rounded-full border border-line bg-cream px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-clay-deep uppercase">
          Devocional para varones · 5 días
        </p>

        <h1 className="mt-6 flex flex-wrap items-center justify-center gap-x-3 font-display text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          <span>Consagración</span>
          <span className="text-clay">⇒</span>
          <span>Reconstrucción</span>
        </h1>

        <p className="mt-4 text-xs font-medium tracking-wide text-smoke uppercase">
          {fechaInicio} — {fechaFin}
        </p>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/85">
          {config.descripcion}
        </p>

        <blockquote className="mt-8 max-w-lg border-l-2 border-clay pl-5 text-left font-display text-base text-ink/70 italic">
          «Venid, y edifiquemos el muro de Jerusalén, y no estemos más en
          oprobio».
          <span className="mt-1 block text-sm font-sans text-smoke not-italic">
            — Nehemías 2:17
          </span>
        </blockquote>

        <div className="mt-10">
          {phase === "before" && (
            <>
              <p className="mb-5 text-sm font-medium text-smoke">
                El plan comienza en
              </p>
              <Countdown target={targetStart} />
            </>
          )}
          {phase === "during" && currentN && (
            <>
              <p className="mb-5 text-sm font-medium text-smoke">
                Día {currentN} de 5 · hoy
              </p>
              <div className="mb-6 h-1.5 w-64 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-clay transition-all"
                  style={{ width: `${(currentN! / 5) * 100}%` }}
                />
              </div>
            </>
          )}
          {phase === "after" && (
            <p className="mb-6 text-sm font-medium text-smoke">
              El plan terminó el {fechaFin.toLowerCase()}. Puedes repasar los
              cinco días cuando quieras.
            </p>
          )}
        </div>

        <div className="flex w-full max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <ViewLink
            href={phase === "during" && currentN ? `/dias/${currentN}` : "/dias"}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-clay px-6 text-base font-semibold whitespace-normal text-center text-paper transition-colors hover:bg-clay-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay sm:w-auto"
          >
            {phase === "before" && "Iniciar Plan"}
            {phase === "during" && currentN && `Continuar · Día ${currentN}`}
            {phase === "after" && "Ver plan completo"}
            <ArrowRightIcon className="h-4 w-4 shrink-0" />
          </ViewLink>
        </div>
      </section>

      <section className="mt-20 border-t border-line pt-10">
        <h2 className="mb-6 text-center font-display text-2xl font-semibold">
          ¿Cómo funciona?
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-line p-5">
            <p className="font-display text-lg font-semibold">5 días</p>
            <p className="mt-1 text-sm leading-relaxed text-smoke">
              De lunes a viernes, cada día se desbloquea un devocional basado en
              Nehemías.
            </p>
          </div>
          <div className="rounded-2xl border border-line p-5">
            <p className="font-display text-lg font-semibold">3 momentos</p>
            <p className="mt-1 text-sm leading-relaxed text-smoke">
              Reflexión, acción del día y oración. No se trata solo de leer:
              se trata de edificar.
            </p>
          </div>
          <div className="rounded-2xl border border-line p-5">
            <p className="font-display text-lg font-semibold">1 recordatorio</p>
            <p className="mt-1 text-sm leading-relaxed text-smoke">
              A las 8:00 PM de tu hora local, una notificación con el devocional
              del día.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <SubscribeButton />
      </section>
    </div>
  );
}
