import Image from "next/image";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import type { Locale } from "@/i18n/config";
import type { getMessages } from "@/i18n/get-messages";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  PinterestIcon,
  ThreadsIcon,
  TikTokIcon,
  WhatsAppIcon,
  XIcon,
  YouTubeIcon,
} from "./icons";
import { GOOGLE_MAPS_URL, PHONE_E164, SOCIAL_LINKS, WHATSAPP_URL } from "@/lib/brand/links";

type Messages = ReturnType<typeof getMessages>;

const QUICK_LINKS: { key: keyof Messages["nav"] & string; href: string }[] = [
  { key: "home", href: "" },
  { key: "services", href: "/services" },
  { key: "locations", href: "/locations" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
];

const SOCIAL_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
  LinkedIn: LinkedInIcon,
  X: XIcon,
  Pinterest: PinterestIcon,
  Threads: ThreadsIcon,
  YouTube: YouTubeIcon,
};

export function Footer({ locale, t }: { locale: Locale; t: Messages }) {
  const year = new Date().getFullYear();
  const wordmark = locale === "ar" ? "آفاق الحياة" : "AFAQ AL HAYAT";

  return (
    <footer className="border-t border-(--color-border) bg-(--color-surface-secondary)">
      <div className="mx-auto grid max-w-desktop gap-space-5 px-space-3 py-space-6 tablet:grid-cols-3">
        <div>
          <Link href={`/${locale}`} className="flex items-center gap-space-2">
            <Image src="/brand/logo-mark.png" alt={wordmark} width={64} height={64} className="h-16 w-16" />
            <span className="text-h5 font-bold text-(--color-primary)">{wordmark}</span>
          </Link>
          <p className="mt-space-3 max-w-xs text-small text-(--color-text-secondary)">
            {t.footer.tagline}
          </p>
          <div className="mt-space-3 flex items-center gap-space-1">
            {SOCIAL_LINKS.map((social) => {
              const SocialIcon = SOCIAL_ICONS[social.name];
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-(--color-border) text-(--color-text-secondary) transition-colors hover:border-(--color-primary) hover:text-(--color-primary)"
                >
                  <SocialIcon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
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
          <ul className="mt-space-2 flex flex-col gap-space-2 text-small text-(--color-text-secondary)">
            <li>
              <a
                href={`tel:${PHONE_E164}`}
                className="flex items-center gap-space-1 hover:text-(--color-primary)"
              >
                <PhoneIcon className="h-4 w-4 shrink-0" />
                <span dir="ltr">{t.contact.info.phone}</span>
              </a>
            </li>
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-space-1 hover:text-(--color-primary)"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0" />
                {t.common.whatsappCta}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${t.contact.info.email}`}
                className="flex items-center gap-space-1 hover:text-(--color-primary)"
              >
                <MailIcon className="h-4 w-4 shrink-0" />
                <span dir="ltr">{t.contact.info.email}</span>
              </a>
            </li>
            <li className="flex items-start gap-space-1">
              <MapPinIcon className="h-4 w-4 shrink-0 translate-y-0.5" />
              <span>{t.footer.address}</span>
            </li>
          </ul>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-space-3 inline-flex items-center gap-space-1 rounded-xl border border-(--color-primary) px-space-2 py-space-1 text-small font-semibold text-(--color-primary) transition-colors hover:bg-(--color-primary) hover:text-(--color-surface)"
          >
            <MapPinIcon className="h-4 w-4" />
            {t.footer.viewOnMap}
          </a>
        </div>
      </div>

      <div className="border-t border-(--color-border) px-space-3 py-space-2 text-center text-small text-(--color-text-muted)">
        © {year} {wordmark}. {t.footer.rights}
      </div>
    </footer>
  );
}
