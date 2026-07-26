import type { Metadata } from "next";
import { Inter, Noto_Kufi_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { isLocale, localeDirection, locales, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileCtaBar } from "@/components/mobile-cta-bar";

const notoKufiArabic = Noto_Kufi_Arabic({
  variable: "--font-noto-kufi-arabic",
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
  title: "AFAQ Alhayat",
  description: "Structural application foundation. Content pending publication.",
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
      className={`${notoKufiArabic.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header locale={typedLocale} t={t} />
        <main className="flex-1 pb-20 desktop:pb-0">{children}</main>
        <Footer locale={typedLocale} t={t} />
        <MobileCtaBar locale={typedLocale} t={t} />
      </body>
    </html>
  );
}
