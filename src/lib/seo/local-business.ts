import {
  ADDRESS_EN,
  COMPANY_NAME,
  EMAIL,
  GOOGLE_MAPS_URL,
  PHONE_E164,
  SITE_URL,
  SOCIAL_LINKS,
  WHATSAPP_URL,
} from "@/lib/brand/links";

/**
 * LocalBusiness JSON-LD for city-scoped service pages (2026-07-30 city-SEO
 * structure). Built only from already-approved brand facts (phone, map
 * link, company name) plus a page-specific name/area — no rating, review
 * count, address, or other claim that isn't already established elsewhere
 * in this codebase.
 */
export function buildLocalBusinessSchema({
  name,
  areaServed,
}: {
  name: string;
  areaServed: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    telephone: PHONE_E164,
    areaServed,
    hasMap: GOOGLE_MAPS_URL,
    parentOrganization: {
      "@type": "Organization",
      name: COMPANY_NAME,
    },
  };
}

/**
 * Sitewide Organization JSON-LD (Google Ecosystem Preparation pass,
 * 2026-08-04), rendered once on the homepage per 05_SEO_IMPLEMENTATION_
 * PLAN.md's schema requirements. Built only from facts Approved in
 * CONTACT_INFORMATION.md / LOCAL_SEO_PROFILE.md — no rating, review
 * count, founding date, or other unconfirmed claim. `sameAs` links only
 * the Approved social profile URLs already in SOCIAL_LINKS.
 */
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-mark.png`,
    telephone: PHONE_E164,
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS_EN,
      addressCountry: "AE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE_E164,
      contactType: "customer service",
      areaServed: "AE",
      availableLanguage: ["ar", "en"],
    },
    sameAs: [WHATSAPP_URL, GOOGLE_MAPS_URL, ...SOCIAL_LINKS.map((link) => link.href)],
  };
}
