import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { getServicesBySection } from "@/lib/catalog/service-sections";
import { ALL_EMIRATES } from "@/lib/catalog/locations";
import { getCityServiceContent, getCitySectionContent } from "@/lib/catalog/city-content";
import { buildCitySectionMetadata } from "@/lib/seo/city-page-metadata";
import { CityPageContent } from "@/components/city-page-content";

/**
 * Maintenance section x city page — e.g. "Home Maintenance in Dubai"
 * (2026-07-30 city-SEO structure phase, see src/lib/catalog/city-content.ts).
 * Lives at /services/maintenance/city/[city] (not /services/maintenance/[city])
 * because Next.js does not allow two differently-named dynamic segments
 * ([slug] vs [city]) as siblings — the "city" segment disambiguates this
 * from services/maintenance/[slug]/page.tsx.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_EMIRATES.filter((emirate) => getCitySectionContent("maintenance", emirate.slug)).map(
    (emirate) => ({ city: emirate.slug })
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}): Promise<Metadata> {
  const { locale, city } = await params;
  if (!isLocale(locale)) return {};
  return buildCitySectionMetadata(locale as Locale, "maintenance", city, "services/maintenance");
}

export default async function MaintenanceCityPage({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}) {
  const { locale, city } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const emirate = ALL_EMIRATES.find((candidate) => candidate.slug === city);
  const content = getCitySectionContent("maintenance", city);
  if (!emirate || !content) notFound();

  const t = getMessages(typedLocale);
  const cityName = emirate.name[typedLocale];

  const relatedLinks = getServicesBySection("maintenance").flatMap((service) => {
    const serviceContent = getCityServiceContent(service.slug, city);
    if (!serviceContent) return [];
    const entry = getServiceEntry(t, service.slug);
    return [{ name: entry.name, href: `/${typedLocale}/services/maintenance/${service.slug}/${city}` }];
  });

  return (
    <CityPageContent
      locale={typedLocale}
      breadcrumbs={[
        { label: t.services.hero.title, href: `/${typedLocale}/services` },
        { label: t.services.sections.maintenance.name, href: `/${typedLocale}/services/maintenance` },
      ]}
      content={content}
      cityName={cityName}
      contactHref={`/${typedLocale}/book?location=${city}`}
      locationHref={`/${typedLocale}/locations/${city}`}
      category="maintenance"
      relatedTitle={`${t.services.cityPage.relatedTitle} ${cityName}`}
      relatedLinks={relatedLinks}
      faqTitle={t.services.detail.faqTitle}
      canonicalPath={`services/maintenance/city/${city}`}
    />
  );
}
