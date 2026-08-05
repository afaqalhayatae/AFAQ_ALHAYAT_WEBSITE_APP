import type { Locale } from "@/i18n/config";
import serviceDatabase from "@/data/SERVICE_DATABASE.json";

/**
 * Expanded service-detail content framework (JOB-AGT-WEB-20260726-M4.2,
 * wired to src/data/SERVICE_DATABASE.json).
 *
 * SERVICE_DATABASE.json is generated from the canonical knowledge-base
 * markdown (see its own `source`/`sourceDocs` fields) — every service in
 * `04_SERVICE_KNOWLEDGE/` except Pest Control has `content: null` there,
 * because its `CONTENT_EN.md`/`CONTENT_AR.md` is still a content-gate stub
 * marked "Pending Owner Input." Populating a service here is the entire
 * publishing step once that gate clears — add its `content` block to the
 * JSON and it appears automatically via `getServiceContent()`. No code
 * change needed then.
 */

export type ServiceContentBlock = {
  overview: string;
  /**
   * Optional — added 2026-07-31 (Maintenance Phase refinement, per Owner
   * request for distinct "Hero content"). A short, punchy line shown in
   * the page hero instead of the generic 2-field i18n `entry.description`
   * every service falls back to; deliberately different from `overview`
   * (which is the fuller descriptive paragraph shown further down the
   * page) rather than a duplicate of it.
   */
  heroTagline?: string;
  /** Optional — added for the Service Completion Phase (2026-07-31); pest-control's earlier package predates this field. */
  commonProblems?: string[];
  scope: { included: string[]; excluded: string[] };
  /** Optional — added for the Service Completion Phase (2026-07-31); pest-control uses its own SHARED_PROCESS in pest-control-pages.ts instead. */
  process?: string[];
  benefits: string[];
  /** Optional — added for the Service Completion Phase (2026-07-31); pest-control uses its own SHARED_SAFETY in pest-control-pages.ts instead. */
  safety?: string[];
};

type ServiceDatabaseEntry = (typeof serviceDatabase)["services"][number];

const SERVICE_CONTENT: Partial<Record<string, Record<Locale, ServiceContentBlock>>> = Object.fromEntries(
  (serviceDatabase.services as ServiceDatabaseEntry[])
    .filter((service) => service.content !== null)
    .map((service) => [service.slug, service.content as Record<Locale, ServiceContentBlock>]),
);

/**
 * Publication gate (Final Production Cleanup Rule) — same pattern as
 * `APPROVED_FAQS` / `VERIFIED_REVIEWS` / `BLOG_POSTS`: a service having a
 * `content` block in SERVICE_DATABASE.json is not the same as that copy
 * being Owner-approved. A slug only appears here once its copy is
 * actually signed off; adding one is the entire publishing step, no
 * other code change is needed. Also gates per-service FAQ visibility
 * (see faq.ts) — content and FAQ approval happen together as one Owner
 * decision per service.
 *
 * pest-control: Owner approved 2026-07-31 (see SERVICE_COMPLETION_MATRIX.md
 * — "Pest approval" decision). The other 15 services below were approved
 * the same day under the Service Completion Phase order — general
 * operational-knowledge content only (overview, common problems, scope,
 * process, benefits, safety, FAQ), explicitly excluding any invented
 * price, warranty, license, certification, or response-time claim (see
 * each service's `status.seo`/`status.pageContent` note in
 * SERVICE_DATABASE.json and DECISION_LOG #38).
 */
export const APPROVED_SERVICE_CONTENT_SLUGS: string[] = [
  "pest-control",
  "ac-maintenance",
  "plumbing",
  "electrical-maintenance",
  "painting",
  "handyman",
  "drain-unblocking",
  "waterproofing",
  "water-leak-detection",
  "general-cleaning",
  "deep-cleaning",
  "water-tank-cleaning",
  "villa-cleaning",
  "office-cleaning",
  "post-construction-cleaning",
  "carpet-upholstery-cleaning",
];

export function getServiceContent(slug: string, locale: Locale): ServiceContentBlock | undefined {
  if (!APPROVED_SERVICE_CONTENT_SLUGS.includes(slug)) return undefined;
  return SERVICE_CONTENT[slug]?.[locale];
}

