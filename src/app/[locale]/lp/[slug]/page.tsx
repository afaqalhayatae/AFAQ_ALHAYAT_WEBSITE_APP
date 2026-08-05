import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMessages } from "@/i18n/get-messages";
import { GoogleAdsLandingPage } from "@/components/google-ads-landing-page";
import { getLandingPage, LANDING_PAGES } from "@/lib/catalog/landing-pages";
import { buildAlternates, INDEXABLE } from "@/lib/seo/metadata";

/**
 * Google Ads landing pages (CRO/GEO build, 2026-08-06) — conversion-focused
 * pages distinct from the informational /services/{section}/{slug} pages,
 * built for paid-traffic message-match (ad copy -> landing page -> booking
 * form). One dynamic route + one shared GoogleAdsLandingPage component
 * renders every entry in LANDING_PAGES (src/lib/catalog/landing-pages.ts),
 * the same pattern the site already uses for blog posts and services
 * rather than a bespoke page per campaign.
 */

export function generateStaticParams() {
  return LANDING_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const page = getLandingPage(slug);
  if (!page) return {};

  const typedLocale = locale as Locale;
  return {
    title: page.seo.title[typedLocale],
    description: page.seo.description[typedLocale],
    keywords: page.seo.keywords[typedLocale],
    alternates: buildAlternates(typedLocale, `lp/${slug}`),
    robots: INDEXABLE,
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const page = getLandingPage(slug);
  if (!page) notFound();

  const typedLocale = locale as Locale;
  const t = getMessages(typedLocale);

  return <GoogleAdsLandingPage locale={typedLocale} t={t} data={page} />;
}
