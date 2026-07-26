import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n/get-messages";
import type { BookingRequest } from "@/types/domain";
import { fetchAccountData, requireUser } from "../_lib/session";

export default async function BookingsPage({
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

  let bookings: BookingRequest[] = [];
  let loadError = false;
  try {
    bookings = await fetchAccountData<BookingRequest[]>("/api/account/bookings");
  } catch {
    loadError = true;
  }

  return (
    <div>
      <h1 className="text-h3 font-bold text-(--color-text-primary)">
        {t.account.bookings.title}
      </h1>
      <p className="mt-space-1 text-small text-(--color-text-secondary)">
        {t.account.bookings.subtitle}
      </p>

      <div className="mt-space-4">
        {loadError ? (
          <p role="alert" className="text-small text-(--color-danger)">
            {t.account.bookings.errorGeneric}
          </p>
        ) : bookings.length === 0 ? (
          <div className="rounded-lg border border-(--color-border) p-space-4 text-center">
            <p className="text-h6 font-semibold text-(--color-text-primary)">
              {t.account.bookings.emptyTitle}
            </p>
            <p className="mt-space-1 text-small text-(--color-text-secondary)">
              {t.account.bookings.emptyBody}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-space-2">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="rounded-lg border border-(--color-border) p-space-3"
              >
                <div className="grid gap-space-2 tablet:grid-cols-4">
                  <div>
                    <p className="text-small font-medium text-(--color-text-muted)">
                      {t.account.bookings.serviceLabel}
                    </p>
                    <p className="text-(--color-text-primary)">{booking.serviceId}</p>
                  </div>
                  <div>
                    <p className="text-small font-medium text-(--color-text-muted)">
                      {t.account.bookings.serviceAreaLabel}
                    </p>
                    <p className="text-(--color-text-primary)">{booking.serviceAreaId}</p>
                  </div>
                  <div>
                    <p className="text-small font-medium text-(--color-text-muted)">
                      {t.account.bookings.scheduleLabel}
                    </p>
                    <p className="text-(--color-text-primary)">
                      {booking.schedulePreference}
                    </p>
                  </div>
                  <div>
                    <p className="text-small font-medium text-(--color-text-muted)">
                      {t.account.bookings.statusLabel}
                    </p>
                    <p className="text-(--color-text-primary)">
                      {t.account.bookings.statuses[booking.status]}
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
