import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { BrandPanel } from "@/components/brand-panel";
import { HomeIcon } from "@/components/icons";
import { SERVICE_CATEGORIES, getServicesByCategory } from "@/lib/catalog/services";
import { SERVICE_ICONS, SERVICE_VISUAL_CATEGORY } from "@/lib/catalog/service-visuals";
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
    title: t.services.hero.title,
    description: t.services.hero.subtitle,
    alternates: buildAlternates(locale as Locale, "services"),
  };
}

export default async function ServicesPage({
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
      <section className="mx-auto max-w-desktop px-space-3 py-space-7">
        <h1 className="text-h1 font-bold text-(--color-text-primary)">
          {t.services.hero.title}
        </h1>
        <p className="mt-space-2 max-w-2xl text-lead text-(--color-text-secondary)">
          {t.services.hero.subtitle}
        </p>
      </section>

      {SERVICE_CATEGORIES.map((category) => (
        <section key={category} className="mx-auto max-w-desktop px-space-3 pb-space-7">
          <h2 className="text-h3 font-bold text-(--color-text-primary)">
            {t.services.categories[category]}
          </h2>
          <div className="mt-space-4 grid gap-space-4 tablet:grid-cols-2 desktop:grid-cols-3">
            {getServicesByCategory(category).map((service) => {
              const entry = getServiceEntry(t, service.slug);
              const ServiceIcon = SERVICE_ICONS[service.slug] ?? HomeIcon;
              return (
                <article
                  key={service.slug}
                  className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)"
                >
                  <Link href={`/${typedLocale}/services/${service.slug}`}>
                    <BrandPanel
                      variant="card"
                      category={SERVICE_VISUAL_CATEGORY[service.slug]}
                      icon={<ServiceIcon className="h-7 w-7" />}
                      className="rounded-b-none"
                    />
                  </Link>
                  <div className="flex flex-col gap-space-1 p-space-4">
                    <p className="text-small font-semibold uppercase tracking-wide text-(--color-primary)">
                      {t.services.categories[category]}
                    </p>
                    <h3 className="text-h5 font-semibold text-(--color-text-primary)">
                      <Link href={`/${typedLocale}/services/${service.slug}`}>{entry.name}</Link>
                    </h3>
                    <p className="text-small text-(--color-text-secondary)">
                      {entry.description}
                    </p>
                    <Link
                      href={`/${typedLocale}/services/${service.slug}`}
                      className="mt-space-2 text-small font-semibold text-(--color-primary)"
                    >
                      {t.common.learnMore}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <section className="bg-(--color-surface-secondary)">
        <div className="mx-auto flex max-w-desktop flex-col items-start gap-space-2 px-space-3 py-space-7 tablet:flex-row tablet:items-center tablet:justify-between">
          <div>
            <h2 className="text-h3 font-bold text-(--color-text-primary)">
              {t.services.cta.title}
            </h2>
            <p className="mt-space-1 text-small text-(--color-text-secondary)">
              {t.services.cta.subtitle}
            </p>
          </div>
          <Link
            href={`/${typedLocale}/contact`}
            className="rounded-xl bg-(--color-primary) px-space-3 py-space-2 text-small font-semibold text-(--color-surface)"
          >
            {t.services.cta.button}
          </Link>
        </div>
      </section>
    </>
  );
}
