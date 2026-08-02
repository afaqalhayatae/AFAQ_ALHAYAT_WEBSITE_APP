import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildServiceDetailMetadata } from "@/lib/seo/service-detail-metadata";
import { ServiceDetailContent } from "@/components/service-detail-content";

/**
 * Explicit static route (JOB-AGT-WEB-20260730 structure phase) — takes
 * Next.js routing precedence over the sibling src/app/[locale]/services/
 * [slug]/page.tsx for the exact "/services/pest-control" path, same as
 * "/services/maintenance" and "/services/cleaning". Renders identically
 * to what that generic route already rendered for slug="pest-control"
 * (this page IS the Pest Control hub — hero, overview, then the
 * sub-service grid via ServicePestTypesSection inside ServiceDetailContent)
 * — no content or layout changed, only made an explicit route.
 *
 * Metadata: `buildServiceDetailMetadata` (2026-07-31 update) now itself
 * prefers a service's real SEO data and INDEXABLE robots once approved —
 * pest-control was the first (and, as of this date, only fully) approved
 * hub, so this route no longer needs its own bespoke override.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildServiceDetailMetadata(locale as Locale, "pest-control", "services");
}

export default async function PestControlPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <ServiceDetailContent locale={locale as Locale} slug="pest-control" />;
}
