/**
 * Canonical service registry (JOB-AGT-WEB-20260726-M4.1).
 * Mirrors AFAQ_ALHAYAT_ENTERPRISE_KNOWLEDGE/04_SERVICE_KNOWLEDGE/SERVICE_CATALOG.md
 * exactly — 12 approved services, 3 approved categories. Structural facts
 * only (id/slug/category); bilingual display strings live in i18n under
 * services.entries[slug], keyed the same way.
 */

export type ServiceCategory =
  | "general-maintenance"
  | "cleaning-pest-control"
  | "drainage-water-protection";

export type ServiceEntry = {
  id: string;
  slug: string;
  category: ServiceCategory;
};

export const SERVICES: ServiceEntry[] = [
  { id: "SVC-AC-MAINTENANCE", slug: "ac-maintenance", category: "general-maintenance" },
  { id: "SVC-PLUMBING", slug: "plumbing", category: "general-maintenance" },
  {
    id: "SVC-ELECTRICAL-MAINTENANCE",
    slug: "electrical-maintenance",
    category: "general-maintenance",
  },
  { id: "SVC-PAINTING", slug: "painting", category: "general-maintenance" },
  { id: "SVC-HANDYMAN", slug: "handyman", category: "general-maintenance" },
  { id: "SVC-GENERAL-CLEANING", slug: "general-cleaning", category: "cleaning-pest-control" },
  { id: "SVC-DEEP-CLEANING", slug: "deep-cleaning", category: "cleaning-pest-control" },
  {
    id: "SVC-WATER-TANK-CLEANING",
    slug: "water-tank-cleaning",
    category: "cleaning-pest-control",
  },
  { id: "SVC-PEST-CONTROL", slug: "pest-control", category: "cleaning-pest-control" },
  {
    id: "SVC-DRAIN-UNBLOCKING",
    slug: "drain-unblocking",
    category: "drainage-water-protection",
  },
  { id: "SVC-WATERPROOFING", slug: "waterproofing", category: "drainage-water-protection" },
  {
    id: "SVC-WATER-LEAK-DETECTION",
    slug: "water-leak-detection",
    category: "drainage-water-protection",
  },
];

export function getServiceBySlug(slug: string): ServiceEntry | undefined {
  return SERVICES.find((service) => service.slug === slug);
}

export function getServicesByCategory(category: ServiceCategory): ServiceEntry[] {
  return SERVICES.filter((service) => service.category === category);
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  "general-maintenance",
  "cleaning-pest-control",
  "drainage-water-protection",
];
