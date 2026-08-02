import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMessages } from "@/i18n/get-messages";
import { BookingForm } from "@/components/booking/booking-form";
import { buildAlternates, NOINDEX_FOLLOW } from "@/lib/seo/metadata";
import { getServiceBySlug } from "@/lib/catalog/services";
import { getEmirateBySlug } from "@/lib/catalog/locations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getMessages(locale as Locale);
  return {
    title: t.booking.meta.title,
    description: t.booking.meta.description,
    alternates: buildAlternates(locale as Locale, "book"),
    // Preview-only, front-end UI with no real submission path yet — not
    // ready for search indexing until it's connected to a live system.
    robots: NOINDEX_FOLLOW,
  };
}

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string; location?: string }>;
}) {
  const { locale } = await params;
  const { service: requestedServiceSlug, location: requestedLocationSlug } = await searchParams;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const t = getMessages(typedLocale);
  // Only a real, approved catalog slug may prefill the form — an
  // unrecognized `?service=` value is silently ignored, never guessed at.
  const initialServiceSlug = requestedServiceSlug && getServiceBySlug(requestedServiceSlug)
    ? requestedServiceSlug
    : undefined;
  // Same rule for `?location=` (JOB-AGT-WEB-20260730 emirates-expansion
  // structure phase) — validated against the 7 approved emirates
  // (ALL_EMIRATES, the real SERVICE_MATRIX.md coverage fact), not just
  // the emirates that currently have a marketing page. The form's
  // emirate dropdown already offers all 7, so this only prefills a
  // selection the visitor could have made manually anyway. Language is
  // already carried by the `/{locale}/book` route itself — no separate
  // param needed for it.
  const initialLocationSlug = requestedLocationSlug && getEmirateBySlug(requestedLocationSlug)
    ? requestedLocationSlug
    : undefined;

  return (
    <section className="mx-auto max-w-desktop px-space-3 py-space-7 tablet:py-space-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-small font-semibold uppercase tracking-wide text-(--color-primary)">
          {t.booking.hero.eyebrow}
        </p>
        <h1 className="mt-space-2 text-h1 font-bold text-(--color-text-primary)">
          {t.booking.hero.title}
        </h1>
        <p className="mt-space-3 text-lead text-(--color-text-secondary)">
          {t.booking.hero.subtitle}
        </p>
      </div>

      <div className="mt-space-6 rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-4 tablet:p-space-6">
        <BookingForm
          locale={typedLocale}
          t={t}
          initialServiceSlug={initialServiceSlug}
          initialLocationSlug={initialLocationSlug}
        />
      </div>
    </section>
  );
}
