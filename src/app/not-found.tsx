import { cookies } from "next/headers";
import BlockedDayEvent from "@/components/blocked-day-event";
import EndedMessage from "@/components/ended-message";
import LockedDayInfo from "@/components/locked-day-info";
import ViewLink from "@/components/view-link";
import { ArrowLeftIcon } from "@/components/icons";
import {
  dateOfDay,
  getPlan,
  planEnded,
  resolveUserTimeZone,
  todayInTimeZone,
} from "@/lib/plans";

export default async function NotFound() {
  const plan = getPlan();
  const cookieStore = await cookies();
  const userTz = resolveUserTimeZone(
    cookieStore.get("tz")?.value,
    plan.config.timezone,
  );
  const today = todayInTimeZone(userTz);

  if (planEnded(plan, today)) {
    return (
      <div className="rise-in mx-auto w-full max-w-3xl px-6 py-24 sm:py-32">
        <EndedMessage
          overline={plan.config.titulo}
          heading="El plan ha terminado"
        />
      </div>
    );
  }

  const fechas: Record<number, string> = {};
  for (const dia of plan.dias) {
    fechas[dia.n] = dateOfDay(plan, dia.n);
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-28 text-center">
      <BlockedDayEvent />
      <p className="font-display text-7xl font-semibold text-clay">Paciencia</p>
      <h1
        tabIndex={-1}
        className="mt-4 font-display text-2xl font-semibold outline-none"
      >
        Este día aún no está disponible
      </h1>
      <p className="mt-3 max-w-md leading-relaxed text-smoke">
        Cada devocional se desbloquea en la mañana de su fecha. Vuelve entonces,
        o repasa con atención los días anteriores.
      </p>
      <LockedDayInfo fechas={fechas} />
      <ViewLink
        href="/dias"
        className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-clay px-6 text-sm font-semibold text-paper transition-colors hover:bg-clay-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Ver el plan
      </ViewLink>
    </div>
  );
}
