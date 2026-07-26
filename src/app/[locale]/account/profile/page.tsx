import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n/get-messages";
import { ProfileForm } from "@/components/account/profile-form";
import { requireUser } from "../_lib/session";

export default async function ProfilePage({
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
        {t.account.profile.title}
      </h1>
      <p className="mt-space-1 text-small text-(--color-text-secondary)">
        {t.account.profile.subtitle}
      </p>
      <div className="mt-space-4 max-w-md">
        <ProfileForm t={t} user={user} />
      </div>
    </div>
  );
}
