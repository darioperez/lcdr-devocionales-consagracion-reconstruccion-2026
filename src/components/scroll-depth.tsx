"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/umami";

export default function ScrollDepth({ dia }: { dia: number }) {
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const fired = firedRef.current;

    function check() {
      const rect = article!.getBoundingClientRect();
      if (rect.height <= 0) return;
      const top = rect.top + window.scrollY;
      const readPx = window.scrollY + window.innerHeight - top;
      const depth = Math.min(1, readPx / rect.height);

      for (const target of [0.5, 1]) {
        if (!fired.has(target) && depth >= target) {
          fired.add(target);
          trackEvent("dia_scroll", {
            dia,
            profundidad: target === 1 ? 100 : 50,
          });
        }
      }
    }

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [dia]);

  return null;
}
