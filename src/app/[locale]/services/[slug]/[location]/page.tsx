import { isLocale, type Locale } from "@/i18n/config";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { ServiceLocationFallback } from "@/components/service-location-fallback";
import { SERVICES, getServiceBySlug } from "@/lib/catalog/services";
import { LOCATIONS, getLocationBySlug } from "@/lib/catalog/locations";
import { isActive } from "@/lib/catalog/matrix";
import { resolveServiceCityPath } from "@/lib/catalog/canonical-service-city";
import { buildAlternates, NOINDEX_FOLLOW } from "@/lib/seo/metadata";

/**
 * `slug: "pest-control"` is deliberately excluded from
 * generateStaticParams below — the explicit `/services/pest-control/`
 * folder (its own hub + sub-service routes) takes Next.js routing
 * precedence over this generic `[slug]` route for every path under that
 * prefix, so `/services/pest-control/{location}` (e.g. `.../dubai`) can
 * never actually be served here regardless of what params this route
 * generates for it. That combo is instead handled inside
 * `services/pest-control/[subService]/page.tsx`, which detects a
 * location slug and renders the identical `ServiceLocationFallback`
 * content (Canonical URL Architecture Finalization, JOB-AGT-WEB-20260730).
 */

/**
 * Canonical URL Architecture Finalization (JOB-AGT-WEB-20260730): this
 * legacy route is no longer the canonical destination for any service +
 * city combo once real content exists at the new `/services/{section}/
 * {slug}/{city}` pattern — see resolveServiceCityPath(). Until that
 * content ships, this page keeps serving exactly as before (nothing
 * regresses); the moment a combo's city-content entry is added, this
 * page starts 308-redirecting (the App Router's permanent-redirect
 * status; treated identically to a 301 by search engines) to the new
 * canonical URL instead of rendering — never deleted, per instruction,
 * so any bookmarked/indexed legacy link keeps resolving.
 */

export function generateStaticParams() {
  return SERVICES.filter((service) => service.slug !== "pest-control").flatMap((service) =>
    LOCATIONS.filter((location) => isActive(service.slug, location.slug)).map((location) => ({
      slug: service.slug,
      location: location.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; location: string }>;
}): Promise<Metadata> {
  const { locale, slug, location } = await params;
  if (!isLocale(locale)) return {};
  if (!getServiceBySlug(slug) || !getLocationBySlug(location)) return {};

  const t = getMessages(locale as Locale);
  const entry = getServiceEntry(t, slug);

  const locationName =
    location === "dubai" ? t.locations.dubai.title : location;

  return {
    title: `${entry.name} ${t.common.in} ${locationName}`,
    description: entry.description,
    alternates: buildAlternates(locale as Locale, resolveServiceCityPath(slug, location)),
    robots: NOINDEX_FOLLOW,
  };
}

export default async function ServiceLocationPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; location: string }>;
}) {
  const { locale, slug, location } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const service = getServiceBySlug(slug);
  const serviceLocation = getLocationBySlug(location);
  if (!service || slug === "pest-control" || !serviceLocation || !isActive(slug, location)) {
    notFound();
  }

  const canonicalPath = resolveServiceCityPath(slug, location);
  if (canonicalPath !== `services/${slug}/${location}`) {
    permanentRedirect(`/${locale}/${canonicalPath}`);
  }

  const typedLocale = locale as Locale;
  const t = getMessages(typedLocale);
  const entry = getServiceEntry(t, slug);
  const locationName = location === "dubai" ? t.locations.dubai.title : location;

  return (
    <ServiceLocationFallback
      locale={typedLocale}
      t={t}
      categoryLabel={t.services.categories[service.category]}
      name={entry.name}
      description={entry.description}
      serviceSlug={slug}
      locationSlug={location}
      locationName={locationName}
    />
  );
}
