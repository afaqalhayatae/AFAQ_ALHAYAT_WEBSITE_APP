"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import type { Locale } from "@/i18n/config";
import type { getMessages } from "@/i18n/get-messages";
import { ArrowRightIcon, MenuIcon } from "@/components/icons";
import { getActiveAnnouncement, getContentVersion } from "@/lib/catalog/announcements";
import {
  readDismissedVersion,
  subscribeToDismissChange,
  writeDismissed,
} from "@/lib/announcements/dismissal";

type Messages = ReturnType<typeof getMessages>;

/** Maps the catalog's type ids to the i18n `announcementBar.typeLabels` keys. */
const TYPE_LABEL_KEY = {
  "service-notice": "service-notice",
  "limited-time-offer": "offer",
  "new-article": "new-article",
} as const;

function getServerSnapshot(): null {
  return null;
}

/**
 * Site-wide announcement bar — Phase A per
 * 07_WEBSITE/IMPLEMENTATION/10_ANNOUNCEMENT_BAR_ARCHITECTURE.md (v1.2).
 * Non-fixed, rendered above `<Header>` in the root layout (Owner-approved
 * "no fixed positioning" decision).
 *
 * Dismissal is read via `useSyncExternalStore`, exactly like
 * `ConsentBanner` reads its cookie: the server never knows a visitor's
 * prior dismissal, so it always renders "not dismissed" during SSR, and
 * React reconciles the real client value right after hydration — no
 * hydration-mismatch error, and no `setState`-in-effect anti-pattern.
 *
 * Ticker (2026-07-28, Owner-requested): only the message text scrolls —
 * the CTA link and dismiss button are deliberately kept outside the
 * moving track, since a moving link/button is a real click-target and
 * accessibility problem. Note this scrolling motion is a deliberate,
 * Owner-directed exception to `LUXURY_DESIGN_DIRECTION.md` §7/§10's
 * general "avoid continuous movement" guidance — mitigated here by
 * pausing on hover/focus and fully disabling the animation under
 * `prefers-reduced-motion` (Tailwind's `motion-reduce:` variant), per
 * that same document's own reduced-motion requirement.
 */
export function AnnouncementBar({ locale, t }: { locale: Locale; t: Messages }) {
  const announcement = getActiveAnnouncement();
  const contentVersion = announcement ? getContentVersion(announcement) : null;

  const dismissedVersion = useSyncExternalStore(
    subscribeToDismissChange,
    () => (announcement ? readDismissedVersion(announcement.id) : null),
    getServerSnapshot
  );

  if (!announcement) return null;
  if (dismissedVersion !== null && dismissedVersion === contentVersion) return null;

  const message = announcement.message[locale];
  const ctaLabel = announcement.ctaLabel?.[locale];
  const typeLabel = t.announcementBar.typeLabels[TYPE_LABEL_KEY[announcement.type]];

  function handleDismiss() {
    if (!announcement || !contentVersion) return;
    writeDismissed(announcement.id, contentVersion);
  }

  return (
    <div
      role="region"
      aria-label={t.announcementBar.regionLabel}
      className="group border-b border-(--color-border) bg-(--color-surface-secondary)"
    >
      <div className="mx-auto flex max-w-desktop items-center gap-space-3 px-space-3 py-space-2">
        <span className="shrink-0 rounded-full bg-(--color-primary)/10 px-space-2 py-0.5 text-small font-semibold text-(--color-primary)">
          {typeLabel}
        </span>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            className="announcement-ticker-track flex w-max animate-[marquee_18s_linear_infinite] gap-space-8 motion-reduce:animate-none group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
          >
            <span className="whitespace-nowrap text-small text-(--color-text-primary)">
              {message}
            </span>
            <span
              aria-hidden="true"
              className="whitespace-nowrap text-small text-(--color-text-primary) motion-reduce:hidden"
            >
              {message}
            </span>
          </div>
        </div>

        {announcement.ctaHref && ctaLabel ? (
          <Link
            href={`/${locale}${announcement.ctaHref}`}
            className="inline-flex shrink-0 items-center gap-space-1 text-small font-semibold text-(--color-primary) hover:underline"
          >
            {ctaLabel}
            <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
          </Link>
        ) : null}

        <button
          type="button"
          onClick={handleDismiss}
          aria-label={t.announcementBar.dismissLabel}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-(--color-text-secondary) transition-colors hover:bg-(--color-border)/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)"
        >
          <MenuIcon open className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
