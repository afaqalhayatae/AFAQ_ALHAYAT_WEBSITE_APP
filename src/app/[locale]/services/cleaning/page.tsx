import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { UnifiedHero } from "@/components/unified-hero";
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
  // 48-Hour Production Mode fix (2026-08-05): a real cardImage alone
  // isn't enough to show a service card — several newer services have
  // an approved photo but Draft, unpublished page content, which
  // otherwise left the card linking through to a real but empty detail
  // page (confirmed live in production). See services/page.tsx for
  // the full explanation.
  const servicesWithImage = getServicesBySection("cleaning")
    .map((service) => ({ service, cardImage: getServiceCardImage(service.slug) }))
    .filter(
      (entry): entry is { service: (typeof entry)["service"]; cardImage: ServiceCardImage } =>
        Boolean(entry.cardImage) && APPROVED_SERVICE_CONTENT_SLUGS.includes(entry.service.slug)
    );

  return (
    <>
      <UnifiedHero
        locale={typedLocale}
        image={{
          src: "/brand/images/services/cleaning/cleaning-services-hero-banner-afaq-branded-21x9-v1.webp",
          width: 1693,
          height: 929,
        }}
        alt={
          typedLocale === "ar"
            ? "فريق آفاق الحياة ينظف صالة فيلا فاخرة في الإمارات"
            : "AFAQ AL HAYAT cleaning team servicing a luxury villa living room in the UAE"
        }
        title={t.services.sections.cleaning.name}
        description={t.services.sections.cleaning.description}
        breadcrumb={[{ label: t.services.hero.title, href: `/${typedLocale}/services` }]}
        currentPageLabel={t.services.sections.cleaning.name}
      />

      <section className="mx-auto max-w-desktop px-space-3 pb-space-7">
        <div className="grid gap-space-4 tablet:grid-cols-2 desktop:grid-cols-3">
          {servicesWithImage.map(({ service, cardImage }) => {
            const entry = getServiceEntry(t, service.slug);
            const href = `/${typedLocale}/services/cleaning/${service.slug}`;
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
                eyebrow={t.services.sections.cleaning.name}
                title={entry.name}
                description={entry.description}
                learnMoreLabel={t.common.learnMore}
                requestServiceHref={`/${typedLocale}/book?service=${service.slug}`}
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
