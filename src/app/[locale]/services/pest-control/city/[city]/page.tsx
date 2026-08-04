import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMessages } from "@/i18n/get-messages";
import { ALL_EMIRATES } from "@/lib/catalog/locations";
import { getCityServiceContent, getCitySectionContent } from "@/lib/catalog/city-content";
import { buildCitySectionMetadata } from "@/lib/seo/city-page-metadata";
import { PEST_CONTROL_SUB_SERVICE_PAGES } from "@/lib/catalog/pest-control-pages";
import { CityPageContent } from "@/components/city-page-content";

/**
 * Pest Control section x city page — e.g. "Pest Control in Dubai"
 * (2026-07-30 city-SEO structure phase, see src/lib/catalog/city-content.ts).
 * Lives at /services/pest-control/city/[city] (not /services/pest-control/[city])
 * for the same reason as services/maintenance/city/[city]/page.tsx — a
 * static "city" segment can't share a slot with the sibling dynamic
 * [subService] segment under services/pest-control/[subService]/page.tsx.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_EMIRATES.filter((emirate) => getCitySectionContent("pest-control", emirate.slug)).map(
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
  return buildCitySectionMetadata(locale as Locale, "pest-control", city, "services/pest-control");
}

export default async function PestControlCityPage({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}) {
  const { locale, city } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const emirate = ALL_EMIRATES.find((candidate) => candidate.slug === city);
  const content = getCitySectionContent("pest-control", city);
  if (!emirate || !content) notFound();

  const t = getMessages(typedLocale);
  const cityName = emirate.name[typedLocale];

  const relatedLinks = PEST_CONTROL_SUB_SERVICE_PAGES.flatMap((page) => {
    const serviceContent = getCityServiceContent(page.id, city);
    if (!serviceContent) return [];
    return [{ name: page.name[typedLocale], href: `/${typedLocale}/services/pest-control/${page.id}/${city}` }];
  });

  return (
    <CityPageContent
      locale={typedLocale}
      breadcrumbs={[
        { label: t.services.hero.title, href: `/${typedLocale}/services` },
        { label: t.services.sections["pest-control"].name, href: `/${typedLocale}/services/pest-control` },
      ]}
      content={content}
      cityName={cityName}
      contactHref={`/${typedLocale}/book?service=pest-control&location=${city}`}
      locationHref={`/${typedLocale}/locations/${city}`}
      category="pest-control"
      relatedTitle={`${t.services.cityPage.relatedTitle} ${cityName}`}
      relatedLinks={relatedLinks}
      faqTitle={t.services.detail.faqTitle}
      canonicalPath={`services/pest-control/city/${city}`}
    />
  );
}
