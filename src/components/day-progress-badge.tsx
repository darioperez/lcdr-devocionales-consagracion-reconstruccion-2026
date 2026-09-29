"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "@/components/icons";
import { isDayCompleted } from "@/lib/progress";

export default function DayProgressBadge({ dia }: { dia: number }) {
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

  if (!done) return null;

  return (
    <span
      className="shrink-0 text-clay-deep"
      title="Devocional completado"
      aria-label="Devocional completado"
    >
      <CheckIcon className="h-5 w-5" />
    </span>
  );
}
