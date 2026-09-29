"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "@/components/icons";
import { isDayCompleted, toggleDay } from "@/lib/progress";
import { trackEvent } from "@/lib/umami";

export default function CompleteDayButton({ dia }: { dia: number }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const onChange = () => setDone(isDayCompleted(dia));
    window.addEventListener("storage", onChange);
    const raf = requestAnimationFrame(onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      cancelAnimationFrame(raf);
    };
  }, [dia]);

  function handleClick() {
    const next = toggleDay(dia);
    setDone(next);
    if (next) trackEvent("dia_completado", { dia });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={done}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay ${
        done
          ? "border-clay bg-clay text-paper hover:bg-clay-deep"
          : "border-line text-ink hover:border-smoke/60"
      }`}
    >
      <CheckIcon className="h-4 w-4" />
      {done ? "Completado" : "Marcar como completado"}
    </button>
  );
}
