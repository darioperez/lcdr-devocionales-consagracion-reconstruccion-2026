"use client";

import { useEffect, useState } from "react";
import { BellIcon, CheckIcon } from "@/components/icons";
import {
  isOneSignalConfigured,
  requestSubscription,
  subscribeToChanges,
} from "@/lib/onesignal";
import { trackEvent } from "@/lib/umami";
import type { SubscribeState } from "@/lib/onesignal";

export default function SubscribeButton() {
  const [state, setState] = useState<SubscribeState>("loading");

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (!("serviceWorker" in navigator)) {
        setState("unsupported");
        return;
      }
      if (!isOneSignalConfigured()) {
        setState("unconfigured");
        return;
      }
      subscribeToChanges((next) => {
        setState(next);
        if (next === "subscribed") trackEvent("suscribirse", { resultado: "exito" });
        if (next === "denied") trackEvent("suscribirse", { resultado: "denegado" });
      });
    });
    return () => cancelAnimationFrame(raf);
  }, []);

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
          </div>
        </div>
        {!subscribed && state !== "unsupported" && state !== "unconfigured" && (
          <button
            type="button"
            onClick={requestSubscription}
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
