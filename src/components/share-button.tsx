"use client";

import { useState } from "react";
import { ShareIcon } from "@/components/icons";
import { trackEvent } from "@/lib/umami";

interface ShareButtonProps {
  dia: number;
  titulo: string;
  compartir?: string;
}

export default function ShareButton({
  dia,
  titulo,
  compartir,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    trackEvent("compartir_click", { dia });
    const url = `${window.location.origin}/dias/${dia}`;
    const title = `Consagración⇒Reconstrucción · Día ${dia} — ${titulo}`;
    const text = compartir ? `${compartir} — ${title}` : title;

    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title, text, url });
        trackEvent("compartir_exito", { metodo: "share" });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      trackEvent("compartir_exito", { metodo: "clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // el usuario canceló el diálogo de compartir
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line px-5 text-sm font-medium text-ink transition-colors hover:border-smoke/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
    >
      <ShareIcon className="h-4 w-4" />
      {copied ? "¡Enlace copiado!" : "Compartir"}
    </button>
  );
}
