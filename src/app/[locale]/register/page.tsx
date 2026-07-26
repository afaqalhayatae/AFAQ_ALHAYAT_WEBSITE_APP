import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n/get-messages";
import { RegisterForm } from "@/components/auth/register-form";

export default async function RegisterPage({
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
      <div className="mx-auto max-w-md rounded-lg border border-(--color-border) p-space-4">
        <h1 className="text-h3 font-bold text-(--color-text-primary)">
          {t.auth.register.title}
        </h1>
        <p className="mt-space-1 text-small text-(--color-text-secondary)">
          {t.auth.register.subtitle}
        </p>
        <div className="mt-space-4">
          <RegisterForm locale={typedLocale} t={t} />
        </div>
      </div>
    </section>
  );
}
