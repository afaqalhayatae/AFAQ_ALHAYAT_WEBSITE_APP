/**
 * Service x location activation (JOB-AGT-WEB-20260726-M4.1).
 * Mirrors AFAQ_ALHAYAT_ENTERPRISE_KNOWLEDGE/04_SERVICE_KNOWLEDGE/SERVICE_MATRIX.md,
 * which currently marks every catalog service Active in every emirate.
 * Route generateStaticParams calls go through isActive() rather than a
 * blind cartesian product, so a combination page can only ever exist
 * where the matrix approves it.
 */

import { getLocationBySlug } from "./locations";
import { getServiceBySlug } from "./services";

export function isActive(serviceSlug: string, locationSlug: string): boolean {
  const service = getServiceBySlug(serviceSlug);
  const location = getLocationBySlug(locationSlug);
  if (!service || !location) return false;

  // SERVICE_MATRIX.md: all 12 catalog services are Active in all 7
  // emirates as of 2026-07-23. Revisit this check if the matrix ever
  // records an exception for a specific service/emirate pair.
  return true;
}
