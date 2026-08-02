import { getServiceSection } from "./service-sections";
import { getCityServiceContent, getCitySectionContent } from "./city-content";

/**
 * Canonical URL Architecture Finalization (JOB-AGT-WEB-20260730). The
 * owner-approved canonical pattern for "this service, in this city" is
 * `/services/{section}/{slug}/{city}` — but CITY_SERVICE_CONTENT /
 * CITY_SECTION_CONTENT (city-content.ts) are still empty registries
 * (structure-only phase, no SEO content written yet), so that pattern
 * 404s for every combo today. This resolver is the single source of
 * truth every internal link, the legacy route's redirect, and (later) a
 * chatbot go through: it returns the new canonical path the moment real
 * content exists for that combo, and the legacy `/services/{slug}/
 * {city}` path otherwise — which always exists for any active service +
 * LOCATIONS combo, so a caller never links to (or redirects to) a route
 * that would 404.
 *
 * Pest Control is special-cased per service-sections.ts: "pest-control"
 * is the whole-category slug (not one of its 11 sub-services), so it
 * has no per-service page under the new pattern — its closest canonical
 * equivalent is the section-city page (`/services/pest-control/city/
 * {city}`), used only once that page has real content too.
 */
export function resolveServiceCityPath(serviceSlug: string, citySlug: string): string {
  const legacyPath = `services/${serviceSlug}/${citySlug}`;
  const section = getServiceSection(serviceSlug);
  if (!section) return legacyPath;

  if (section === "pest-control") {
    return getCitySectionContent("pest-control", citySlug)
      ? `services/pest-control/city/${citySlug}`
      : legacyPath;
  }

  return getCityServiceContent(serviceSlug, citySlug)
    ? `services/${section}/${serviceSlug}/${citySlug}`
    : legacyPath;
}
