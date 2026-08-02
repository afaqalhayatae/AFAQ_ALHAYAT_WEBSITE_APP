import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { BrandPanel } from "@/components/brand-panel";
import { ArrowRightIcon, HomeIcon, WhatsAppIcon } from "@/components/icons";
import { SERVICE_CATEGORIES, getServicesByCategory } from "@/lib/catalog/services";
import { CATEGORY_BADGE_COLOR, SERVICE_ICONS, SERVICE_VISUAL_CATEGORY } from "@/lib/catalog/service-visuals";
import { getServiceCardImage } from "@/lib/catalog/service-content";
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
                grid entirely, never shown with a gradient/icon stand-in. */}
            {getServicesByCategory(category)
              .map((service) => ({ service, cardImage: getServiceCardImage(service.slug) }))
              .filter(
                (entry): entry is { service: (typeof entry)["service"]; cardImage: NonNullable<typeof entry.cardImage> } =>
                  Boolean(entry.cardImage)
              )
              .map(({ service, cardImage }) => {
              const entry = getServiceEntry(t, service.slug);
              const ServiceIcon = SERVICE_ICONS[service.slug] ?? HomeIcon;
              return (
                <article
                  key={service.slug}
                  className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)"
                >
                  {/* Header row: colored icon badge + title, above the
                      photo — matches the approved Master Design Reference. */}
                  <Link
                    href={`/${typedLocale}/services/${service.slug}`}
                    className="flex items-center gap-space-2 p-space-3"
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-(--color-surface) ${CATEGORY_BADGE_COLOR[SERVICE_VISUAL_CATEGORY[service.slug]]}`}
                    >
                      <ServiceIcon className="h-6 w-6" />
                    </span>
                    <h3 className="text-h5 font-semibold text-(--color-text-primary)">
                      {entry.name}
                    </h3>
                  </Link>
                  <Link href={`/${typedLocale}/services/${service.slug}`}>
                    <BrandPanel
                      variant="card"
                      category={SERVICE_VISUAL_CATEGORY[service.slug]}
                      icon={null}
                      className="rounded-t-none rounded-b-none"
                      src={cardImage.src}
                      alt={cardImage.alt[typedLocale]}
                    />
                  </Link>
                  <div className="flex flex-col gap-space-1 p-space-4">
                    <p className="text-small font-semibold uppercase tracking-wide text-(--color-primary)">
                      {t.services.categories[category]}
                    </p>
                    <p className="text-small text-(--color-text-secondary)">
                      {entry.description}
                    </p>
                    <div className="mt-space-2 flex flex-wrap items-center gap-space-3">
                      <Link
                        href={`/${typedLocale}/services/${service.slug}`}
                        className="inline-flex items-center gap-space-1 text-small font-semibold text-(--color-primary)"
                      >
                        {t.common.learnMore}
                        <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
                      </Link>
                      <Link
                        href={`/${typedLocale}/contact`}
                        className="text-small font-semibold text-(--color-text-secondary) hover:text-(--color-primary)"
                      >
                        {t.common.requestService}
                      </Link>
                    </div>
                  </div>
                </article>
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
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-space-1 rounded-xl bg-(--color-primary) px-space-3 text-small font-semibold text-(--color-surface) transition-opacity hover:opacity-90"
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
