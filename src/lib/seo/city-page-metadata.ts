import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import {
  getCityServiceContent,
  getCitySectionContent,
  isCityPagePublishReady,
  isCitySectionPublishReady,
} from "@/lib/catalog/city-content";
import { buildAlternates, INDEXABLE, NOINDEX_FOLLOW } from "./metadata";

/**
 * Shared generateMetadata body for every service-level city page.
 * `robots` was unconditionally NOINDEX_FOLLOW until 2026-08-04 — see
 * isCityPagePublishReady()'s own comment (city-content.ts) for why that
 * was a real, active problem (these pages are also in sitemap.xml) and
 * what the fix connects to.
 */
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
    robots: isCityPagePublishReady(serviceSlug, citySlug) ? INDEXABLE : NOINDEX_FOLLOW,
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
    robots: isCitySectionPublishReady(section, citySlug) ? INDEXABLE : NOINDEX_FOLLOW,
  };
}
