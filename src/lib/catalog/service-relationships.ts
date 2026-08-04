/**
 * Confirmed service relationships — mirrors
 * AFAQ_ALHAYAT_ENTERPRISE_KNOWLEDGE/04_SERVICE_KNOWLEDGE/SERVICE_RELATIONSHIPS.md
 * exactly. Only `Confirmed` Cross-sell/Related/Dependency edges from that
 * document are included here — `Rejected`/`Dropped` candidates are
 * retained in the source document as a historical record but never
 * surfaced as a real relationship, and no edge is invented beyond what
 * that document confirms.
 *
 * This was previously computed nowhere in the app — every Content
 * Factory article this session cited these edges as "Related Service,"
 * but the live site never actually rendered them as internal links. This
 * file + the "Related Services" section in service-detail-content.tsx
 * close that gap.
 */
import { SERVICES } from "./services";

/** Bidirectional pairs are intentional — a real relationship is useful to
 * surface from either service's page, regardless of which direction
 * SERVICE_RELATIONSHIPS.md recorded the candidate from (e.g. "Cross-sell:
 * A → B" still means a visitor on B's page benefits from knowing about A). */
const CONFIRMED_EDGES: [string, string][] = [
  // Cross-sell (SERVICE_RELATIONSHIPS.md §2)
  ["SVC-PLUMBING", "SVC-WATER-TANK-CLEANING"],
  ["SVC-PEST-CONTROL", "SVC-DEEP-CLEANING"],
  ["SVC-PAINTING", "SVC-HANDYMAN"],
  ["SVC-PLUMBING", "SVC-DEEP-CLEANING"],
  ["SVC-AC-MAINTENANCE", "SVC-ELECTRICAL-MAINTENANCE"],
  ["SVC-PAINTING", "SVC-ELECTRICAL-MAINTENANCE"],
  // Dependency (SERVICE_RELATIONSHIPS.md §3, Confirmed only)
  ["SVC-WATER-LEAK-DETECTION", "SVC-PLUMBING"],
  ["SVC-WATER-LEAK-DETECTION", "SVC-WATERPROOFING"],
  // Related (SERVICE_RELATIONSHIPS.md §4)
  ["SVC-GENERAL-CLEANING", "SVC-DEEP-CLEANING"],
  ["SVC-GENERAL-CLEANING", "SVC-PEST-CONTROL"],
  ["SVC-DRAIN-UNBLOCKING", "SVC-PLUMBING"],
];

const RELATED_BY_ID: Map<string, string[]> = (() => {
  const map = new Map<string, string[]>();
  for (const [a, b] of CONFIRMED_EDGES) {
    map.set(a, [...(map.get(a) ?? []), b]);
    map.set(b, [...(map.get(b) ?? []), a]);
  }
  return map;
})();

/** Returns the related ServiceEntry objects for a given service id — only
 * services that actually exist in the current catalog, so a future
 * catalog change can't silently produce a broken link. */
export function getRelatedServices(serviceId: string) {
  const relatedIds = RELATED_BY_ID.get(serviceId) ?? [];
  return relatedIds
    .map((id) => SERVICES.find((service) => service.id === id))
    .filter((service): service is (typeof SERVICES)[number] => service !== undefined);
}
