import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { getMessages } from "@/i18n/get-messages";
import { WhatsAppIcon } from "./icons";
import { WHATSAPP_URL } from "@/lib/brand/links";

type Messages = ReturnType<typeof getMessages>;

/**
 * Shared "service in city" fallback rendering (Canonical URL Architecture
 * Finalization, JOB-AGT-WEB-20260730). Originally the entire body of the
 * legacy `/services/{slug}/{location}` route; extracted here so the
 * Pest Control sub-service route can render the exact same content for
 * its own legacy combo (`/services/pest-control/{location}`, e.g.
 * `/services/pest-control/dubai`) — a URL the generic legacy route can
 * never actually serve, because the explicit `/services/pest-control/`
 * folder takes Next.js routing precedence over the sibling `[slug]`
 * route at that path, shadowing it. No new copy: same category label,
 * `entry.name`/`entry.description`, and CTAs as before.
 */
export function ServiceLocationFallback({
  locale,
  t,
  categoryLabel,
  name,
  description,
  serviceSlug,
  locationSlug,
  locationName,
}: {
  locale: Locale;
  t: Messages;
  categoryLabel: string;
  name: string;
  description: string;
  serviceSlug: string;
  locationSlug: string;
  locationName: string;
}) {
  return (
    <section className="mx-auto max-w-desktop px-space-3 py-space-7">
      <p className="text-small font-semibold uppercase tracking-wide text-(--color-primary)">
        {categoryLabel}
      </p>
      <h1 className="mt-space-2 text-h1 font-bold text-(--color-text-primary)">
        {name} {t.common.in} {locationName}
      </h1>
      <p className="mt-space-3 max-w-2xl text-lead text-(--color-text-secondary)">
        {description}
      </p>

      <div className="mt-space-4 flex flex-wrap gap-space-2">
        <Link
          href={`/${locale}/contact`}
          className="rounded-xl bg-(--color-primary) px-space-4 py-space-2 text-small font-semibold text-(--color-surface) transition-opacity hover:opacity-90"
        >
          {t.common.requestService}
        </Link>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-space-1 rounded-xl border border-(--color-border) px-space-4 py-space-2 text-small font-semibold text-(--color-text-primary) transition-colors hover:border-(--color-whatsapp) hover:text-(--color-whatsapp)"
        >
          <WhatsAppIcon className="h-5 w-5" />
          {t.common.whatsappCta}
        </a>
      </div>

      <div className="mt-space-5 flex flex-wrap gap-space-4 text-small font-semibold text-(--color-primary)">
        <Link href={`/${locale}/services/${serviceSlug}`}>{t.locations.combo.backToService}</Link>
        <Link href={`/${locale}/locations/${locationSlug}`}>{t.locations.combo.backToLocation}</Link>
      </div>
    </section>
  );
}
