import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { ServiceCard } from "@/components/ui/service-card";
import { getServicesBySection } from "@/lib/catalog/service-sections";
import { CATEGORY_BADGE_COLOR, SERVICE_ICONS, SERVICE_VISUAL_CATEGORY } from "@/lib/catalog/service-visuals";
import {
  APPROVED_SERVICE_CONTENT_SLUGS,
  getServiceCardImage,
  type ServiceCardImage,
} from "@/lib/catalog/service-content";
import { buildAlternates, NOINDEX_FOLLOW } from "@/lib/seo/metadata";

/**
 * Maintenance section hub (JOB-AGT-WEB-20260730 structure phase).
 * Hero banner + grid of the section's services — structure only, no new
 * copy beyond the minimal section name/description already added to
 * i18n (services.sections.maintenance).
 *
 * Final-version rule (2026-07-30): a service card is never shown without
 * a real, linked image — no icon/placeholder stand-in. Services without
 * a cardImage yet (Handyman) are excluded from this grid entirely, not
 * rendered with an icon fallback — see docs/MISSING_SERVICE_IMAGES_REPORT.md.
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
    title: t.services.sections.maintenance.name,
    description: t.services.sections.maintenance.description,
    alternates: buildAlternates(locale as Locale, "services/maintenance"),
    robots: NOINDEX_FOLLOW,
  };
}

export default async function MaintenanceSectionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const t = getMessages(typedLocale);
  // 48-Hour Production Mode fix (2026-08-05): a real cardImage alone
  // isn't enough to show a service card — several newer services have
  // an approved photo but Draft, unpublished page content, which
  // otherwise left the card linking through to a real but empty detail
  // page (confirmed live in production). See services/page.tsx for
  // the full explanation.
  const servicesWithImage = getServicesBySection("maintenance")
    .map((service) => ({ service, cardImage: getServiceCardImage(service.slug) }))
    .filter(
      (entry): entry is { service: (typeof entry)["service"]; cardImage: ServiceCardImage } =>
        Boolean(entry.cardImage) && APPROVED_SERVICE_CONTENT_SLUGS.includes(entry.service.slug)
    );

  return (
    <>
      <section className="mx-auto max-w-desktop px-space-3 py-space-3 text-small text-(--color-text-secondary)">
        <Link href={`/${typedLocale}/services`} className="hover:text-(--color-primary)">
          {t.services.hero.title}
        </Link>
        <span className="mx-space-1">/</span>
        <span>{t.services.sections.maintenance.name}</span>
      </section>

      <section className="mx-auto max-w-desktop px-space-3 pb-space-7">
        <h1 className="text-h1 font-bold text-(--color-text-primary)">
          {t.services.sections.maintenance.name}
        </h1>
        <p className="mt-space-2 max-w-2xl text-lead text-(--color-text-secondary)">
          {t.services.sections.maintenance.description}
        </p>
      </section>

      <section className="mx-auto max-w-desktop px-space-3 pb-space-7">
        <div className="grid gap-space-4 tablet:grid-cols-2 desktop:grid-cols-3">
          {servicesWithImage.map(({ service, cardImage }) => {
            const entry = getServiceEntry(t, service.slug);
            const href = `/${typedLocale}/services/maintenance/${service.slug}`;
            const ServiceIcon = SERVICE_ICONS[service.slug];
            return (
              <ServiceCard
                key={service.slug}
                href={href}
                icon={ServiceIcon}
                badgeColorClass={CATEGORY_BADGE_COLOR[SERVICE_VISUAL_CATEGORY[service.slug]]}
                imageSrc={cardImage.src}
                imageAlt={cardImage.alt[typedLocale]}
                imageCategory={SERVICE_VISUAL_CATEGORY[service.slug]}
                eyebrow={t.services.sections.maintenance.name}
                title={entry.name}
                description={entry.description}
                learnMoreLabel={t.common.learnMore}
                requestServiceHref={`/${typedLocale}/contact`}
                requestServiceLabel={t.common.requestService}
                headingLevel={2}
              />
            );
          })}
        </div>
      </section>
    </>
  );
}
