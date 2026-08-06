import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import { WhatsAppIcon, MapPinIcon, PhoneIcon } from "./icons";
import { BrandPanel } from "./brand-panel";
import { ServiceFaqSection } from "./service-content-sections";
import type { CityContentBlock } from "@/lib/catalog/city-content";
import { getServiceCardImage } from "@/lib/catalog/service-content";
import { buildBreadcrumbSchema, buildServiceSchema } from "@/lib/seo/local-business";
import { SITE_URL, PHONE_E164, PHONE_DISPLAY, WHATSAPP_URL } from "@/lib/brand/links";

/**
 * Shared render pipeline for every page in the city-SEO system (2026-07-30
 * strategic instruction): a section or a specific service crossed with an
 * emirate, each meant to target local search. CITY_SERVICE_CONTENT
 * (src/lib/catalog/city-content.ts) now holds 57 real entries; a route
 * only renders this component for a combo that has real, unique,
 * Owner-approved copy — generateStaticParams() + dynamicParams = false
 * still guarantee that. Whether a rendered page is *indexable* is a
 * separate question, decided in city-page-metadata.ts via
 * isCityPagePublishReady() — this component itself needs no change either
 * way, unchanged since 2026-07-30.
 *
 * Every input is pre-resolved by the calling route rather than looked up
 * here, so this component stays agnostic to which underlying catalog a
 * service/city pair came from (Maintenance/Cleaning's services.ts slugs
 * vs. pest-control's separate sub-service id space).
 */

type Messages = ReturnType<typeof getMessages>;

/**
 * Section-level fallback photos (Visual Production Pass, 2026-08-05) for
 * the section-level city hubs (services/maintenance/city/[city] etc.) —
 * these cover every service in a section at once, so there's no single
 * serviceSlug to fall back to via getServiceCardImage. Real, already-
 * approved 21:9 branded hero photos that existed in the asset library
 * unwired — same visual-defect review as Handyman's card image (checked
 * for the garbled-uniform-text defect that got Waterproofing's candidate
 * rejected; none found). No maintenance-section equivalent exists yet —
 * that category correctly stays illustration-only until one is produced.
 */
const SECTION_HERO_IMAGES: Partial<
  Record<"maintenance" | "cleaning" | "pest-control", { src: string; alt: { en: string; ar: string } }>
> = {
  cleaning: {
    src: "/brand/images/services/cleaning/cleaning-services-hero-banner-afaq-branded-21x9-v1.webp",
    alt: {
      en: "AFAQ AL HAYAT cleaning team servicing a luxury villa living room in the UAE",
      ar: "فريق تنظيف آفاق الحياة يقوم بتنظيف صالة فيلا فاخرة في الإمارات",
    },
  },
  "pest-control": {
    src: "/brand/images/services/pest-control/pest-control-hero-banner-afaq-branded-21x9-v2.webp",
    alt: {
      en: "AFAQ AL HAYAT pest control technician treating the garden of a luxury UAE villa",
      ar: "فني مكافحة حشرات من آفاق الحياة يعالج حديقة فيلا فاخرة في الإمارات",
    },
  },
};

export type CityPageBreadcrumb = { label: string; href: string };
export type CityPageRelatedLink = { name: string; href: string };

function CityPageCta({
  t,
  contactHref,
  variant,
}: {
  t: Messages;
  contactHref: string;
  variant: "light" | "onPrimary";
}) {
  if (variant === "onPrimary") {
    return (
      <div className="flex flex-wrap gap-space-2">
        <Link
          href={contactHref}
          className="rounded-xl bg-(--color-surface) px-space-3 py-space-2 text-small font-semibold text-(--color-primary)"
        >
          {t.common.requestService}
        </Link>
        <a
          href={`tel:${PHONE_E164}`}
          className="flex items-center gap-space-1 rounded-xl border border-(--color-surface) px-space-3 py-space-2 text-small font-semibold text-(--color-surface) transition-colors hover:bg-white/10"
        >
          {t.common.callNow}
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-space-1 rounded-xl border border-(--color-surface) px-space-3 py-space-2 text-small font-semibold text-(--color-surface) transition-colors hover:bg-white/10"
        >
          <WhatsAppIcon className="h-5 w-5" />
          {t.common.whatsappCta}
        </a>
      </div>
    );
  }

  return (
    <div className="mt-space-4 flex flex-wrap gap-space-2">
      <Link
        href={contactHref}
        className="rounded-xl bg-(--color-primary) px-space-4 py-space-2 text-small font-semibold text-(--color-surface) transition-opacity hover:opacity-90"
      >
        {t.common.requestService}
      </Link>
      <a
        href={`tel:${PHONE_E164}`}
        className="rounded-xl border border-(--color-border) px-space-4 py-space-2 text-small font-semibold text-(--color-text-primary) transition-colors hover:border-(--color-primary) hover:text-(--color-primary)"
      >
        {t.common.callNow}
      </a>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-space-1 rounded-xl border border-(--color-border) px-space-4 py-space-2 text-small font-semibold text-(--color-text-primary) transition-colors hover:border-(--color-whatsapp) hover:text-(--color-whatsapp)"
      >
        <WhatsAppIcon className="h-5 w-5" />
        {t.common.whatsappCta}
      </a>
    </div>
  );
}

