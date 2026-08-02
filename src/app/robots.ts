import type { MetadataRoute } from "next";

const SITE_URL = "https://afaqalhayatae.com";

/**
 * Environment-aware per 05_SEO_IMPLEMENTATION_PLAN.md §1's Robots.txt
 * row: "staging disallows all; production allows per publishable route
 * set." No staging environment or hosting platform is confirmed yet
 * (Hostinger deployment remains an open, Owner-gated item — see
 * docs/hostinger-migration-runbook.md), so this defaults to the safe
 * side — disallow everything — unless NODE_ENV is explicitly
 * "production", matching how every other environment (local dev, CI,
 * any future staging deploy) should behave until a real production
 * launch is authorized.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    return {
      rules: { userAgent: "*", disallow: "/" },
      sitemap: `${SITE_URL}/sitemap.xml`,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Account/auth areas and API routes are functional, not
        // content — never crawlable, on production or otherwise.
        disallow: ["/api/", "/*/login", "/*/register", "/*/account"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
