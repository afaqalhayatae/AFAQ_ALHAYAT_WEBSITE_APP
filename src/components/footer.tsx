import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { getMessages } from "@/i18n/get-messages";

type Messages = ReturnType<typeof getMessages>;

const QUICK_LINKS: { key: keyof Messages["nav"]; href: string }[] = [
  { key: "home", href: "" },
  { key: "services", href: "/services" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
];

export function Footer({ locale, t }: { locale: Locale; t: Messages }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-(--color-border) bg-(--color-surface-secondary)">
      <div className="mx-auto grid max-w-desktop gap-space-4 px-space-3 py-space-6 tablet:grid-cols-3">
        <div>
          <p className="text-h6 font-bold text-(--color-primary)">AFAQ Alhayat</p>
          <p className="mt-space-2 text-small text-(--color-text-secondary)">{t.footer.tagline}</p>
        </div>

        <div>
          <p className="text-small font-semibold text-(--color-text-primary)">{t.footer.quickLinks}</p>
          <ul className="mt-space-2 flex flex-col gap-space-1">
            {QUICK_LINKS.map((link) => (
              <li key={link.key}>
                <Link
                  href={`/${locale}${link.href}`}
                  className="text-small text-(--color-text-secondary) hover:text-(--color-primary)"
                >
                  {t.nav[link.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-small font-semibold text-(--color-text-primary)">{t.footer.contact}</p>
          <ul className="mt-space-2 flex flex-col gap-space-1 text-small text-(--color-text-secondary)">
            <li>{t.contact.info.phone}</li>
            <li>{t.contact.info.whatsapp}</li>
            <li>{t.contact.info.email}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-(--color-border) px-space-3 py-space-2 text-center text-small text-(--color-text-muted)">
        © {year} AFAQ Alhayat. {t.footer.rights}
      </div>
    </footer>
  );
}
