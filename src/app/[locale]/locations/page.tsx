import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getMessages } from "@/i18n/get-messages";
import { MapPinIcon } from "@/components/icons";
import { BrandPanel } from "@/components/brand-panel";
import { ALL_EMIRATES } from "@/lib/catalog/locations";
import { buildAlternates } from "@/lib/seo/metadata";
import { DEMO_VISUAL_ALT, DEMO_VISUAL_SRC, SHOW_DEMO_VISUALS } from "@/lib/media/demo-visuals";

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
      <div className="grid gap-space-5 desktop:grid-cols-2 desktop:items-center">
        <div>
          <h1 className="text-h1 font-bold text-(--color-text-primary)">
            {t.locations.index.title}
          </h1>
          <p className="mt-space-2 max-w-2xl text-lead text-(--color-text-secondary)">
            {t.locations.index.subtitle}
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
  );
}
