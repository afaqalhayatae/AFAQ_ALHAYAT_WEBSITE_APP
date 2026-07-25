import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { getMessages } from "@/i18n/get-messages";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = getMessages(locale as Locale);

  return <EmptyState title={t.nav.contact} description={t.common.comingSoon} />;
}
