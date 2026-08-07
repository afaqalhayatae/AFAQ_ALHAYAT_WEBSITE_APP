"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Keeps the branded loader visible for at least this long even on a fast
// connection — a spinner that flashes for 20ms reads as a glitch, not a
// polish touch. Real page-ready timing (window `load`) still governs when
// it's allowed to start hiding; this is only a floor, never an artificial
// delay beyond that.
const MIN_VISIBLE_MS = 500;
const FADE_MS = 300;

/**
 * Branded first-open splash (2026-08-07, Owner-requested: "like
 * Hostinger's"). Lives in `[locale]/layout.tsx`, outside any per-page
 * boundary, so it mounts once per real document load — App Router keeps
 * layouts mounted across client-side `<Link>` navigations, so it does not
 * replay on every internal page change, only on an actual fresh page load
 * (first visit, hard refresh, or typed URL). Server-rendered (this is a
 * Client Component, but still emits real HTML on first paint) so it
 * appears immediately, before hydration, with no flash — same reasoning
 * as the theme-init script covering `data-theme`.
 */
export function SiteLoader() {
  const [mounted, setMounted] = useState(true);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const start = Date.now();
    function reveal() {
      const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - start));
      window.setTimeout(() => setHiding(true), wait);
    }
    if (document.readyState === "complete") {
      reveal();
      return;
    }
    window.addEventListener("load", reveal, { once: true });
    return () => window.removeEventListener("load", reveal);
  }, []);

  useEffect(() => {
    if (!hiding) return;
    const timer = window.setTimeout(() => setMounted(false), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [hiding]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-(--color-surface) transition-opacity ease-out ${
        hiding ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="relative flex h-28 w-28 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-(--color-border) border-t-(--color-primary)" />
        <Image
          src="/brand/logo-mark.png"
          alt=""
          width={56}
          height={56}
          priority
          className="h-14 w-14"
        />
      </div>
    </div>
  );
}
