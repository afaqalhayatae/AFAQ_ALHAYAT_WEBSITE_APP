import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getMessages, getServiceEntry, getLocationEntry } from "@/i18n/get-messages";
import { HomeIcon, MapPinIcon, WhatsAppIcon } from "@/components/icons";
import { BrandPanel } from "@/components/brand-panel";
import { SERVICES } from "@/lib/catalog/services";
import { SERVICE_ICONS } from "@/lib/catalog/service-visuals";
import { LOCATIONS, getLocationBySlug, getEmirateBySlug } from "@/lib/catalog/locations";
import { resolveServiceCityPath } from "@/lib/catalog/canonical-service-city";
import { PEST_CONTROL_SUB_SERVICE_PAGES } from "@/lib/catalog/pest-control-pages";
import { getCityServiceContent } from "@/lib/catalog/city-content";
import { getLocationFaqs } from "@/lib/catalog/faq";
import { ServiceFaqSection } from "@/components/service-content-sections";
import { buildAlternates, NOINDEX_FOLLOW } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/local-business";
import { DEMO_VISUAL_ALT, DEMO_VISUAL_SRC, SHOW_DEMO_VISUALS } from "@/lib/media/demo-visuals";
import { getLocationHero } from "@/lib/media/location-heroes";
import { PHONE_E164, WHATSAPP_URL, SITE_URL } from "@/lib/brand/links";