/**
 * Approved hero image for a service's detail page, if one exists in
 * SERVICE_DATABASE.json (`heroSection`). Returns a ready-to-use `src`
 * (web path under /brand/images/) alongside the JSON's bilingual
 * title/alt — no service currently has this except pest-control.
 */
export type ServiceHero = {
  src: string;
  width: number;
  height: number;
  title: { en: string; ar: string };
  headline: { en: string; ar: string };
  alt: { en: string; ar: string };
};

const SERVICE_HERO: Partial<Record<string, ServiceHero>> = Object.fromEntries(
  (serviceDatabase.services as ServiceDatabaseEntry[])
    .filter((service) => "heroSection" in service && service.heroSection)
    .map((service) => {
      const hero = service.heroSection as {
        fileName: string;
        dimensions: string;
        title: { en: string; ar: string };
        headline: { en: string; ar: string };
        alt: { en: string; ar: string };
      };
      const [width, height] = hero.dimensions.split("x").map(Number);
      return [
        service.slug,
        {
          src: `/brand/images/services/pest-control/${hero.fileName}`,
          width,
          height,
          title: hero.title,
          headline: hero.headline,
          alt: hero.alt,
        },
      ];
    }),
);

export function getServiceHero(slug: string): ServiceHero | undefined {
  return SERVICE_HERO[slug];
}

/**
 * Real, distinct SEO title/meta description/keywords for a service's own
 * hub page (as opposed to the generic 2-field i18n `name`/`description`
 * every service falls back to). Only populated in SERVICE_DATABASE.json
 * once a service's SEO package is Owner-approved — currently pest-control
 * only (01_PEST_CONTROL/02_SEO_DATA.md).
 */
export type ServiceSeoData = {
  seoTitle: { en: string; ar: string };
  metaDescription: { en: string; ar: string };
  keywords: { en: string[]; ar: string[] };
};

const SERVICE_SEO_DATA: Partial<Record<string, ServiceSeoData>> = Object.fromEntries(
  (serviceDatabase.services as ServiceDatabaseEntry[])
    .filter(
      (service) =>
        APPROVED_SERVICE_CONTENT_SLUGS.includes(service.slug) &&
        "seoTitle" in service &&
        service.seoTitle,
    )
    .map((service) => [
      service.slug,
      {
        seoTitle: (service as unknown as { seoTitle: ServiceSeoData["seoTitle"] }).seoTitle,
        metaDescription: (service as unknown as { metaDescription: { en: string; ar: string } })
          .metaDescription,
        keywords: (service as unknown as { keywords: ServiceSeoData["keywords"] }).keywords,
      },
    ]),
);

export function getServiceSeoData(slug: string): ServiceSeoData | undefined {
  return SERVICE_SEO_DATA[slug];
}

/**
 * Real card-style image for a service's split hero card (the existing
 * BrandPanel aspect-[4/3] slot used by every non-pest-control service),
 * if one exists in SERVICE_DATABASE.json (`cardImage`). Organized by
 * category under public/brand/images/services/<folder>/ (2026-07-30
 * reorganization: maintenance/, cleaning/, pest-control/).
 */
export type ServiceCardImage = {
  src: string;
  alt: { en: string; ar: string };
};

const SERVICE_CARD_IMAGE: Partial<Record<string, ServiceCardImage>> = Object.fromEntries(
  (serviceDatabase.services as ServiceDatabaseEntry[])
    .filter((service) => "cardImage" in service && service.cardImage)
    .map((service) => {
      const card = service.cardImage as { fileName: string; folder: string; alt: { en: string; ar: string } };
      return [service.slug, { src: `/brand/images/services/${card.folder}/${card.fileName}`, alt: card.alt }];
    }),
);

export function getServiceCardImage(slug: string): ServiceCardImage | undefined {
  return SERVICE_CARD_IMAGE[slug];
}

/**
 * Pest-type sub-service cards used to live here, sourced from
 * SERVICE_DATABASE.json's `subServices`. As of 2026-07-30 each pest type
 * has its own full dedicated page, so the card grid and detail pages both
 * read from the richer src/lib/catalog/pest-control-pages.ts instead —
 * see ServicePestTypesSection's caller in services/[slug]/page.tsx.
 * SERVICE_DATABASE.json's `subServices` array is kept as-is (referenced
 * by docs/PEST_CONTROL_SEO_CONTENT.md and the asset manifest) but is no
 * longer read by any code path.
 */
