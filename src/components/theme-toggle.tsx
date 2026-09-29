"use client";

import { useEffect, useState } from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "@/components/icons";
import { trackEvent } from "@/lib/umami";

export type Theme = "system" | "light" | "dark";

const COOKIE_NAME = "theme";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const THEME_COLORS: Record<"light" | "dark", string> = {
  light: "#faf8f4",
  dark: "#181410",
};

function getCurrentTheme(): Theme {
  if (typeof document === "undefined") return "system";
  if (document.documentElement.classList.contains("dark")) return "dark";
  if (document.documentElement.classList.contains("light")) return "light";
  return "system";
}

function updateThemeColorMeta(theme: Theme): void {
  const lightMeta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"][media*="prefers-color-scheme: light"]',
  );
  const darkMeta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"][media*="prefers-color-scheme: dark"]',
  );
  if (!lightMeta && !darkMeta) return;

  const set = (meta: HTMLMetaElement | null, color: string) =>
    meta?.setAttribute("content", color);

  if (theme === "light") {
    set(lightMeta, THEME_COLORS.light);
    set(darkMeta, THEME_COLORS.light);
  } else if (theme === "dark") {
    set(lightMeta, THEME_COLORS.dark);
    set(darkMeta, THEME_COLORS.dark);
  } else {
    set(lightMeta, THEME_COLORS.light);
    set(darkMeta, THEME_COLORS.dark);
  }
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  updateThemeColorMeta(theme);
}

const ORDER: Theme[] = ["system", "light", "dark"];

const LABELS: Record<Theme, string> = {
  system: "Tema: automático (sistema)",
  light: "Tema: claro",
  dark: "Tema: oscuro",
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (getCurrentTheme() === "system") updateThemeColorMeta("system");
    };
    media.addEventListener("change", onSystemChange);

    const raf = requestAnimationFrame(() => {
      setMounted(true);
      setTheme(getCurrentTheme());
    });

    return () => {
      media.removeEventListener("change", onSystemChange);
      cancelAnimationFrame(raf);
    };
  }, []);

  function cycle() {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
    setTheme(next);
    applyTheme(next);
    trackEvent("tema_cambiado", { tema: next });
  }

  const Icon =
    theme === "light" ? SunIcon : theme === "dark" ? MoonIcon : MonitorIcon;

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={LABELS[theme]}
      title={LABELS[theme]}
      className="ml-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-smoke transition-colors hover:bg-cream hover:text-ink sm:ml-1"
    >
      {mounted && <Icon className="h-[18px] w-[18px]" />}
    </button>
  );
}
