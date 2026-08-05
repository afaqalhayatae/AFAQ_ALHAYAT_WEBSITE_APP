import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { ServiceCard } from "@/components/ui/service-card";
import { HomeIcon, WhatsAppIcon } from "@/components/icons";
import { SERVICE_CATEGORIES, getServicesByCategory } from "@/lib/catalog/services";
import { CATEGORY_BADGE_COLOR, SERVICE_ICONS, SERVICE_VISUAL_CATEGORY } from "@/lib/catalog/service-visuals";
import { APPROVED_SERVICE_CONTENT_SLUGS, getServiceCardImage } from "@/lib/catalog/service-content";
import { buildAlternates } from "@/lib/seo/metadata";
import { PHONE_E164, WHATSAPP_URL } from "@/lib/brand/links";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getMessages(locale as Locale);
  return {
    title: t.services.hero.title,
    description: t.services.hero.subtitle,
    alternates: buildAlternates(locale as Locale, "services"),
  };
}

export default async function ServicesPage({
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
      <section className="mx-auto max-w-desktop px-space-3 py-space-7">
        <h1 className="text-h1 font-bold text-(--color-text-primary)">
          {t.services.hero.title}
        </h1>
        <p className="mt-space-2 max-w-2xl text-lead text-(--color-text-secondary)">
          {t.services.hero.subtitle}
        </p>
      </section>

      {SERVICE_CATEGORIES.map((category) => (
        <section key={category} className="mx-auto max-w-desktop px-space-3 pb-space-7">
          <h2 className="text-h3 font-bold text-(--color-text-primary)">
            {t.services.categories[category]}
          </h2>
          <div className="mt-space-4 grid gap-space-4 tablet:grid-cols-2 desktop:grid-cols-3">
            {/* Visual Quality Correction Pass: every card on this page
                used to fall through to BrandPanel's no-photo branch
                (category gradient only, no real image ever passed) —
                the same "final version" rule already applied on the
                maintenance/cleaning hub pages now applies here too: a
                service with no real cardImage is excluded from the
                grid entirely, never shown with a gradient/icon stand-in.
                48-Hour Production Mode fix (2026-08-05): a cardImage
                alone isn't enough — several newer services (Interlock,
                Rooftop Space Utilization, etc.) already have a real,
                approved photo but their page content is still Draft
                (see SERVICE_DATABASE.json's own status notes: "NOT
                wired into APPROVED_SERVICE_CONTENT_SLUGS ... pending
                Owner publication decision"). Without this second check
                the card still rendered and linked through to a real but
                content-less detail page (no overview, no FAQ, generic
                fallback title) — confirmed live in production. Gating
                on both closes that customer-facing gap without
                publishing anything that isn't actually approved. */}
            {getServicesByCategory(category)
              .map((service) => ({ service, cardImage: getServiceCardImage(service.slug) }))
              .filter(
                (entry): entry is { service: (typeof entry)["service"]; cardImage: NonNullable<typeof entry.cardImage> } =>
                  Boolean(entry.cardImage) && APPROVED_SERVICE_CONTENT_SLUGS.includes(entry.service.slug)
              )
              .map(({ service, cardImage }) => {
              const entry = getServiceEntry(t, service.slug);
              const ServiceIcon = SERVICE_ICONS[service.slug] ?? HomeIcon;
              return (
                <ServiceCard
                  key={service.slug}
                  href={`/${typedLocale}/services/${service.slug}`}
                  icon={ServiceIcon}
                  badgeColorClass={CATEGORY_BADGE_COLOR[SERVICE_VISUAL_CATEGORY[service.slug]]}
                  imageSrc={cardImage.src}
                  imageAlt={cardImage.alt[typedLocale]}
                  imageCategory={SERVICE_VISUAL_CATEGORY[service.slug]}
                  eyebrow={t.services.categories[category]}
                  title={entry.name}
                  description={entry.description}
                  learnMoreLabel={t.common.learnMore}
                  requestServiceHref={`/${typedLocale}/contact`}
                  requestServiceLabel={t.common.requestService}
                />
              );
            })}
          </div>
        </section>
      ))}

      <section className="bg-(--color-surface-secondary)">
        <div className="mx-auto flex max-w-desktop flex-col items-start gap-space-2 px-space-3 py-space-7 tablet:flex-row tablet:items-center tablet:justify-between">
          <div>
            <h2 className="text-h3 font-bold text-(--color-text-primary)">
              {t.services.cta.title}
            </h2>
            <p className="mt-space-1 text-small text-(--color-text-secondary)">
              {t.services.cta.subtitle}
            </p>
          </div>
          <div className="flex flex-wrap gap-space-2">
            <a
              href={`tel:${PHONE_E164}`}
              className="flex h-12 items-center justify-center rounded-xl bg-(--color-primary) px-space-3 text-small font-semibold text-(--color-surface) transition-opacity hover:opacity-90"
            >
              {t.common.callNow}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-space-1 rounded-xl border border-(--color-border) px-space-3 text-small font-semibold text-(--color-text-primary) transition-colors hover:border-(--color-whatsapp) hover:text-(--color-whatsapp)"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {t.common.whatsappCta}
            </a>
            <Link
              href={`/${typedLocale}/contact`}
              className="flex h-12 items-center justify-center rounded-xl border border-(--color-border) px-space-3 text-small font-semibold text-(--color-text-primary) transition-colors hover:border-(--color-primary) hover:text-(--color-primary)"
            >
              {t.services.cta.button}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
