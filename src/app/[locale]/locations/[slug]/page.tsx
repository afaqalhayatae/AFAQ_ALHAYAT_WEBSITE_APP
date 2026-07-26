import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { HomeIcon, MapPinIcon } from "@/components/icons";
import { BrandPanel } from "@/components/brand-panel";
import { SERVICES } from "@/lib/catalog/services";
import { SERVICE_ICONS } from "@/lib/catalog/service-visuals";
import { LOCATIONS, getLocationBySlug } from "@/lib/catalog/locations";
import { buildAlternates, NOINDEX_FOLLOW } from "@/lib/seo/metadata";
import { DEMO_VISUAL_ALT, DEMO_VISUAL_SRC, SHOW_DEMO_VISUALS } from "@/lib/media/demo-visuals";

export function generateStaticParams() {
  return LOCATIONS.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const location = getLocationBySlug(slug);
  if (!location) return {};

  const t = getMessages(locale as Locale);
  // Only Dubai has real copy today; every other future location is
  // deliberately absent from LOCATIONS until its own review clears.
  const title = slug === "dubai" ? t.locations.dubai.title : slug;
  const description = slug === "dubai" ? t.locations.dubai.intro : undefined;

  return {
    title,
    description,
    alternates: buildAlternates(locale as Locale, `locations/${slug}`),
    robots: location.indexable ? undefined : NOINDEX_FOLLOW,
  };
}

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const location = getLocationBySlug(slug);
  if (!location) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const t = getMessages(typedLocale);

  return (
    <section className="mx-auto max-w-desktop px-space-3 py-space-7">
      <div className="grid gap-space-5 desktop:grid-cols-2 desktop:items-center">
        <div>
          <h1 className="text-h1 font-bold text-(--color-text-primary)">
            {t.locations.dubai.title}
          </h1>
          <p className="mt-space-3 max-w-2xl text-lead text-(--color-text-secondary)">
            {t.locations.dubai.intro}
          </p>
        </div>
        {SHOW_DEMO_VISUALS ? (
          <BrandPanel
            variant="hero"
            icon={<MapPinIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />}
            src={DEMO_VISUAL_SRC}
            alt={DEMO_VISUAL_ALT}
          />
        ) : (
          <BrandPanel
            variant="hero"
            icon={<MapPinIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />}
          />
        )}
      </div>

      <h2 className="mt-space-6 text-h3 font-bold text-(--color-text-primary)">
        {t.locations.dubai.servicesHeading}
      </h2>
      <div className="mt-space-4 grid gap-space-3 tablet:grid-cols-2 desktop:grid-cols-3">
        {SERVICES.map((service) => {
          const entry = getServiceEntry(t, service.slug);
          const ServiceIcon = SERVICE_ICONS[service.slug] ?? HomeIcon;
          return (
            <Link
              key={service.slug}
              href={`/${typedLocale}/services/${service.slug}/${slug}`}
              className="flex items-center gap-space-2 rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-3 transition-colors hover:border-(--color-primary)"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--color-primary)/10 text-(--color-primary)">
                <ServiceIcon className="h-5 w-5" />
              </span>
              <span className="text-small font-semibold text-(--color-text-primary)">
                {entry.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
