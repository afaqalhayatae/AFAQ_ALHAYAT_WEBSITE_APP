import { getImageProps } from "next/image";
import ReactDOM from "react-dom";
import Link from "next/link";
import type { SVGProps } from "react";
import type { Locale } from "@/i18n/config";
import { ArrowRightIcon, PhoneIcon, WhatsAppIcon } from "./icons";
import { Button } from "./ui/button";

/** Primary CTA arrow — flips in RTL, same as every other directional arrow in this codebase. */
function ArrowRightIconRtl(props: SVGProps<SVGSVGElement>) {
  return <ArrowRightIcon {...props} className={`${props.className ?? ""} rtl:rotate-180`} />;
}

export type UnifiedHeroImage = {
  src: string;
  width: number;
  height: number;
};

export type UnifiedHeroCta = {
  label: string;
  href: string;
  external?: boolean;
  icon?: "arrow" | "whatsapp" | "phone" | "none";
};

export type UnifiedHeroBreadcrumbItem = { label: string; href: string };

const CTA_ICONS = {
  arrow: ArrowRightIcon,
  whatsapp: WhatsAppIcon,
  phone: PhoneIcon,
};

/**
 * Unified premium hero (Unified Hero Design System, 2026-08-05). One
 * full-bleed image hero, extracted from the two independent
 * implementations that already existed and had converged on the same
 * shape: the homepage hero (page.tsx) and the pest-control detail page's
 * hero (service-detail-content.tsx, itself built "same architecture as
 * the homepage hero" per SERVICE_DATABASE.json's own heroSection.usage
 * note). Same responsive height/scrim/CTA pattern both already used —
 * this doesn't invent a new visual language, it names the one that
 * already existed twice and lets every future hero reuse it instead of
 * a third bespoke copy.
 *
 * Only renders with a real image — there is no illustration/gradient
 * fallback here by design, matching this codebase's established
 * no-placeholder rule (BrandPanel is the right choice for a page that
 * doesn't have real photography yet, not this component).
 */
