"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent, trackPageview } from "@/lib/umami";

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const search = searchParams?.toString() ?? "";
    trackPageview(pathname, search);

    const origen = searchParams?.get("origen");
    const dayMatch = /^\/dias\/(\d+)$/.exec(pathname);
    if (origen === "notificacion" && dayMatch) {
      trackEvent("visita_notificacion", { dia: Number(dayMatch[1]) });
    }
  }, [pathname, searchParams]);

  return null;
}
