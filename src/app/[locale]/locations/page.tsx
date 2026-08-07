import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getMessages } from "@/i18n/get-messages";
import { UnifiedHero } from "@/components/unified-hero";
import { ALL_EMIRATES } from "@/lib/catalog/locations";
import { buildAlternates } from "@/lib/seo/metadata";
import { WHATSAPP_URL } from "@/lib/brand/links";
import { getLocationHero } from "@/lib/media/location-heroes";

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
  // Dubai's own real emirate hero photo (not a new asset — same file
  // locations/dubai/page.tsx already uses) doubles as this index page's
  // hero: real, approved, and the most representative single image for
  // an "all locations" overview.
  const dubaiHero = getLocationHero("dubai");

  return (
    <>
      {dubaiHero ? (
        <UnifiedHero
          locale={typedLocale}
          image={dubaiHero}
          alt={dubaiHero.alt[typedLocale]}
          title={t.locations.index.title}
          description={t.locations.index.subtitle}
          primaryCta={{ label: t.common.requestService, href: `/${typedLocale}/book` }}
          secondaryCta={{
            label: t.home.hero.secondaryCta,
            href: WHATSAPP_URL,
            icon: "whatsapp",
            external: true,
          }}
        />
      ) : null}

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
            className="flex items-center gap-space-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-4 transition-colors hover:border-(--color-primary)"
          >
            {/* Same real per-emirate artwork as the homepage's "Service
                Areas" section (/brand/icons/locations/{slug}.svg) —
                one icon set for the same 7 emirates, not two. Decorative:
                the visible name label is the accessible-name source. */}
            <Image
              src={`/brand/icons/locations/${emirate.slug}.svg`}
              alt=""
              width={56}
              height={56}
              unoptimized
              className="h-14 w-14 shrink-0 object-contain"
            />
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