export function CityPageContent({
  locale,
  breadcrumbs,
  content,
  cityName,
  contactHref,
  locationHref,
  category,
  serviceSlug,
  relatedTitle,
  relatedLinks,
  faqTitle,
  canonicalPath,
}: {
  locale: Locale;
  breadcrumbs: CityPageBreadcrumb[];
  content: CityContentBlock;
  cityName: string;
  contactHref: string;
  /** The emirate hub page this page belongs to, e.g. "/en/locations/dubai" —
   *  SEO_CONTENT_QUALITY_AUDIT.md §3, closes the loop the emirate hub's own
   *  links (locations/[slug]/page.tsx) opened in Phase 1. */
  locationHref: string;
  /** Selects BrandPanel's gradient/illustration when content.image is unset. */
  category?: "maintenance" | "cleaning" | "pest-control";
  /**
   * The single service this combo page is for (e.g. "ac-maintenance"),
   * when there is one — the section-level city hubs (services/maintenance/
   * city/[city] etc.) cover many services at once and have none. Used only
   * as a fallback photo source (Visual Production Pass, 2026-08-05):
   * city-content.ts has zero per-city images across all 57 entries, so
   * every one of these pages fell back to a generic category illustration
   * even though a real, already-approved photo for the same service
   * already exists (SERVICE_DATABASE.json's cardImage, the same one the
   * service's own detail page and listing-grid card already use). Reusing
   * it here is zero new assets and zero new facts — just closing a gap
   * where already-approved photography wasn't being reused.
   */
  serviceSlug?: string;
  relatedTitle: string;
  relatedLinks: CityPageRelatedLink[];
  /** Only rendered when content.faqs has real entries — see CityContentBlock's own comment. */
  faqTitle: string;
  /** This page's own path (locale-agnostic, leading-slash-free), for the
   *  final BreadcrumbList entry — e.g. "services/maintenance/ac-maintenance/dubai". */
  canonicalPath: string;
}) {
  const t = getMessages(locale);
  const fallbackCardImage = serviceSlug ? getServiceCardImage(serviceSlug) : undefined;
  const sectionHeroImage = category ? SECTION_HERO_IMAGES[category] : undefined;
  // Service, not LocalBusiness — SEO_CONTENT_QUALITY_AUDIT.md §6: none of
  // these pages represents a verified physical location per
  // LOCAL_SEO_MASTER_PLAN.md, so LocalBusiness schema (which every one of
  // these pages emitted until 2026-08-04, all sharing one company-wide
  // map link) misrepresented 57 different emirate pages as 57 verified
  // branches. Service + areaServed is the correct type this repository's
  // own governance already specified.
  const schema = buildServiceSchema({
    name: content.title[locale],
    description: content.metaDescription[locale],
    url: `${SITE_URL}/${locale}/${canonicalPath}`,
    areaServed: cityName,
  });
  // BreadcrumbList mirrors the visible trail below exactly (2026-08-07) —
  // absolute URLs required by schema.org, breadcrumbs' own hrefs are
  // relative like every other internal link in this codebase. The final
  // entry now points at the emirate hub (locationHref), matching the
  // visible link added below (2026-08-04).
  const breadcrumbSchema = buildBreadcrumbSchema([
    ...breadcrumbs.map((crumb) => ({ name: crumb.label, url: `${SITE_URL}${crumb.href}` })),
    { name: cityName, url: `${SITE_URL}${locationHref}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="mx-auto max-w-desktop px-space-3 py-space-3 text-small text-(--color-text-secondary)">
        {breadcrumbs.map((crumb) => (
          <span key={crumb.href}>
            <Link href={crumb.href} className="hover:text-(--color-primary)">
              {crumb.label}
            </Link>
            <span className="mx-space-1">/</span>
          </span>
        ))}
        <Link href={locationHref} className="hover:text-(--color-primary)">
          {cityName}
        </Link>
      </section>

      <section className="mx-auto max-w-desktop px-space-3 pb-space-7">
        <div className="grid gap-space-5 desktop:grid-cols-2 desktop:items-center">
          <div>
            <h1 className="text-h1 font-bold text-(--color-text-primary)">{content.h1[locale]}</h1>
            {/* Visible phone number directly under the H1 (Owner request,
                2026-08-06) — the "Call Now" button below still exists, but
                a customer scanning the page should see the real number
                immediately, not just a button, especially on a page whose
                whole purpose is converting a local search into a call. */}
            <a
              href={`tel:${PHONE_E164}`}
              dir="ltr"
              className="mt-space-2 inline-flex items-center gap-space-1 text-h6 font-bold text-(--color-primary) transition-opacity hover:opacity-80"
            >
              <PhoneIcon className="h-5 w-5 shrink-0" />
              {PHONE_DISPLAY}
            </a>
            <p className="mt-space-3 max-w-2xl text-lead text-(--color-text-secondary)">
              {content.intro[locale]}
            </p>
            <CityPageCta t={t} contactHref={contactHref} variant="light" />
          </div>
          {content.image && content.imageAlt ? (
            <BrandPanel
              variant="hero"
              category={category}
              icon={<MapPinIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />}
              src={`/brand/images/services/${content.image}`}
              alt={content.imageAlt[locale]}
            />
          ) : fallbackCardImage ? (
            <BrandPanel
              variant="hero"
              category={category}
              icon={<MapPinIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />}
              src={fallbackCardImage.src}
              alt={fallbackCardImage.alt[locale]}
            />
          ) : sectionHeroImage ? (
            <BrandPanel
              variant="hero"
              category={category}
              icon={<MapPinIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />}
              src={sectionHeroImage.src}
              alt={sectionHeroImage.alt[locale]}
            />
          ) : (
            <BrandPanel
              variant="hero"
              category={category}
              icon={<MapPinIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />}
            />
          )}
        </div>
      </section>

      {content.body.length > 0 ? (
        <section className="mx-auto max-w-desktop px-space-3 pb-space-7">
          {content.body.map((paragraph, index) => (
            <p
              key={index}
              className="mt-space-3 max-w-2xl text-small text-(--color-text-secondary)"
            >
              {paragraph[locale]}
            </p>
          ))}
        </section>
      ) : null}

      {relatedLinks.length > 0 ? (
        <section className="bg-(--color-surface-secondary)">
          <div className="mx-auto max-w-desktop px-space-3 py-space-6">
            <h2 className="text-h3 font-bold text-(--color-text-primary)">{relatedTitle}</h2>
            <div className="mt-space-4 grid gap-space-3 tablet:grid-cols-3">
              {relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-3 transition-colors hover:border-(--color-primary)"
                >
                  <p className="text-h6 font-semibold text-(--color-text-primary)">{link.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {content.faqs && content.faqs.length > 0 ? (
        <ServiceFaqSection title={faqTitle} items={content.faqs} locale={locale} />
      ) : null}

      <section className="bg-(--color-primary)">
        <div className="mx-auto flex max-w-desktop flex-col items-start gap-space-3 px-space-3 py-space-7 tablet:flex-row tablet:items-center tablet:justify-between">
          <div>
            <h2 className="text-h3 font-bold text-(--color-surface)">{t.home.cta.title}</h2>
            <p className="mt-space-1 text-(--color-surface)">{t.home.cta.subtitle}</p>
          </div>
          <CityPageCta t={t} contactHref={contactHref} variant="onPrimary" />
        </div>
      </section>
    </>
  );
}
