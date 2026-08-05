import { isLocale, type Locale } from "@/i18n/config";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { BrandPanel } from "@/components/brand-panel";
import { ServiceLocationFallback } from "@/components/service-location-fallback";
import { ShieldCheckIcon, WhatsAppIcon } from "@/components/icons";
import {
  ServiceFaqSection,
  ServiceOverviewSection,
  ServiceBenefitsSection,
  ServiceProcessSection,
  ServiceSafetySection,
} from "@/components/service-content-sections";
import type { FaqItem } from "@/lib/catalog/faq";
import {
  PEST_CONTROL_SUB_SERVICE_PAGES,
  ALL_EMIRATES_BILINGUAL,
  SHARED_BENEFITS,
  SHARED_PROCESS,
  SHARED_PREPARATION,
  SHARED_SAFETY,
  getPestControlSubServicePage,
  getRelatedPestControlPages,
} from "@/lib/catalog/pest-control-pages";
import { getLocationBySlug } from "@/lib/catalog/locations";
import { isActive } from "@/lib/catalog/matrix";
import { resolveServiceCityPath } from "@/lib/catalog/canonical-service-city";
import { buildAlternates, INDEXABLE, NOINDEX_FOLLOW } from "@/lib/seo/metadata";
import { WHATSAPP_URL } from "@/lib/brand/links";

/**
 * `subService` also has to absorb the legacy `/services/pest-control/
 * {location}` combo (e.g. `/services/pest-control/dubai`) — the generic
 * `/services/[slug]/[location]` route excludes "pest-control" entirely
 * because this explicit `/services/pest-control/` folder shadows it at
 * the routing level (see that route's own comment). When `subService`
 * isn't a real sub-service id but is a real location slug, this page
 * renders the identical `ServiceLocationFallback` content the generic
 * route used to serve for slug="pest-control" (Canonical URL
 * Architecture Finalization, JOB-AGT-WEB-20260730) — same content, just
 * reachable from a path this route can actually own.
 */

/**
 * Pest-control sub-service pages (JOB-AGT-WEB-20260730, Owner-requested
 * SEO expansion). Nested under /services/pest-control/ rather than made
 * independent top-level catalog services — consistent with
 * src/lib/catalog/services.ts (12 approved catalog services only) and
 * src/lib/catalog/booking-options.ts's existing reconciliation, which
 * already treats pest types as detail on the one real Pest Control
 * service, not separate services.
 *
 * robots is INDEXABLE for real sub-service pages as of 2026-07-31 — the
 * Owner approved this package's content, unlike every other
 * /services/[slug] detail page sitewide which stays NOINDEX_FOLLOW until
 * its own Evidence Gate clears. The legacy location-fallback branch below
 * (a real location slug rather than a sub-service id) is a different,
 * still-ungated feature and keeps NOINDEX_FOLLOW.
 */

