import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image, { getImageProps } from "next/image";
import ReactDOM from "react-dom";
import { buildAlternates } from "@/lib/seo/metadata";
import { getMessages } from "@/i18n/get-messages";
import { BrandPanel } from "@/components/brand-panel";
import { BlogPostCard } from "@/components/blog-post-card";
import { DemoBanner } from "@/components/demo-banner";
import { ReviewsSection } from "@/components/reviews-section";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CleaningIcon,
  MapPinIcon,
  PestIcon,
  PhoneIcon,
  UserIcon,
  WhatsAppIcon,
  WrenchIcon,
} from "@/components/icons";
import { PHONE_E164, WHATSAPP_URL } from "@/lib/brand/links";
import { getServiceCardImage, getServiceHero } from "@/lib/catalog/service-content";
import { CATEGORY_BADGE_COLOR } from "@/lib/catalog/service-visuals";
import { DEMO_VISUAL_ALT, DEMO_VISUAL_SRC, SHOW_DEMO_VISUALS } from "@/lib/media/demo-visuals";
import {
  HOMEPAGE_HERO_ALT,
  HOMEPAGE_HERO_DIMENSIONS,
  HOMEPAGE_HERO_MOBILE_DIMENSIONS,
  HOMEPAGE_HERO_SRC,
  HOMEPAGE_HERO_SRC_MOBILE,
} from "@/lib/media/homepage-hero";
import { getLatestPosts } from "@/lib/catalog/blog";
import { APPROVED_FAQS } from "@/lib/catalog/faq";
import { VERIFIED_REVIEWS } from "@/lib/catalog/reviews";
import { ALL_EMIRATES } from "@/lib/catalog/locations";
import { buildOrganizationSchema } from "@/lib/seo/local-business";

/**
 * One icon per trust item, matched to what each item actually says (not
 * just position) — "Responsive Support" is specifically about WhatsApp/
 * phone contact, so it gets `PhoneIcon`, not a generic clock (Complete
 * Visual Asset Generation Phase; see src/i18n/messages/{ar,en}.json
 * `home.trust.items` for the exact copy each icon must match).
 */
const TRUST_ICONS = [UserIcon, PhoneIcon, CheckCircleIcon, MapPinIcon];

/**
 * Final-version rule (2026-07-30): a service card is never shown without
 * a real, linked image — no icon/placeholder stand-in. The 3 homepage
 * section cards are fixed, known services that must always resolve a
 * real cardImage/hero image; if one ever goes missing this throws at
 * build time instead of silently rendering an incomplete card.
 */
