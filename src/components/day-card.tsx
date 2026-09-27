import Image from "next/image";
import ViewLink from "@/components/view-link";
import { ArrowRightIcon, LockIcon } from "@/components/icons";
import { formatDateEs } from "@/lib/format";
import type { Plan } from "@/lib/plans";

interface DayCardProps {
  plan: Plan;
  n: number;
  titulo: string;
  pasaje: string;
  date: string;
  locked: boolean;
  today: boolean;
  imagen?: string;
}

export default function DayCard({
  plan,
  n,
  titulo,
  pasaje,
  date,
  locked,
  today,
  imagen,
}: DayCardProps) {
  const fecha = formatDateEs(date, plan.config.timezone);

  if (locked) {
    return (
      <li className="flex items-center gap-4 rounded-2xl border border-line bg-cream/40 p-5 opacity-70">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-smoke">
          <LockIcon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-smoke uppercase">
            Día {n} · {fecha}
          </p>
          <p className="mt-1 text-sm text-smoke">
            Se desbloquea el {fecha.toLowerCase()}
          </p>
        </div>
      </li>
    );
  }

  return (
    <li
      className={`rounded-2xl border transition-colors ${
        today
          ? "border-clay ring-2 ring-clay/25"
          : "border-line hover:border-smoke/60"
      }`}
    >
      <ViewLink
        href={`/dias/${n}`}
        className="flex items-center gap-4 p-4 sm:p-5"
        nav={today ? "next" : undefined}
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
            today ? "bg-clay text-paper" : "bg-cream text-ink"
          }`}
        >
          {n}
        </span>
        {imagen && (
          <Image
            src={imagen}
            alt=""
            aria-hidden
            width={1248}
            height={1872}
            className="h-14 w-10 shrink-0 rounded-lg border border-line object-cover sm:h-16 sm:w-11"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-[0.14em] text-smoke uppercase">
            Día {n} · {fecha}
            {today && (
              <span className="rounded-full bg-clay px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] text-paper uppercase">
                Hoy
              </span>
            )}
          </p>
          <p className="mt-1 truncate font-display text-lg font-semibold">
            {titulo}
          </p>
          <p className="mt-0.5 truncate text-sm text-smoke">{pasaje}</p>
        </div>
        <span
          className={`shrink-0 ${today ? "text-clay" : "text-smoke"}`}
          aria-hidden="true"
        >
          <ArrowRightIcon className="h-5 w-5" />
        </span>
      </ViewLink>
    </li>
  );
}
