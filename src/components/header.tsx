"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { getMessages } from "@/i18n/get-messages";
import { LanguageSwitcher } from "./language-switcher";
import { MenuIcon, UserIcon, WhatsAppIcon } from "./icons";
import { WHATSAPP_URL } from "@/lib/brand/links";

type Messages = ReturnType<typeof getMessages>;

const NAV_ITEMS: { key: keyof Messages["nav"] & string; href: string }[] = [
  { key: "home", href: "" },
  { key: "services", href: "/services" },
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
    <header className="sticky top-0 z-40 border-b border-(--color-border) bg-(--color-surface)">
      <div className="mx-auto flex max-w-desktop items-center justify-between gap-space-3 px-space-3 py-space-2">
        <Link
          href={`/${locale}`}
          className="flex shrink-0 items-center gap-space-1"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/brand/logo-mark.png"
            alt={wordmark}
            width={40}
            height={40}
            priority
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
                className={`text-small font-medium transition-colors ${
                  isActive
                    ? "text-(--color-primary)"
                    : "text-(--color-text-secondary) hover:text-(--color-primary)"
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
              <UserIcon className="h-5 w-5" />
              {t.nav.account}
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.common.whatsappCta}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-(--color-whatsapp) text-white transition-opacity hover:opacity-90"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <Link
              href={`/${locale}/contact`}
              className="rounded-xl bg-(--color-primary) px-space-3 py-space-2 text-small font-semibold text-(--color-surface) transition-opacity hover:opacity-90"
            >
              {t.common.requestService}
            </Link>
          </div>

          <LanguageSwitcher locale={locale} label={t.common.language} />

          <button
            type="button"
            className="text-(--color-text-primary) desktop:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t.common.closeMenu : t.common.menu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MenuIcon open={menuOpen} className="h-6 w-6" />
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
                    className="block text-small font-medium text-(--color-text-secondary)"
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
              <UserIcon className="h-5 w-5" />
              {t.nav.account}
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-space-1 rounded-xl bg-(--color-whatsapp) px-space-3 py-space-2 text-small font-semibold text-white"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {t.common.whatsappCta}
            </a>
            <Link
              href={`/${locale}/contact`}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-(--color-primary) px-space-3 py-space-2 text-center text-small font-semibold text-(--color-surface)"
            >
              {t.common.requestService}
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