export function UnifiedHero({
  locale,
  image,
  mobileImage,
  alt,
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  tertiaryCta,
  breadcrumb,
  currentPageLabel,
  align = "start",
  priority = true,
  imagePosition = "center",
  phone,
}: {
  locale: Locale;
  image: UnifiedHeroImage;
  /** Art-directed alternate crop for narrow viewports — same source
   *  photo, tighter framing. Falls back to `image` at every width when
   *  omitted. */
  mobileImage?: UnifiedHeroImage;
  alt: string;
  eyebrow?: string;
  title: string;
  description?: string;
  /** Visible phone number directly under the H1, matching the same
   *  Owner-requested pattern already live on city pages
   *  (city-page-content.tsx, "Owner request, 2026-08-06") — a customer
   *  scanning the page should see the real number immediately, not just
   *  a button. Optional so heroes that don't need it (e.g. the homepage)
   *  are unaffected. */
  phone?: { display: string; href: string };
  primaryCta?: UnifiedHeroCta;
  secondaryCta?: UnifiedHeroCta;
  /** Homepage-only third action (Call) — optional, most pages need only two. */
  tertiaryCta?: UnifiedHeroCta;
  /** Parent trail only — the current page renders as plain text via
   *  `currentPageLabel`, matching this codebase's existing breadcrumb
   *  convention of never linking the page you're already on. */
  breadcrumb?: UnifiedHeroBreadcrumbItem[];
  currentPageLabel?: string;
  /**
   * "start" (default): text follows reading direction, RTL-correct —
   * right-aligned in Arabic, left in English. Use for every hero except
   * one composed with its subject fixed on one physical side of the
   * frame (see the homepage's own hero for why: the photo's negative
   * space is a property of its pixels, not of locale, so flipping the
   * text block in Arabic would push it onto the subject).
   * "physical-left": text always pinned to the photo's physical left,
   * regardless of locale — only the text's own alignment still follows
   * locale.
   */
  align?: "start" | "physical-left";
  priority?: boolean;
  /** CSS object-position for the image, e.g. "80% center" — same idea as
   *  BrandPanel's `imagePosition` prop. Defaults to centered. */
  imagePosition?: string;
}) {
  const desktop = getImageProps({
    alt,
    src: image.src,
    width: image.width,
    height: image.height,
    sizes: "100vw",
  });
  const mobile = mobileImage
    ? getImageProps({
        alt,
        src: mobileImage.src,
        width: mobileImage.width,
        height: mobileImage.height,
        sizes: "100vw",
      })
    : null;

  if (priority) {
    // Manual preload hint (matches the homepage hero's original
    // approach) — required because art-directed <picture> markup
    // doesn't get the automatic preload next/image's <Image priority>
    // gives a single-source image.
    ReactDOM.preload(desktop.props.src, {
      as: "image",
      imageSrcSet: desktop.props.srcSet,
      imageSizes: desktop.props.sizes,
      fetchPriority: "high",
      media: mobile ? "(min-width: 768px)" : undefined,
    });
    if (mobile) {
      ReactDOM.preload(mobile.props.src, {
        as: "image",
        imageSrcSet: mobile.props.srcSet,
        imageSizes: mobile.props.sizes,
        fetchPriority: "high",
        media: "(max-width: 767px)",
      });
    }
  }

  const textBlockAlignment =
    align === "physical-left" ? (locale === "ar" ? "text-right" : "text-left") : "text-start";
  const textBlockPosition = align === "physical-left" ? "mr-auto" : "me-auto";

  return (
    <>
      {breadcrumb && breadcrumb.length > 0 ? (
        <section className="mx-auto max-w-desktop px-space-3 py-space-3 text-small text-(--color-text-secondary)">
          {breadcrumb.map((crumb) => (
            <span key={crumb.href}>
              <Link href={crumb.href} className="hover:text-(--color-primary)">
                {crumb.label}
              </Link>
              <span className="mx-space-1">/</span>
            </span>
          ))}
          {currentPageLabel ? <span>{currentPageLabel}</span> : null}
        </section>
      ) : null}

      <section className="relative isolate flex min-h-[480px] items-end overflow-hidden pb-space-6 tablet:min-h-[560px] tablet:items-center tablet:pb-0 desktop:aspect-[21/9] desktop:min-h-0">
        {mobile ? (
          <picture>
            <source media="(min-width: 768px)" srcSet={desktop.props.srcSet} />
            <img
              {...mobile.props}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </picture>
        ) : (
          <picture>
            <img
              {...desktop.props}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: imagePosition }}
            />
          </picture>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent tablet:bg-gradient-to-r tablet:from-black/60 tablet:via-black/25 tablet:to-transparent"
        />

        <div className="relative z-10 mx-auto w-full max-w-desktop px-space-3 py-space-7 tablet:py-space-8">
          <div className={`hero-fade-up ${textBlockPosition} max-w-xl ${textBlockAlignment}`}>
            {eyebrow ? (
              <p className="text-small font-semibold uppercase tracking-wide text-white/90">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-space-2 text-display font-bold leading-[1.05] text-white">{title}</h1>
            {phone ? (
              <a
                href={phone.href}
                dir="ltr"
                className="mt-space-2 inline-flex items-center gap-space-1 text-h6 font-bold text-white transition-opacity hover:opacity-80"
              >
                <PhoneIcon className="h-5 w-5 shrink-0" />
                {phone.display}
              </a>
            ) : null}
            {description ? (
              <p className="mt-space-3 max-w-2xl text-lead text-white/85">{description}</p>
            ) : null}

            {primaryCta || secondaryCta ? (
              <div className="mt-space-5 flex flex-col gap-space-3">
                {primaryCta ? (
                  <Button
                    href={primaryCta.href}
                    variant="primary"
                    icon={primaryCta.icon !== "none" ? ArrowRightIconRtl : undefined}
                  >
                    {primaryCta.label}
                  </Button>
                ) : null}
                {secondaryCta || tertiaryCta ? (
                  <div className="flex flex-wrap gap-space-2">
                    {[secondaryCta, tertiaryCta]
                      .filter((cta): cta is UnifiedHeroCta => Boolean(cta))
                      .map((cta) => {
                        const Icon = cta.icon && cta.icon !== "none" ? CTA_ICONS[cta.icon] : undefined;
                        return (
                          <Button
                            key={cta.href}
                            href={cta.href}
                            external={cta.external}
                            variant="secondary-inverted"
                            size="sm"
                            icon={Icon}
                          >
                            {cta.label}
                          </Button>
                        );
                      })}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
