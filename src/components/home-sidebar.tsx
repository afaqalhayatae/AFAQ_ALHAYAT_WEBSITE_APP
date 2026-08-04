import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getMessages, getServiceEntry } from "@/i18n/get-messages";
import { ClockIcon, HomeIcon, MapPinIcon, PhoneIcon, ShieldCheckIcon, WhatsAppIcon } from "./icons";
import { PHONE_E164, WHATSAPP_URL } from "@/lib/brand/links";
import { POPULAR_SERVICE_SLUGS } from "@/lib/catalog/blog";
import { getServiceBySlug } from "@/lib/catalog/services";
import { getServiceSection } from "@/lib/catalog/service-sections";
import { SERVICE_ICONS } from "@/lib/catalog/service-visuals";
import { ALL_EMIRATES } from "@/lib/catalog/locations";

type Messages = ReturnType<typeof getMessages>;

/**
 * Homepage floating sidebar (Owner-requested, 2026-08-04). Desktop-only —
 * `hidden desktop:flex`, `position: fixed` so it stays in view while
 * scrolling the long homepage without requiring any change to that
 * page's existing section layout (purely additive: one new sibling
 * element, nothing else on the page touched). `end-6` (logical, not
 * `right-6`) so it sits at the trailing edge in both English LTR and
 * Arabic RTL automatically, matching how every other fixed/positioned
 * element in this codebase already handles direction.
 *
 * Mobile is deliberately NOT duplicated here: MobileCtaBar
 * (src/components/mobile-cta-bar.tsx) already renders a fixed bottom
 * action bar with phone/WhatsApp/booking on every page, including the
 * homepage — adding a second fixed bottom bar specific to this page
 * would stack two competing bars in the same screen region. Services,
 * emirates, and trust content remain reachable on mobile through the
 * homepage's own existing sections further down the page.
 *
 * Content sourcing, not invented for this component:
 * - Services: the same POPULAR_SERVICE_SLUGS curation blog-sidebar.tsx
 *   already uses for "popular services" — one curated list, not a
 *   second, differently-chosen one.
 * - Emirates: ALL_EMIRATES, same hasPage-gated safe-link pattern
 *   already used in the homepage's own "areas" section and
 *   locations/[slug]/page.tsx.
 * - Trust facts: "24/7" and "UAE-wide, 7 emirates" are the same
 *   Owner-approved facts already live in CONTACT_INFORMATION.md and
 *   this page's own t.home.trust section — restated compactly here,
 *   not new claims.
 *
 * URLs use the real canonical `/services/{section}/{slug}` pattern
 * (getServiceSection), not the legacy flat `/services/{slug}` pattern
 * blog-sidebar.tsx still uses — URL_AND_LINKING_AUDIT.md already
 * flagged that as a real, unfixed redirect-hop bug; not repeated here.
 */
export function HomeSidebar({ locale, t }: { locale: Locale; t: Messages }) {
  const services = POPULAR_SERVICE_SLUGS.map((slug) => getServiceBySlug(slug)).filter(
    (service) => service !== undefined
  );

  return (
    <aside
      aria-label={t.homeSidebar.quickActions}
      className="fixed top-1/2 end-6 z-20 hidden max-h-[calc(100vh-6rem)] w-72 -translate-y-1/2 flex-col gap-space-3 overflow-y-auto rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-4 shadow-xl shadow-black/10 desktop:flex"
    >
      {/* CTAs */}
      <div className="flex flex-col gap-space-2">
        <Link
          href={`/${locale}/book`}
          className="flex h-12 items-center justify-center rounded-xl bg-(--color-primary) px-space-3 text-small font-semibold text-(--color-surface) transition-opacity hover:opacity-90"
        >
          {t.home.booking.button}
        </Link>
        <div className="flex gap-space-2">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.common.whatsappCta}
            className="flex h-11 flex-1 items-center justify-center gap-space-1 rounded-xl bg-(--color-whatsapp) text-small font-semibold text-white transition-opacity hover:opacity-90"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
          <a
            href={`tel:${PHONE_E164}`}
            aria-label={t.common.callNow}
            className="flex h-11 flex-1 items-center justify-center gap-space-1 rounded-xl border border-(--color-border) text-small font-semibold text-(--color-text-primary) transition-colors hover:border-(--color-primary) hover:text-(--color-primary)"
          >
            <PhoneIcon className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* Trust indicators — compact, real approved facts only */}
      <div className="grid grid-cols-2 gap-space-2 border-y border-(--color-border) py-space-3">
        <div className="flex items-center gap-space-1 text-small text-(--color-text-secondary)">
          <ClockIcon className="h-4 w-4 shrink-0 text-(--color-primary)" />
          <span>{t.homeSidebar.trustAvailability}</span>
        </div>
        <div className="flex items-center gap-space-1 text-small text-(--color-text-secondary)">
          <ShieldCheckIcon className="h-4 w-4 shrink-0 text-(--color-primary)" />
          <span>{t.homeSidebar.trustCoverage}</span>
        </div>
      </div>

      {/* Main service links */}
      {services.length > 0 ? (
        <nav aria-label={t.homeSidebar.popularServices}>
          <p className="text-small font-semibold text-(--color-text-primary)">
            {t.homeSidebar.popularServices}
          </p>
          <ul className="mt-space-2 flex flex-col gap-space-1">
            {services.map((service) => {
              const entry = getServiceEntry(t, service.slug);
              const ServiceIcon = SERVICE_ICONS[service.slug] ?? HomeIcon;
              const section = getServiceSection(service.slug);
              // pest-control is special-cased sitewide (service-sections.ts):
              // it's both a service slug and its own section name, so its
              // real hub page is /services/pest-control directly — not
              // /services/pest-control/pest-control, which every other
              // service's /services/{section}/{slug} pattern would produce.
              const href =
                service.slug === "pest-control"
                  ? `/${locale}/services/pest-control`
                  : section
                    ? `/${locale}/services/${section}/${service.slug}`
                    : `/${locale}/services`;
              return (
                <li key={service.slug}>
                  <Link
                    href={href}
                    className="flex items-center gap-space-2 text-small text-(--color-text-secondary) hover:text-(--color-primary)"
                  >
                    <ServiceIcon className="h-4 w-4 shrink-0 text-(--color-primary)" />
                    {entry.name}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href={`/${locale}/services`}
            className="mt-space-2 inline-block text-small font-semibold text-(--color-primary) hover:underline"
          >
            {t.homeSidebar.allServices}
          </Link>
        </nav>
      ) : null}

      {/* UAE emirates links */}
      <nav aria-label={t.homeSidebar.coverageTitle}>
        <p className="text-small font-semibold text-(--color-text-primary)">
          {t.homeSidebar.coverageTitle}
        </p>
        <ul className="mt-space-2 flex flex-wrap gap-space-1">
          {ALL_EMIRATES.map((emirate) => (
            <li key={emirate.id}>
              <Link
                href={emirate.hasPage ? `/${locale}/locations/${emirate.slug}` : `/${locale}/locations`}
                className="flex items-center gap-space-1 rounded-full border border-(--color-border) px-space-2 py-1 text-small text-(--color-text-secondary) transition-colors hover:border-(--color-primary) hover:text-(--color-primary)"
              >
                <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
                {emirate.name[locale]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
