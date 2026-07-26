import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getMessages } from "@/i18n/get-messages";

export default async function HomePage({
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
      <section className="mx-auto max-w-desktop px-space-3 py-space-8">
        <p className="text-small font-semibold uppercase tracking-wide text-(--color-primary)">
          {t.home.hero.eyebrow}
        </p>
        <h1 className="mt-space-2 max-w-3xl text-h1 font-bold text-(--color-text-primary)">
          {t.home.hero.title}
        </h1>
        <p className="mt-space-3 max-w-2xl text-lead text-(--color-text-secondary)">
          {t.home.hero.subtitle}
        </p>
        <div className="mt-space-4 flex flex-wrap gap-space-2">
          <Link
            href={`/${typedLocale}/contact`}
            className="rounded-md bg-(--color-primary) px-space-3 py-space-2 text-small font-semibold text-(--color-surface)"
          >
            {t.home.hero.primaryCta}
          </Link>
          <Link
            href={`/${typedLocale}/services`}
            className="rounded-md border border-(--color-border) px-space-3 py-space-2 text-small font-semibold text-(--color-text-primary)"
          >
            {t.home.hero.secondaryCta}
          </Link>
        </div>
      </section>

      <section className="bg-(--color-surface-secondary)">
        <div className="mx-auto max-w-desktop px-space-3 py-space-7">
          <h2 className="text-h3 font-bold text-(--color-text-primary)">
            {t.home.highlights.title}
          </h2>
          <div className="mt-space-4 grid gap-space-3 tablet:grid-cols-3">
            {t.home.highlights.items.map((item, index) => (
              <div
                key={item.title}
                className="rounded-lg border border-(--color-border) bg-(--color-surface) p-space-3"
              >
                <span className="text-h4 font-bold text-(--color-primary)">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-space-2 text-h6 font-semibold text-(--color-text-primary)">
                  {item.title}
                </p>
                <p className="mt-space-1 text-small text-(--color-text-secondary)">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-desktop px-space-3 py-space-7">
        <div className="flex flex-wrap items-end justify-between gap-space-2">
          <div>
            <h2 className="text-h3 font-bold text-(--color-text-primary)">
              {t.home.services.title}
            </h2>
            <p className="mt-space-1 text-small text-(--color-text-secondary)">
              {t.home.services.subtitle}
            </p>
          </div>
          <Link
            href={`/${typedLocale}/services`}
            className="text-small font-semibold text-(--color-primary)"
          >
            {t.home.services.cta}
          </Link>
        </div>
        <div className="mt-space-4 grid gap-space-3 tablet:grid-cols-2 desktop:grid-cols-4">
          {t.services.list.slice(0, 4).map((service) => (
            <div
              key={service.id}
              className="rounded-lg border border-(--color-border) p-space-3"
            >
              <p className="text-h6 font-semibold text-(--color-text-primary)">
                {service.name}
              </p>
              <p className="mt-space-1 text-small text-(--color-text-secondary)">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-(--color-primary)">
        <div className="mx-auto flex max-w-desktop flex-col items-start gap-space-3 px-space-3 py-space-7 tablet:flex-row tablet:items-center tablet:justify-between">
          <div>
            <h2 className="text-h3 font-bold text-(--color-surface)">
              {t.home.cta.title}
            </h2>
            <p className="mt-space-1 text-(--color-surface)">{t.home.cta.subtitle}</p>
          </div>
          <Link
            href={`/${typedLocale}/contact`}
            className="rounded-md bg-(--color-surface) px-space-3 py-space-2 text-small font-semibold text-(--color-primary)"
          >
            {t.home.cta.button}
          </Link>
        </div>
      </section>
    </>
  );
}