export function generateStaticParams() {
  return PEST_CONTROL_SUB_SERVICE_PAGES.map((page) => ({ subService: page.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; subService: string }>;
}): Promise<Metadata> {
  const { locale, subService } = await params;
  if (!isLocale(locale)) return {};
  const typedLocale = locale as Locale;
  const page = getPestControlSubServicePage(subService);

  if (!page) {
    if (!getLocationBySlug(subService) || !isActive("pest-control", subService)) return {};
    const t = getMessages(typedLocale);
    const entry = getServiceEntry(t, "pest-control");
    const locationName = subService === "dubai" ? t.locations.dubai.title : subService;
    return {
      title: `${entry.name} ${t.common.in} ${locationName}`,
      description: entry.description,
      alternates: buildAlternates(typedLocale, resolveServiceCityPath("pest-control", subService)),
      robots: NOINDEX_FOLLOW,
    };
  }

  return {
    title: page.seoTitle[typedLocale],
    description: page.metaDescription[typedLocale],
    keywords: page.keywords[typedLocale],
    alternates: buildAlternates(typedLocale, `services/pest-control/${subService}`),
    robots: INDEXABLE,
  };
}

export default async function PestControlSubServicePage({
  params,
}: {
  params: Promise<{ locale: string; subService: string }>;
}) {
  const { locale, subService } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const t = getMessages(typedLocale);
  const page = getPestControlSubServicePage(subService);

  if (!page) {
    if (!getLocationBySlug(subService) || !isActive("pest-control", subService)) {
      notFound();
    }

    const canonicalPath = resolveServiceCityPath("pest-control", subService);
    if (canonicalPath !== `services/pest-control/${subService}`) {
      permanentRedirect(`/${locale}/${canonicalPath}`);
    }

    const entry = getServiceEntry(t, "pest-control");
    const locationName = subService === "dubai" ? t.locations.dubai.title : subService;

    return (
      <ServiceLocationFallback
        locale={typedLocale}
        t={t}
        categoryLabel={t.services.categories["cleaning-pest-control"]}
        name={entry.name}
        description={entry.description}
        serviceSlug="pest-control"
        locationSlug={subService}
        locationName={locationName}
      />
    );
  }

  const related = getRelatedPestControlPages(page);

  const faqItems: FaqItem[] = page.faqs.map((faq) => ({
    id: faq.id,
    category: "services",
    serviceSlug: subService,
    question: faq.question,
    answer: faq.answer,
    // Owner approved this package's content 2026-07-31 (see
    // DECISION_LOG #38 / SERVICE_COMPLETION_MATRIX.md) — no longer
    // `isDemo`, so these now render normally and enter FAQPage JSON-LD,
    // same as every other approved service's FAQs (see faq.ts).
  }));

  return (
    <>
      <section className="mx-auto max-w-desktop px-space-3 py-space-3 text-small text-(--color-text-secondary)">
        <Link href={`/${typedLocale}/services`} className="hover:text-(--color-primary)">
          {t.services.hero.title}
        </Link>
        <span className="mx-space-1">/</span>
        <Link href={`/${typedLocale}/services/pest-control`} className="hover:text-(--color-primary)">
          {t.services.categories["cleaning-pest-control"]}
        </Link>
        <span className="mx-space-1">/</span>
        <span>{page.name[typedLocale]}</span>
      </section>

      {/* Hero */}
      <section className="mx-auto max-w-desktop px-space-3 pb-space-7">
        <div className="grid gap-space-5 desktop:grid-cols-2 desktop:items-center">
          <div>
            <p className="text-small font-semibold uppercase tracking-wide text-(--color-primary)">
              {t.services.categories["cleaning-pest-control"]}
            </p>
            <h1 className="mt-space-2 text-h1 font-bold text-(--color-text-primary)">
              {page.name[typedLocale]}
            </h1>
            <div className="mt-space-4 flex flex-wrap gap-space-2">
              <Link
                href={`/${typedLocale}/book?service=pest-control`}
                className="rounded-xl bg-(--color-primary) px-space-4 py-space-2 text-small font-semibold text-(--color-surface) transition-opacity hover:opacity-90"
              >
                {t.common.requestService}
              </Link>
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
          </div>

          {page.image && page.imageAlt ? (
            <BrandPanel
              variant="hero"
              category="pest-control"
              icon={<ShieldCheckIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />}
              src={`/brand/images/services/pest-control/${page.image}`}
              alt={page.imageAlt[typedLocale]}
            />
          ) : (
            <BrandPanel
              variant="hero"
              category="pest-control"
              icon={<ShieldCheckIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />}
            />
          )}
        </div>
      </section>

      {/*
       * Restored 2026-07-31 (Service Completion Phase, DECISION_LOG #38):
       * this content was withheld here (Final Production Cleanup Rule)
       * while pest-control-pages.ts's package was still "Draft — pending
       * Evidence Gate". The Owner has since approved that package for
       * publication, so overview/benefits/process/preparation/safety are
       * shown again — same SHARED_* blocks, no new claim added.
       */}
      <ServiceOverviewSection overview={page.overview[typedLocale]} />
      <ServiceBenefitsSection title={t.services.detail.benefitsTitle} items={SHARED_BENEFITS[typedLocale]} />
      <ServiceProcessSection title={t.services.detail.howItWorksTitle} steps={SHARED_PROCESS[typedLocale]} />
      <ServiceBenefitsSection title={t.services.detail.preparationTitle} items={SHARED_PREPARATION[typedLocale]} />
      <ServiceSafetySection title={t.services.detail.safetyTitle} items={[SHARED_SAFETY[typedLocale]]} />

      {/* Coverage */}
      <section className="mx-auto max-w-desktop px-space-3 py-space-6">
        <h2 className="text-h3 font-bold text-(--color-text-primary)">{t.home.areas.title}</h2>
        <div className="mt-space-3 flex flex-wrap gap-space-2">
          {ALL_EMIRATES_BILINGUAL.map((emirate) => (
            <span
              key={emirate.en}
              className="rounded-xl border border-(--color-border) px-space-3 py-space-1 text-small text-(--color-text-secondary)"
            >
              {emirate[typedLocale]}
            </span>
          ))}
        </div>
      </section>

      <ServiceFaqSection title={t.services.detail.faqTitle} items={faqItems} locale={typedLocale} />

      {/* Related pest-control services */}
      {related.length > 0 ? (
        <section className="bg-(--color-surface-secondary)">
          <div className="mx-auto max-w-desktop px-space-3 py-space-6">
            <h2 className="text-h3 font-bold text-(--color-text-primary)">{t.services.detail.relatedTitle}</h2>
            <div className="mt-space-4 grid gap-space-3 tablet:grid-cols-3">
              {related.map((relatedPage) => (
                <Link
                  key={relatedPage.id}
                  href={`/${typedLocale}/services/pest-control/${relatedPage.id}`}
                  className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-3 transition-colors hover:border-(--color-primary)"
                >
                  <p className="text-h6 font-semibold text-(--color-text-primary)">
                    {relatedPage.name[typedLocale]}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Closing conversion band */}
      <section className="bg-(--color-primary)">
        <div className="mx-auto flex max-w-desktop flex-col items-start gap-space-3 px-space-3 py-space-7 tablet:flex-row tablet:items-center tablet:justify-between">
          <div>
            <h2 className="text-h3 font-bold text-(--color-surface)">{t.home.cta.title}</h2>
            <p className="mt-space-1 text-(--color-surface)">{t.home.cta.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-space-2">
            <Link
              href={`/${typedLocale}/book?service=pest-control`}
              className="rounded-xl bg-(--color-surface) px-space-3 py-space-2 text-small font-semibold text-(--color-primary)"
            >
              {t.common.requestService}
            </Link>
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
        </div>
      </section>

      <section className="mx-auto max-w-desktop px-space-3 py-space-5">
        <Link
          href={`/${typedLocale}/services/pest-control`}
          className="text-small font-semibold text-(--color-primary)"
        >
          {t.services.detail.backToServices}
        </Link>
      </section>
    </>
  );
}
