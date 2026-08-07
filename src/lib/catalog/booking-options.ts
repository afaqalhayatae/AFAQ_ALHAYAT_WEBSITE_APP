/**
 * Booking form option data (2026-07-28) — UI-only, no backend connection.
 *
 * The requested service list (grouped as "Maintenance" / "Cleaning" /
 * "Pest Control", with pest types like "Cockroach Control" listed as if
 * they were separate bookable services) does not match the approved
 * 12-service catalog 1:1 — `SERVICE_CATALOG.md` has exactly one "Pest
 * Control" service, not five. Rather than inventing catalog entries that
 * don't exist, this reconciles the request onto the real catalog:
 * - "Maintenance" groups the real General-Maintenance + Drainage &
 *   Water-Protection services (AC, Electrical, Plumbing, Painting,
 *   Handyman, Drain Unblocking, Waterproofing, Water Leak Detection).
 * - "Cleaning" groups the real General/Deep/Water-Tank cleaning services.
 * - "Pest Control" is the one real service; the requested pest types
 *   (Cockroach/Ant/Rodent/Termite/General) are offered as an *optional
 *   detail field* on that single service, not as separate services.
 *
 * 2026-08-04 booking-readiness fix (SEO_REALITY_MAP.md §3): the catalog
 * grew to 16 content-complete, indexable services after this file was
 * first written, but CLEANING_SLUGS was never updated to match — Villa,
 * Office, Post-Construction, and Carpet & Upholstery Cleaning had live
 * service pages with no way to be selected in this form. Added below.
 * Pest sub-type coverage had the same gap: PEST_TYPES only ever covered
 * general/cockroach/ant/rodent/termite, while pest-control-pages.ts has
 * 11 real, indexable sub-service pages — the other 7 are added below too,
 * matching pest-control-pages.ts's ids (minus its "-control"/"-services"
 * suffix, to match this file's existing short-form style).
 */

import { SERVICES, type ServiceEntry } from "./services";

export type BookingCategory = "maintenance" | "cleaning" | "pest-control";

const MAINTENANCE_SLUGS = [
  "ac-maintenance",
  "electrical-maintenance",
  "plumbing",
  "painting",
  "handyman",
  "drain-unblocking",
  "waterproofing",
  "water-leak-detection",
  "interior-decoration",
];

const CLEANING_SLUGS = [
  "general-cleaning",
  "deep-cleaning",
  "water-tank-cleaning",
  "villa-cleaning",
  "office-cleaning",
  "post-construction-cleaning",
  "carpet-upholstery-cleaning",
];

const PEST_CONTROL_SLUGS = ["pest-control"];

const CATEGORY_SLUGS: Record<BookingCategory, string[]> = {
  maintenance: MAINTENANCE_SLUGS,
  cleaning: CLEANING_SLUGS,
  "pest-control": PEST_CONTROL_SLUGS,
};

export const BOOKING_CATEGORIES: BookingCategory[] = ["maintenance", "cleaning", "pest-control"];

export function getServicesForCategory(category: BookingCategory): ServiceEntry[] {
  const slugs = CATEGORY_SLUGS[category];
  return SERVICES.filter((service) => slugs.includes(service.slug));
}

/**
 * Resolves a real catalog service slug (e.g. from `?service=` on
 * `/book`, per the booking-prefill requirement) to the booking
 * category it belongs to. Returns `null` for an unrecognized slug —
 * the booking form must never pre-select a category for a service that
 * isn't actually in the catalog.
 */
export function getCategoryForServiceSlug(slug: string): BookingCategory | null {
  for (const category of BOOKING_CATEGORIES) {
    if (CATEGORY_SLUGS[category].includes(slug)) return category;
  }
  return null;
}

export type PestType =
  | "general"
  | "cockroach"
  | "ant"
  | "rodent"
  | "termite"
  | "bed-bug"
  | "snake"
  | "mosquito"
  | "wasp"
  | "bird"
  | "gecko"
  | "home-pest-prevention";

export const PEST_TYPES: PestType[] = [
  "general",
  "cockroach",
  "ant",
  "rodent",
  "termite",
  "bed-bug",
  "snake",
  "mosquito",
  "wasp",
  "bird",
  "gecko",
  "home-pest-prevention",
];

export type TimeSlot = "morning" | "afternoon" | "evening";

export const TIME_SLOTS: TimeSlot[] = ["morning", "afternoon", "evening"];

export type ContactMethod = "whatsapp" | "phone" | "email";

export const CONTACT_METHODS: ContactMethod[] = ["whatsapp", "phone", "email"];

/**
 * Property Details (Professional Booking System Foundation) — generic,
 * non-fact-dependent UI selections (not a business/pricing claim, so no
 * Owner approval gate needed, unlike prices/warranties/response times).
 */
export type PropertyType = "apartment" | "villa" | "office" | "other";

export const PROPERTY_TYPES: PropertyType[] = ["apartment", "villa", "office", "other"];

export type PropertySize = "studio" | "1-bedroom" | "2-bedroom" | "3-bedroom" | "4-plus-bedroom";

export const PROPERTY_SIZES: PropertySize[] = [
  "studio",
  "1-bedroom",
  "2-bedroom",
  "3-bedroom",
  "4-plus-bedroom",
];

/**
 * Dubai's real, approved Tier-1 priority communities
 * (`03_MARKET/SERVICE_AREAS.md`) — the only emirate with any area-level
 * registry today. Every other emirate has no approved area list yet, so
 * the form falls back to a free-text field for them — never an invented
 * area list. Adding a real area list for another emirate later is a
 * one-line addition here, no component change required (the "dynamic
 * structure ready for future expansion" the request asked for).
 */
export const DUBAI_AREAS: string[] = [
  "Palm Jumeirah",
  "Emirates Hills",
  "Dubai Hills Estate",
  "Jumeirah Golf Estates",
  "Al Barari",
  "Jumeirah Bay Island",
  "District One",
];

export function getAreasForEmirateSlug(slug: string): string[] {
  return slug === "dubai" ? DUBAI_AREAS : [];
}
