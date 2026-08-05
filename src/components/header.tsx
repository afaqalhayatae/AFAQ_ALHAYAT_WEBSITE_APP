"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { getMessages } from "@/i18n/get-messages";
import { LanguageSwitcher } from "./language-switcher";
import { CleaningIcon, PestIcon, PhoneIcon, WhatsAppIcon, WrenchIcon } from "./icons";
import { Button, IconButton } from "./ui/button";
// Lucide for UI controls (Homepage Foundation Alignment) — menu toggle
// and account icon are interface chrome, not brand/marketing imagery,
// so per the approved icon-system split they come from Lucide; the
// WhatsApp mark above stays a real brand logo, not a UI control.
import { ChevronDown, Menu, User, X } from "lucide-react";
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

// Services mega-menu entries — the same 3 real section hubs
// (maintenance/cleaning/pest-control) and copy already used on
// services/page.tsx and the homepage's own category cards, not new
// content invented for this menu.
const SERVICE_SECTIONS = [
  { id: "maintenance", href: "/services/maintenance", Icon: WrenchIcon },
  { id: "cleaning", href: "/services/cleaning", Icon: CleaningIcon },
  { id: "pest-control", href: "/services/pest-control", Icon: PestIcon },
] as const;

export function Header({ locale, t }: { locale: Locale; t: Messages }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const headerRef = useRef<HTMLElement>(null);

  // Close the mobile menu on route change — adjusting state during render
  // (rather than in an effect) per React's guidance for resetting state
  // when a prop changes: https://react.dev/learn/you-might-not-need-an-effect
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  const wordmark = locale === "ar" ? "آفاق الحياة" : "AFAQ AL HAYAT";

  // Shadow-on-scroll — a flat border reads fine at the very top of a page,
  // but once content scrolls underneath, a soft shadow separates the
  // sticky header from what's behind it instead of the two blending into
  // the backdrop-blur.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on outside click or Escape, and lock background scroll while
  // open — the mobile panel used to have none of these, so it stayed open
  // after tapping outside it and let the page scroll underneath it.
  useEffect(() => {
    if (!menuOpen) return;

    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onPointerDown = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 border-b border-(--color-border) bg-(--color-surface)/90 backdrop-blur-md transition-shadow duration-200 ${
        scrolled ? "shadow-md shadow-black/5" : ""
      }`}
    >
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
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            const linkClass = `relative flex items-center gap-1 py-1 text-small font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-center after:rounded-full after:bg-(--color-primary) after:transition-transform after:duration-200 ${
              isActive
                ? "text-(--color-primary) after:scale-x-100"
                : "text-(--color-text-secondary) after:scale-x-0 hover:text-(--color-primary) hover:after:scale-x-100"
            }`;

            if (item.key === "services") {
              return (
                <div key={item.key} className="group relative">
                  <Link href={href} aria-current={isActive ? "page" : undefined} className={linkClass}>
                    {t.nav[item.key]}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
                  </Link>
                  <div className="invisible absolute start-0 top-full origin-top translate-y-1 scale-95 pt-space-2 opacity-0 transition-all duration-200 ease-out group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100">
                    <div className="w-80 rounded-2xl border border-(--color-border) bg-(--color-surface) p-space-2 shadow-2xl shadow-black/10">
                      {SERVICE_SECTIONS.map(({ id, href: sectionHref, Icon }) => (
                        <Link
                          key={id}
                          href={`/${locale}${sectionHref}`}
                          className="flex items-start gap-space-2 rounded-xl p-space-2 transition-colors hover:bg-(--color-surface-secondary)"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-(--color-primary)/10 text-(--color-primary)">
                            <Icon className="h-5 w-5" />
                          </span>
                          <span>
                            <span className="block text-small font-semibold text-(--color-text-primary)">
                              {t.services.sections[id].name}
                            </span>
                            <span className="block text-small text-(--color-text-secondary)">
                              {t.services.sections[id].description}
                            </span>
                          </span>
                        </Link>
                      ))}
                      <Link
                        href={href}
                        className="mt-space-1 flex items-center justify-center rounded-xl border-t border-(--color-border) pt-space-2 text-small font-semibold text-(--color-primary) hover:underline"
                      >
                        {t.home.services.cta}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link key={item.key} href={href} aria-current={isActive ? "page" : undefined} className={linkClass}>
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
            <Button href={`/${locale}/book`} variant="primary">
              {t.common.requestService}
            </Button>
          </div>

          <LanguageSwitcher locale={locale} label={t.common.language} />

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-(--color-text-primary) transition-colors hover:bg-(--color-surface-secondary) desktop:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t.common.closeMenu : t.common.menu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-menu"
          className="mobile-menu-in max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-(--color-border) px-space-3 py-space-3 desktop:hidden"
          aria-label={t.common.menu}
        >
          <ul className="flex flex-col gap-space-1">
            {NAV_ITEMS.map((item) => {
              const href = `/${locale}${item.href}`;
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              const itemLinkClass = `block rounded-xl px-space-2 py-space-2 text-small font-medium transition-colors ${
                isActive
                  ? "bg-(--color-primary)/10 text-(--color-primary)"
                  : "text-(--color-text-secondary) hover:bg-(--color-surface-secondary) hover:text-(--color-primary)"
              }`;
              return (
                <li key={item.key}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={itemLinkClass}
                  >
                    {t.nav[item.key]}
                  </Link>
                  {item.key === "services" ? (
                    <ul className="ms-space-3 mt-space-1 flex flex-col gap-space-1 border-s border-(--color-border) ps-space-2">
                      {SERVICE_SECTIONS.map(({ id, href: sectionHref, Icon }) => (
                        <li key={id}>
                          <Link
                            href={`/${locale}${sectionHref}`}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-space-2 rounded-lg px-space-2 py-space-1 text-small text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-secondary) hover:text-(--color-primary)"
                          >
                            <Icon className="h-4 w-4 shrink-0 text-(--color-primary)" />
                            {t.services.sections[id].name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>

          <div className="mt-space-3 flex flex-col gap-space-2 border-t border-(--color-border) pt-space-3">
            <Link
              href={`/${locale}/account`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-space-2 rounded-xl px-space-2 py-space-2 text-small font-medium text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-secondary) hover:text-(--color-primary)"
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
              href={`/${locale}/book`}
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
