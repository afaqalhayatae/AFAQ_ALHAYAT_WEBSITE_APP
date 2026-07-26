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
    title: t.legal.privacy.title,
    description: t.legal.privacy.intro,
    alternates: buildAlternates(locale as Locale, "privacy-policy"),
  };
}

export default async function PrivacyPolicyPage({
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
      <LegalPageContent content={t.legal.privacy} />
      <LegalContactLine t={t} />
    </>
  );
}
