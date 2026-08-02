import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServicesBySection } from "@/lib/catalog/service-sections";
import { buildServiceDetailMetadata } from "@/lib/seo/service-detail-metadata";
import { ServiceDetailContent } from "@/components/service-detail-content";

export function generateStaticParams() {
  return getServicesBySection("maintenance").map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  return buildServiceDetailMetadata(locale as Locale, slug, "services/maintenance");
}

export default async function MaintenanceServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const isMaintenanceService = getServicesBySection("maintenance").some((s) => s.slug === slug);
  if (!isMaintenanceService) notFound();

  return <ServiceDetailContent locale={locale as Locale} slug={slug} />;
}
