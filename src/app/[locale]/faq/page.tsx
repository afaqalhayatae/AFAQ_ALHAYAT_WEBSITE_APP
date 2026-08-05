import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMessages } from "@/i18n/get-messages";
import { EmptyState } from "@/components/empty-state";
import { IllustratedHero } from "@/components/illustrated-hero";
import { APPROVED_FAQS, FAQ_CATEGORIES } from "@/lib/catalog/faq";
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
    title: t.faq.title,
    description:
      locale === "ar"
        ? "إجابات على الأسئلة الشائعة حول خدمات الصيانة والتنظيف ومكافحة الحشرات والحجز والمناطق التي تغطيها آفاق الحياة."
        : "Answers to common questions about AFAQ AL HAYAT's maintenance, cleaning, and pest control services, booking, and coverage areas.",
    alternates: buildAlternates(locale as Locale, "faq"),
  };
}

export default async function FaqPage({
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

  if (APPROVED_FAQS.length === 0) {
    return <EmptyState title={t.nav.faq} description={t.common.comingSoon} />;
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: APPROVED_FAQS.map((item) => ({
      "@type": "Question",
      name: item.question[typedLocale],
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer[typedLocale],
      },
    })),
  };

  return (
    <>
      {/* schema.org JSON-LD, built from the approved FAQ registry above */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <IllustratedHero title={t.faq.title} scene="hero" />
      <section className="mx-auto max-w-desktop px-space-3 py-space-7">
        {FAQ_CATEGORIES.map((category) => {
          const items = APPROVED_FAQS.filter((item) => item.category === category);
          if (items.length === 0) return null;

          return (
            <div key={category} className="mt-space-6">
              <h2 className="text-h3 font-bold text-(--color-text-primary)">
                {t.faq.categories[category]}
              </h2>
              <dl className="mt-space-4 flex flex-col gap-space-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-(--color-border) p-space-4"
                  >
                    <dt className="font-semibold text-(--color-text-primary)">
                      {item.question[typedLocale]}
                    </dt>
                    <dd className="mt-space-1 text-small text-(--color-text-secondary)">
                      {item.answer[typedLocale]}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </section>
    </>
  );
}
