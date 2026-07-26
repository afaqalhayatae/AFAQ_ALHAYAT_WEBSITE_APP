import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n/get-messages";
import { EnquiryForm } from "@/components/enquiry-form";

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
    <section className="mx-auto max-w-desktop px-space-3 py-space-7">
      <div className="max-w-2xl">
        <h1 className="text-h1 font-bold text-(--color-text-primary)">
          {t.contact.hero.title}
        </h1>
        <p className="mt-space-2 text-lead text-(--color-text-secondary)">
          {t.contact.hero.subtitle}
        </p>
      </div>

      <div className="mt-space-6 grid gap-space-6 tablet:grid-cols-2">
        <div>
          <h2 className="text-h5 font-semibold text-(--color-text-primary)">
            {t.contact.info.title}
          </h2>
          <dl className="mt-space-3 flex flex-col gap-space-2 text-small">
            <div className="flex justify-between gap-space-2">
              <dt className="font-medium text-(--color-text-primary)">{t.common.phone}</dt>
              <dd className="text-(--color-text-secondary)" dir="ltr">
                {t.contact.info.phone}
              </dd>
            </div>
            <div className="flex justify-between gap-space-2">
              <dt className="font-medium text-(--color-text-primary)">{t.common.whatsapp}</dt>
              <dd className="text-(--color-text-secondary)" dir="ltr">
                {t.contact.info.whatsapp}
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
          </dl>
        </div>

        <div className="rounded-2xl border border-(--color-border) p-space-4">
          <EnquiryForm t={t} source="website-contact-page" />
        </div>
      </div>
    </section>
  );
}
