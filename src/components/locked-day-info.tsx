"use client";

import { usePathname } from "next/navigation";
import { formatDateEs } from "@/lib/format";

interface LockedDayInfoProps {
  fechas: Record<number, string>;
}

export default function LockedDayInfo({ fechas }: LockedDayInfoProps) {
  const pathname = usePathname();
  const match = /^\/dias\/(\d+)$/.exec(pathname ?? "");
  if (!match) return null;

  const n = Number(match[1]);
  const fecha = fechas[n];
  if (!fecha) return null;

  return (
    <p className="mt-2 text-sm font-medium text-clay-deep">
      Se desbloquea el {formatDateEs(fecha).toLowerCase()}
    </p>
  );
}
