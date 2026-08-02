import { SERVICE_SECTIONS, type ServiceSection } from "./service-sections";

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

export const LOCATIONS: LocationEntry[] = [
  { id: "LOC-AE-DU", slug: "dubai", indexable: true },
  { id: "LOC-AE-AZ", slug: "abu-dhabi", indexable: true },
  { id: "LOC-AE-SH", slug: "sharjah", indexable: true },
  { id: "LOC-AE-AJ", slug: "ajman", indexable: true },
  { id: "LOC-AE-UQ", slug: "umm-al-quwain", indexable: true },
  { id: "LOC-AE-RK", slug: "ras-al-khaimah", indexable: true },
  { id: "LOC-AE-FU", slug: "fujairah", indexable: true },
];

export function getLocationBySlug(slug: string): LocationEntry | undefined {
  return LOCATIONS.find((location) => location.slug === slug);
}

/**
 * The 3 top-level service sections every emirate hub links to (JOB-
 * AGT-WEB-20260730 emirates-expansion structure phase). Reuses
 * service-sections.ts's `ServiceSection`/`SERVICE_SECTIONS` — the exact
 * type the canonical `/services/{section}/{slug}/{city}` URL pattern
 * and resolveServiceCityPath() are built on — rather than a second,
 * same-3-values type of its own, so a chatbot (or anything else) can
 * follow an emirate's `relatedServiceSections` straight into that URL
 * system without a parallel definition drifting out of sync (Canonical
 * URL Architecture Finalization, JOB-AGT-WEB-20260730). Re-exported here
 * under the emirate-facing names so callers reading locations.ts don't
 * need a second import from service-sections.ts.
 */
export { SERVICE_SECTIONS as EMIRATE_MAIN_SECTIONS };
export type { ServiceSection as EmirateSection };

/**
 * Display-only list of all 7 approved emirates (2026-07-28), mirroring
 * `03_MARKET/SERVICE_AREAS.md`'s Approved Registry — a real, approved
 * coverage fact, separate from `LOCATIONS` above (which only lists
 * emirates that have an actual generated page today). `hasPage` gates
 * whether an emirate links to its own `/locations/[slug]` route or
 * falls back to the general `/locations` index — no page is fabricated
 * by adding an emirate's name here. All 7 flipped to `true` once real,
 * unique content was written for each (2026-08-02 content-integration
 * pass) — kept as a per-entry flag rather than removed so a future
 * emirate can be added to this list before its content is ready.
 *
 * `subCities` (Tier-2 areas within the emirate) is intentionally an
 * empty slot for every emirate today — same "structure ready, no
 * fabricated data" rule as `hasPage`. `chatbot` gives every emirate a
 * stable id and its related service sections so a future website/
 * WhatsApp assistant can look up "what does AFAQ offer in <emirate>"
 * without re-deriving it; `knowledgeBaseNotes` is a placeholder field
 * for future assistant-specific copy, left undefined until written.
 */
export type EmirateDisplay = {
  id: string;
  slug: string;
  name: { en: string; ar: string };
  hasPage: boolean;
  subCities: string[];
  chatbot: {
    id: string;
    relatedServiceSections: ServiceSection[];
    knowledgeBaseNotes?: string;
  };
};

function buildChatbotEntry(id: string): EmirateDisplay["chatbot"] {
  return { id, relatedServiceSections: [...SERVICE_SECTIONS] };
}

export const ALL_EMIRATES: EmirateDisplay[] = [
  {
    id: "LOC-AE-AZ",
    slug: "abu-dhabi",
    name: { en: "Abu Dhabi", ar: "أبوظبي" },
    hasPage: true,
    subCities: [],
    chatbot: buildChatbotEntry("LOC-AE-AZ"),
  },
  {
    id: "LOC-AE-DU",
    slug: "dubai",
    name: { en: "Dubai", ar: "دبي" },
    hasPage: true,
    subCities: [],
    chatbot: buildChatbotEntry("LOC-AE-DU"),
  },
  {
    id: "LOC-AE-SH",
    slug: "sharjah",
    name: { en: "Sharjah", ar: "الشارقة" },
    hasPage: true,
    subCities: [],
    chatbot: buildChatbotEntry("LOC-AE-SH"),
  },
  {
    id: "LOC-AE-AJ",
    slug: "ajman",
    name: { en: "Ajman", ar: "عجمان" },
    hasPage: true,
    subCities: [],
    chatbot: buildChatbotEntry("LOC-AE-AJ"),
  },
  {
    id: "LOC-AE-UQ",
    slug: "umm-al-quwain",
    name: { en: "Umm Al Quwain", ar: "أم القيوين" },
    hasPage: true,
    subCities: [],
    chatbot: buildChatbotEntry("LOC-AE-UQ"),
  },
  {
    id: "LOC-AE-RK",
    slug: "ras-al-khaimah",
    name: { en: "Ras Al Khaimah", ar: "رأس الخيمة" },
    hasPage: true,
    subCities: [],
    chatbot: buildChatbotEntry("LOC-AE-RK"),
  },
  {
    id: "LOC-AE-FU",
    slug: "fujairah",
    name: { en: "Fujairah", ar: "الفجيرة" },
    hasPage: true,
    subCities: [],
    chatbot: buildChatbotEntry("LOC-AE-FU"),
  },
];

export function getEmirateBySlug(slug: string): EmirateDisplay | undefined {
  return ALL_EMIRATES.find((emirate) => emirate.slug === slug);
}
