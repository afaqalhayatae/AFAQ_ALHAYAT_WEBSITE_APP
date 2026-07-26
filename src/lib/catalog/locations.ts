/**
 * Canonical location registry (JOB-AGT-WEB-20260726-M4.1).
 * Mirrors AFAQ_ALHAYAT_ENTERPRISE_KNOWLEDGE/03_MARKET/SERVICE_AREAS.md —
 * only emirate-level entries with approved coverage claims belong here.
 * Tier 1 (community-level) entries are intentionally omitted until their
 * own review checklist clears; adding one later is a one-line addition,
 * no route changes required.
 */

export type LocationEntry = {
  id: string;
  slug: string;
  indexable: boolean;
};

export const LOCATIONS: LocationEntry[] = [{ id: "LOC-AE-DU", slug: "dubai", indexable: true }];

export function getLocationBySlug(slug: string): LocationEntry | undefined {
  return LOCATIONS.find((location) => location.slug === slug);
}
