import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { BrandPanel } from "@/components/brand-panel";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  HomeIcon,
  MapPinIcon,
  SparkleIcon,
  UserIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { WHATSAPP_URL } from "@/lib/brand/links";
import { SERVICES } from "@/lib/catalog/services";
import { SERVICE_ICONS, SERVICE_VISUAL_CATEGORY } from "@/lib/catalog/service-visuals";
import { DEMO_VISUAL_ALT, DEMO_VISUAL_SRC, SHOW_DEMO_VISUALS } from "@/lib/media/demo-visuals";

const TRUST_ICONS = [UserIcon, ClockIcon, CheckCircleIcon, MapPinIcon];
const HOMEPAGE_PREVIEW_COUNT = 6;

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
                className="flex h-12 items-center justify-center rounded-xl bg-(--color-primary) px-space-4 text-small font-semibold text-(--color-surface) transition-opacity hover:opacity-90"
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

          {SHOW_DEMO_VISUALS ? (
            <BrandPanel
              variant="hero"
              icon={<SparkleIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />}
              src={DEMO_VISUAL_SRC}
              alt={DEMO_VISUAL_ALT}
            />
          ) : (
            <BrandPanel variant="hero" icon={<SparkleIcon className="h-10 w-10 tablet:h-12 tablet:w-12" />} />
          )}
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
                    <TrustIcon className="h-6 w-6" />
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
          {SERVICES.slice(0, HOMEPAGE_PREVIEW_COUNT).map((service) => {
            const entry = getServiceEntry(t, service.slug);
            const ServiceIcon = SERVICE_ICONS[service.slug] ?? HomeIcon;
            return (
              <article
                key={service.slug}
                className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)"
              >
                <Link href={`/${typedLocale}/services/${service.slug}`}>
                  <BrandPanel
                    variant="card"
                    category={SERVICE_VISUAL_CATEGORY[service.slug]}
                    icon={<ServiceIcon className="h-8 w-8" />}
                    className="rounded-b-none"
                  />
                </Link>
                <div className="p-space-3">
                  <p className="text-small font-semibold uppercase tracking-wide text-(--color-primary)">
                    {t.services.categories[service.category]}
                  </p>
                  <h3 className="mt-space-1 text-h6 font-semibold text-(--color-text-primary)">
                    <Link href={`/${typedLocale}/services/${service.slug}`}>{entry.name}</Link>
                  </h3>
                  <p className="mt-space-1 text-small text-(--color-text-secondary)">
                    {entry.description}
                  </p>
                  <Link
                    href={`/${typedLocale}/services/${service.slug}`}
                    className="mt-space-2 inline-flex items-center gap-space-1 text-small font-semibold text-(--color-primary)"
                  >
                    {t.common.learnMore}
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
