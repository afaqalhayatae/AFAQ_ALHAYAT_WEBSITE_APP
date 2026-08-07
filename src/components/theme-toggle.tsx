"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";

type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "afaq-theme";

type Listener = () => void;
const listeners = new Set<Listener>();

/**
 * `document.documentElement.dataset.theme` is external mutable state (set
 * before paint by the no-flash script in `[locale]/layout.tsx`) —
 * `useSyncExternalStore`, not `useState`+`useEffect`, is the correct React
 * tool for reading it: it returns the server snapshot ("light", matching
 * the server-rendered markup) on the first client render, then the real
 * DOM value once mounted, with no synchronous setState-in-effect and no
 * hydration mismatch.
 */
function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function applyTheme(next: Theme): void {
  document.documentElement.dataset.theme = next;
  window.localStorage.setItem(THEME_STORAGE_KEY, next);
  listeners.forEach((listener) => listener());
}

export function ThemeToggle({
  labels,
  className,
}: {
  labels: { switchToDarkMode: string; switchToLightMode: string };
  className?: string;
}) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? labels.switchToLightMode : labels.switchToDarkMode}
      className={
        className ??
        "flex h-10 w-10 items-center justify-center rounded-lg text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-secondary) hover:text-(--color-primary)"
      }
    >
      {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );
}
