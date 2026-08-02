/**
 * Client-only dismissal state for the announcement bar (Owner-approved
 * dismiss behavior, 2026-07-28 — see
 * 07_WEBSITE/IMPLEMENTATION/10_ANNOUNCEMENT_BAR_ARCHITECTURE.md §1/§6).
 * Mirrors `src/lib/consent/cookie.ts`'s shape on purpose: a small
 * localStorage-backed store plus a `useSyncExternalStore`
 * subscribe/event pair, so the component can read it without the
 * "setState directly in an effect" anti-pattern `ConsentBanner` already
 * avoids for the same reason (no server-readable state to hydrate from).
 */

export const DISMISSED_STORAGE_KEY = "afaq-announcement-dismissed";
export const DISMISS_CHANGE_EVENT = "afaq-announcement-dismiss-change";

function readMap(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(DISMISSED_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    // Private-browsing/storage-denied environments fail open — treated
    // the same as "nothing dismissed yet," never thrown to the caller.
    return {};
  }
}

/** The content-version this announcement id was last dismissed at, or `null` if never/not matching. */
export function readDismissedVersion(announcementId: string): string | null {
  return readMap()[announcementId] ?? null;
}

export function writeDismissed(announcementId: string, version: string): void {
  try {
    const map = readMap();
    map[announcementId] = version;
    window.localStorage.setItem(DISMISSED_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Ignore — worst case the bar reappears next visit, which is safe.
  }
  window.dispatchEvent(new CustomEvent(DISMISS_CHANGE_EVENT));
}

/** `useSyncExternalStore` subscribe function — re-renders when a dismissal is recorded. */
export function subscribeToDismissChange(callback: () => void): () => void {
  window.addEventListener(DISMISS_CHANGE_EVENT, callback);
  return () => window.removeEventListener(DISMISS_CHANGE_EVENT, callback);
}
