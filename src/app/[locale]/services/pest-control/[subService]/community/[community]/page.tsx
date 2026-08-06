import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMessages } from "@/i18n/get-messages";
import { COMMUNITIES, getCommunityBySlug } from "@/lib/catalog/communities";
import { getCommunityServiceContent } from "@/lib/catalog/community-content";
import { buildCommunityServiceMetadata } from "@/lib/seo/community-page-metadata";
import {
  PEST_CONTROL_SUB_SERVICE_PAGES,
  getPestControlSubServicePage,
} from "@/lib/catalog/pest-control-pages";
import { CityPageContent } from "@/components/city-page-content";

/**
 * Pest-control sub-service x community page (2026-08-06 local SEO
 * expansion, Phase 2). Same pattern as
 * services/pest-control/[subService]/[city]/page.tsx, one level more
 * specific — see src/lib/catalog/community-content.ts.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return PEST_CONTROL_SUB_SERVICE_PAGES.flatMap((page) =>
    COMMUNITIES.filter((community) => getCommunityServiceContent(page.id, community.slug)).map(
      (community) => ({ subService: page.id, community: community.slug })
    )
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; subService: string; community: string }>;
}): Promise<Metadata> {
  const { locale, subService, community } = await params;
  if (!isLocale(locale)) return {};
  return buildCommunityServiceMetadata(locale as Locale, subService, community, "services/pest-control");
}

export default async function PestControlSubServiceCommunityPage({
  params,
}: {
  params: Promise<{ locale: string; subService: string; community: string }>;
}) {
  const { locale, subService, community } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const page = getPestControlSubServicePage(subService);
  const communityEntry = getCommunityBySlug(community);
  const content = getCommunityServiceContent(subService, community);
  if (!page || !communityEntry || !content) notFound();

  const t = getMessages(typedLocale);
  const communityName = communityEntry.name[typedLocale];

  const relatedLinks = PEST_CONTROL_SUB_SERVICE_PAGES.filter(
    (candidate) => candidate.id !== subService
  ).flatMap((candidate) => {
    const relatedContent = getCommunityServiceContent(candidate.id, community);
    if (!relatedContent) return [];
    return [
      {
        name: candidate.name[typedLocale],
        href: `/${typedLocale}/services/pest-control/${candidate.id}/community/${community}`,
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
      cityName={communityName}
      contactHref={`/${typedLocale}/book?service=pest-control&location=${communityEntry.emirateSlug}`}
      locationHref={`/${typedLocale}/locations/${communityEntry.emirateSlug}`}
      category="pest-control"
      relatedTitle={`${t.services.cityPage.relatedTitle} ${communityName}`}
      relatedLinks={relatedLinks}
      faqTitle={t.services.detail.faqTitle}
      canonicalPath={`services/pest-control/${subService}/community/${community}`}
    />
  );
}
