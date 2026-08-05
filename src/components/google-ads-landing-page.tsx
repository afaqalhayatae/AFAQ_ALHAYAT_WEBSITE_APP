import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { getMessages } from "@/i18n/get-messages";
import type { LandingPageData } from "@/lib/catalog/landing-pages";
import { UnifiedHero } from "./unified-hero";
import { Button } from "./ui/button";
import { BadgeCheckIcon, CheckCircleIcon, ClockIcon, ShieldCheckIcon, WhatsAppIcon } from "./icons";
import { PHONE_E164, WHATSAPP_URL } from "@/lib/brand/links";

type Messages = ReturnType<typeof getMessages>;

const TRUST_BADGE_ICONS = [ShieldCheckIcon, BadgeCheckIcon, ClockIcon, CheckCircleIcon];

/**
 * Reusable Google Ads landing page shell (CRO/GEO build, 2026-08-06).
 * Renders one LandingPageData entry (src/lib/catalog/landing-pages.ts)
 * through the section order a paid-traffic landing page is expected to
 * have: Hero w/ trust badges -> Problem -> Why Us -> Service Details ->
 * Process -> Standard of Work -> Pricing Guidance -> Reviews (honest
 * placeholder, no invented testimonials) -> FAQ (FAQPage schema) -> Final
 * CTA. Built entirely from this codebase's existing design tokens,
 * UnifiedHero, and Button component — not a separate design system, so
 * it still carries the site's header/footer/mobile CTA bar from the
 * shared root layout.
 */
