import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";

/**
 * hreflang/canonical builder (JOB-AGT-WEB-20260726-M4.1). `path` is
 * locale-agnostic and leading-slash-free, e.g. "services/ac-maintenance".
 * Resolves against `metadataBase` (set in the root layout) via the
 * relative canonical/language paths below.
 */
export function buildAlternates(locale: Locale, path: string): Metadata["alternates"] {
  const suffix = path ? `/${path}` : "";
  const languages = Object.fromEntries(
    locales.map((candidate) => [candidate, `/${candidate}${suffix}`])
  );

  return {
    canonical: `/${locale}${suffix}`,
    languages,
  };
}

/** noindex,follow — for architecture-only pages with no approved content yet. */
export const NOINDEX_FOLLOW: Metadata["robots"] = {
  index: false,
  follow: true,
};
