import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import { WhatsAppIcon } from "./icons";
import type { CityContentBlock } from "@/lib/catalog/city-content";
import { buildBreadcrumbSchema, buildLocalBusinessSchema } from "@/lib/seo/local-business";
import { PHONE_E164, SITE_URL, WHATSAPP_URL } from "@/lib/brand/links";

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
  relatedTitle,
  relatedLinks,
  canonicalPath,
}: {
  locale: Locale;
  breadcrumbs: CityPageBreadcrumb[];
  content: CityContentBlock;
  cityName: string;
  contactHref: string;
  relatedTitle: string;
  relatedLinks: CityPageRelatedLink[];
  /** This page's own path (locale-agnostic, leading-slash-free), for the
   *  final BreadcrumbList entry — e.g. "services/maintenance/ac-maintenance/dubai". */
  canonicalPath: string;
}) {
  const t = getMessages(locale);
  const schema = buildLocalBusinessSchema({ name: content.title[locale], areaServed: cityName });
  // BreadcrumbList mirrors the visible trail below exactly (2026-08-07) —
  // absolute URLs required by schema.org, breadcrumbs' own hrefs are
  // relative like every other internal link in this codebase.
  const breadcrumbSchema = buildBreadcrumbSchema([
    ...breadcrumbs.map((crumb) => ({ name: crumb.label, url: `${SITE_URL}${crumb.href}` })),
    { name: cityName, url: `${SITE_URL}/${locale}/${canonicalPath}` },
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
        <span>{cityName}</span>
      </section>

      <section className="mx-auto max-w-desktop px-space-3 pb-space-7">
        <h1 className="text-h1 font-bold text-(--color-text-primary)">{content.h1[locale]}</h1>
        <p className="mt-space-3 max-w-2xl text-lead text-(--color-text-secondary)">
          {content.intro[locale]}
        </p>
        <CityPageCta t={t} contactHref={contactHref} variant="light" />
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
