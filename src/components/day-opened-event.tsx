"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/umami";

export default function DayOpenedEvent({ dia }: { dia: number }) {
  useEffect(() => {
    trackEvent("dia_abierto", { dia });
    if (dia === 5) trackEvent("plan_completado");
  }, [dia]);

  return null;
}
