/**
 * JOB-AGT-WEB-20260726-M2.4: QuoteRequest has no status field in the
 * current domain model (src/types/domain.ts) — only BookingRequest does.
 * This page displays what actually exists (service, requirements) rather
 * than fabricating a status value; adding one would be a further domain
 * amendment, out of scope here.
 */

import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n/get-messages";
import type { QuoteRequest } from "@/types/domain";
import { fetchAccountData, requireUser } from "../_lib/session";

export default async function QuotesPage({
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
  await requireUser(typedLocale);

  let quotes: QuoteRequest[] = [];
  let loadError = false;
  try {
    quotes = await fetchAccountData<QuoteRequest[]>("/api/account/quotes");
  } catch {
    loadError = true;
  }

  return (
    <div>
      <h1 className="text-h3 font-bold text-(--color-text-primary)">
        {t.account.quotes.title}
      </h1>
      <p className="mt-space-1 text-small text-(--color-text-secondary)">
        {t.account.quotes.subtitle}
      </p>

      <div className="mt-space-4">
        {loadError ? (
          <p role="alert" className="text-small text-(--color-danger)">
            {t.account.quotes.errorGeneric}
          </p>
        ) : quotes.length === 0 ? (
          <div className="rounded-lg border border-(--color-border) p-space-4 text-center">
            <p className="text-h6 font-semibold text-(--color-text-primary)">
              {t.account.quotes.emptyTitle}
            </p>
            <p className="mt-space-1 text-small text-(--color-text-secondary)">
              {t.account.quotes.emptyBody}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-space-2">
            {quotes.map((quote) => (
              <li
                key={quote.id}
                className="rounded-lg border border-(--color-border) p-space-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-space-2">
                  <div>
                    <p className="text-small font-medium text-(--color-text-muted)">
                      {t.account.quotes.serviceLabel}
                    </p>
                    <p className="text-(--color-text-primary)">{quote.serviceId}</p>
                  </div>
                  <div>
                    <p className="text-small font-medium text-(--color-text-muted)">
                      {t.account.quotes.requirementsLabel}
                    </p>
                    <p className="text-(--color-text-primary)">{quote.requirements}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
