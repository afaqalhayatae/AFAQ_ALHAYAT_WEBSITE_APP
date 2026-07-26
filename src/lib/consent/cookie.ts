/**
 * First-party analytics/advertising consent cookie (JOB-AGT-WEB-20260726-M4.6).
 * Separate from `afaq_session` (strictly necessary, httpOnly) — this one
 * is readable/writable by client code on purpose, since it just remembers
 * the visitor's own cookie-banner choice. Read by `GoogleTagManager` to
 * decide whether Google tags may run at all, per
 * GOOGLE_LIVE_ECOSYSTEM.md's Consent Mode requirement and the Cookie
 * Policy's promise that non-essential cookies wait for explicit consent.
 */

export const CONSENT_COOKIE_NAME = "afaq_consent";
export const CONSENT_CHANGE_EVENT = "afaq-consent-change";

export type ConsentChoice = "granted" | "declined";

export function readConsentCookie(): ConsentChoice | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE_NAME}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1]) : null;
  return value === "granted" || value === "declined" ? value : null;
}

export function writeConsentCookie(value: ConsentChoice): void {
  const oneYearInSeconds = 60 * 60 * 24 * 365;
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; path=/; max-age=${oneYearInSeconds}; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: value }));
}

/** `useSyncExternalStore` subscribe function — re-renders on any consent choice. */
export function subscribeToConsentChange(callback: () => void): () => void {
  window.addEventListener(CONSENT_CHANGE_EVENT, callback);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, callback);
}
