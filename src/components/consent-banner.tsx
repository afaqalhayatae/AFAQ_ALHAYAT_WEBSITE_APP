"use client";

import { useSyncExternalStore } from "react";
import type { getMessages } from "@/i18n/get-messages";
import {
  readConsentCookie,
  subscribeToConsentChange,
  writeConsentCookie,
  type ConsentChoice,
} from "@/lib/consent/cookie";

type Messages = ReturnType<typeof getMessages>;

function getSnapshot() {
  return readConsentCookie();
}

// The server never sees a cookie value — always render as "not yet
// decided" during SSR; useSyncExternalStore reconciles the real client
// value right after hydration without a hydration-mismatch error.
function getServerSnapshot() {
  return null;
}

/**
 * Cookie consent banner (JOB-AGT-WEB-20260726-M4.6). Shows once, until
 * the visitor accepts or declines; the choice gates `GoogleTagManager`
 * (src/components/google-tag-manager.tsx) — nothing analytics-related
 * runs before this. Sits above `MobileCtaBar` on mobile (bottom-20,
 * matching the same clearance `<main>` already reserves for it).
 */
export function ConsentBanner({ t }: { t: Messages }) {
  const consentChoice = useSyncExternalStore(subscribeToConsentChange, getSnapshot, getServerSnapshot);
  const visible = consentChoice === null;

  if (!visible) return null;

  function choose(value: ConsentChoice) {
    writeConsentCookie(value);
  }

  return (
    <div className="fixed inset-x-0 bottom-20 z-40 border-t border-(--color-border) bg-(--color-surface) p-space-3 desktop:bottom-0">
      <div className="mx-auto flex max-w-desktop flex-col gap-space-2 tablet:flex-row tablet:items-center tablet:justify-between">
        <p className="text-small text-(--color-text-secondary)">{t.consent.banner.message}</p>
        <div className="flex shrink-0 gap-space-2">
          <button
            type="button"
            onClick={() => choose("declined")}
            className="rounded-xl border border-(--color-border) px-space-3 py-space-2 text-small font-semibold text-(--color-text-primary)"
          >
            {t.consent.banner.decline}
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="rounded-xl bg-(--color-primary) px-space-3 py-space-2 text-small font-semibold text-(--color-surface)"
          >
            {t.consent.banner.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
