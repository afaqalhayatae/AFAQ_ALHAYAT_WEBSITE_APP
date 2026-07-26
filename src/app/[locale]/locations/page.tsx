import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getMessages } from "@/i18n/get-messages";
import { MapPinIcon } from "@/components/icons";
import { LOCATIONS } from "@/lib/catalog/locations";
import { buildAlternates } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getMessages(locale as Locale);
  return {
    title: t.locations.index.title,
    description: t.locations.index.subtitle,
    alternates: buildAlternates(locale as Locale, "locations"),
  };
}

export default async function LocationsPage({
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
    <section className="mx-auto max-w-desktop px-space-3 py-space-7">
      <h1 className="text-h1 font-bold text-(--color-text-primary)">
        {t.locations.index.title}
      </h1>
      <p className="mt-space-2 max-w-2xl text-lead text-(--color-text-secondary)">
        {t.locations.index.subtitle}
      </p>

      <div className="mt-space-5 grid gap-space-3 tablet:grid-cols-2 desktop:grid-cols-3">
        {LOCATIONS.map((location) => (
          <Link
            key={location.slug}
            href={`/${typedLocale}/locations/${location.slug}`}
            className="flex items-center gap-space-2 rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-4 transition-colors hover:border-(--color-primary)"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--color-primary)/10 text-(--color-primary)">
              <MapPinIcon className="h-5 w-5" />
            </span>
            <span className="text-h6 font-semibold text-(--color-text-primary)">
              {location.slug === "dubai" ? t.locations.dubai.title : location.slug}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
