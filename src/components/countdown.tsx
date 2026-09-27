"use client";

import { useEffect, useState } from "react";

function parts(target: Date, now: Date) {
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Countdown({ target }: { target: string }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const t = parts(new Date(target), now);

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2" role="timer">
      <Unit value={t.days} label={t.days === 1 ? "día" : "días"} />
      <span className="pb-4 text-lg text-smoke sm:pb-5 sm:text-2xl">:</span>
      <Unit value={pad(t.hours)} label="hrs" />
      <span className="pb-4 text-lg text-smoke sm:pb-5 sm:text-2xl">:</span>
      <Unit value={pad(t.minutes)} label="min" />
      <span className="pb-4 text-lg text-smoke sm:pb-5 sm:text-2xl">:</span>
      <Unit value={pad(t.seconds)} label="seg" />
    </div>
  );
}

function Unit({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="flex min-w-10 flex-col items-center sm:min-w-16">
      <span className="font-display text-3xl font-semibold tabular-nums sm:text-4xl">
        {value}
      </span>
      <span className="mt-1 text-[10px] font-medium tracking-[0.14em] text-smoke uppercase sm:text-[11px]">
        {label}
      </span>
    </div>
  );
}
