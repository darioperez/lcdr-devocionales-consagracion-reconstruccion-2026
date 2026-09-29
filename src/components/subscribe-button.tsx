"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BellIcon, CheckIcon } from "@/components/icons";
import {
  isOneSignalConfigured,
  requestSubscription,
  subscribeToChanges,
} from "@/lib/onesignal";
import { trackEvent } from "@/lib/umami";
import type { SubscribeState } from "@/lib/onesignal";

type Estado = SubscribeState | "bloqueado";

const BLOCK_TIMEOUT_MS = 10_000;
const CLICK_BLOCK_TIMEOUT_MS = 6_000;

const RESULTADO_POR_ESTADO: Partial<Record<Estado, string>> = {
  subscribed: "exito",
  denied: "denegado",
  bloqueado: "bloqueado",
  unsupported: "no_soportado",
  unconfigured: "sin_configurar",
};

export default function SubscribeButton() {
  const [state, setState] = useState<Estado>("loading");
  const stateRef = useRef<Estado>("loading");
  const trackedResultRef = useRef<string | null>(null);
  const seenTrackedRef = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    stateRef.current = state;

    const resultado = RESULTADO_POR_ESTADO[state];
    if (resultado && trackedResultRef.current !== resultado) {
      trackedResultRef.current = resultado;
      trackEvent("suscribirse", { resultado });
    }

    const visible =
      state === "default" || state === "denied" || state === "bloqueado";
    if (visible && !seenTrackedRef.current) {
      seenTrackedRef.current = true;
      trackEvent("suscribirse_visto", { pagina: pathname ?? "" });
    }
  }, [state, pathname]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const raf = requestAnimationFrame(() => {
      if (!("serviceWorker" in navigator)) {
        setState("unsupported");
        return;
      }
      if (!isOneSignalConfigured()) {
        setState("unconfigured");
        return;
      }

      timers.push(
        setTimeout(() => {
          if (stateRef.current === "loading") setState("bloqueado");
        }, BLOCK_TIMEOUT_MS),
      );

      subscribeToChanges(setState);
    });

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, []);

  function handleClick() {
    trackEvent("suscribirse_click");
    requestSubscription();
    setTimeout(() => {
      if (stateRef.current === "loading") setState("bloqueado");
    }, CLICK_BLOCK_TIMEOUT_MS);
  }

  const subscribed = state === "subscribed";

  return (
    <div className="rounded-2xl border border-line bg-cream/60 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              subscribed ? "bg-clay text-paper" : "bg-paper text-clay"
            }`}
          >
            {subscribed ? (
              <CheckIcon className="h-5 w-5" />
            ) : (
              <BellIcon className="h-5 w-5" />
            )}
          </span>
          <div>
            <p className="font-display text-lg font-semibold">
              {subscribed
                ? "Recordatorio activado"
                : "Recibe un recordatorio diario"}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-smoke">
              {subscribed
                ? "Te avisaremos cada día a las 8:00 PM (hora local) con el devocional del día."
                : "Una notificación a las 8:00 PM (hora local) con el devocional del día, de lunes a viernes."}
            </p>
            {state === "denied" && (
              <p className="mt-2 text-xs leading-relaxed text-clay-deep">
                Las notificaciones están bloqueadas en este navegador. Actívalas
                desde la configuración del sitio para recibir los recordatorios.
              </p>
            )}
            {state === "unsupported" && (
              <p className="mt-2 text-xs leading-relaxed text-smoke">
                Este navegador no permite notificaciones. En iPhone, agrega el
                sitio a la pantalla de inicio (Compartir → Añadir a pantalla de
                inicio) y suscríbete desde allí.
              </p>
            )}
            {state === "unconfigured" && (
              <p className="mt-2 text-xs leading-relaxed text-smoke">
                Notificaciones sin configurar: define{" "}
                <code className="font-mono">NEXT_PUBLIC_ONESIGNAL_APP_ID</code>.
              </p>
            )}
            {state === "bloqueado" && (
              <p className="mt-2 text-xs leading-relaxed text-clay-deep">
                Parece que una extensión o la configuración del navegador está
                bloqueando las notificaciones (modo incógnito o un bloqueador de
                anuncios). Desactívala para poder suscribirte.
              </p>
            )}
          </div>
        </div>
        {!subscribed &&
          state !== "unsupported" &&
          state !== "unconfigured" &&
          state !== "bloqueado" && (
            <button
              type="button"
              onClick={handleClick}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-clay px-6 text-sm font-semibold text-paper transition-colors hover:bg-clay-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
            >
              <BellIcon className="h-4 w-4" />
              Suscribirme
            </button>
          )}
      </div>
    </div>
  );
}
