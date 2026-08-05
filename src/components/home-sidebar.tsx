import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import { ClockIcon, PhoneIcon, ShieldCheckIcon, WhatsAppIcon } from "./icons";
import { Button } from "./ui/button";
import { PHONE_E164, WHATSAPP_URL } from "@/lib/brand/links";

type Messages = ReturnType<typeof getMessages>;

/**
 * Homepage quick-actions bar (Owner-requested, 2026-08-04; redesigned
 * 2026-08-05 from a viewport-fixed panel to a real in-layout element).
 * Desktop-only — `hidden desktop:flex`. Rendered by page.tsx as a
 * normal block directly after the Hero, in its own full-width section —
 * not `position: fixed`/`absolute` against anything, so it can never
 * overlap other content and simply scrolls away with the page like
 * every other section. A horizontal bar (not the earlier version's
 * narrow vertical card) since it no longer has to fit inside a fixed
 * viewport corner or overlap the hero photo.
 *
 * Trimmed from the original version's fuller content (popular services
 * list, emirate chips) — those already have their own, better-placed
 * sections further down this same page (Services grid, Areas grid), so
 * repeating them here was redundant, not missing coverage. This bar's
 * one job is the fast path: book, WhatsApp, call, plus the two trust
 * facts everyone lands here to confirm.
 */
export function HomeQuickActions({ locale, t }: { locale: Locale; t: Messages }) {
  return (
    <div
      aria-label={t.homeSidebar.quickActions}
      className="hidden flex-wrap items-center justify-between gap-space-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-4 shadow-md desktop:flex"
    >
      <div className="flex items-center gap-space-2">
        <Button href={`/${locale}/book`} variant="primary">
          {t.home.booking.button}
        </Button>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.common.whatsappCta}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--color-whatsapp) text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
        >
          <WhatsAppIcon className="h-5 w-5" />
        </a>
        <a
          href={`tel:${PHONE_E164}`}
          aria-label={t.common.callNow}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-(--color-border) text-(--color-text-primary) transition-all duration-200 hover:-translate-y-0.5 hover:border-(--color-primary) hover:text-(--color-primary) hover:shadow-md"
        >
          <PhoneIcon className="h-5 w-5" />
        </a>
      </div>

      <div className="flex items-center gap-space-4">
        <div className="flex items-center gap-space-1 text-small text-(--color-text-secondary)">
          <ClockIcon className="h-4 w-4 shrink-0 text-(--color-primary)" />
          <span>{t.homeSidebar.trustAvailability}</span>
        </div>
        <div className="flex items-center gap-space-1 text-small text-(--color-text-secondary)">
          <ShieldCheckIcon className="h-4 w-4 shrink-0 text-(--color-primary)" />
          <span>{t.homeSidebar.trustCoverage}</span>
        </div>
      </div>
    </div>
  );
}
