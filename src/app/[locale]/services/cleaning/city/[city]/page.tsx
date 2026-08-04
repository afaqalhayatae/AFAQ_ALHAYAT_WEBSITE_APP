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
 * Cleaning section x city page — e.g. "Home Cleaning in Dubai" (2026-07-30
 * city-SEO structure phase, see src/lib/catalog/city-content.ts). Same
 * "/city/[city]" disambiguator pattern as
 * services/maintenance/city/[city]/page.tsx — see that file's comment.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_EMIRATES.filter((emirate) => getCitySectionContent("cleaning", emirate.slug)).map(
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
  return buildCitySectionMetadata(locale as Locale, "cleaning", city, "services/cleaning");
}

export default async function CleaningCityPage({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}) {
  const { locale, city } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const emirate = ALL_EMIRATES.find((candidate) => candidate.slug === city);
  const content = getCitySectionContent("cleaning", city);
  if (!emirate || !content) notFound();

  const t = getMessages(typedLocale);
  const cityName = emirate.name[typedLocale];

  const relatedLinks = getServicesBySection("cleaning").flatMap((service) => {
    const serviceContent = getCityServiceContent(service.slug, city);
    if (!serviceContent) return [];
    const entry = getServiceEntry(t, service.slug);
    return [{ name: entry.name, href: `/${typedLocale}/services/cleaning/${service.slug}/${city}` }];
  });

  return (
    <CityPageContent
      locale={typedLocale}
      breadcrumbs={[
        { label: t.services.hero.title, href: `/${typedLocale}/services` },
        { label: t.services.sections.cleaning.name, href: `/${typedLocale}/services/cleaning` },
      ]}
      content={content}
      cityName={cityName}
      contactHref={`/${typedLocale}/book?location=${city}`}
      locationHref={`/${typedLocale}/locations/${city}`}
      category="cleaning"
      relatedTitle={`${t.services.cityPage.relatedTitle} ${cityName}`}
      relatedLinks={relatedLinks}
      faqTitle={t.services.detail.faqTitle}
      canonicalPath={`services/cleaning/city/${city}`}
    />
  );
}
