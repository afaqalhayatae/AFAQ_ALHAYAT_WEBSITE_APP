import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { getServicesBySection } from "@/lib/catalog/service-sections";
import { ALL_EMIRATES } from "@/lib/catalog/locations";
import { getCityServiceContent } from "@/lib/catalog/city-content";
import { buildCityServiceMetadata } from "@/lib/seo/city-page-metadata";
import { CityPageContent } from "@/components/city-page-content";

/**
 * Cleaning service x city page (2026-07-30 city-SEO structure phase — see
 * src/lib/catalog/city-content.ts). Same pattern as
 * services/maintenance/[slug]/[city]/page.tsx — see that file's comment.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return getServicesBySection("cleaning").flatMap((service) =>
    ALL_EMIRATES.filter((emirate) => getCityServiceContent(service.slug, emirate.slug)).map(
      (emirate) => ({ slug: service.slug, city: emirate.slug })
    )
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; city: string }>;
}): Promise<Metadata> {
  const { locale, slug, city } = await params;
  if (!isLocale(locale)) return {};
  return buildCityServiceMetadata(locale as Locale, slug, city, "services/cleaning");
}

export default async function CleaningServiceCityPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; city: string }>;
}) {
  const { locale, slug, city } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const service = getServicesBySection("cleaning").find((candidate) => candidate.slug === slug);
  const emirate = ALL_EMIRATES.find((candidate) => candidate.slug === city);
  const content = getCityServiceContent(slug, city);
  if (!service || !emirate || !content) notFound();

  const t = getMessages(typedLocale);
  const entry = getServiceEntry(t, slug);
  const cityName = emirate.name[typedLocale];

  const relatedLinks = getServicesBySection("cleaning")
    .filter((candidate) => candidate.slug !== slug)
    .flatMap((candidate) => {
      const relatedContent = getCityServiceContent(candidate.slug, city);
      if (!relatedContent) return [];
      const relatedEntry = getServiceEntry(t, candidate.slug);
      return [
        {
          name: relatedEntry.name,
          href: `/${typedLocale}/services/cleaning/${candidate.slug}/${city}`,
        },
      ];
    });

  return (
    <CityPageContent
      locale={typedLocale}
      breadcrumbs={[
        { label: t.services.hero.title, href: `/${typedLocale}/services` },
        { label: t.services.sections.cleaning.name, href: `/${typedLocale}/services/cleaning` },
        { label: entry.name, href: `/${typedLocale}/services/cleaning/${slug}` },
      ]}
      content={content}
      cityName={cityName}
      // Direct booking link, not a generic contact form — SEO_CONTENT_QUALITY_AUDIT.md
      // §4. /book already validates and prefills both params for a real
      // catalog slug like this one.
      contactHref={`/${typedLocale}/book?service=${slug}&location=${city}`}
      locationHref={`/${typedLocale}/locations/${city}`}
      category="cleaning"
      relatedTitle={`${t.services.cityPage.relatedTitle} ${cityName}`}
      relatedLinks={relatedLinks}
      faqTitle={t.services.detail.faqTitle}
      canonicalPath={`services/cleaning/${slug}/${city}`}
    />
  );
}
