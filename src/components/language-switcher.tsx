"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

type LanguageSwitcherProps = {
  locale: Locale;
  label: string;
};

export function LanguageSwitcher({ locale, label }: LanguageSwitcherProps) {
  const pathname = usePathname() ?? `/${locale}`;
  const segments = pathname.split("/");

  return (
    <div className="flex items-center gap-space-1 text-small" aria-label={label}>
      {locales.map((candidate) => {
        const isActive = candidate === locale;
        const nextSegments = [...segments];
        nextSegments[1] = candidate;
        const href = nextSegments.join("/") || `/${candidate}`;

        return (
          <Link
            key={candidate}
            href={href}
            aria-current={isActive ? "true" : undefined}
            className={`flex h-10 min-w-10 items-center justify-center rounded px-space-1 uppercase ${
              isActive
                ? "font-semibold text-(--color-primary)"
                : "text-(--color-text-muted) hover:text-(--color-primary)"
            }`}
          >
            {candidate}
          </Link>
        );
      })}
    </div>
  );
}
