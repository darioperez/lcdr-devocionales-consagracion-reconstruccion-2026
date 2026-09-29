"use client";

import { useEffect, useState } from "react";
import { completedCount } from "@/lib/progress";

const TOTAL = 5;

export default function CompletedCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const onChange = () => setCount(completedCount());
    window.addEventListener("storage", onChange);
    const raf = requestAnimationFrame(onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (count === 0) return null;

  return (
    <p className="mt-6 text-sm font-medium text-smoke">
      {count === TOTAL
        ? "¡Completaste los 5 devocionales!"
        : `Has completado ${count} de ${TOTAL} devocionales`}
    </p>
  );
}