export function GoogleAdsLandingPage({
  locale,
  t,
  data,
}: {
  locale: Locale;
  t: Messages;
  data: LandingPageData;
}) {
  const bookHref = data.serviceSlug
    ? `/${locale}/book?service=${data.serviceSlug}`
    : `/${locale}/book`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question[locale],
      acceptedAnswer: { "@type": "Answer", text: faq.answer[locale] },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <UnifiedHero
        locale={locale}
        image={data.hero.image}
        alt={data.hero.alt[locale]}
        eyebrow={data.hero.eyebrow[locale]}
        title={data.hero.headline[locale]}
        description={data.hero.subheadline[locale]}
        primaryCta={{ label: t.common.requestService, href: bookHref, icon: "none" }}
        secondaryCta={{ label: t.common.callNow, href: `tel:${PHONE_E164}` }}
        tertiaryCta={{ label: t.common.whatsappCta, href: WHATSAPP_URL, icon: "whatsapp", external: true }}
      />

      {/* Trust badges — directly under the hero, first thing after the fold. */}
      <section className="border-b border-(--color-border) bg-(--color-surface-secondary)">
        <div className="mx-auto grid max-w-desktop gap-space-3 px-space-3 py-space-4 tablet:grid-cols-4">
          {data.hero.trustBadges.map((badge, index) => {
            const BadgeIcon = TRUST_BADGE_ICONS[index % TRUST_BADGE_ICONS.length];
            return (
              <div key={badge.en} className="flex items-center gap-space-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-primary)/10 text-(--color-primary)">
                  <BadgeIcon className="h-5 w-5" />
                </span>
                <span className="text-small font-medium text-(--color-text-primary)">{badge[locale]}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Problem / pain point */}
      <section className="mx-auto max-w-desktop px-space-3 py-space-7">
        <div className="max-w-3xl">
          <h2 className="text-h3 font-bold text-(--color-text-primary)">{data.problem.title[locale]}</h2>
          <div className="mt-space-3 flex flex-col gap-space-3">
            {data.problem.body.map((paragraph) => (
              <p key={paragraph.en} className="text-lead text-(--color-text-secondary)">
                {paragraph[locale]}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose AFAQ AL HAYAT */}
      <section className="bg-(--color-surface-secondary)">
        <div className="mx-auto max-w-desktop px-space-3 py-space-7">
          <h2 className="text-h3 font-bold text-(--color-text-primary)">{data.whyUs.title[locale]}</h2>
          <ul className="mt-space-4 grid gap-space-3 tablet:grid-cols-2">
            {data.whyUs.points.map((point) => (
              <li key={point.en} className="flex items-start gap-space-2">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-(--color-primary)" />
                <span className="text-small text-(--color-text-secondary)">{point[locale]}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Service details */}
      <section className="mx-auto max-w-desktop px-space-3 py-space-7">
        <h2 className="text-h3 font-bold text-(--color-text-primary)">{data.serviceDetails.title[locale]}</h2>
        <div className="mt-space-3 flex flex-col gap-space-3">
          {data.serviceDetails.body.map((paragraph) => (
            <p key={paragraph.en} className="max-w-3xl text-small text-(--color-text-secondary)">
              {paragraph[locale]}
            </p>
          ))}
        </div>
        <ul className="mt-space-4 grid gap-space-2 tablet:grid-cols-2">
          {data.serviceDetails.included.map((item) => (
            <li key={item.en} className="flex items-start gap-space-2">
              <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-(--color-primary)" />
              <span className="text-small text-(--color-text-secondary)">{item[locale]}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Process */}
      <section className="bg-(--color-surface-secondary)">
        <div className="mx-auto max-w-desktop px-space-3 py-space-7">
          <h2 className="text-h3 font-bold text-(--color-text-primary)">{data.process.title[locale]}</h2>
          <div className="mt-space-4 grid gap-space-3 tablet:grid-cols-2 desktop:grid-cols-4">
            {data.process.steps.map((step) => (
              <div key={step.title.en} className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-3">
                <p className="text-h6 font-semibold text-(--color-primary)">{step.title[locale]}</p>
                <p className="mt-space-1 text-small text-(--color-text-secondary)">{step.description[locale]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standard of work — real photo, no fabricated before/after claim */}
      <section className="mx-auto max-w-desktop px-space-3 py-space-7">
        <div className="grid gap-space-5 desktop:grid-cols-2 desktop:items-center">
          <div>
            <h2 className="text-h3 font-bold text-(--color-text-primary)">{data.standardOfWork.title[locale]}</h2>
            <p className="mt-space-3 text-lead text-(--color-text-secondary)">
              {data.standardOfWork.description[locale]}
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={data.standardOfWork.image.src}
              alt={data.standardOfWork.image.alt[locale]}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* Pricing guidance — no fixed price, matches the site's existing claim-safety convention */}
      <section className="bg-(--color-surface-secondary)">
        <div className="mx-auto max-w-desktop px-space-3 py-space-7">
          <div className="max-w-2xl">
            <h2 className="text-h3 font-bold text-(--color-text-primary)">{data.pricing.title[locale]}</h2>
            <p className="mt-space-3 text-lead text-(--color-text-secondary)">{data.pricing.body[locale]}</p>
            <Button href={bookHref} variant="primary" className="mt-space-4">
              {t.landingPage.getFreeQuote}
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews — honest placeholder, never invented testimonials */}
      <section className="mx-auto max-w-desktop px-space-3 py-space-7">
        <h2 className="text-h3 font-bold text-(--color-text-primary)">{t.landingPage.reviewsTitle}</h2>
        <div className="mt-space-4 rounded-2xl border border-dashed border-(--color-border) p-space-6 text-center">
          <p className="text-small text-(--color-text-secondary)">{t.landingPage.reviewsPlaceholder}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-(--color-surface-secondary)">
        <div className="mx-auto max-w-desktop px-space-3 py-space-7">
          <h2 className="text-h3 font-bold text-(--color-text-primary)">{t.landingPage.faqTitle}</h2>
          <dl className="mt-space-4 flex flex-col gap-space-3">
            {data.faqs.map((faq) => (
              <div key={faq.id} className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-4">
                <dt className="font-semibold text-(--color-text-primary)">{faq.question[locale]}</dt>
                <dd className="mt-space-1 text-small text-(--color-text-secondary)">{faq.answer[locale]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-(--color-primary)">
        <div className="mx-auto flex max-w-desktop flex-col items-start gap-space-3 px-space-3 py-space-7 tablet:flex-row tablet:items-center tablet:justify-between">
          <div>
            <h2 className="text-h3 font-bold text-(--color-surface)">{data.finalCta.title[locale]}</h2>
            <p className="mt-space-1 text-(--color-surface)">{data.finalCta.subtitle[locale]}</p>
          </div>
          <div className="flex flex-wrap gap-space-2">
            <Button href={bookHref} variant="secondary-inverted">
              {t.common.requestService}
            </Button>
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
    </>
  );
}
