import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import {
  getCommunityServiceContent,
  isCommunityPagePublishReady,
} from "@/lib/catalog/community-content";
import { buildAlternates, INDEXABLE, NOINDEX_FOLLOW } from "./metadata";
import { SITE_URL } from "@/lib/brand/links";

/** Same contract as city-page-metadata.ts's buildCityServiceMetadata, one
 *  level more specific (community instead of emirate). */
export function buildCommunityServiceMetadata(
  locale: Locale,
  serviceSlug: string,
  communitySlug: string,
  pathPrefix: string
): Metadata {
  const content = getCommunityServiceContent(serviceSlug, communitySlug);
  if (!content) return {};

  return {
    title: content.title[locale],
    description: content.metaDescription[locale],
    alternates: buildAlternates(locale, `${pathPrefix}/${serviceSlug}/community/${communitySlug}`),
    robots: isCommunityPagePublishReady(serviceSlug, communitySlug) ? INDEXABLE : NOINDEX_FOLLOW,
    ...(content.image && content.imageAlt
      ? {
          openGraph: {
            title: content.title[locale],
            description: content.metaDescription[locale],
            images: [{ url: `${SITE_URL}/brand/images/services/${content.image}`, alt: content.imageAlt[locale] }],
          },
        }
      : {}),
  };
}
