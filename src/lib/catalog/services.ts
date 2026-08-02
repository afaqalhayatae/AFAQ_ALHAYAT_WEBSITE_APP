/**
 * Canonical service registry (JOB-AGT-WEB-20260726-M4.1).
 * Mirrors AFAQ_ALHAYAT_ENTERPRISE_KNOWLEDGE/04_SERVICE_KNOWLEDGE/SERVICE_CATALOG.md
 * exactly — 27 approved services (12 original + 4 added 2026-07-31 per the
 * Owner's Service Completion Phase Order, DECISION_LOG #38 + 11 added
 * 2026-07-31 per the Owner's Service Expansion Phase, DECISION_LOG #39), 3
 * approved categories. Structural facts only (id/slug/category); bilingual
 * display strings live in i18n under services.entries[slug], keyed the
 * same way.
 *
 * The 11 Service Expansion Phase entries are structural-only: catalog
 * entry, i18n name/description, SEO title/meta/keywords, and (for 10 of
 * 11) a real stored card image are in place, but full page content
 * (overview, scope, process, benefits, safety, FAQ) is not — they are not
 * in `APPROVED_SERVICE_CONTENT_SLUGS` (service-content.ts), so their pages
 * render with the generic shared sections and stay `NOINDEX_FOLLOW` until
 * a future content phase, same as every other not-yet-content-complete
 * service before it.
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
  { id: "SVC-VILLA-CLEANING", slug: "villa-cleaning", category: "cleaning-pest-control" },
  { id: "SVC-OFFICE-CLEANING", slug: "office-cleaning", category: "cleaning-pest-control" },
  {
    id: "SVC-POST-CONSTRUCTION-CLEANING",
    slug: "post-construction-cleaning",
    category: "cleaning-pest-control",
  },
  {
    id: "SVC-CARPET-UPHOLSTERY-CLEANING",
    slug: "carpet-upholstery-cleaning",
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
  { id: "SVC-CCTV-INSTALLATION", slug: "cctv-installation", category: "general-maintenance" },
  {
    id: "SVC-SMART-HOME-INSTALLATION",
    slug: "smart-home-installation",
    category: "general-maintenance",
  },
  {
    id: "SVC-SWIMMING-POOL-MAINTENANCE",
    slug: "swimming-pool-maintenance",
    category: "general-maintenance",
  },
  { id: "SVC-KITCHEN-INSTALLATION", slug: "kitchen-installation", category: "general-maintenance" },
  { id: "SVC-INTERIOR-DECORATION", slug: "interior-decoration", category: "general-maintenance" },
  {
    id: "SVC-INTERLOCK-INSTALLATION",
    slug: "interlock-installation",
    category: "general-maintenance",
  },
  { id: "SVC-LIGHTING-MAINTENANCE", slug: "lighting-maintenance", category: "general-maintenance" },
  {
    id: "SVC-WOOD-ALTERNATIVE-INSTALLATION",
    slug: "wood-alternative-installation",
    category: "general-maintenance",
  },
  {
    id: "SVC-WALLPAPER-INSTALLATION",
    slug: "wallpaper-installation",
    category: "general-maintenance",
  },
  { id: "SVC-THERMAL-INSULATION", slug: "thermal-insulation", category: "general-maintenance" },
  {
    id: "SVC-ROOFTOP-SPACE-UTILIZATION",
    slug: "rooftop-space-utilization",
    category: "general-maintenance",
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
