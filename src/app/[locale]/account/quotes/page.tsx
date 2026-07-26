/**
 * JOB-AGT-WEB-20260726-M2.2: QuoteRequest has no customer/user linkage in
 * the approved domain model (src/types/domain.ts, prisma/schema.prisma) —
 * see the job report. This page is honest about that rather than
 * fabricating a filtered list.
 */

import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n/get-messages";
import { requireUser } from "../_lib/session";

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

  return (
    <div>
      <h1 className="text-h3 font-bold text-(--color-text-primary)">
        {t.account.quotes.title}
      </h1>
      <p className="mt-space-1 text-small text-(--color-text-secondary)">
        {t.account.quotes.subtitle}
      </p>
      <div className="mt-space-4 rounded-lg border border-(--color-border) p-space-4 text-center">
        <p className="text-h6 font-semibold text-(--color-text-primary)">
          {t.account.quotes.emptyTitle}
        </p>
        <p className="mt-space-1 text-small text-(--color-text-secondary)">
          {t.account.quotes.emptyBody}
        </p>
      </div>
    </div>
  );
}
