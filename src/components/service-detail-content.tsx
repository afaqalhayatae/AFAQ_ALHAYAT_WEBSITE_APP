import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { BrandPanel } from "./brand-panel";
import { BlogPostCard } from "./blog-post-card";
import { DemoBanner } from "./demo-banner";
import { CheckCircleIcon, ClockIcon, HomeIcon, MapPinIcon, UserIcon, WhatsAppIcon } from "./icons";
import {
  ServiceBenefitsSection,
  ServiceFaqSection,
  ServiceOverviewSection,
  ServicePestTypesSection,
  ServiceProcessSection,
  ServiceSafetySection,
  ServiceScopeSection,
} from "./service-content-sections";
import { getServiceBySlug, getServicesByCategory } from "@/lib/catalog/services";
import { getRelatedServices } from "@/lib/catalog/service-relationships";
import { SERVICE_ICONS, SERVICE_VISUAL_CATEGORY } from "@/lib/catalog/service-visuals";
import { LOCATIONS } from "@/lib/catalog/locations";
import { getServiceCardImage, getServiceContent, getServiceHero } from "@/lib/catalog/service-content";
import { PEST_CONTROL_SUB_SERVICE_PAGES } from "@/lib/catalog/pest-control-pages";
import { getServiceFaqs } from "@/lib/catalog/faq";
import { getPostsForService } from "@/lib/catalog/blog";
import { getServiceSection } from "@/lib/catalog/service-sections";
import { resolveServiceCityPath } from "@/lib/catalog/canonical-service-city";
import { PHONE_E164, WHATSAPP_URL, SITE_URL } from "@/lib/brand/links";
import { buildBreadcrumbSchema, buildServiceSchema } from "@/lib/seo/local-business";

/**
 * Shared service-detail rendering (JOB-AGT-WEB-20260730 structure phase).
 * Extracted verbatim from the pre-restructure src/app/[locale]/services/[slug]/page.tsx
 * so the same detail page can be mounted under three category-scoped
 * routes (services/maintenance/[slug], services/cleaning/[slug],
 * services/pest-control — a static page for the one pest-control slug)
 * without duplicating ~350 lines three times. No content, copy, or
 * section was added or removed in the extraction.
 */

const TRUST_ICONS = [UserIcon, ClockIcon, CheckCircleIcon, MapPinIcon];

