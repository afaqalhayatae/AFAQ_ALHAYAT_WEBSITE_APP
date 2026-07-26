import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getMessages } from "@/i18n/get-messages";
import { BrandPanel } from "@/components/brand-panel";
import {
  AcUnitIcon,
  ArrowRightIcon,
  BuildingIcon,
  CheckCircleIcon,
  ClockIcon,
  DropletIcon,
  HomeIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SofaIcon,
  SparkleIcon,
  UserIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { WHATSAPP_URL } from "@/lib/brand/links";

const SERVICE_ICONS: Record<string, typeof HomeIcon> = {
  "ac-maintenance": AcUnitIcon,
  "water-tank-cleaning": DropletIcon,
  "home-villa-cleaning": HomeIcon,
  "office-commercial-cleaning": BuildingIcon,
  "sofa-upholstery-cleaning": SofaIcon,
  "pest-control": ShieldCheckIcon,
};

const TRUST_ICONS = [UserIcon, ClockIcon, CheckCircleIcon, MapPinIcon];

export default async function HomePage({
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
    <>
      {/* Hero */}
      <section className="mx-auto max-w-desktop px-space-3 py-space-7 tablet:py-space-8">
        <div className="grid gap-space-5 desktop:grid-cols-2 desktop:items-center">
          <div>
            <p className="text-small font-semibold uppercase tracking-wide text-(--color-primary)">
              {t.home.hero.eyebrow}
            </p>
            <h1 className="mt-space-2 text-h1 font-bold text-(--color-text-primary)">
              {t.home.hero.title}
            </h1>
            <p className="mt-space-3 max-w-2xl text-lead text-(--color-text-secondary)">
              {t.home.hero.subtitle}
            </p>
            <div className="mt-space-4 flex flex-wrap gap-space-2">
              <Link
                href={`/${typedLocale}/contact`}
                className="rounded-xl bg-(--color-primary) px-space-4 py-space-2 text-small font-semibold text-(--color-surface) transition-opacity hover:opacity-90"
              >
                {t.home.hero.primaryCta}
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-space-1 rounded-xl border border-(--color-border) px-space-4 py-space-2 text-small font-semibold text-(--color-text-primary) transition-colors hover:border-(--color-whatsapp) hover:text-(--color-whatsapp)"
              >
                <WhatsAppIcon className="h-5 w-5" />
                {t.home.hero.secondaryCta}
              </a>
            </div>
          </div>

          <BrandPanel variant="hero" icon={<SparkleIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />} />
        </div>
      </section>

      {/* Trust */}
      <section className="bg-(--color-surface-secondary)">
        <div className="mx-auto max-w-desktop px-space-3 py-space-7">
          <h2 className="text-h3 font-bold text-(--color-text-primary)">{t.home.trust.title}</h2>
          <div className="mt-space-4 grid gap-space-3 tablet:grid-cols-2 desktop:grid-cols-4">
            {t.home.trust.items.map((item, index) => {
              const TrustIcon = TRUST_ICONS[index] ?? CheckCircleIcon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-3"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-(--color-primary)/10 text-(--color-primary)">
                    <TrustIcon className="h-5 w-5" />
                  </div>
                  <p className="mt-space-2 text-h6 font-semibold text-(--color-text-primary)">
                    {item.title}
                  </p>
                  <p className="mt-space-1 text-small text-(--color-text-secondary)">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-desktop px-space-3 py-space-7">
        <div className="flex flex-wrap items-end justify-between gap-space-2">
          <div>
            <h2 className="text-h3 font-bold text-(--color-text-primary)">
              {t.home.services.title}
            </h2>
            <p className="mt-space-1 text-small text-(--color-text-secondary)">
              {t.home.services.subtitle}
            </p>
          </div>
          <Link
            href={`/${typedLocale}/services`}
            className="text-small font-semibold text-(--color-primary)"
          >
            {t.home.services.cta}
          </Link>
        </div>
        <div className="mt-space-4 grid gap-space-4 tablet:grid-cols-2 desktop:grid-cols-3">
          {t.services.list.map((service) => {
            const ServiceIcon = SERVICE_ICONS[service.id] ?? HomeIcon;
            return (
              <article
                key={service.id}
                className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)"
              >
                <BrandPanel
                  variant="card"
                  icon={<ServiceIcon className="h-7 w-7" />}
                  className="rounded-b-none"
                />
                <div className="p-space-3">
                  <p className="text-small font-semibold uppercase tracking-wide text-(--color-primary)">
                    {service.category}
                  </p>
                  <h3 className="mt-space-1 text-h6 font-semibold text-(--color-text-primary)">
                    {service.name}
                  </h3>
                  <p className="mt-space-1 text-small text-(--color-text-secondary)">
                    {service.description}
                  </p>
                  <Link
                    href={`/${typedLocale}/contact`}
                    className="mt-space-2 inline-flex items-center gap-space-1 text-small font-semibold text-(--color-primary)"
                  >
                    {t.common.getQuote}
                    <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-desktop px-space-3 py-space-7">
        <h2 className="text-h3 font-bold text-(--color-text-primary)">
          {t.home.howItWorks.title}
        </h2>
        <div className="mt-space-4 grid gap-space-3 tablet:grid-cols-3">
          {t.home.howItWorks.steps.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-(--color-border) p-space-3">
              <span className="text-h4 font-bold text-(--color-primary)">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-space-2 text-h6 font-semibold text-(--color-text-primary)">
                {step.title}
              </p>
              <p className="mt-space-1 text-small text-(--color-text-secondary)">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why AFAQ AL HAYAT */}
      <section className="bg-(--color-surface-secondary)">
        <div className="mx-auto max-w-desktop px-space-3 py-space-7">
          <div className="max-w-2xl">
            <h2 className="text-h3 font-bold text-(--color-text-primary)">{t.home.whyUs.title}</h2>
            <p className="mt-space-2 text-lead text-(--color-text-secondary)">{t.home.whyUs.intro}</p>
          </div>
          <ul className="mt-space-4 grid gap-space-3 tablet:grid-cols-2">
            {t.home.whyUs.points.map((point) => (
              <li key={point} className="flex items-start gap-space-2">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-(--color-primary)" />
                <span className="text-small text-(--color-text-secondary)">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-(--color-primary)">
        <div className="mx-auto flex max-w-desktop flex-col items-start gap-space-3 px-space-3 py-space-7 tablet:flex-row tablet:items-center tablet:justify-between">
          <div>
            <h2 className="text-h3 font-bold text-(--color-surface)">{t.home.cta.title}</h2>
            <p className="mt-space-1 text-(--color-surface)">{t.home.cta.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-space-2">
            <Link
              href={`/${typedLocale}/contact`}
              className="rounded-xl bg-(--color-surface) px-space-3 py-space-2 text-small font-semibold text-(--color-primary)"
            >
              {t.home.cta.button}
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-space-1 rounded-xl border border-(--color-surface) px-space-3 py-space-2 text-small font-semibold text-(--color-surface) transition-colors hover:bg-white/10"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {t.common.whatsappCta}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
