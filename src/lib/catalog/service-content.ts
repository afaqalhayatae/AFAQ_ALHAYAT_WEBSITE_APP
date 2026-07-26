import type { Locale } from "@/i18n/config";

/**
 * Expanded service-detail content framework (JOB-AGT-WEB-20260726-M4.2).
 *
 * Every field here is a "slot," not content. Nothing is populated yet —
 * every service in `04_SERVICE_KNOWLEDGE/` (including General Cleaning
 * and Water Tank Cleaning) has its `CONTENT_EN.md`/`CONTENT_AR.md`
 * marked "Review Draft — not approved for publication," and scope/
 * process/benefit specifics require an owner + operations (+ safety/
 * compliance where applicable) sign-off this repo doesn't have. Adding
 * an entry here — keyed by slug, per locale — is the entire publishing
 * step once that sign-off exists; the page template picks it up
 * automatically via `getServiceContent()`. No code changes needed then.
 *
 * Priority slots to fill first: `general-cleaning`, `water-tank-cleaning`.
 */

export type ServiceContentBlock = {
  overview: string;
  scope: { included: string[]; excluded: string[] };
  benefits: string[];
};

export const SERVICE_CONTENT: Partial<Record<string, Record<Locale, ServiceContentBlock>>> = {};

export function getServiceContent(slug: string, locale: Locale): ServiceContentBlock | undefined {
  return SERVICE_CONTENT[slug]?.[locale];
}
