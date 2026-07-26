import { CheckCircleIcon } from "./icons";
import type { ServiceContentBlock } from "@/lib/catalog/service-content";
import type { FaqItem } from "@/lib/catalog/faq";
import type { Locale } from "@/i18n/config";

/**
 * Service-detail content sections (JOB-AGT-WEB-20260726-M4.2). Each
 * component renders only when its data is present — the service detail
 * page passes `undefined`/empty until real, approved content exists (see
 * src/lib/catalog/service-content.ts and src/lib/catalog/faq.ts).
 */

export function ServiceOverviewSection({ overview }: { overview: string }) {
  return (
    <section className="mx-auto max-w-desktop px-space-3 py-space-6">
      <p className="max-w-2xl text-lead text-(--color-text-secondary)">{overview}</p>
    </section>
  );
}

export function ServiceScopeSection({
  scope,
  includedTitle,
  excludedTitle,
}: {
  scope: ServiceContentBlock["scope"];
  includedTitle: string;
  excludedTitle: string;
}) {
  return (
    <section className="bg-(--color-surface-secondary)">
      <div className="mx-auto grid max-w-desktop gap-space-4 px-space-3 py-space-6 tablet:grid-cols-2">
        <div>
          <h2 className="text-h5 font-semibold text-(--color-text-primary)">{includedTitle}</h2>
          <ul className="mt-space-2 flex flex-col gap-space-1 text-small text-(--color-text-secondary)">
            {scope.included.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-h5 font-semibold text-(--color-text-primary)">{excludedTitle}</h2>
          <ul className="mt-space-2 flex flex-col gap-space-1 text-small text-(--color-text-secondary)">
            {scope.excluded.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function ServiceBenefitsSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mx-auto max-w-desktop px-space-3 py-space-6">
      <h2 className="text-h3 font-bold text-(--color-text-primary)">{title}</h2>
      <ul className="mt-space-4 grid gap-space-3 tablet:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-space-2">
            <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-(--color-primary)" />
            <span className="text-small text-(--color-text-secondary)">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ServiceFaqSection({
  title,
  items,
  locale,
}: {
  title: string;
  items: FaqItem[];
  locale: Locale;
}) {
  if (items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question[locale],
      acceptedAnswer: { "@type": "Answer", text: item.answer[locale] },
    })),
  };

  return (
    <section className="mx-auto max-w-desktop px-space-3 py-space-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <h2 className="text-h3 font-bold text-(--color-text-primary)">{title}</h2>
      <dl className="mt-space-4 flex flex-col gap-space-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-(--color-border) p-space-4">
            <dt className="font-semibold text-(--color-text-primary)">{item.question[locale]}</dt>
            <dd className="mt-space-1 text-small text-(--color-text-secondary)">
              {item.answer[locale]}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
