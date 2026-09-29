import type { Metadata } from "next";
import Image from "next/image";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import CompleteDayButton from "@/components/complete-day-button";
import DayOpenedEvent from "@/components/day-opened-event";
import Markdown from "@/components/markdown";
import ScrollDepth from "@/components/scroll-depth";
import ShareButton from "@/components/share-button";
import ViewLink from "@/components/view-link";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import { formatDateEs, weekdayEs } from "@/lib/format";
import {
  dateOfDay,
  dayStatus,
  getDay,
  getPlan,
  planEnded,
  resolveUserTimeZone,
  todayInTimeZone,
} from "@/lib/plans";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ dia: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dia } = await params;
  const plan = getPlan();
  const day = getDay(plan, Number(dia));
  if (!day) return { title: "Día no encontrado" };

  const title = `Día ${day.n} · ${day.titulo}`;
  const description = `${day.titulo} · ${day.pasaje} · Devocional para hombres basado en Nehemías`;

  return {
    title,
    description,
    alternates: { canonical: `/dias/${day.n}` },
    openGraph: {
      title: `${title} · Consagración⇒Reconstrucción`,
      description,
      type: "article",
      images: day.imagen
        ? [
            {
              url: day.imagen,
              width: 1248,
              height: 1872,
              alt: `Portada del día ${day.n}: ${day.titulo}`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: day.imagen ? [day.imagen] : undefined,
    },
  };
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
  const userTz = resolveUserTimeZone(
    (await cookies()).get("tz")?.value,
    config.timezone,
  );
  const today = todayInTimeZone(userTz);
  if (planEnded(plan, today)) notFound();
  if (dayStatus(date, today) === "locked") notFound();

  const weekday = weekdayEs(date);
  const fecha = formatDateEs(date);
  const isLastDay = n === dias.length;
  const prev = n > 1 ? n - 1 : null;
  const next = n < dias.length ? n + 1 : null;

  return (
    <article className="rise-in mx-auto w-full max-w-3xl px-6 py-14 sm:py-20">
      <DayOpenedEvent dia={n} />
      <ScrollDepth dia={n} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: "/" },
              { "@type": "ListItem", position: 2, name: "Plan", item: "/dias" },
              {
                "@type": "ListItem",
                position: 3,
                name: day.titulo,
                item: `/dias/${n}`,
              },
            ],
          }),
        }}
      />
      <nav className="mb-10">
        <ViewLink
          href="/dias"
          nav="back"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-smoke transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Plan
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
        <h1
          tabIndex={-1}
          className="mt-4 font-display text-4xl font-semibold tracking-tight text-balance outline-none sm:text-5xl"
        >
          {day.titulo}
        </h1>
        <p className="mt-3 inline-block max-w-full rounded-lg border border-line bg-cream px-3 py-1.5 font-display text-base break-words text-ink/90">
          {day.pasaje}
        </p>
      </header>

      {day.imagen && (
        <div className="mt-10">
          <Image
            src={day.imagen}
            alt={`Portada del día ${n}: ${day.titulo}`}
            width={1248}
            height={1872}
            priority
            sizes="(min-width: 768px) 720px, 100vw"
            className="aspect-[2/3] w-full rounded-2xl border border-line object-cover object-bottom shadow-sm"
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
          <p className="mt-2 text-sm leading-relaxed text-ink/90">
            {config.cierre.detalle}
          </p>
        </aside>
      )}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ShareButton dia={n} titulo={day.titulo} compartir={day.compartir} />
        <CompleteDayButton dia={n} />
      </div>

      <nav className="mt-14 flex items-center justify-between border-t border-line pt-8">
        {prev ? (
          <ViewLink
            href={`/dias/${prev}`}
            nav="back"
            className="inline-flex h-11 items-center gap-1.5 text-sm font-medium text-smoke transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Día {prev}
          </ViewLink>
        ) : (
          <span aria-hidden="true" className="h-11" />
        )}
        <span className="hidden text-xs text-smoke sm:block">
          {weekday}
        </span>
        {next ? (
          <ViewLink
            href={`/dias/${next}`}
            nav="next"
            className="inline-flex h-11 items-center gap-1.5 text-sm font-medium text-smoke transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
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
