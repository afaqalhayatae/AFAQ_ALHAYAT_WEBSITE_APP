import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getMessages } from "@/i18n/get-messages";
import { BrandPanel } from "@/components/brand-panel";
import { CheckCircleIcon, SparkleIcon, WhatsAppIcon } from "@/components/icons";
import { ReviewsSection } from "@/components/reviews-section";
import { SERVICE_CATEGORIES } from "@/lib/catalog/services";
import { VERIFIED_REVIEWS } from "@/lib/catalog/reviews";
import { buildAlternates } from "@/lib/seo/metadata";
import { WHATSAPP_URL } from "@/lib/brand/links";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getMessages(locale as Locale);
  return {
    title: t.about.hero.title,
    description: t.about.hero.subtitle,
    alternates: buildAlternates(locale as Locale, "about"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const t = getMessages(typedLocale);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-desktop px-space-3 py-space-7 tablet:py-space-8">
        <div className="grid gap-space-5 desktop:grid-cols-2 desktop:items-center">
          <div>
            <p className="text-small font-semibold uppercase tracking-wide text-(--color-primary)">
              {t.about.hero.eyebrow}
            </p>
            <h1 className="mt-space-2 text-h1 font-bold text-(--color-text-primary)">
              {t.about.hero.title}
            </h1>
            <p className="mt-space-3 max-w-2xl text-lead text-(--color-text-secondary)">
              {t.about.hero.subtitle}
            </p>
          </div>
          <BrandPanel
            variant="hero"
            icon={<SparkleIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />}
          />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-(--color-surface-secondary)">
        <div className="mx-auto grid max-w-desktop gap-space-4 px-space-3 py-space-7 tablet:grid-cols-2">
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-4">
            <h2 className="text-h4 font-bold text-(--color-text-primary)">
              {t.about.mission.title}
            </h2>
            <p className="mt-space-2 text-small text-(--color-text-secondary)">
              {t.about.mission.body}
            </p>
          </div>
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-4">
            <h2 className="text-h4 font-bold text-(--color-text-primary)">
              {t.about.vision.title}
            </h2>
            <p className="mt-space-2 text-small text-(--color-text-secondary)">
              {t.about.vision.body}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-desktop px-space-3 py-space-7">
        <h2 className="text-h3 font-bold text-(--color-text-primary)">{t.about.values.title}</h2>
        <ul className="mt-space-4 grid gap-space-3 tablet:grid-cols-2 desktop:grid-cols-3">
          {t.about.values.items.map((value) => (
            <li
              key={value.title}
              className="flex items-start gap-space-2 rounded-2xl border border-(--color-border) p-space-3"
            >
              <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-(--color-primary)" />
              <div>
                <p className="font-semibold text-(--color-text-primary)">{value.title}</p>
                <p className="mt-space-1 text-small text-(--color-text-secondary)">
                  {value.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* What we do */}
      <section className="bg-(--color-surface-secondary)">
        <div className="mx-auto max-w-desktop px-space-3 py-space-7">
          <div className="flex flex-wrap items-end justify-between gap-space-2">
            <div>
              <h2 className="text-h3 font-bold text-(--color-text-primary)">
                {t.about.whatWeDo.title}
              </h2>
              <p className="mt-space-1 text-small text-(--color-text-secondary)">
                {t.about.whatWeDo.subtitle}
              </p>
            </div>
            <Link
              href={`/${typedLocale}/services`}
              className="text-small font-semibold text-(--color-primary)"
            >
              {t.about.whatWeDo.cta}
            </Link>
          </div>
          <div className="mt-space-4 grid gap-space-3 tablet:grid-cols-3">
            {SERVICE_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/${typedLocale}/services`}
                className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-4 text-center font-semibold text-(--color-text-primary) transition-colors hover:border-(--color-primary)"
              >
                {t.services.categories[category]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Verified customer reviews — renders only once real, verified
          Google Business Profile reviews exist (see reviews.ts) */}
      <ReviewsSection title={t.about.reviews.title} reviews={VERIFIED_REVIEWS} t={t} />

      {/* Contact CTA */}
      <section className="bg-(--color-primary)">
        <div className="mx-auto flex max-w-desktop flex-col items-start gap-space-3 px-space-3 py-space-7 tablet:flex-row tablet:items-center tablet:justify-between">
          <div>
            <h2 className="text-h3 font-bold text-(--color-surface)">{t.about.cta.title}</h2>
            <p className="mt-space-1 text-(--color-surface)">{t.about.cta.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-space-2">
            <Link
              href={`/${typedLocale}/contact`}
              className="rounded-xl bg-(--color-surface) px-space-3 py-space-2 text-small font-semibold text-(--color-primary)"
            >
              {t.about.cta.button}
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
    </>
  );
}
