/**
 * Canonical, language-agnostic brand URLs (JOB-AGT-WEB-20260726-M3).
 * Owner-approved source of truth — do not duplicate these into i18n messages.
 */

export const COMPANY_NAME = "AFAQ AL HAYAT";

export const WHATSAPP_URL = "https://wa.me/message/JMZVJDFDQL3VD1";
export const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/jeLNXvJB9fV8JxPG7";

export const PHONE_E164 = "+971585431766";
/** Human-readable, spaced form of PHONE_E164 for visible on-page display
 *  (e.g. next to a page's H1) — same number, same source, just formatted
 *  for reading rather than for a tel: href. */
export const PHONE_DISPLAY = "+971 58 543 1766";
export const EMAIL = "Info@afaqalhayatae.com";
export const SITE_URL = "https://afaqalhayatae.com";
/** Owner-approved (LOCAL_SEO_PROFILE.md, 2026-07-27) — English form for schema.org use. */
export const ADDRESS_EN = "Dubai - Oud Metha, Um Hurair Street - Al Makhawi Center";

export type SocialLink = {
  name: string;
  href: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  { name: "Facebook", href: "https://www.facebook.com/aafaqalhayat/" },
  { name: "Instagram", href: "https://www.instagram.com/afaq_alhayat" },
  { name: "TikTok", href: "https://www.tiktok.com/@afaq.alhayat" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/afaq-al-hayat/" },
  { name: "X", href: "https://x.com/afaqalhayat1" },
  { name: "Pinterest", href: "https://pin.it/1Ev0TVeKL" },
  { name: "Threads", href: "https://www.threads.com/@afaq_alhayat" },
  { name: "YouTube", href: "https://www.youtube.com/@afaqalhayatae" },
];
