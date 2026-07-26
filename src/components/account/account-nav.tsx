"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { getMessages } from "@/i18n/get-messages";

type Messages = ReturnType<typeof getMessages>;

const NAV_ITEMS: { key: keyof Messages["account"]["nav"]; href: string }[] = [
  { key: "overview", href: "" },
  { key: "profile", href: "/profile" },
  { key: "requests", href: "/requests" },
  { key: "bookings", href: "/bookings" },
  { key: "quotes", href: "/quotes" },
];

export function AccountNav({ locale, t }: { locale: Locale; t: Messages }) {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = `/${locale}`;
  }

  return (
    <nav
      aria-label={t.account.nav.overview}
      className="flex flex-row flex-wrap gap-space-2 border-b border-(--color-border) pb-space-3 tablet:w-56 tablet:shrink-0 tablet:flex-col tablet:border-b-0 tablet:border-e tablet:pb-0 tablet:pe-space-3"
    >
      {NAV_ITEMS.map((item) => {
        const href = `/${locale}/account${item.href}`;
        const isActive = pathname === href;
        return (
          <Link
            key={item.key}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-md px-space-2 py-space-1 text-small font-medium ${
              isActive
                ? "bg-(--color-surface-secondary) text-(--color-primary)"
                : "text-(--color-text-secondary) hover:text-(--color-primary)"
            }`}
          >
            {t.account.nav[item.key]}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-md px-space-2 py-space-1 text-start text-small font-medium text-(--color-danger)"
      >
        {t.account.nav.logout}
      </button>
    </nav>
  );
}
