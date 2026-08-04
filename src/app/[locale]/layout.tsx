import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cairo, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { isLocale, localeDirection, locales, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileCtaBar } from "@/components/mobile-cta-bar";
import { ConsentBanner } from "@/components/consent-banner";
import { GoogleTagManager } from "@/components/google-tag-manager";
import { AnnouncementBar } from "@/components/announcement-bar";
import { ClickTracking } from "@/components/click-tracking";
import { COMPANY_NAME, SITE_URL } from "@/lib/brand/links";

import { ChatWidgetLoader } from "@/components/chat/chat-widget-loader";

/**
 * ChatWidgetLoader is client-only and code-splits the actual widget
 * (next/dynamic, ssr:false, inside that client component — see its own
 * file for why it can't live directly here) so the chat widget never
 * affects server render time or the initial page's JS payload. Kill
 * switch: set NEXT_PUBLIC_CHAT_WIDGET_ENABLED=false (requires a rebuild,
 * same as any NEXT_PUBLIC_ var) to pull it from every page without
 * touching this file again.
 */
const CHAT_WIDGET_ENABLED = process.env.NEXT_PUBLIC_CHAT_WIDGET_ENABLED !== "false";
import {
  HOMEPAGE_HERO_ALT,
  HOMEPAGE_HERO_DIMENSIONS,
  HOMEPAGE_HERO_SRC,
} from "@/lib/media/homepage-hero";

/**
 * Google Consent Mode v2 default signal (2026-08-04). Google's documented
 * default-denied baseline for the 4 core measurement/ads categories,
 * defining a minimal `window.gtag` stub that only pushes a plain object
 * into `window.dataLayer` — no cookie is written, no network request is
 * made, nothing is collected. Safe to run unconditionally, before any
 * consent decision exists, which is exactly what Consent Mode v2
 * requires: the default signal must be in place before a Google tag
 * could ever read it. This does NOT itself load gtm.js or grant
 * anything — GoogleTagManager's own consent gate (unchanged) is still
 * what decides whether gtm.js ever loads at all. `window.gtag ||=` so
 * the real gtag.js loaded later (inside the GTM container, once consent
 * is granted) reuses this same queue instead of overwriting it. Lives
 * here, not inside GoogleTagManager itself, because `beforeInteractive`
 * is only valid directly in the App Router root layout, not in a nested
 * client component (`@next/next/no-before-interactive-script-outside-document`).
 */
const CONSENT_MODE_DEFAULT_SNIPPET = `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
window.gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied'
});
`;

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Safari/mobile browser-chrome color (Search Engine Ecosystem pass,
 * 2026-08-04) — same approved brand navy already used in manifest.ts's
 * PWA `theme_color`, no new value invented. Next.js requires this as a
 * separate `viewport` export (not part of `metadata`) since it moved out
 * of the metadata object in recent versions.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f4c81",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://afaqalhayatae.com"),
  title: "AFAQ AL HAYAT",
  // Fallback only — every public page (home, about, services, contact,
  // etc.) sets its own generateMetadata and overrides this. Kept as a
  // real, professional sentence rather than an internal/build-status
  // note, in case any route is ever missed (2026-08-06 launch-prep pass).
  description: "AFAQ AL HAYAT — maintenance, cleaning, and pest control services across the UAE.",
  // Site-wide fallback social preview (Phase 1 identity readiness pass) —
  // any page that sets its own `openGraph`/`twitter` via generateMetadata
  // (e.g. the homepage, blog articles) overrides this wholesale; every
  // other page now at least shares a real, approved image instead of none.
  openGraph: {
    siteName: COMPANY_NAME,
    title: "AFAQ AL HAYAT",
    description: "AFAQ AL HAYAT — maintenance, cleaning, and pest control services across the UAE.",
    url: SITE_URL,
    images: [
      {
        url: HOMEPAGE_HERO_SRC,
        width: HOMEPAGE_HERO_DIMENSIONS.width,
        height: HOMEPAGE_HERO_DIMENSIONS.height,
        alt: HOMEPAGE_HERO_ALT.en,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    // Real, already-approved account (SOCIAL_LINKS in lib/brand/links.ts:
    // https://x.com/afaqalhayat1) — not a new fact, just referenced here
    // too so Twitter/X attributes card impressions to the right account.
    site: "@afaqalhayat1",
    title: "AFAQ AL HAYAT",
    description: "AFAQ AL HAYAT — maintenance, cleaning, and pest control services across the UAE.",
    images: [HOMEPAGE_HERO_SRC],
  },
  // Renders each verification meta tag only once the owner supplies the
  // real code for that engine — same pattern as GOOGLE_SITE_VERIFICATION
  // already established (JOB-AGT-WEB-20260726-M4.6), extended 2026-08-04
  // (Search Engine Ecosystem pass) to Bing (`msvalidate.01`) and Pinterest
  // (`p:domain_verify`) domain verification. All three unset today, so
  // nothing renders — no code is invented here, only the readiness.
  ...buildVerificationMetadata(),
};

function buildVerificationMetadata(): Pick<Metadata, "verification"> {
  const google = process.env.GOOGLE_SITE_VERIFICATION;
  const bing = process.env.BING_SITE_VERIFICATION;
  const pinterest = process.env.PINTEREST_DOMAIN_VERIFICATION;

  if (!google && !bing && !pinterest) return {};

  return {
    verification: {
      ...(google ? { google } : {}),
      ...(bing || pinterest
        ? {
            other: {
              ...(bing ? { "msvalidate.01": bing } : {}),
              ...(pinterest ? { "p:domain_verify": pinterest } : {}),
            },
          }
        : {}),
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const t = getMessages(typedLocale);

  return (
    <html
      lang={typedLocale}
      dir={localeDirection[typedLocale]}
      className={`${cairo.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {process.env.NEXT_PUBLIC_GTM_CONTAINER_ID ? (
          <Script id="consent-mode-default" strategy="beforeInteractive">
            {CONSENT_MODE_DEFAULT_SNIPPET}
          </Script>
        ) : null}
        {/*
         * Skip-to-content link (Production Readiness pass, 2026-08-04 —
         * WCAG 2.4.1 Bypass Blocks). First focusable element on every
         * page, invisible until a keyboard user tabs to it, then jumps
         * straight past the announcement bar/header/nav repeated on
         * every page to #main-content below.
         */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50 focus:rounded-xl focus:bg-(--color-primary) focus:px-space-3 focus:py-space-2 focus:text-small focus:font-semibold focus:text-(--color-surface)"
        >
          {t.common.skipToContent}
        </a>
        <GoogleTagManager />
        <ClickTracking />
        <AnnouncementBar locale={typedLocale} t={t} />
        <Header locale={typedLocale} t={t} />
        <main id="main-content" className="flex-1 pb-20 desktop:pb-0">{children}</main>
        <Footer locale={typedLocale} t={t} />
        <MobileCtaBar locale={typedLocale} t={t} />
        <ConsentBanner t={t} />
        {CHAT_WIDGET_ENABLED ? <ChatWidgetLoader locale={typedLocale} /> : null}
      </body>
    </html>
  );
}