function requireCardImage<T>(image: T | undefined, sectionId: string): T {
  if (!image) {
    throw new Error(`Homepage service card "${sectionId}" is missing its required real image`);
  }
  return image;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getMessages(locale as Locale);
  return {
    title: t.home.hero.title,
    description: t.home.hero.subtitle,
    keywords:
      locale === "ar"
        ? ["صيانة منازل الإمارات", "صيانة مكيفات", "مكافحة حشرات", "تنظيف منازل", "سباك", "كهربائي"]
        : ["UAE home services", "AC maintenance", "pest control", "home cleaning", "plumber", "electrician"],
    alternates: buildAlternates(locale as Locale, ""),
    openGraph: {
      title: t.home.hero.title,
      description: t.home.hero.subtitle,
      locale: locale === "ar" ? "ar_AE" : "en_US",
      images: [
        {
          url: HOMEPAGE_HERO_SRC,
          width: HOMEPAGE_HERO_DIMENSIONS.width,
          height: HOMEPAGE_HERO_DIMENSIONS.height,
          alt: HOMEPAGE_HERO_ALT[locale as Locale],
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t.home.hero.title,
      description: t.home.hero.subtitle,
      images: [HOMEPAGE_HERO_SRC],
    },
  };
}

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
  const latestArticles = getLatestPosts(undefined, 4);
  const hasDemoArticles = latestArticles.some((post) => post.isDemo);
  const homepageFaqs = APPROVED_FAQS.slice(0, 4);

  // Hero art direction (Homepage Foundation Alignment) — two crops of the
  // same approved photo, one per breakpoint, following Next.js's
  // documented getImageProps() + <picture> pattern instead of <Image>
  // directly, since <Image> can only render a single source. Preloading
  // has to be done manually here (ReactDOM.preload, matching what <Image
  // priority> does internally) because getImageProps() has no rendering
  // side effects of its own.
  const heroAlt = SHOW_DEMO_VISUALS ? DEMO_VISUAL_ALT : HOMEPAGE_HERO_ALT[typedLocale];
  const heroDesktop = getImageProps({
    alt: heroAlt,
    src: HOMEPAGE_HERO_SRC,
    width: HOMEPAGE_HERO_DIMENSIONS.width,
    height: HOMEPAGE_HERO_DIMENSIONS.height,
    sizes: "100vw",
  });
  const heroMobile = getImageProps({
    alt: heroAlt,
    src: HOMEPAGE_HERO_SRC_MOBILE,
    width: HOMEPAGE_HERO_MOBILE_DIMENSIONS.width,
    height: HOMEPAGE_HERO_MOBILE_DIMENSIONS.height,
    sizes: "100vw",
  });
  if (!SHOW_DEMO_VISUALS) {
    ReactDOM.preload(heroDesktop.props.src, {
      as: "image",
      imageSrcSet: heroDesktop.props.srcSet,
      imageSizes: heroDesktop.props.sizes,
      fetchPriority: "high",
      media: "(min-width: 768px)",
    });
    ReactDOM.preload(heroMobile.props.src, {
      as: "image",
      imageSrcSet: heroMobile.props.srcSet,
      imageSizes: heroMobile.props.sizes,
      fetchPriority: "high",
      media: "(max-width: 767px)",
    });
  }

  const organizationSchema = buildOrganizationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {/* Hero — full-width cinematic background (2026-07-30). The hero photo
          was composed with its subject on the physical right and open
          negative space on the physical left (see
          docs/HOMEPAGE_HERO_GENERATION_BRIEF.md); that's a property of the
          fixed pixels, not of reading direction, so the text block below is
          deliberately pinned to the physical left in both locales with
          plain `text-left`/`mr-auto` rather than logical `text-start`/`ms-`
          utilities — using the logical versions would flip Arabic text onto
          the subject's side of the photo. Only the text's own alignment
          (right-aligned for Arabic, left for English) follows locale. */}
      <section className="relative isolate flex min-h-[480px] items-end overflow-hidden pb-space-6 tablet:min-h-[560px] tablet:items-center tablet:pb-0 desktop:aspect-[21/9] desktop:min-h-0">
        {SHOW_DEMO_VISUALS ? (
          <Image
            src={DEMO_VISUAL_SRC}
            alt={DEMO_VISUAL_ALT}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[80%_center]"
          />
        ) : (
          // Art-directed pair: a wide 21:9 crop at tablet/desktop widths,
          // a narrower ~4:5 crop of the SAME source photo below that —
          // native <picture> selection means only one is ever downloaded,
          // so this doesn't double the image weight the way rendering
          // two <Image>s and hiding one with CSS would.
          <picture>
            <source media="(min-width: 768px)" srcSet={heroDesktop.props.srcSet} />
            <img
              {...heroMobile.props}
              alt={heroAlt}
              // Centered, not the desktop's 80%-right bias (Hero
              // Finalization fix): the mobile crop (homepage-hero.ts) is
              // already a tighter, subject-framed slice of the same
              // photo — reapplying the wide image's off-center bias on
              // top of an already-framed crop risked pushing the
              // technician/equipment further right than intended and
              // clipping them on some viewport ratios.
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </picture>
        )}
        {/* Scrim (Premium Visual Polish) — responsive per breakpoint, not
            one gradient for every viewport. Tablet/desktop keep the
            horizontal fade (darkens the physical left/text side only,
            transparent over the subject — the wide crop has a real empty
            side to work with, and text stays vertically centered there).
            The mobile crop is tightly framed around the subject with no
            equivalent empty side, so the text block is now bottom-
            anchored instead (a common premium mobile-hero pattern — image
            breathes at top, copy sits in a dedicated dark band below),
            paired with a bottom-weighted gradient so it always sits over
            a consistently dark region regardless of crop content. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent tablet:bg-gradient-to-r tablet:from-black/60 tablet:via-black/25 tablet:to-transparent"
        />

        <div className="relative z-10 mx-auto w-full max-w-desktop px-space-3 py-space-7 tablet:py-space-8">
          <div className={`mr-auto max-w-xl ${typedLocale === "ar" ? "text-right" : "text-left"}`}>
            <p className="text-small font-semibold uppercase tracking-wide text-white/90">
              {t.home.hero.eyebrow}
            </p>
            <h1 className="mt-space-2 text-display font-bold leading-[1.05] text-white">
              {t.home.hero.title}
            </h1>
            <p className="mt-space-3 max-w-2xl text-lead text-white/85">{t.home.hero.subtitle}</p>

            {/* CTAs (Hero Finalization) — one dominant primary action per
                LUXURY_DESIGN_DIRECTION.md ("each section should have one
                dominant action"): "Book Appointment" to the real booking
                flow, filled in the brand primary color. WhatsApp and Call
                remain available but demoted to a smaller secondary row —
                still one tap away, no longer competing with the primary
                action for attention. */}
            <div className="mt-space-5 flex flex-col gap-space-3">
              <Link
                href={`/${typedLocale}/book`}
                className="flex h-12 w-fit items-center gap-space-1 rounded-xl bg-(--color-primary) px-space-4 text-small font-semibold text-white shadow-lg shadow-black/20 transition-opacity hover:opacity-90"
              >
                {t.home.booking.button}
                <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <div className="flex flex-wrap gap-space-2">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 items-center gap-space-1 rounded-xl border border-white/40 px-space-3 text-small font-medium text-white/90 transition-colors hover:border-(--color-surface) hover:text-(--color-surface)"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {t.home.hero.secondaryCta}
                </a>
                <a
                  href={`tel:${PHONE_E164}`}
                  className="flex h-10 items-center gap-space-1 rounded-xl border border-white/40 px-space-3 text-small font-medium text-white/90 transition-colors hover:border-(--color-surface) hover:text-(--color-surface)"
                >
                  <PhoneIcon className="h-4 w-4" />
                  {t.common.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust — Master Design Reference Implementation: full-width dark
          navy bar with white icons, matching the approved reference's
          bottom trust section, instead of the previous light-grey
          section with bordered white cards. Same real trust copy, just
          restyled. */}
      <section className="bg-[#0a2f52]">
        <div className="mx-auto max-w-desktop px-space-3 py-space-7">
          <h2 className="text-h3 font-bold text-white">{t.home.trust.title}</h2>
          <div className="mt-space-4 grid gap-space-4 tablet:grid-cols-2 desktop:grid-cols-4">
            {t.home.trust.items.map((item, index) => {
              const TrustIcon = TRUST_ICONS[index] ?? CheckCircleIcon;
              return (
                <div key={item.title} className="flex flex-col gap-space-2">
                  <TrustIcon className="h-7 w-7 shrink-0 text-white" />
                  <p className="text-h6 font-semibold text-white">{item.title}</p>
                  <p className="text-small text-white/75">{item.description}</p>
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
          <div className="flex items-center gap-space-3">
            <Link
              href={`/${typedLocale}/services`}
              className="text-small font-semibold text-(--color-primary)"
            >
              {t.home.services.cta}
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center justify-center gap-space-1 rounded-xl bg-(--color-primary) px-space-3 text-small font-semibold text-(--color-surface) transition-opacity hover:opacity-90"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {t.common.whatsappCta}
            </a>
          </div>
        </div>
        <div className="mt-space-4 grid gap-space-4 tablet:grid-cols-3">
          {(
            [
              {
                id: "maintenance",
                href: `/${typedLocale}/services/maintenance`,
                name: t.services.sections.maintenance.name,
                description: t.services.sections.maintenance.description,
                image: requireCardImage(getServiceCardImage("ac-maintenance"), "maintenance"),
                Icon: WrenchIcon,
                // Service Brand Icons Integration — no general-category
                // Maintenance icon exists in the approved library (all 58
                // files are trade-specific, e.g. AC repair, plumbing,
                // carpentry); per the Owner's explicit instruction, a
                // specific sub-service icon must not stand in for the
                // whole category, so this keeps the existing icons.tsx
                // component rather than picking one. Reported as a
                // missing asset in SERVICE_ICON_INTEGRATION_REPORT.md.
                brandIconSrc: undefined as string | undefined,
                imagePosition: "center",
              },
              {
                id: "cleaning",
                href: `/${typedLocale}/services/cleaning`,
                name: t.services.sections.cleaning.name,
                description: t.services.sections.cleaning.description,
                image: requireCardImage(getServiceCardImage("general-cleaning"), "cleaning"),
                Icon: CleaningIcon,
                brandIconSrc: "/brand/icons/cleaning/icon-cleaning-general.svg",
                imagePosition: "center",
              },
              {
                id: "pest-control",
                href: `/${typedLocale}/services/pest-control`,
                name: t.services.sections["pest-control"].name,
                description: t.services.sections["pest-control"].description,
                // Visual Quality Correction Pass: this is the section's
                // only real photo (heroSection, 21:9 — pest-control has
                // no dedicated 4:3 cardImage, unlike the other 11
                // catalog services; see docs/MISSING_SERVICE_IMAGES_REPORT.md
                // for the parallel Handyman/Bed-Bug-Control gap). A plain
                // centered crop into this 4:3 card slot pushes the
                // technician (composed right-of-center in the source
                // photo) out of frame — biasing right keeps him in view
                // without needing a new asset.
                image: requireCardImage(getServiceHero("pest-control"), "pest-control"),
                Icon: PestIcon,
                // Service Brand Icons Integration — the only pest-control
                // file that doesn't depict one specific pest (the other
                // 20 are each a single named insect/rodent, e.g. termite,
                // cockroach, which the Owner explicitly ruled out as
                // category icons) — a generic targeting/elimination
                // scope, applicable to the category as a whole.
                brandIconSrc: "/brand/icons/pest-control/icon-pest-target-crosshair.svg",
                imagePosition: "78% center",
              },
            ] as const
          ).map((section) => (
            <article
              key={section.id}
              className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)"
            >
              {/* Header row: colored icon badge + title, above the photo —
                  matches the approved Master Design Reference's card
                  composition (icon badge is a separate header element,
                  not overlaid on the image). */}
              <Link
                href={section.href}
                className="flex items-center gap-space-2 p-space-3"
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl text-(--color-surface) ${CATEGORY_BADGE_COLOR[section.id]}`}
                >
                  {section.brandIconSrc ? (
                    // Brand Icon Integration Phase 2 — real approved
                    // icon (Owner decision: use as-is despite size).
                    <Image
                      src={section.brandIconSrc}
                      alt=""
                      aria-hidden="true"
                      width={32}
                      height={32}
                      unoptimized
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    <section.Icon className="h-6 w-6" />
                  )}
                </span>
                <h3 className="text-h5 font-semibold text-(--color-text-primary)">
                  {section.name}
                </h3>
              </Link>
              <Link href={section.href}>
                <BrandPanel
                  variant="card"
                  category={section.id}
                  icon={null}
                  imagePosition={section.imagePosition}
                  className="rounded-t-none rounded-b-none"
                  src={section.image.src}
                  alt={section.image.alt[typedLocale]}
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              </Link>
              <div className="p-space-3">
                <p className="text-small text-(--color-text-secondary)">
                  {section.description}
                </p>
                <Link
                  href={section.href}
                  className="mt-space-3 inline-flex items-center gap-space-1 text-small font-semibold text-(--color-primary)"
                >
                  {t.common.learnMore}
                  <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </div>
            </article>
          ))}
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

      {/* About Us */}
      <section className="mx-auto max-w-desktop px-space-3 py-space-7">
        <div className="grid gap-space-5 desktop:grid-cols-2 desktop:items-center">
          <div>
            <h2 className="text-h3 font-bold text-(--color-text-primary)">{t.home.about.title}</h2>
            <p className="mt-space-2 text-lead text-(--color-text-secondary)">
              {t.home.about.intro}
            </p>
            <Link
              href={`/${typedLocale}/about`}
              className="mt-space-3 inline-flex items-center gap-space-1 text-small font-semibold text-(--color-primary)"
            >
              {t.home.about.cta}
              <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
          <div className="grid gap-space-3 tablet:grid-cols-1">
            <div className="rounded-2xl border border-(--color-border) p-space-4">
              <p className="font-semibold text-(--color-text-primary)">
                {t.home.about.approachTitle}
              </p>
              <p className="mt-space-1 text-small text-(--color-text-secondary)">
                {t.home.about.approach}
              </p>
            </div>
            <div className="rounded-2xl border border-(--color-border) p-space-4">
              <p className="font-semibold text-(--color-text-primary)">
                {t.home.about.qualityTitle}
              </p>
              <p className="mt-space-1 text-small text-(--color-text-secondary)">
                {t.home.about.quality}
              </p>
            </div>
            <div className="rounded-2xl border border-(--color-border) p-space-4">
              <p className="font-semibold text-(--color-text-primary)">
                {t.home.about.coverageTitle}
              </p>
              <p className="mt-space-1 text-small text-(--color-text-secondary)">
                {t.home.about.coverage}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      {latestArticles.length > 0 ? (
        <section className="bg-(--color-surface-secondary)">
          <div className="mx-auto max-w-desktop px-space-3 py-space-7">
            {hasDemoArticles ? <DemoBanner message={t.blog.demoNotice} /> : null}
            <div className="mt-space-3 flex flex-wrap items-end justify-between gap-space-2">
              <div>
                <h2 className="text-h3 font-bold text-(--color-text-primary)">
                  {t.home.articles.title}
                </h2>
                <p className="mt-space-1 text-small text-(--color-text-secondary)">
                  {t.home.articles.subtitle}
                </p>
              </div>
              <Link
                href={`/${typedLocale}/blog`}
                className="text-small font-semibold text-(--color-primary)"
              >
                {t.home.articles.cta}
              </Link>
            </div>
            <div className="mt-space-4 grid gap-space-4 tablet:grid-cols-2 desktop:grid-cols-4">
              {latestArticles.map((post) => (
                <BlogPostCard key={post.slug} post={post} locale={typedLocale} t={t} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Reviews — Final Clean Preview Pass: reuses the same real,
          verified-only ReviewsSection the About page already uses
          (src/components/reviews-section.tsx). Renders nothing while
          VERIFIED_REVIEWS is empty — no fake rating, stars, or quote
          shown — instead of the previous ad-hoc placeholder card. */}
      <ReviewsSection title={t.home.reviews.title} reviews={VERIFIED_REVIEWS} t={t} />

      {/* FAQ — Final Clean Preview Pass: shows only APPROVED_FAQS (the
          same registry the standalone /faq page reads from), never the
          previous invented "demo-*" visual-testing Q&A. Hides entirely
          while nothing is approved yet, matching every other
          content-gated section on this page. */}
      {homepageFaqs.length > 0 ? (
        <section className="bg-(--color-surface-secondary)">
          <div className="mx-auto max-w-desktop px-space-3 py-space-7">
            <div className="flex flex-wrap items-end justify-between gap-space-2">
              <div>
                <h2 className="text-h3 font-bold text-(--color-text-primary)">
                  {t.home.faq.title}
                </h2>
                <p className="mt-space-1 text-small text-(--color-text-secondary)">
                  {t.home.faq.subtitle}
                </p>
              </div>
              <Link
                href={`/${typedLocale}/faq`}
                className="text-small font-semibold text-(--color-primary)"
              >
                {t.home.faq.cta}
              </Link>
            </div>
            <div className="mt-space-4 grid gap-space-3 tablet:grid-cols-2">
              {homepageFaqs.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-4"
                >
                  <p className="font-semibold text-(--color-text-primary)">
                    {item.question[typedLocale]}
                  </p>
                  <p className="mt-space-1 text-small text-(--color-text-secondary)">
                    {item.answer[typedLocale]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Service Areas — 7 emirate cards, each with a distinct icon
          (Final Visual Design Implementation) rather than one icon
          repeated 7 times. Routes already resolve correctly per-emirate
          (Canonical URL Architecture Finalization) — this section is
          purely visual variety, not new location pages. */}
      <section className="mx-auto max-w-desktop px-space-3 py-space-7">
        <h2 className="text-h3 font-bold text-(--color-text-primary)">{t.home.areas.title}</h2>
        <p className="mt-space-1 text-small text-(--color-text-secondary)">
          {t.home.areas.subtitle}
        </p>
        {/* Vertical icon-on-top card layout (Master Design Reference
            Implementation) — matches the approved reference's white
            emirate cards (icon centered above name) instead of the
            previous horizontal icon-beside-text row.
            Emirates Cards Visual Balance Fix — icon grew again (80px to
            96px) and a real, locale-correct name label is back below it
            (icon → name → card, as requested), on its own card padding
            trimmed horizontally (24px to 16px) to leave room for the
            bigger icon at the 7-column desktop breakpoint, with MORE
            vertical padding (24px to 32px) for a fuller, less cramped
            feel top-to-bottom. This also fixes a side effect of Brand
            Icon Integration Phase 2: the artwork itself still has the
            emirate name baked in as English text, but the separate
            label below it is now always in the page's own language
            again, so Arabic visitors see a correct Arabic name even
            though the illustration's own caption stays English. */}
        <div className="mt-space-4 grid grid-cols-2 gap-space-4 tablet:grid-cols-4 desktop:grid-cols-7">
          {ALL_EMIRATES.map((emirate) => {
            return (
              <Link
                key={emirate.id}
                href={emirate.hasPage ? `/${typedLocale}/locations/${emirate.slug}` : `/${typedLocale}/locations`}
                className="flex flex-col items-center justify-center gap-space-3 rounded-2xl border border-(--color-border) bg-(--color-surface) px-space-2 py-space-4 text-center font-medium text-(--color-text-primary) transition-colors hover:border-(--color-primary) hover:text-(--color-primary)"
              >
                <Image
                  src={`/brand/icons/locations/${emirate.slug}.svg`}
                  // Decorative: the visible text label right below is the
                  // one accessible-name source now, so the icon doesn't
                  // also announce the name (avoids double-announcing the
                  // same name twice per card to screen reader users).
                  alt=""
                  width={96}
                  height={96}
                  unoptimized
                  className="h-24 w-24 shrink-0 object-contain"
                />
                <span className="text-small font-semibold">{emirate.name[typedLocale]}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Booking — dedicated appointment-booking entry point (Homepage
          Foundation Alignment). Links to the existing `/book` wizard
          (src/components/booking/booking-form.tsx) rather than
          duplicating its logic here; deliberately labeled "Book
          Appointment" per the approved business flow, never "Request
          Service". */}
      <section className="bg-(--color-surface-secondary)">
        <div className="mx-auto flex max-w-desktop flex-col items-start gap-space-3 px-space-3 py-space-7 text-center tablet:items-center">
          <p className="text-small font-semibold uppercase tracking-wide text-(--color-primary)">
            {t.home.booking.eyebrow}
          </p>
          <h2 className="text-h3 font-bold text-(--color-text-primary)">{t.home.booking.title}</h2>
          <p className="max-w-xl text-(--color-text-secondary)">{t.home.booking.subtitle}</p>
          <Link
            href={`/${typedLocale}/book`}
            className="mt-space-2 flex h-12 items-center gap-space-1 rounded-xl bg-(--color-primary) px-space-4 text-small font-semibold text-white transition-opacity hover:opacity-90"
          >
            {t.home.booking.button}
            <ArrowRightIcon className="h-4 w-4 rtl:rotate-180" />
          </Link>
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
              className="flex items-center gap-space-1 rounded-xl border border-(--color-surface) px-space-3 py-space-2 text-small font-semibold text-(--color-surface) transition-colors hover:bg-white/10"
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