/**
 * Emirate hub page (JOB-AGT-WEB-20260730 emirates-expansion structure
 * phase). Data-driven over `getLocationEntry` (i18n copy) instead of a
 * `slug === "dubai"` special case, so the routing/rendering layer
 * already supports any of the 7 emirates in ALL_EMIRATES — only the
 * *data* (LOCATIONS + locations.entries in i18n) gates which ones
 * actually build. Today that's still Dubai only: no new SEO copy was
 * written for the other 6, per instruction. `dynamicParams = false`
 * plus the explicit `!entry` guard below means an emirate slug with no
 * approved entry 404s instead of ever rendering an incomplete page,
 * even if LOCATIONS is expanded before its i18n copy is ready.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCATIONS.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const location = getLocationBySlug(slug);
  if (!location) return {};

  const t = getMessages(locale as Locale);
  const entry = getLocationEntry(t, slug);
  if (!entry) return {};

  return {
    title: entry.seoTitle,
    description: entry.metaDescription,
    alternates: buildAlternates(locale as Locale, `locations/${slug}`),
    robots: location.indexable ? undefined : NOINDEX_FOLLOW,
  };
}

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const location = getLocationBySlug(slug);
  const typedLocale = locale as Locale;
  const t = getMessages(typedLocale);
  const entry = getLocationEntry(t, slug);
  if (!location || !entry) {
    notFound();
  }

  const emirate = getEmirateBySlug(slug);

  /**
   * Real pest sub-service+city pages for this emirate (2026-08-04,
   * SEO_REALITY_MAP.md §5 Priority 3 — internal linking). The generic
   * SERVICES loop below can never reach these: SERVICES has one flat
   * "pest-control" entry, and resolveServiceCityPath()'s pest-control
   * branch only ever targets the (still-empty) section-level city page,
   * never a specific sub-type — so every one of the 29 real Ant/Cockroach/
   * Termite/Bed-Bug/Rodent Control x city pages was unreachable from this
   * hub page until now. Filtered to real combos only, same rule as every
   * other list on this page (never link to a page that doesn't exist).
   */
  const realPestSubServices = PEST_CONTROL_SUB_SERVICE_PAGES.filter((page) =>
    getCityServiceContent(page.id, slug)
  );

  const locationFaqs = getLocationFaqs(slug);
  const locationHero = getLocationHero(slug);

  // No LocalBusiness schema here (2026-08-04, SEO Production Audit —
  // same fix already applied to the 57 service+city pages last session):
  // an emirate hub page describes coverage, not a verified physical
  // branch — AFAQ Alhayat operates from a single Dubai address, and
  // LOCAL_SEO_MASTER_PLAN.md explicitly prohibits LocalBusiness schema
  // "without an eligible verified location." This page previously
  // emitted it for all 7 emirates, each pointing at the same company-wide
  // map link — the same misrepresentation risk already fixed elsewhere.
  // BreadcrumbList remains — it only describes real page hierarchy.
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: t.locations.index.title, url: `${SITE_URL}/${typedLocale}/locations` },
    { name: entry.title, url: `${SITE_URL}/${typedLocale}/locations/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="mx-auto max-w-desktop px-space-3 py-space-3 text-small text-(--color-text-secondary)">
        <Link href={`/${typedLocale}/locations`} className="hover:text-(--color-primary)">
          {t.locations.index.title}
        </Link>
        <span className="mx-space-1">/</span>
        <span>{entry.title}</span>
      </section>

      <section className="mx-auto max-w-desktop px-space-3 pb-space-7">
        <div className="grid gap-space-5 desktop:grid-cols-2 desktop:items-center">
          <div>
            <h1 className="text-h1 font-bold text-(--color-text-primary)">{entry.title}</h1>
            <p className="mt-space-3 max-w-2xl text-lead text-(--color-text-secondary)">
              {entry.intro}
            </p>
            <div className="mt-space-4 flex flex-wrap gap-space-2">
              <a
                href={`tel:${PHONE_E164}`}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-(--color-primary) px-space-4 text-small font-semibold text-(--color-surface) transition-opacity hover:opacity-90"
              >
                {t.common.callNow}
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-space-1 rounded-xl border border-(--color-border) px-space-4 text-small font-semibold text-(--color-text-primary) transition-colors hover:border-(--color-whatsapp) hover:text-(--color-whatsapp)"
              >
                <WhatsAppIcon className="h-5 w-5" />
                {t.common.whatsappCta}
              </a>
            </div>
          </div>
          {SHOW_DEMO_VISUALS ? (
            <BrandPanel
              variant="hero"
              icon={<MapPinIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />}
              src={DEMO_VISUAL_SRC}
              alt={DEMO_VISUAL_ALT}
            />
          ) : locationHero ? (
            <BrandPanel
              variant="hero"
              icon={<MapPinIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />}
              src={locationHero.src}
              alt={locationHero.alt[typedLocale]}
            />
          ) : (
            <BrandPanel
              variant="hero"
              icon={<MapPinIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />}
            />
          )}
        </div>

        {emirate ? (
          <>
            <h2 className="mt-space-6 text-h3 font-bold text-(--color-text-primary)">
              {t.services.hero.title}
            </h2>
            <div className="mt-space-4 grid gap-space-3 tablet:grid-cols-3">
              {emirate.chatbot.relatedServiceSections.map((section) => (
                <Link
                  key={section}
                  href={`/${typedLocale}/services/${section}`}
                  className="flex items-center gap-space-2 rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-3 transition-colors hover:border-(--color-primary)"
                >
                  <span className="text-small font-semibold text-(--color-text-primary)">
                    {t.services.sections[section].name} — {entry.title}
                  </span>
                </Link>
              ))}
            </div>
          </>
        ) : null}

        <h2 className="mt-space-6 text-h3 font-bold text-(--color-text-primary)">
          {entry.servicesHeading}
        </h2>
        <div className="mt-space-4 grid gap-space-3 tablet:grid-cols-2 desktop:grid-cols-3">
          {SERVICES.map((service) => {
            const serviceEntry = getServiceEntry(t, service.slug);
            const ServiceIcon = SERVICE_ICONS[service.slug] ?? HomeIcon;
            return (
              <Link
                key={service.slug}
                href={`/${typedLocale}/${resolveServiceCityPath(service.slug, slug)}`}
                className="flex items-center gap-space-2 rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-3 transition-colors hover:border-(--color-primary)"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--color-primary)/10 text-(--color-primary)">
                  <ServiceIcon className="h-5 w-5" />
                </span>
                <span className="text-small font-semibold text-(--color-text-primary)">
                  {serviceEntry.name}
                </span>
              </Link>
            );
          })}
        </div>

        {realPestSubServices.length > 0 ? (
          <>
            <h2 className="mt-space-6 text-h3 font-bold text-(--color-text-primary)">
              {t.services.categories["cleaning-pest-control"]} — {entry.title}
            </h2>
            <div className="mt-space-4 grid gap-space-3 tablet:grid-cols-2 desktop:grid-cols-3">
              {realPestSubServices.map((page) => (
                <Link
                  key={page.id}
                  href={`/${typedLocale}/services/pest-control/${page.id}/${slug}`}
                  className="flex items-center gap-space-2 rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-3 transition-colors hover:border-(--color-primary)"
                >
                  <span className="text-small font-semibold text-(--color-text-primary)">
                    {page.name[typedLocale]}
                  </span>
                </Link>
              ))}
            </div>
          </>
        ) : null}
      </section>

      <ServiceFaqSection title={t.faq.title} items={locationFaqs} locale={typedLocale} />
    </>
  );
}
