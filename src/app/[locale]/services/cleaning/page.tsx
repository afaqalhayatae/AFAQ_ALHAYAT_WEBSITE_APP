import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { BrandPanel } from "@/components/brand-panel";
import { ArrowRightIcon } from "@/components/icons";
import { getServicesBySection } from "@/lib/catalog/service-sections";
import { CATEGORY_BADGE_COLOR, SERVICE_ICONS, SERVICE_VISUAL_CATEGORY } from "@/lib/catalog/service-visuals";
import { getServiceCardImage, type ServiceCardImage } from "@/lib/catalog/service-content";
import { buildAlternates, NOINDEX_FOLLOW } from "@/lib/seo/metadata";

/**
 * Cleaning section hub (JOB-AGT-WEB-20260730 structure phase). Same
 * pattern as services/maintenance/page.tsx — see that file's comment.
 *
 * Final-version rule (2026-07-30): a service card is never shown without
 * a real, linked image — no icon/placeholder stand-in. All 3 cleaning
 * services currently have a cardImage, but this filter is kept so the
 * grid stays safe if that ever changes.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getMessages(locale as Locale);
  return {
    title: t.services.sections.cleaning.name,
    description: t.services.sections.cleaning.description,
    alternates: buildAlternates(locale as Locale, "services/cleaning"),
    robots: NOINDEX_FOLLOW,
  };
}

export default async function CleaningSectionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const t = getMessages(typedLocale);
  const servicesWithImage = getServicesBySection("cleaning")
    .map((service) => ({ service, cardImage: getServiceCardImage(service.slug) }))
    .filter(
      (entry): entry is { service: (typeof entry)["service"]; cardImage: ServiceCardImage } =>
        Boolean(entry.cardImage)
    );

  return (
    <>
      <section className="mx-auto max-w-desktop px-space-3 py-space-3 text-small text-(--color-text-secondary)">
        <Link href={`/${typedLocale}/services`} className="hover:text-(--color-primary)">
          {t.services.hero.title}
        </Link>
        <span className="mx-space-1">/</span>
        <span>{t.services.sections.cleaning.name}</span>
      </section>

      <section className="mx-auto max-w-desktop px-space-3 pb-space-7">
        <h1 className="text-h1 font-bold text-(--color-text-primary)">
          {t.services.sections.cleaning.name}
        </h1>
        <p className="mt-space-2 max-w-2xl text-lead text-(--color-text-secondary)">
          {t.services.sections.cleaning.description}
        </p>
      </section>

      <section className="mx-auto max-w-desktop px-space-3 pb-space-7">
        <div className="grid gap-space-4 tablet:grid-cols-2 desktop:grid-cols-3">
          {servicesWithImage.map(({ service, cardImage }) => {
            const entry = getServiceEntry(t, service.slug);
            const href = `/${typedLocale}/services/cleaning/${service.slug}`;
            const ServiceIcon = SERVICE_ICONS[service.slug];
            return (
              <article
                key={service.slug}
                className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)"
              >
                <Link href={href} className="flex items-center gap-space-2 p-space-3">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-(--color-surface) ${CATEGORY_BADGE_COLOR[SERVICE_VISUAL_CATEGORY[service.slug]]}`}
                  >
                    <ServiceIcon className="h-6 w-6" />
                  </span>
                  <h2 className="text-h6 font-semibold text-(--color-text-primary)">
                    {entry.name}
                  </h2>
                </Link>
                <Link href={href}>
                  <BrandPanel
                    variant="card"
                    category={SERVICE_VISUAL_CATEGORY[service.slug]}
                    icon={null}
                    className="rounded-t-none rounded-b-none"
                    src={cardImage.src}
                    alt={cardImage.alt[typedLocale]}
                    sizes="(min-width: 1200px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </Link>
                <div className="p-space-3">
                  <p className="text-small text-(--color-text-secondary)">
                    {entry.description}
                  </p>
                  <div className="mt-space-3 flex flex-wrap items-center gap-space-3">
                    <Link
                      href={href}
                      className="inline-flex items-center gap-space-1 text-small font-semibold text-(--color-primary)"
                    >
                      {t.common.learnMore}
                      <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
                    </Link>
                    <Link
                      href={`/${typedLocale}/contact`}
                      className="rounded-xl bg-(--color-primary) px-space-3 py-space-1 text-small font-semibold text-(--color-surface) transition-opacity hover:opacity-90"
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
    </>
  );
}
