import { isLocale, type Locale } from "@/i18n/config";
import { notFound, permanentRedirect } from "next/navigation";
import { SERVICES } from "@/lib/catalog/services";
import { getServiceSection } from "@/lib/catalog/service-sections";

/**
 * Structure-phase redirect (2026-07-30). This file used to render every
 * service's detail page directly at the flat /services/[slug] URL. That
 * rendering now lives at the new category-scoped routes
 * (/services/maintenance/[slug], /services/cleaning/[slug],
 * /services/pest-control) built in src/components/service-detail-content.tsx
 * — see that file for the actual page content, unchanged.
 *
 * The file itself is kept (not deleted, per the Owner's explicit
 * instruction) and now only redirects old flat links to their new
 * canonical nested URL, so nothing that already linked to
 * /services/<slug> breaks. Pest Control's exact URL is unaffected
 * either way — the new static services/pest-control/page.tsx already
 * takes Next.js routing precedence over this dynamic [slug] route for
 * that one path.
 *
 * Uses `permanentRedirect` (308), not `redirect` (307) — this is a
 * permanent URL architecture change, not a temporary one, so search
 * engines should consolidate ranking signals onto the new canonical
 * URL. Fixed 2026-08-06 (production launch preparation pass) to match
 * the equivalent legacy redirect in services/[slug]/[location]/page.tsx,
 * which already used permanentRedirect correctly.
 */

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export default async function LegacyServiceSlugRedirect({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const section = getServiceSection(slug);
  if (!section) notFound();

  const typedLocale = locale as Locale;
  const destination =
    section === "pest-control"
      ? `/${typedLocale}/services/pest-control`
      : `/${typedLocale}/services/${section}/${slug}`;

  permanentRedirect(destination);
}
