import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMessages } from "@/i18n/get-messages";
import { EnquiryForm } from "@/components/enquiry-form";
import { IllustratedHero } from "@/components/illustrated-hero";
import { buildAlternates } from "@/lib/seo/metadata";
import { ADDRESS_EN, GOOGLE_MAPS_URL, PHONE_E164, WHATSAPP_URL } from "@/lib/brand/links";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getMessages(locale as Locale);
  return {
    title: t.contact.hero.title,
    description: t.contact.hero.subtitle,
    alternates: buildAlternates(locale as Locale, "contact"),
  };
}

export default async function ContactPage({
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
      <IllustratedHero title={t.contact.hero.title} description={t.contact.hero.subtitle} scene="hero" />

      <section className="mx-auto max-w-desktop px-space-3 py-space-7">
      <div className="mt-space-6 grid gap-space-6 tablet:grid-cols-2">
        <div>
          <h2 className="text-h5 font-semibold text-(--color-text-primary)">
            {t.contact.info.title}
          </h2>
          <dl className="mt-space-3 flex flex-col gap-space-2 text-small">
            <div className="flex justify-between gap-space-2">
              <dt className="font-medium text-(--color-text-primary)">{t.common.phone}</dt>
              <dd dir="ltr">
                <a href={`tel:${PHONE_E164}`} className="text-(--color-text-secondary) hover:text-(--color-primary)">
                  {t.contact.info.phone}
                </a>
              </dd>
            </div>
            <div className="flex justify-between gap-space-2">
              <dt className="font-medium text-(--color-text-primary)">{t.common.whatsapp}</dt>
              <dd dir="ltr">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--color-text-secondary) hover:text-(--color-primary)"
                >
                  {t.contact.info.whatsapp}
                </a>
              </dd>
            </div>
            <div className="flex justify-between gap-space-2">
              <dt className="font-medium text-(--color-text-primary)">{t.common.email}</dt>
              <dd className="text-(--color-text-secondary)" dir="ltr">
                {t.contact.info.email}
              </dd>
            </div>
            <div className="flex justify-between gap-space-2">
              <dt className="font-medium text-(--color-text-primary)">
                {t.contact.info.hoursLabel}
              </dt>
              <dd className="text-(--color-text-secondary)">{t.contact.info.hours}</dd>
            </div>
            <div className="flex justify-between gap-space-2">
              <dt className="font-medium text-(--color-text-primary)">{t.common.address}</dt>
              <dd className="text-(--color-text-secondary)">{t.footer.address}</dd>
            </div>
          </dl>

          <div className="mt-space-4 overflow-hidden rounded-2xl border border-(--color-border)">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS_EN)}&output=embed`}
              width="100%"
              height="280"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t.footer.address}
            />
          </div>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-space-2 inline-flex text-small font-semibold text-(--color-primary)"
          >
            {t.common.viewOnGoogleMaps}
          </a>
        </div>

        <div className="rounded-2xl border border-(--color-border) p-space-4">
          <EnquiryForm t={t} source="website-contact-page" />
        </div>
      </div>
      </section>
    </>
  );
}
