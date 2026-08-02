import { SERVICES, type ServiceEntry } from "./services";

/**
 * Top-level URL section grouping (JOB-AGT-WEB-20260730 structure phase).
 * A presentation/routing layer on top of the existing 3-value
 * `ServiceCategory` in services.ts — deliberately additive, not a
 * replacement, so existing category-based logic (related-services
 * matching, category labels) keeps working unchanged.
 *
 * Mapping (per Owner's 2026-07-30 structure-phase instructions):
 * - "pest-control": the Pest Control service only (special-cased; it
 *   already has its own sub-service system).
 * - "maintenance": every other `general-maintenance` service, plus all
 *   of `drainage-water-protection` (Drain Unblocking, Waterproofing,
 *   Water Leak Detection were explicitly listed under Maintenance in
 *   the request, not as a separate section).
 * - "cleaning": the remaining `cleaning-pest-control` services (General
 *   Cleaning, Deep Cleaning, Water Tank Cleaning) — i.e. that category
 *   minus Pest Control.
 */
export type ServiceSection = "maintenance" | "cleaning" | "pest-control";

export const SERVICE_SECTIONS: ServiceSection[] = ["maintenance", "cleaning", "pest-control"];

export function getServiceSection(slug: string): ServiceSection | undefined {
  const service = SERVICES.find((candidate) => candidate.slug === slug);
  if (!service) return undefined;
  if (service.slug === "pest-control") return "pest-control";
  if (service.category === "cleaning-pest-control") return "cleaning";
  return "maintenance";
}

export function getServicesBySection(section: ServiceSection): ServiceEntry[] {
  return SERVICES.filter((service) => getServiceSection(service.slug) === section);
}
