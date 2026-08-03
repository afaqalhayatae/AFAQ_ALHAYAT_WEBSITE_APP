import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMessages } from "@/i18n/get-messages";
import { ALL_EMIRATES } from "@/lib/catalog/locations";
import { getCityServiceContent } from "@/lib/catalog/city-content";
import { buildCityServiceMetadata } from "@/lib/seo/city-page-metadata";
import {
  PEST_CONTROL_SUB_SERVICE_PAGES,
  getPestControlSubServicePage,
} from "@/lib/catalog/pest-control-pages";
import { CityPageContent } from "@/components/city-page-content";

/**
 * Pest-control sub-service x city page (2026-07-30 city-SEO structure
 * phase — see src/lib/catalog/city-content.ts). Keyed by the pest-control
 * sub-service id (e.g. "cockroach-control"), not a services.ts slug,
 * since pest types live in their own catalog (pest-control-pages.ts).
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return PEST_CONTROL_SUB_SERVICE_PAGES.flatMap((page) =>
    ALL_EMIRATES.filter((emirate) => getCityServiceContent(page.id, emirate.slug)).map((emirate) => ({
      subService: page.id,
      city: emirate.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; subService: string; city: string }>;
}): Promise<Metadata> {
  const { locale, subService, city } = await params;
  if (!isLocale(locale)) return {};
  return buildCityServiceMetadata(locale as Locale, subService, city, "services/pest-control");
}

export default async function PestControlSubServiceCityPage({
  params,
}: {
  params: Promise<{ locale: string; subService: string; city: string }>;
}) {
  const { locale, subService, city } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const page = getPestControlSubServicePage(subService);
  const emirate = ALL_EMIRATES.find((candidate) => candidate.slug === city);
  const content = getCityServiceContent(subService, city);
  if (!page || !emirate || !content) notFound();

  const t = getMessages(typedLocale);
  const cityName = emirate.name[typedLocale];

  const relatedLinks = PEST_CONTROL_SUB_SERVICE_PAGES.filter(
    (candidate) => candidate.id !== subService
  ).flatMap((candidate) => {
    const relatedContent = getCityServiceContent(candidate.id, city);
    if (!relatedContent) return [];
    return [
      {
        name: candidate.name[typedLocale],
        href: `/${typedLocale}/services/pest-control/${candidate.id}/${city}`,
      },
    ];
  });

  return (
    <CityPageContent
      locale={typedLocale}
      breadcrumbs={[
        { label: t.services.hero.title, href: `/${typedLocale}/services` },
        { label: t.services.sections["pest-control"].name, href: `/${typedLocale}/services/pest-control` },
        { label: page.name[typedLocale], href: `/${typedLocale}/services/pest-control/${subService}` },
      ]}
      content={content}
      cityName={cityName}
      contactHref={`/${typedLocale}/contact`}
      relatedTitle={`${t.services.cityPage.relatedTitle} ${cityName}`}
      relatedLinks={relatedLinks}
      canonicalPath={`services/pest-control/${subService}/${city}`}
    />
  );
}
