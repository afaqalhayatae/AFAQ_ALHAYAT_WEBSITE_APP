import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { getServiceBySlug } from "@/lib/catalog/services";
import { APPROVED_SERVICE_CONTENT_SLUGS, getServiceSeoData } from "@/lib/catalog/service-content";
import { buildAlternates, INDEXABLE, NOINDEX_FOLLOW } from "./metadata";

/**
 * Shared generateMetadata body for the three category-scoped service-detail
 * routes (maintenance/[slug], cleaning/[slug], pest-control hub). Prefers a
 * service's real, distinct SEO title/description/keywords
 * (getServiceSeoData) once Owner-approved; falls back to the generic
 * 2-field i18n name/description for anything not yet approved. `robots`
 * follows the same approval gate — INDEXABLE once approved, NOINDEX_FOLLOW
 * otherwise (Service Completion Phase, 2026-07-31, DECISION_LOG #38).
 */
export function buildServiceDetailMetadata(locale: Locale, slug: string, pathPrefix: string): Metadata {
  const service = getServiceBySlug(slug);
  if (!service) return {};

  const t = getMessages(locale);
  const entry = getServiceEntry(t, slug);
  const seo = getServiceSeoData(slug);
  const approved = APPROVED_SERVICE_CONTENT_SLUGS.includes(slug);

  return {
    title: seo?.seoTitle[locale] ?? entry.name,
    description: seo?.metaDescription[locale] ?? entry.description,
    keywords: seo?.keywords[locale],
    alternates: buildAlternates(locale, `${pathPrefix}/${slug}`),
    robots: approved ? INDEXABLE : NOINDEX_FOLLOW,
  };
}
