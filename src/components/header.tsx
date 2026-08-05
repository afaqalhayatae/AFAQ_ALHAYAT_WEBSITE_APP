"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { getMessages } from "@/i18n/get-messages";
import { LanguageSwitcher } from "./language-switcher";
import { PhoneIcon, WhatsAppIcon } from "./icons";
import { Button, IconButton } from "./ui/button";
// Lucide for UI controls (Homepage Foundation Alignment) — menu toggle
// and account icon are interface chrome, not brand/marketing imagery,
// so per the approved icon-system split they come from Lucide; the
// WhatsApp mark above stays a real brand logo, not a UI control.
import { Menu, User, X } from "lucide-react";
import { PHONE_E164, WHATSAPP_URL } from "@/lib/brand/links";

type Messages = ReturnType<typeof getMessages>;

const NAV_ITEMS: { key: keyof Messages["nav"] & string; href: string }[] = [
  { key: "home", href: "" },
  { key: "services", href: "/services" },
  { key: "locations", href: "/locations" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
  { key: "blog", href: "/blog" },
  { key: "faq", href: "/faq" },
];

export function Header({ locale, t }: { locale: Locale; t: Messages }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const wordmark = locale === "ar" ? "آفاق الحياة" : "AFAQ AL HAYAT";

  return (
    <header className="sticky top-0 z-40 border-b border-(--color-border) bg-(--color-surface)/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-desktop items-center justify-between gap-space-3 px-space-3 py-space-2">
        <Link
          href={`/${locale}`}
          className="flex shrink-0 items-center gap-space-1 transition-opacity hover:opacity-80"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/brand/logo-mark.png"
            alt={wordmark}
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <span className="text-h6 font-bold text-(--color-primary)">{wordmark}</span>
        </Link>

        <nav className="hidden items-center gap-space-4 desktop:flex" aria-label={t.common.menu}>
          {NAV_ITEMS.map((item) => {
            const href = `/${locale}${item.href}`;
            const isActive = pathname === href;
            return (
              <Link
                key={item.key}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`relative py-1 text-small font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-center after:rounded-full after:bg-(--color-primary) after:transition-transform after:duration-200 ${
                  isActive
                    ? "text-(--color-primary) after:scale-x-100"
                    : "text-(--color-text-secondary) after:scale-x-0 hover:text-(--color-primary) hover:after:scale-x-100"
                }`}
              >
                {t.nav[item.key]}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-space-2">
          <div className="hidden items-center gap-space-3 desktop:flex">
            <Link
              href={`/${locale}/account`}
              className="flex items-center gap-space-1 text-small font-medium text-(--color-text-secondary) transition-colors hover:text-(--color-primary)"
            >
              <User className="h-5 w-5" />
              {t.nav.account}
            </Link>
            <IconButton
              href={`tel:${PHONE_E164}`}
              icon={PhoneIcon}
              label={t.common.callNow}
              size="sm"
            />
            <IconButton
              href={WHATSAPP_URL}
              external
              icon={WhatsAppIcon}
              label={t.common.whatsappCta}
              variant="whatsapp"
              size="sm"
            />
            <Button href={`/${locale}/contact`} variant="primary">
              {t.common.requestService}
            </Button>
          </div>

          <LanguageSwitcher locale={locale} label={t.common.language} />

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center text-(--color-text-primary) desktop:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t.common.closeMenu : t.common.menu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          className="border-t border-(--color-border) px-space-3 py-space-3 desktop:hidden"
          aria-label={t.common.menu}
        >
          <ul className="flex flex-col gap-space-2">
            {NAV_ITEMS.map((item) => {
              const href = `/${locale}${item.href}`;
              return (
                <li key={item.key}>
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-space-1 text-small font-medium text-(--color-text-secondary)"
                  >
                    {t.nav[item.key]}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-space-3 flex flex-col gap-space-2 border-t border-(--color-border) pt-space-3">
            <Link
              href={`/${locale}/account`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-space-1 text-small font-medium text-(--color-text-secondary)"
            >
              <User className="h-5 w-5" />
              {t.nav.account}
            </Link>
            <Button href={`tel:${PHONE_E164}`} variant="primary" icon={PhoneIcon} className="w-full">
              {t.common.callNow}
            </Button>
            <Button
              href={WHATSAPP_URL}
              external
              variant="whatsapp"
              icon={WhatsAppIcon}
              className="w-full"
            >
              {t.common.whatsappCta}
            </Button>
            <Button
              href={`/${locale}/contact`}
              onClick={() => setMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              {t.common.requestService}
            </Button>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
