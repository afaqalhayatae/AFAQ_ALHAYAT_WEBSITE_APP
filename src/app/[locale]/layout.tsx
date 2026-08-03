import type { Metadata } from "next";
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
import {
  HOMEPAGE_HERO_ALT,
  HOMEPAGE_HERO_DIMENSIONS,
  HOMEPAGE_HERO_SRC,
} from "@/lib/media/homepage-hero";

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
    title: "AFAQ AL HAYAT",
    description: "AFAQ AL HAYAT — maintenance, cleaning, and pest control services across the UAE.",
    images: [HOMEPAGE_HERO_SRC],
  },
  // Renders <meta name="google-site-verification"> only once the owner
  // supplies a real Search Console verification code (JOB-AGT-WEB-20260726-M4.6)
  // — see docs/google-ecosystem-setup.md. Absent today, so nothing renders.
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

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
        <GoogleTagManager />
        <ClickTracking />
        <AnnouncementBar locale={typedLocale} t={t} />
        <Header locale={typedLocale} t={t} />
        <main className="flex-1 pb-20 desktop:pb-0">{children}</main>
        <Footer locale={typedLocale} t={t} />
        <MobileCtaBar locale={typedLocale} t={t} />
        <ConsentBanner t={t} />
      </body>
    </html>
  );
}
