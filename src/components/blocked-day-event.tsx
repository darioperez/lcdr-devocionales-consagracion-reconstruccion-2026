"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/umami";

export default function BlockedDayEvent() {
  const pathname = usePathname();

  useEffect(() => {
    const match = /^\/dias\/(\d+)$/.exec(pathname ?? "");
    if (match) trackEvent("dia_bloqueado", { dia: Number(match[1]) });
  }, [pathname]);

  return null;
}
