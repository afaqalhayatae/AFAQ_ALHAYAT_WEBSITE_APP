import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n/get-messages";
import { AccountNav } from "@/components/account/account-nav";
import { requireUser } from "./_lib/session";

export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  await requireUser(typedLocale);
  const t = getMessages(typedLocale);

  return (
    <div className="mx-auto max-w-desktop px-space-3 py-space-6">
      <div className="flex flex-col gap-space-4 tablet:flex-row tablet:gap-space-6">
        <AccountNav locale={typedLocale} t={t} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
