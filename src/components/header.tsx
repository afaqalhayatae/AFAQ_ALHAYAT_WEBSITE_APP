"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { getMessages } from "@/i18n/get-messages";
import { LanguageSwitcher } from "./language-switcher";

type Messages = ReturnType<typeof getMessages>;

const NAV_ITEMS: { key: keyof Messages["nav"]; href: string }[] = [
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

  return (
    <header className="sticky top-0 z-40 border-b border-(--color-border) bg-(--color-surface)">
      <div className="mx-auto flex max-w-desktop items-center justify-between gap-space-3 px-space-3 py-space-2">
        <Link
          href={`/${locale}`}
          className="text-h6 font-bold text-(--color-primary)"
          onClick={() => setMenuOpen(false)}
        >
          AFAQ Alhayat
        </Link>

        <nav className="hidden items-center gap-space-4 tablet:flex" aria-label={t.common.menu}>
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
          <LanguageSwitcher locale={locale} label={t.common.language} />
          <button
            type="button"
            className="text-(--color-text-primary) tablet:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t.common.closeMenu : t.common.menu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          className="border-t border-(--color-border) px-space-3 py-space-2 tablet:hidden"
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
        </nav>
      ) : null}
    </header>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
    </svg>
  );
}
