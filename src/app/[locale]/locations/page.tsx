import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getMessages } from "@/i18n/get-messages";
import { MapPinIcon } from "@/components/icons";
import { IllustratedHero } from "@/components/illustrated-hero";
import { ALL_EMIRATES } from "@/lib/catalog/locations";
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
    <>
      <IllustratedHero title={t.locations.index.title} description={t.locations.index.subtitle} scene="hero" />

      <section className="mx-auto max-w-desktop px-space-3 py-space-7">
      {/* All 7 approved emirates always display here (2026-07-30
          emirates-expansion structure phase) — same safe pattern as the
          homepage's "Service Areas" section: only `hasPage` emirates
          link to their own real hub; the rest self-link back to this
          index rather than to a route that doesn't exist yet. No page
          is fabricated by listing an emirate's name here. */}
      <div className="mt-space-6 grid gap-space-3 tablet:grid-cols-2 desktop:grid-cols-3">
        {ALL_EMIRATES.map((emirate) => (
          <Link
            key={emirate.slug}
            href={
              emirate.hasPage
                ? `/${typedLocale}/locations/${emirate.slug}`
                : `/${typedLocale}/locations`
            }
            className="flex items-center gap-space-2 rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-4 transition-colors hover:border-(--color-primary)"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--color-primary)/10 text-(--color-primary)">
              <MapPinIcon className="h-5 w-5" />
            </span>
            <span className="text-h6 font-semibold text-(--color-text-primary)">
              {emirate.name[typedLocale]}
            </span>
          </Link>
        ))}
      </div>
      </section>
    </>
  );
}
