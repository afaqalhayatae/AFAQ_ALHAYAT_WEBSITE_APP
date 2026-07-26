import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getMessages } from "@/i18n/get-messages";

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

      <section className="mx-auto max-w-desktop px-space-3 pb-space-7">
        <div className="grid gap-space-3 tablet:grid-cols-2 desktop:grid-cols-3">
          {t.services.list.map((service) => (
            <article
              key={service.id}
              className="flex flex-col gap-space-2 rounded-lg border border-(--color-border) p-space-4"
            >
              <h2 className="text-h5 font-semibold text-(--color-text-primary)">
                {service.name}
              </h2>
              <p className="text-small text-(--color-text-secondary)">
                {service.description}
              </p>
              <Link
                href={`/${typedLocale}/contact`}
                className="mt-space-2 text-small font-semibold text-(--color-primary)"
              >
                {t.common.getQuote}
              </Link>
            </article>
          ))}
        </div>
      </section>

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
            className="rounded-md bg-(--color-primary) px-space-3 py-space-2 text-small font-semibold text-(--color-surface)"
          >
            {t.services.cta.button}
          </Link>
        </div>
      </section>
    </>
  );
}
