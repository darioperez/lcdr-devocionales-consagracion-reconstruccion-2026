import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Markdown from "@/components/markdown";
import ViewLink from "@/components/view-link";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import { formatDateEs, weekdayEs } from "@/lib/format";
import { dateOfDay, dayStatus, getDay, getPlan, todayInTimeZone } from "@/lib/plans";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ dia: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dia } = await params;
  const plan = getPlan();
  const day = getDay(plan, Number(dia));
  return { title: day ? `Día ${day.n} · ${day.titulo}` : "Día no encontrado" };
}

export default async function DiaPage({ params }: Props) {
  const { dia } = await params;
  const plan = getPlan();
  const { config, dias } = plan;

  const n = Number(dia);
  if (!Number.isInteger(n) || n < 1 || n > dias.length) notFound();

  const day = getDay(plan, n);
  if (!day) notFound();

  const date = dateOfDay(plan, n);
  const today = todayInTimeZone(config.timezone);
  if (dayStatus(date, today) === "locked") notFound();

  const weekday = weekdayEs(date, config.timezone);
  const fecha = formatDateEs(date, config.timezone);
  const isLastDay = n === dias.length;
  const prev = n > 1 ? n - 1 : null;
  const next = n < dias.length ? n + 1 : null;

  return (
    <article className="rise-in mx-auto w-full max-w-3xl px-6 py-14 sm:py-20">
      <nav className="mb-10">
        <ViewLink
          href="/dias"
          nav="back"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-smoke transition-colors hover:text-ink"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Los 5 días
        </ViewLink>
      </nav>

      <header>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-clay px-3 py-1 text-xs font-bold tracking-[0.14em] text-paper uppercase">
            Día {n} de 5
          </span>
          <p className="text-xs font-semibold tracking-[0.14em] text-smoke uppercase">
            {fecha}
          </p>
        </div>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {day.titulo}
        </h1>
        <p className="mt-3 inline-block max-w-full rounded-lg border border-line bg-cream px-3 py-1.5 font-display text-base break-words text-ink/80">
          {day.pasaje}
        </p>
      </header>

      {day.imagen && (
        <div className="mt-10 flex justify-center">
          <Image
            src={day.imagen}
            alt={`Portada del día ${n}: ${day.titulo}`}
            width={1248}
            height={1872}
            priority
            sizes="(min-width: 640px) 384px, min(100vw - 48px, 400px)"
            className="h-auto w-full max-w-[320px] rounded-2xl border border-line shadow-sm sm:max-w-[384px]"
          />
        </div>
      )}

      <div className="mt-10">
        <Markdown content={day.contenido} />
      </div>

      {isLastDay && (
        <aside className="mt-6 rounded-2xl border border-clay/30 bg-clay-soft/60 p-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-clay-deep uppercase">
            Esta noche
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold">
            {config.cierre.titulo}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/80">
            {config.cierre.detalle}
          </p>
        </aside>
      )}

      <nav className="mt-14 flex items-center justify-between border-t border-line pt-8">
        {prev ? (
          <ViewLink
            href={`/dias/${prev}`}
            nav="back"
            className="inline-flex h-11 items-center gap-1.5 text-sm font-medium text-smoke transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Día {prev}
          </ViewLink>
        ) : (
          <span className="text-sm text-smoke/50">Día 1</span>
        )}
        <span className="hidden text-xs text-smoke/60 sm:block">
          {weekday}
        </span>
        {next ? (
          <ViewLink
            href={`/dias/${next}`}
            nav="next"
            className="inline-flex h-11 items-center gap-1.5 text-sm font-medium text-smoke transition-colors hover:text-ink"
          >
            Día {next}
            <ArrowRightIcon className="h-4 w-4" />
          </ViewLink>
        ) : (
          <span className="text-sm font-semibold text-clay-deep">
            Fin del plan
          </span>
        )}
      </nav>
    </article>
  );
}
