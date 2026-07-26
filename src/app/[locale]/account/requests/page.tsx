import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n/get-messages";
import type { Enquiry } from "@/types/domain";
import { fetchAccountData, requireUser } from "../_lib/session";

export default async function RequestsPage({
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

  let enquiries: Enquiry[] = [];
  let loadError = false;
  try {
    enquiries = await fetchAccountData<Enquiry[]>("/api/account/requests");
  } catch {
    loadError = true;
  }

  return (
    <div>
      <h1 className="text-h3 font-bold text-(--color-text-primary)">
        {t.account.requests.title}
      </h1>
      <p className="mt-space-1 text-small text-(--color-text-secondary)">
        {t.account.requests.subtitle}
      </p>

      <div className="mt-space-4">
        {loadError ? (
          <p role="alert" className="text-small text-(--color-danger)">
            {t.account.requests.errorGeneric}
          </p>
        ) : enquiries.length === 0 ? (
          <div className="rounded-lg border border-(--color-border) p-space-4 text-center">
            <p className="text-h6 font-semibold text-(--color-text-primary)">
              {t.account.requests.emptyTitle}
            </p>
            <p className="mt-space-1 text-small text-(--color-text-secondary)">
              {t.account.requests.emptyBody}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-space-2">
            {enquiries.map((enquiry) => (
              <li
                key={enquiry.id}
                className="rounded-lg border border-(--color-border) p-space-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-space-2">
                  <div>
                    <p className="text-small font-medium text-(--color-text-muted)">
                      {t.account.requests.needLabel}
                    </p>
                    <p className="text-(--color-text-primary)">{enquiry.need}</p>
                  </div>
                  <div>
                    <p className="text-small font-medium text-(--color-text-muted)">
                      {t.account.requests.statusLabel}
                    </p>
                    <p className="text-(--color-text-primary)">
                      {t.account.requests.statuses[enquiry.status]}
                    </p>
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
