/**
 * Service x location activation and publish-readiness (JOB-AGT-WEB-20260726-M4.1,
 * extended 2026-08-04 per AFAQ_ALHAYAT_ENTERPRISE_KNOWLEDGE/10_MARKETING_AND_SEO/
 * IMPLEMENTATION_ROADMAP.md Phase 0, "SEO page safety gate").
 *
 * Two distinct questions live in this file — they are not interchangeable:
 *
 * - isActive() answers "does this service+location combination exist as a
 *   servable route at all" (structural validity: both slugs resolve in
 *   their registries). Its behavior is unchanged by this update — it still
 *   returns true for any structurally valid pair, exactly as before, so
 *   every currently-deployed page that depends on it (the NOINDEX_FOLLOW
 *   ServiceLocationFallback route and its pest-control equivalent) keeps
 *   rendering exactly as it does today. Its stale comment ("all 12 catalog
 *   services") is corrected below — the catalog now has 27 services — but
 *   no logic changed.
 *
 * - isPublishReady() is the new explicit safety gate this update adds. It
 *   answers "is this combination allowed to become a real, indexable SEO
 *   page" and must be the check any future page-generation work (see
 *   10_MARKETING_AND_SEO/SEO_PAGE_PRIORITY_LIST.md) calls before generating
 *   a service+location page with real content — replacing what would
 *   otherwise default to isActive()'s unconditional true. It is not called
 *   by any route today: no route in this codebase generates real
 *   service+location content yet, only the NOINDEX_FOLLOW fallback gated by
 *   isActive(). It checks service-level content readiness against
 *   APPROVED_SERVICE_CONTENT_SLUGS (service-content.ts) — the same
 *   16-service allow-list that already gates real page content elsewhere —
 *   on top of isActive()'s structural check. It does not yet check
 *   location-level content maturity: SERVICE_AREAS.md approves all 7
 *   emirates at emirate level, but per-emirate content maturity varies
 *   (LOCAL_SEO_MASTER_PLAN.md); add that check here once a real per-location
 *   readiness signal exists, rather than assuming emirate approval implies
 *   page-content readiness.
 */

import { getLocationBySlug } from "./locations";
import { getServiceBySlug } from "./services";
import { APPROVED_SERVICE_CONTENT_SLUGS } from "./service-content";

export function isActive(serviceSlug: string, locationSlug: string): boolean {
  const service = getServiceBySlug(serviceSlug);
  const location = getLocationBySlug(locationSlug);
  if (!service || !location) return false;

  // SERVICE_AREAS.md: all 27 catalog services are approved at emirate
  // level across all 7 emirates (2026-07-23 owner decision). This governs
  // route existence only — see isPublishReady() above for the
  // content-readiness gate a real SEO page must pass instead.
  return true;
}

export function isPublishReady(serviceSlug: string, locationSlug: string): boolean {
  return isActive(serviceSlug, locationSlug) && APPROVED_SERVICE_CONTENT_SLUGS.includes(serviceSlug);
}
