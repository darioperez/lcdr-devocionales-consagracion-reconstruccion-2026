import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Fraunces, Inter } from "next/font/google";
import Script from "next/script";
import ThemeToggle from "@/components/theme-toggle";
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
    default: "Consagración⇒Reconstrucción · Devocional para hombres",
    template: "%s · Consagración⇒Reconstrucción",
  },
  description:
    "Plan devocional de 5 días para hombres basado en la historia de Nehemías. Del lunes 28 de septiembre al viernes 2 de octubre. Primero de rodillas, luego las manos a la obra.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f4" },
    { media: "(prefers-color-scheme: dark)", color: "#181410" },
  ],
  viewportFit: "cover",
};

const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

const tzInitScript = `(function () {
  try {
    if (!document.cookie.includes("tz=")) {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      document.cookie = "tz=" + tz + ";path=/;max-age=31536000;SameSite=Lax";
    }
  } catch (e) {}
})();`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const plan = getPlan();
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value;
  const themeClass =
    theme === "light" || theme === "dark" ? theme : undefined;

  return (
    <html
      lang="es"
      className={[fraunces.variable, inter.variable, themeClass]
        .filter(Boolean)
        .join(" ")}
    >
      <body className="flex min-h-dvh flex-col overflow-x-clip antialiased">
        <script dangerouslySetInnerHTML={{ __html: tzInitScript }} />
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

        <header className="sticky top-0 z-50 border-b border-line bg-paper/90 pt-[env(safe-area-inset-top)] backdrop-blur">
          <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
            <ViewLink
              href="/"
              className="min-w-0 truncate font-display text-base font-semibold tracking-tight sm:text-lg"
            >
              {plan.config.titulo}
            </ViewLink>
            <nav className="flex shrink-0 items-center gap-0.5 text-sm sm:gap-1">
              <ViewLink
                href="/dias"
                className="rounded-full px-2.5 py-1.5 text-smoke transition-colors hover:bg-cream hover:text-ink sm:px-3"
              >
                Plan
              </ViewLink>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-line pb-[env(safe-area-inset-bottom)]">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-1 px-6 py-10 text-center">
            <p className="font-display text-sm font-semibold">
              {plan.config.titulo}
            </p>
            <p className="text-xs text-smoke">{plan.config.iglesia.linea}</p>
            <p className="mt-2 text-xs text-smoke/80">
              {plan.config.iglesia.nombre} · Hecho para hombres que se arrodillan
              antes de dar cualquier paso
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
