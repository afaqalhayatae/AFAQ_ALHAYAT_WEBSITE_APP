import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { getMessages } from "@/i18n/get-messages";
import { PhoneIcon, WhatsAppIcon } from "./icons";
import { PHONE_E164, WHATSAPP_URL } from "@/lib/brand/links";

type Messages = ReturnType<typeof getMessages>;

/**
 * Fixed mobile action bar (JOB-AGT-WEB-20260726-M4.1). Authorized by
 * MOBILE.md: "fixed WhatsApp button, fixed call button, fixed booking
 * button when needed." Desktop already surfaces these three actions in
 * the sticky header, so this is `desktop:hidden`. 44px (h-11) meets the
 * design system's minimum mobile tap-target size.
 */
export function MobileCtaBar({ locale, t }: { locale: Locale; t: Messages }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-space-2 border-t border-(--color-border) bg-(--color-surface) p-space-2 desktop:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.common.whatsappCta}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--color-whatsapp) text-white"
      >
        <WhatsAppIcon className="h-5 w-5" />
      </a>
      <a
        href={`tel:${PHONE_E164}`}
        aria-label={t.common.phone}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-(--color-border) text-(--color-text-primary)"
      >
        <PhoneIcon className="h-5 w-5" />
      </a>
      <Link
        href={`/${locale}/contact`}
        className="flex h-11 flex-1 items-center justify-center rounded-xl bg-(--color-primary) px-space-3 text-small font-semibold text-(--color-surface)"
      >
        {t.common.requestService}
      </Link>
    </div>
  );
}
