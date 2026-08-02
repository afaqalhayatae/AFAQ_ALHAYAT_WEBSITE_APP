import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getCityServiceContent, getCitySectionContent } from "@/lib/catalog/city-content";
import { buildAlternates, NOINDEX_FOLLOW } from "./metadata";

/** Shared generateMetadata body for every service-level city page. */
export function buildCityServiceMetadata(
  locale: Locale,
  serviceSlug: string,
  citySlug: string,
  pathPrefix: string
): Metadata {
  const content = getCityServiceContent(serviceSlug, citySlug);
  if (!content) return {};

  return {
    title: content.title[locale],
    description: content.metaDescription[locale],
    alternates: buildAlternates(locale, `${pathPrefix}/${serviceSlug}/${citySlug}`),
    robots: NOINDEX_FOLLOW,
  };
}

/** Shared generateMetadata body for every section-level city page. */
export function buildCitySectionMetadata(
  locale: Locale,
  section: string,
  citySlug: string,
  pathPrefix: string
): Metadata {
  const content = getCitySectionContent(section, citySlug);
  if (!content) return {};

  return {
    title: content.title[locale],
    description: content.metaDescription[locale],
    alternates: buildAlternates(locale, `${pathPrefix}/city/${citySlug}`),
    robots: NOINDEX_FOLLOW,
  };
}
