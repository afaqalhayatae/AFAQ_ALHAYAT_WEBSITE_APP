import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getMessages } from "@/i18n/get-messages";
import { requireUser } from "./_lib/session";

const SECTIONS = ["profile", "requests", "bookings", "quotes"] as const;

export default async function AccountOverviewPage({
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
  const user = await requireUser(typedLocale);

  return (
    <div>
      <h1 className="text-h3 font-bold text-(--color-text-primary)">
        {t.account.overview.title}
      </h1>
      <p className="mt-space-1 text-small text-(--color-text-secondary)">
        {t.account.overview.subtitle}
      </p>
      <p className="mt-space-3 text-lead text-(--color-text-primary)">{user.displayName}</p>

      <div className="mt-space-4 grid gap-space-3 tablet:grid-cols-2">
        {SECTIONS.map((section) => (
          <Link
            key={section}
            href={`/${typedLocale}/account/${section}`}
            className="rounded-lg border border-(--color-border) p-space-3 hover:border-(--color-primary)"
          >
            <p className="text-h6 font-semibold text-(--color-text-primary)">
              {t.account.overview.sections[section].title}
            </p>
            <p className="mt-space-1 text-small text-(--color-text-secondary)">
              {t.account.overview.sections[section].description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
