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
 * `subCities` (Priority Community Registry areas within the emirate) —
 * populated 2026-08-05 from AFAQ_ALHAYAT_ENTERPRISE_KNOWLEDGE/
 * 03_MARKET/SERVICE_AREAS.md's "Priority Community Registry", after the
 * Owner directly confirmed those named communities may be published
 * (see that file's 2026-08-05 addendum). Every id/name pair here is
 * copied verbatim from that registry — nothing invented — and every
 * community already existed there, just unrendered. `chatbot` gives
 * every emirate a stable id and its related service sections so a
 * future website/WhatsApp assistant can look up "what does AFAQ offer
 * in <emirate>" without re-deriving it; `knowledgeBaseNotes` is a
 * placeholder field for future assistant-specific copy, left undefined
 * until written.
 */
export type EmirateCommunity = { id: string; name: { en: string; ar: string } };

export type EmirateDisplay = {
  id: string;
  slug: string;
  name: { en: string; ar: string };
  hasPage: boolean;
  subCities: EmirateCommunity[];
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
    subCities: [
      { id: "LOC-AE-AZ-SAADIYAT", name: { en: "Saadiyat Island", ar: "جزيرة السعديات" } },
      { id: "LOC-AE-AZ-YAS", name: { en: "Yas Island", ar: "جزيرة ياس" } },
      { id: "LOC-AE-AZ-AL-RAHA-BEACH", name: { en: "Al Raha Beach", ar: "شاطئ الراحة" } },
      { id: "LOC-AE-AZ-AL-BATEEN", name: { en: "Al Bateen", ar: "البطين" } },
      { id: "LOC-AE-AZ-JUBAIL-ISLAND", name: { en: "Jubail Island", ar: "جزيرة الجبيل" } },
      { id: "LOC-AE-AZ-AL-MAQTAA", name: { en: "Al Maqtaa", ar: "المقطع" } },
      { id: "LOC-AE-AZ-AL-REEM", name: { en: "Al Reem Island", ar: "جزيرة الريم" } },
      { id: "LOC-AE-AZ-KHALIFA-CITY", name: { en: "Khalifa City", ar: "مدينة خليفة" } },
    ],
    chatbot: buildChatbotEntry("LOC-AE-AZ"),
  },
  {
    id: "LOC-AE-DU",
    slug: "dubai",
    name: { en: "Dubai", ar: "دبي" },
    hasPage: true,
    subCities: [
      { id: "LOC-AE-DU-PALM-JUMEIRAH", name: { en: "Palm Jumeirah", ar: "نخلة جميرا" } },
      { id: "LOC-AE-DU-EMIRATES-HILLS", name: { en: "Emirates Hills", ar: "تلال الإمارات" } },
      { id: "LOC-AE-DU-DUBAI-HILLS", name: { en: "Dubai Hills Estate", ar: "دبي هيلز استيت" } },
      {
        id: "LOC-AE-DU-JUMEIRAH-GOLF-ESTATES",
        name: { en: "Jumeirah Golf Estates", ar: "عقارات جميرا للجولف" },
      },
      { id: "LOC-AE-DU-AL-BARARI", name: { en: "Al Barari", ar: "البراري" } },
      { id: "LOC-AE-DU-JUMEIRAH-BAY", name: { en: "Jumeirah Bay Island", ar: "جزيرة جميرا باي" } },
      { id: "LOC-AE-DU-DISTRICT-ONE", name: { en: "District One", ar: "دستركت ون" } },
      { id: "LOC-AE-DU-JUMEIRAH-ISLANDS", name: { en: "Jumeirah Islands", ar: "جزر جميرا" } },
      { id: "LOC-AE-DU-TILAL-AL-GHAF", name: { en: "Tilal Al Ghaf", ar: "تلال الغاف" } },
      { id: "LOC-AE-DU-ARABIAN-RANCHES", name: { en: "Arabian Ranches", ar: "المرابع العربية" } },
      { id: "LOC-AE-DU-DOWNTOWN", name: { en: "Downtown Dubai", ar: "وسط مدينة دبي" } },
      { id: "LOC-AE-DU-DUBAI-MARINA", name: { en: "Dubai Marina", ar: "دبي مارينا" } },
    ],
    chatbot: buildChatbotEntry("LOC-AE-DU"),
  },
  {
    id: "LOC-AE-SH",
    slug: "sharjah",
    name: { en: "Sharjah", ar: "الشارقة" },
    hasPage: true,
    subCities: [
      { id: "LOC-AE-SH-AL-ZAHIA", name: { en: "Al Zahia", ar: "الزاهية" } },
      { id: "LOC-AE-SH-ALJADA", name: { en: "Aljada", ar: "الجادة" } },
      { id: "LOC-AE-SH-TILAL-CITY", name: { en: "Tilal City", ar: "مدينة تلال" } },
      { id: "LOC-AE-SH-AL-TAI", name: { en: "Al Tai", ar: "الطي" } },
      { id: "LOC-AE-SH-MARYAM-ISLAND", name: { en: "Maryam Island", ar: "جزيرة مريم" } },
    ],
    chatbot: buildChatbotEntry("LOC-AE-SH"),
  },
  {
    id: "LOC-AE-AJ",
    slug: "ajman",
    name: { en: "Ajman", ar: "عجمان" },
    hasPage: true,
    subCities: [
      { id: "LOC-AE-AJ-AL-ZORAH", name: { en: "Al Zorah", ar: "الزوراء" } },
      { id: "LOC-AE-AJ-CORNICHE", name: { en: "Ajman Corniche", ar: "كورنيش عجمان" } },
    ],
    chatbot: buildChatbotEntry("LOC-AE-AJ"),
  },
  {
    id: "LOC-AE-UQ",
    slug: "umm-al-quwain",
    name: { en: "Umm Al Quwain", ar: "أم القيوين" },
    hasPage: true,
    subCities: [
      { id: "LOC-AE-UQ-UAQ-MARINA", name: { en: "Umm Al Quwain Marina", ar: "مرسى أم القيوين" } },
      { id: "LOC-AE-UQ-AL-KHOR", name: { en: "Al Khor", ar: "الخور" } },
    ],
    chatbot: buildChatbotEntry("LOC-AE-UQ"),
  },
  {
    id: "LOC-AE-RK",
    slug: "ras-al-khaimah",
    name: { en: "Ras Al Khaimah", ar: "رأس الخيمة" },
    hasPage: true,
    subCities: [
      { id: "LOC-AE-RK-AL-MARJAN", name: { en: "Al Marjan Island", ar: "جزيرة المرجان" } },
      { id: "LOC-AE-RK-MINA-AL-ARAB", name: { en: "Mina Al Arab", ar: "ميناء العرب" } },
      { id: "LOC-AE-RK-AL-HAMRA-VILLAGE", name: { en: "Al Hamra Village", ar: "قرية الحمراء" } },
    ],
    chatbot: buildChatbotEntry("LOC-AE-RK"),
  },
  {
    id: "LOC-AE-FU",
    slug: "fujairah",
    name: { en: "Fujairah", ar: "الفجيرة" },
    hasPage: true,
    subCities: [
      { id: "LOC-AE-FU-AL-AQAH", name: { en: "Al Aqah", ar: "العقة" } },
      { id: "LOC-AE-FU-AL-FASEEL", name: { en: "Al Faseel", ar: "الفصيل" } },
    ],
    chatbot: buildChatbotEntry("LOC-AE-FU"),
  },
];

export function getEmirateBySlug(slug: string): EmirateDisplay | undefined {
  return ALL_EMIRATES.find((emirate) => emirate.slug === slug);
}
