import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Script from "next/script";
import ViewLink from "@/components/view-link";
import { getPlan } from "@/lib/plans";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Consagración⇒Reconstrucción · Devocional para varones",
    template: "%s · Consagración⇒Reconstrucción",
  },
  description:
    "Plan devocional de 5 días para varones basado en la historia de Nehemías. Del lunes 28 de septiembre al viernes 2 de octubre. Primero de rodillas, luego con las manos en la obra.",
};

const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const plan = getPlan();

  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        {appId && (
          <>
            <Script
              src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
              strategy="afterInteractive"
            />
            <Script id="onesignal-init" strategy="afterInteractive">
              {`window.OneSignalDeferred = window.OneSignalDeferred || [];
OneSignalDeferred.push(async function (OneSignal) {
  await OneSignal.init({
    appId: ${JSON.stringify(appId)},
    autoResubscribe: true,
    welcomeNotification: { disable: true },
  });
});`}
            </Script>
          </>
        )}

        <header className="border-b border-line">
          <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6">
            <ViewLink href="/" className="font-display text-lg font-semibold tracking-tight">
              {plan.config.titulo}
            </ViewLink>
            <nav className="flex items-center gap-1 text-sm">
              <ViewLink
                href="/"
                className="rounded-full px-3 py-1.5 text-smoke transition-colors hover:bg-cream hover:text-ink"
              >
                Inicio
              </ViewLink>
              <ViewLink
                href="/dias"
                className="rounded-full px-3 py-1.5 text-smoke transition-colors hover:bg-cream hover:text-ink"
              >
                Los 5 días
              </ViewLink>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-line">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-1 px-6 py-10 text-center">
            <p className="font-display text-sm font-semibold">
              {plan.config.titulo}
            </p>
            <p className="text-xs text-smoke">{plan.config.iglesia.linea}</p>
            <p className="mt-2 text-xs text-smoke/80">
              {plan.config.iglesia.nombre} · Hecho para varones que se arrodillan
              antes de edificar
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
