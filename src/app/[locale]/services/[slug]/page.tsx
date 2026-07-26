import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { BrandPanel } from "@/components/brand-panel";
import { HomeIcon, WhatsAppIcon } from "@/components/icons";
import { SERVICES, getServiceBySlug, getServicesByCategory } from "@/lib/catalog/services";
import { SERVICE_ICONS, SERVICE_VISUAL_CATEGORY } from "@/lib/catalog/service-visuals";
import { LOCATIONS } from "@/lib/catalog/locations";
import { buildAlternates, NOINDEX_FOLLOW } from "@/lib/seo/metadata";
import { WHATSAPP_URL } from "@/lib/brand/links";

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const service = getServiceBySlug(slug);
  if (!service) return {};

  const t = getMessages(locale as Locale);
  const entry = getServiceEntry(t, slug);

  return {
    title: entry.name,
    description: entry.description,
    alternates: buildAlternates(locale as Locale, `services/${slug}`),
    robots: NOINDEX_FOLLOW,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const service = getServiceBySlug(slug);
  if (!service) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const t = getMessages(typedLocale);
  const entry = getServiceEntry(t, slug);
  const ServiceIcon = SERVICE_ICONS[slug] ?? HomeIcon;
  const dubai = LOCATIONS[0];

  const related = getServicesByCategory(service.category)
    .filter((candidate) => candidate.slug !== slug)
    .slice(0, 3);

  return (
    <>
      <section className="mx-auto max-w-desktop px-space-3 py-space-3 text-small text-(--color-text-secondary)">
        <Link href={`/${typedLocale}/services`} className="hover:text-(--color-primary)">
          {t.services.hero.title}
        </Link>
        <span className="mx-space-1">/</span>
        <span>{entry.name}</span>
      </section>

      <section className="mx-auto max-w-desktop px-space-3 pb-space-7">
        <div className="grid gap-space-5 desktop:grid-cols-2 desktop:items-center">
          <div>
            <p className="text-small font-semibold uppercase tracking-wide text-(--color-primary)">
              {t.services.categories[service.category]}
            </p>
            <h1 className="mt-space-2 text-h1 font-bold text-(--color-text-primary)">
              {entry.name}
            </h1>
            <p className="mt-space-3 max-w-2xl text-lead text-(--color-text-secondary)">
              {entry.description}
            </p>
            <div className="mt-space-4 flex flex-wrap gap-space-2">
              <Link
                href={`/${typedLocale}/contact`}
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
            {dubai ? (
              <Link
                href={`/${typedLocale}/services/${slug}/${dubai.slug}`}
                className="mt-space-3 inline-flex items-center gap-space-1 text-small font-semibold text-(--color-primary)"
              >
                {t.services.detail.viewInDubai}
              </Link>
            ) : null}
          </div>

          <BrandPanel
            variant="hero"
            category={SERVICE_VISUAL_CATEGORY[slug]}
            icon={<ServiceIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />}
          />
        </div>
      </section>

      {related.length > 0 ? (
        <section className="bg-(--color-surface-secondary)">
          <div className="mx-auto max-w-desktop px-space-3 py-space-7">
            <h2 className="text-h3 font-bold text-(--color-text-primary)">
              {t.services.detail.relatedTitle}
            </h2>
            <div className="mt-space-4 grid gap-space-3 tablet:grid-cols-3">
              {related.map((relatedService) => {
                const relatedEntry = getServiceEntry(t, relatedService.slug);
                return (
                  <Link
                    key={relatedService.slug}
                    href={`/${typedLocale}/services/${relatedService.slug}`}
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
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-desktop px-space-3 py-space-5">
        <Link
          href={`/${typedLocale}/services`}
          className="text-small font-semibold text-(--color-primary)"
        >
          {t.services.detail.backToServices}
        </Link>
      </section>
    </>
  );
}
