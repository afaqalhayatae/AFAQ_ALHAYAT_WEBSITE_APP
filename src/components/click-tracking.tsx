"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/track-event";
import { WHATSAPP_URL } from "@/lib/brand/links";

/**
 * WhatsApp/phone click tracking via event delegation (Google Ecosystem
 * pass, 2026-08-07) — mounted once in the root layout instead of editing
 * the ~33 places across the site that render a `tel:` or WhatsApp link
 * (header, footer, mobile CTA bar, every service/city page CTA, etc.).
 * One listener on `document`, matching on the resolved href of whichever
 * `<a>` was clicked, covers all of them without touching a single
 * existing component.
 */
export function ClickTracking() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";

      if (href.startsWith("tel:")) {
        trackEvent("phone_click");
      } else if (href === WHATSAPP_URL || href.startsWith("https://wa.me/")) {
        trackEvent("whatsapp_click");
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
