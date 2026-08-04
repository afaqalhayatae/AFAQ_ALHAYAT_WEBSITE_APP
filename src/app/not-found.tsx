import Link from "next/link";
import "./globals.css";
import { defaultLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import { EmptyState } from "@/components/empty-state";

/**
 * Root-level 404 fallback (Production Readiness pass, 2026-08-04) — a
 * second, distinct case from src/app/[locale]/not-found.tsx. That one
 * catches notFound() calls from *within* an already-locale-resolved page
 * (e.g. an unknown service slug — the vast majority of notFound() calls
 * in this codebase). This one catches a path that never matched any
 * route at all, not even the [locale] segment (e.g. a bare typo'd URL,
 * or a broken external link) — Next.js falls back to this root boundary
 * for those, bypassing the nested one entirely. No `params`/locale is
 * available here by the App Router's own design (the path never resolved
 * to a route, so there's no route params to read), so this renders in
 * `defaultLocale` — the same fallback already used for `x-default`
 * hreflang elsewhere in this codebase, not a new convention.
 */
export default function RootNotFound() {
  const t = getMessages(defaultLocale);

  return (
    <html lang={defaultLocale} dir="rtl">
      <body>
        <EmptyState title={t.notFound.title} description={t.notFound.description}>
          <div className="mt-space-4 flex flex-wrap items-center justify-center gap-space-2">
            <Link
              href={`/${defaultLocale}`}
              className="flex h-12 items-center justify-center rounded-xl bg-(--color-primary) px-space-4 text-small font-semibold text-(--color-surface) transition-opacity hover:opacity-90"
            >
              {t.notFound.backHome}
            </Link>
            <Link
              href={`/${defaultLocale}/services`}
              className="flex h-12 items-center justify-center rounded-xl border border-(--color-border) px-space-4 text-small font-semibold text-(--color-text-primary) transition-colors hover:border-(--color-primary) hover:text-(--color-primary)"
            >
              {t.notFound.browseServices}
            </Link>
          </div>
        </EmptyState>
      </body>
    </html>
  );
}
