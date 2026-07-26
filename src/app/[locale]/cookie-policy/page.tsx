import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMessages } from "@/i18n/get-messages";
import { LegalPageContent } from "@/components/legal-page-content";
import { LegalContactLine } from "@/components/legal-contact-line";
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
    title: t.legal.cookies.title,
    description: t.legal.cookies.intro,
    alternates: buildAlternates(locale as Locale, "cookie-policy"),
  };
}

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = getMessages(locale as Locale);

  return (
    <>
      <LegalPageContent content={t.legal.cookies} />
      <LegalContactLine t={t} />
    </>
  );
}