export function ServiceDetailContent({ locale, slug }: { locale: Locale; slug: string }) {
  const service = getServiceBySlug(slug);
  if (!service) return null;

  const t = getMessages(locale);
  const entry = getServiceEntry(t, slug);
  const ServiceIcon = SERVICE_ICONS[slug] ?? HomeIcon;
  const dubai = LOCATIONS[0];
  const content = getServiceContent(slug, locale);
  const faqs = getServiceFaqs(slug);
  const hero = getServiceHero(slug);
  const cardImage = getServiceCardImage(slug);
  const subServices = slug === "pest-control" ? PEST_CONTROL_SUB_SERVICE_PAGES : [];
  const section = getServiceSection(slug);

  // Final-version rule (2026-07-30): never cross-link to a service that
  // has no real image yet (e.g. Handyman — no cardImage, no hero) — this
  // used to be hidden only by array order/slice(0,3) coincidence, which
  // breaks the moment SERVICES is reordered or a category gains a 5th
  // complete service. Gate explicitly instead. Checks both cardImage and
  // hero (not just cardImage) because pest-control only has a hero.
  const hasRealImage = (candidateSlug: string) =>
    Boolean(getServiceCardImage(candidateSlug)) || Boolean(getServiceHero(candidateSlug));

  // Prefer SERVICE_RELATIONSHIPS.md's curated, Owner-confirmed edges
  // (service-relationships.ts) over the plain same-category grouping —
  // "AC Maintenance relates to Electrical Maintenance" is a real,
  // confirmed relationship; "AC Maintenance relates to Painting" is just
  // two services sharing a category label. Same-category grouping still
  // fills any remaining slots for services with no confirmed edge yet,
  // so nothing that worked before regresses.
  const curatedRelated = getRelatedServices(service.id).filter((candidate) =>
    hasRealImage(candidate.slug)
  );
  const fallbackRelated = getServicesByCategory(service.category).filter(
    (candidate) =>
      candidate.slug !== slug &&
      !curatedRelated.some((curated) => curated.slug === candidate.slug) &&
      hasRealImage(candidate.slug)
  );
  const related = [...curatedRelated, ...fallbackRelated].slice(0, 3);

  const relatedPosts = getPostsForService(slug, service.category, 3);
  const hasDemoRelatedPosts = relatedPosts.some((post) => post.isDemo);

  // Service + BreadcrumbList JSON-LD (2026-08-07) — mirrors the visible
  // breadcrumb trail below exactly (Services / [section] / [service name]),
  // never a separate/invented hierarchy. Canonical path matches
  // buildServiceDetailMetadata's own pathPrefix convention: the
  // pest-control hub has no per-slug segment, every other section does.
  const canonicalPath =
    section === "pest-control" ? "services/pest-control" : `services/${section}/${slug}`;
  const serviceSchema = buildServiceSchema({
    name: entry.name,
    description: content?.heroTagline ?? entry.description,
    url: `${SITE_URL}/${locale}/${canonicalPath}`,
    areaServed: "AE",
  });
  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: t.services.hero.title, url: `${SITE_URL}/${locale}/services` },
      section
        ? { name: t.services.sections[section].name, url: `${SITE_URL}/${locale}/services/${section}` }
        : null,
      { name: entry.name, url: `${SITE_URL}/${locale}/${canonicalPath}` },
    ].filter((item): item is { name: string; url: string } => item !== null)
  );

  const heroContent = (
    <div>
      <p className="text-small font-semibold uppercase tracking-wide text-(--color-primary)">
        {t.services.categories[service.category]}
      </p>
      <h1 className="mt-space-2 text-h1 font-bold text-(--color-text-primary)">{entry.name}</h1>
      <p className="mt-space-3 max-w-2xl text-lead text-(--color-text-secondary)">
        {content?.heroTagline ?? entry.description}
      </p>
      <div className="mt-space-4 flex flex-wrap gap-space-2">
        <Link
          href={`/${locale}/contact`}
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
      {dubai ? (
        <Link
          href={`/${locale}/${resolveServiceCityPath(slug, dubai.slug)}`}
          className="mt-space-3 inline-flex items-center gap-space-1 text-small font-semibold text-(--color-primary)"
        >
          {t.services.detail.viewInDubai}
        </Link>
      ) : null}
    </div>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="mx-auto max-w-desktop px-space-3 py-space-3 text-small text-(--color-text-secondary)">
        <Link href={`/${locale}/services`} className="hover:text-(--color-primary)">
          {t.services.hero.title}
        </Link>
        {section ? (
          <>
            <span className="mx-space-1">/</span>
            <Link href={`/${locale}/services/${section}`} className="hover:text-(--color-primary)">
              {t.services.sections[section].name}
            </Link>
          </>
        ) : null}
        <span className="mx-space-1">/</span>
        <span>{entry.name}</span>
      </section>

      {hero ? (
        <section className="relative isolate flex min-h-[480px] items-center overflow-hidden tablet:min-h-[560px] desktop:aspect-[21/9] desktop:min-h-0">
          <Image
            src={hero.src}
            alt={hero.alt[locale]}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[80%_center]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent"
          />

          <div className="relative z-10 mx-auto w-full max-w-desktop px-space-3 py-space-7">
            <div className={`mr-auto max-w-xl ${locale === "ar" ? "text-right" : "text-left"}`}>
              <p className="text-small font-semibold uppercase tracking-wide text-white/90">
                {t.services.categories[service.category]}
              </p>
              <h1 className="mt-space-2 text-h1 font-bold text-white">{hero.headline[locale]}</h1>
              <p className="mt-space-3 max-w-2xl text-lead text-white/85">
                {content?.heroTagline ?? entry.description}
              </p>
              <div className="mt-space-4 flex flex-wrap gap-space-2">
                <Link
                  href={`/${locale}/contact`}
                  className="flex h-12 items-center justify-center rounded-xl bg-(--color-primary) px-space-4 text-small font-semibold text-(--color-surface) transition-opacity hover:opacity-90"
                >
                  {t.common.requestService}
                </Link>
                <a
                  href={`tel:${PHONE_E164}`}
                  className="flex items-center gap-space-1 rounded-xl border border-white/60 px-space-4 py-space-2 text-small font-semibold text-white transition-colors hover:border-(--color-surface) hover:text-(--color-surface)"
                >
                  {t.common.callNow}
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-space-1 rounded-xl border border-white/60 px-space-4 py-space-2 text-small font-semibold text-white transition-colors hover:border-(--color-whatsapp) hover:text-(--color-whatsapp)"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  {t.common.whatsappCta}
                </a>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-desktop px-space-3 pb-space-7">
          <div className="grid gap-space-5 desktop:grid-cols-2 desktop:items-center">
            {heroContent}
            {cardImage ? (
              <BrandPanel
                variant="hero"
                category={SERVICE_VISUAL_CATEGORY[slug]}
                icon={<ServiceIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />}
                src={cardImage.src}
                alt={cardImage.alt[locale]}
              />
            ) : (
              <BrandPanel
                variant="hero"
                category={SERVICE_VISUAL_CATEGORY[slug]}
                icon={<ServiceIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />}
              />
            )}
          </div>
        </section>
      )}

      {content ? <ServiceOverviewSection overview={content.overview} /> : null}
      {content?.commonProblems ? (
        <ServiceBenefitsSection title={t.services.detail.commonProblemsTitle} items={content.commonProblems} />
      ) : null}
      {content ? (
        <ServiceScopeSection
          scope={content.scope}
          includedTitle={t.services.detail.includedTitle}
          excludedTitle={t.services.detail.excludedTitle}
        />
      ) : null}
      {content?.process ? (
        <ServiceProcessSection title={t.services.detail.howItWorksTitle} steps={content.process} />
      ) : null}
      {content ? (
        <ServiceBenefitsSection title={t.services.detail.benefitsTitle} items={content.benefits} />
      ) : null}
      {content?.safety ? (
        <ServiceSafetySection title={t.services.detail.safetyTitle} items={content.safety} />
      ) : null}

      <ServicePestTypesSection
        title={t.services.detail.pestTypesTitle}
        items={subServices}
        locale={locale}
        serviceSlug={slug}
      />

      {related.length > 0 ? (
        <section className="mx-auto max-w-desktop px-space-3 py-space-7">
          <h2 className="text-h3 font-bold text-(--color-text-primary)">
            {t.services.detail.relatedTitle}
          </h2>
          <div className="mt-space-4 grid gap-space-3 tablet:grid-cols-3">
            {related.map((relatedService) => {
              const relatedEntry = getServiceEntry(t, relatedService.slug);
              const relatedSection = getServiceSection(relatedService.slug);
              // Pest Control's own hub IS its detail page (no separate
              // "/pest-control/pest-control" nesting) — every other
              // section nests the slug one level under the hub.
              const relatedHref =
                relatedSection === "pest-control"
                  ? `/${locale}/services/pest-control`
                  : relatedSection
                    ? `/${locale}/services/${relatedSection}/${relatedService.slug}`
                    : `/${locale}/services/${relatedService.slug}`;
              return (
                <Link
                  key={relatedService.slug}
                  href={relatedHref}
                  className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-3 transition-colors hover:border-(--color-primary)"
                >
                  <p className="text-h6 font-semibold text-(--color-text-primary)">
                    {relatedEntry.name}
                  </p>
                  <p className="mt-space-1 text-small text-(--color-text-secondary)">
                    {relatedEntry.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {!content?.process ? (
        <section className="bg-(--color-surface-secondary)">
          <div className="mx-auto max-w-desktop px-space-3 py-space-7">
            <h2 className="text-h3 font-bold text-(--color-text-primary)">
              {t.services.detail.howItWorksTitle}
            </h2>
            <div className="mt-space-4 grid gap-space-3 tablet:grid-cols-3">
              {t.home.howItWorks.steps.map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-3">
                  <span className="text-h4 font-bold text-(--color-primary)">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-space-2 text-h6 font-semibold text-(--color-text-primary)">
                    {step.title}
                  </p>
                  <p className="mt-space-1 text-small text-(--color-text-secondary)">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-desktop px-space-3 py-space-7">
        <div className="max-w-2xl">
          <h2 className="text-h3 font-bold text-(--color-text-primary)">{t.home.whyUs.title}</h2>
          <p className="mt-space-2 text-lead text-(--color-text-secondary)">{t.home.whyUs.intro}</p>
        </div>
        <ul className="mt-space-4 grid gap-space-3 tablet:grid-cols-2">
          {t.home.whyUs.points.map((point) => (
            <li key={point} className="flex items-start gap-space-2">
              <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-(--color-primary)" />
              <span className="text-small text-(--color-text-secondary)">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-(--color-surface-secondary)">
        <div className="mx-auto max-w-desktop px-space-3 py-space-7">
          <h2 className="text-h3 font-bold text-(--color-text-primary)">{t.home.trust.title}</h2>
          <div className="mt-space-4 grid gap-space-3 tablet:grid-cols-2 desktop:grid-cols-4">
            {t.home.trust.items.map((item, index) => {
              const TrustIcon = TRUST_ICONS[index] ?? CheckCircleIcon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-3"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-(--color-primary)/10 text-(--color-primary)">
                    <TrustIcon className="h-6 w-6" />
                  </div>
                  <p className="mt-space-2 text-h6 font-semibold text-(--color-text-primary)">
                    {item.title}
                  </p>
                  <p className="mt-space-1 text-small text-(--color-text-secondary)">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ServiceFaqSection title={t.services.detail.faqTitle} items={faqs} locale={locale} />

      {relatedPosts.length > 0 ? (
        <section className="mx-auto max-w-desktop px-space-3 py-space-7">
          {hasDemoRelatedPosts ? <DemoBanner message={t.blog.demoNotice} /> : null}
          <div className="mt-space-3 flex flex-wrap items-end justify-between gap-space-2">
            <div>
              <h2 className="text-h3 font-bold text-(--color-text-primary)">
                {t.home.articles.title}
              </h2>
              <p className="mt-space-1 text-small text-(--color-text-secondary)">
                {t.home.articles.subtitle}
              </p>
            </div>
            <Link
              href={`/${locale}/blog`}
              className="text-small font-semibold text-(--color-primary)"
            >
              {t.home.articles.cta}
            </Link>
          </div>
          <div className="mt-space-4 grid gap-space-4 tablet:grid-cols-2 desktop:grid-cols-3">
            {relatedPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} locale={locale} t={t} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="bg-(--color-primary)">
        <div className="mx-auto flex max-w-desktop flex-col items-start gap-space-3 px-space-3 py-space-7 tablet:flex-row tablet:items-center tablet:justify-between">
          <div>
            <h2 className="text-h3 font-bold text-(--color-surface)">{t.home.cta.title}</h2>
            <p className="mt-space-1 text-(--color-surface)">{t.home.cta.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-space-2">
            <Link
              href={`/${locale}/contact`}
              className="flex items-center gap-space-1 rounded-xl border border-(--color-surface) px-space-3 py-space-2 text-small font-semibold text-(--color-surface) transition-colors hover:bg-white/10"
            >
              {t.home.cta.button}
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
        </div>
      </section>

      <section className="mx-auto max-w-desktop px-space-3 py-space-5">
        <Link
          href={`/${locale}/services`}
          className="text-small font-semibold text-(--color-primary)"
        >
          {t.services.detail.backToServices}
        </Link>
      </section>
    </>
  );
}
