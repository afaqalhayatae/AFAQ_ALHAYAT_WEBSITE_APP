/**
 * dataLayer event tracking (Google Ecosystem pass, 2026-08-07).
 *
 * This pushes to `window.dataLayer` — the same array GoogleTagManager.tsx's
 * loader snippet initializes — so events queue up correctly whether GTM
 * has loaded yet or not, and are simply never read if it never loads (no
 * `NEXT_PUBLIC_GTM_CONTAINER_ID` configured, or consent not granted). No
 * GA4/Ads-specific code lives here: per docs/google-ecosystem-setup.md,
 * every real measurement tag is configured as a trigger *inside* the GTM
 * container itself, keyed off these event names — this file's only job is
 * to push a consistent, real event name + params at the moment each
 * interaction actually happens, nothing invented or estimated.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    /**
     * Google Consent Mode v2 stub (2026-08-04) — defined in
     * google-tag-manager.tsx's default-signal script, `window.gtag ||=`
     * so it's set once and safe to call from anywhere (e.g.
     * lib/consent/cookie.ts's consent 'update' call) without an import
     * cycle. Optional because it's undefined until that script runs —
     * every caller must use `window.gtag?.(...)`.
     */
    gtag?: (...args: unknown[]) => void;
  }
}

export type TrackedEventName =
  | "contact_form_submit"
  | "booking_submit"
  | "whatsapp_click"
  | "phone_click"
  | "login"
  | "sign_up";

export function trackEvent(name: TrackedEventName, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
}
