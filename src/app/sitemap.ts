import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { LOCATIONS } from "@/lib/catalog/locations";
import { BLOG_POSTS } from "@/lib/catalog/blog";

const SITE_URL = "https://afaqalhayatae.com";

/**
 * JOB-AGT-WEB-20260726-M4.1 — only routes making already-approved facts
 * (no per-service or per-service-location content yet). Indexable
 * locations are added automatically as LOCATIONS grows; blog articles
 * (JOB-AGT-WEB-20260726-M4.3) are added automatically as BLOG_POSTS
 * grows. Posts with `isDemo: true` (temporary M4.5 visual-testing data)
 * are filtered out below — only real, published articles are indexable.
 */
const STATIC_PATHS = [
  "",
  "about",
  "services",
  "locations",
  "faq",
  "blog",
  "contact",
  "privacy-policy",
  "terms-and-conditions",
  "cookie-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    for (const locale of locales) {
      const suffix = path ? `/${path}` : "";
      entries.push({
        url: `${SITE_URL}/${locale}${suffix}`,
        alternates: {
          languages: Object.fromEntries(
            locales.map((candidate) => [candidate, `${SITE_URL}/${candidate}${suffix}`])
          ),
        },
      });
    }
  }

  for (const location of LOCATIONS) {
    if (!location.indexable) continue;
    for (const locale of locales) {
      const suffix = `/locations/${location.slug}`;
      entries.push({
        url: `${SITE_URL}/${locale}${suffix}`,
        alternates: {
          languages: Object.fromEntries(
            locales.map((candidate) => [candidate, `${SITE_URL}/${candidate}${suffix}`])
          ),
        },
      });
    }
  }

  for (const post of BLOG_POSTS.filter((candidate) => !candidate.isDemo)) {
    for (const locale of locales) {
      const suffix = `/blog/${post.slug}`;
      entries.push({
        url: `${SITE_URL}/${locale}${suffix}`,
        lastModified: post.publishDate,
        alternates: {
          languages: Object.fromEntries(
            locales.map((candidate) => [candidate, `${SITE_URL}/${candidate}${suffix}`])
          ),
        },
      });
    }
  }

  return entries;
}
