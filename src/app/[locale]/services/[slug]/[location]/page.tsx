import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { WhatsAppIcon } from "@/components/icons";
import { SERVICES, getServiceBySlug } from "@/lib/catalog/services";
import { LOCATIONS, getLocationBySlug } from "@/lib/catalog/locations";
import { isActive } from "@/lib/catalog/matrix";
import { buildAlternates, NOINDEX_FOLLOW } from "@/lib/seo/metadata";
import { WHATSAPP_URL } from "@/lib/brand/links";

export function generateStaticParams() {
  return SERVICES.flatMap((service) =>
    LOCATIONS.filter((location) => isActive(service.slug, location.slug)).map((location) => ({
      slug: service.slug,
      location: location.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; location: string }>;
}): Promise<Metadata> {
  const { locale, slug, location } = await params;
  if (!isLocale(locale)) return {};
  if (!getServiceBySlug(slug) || !getLocationBySlug(location)) return {};

  const t = getMessages(locale as Locale);
  const entry = getServiceEntry(t, slug);

  const locationName =
    location === "dubai" ? t.locations.dubai.title : location;

  return {
    title: `${entry.name} ${t.common.in} ${locationName}`,
    description: entry.description,
    alternates: buildAlternates(locale as Locale, `services/${slug}/${location}`),
    robots: NOINDEX_FOLLOW,
  };
}

export default async function ServiceLocationPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; location: string }>;
}) {
  const { locale, slug, location } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const service = getServiceBySlug(slug);
  const serviceLocation = getLocationBySlug(location);
  if (!service || !serviceLocation || !isActive(slug, location)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const t = getMessages(typedLocale);
  const entry = getServiceEntry(t, slug);
  const locationName = location === "dubai" ? t.locations.dubai.title : location;

  return (
    <section className="mx-auto max-w-desktop px-space-3 py-space-7">
      <p className="text-small font-semibold uppercase tracking-wide text-(--color-primary)">
        {t.services.categories[service.category]}
      </p>
      <h1 className="mt-space-2 text-h1 font-bold text-(--color-text-primary)">
        {entry.name} {t.common.in} {locationName}
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

      <div className="mt-space-5 flex flex-wrap gap-space-4 text-small font-semibold text-(--color-primary)">
        <Link href={`/${typedLocale}/services/${slug}`}>{t.locations.combo.backToService}</Link>
        <Link href={`/${typedLocale}/locations/${location}`}>
          {t.locations.combo.backToLocation}
        </Link>
      </div>
    </section>
  );
}
