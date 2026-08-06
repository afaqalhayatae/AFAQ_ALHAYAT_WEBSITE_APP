import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { LOCATIONS, ALL_EMIRATES } from "@/lib/catalog/locations";
import { BLOG_POSTS } from "@/lib/catalog/blog";
import { SERVICES } from "@/lib/catalog/services";
import { APPROVED_SERVICE_CONTENT_SLUGS } from "@/lib/catalog/service-content";
import { getServiceSection, SERVICE_SECTIONS } from "@/lib/catalog/service-sections";
import { PEST_CONTROL_SUB_SERVICE_PAGES } from "@/lib/catalog/pest-control-pages";
import { getCityServiceContent, getCitySectionContent } from "@/lib/catalog/city-content";
import { COMMUNITIES } from "@/lib/catalog/communities";
import { getCommunityServiceContent } from "@/lib/catalog/community-content";
import { LANDING_PAGES } from "@/lib/catalog/landing-pages";
import { SITE_URL } from "@/lib/brand/links";

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

  /**
   * Canonical URL Architecture Finalization (JOB-AGT-WEB-20260730):
   * city-SEO pages (`/services/{section}/{slug}/{city}` and the
   * section-level `/services/{section}/city/{city}`) only ever enter
   * the sitemap once CITY_SERVICE_CONTENT / CITY_SECTION_CONTENT
   * (city-content.ts) has a real, approved entry for that combo — both
   * registries are empty today, so this loop adds nothing yet. No
   * legacy `/services/{slug}/{location}` page is ever added here (it
   * never was); once a combo gets real content the legacy page 308-
   * redirects to the URL this loop adds, so only the canonical one is
   * ever indexable.
   */
  for (const emirate of ALL_EMIRATES) {
    for (const section of SERVICE_SECTIONS) {
      if (getCitySectionContent(section, emirate.slug)) {
        for (const locale of locales) {
          const suffix = `/services/${section}/city/${emirate.slug}`;
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
    }

    const serviceSlugs = [
      ...SERVICES.filter((service) => service.slug !== "pest-control").map((service) => ({
        slug: service.slug,
        section: getServiceSection(service.slug),
      })),
      ...PEST_CONTROL_SUB_SERVICE_PAGES.map((page) => ({ slug: page.id, section: "pest-control" as const })),
    ];

    for (const { slug, section } of serviceSlugs) {
      if (!section || !getCityServiceContent(slug, emirate.slug)) continue;
      for (const locale of locales) {
        const suffix = `/services/${section}/${slug}/${emirate.slug}`;
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
  }

  /**
   * Individual service detail pages (2026-08-06 sitemap gap fix — these
   * are real, fully-content, INDEXABLE pages per buildServiceDetailMetadata
   * once a service clears APPROVED_SERVICE_CONTENT_SLUGS, but were never
   * added to the sitemap loop above, which only ever covered city-combo
   * pages). Pest Control is a static hub at /services/pest-control (no
   * per-slug segment); every other approved service is
   * /services/{section}/{slug}.
   */
  for (const service of SERVICES) {
    if (!APPROVED_SERVICE_CONTENT_SLUGS.includes(service.slug)) continue;
    const section = getServiceSection(service.slug);
    if (!section) continue;
    const suffix =
      service.slug === "pest-control" ? "/services/pest-control" : `/services/${section}/${service.slug}`;
    for (const locale of locales) {
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

  /** Pest-control sub-service hub pages (e.g. /services/pest-control/cockroach-control). */
  for (const page of PEST_CONTROL_SUB_SERVICE_PAGES) {
    const suffix = `/services/pest-control/${page.id}`;
    for (const locale of locales) {
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

  /**
   * Community-level pages (Phase 2, 2026-08-06 — same sitemap gap fix).
   * Same eligibility check the routes themselves use: a real
   * community-content.ts entry for the combo.
   */
  for (const community of COMMUNITIES) {
    const serviceSlugs = [
      ...SERVICES.filter((service) => service.slug !== "pest-control").map((service) => ({
        slug: service.slug,
        section: getServiceSection(service.slug),
      })),
      ...PEST_CONTROL_SUB_SERVICE_PAGES.map((page) => ({ slug: page.id, section: "pest-control" as const })),
    ];

    for (const { slug, section } of serviceSlugs) {
      if (!section || !getCommunityServiceContent(slug, community.slug)) continue;
      const suffix = `/services/${section}/${slug}/community/${community.slug}`;
      for (const locale of locales) {
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
  }

  /** Google Ads landing pages (/lp/{slug}) — always indexable, real unique content. */
  for (const page of LANDING_PAGES) {
    const suffix = `/lp/${page.slug}`;
    for (const locale of locales) {
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

  return entries;
}
