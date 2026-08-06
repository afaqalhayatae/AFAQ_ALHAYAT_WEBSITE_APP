import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { getServicesBySection } from "@/lib/catalog/service-sections";
import { COMMUNITIES, getCommunityBySlug } from "@/lib/catalog/communities";
import { getCommunityServiceContent } from "@/lib/catalog/community-content";
import { buildCommunityServiceMetadata } from "@/lib/seo/community-page-metadata";
import { CityPageContent } from "@/components/city-page-content";

/**
 * Cleaning service x community page (2026-08-06 local SEO expansion,
 * Phase 2 — see src/lib/catalog/community-content.ts). One level more
 * specific than services/cleaning/[slug]/[city]/page.tsx, same pattern:
 * CityPageContent is reused as-is (it only needs a name/href for the
 * "city" slot, agnostic to whether that's an emirate or a community).
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return getServicesBySection("cleaning").flatMap((service) =>
    COMMUNITIES.filter((community) => getCommunityServiceContent(service.slug, community.slug)).map(
      (community) => ({ slug: service.slug, community: community.slug })
    )
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; community: string }>;
}): Promise<Metadata> {
  const { locale, slug, community } = await params;
  if (!isLocale(locale)) return {};
  return buildCommunityServiceMetadata(locale as Locale, slug, community, "services/cleaning");
}

export default async function CleaningServiceCommunityPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; community: string }>;
}) {
  const { locale, slug, community } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const service = getServicesBySection("cleaning").find((candidate) => candidate.slug === slug);
  const communityEntry = getCommunityBySlug(community);
  const content = getCommunityServiceContent(slug, community);
  if (!service || !communityEntry || !content) notFound();

  const t = getMessages(typedLocale);
  const entry = getServiceEntry(t, slug);
  const communityName = communityEntry.name[typedLocale];

  const relatedLinks = getServicesBySection("cleaning")
    .filter((candidate) => candidate.slug !== slug)
    .flatMap((candidate) => {
      const relatedContent = getCommunityServiceContent(candidate.slug, community);
      if (!relatedContent) return [];
      const relatedEntry = getServiceEntry(t, candidate.slug);
      return [
        {
          name: relatedEntry.name,
          href: `/${typedLocale}/services/cleaning/${candidate.slug}/community/${community}`,
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
      cityName={communityName}
      contactHref={`/${typedLocale}/book?service=${slug}&location=${communityEntry.emirateSlug}`}
      // No community-specific hub page exists yet — links to the parent
      // emirate's hub, same as every other cross-link on this page does
      // for anything not yet built out to community granularity.
      locationHref={`/${typedLocale}/locations/${communityEntry.emirateSlug}`}
      category="cleaning"
      serviceSlug={slug}
      relatedTitle={`${t.services.cityPage.relatedTitle} ${communityName}`}
      relatedLinks={relatedLinks}
      faqTitle={t.services.detail.faqTitle}
      canonicalPath={`services/cleaning/${slug}/community/${community}`}
    />
  );
}
