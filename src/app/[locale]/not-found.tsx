import Link from "next/link";
import { isLocale, type Locale, defaultLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import { EmptyState } from "@/components/empty-state";

/**
 * Branded 404 page (Production Readiness pass, 2026-08-04). Without this,
 * every notFound() call throughout the app (used extensively — invalid
 * locale, unknown service/location/blog slug, etc.) fell through to
 * Next.js's generic, unbranded default 404, in neither language. Reuses
 * the existing EmptyState component rather than a new pattern.
 *
 * Next.js's `not-found.tsx` under a dynamic segment receives the same
 * params as its sibling page.tsx, but params can legitimately be missing
 * (e.g. a route that never matched the [locale] segment at all) — falls
 * back to defaultLocale rather than rendering unlabeled/broken UI.
 */
export default async function LocaleNotFound({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}) {
  const resolved = await params?.catch(() => undefined);
  const locale: Locale = resolved?.locale && isLocale(resolved.locale) ? resolved.locale : defaultLocale;
  const t = getMessages(locale);

  return (
    <EmptyState title={t.notFound.title} description={t.notFound.description}>
      <div className="mt-space-4 flex flex-wrap items-center justify-center gap-space-2">
        <Link
          href={`/${locale}`}
          className="flex h-12 items-center justify-center rounded-xl bg-(--color-primary) px-space-4 text-small font-semibold text-(--color-surface) transition-opacity hover:opacity-90"
        >
          {t.notFound.backHome}
        </Link>
        <Link
          href={`/${locale}/services`}
          className="flex h-12 items-center justify-center rounded-xl border border-(--color-border) px-space-4 text-small font-semibold text-(--color-text-primary) transition-colors hover:border-(--color-primary) hover:text-(--color-primary)"
        >
          {t.notFound.browseServices}
        </Link>
      </div>
    </EmptyState>
  );
}
