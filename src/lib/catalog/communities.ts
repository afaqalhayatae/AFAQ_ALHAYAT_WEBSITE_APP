/**
 * Community-level location registry (2026-08-06 local SEO expansion,
 * Phase 2). Mirrors the Priority Community Registry addendum in
 * AFAQ_ALHAYAT_ENTERPRISE_KNOWLEDGE/03_MARKET/SERVICE_AREAS.md — only
 * communities explicitly approved there belong here. Real competitor
 * research (2026-08-06) confirmed dedicated community-level pages
 * outrank a single generic emirate page for local search — this
 * registry is the foundation for that: one entry here + a real content
 * entry in community-content.ts is the entire publishing step for a new
 * community page, no route change needed (same pattern city-content.ts
 * already established for emirates).
 *
 * `archetype` records the community's real, publicly-known property
 * character (villa / tower / mixed) — used to keep content genuinely
 * differentiated per community rather than a name-swapped template.
 */
import type { Locale } from "@/i18n/config";

export type CommunityArchetype = "villa" | "tower" | "mixed";

export type CommunityEntry = {
  id: string;
  slug: string;
  name: { en: string; ar: string };
  emirateSlug: string;
  archetype: CommunityArchetype;
  /** A short, real, publicly-known characteristic used to ground content
   *  (never an invented fact) — e.g. waterfront exposure, villa age,
   *  building density. */
  characteristic: { en: string; ar: string };
};

export const COMMUNITIES: CommunityEntry[] = [
  {
    id: "LOC-AE-DU-PALM-JUMEIRAH",
    slug: "palm-jumeirah",
    name: { en: "Palm Jumeirah", ar: "نخلة جميرا" },
    emirateSlug: "dubai",
    archetype: "villa",
    characteristic: {
      en: "a waterfront villa community on every frond, with some villas now 15+ years old",
      ar: "مجتمع فلل ساحلي على كل سعفة، وبعض الفلل عمرها الآن أكثر من 15 عامًا",
    },
  },
  {
    id: "LOC-AE-DU-ARABIAN-RANCHES",
    slug: "arabian-ranches",
    name: { en: "Arabian Ranches", ar: "المرابع العربية" },
    emirateSlug: "dubai",
    archetype: "villa",
    characteristic: {
      en: "mature villa territory with large plots and established landscaping",
      ar: "منطقة فلل راسخة بمساحات واسعة وحدائق ناضجة",
    },
  },
  {
    id: "LOC-AE-DU-DUBAI-MARINA",
    slug: "dubai-marina",
    name: { en: "Dubai Marina", ar: "دبي مارينا" },
    emirateSlug: "dubai",
    archetype: "tower",
    characteristic: {
      en: "dense high-rise apartment towers, many used as short-term holiday rentals",
      ar: "أبراج سكنية عالية الكثافة، يُستخدم كثير منها للإيجار السياحي قصير المدى",
    },
  },
  {
    id: "LOC-AE-DU-DOWNTOWN",
    slug: "downtown-dubai",
    name: { en: "Downtown Dubai", ar: "وسط مدينة دبي" },
    emirateSlug: "dubai",
    archetype: "tower",
    characteristic: {
      en: "premium high-rise towers in the city's most central business and tourism district",
      ar: "أبراج فاخرة في أكثر أحياء المدينة مركزية من الناحية التجارية والسياحية",
    },
  },
  {
    id: "LOC-AE-AZ-SAADIYAT",
    slug: "saadiyat-island",
    name: { en: "Saadiyat Island", ar: "جزيرة السعديات" },
    emirateSlug: "abu-dhabi",
    archetype: "villa",
    characteristic: {
      en: "a newer island community mixing villas and low-rise residences near the coast",
      ar: "مجتمع جزيرة أحدث يجمع بين الفلل والمساكن منخفضة الارتفاع قرب الساحل",
    },
  },
  {
    id: "LOC-AE-AZ-AL-REEM",
    slug: "al-reem-island",
    name: { en: "Al Reem Island", ar: "جزيرة الريم" },
    emirateSlug: "abu-dhabi",
    archetype: "tower",
    characteristic: {
      en: "a dense cluster of residential towers close to the mainland",
      ar: "تجمع كثيف من الأبراج السكنية قريب من البر الرئيسي",
    },
  },
  {
    id: "LOC-AE-SH-ALJADA",
    slug: "aljada",
    name: { en: "Aljada", ar: "الجادة" },
    emirateSlug: "sharjah",
    archetype: "mixed",
    characteristic: {
      en: "one of Sharjah's newest master communities, mixing apartments and townhouses",
      ar: "أحد أحدث المجتمعات المخططة في الشارقة، ويجمع بين الشقق والتاون هاوس",
    },
  },
];

export function getCommunityBySlug(slug: string): CommunityEntry | undefined {
  return COMMUNITIES.find((community) => community.slug === slug);
}

export function getCommunitiesByEmirate(emirateSlug: string): CommunityEntry[] {
  return COMMUNITIES.filter((community) => community.emirateSlug === emirateSlug);
}

export function communityName(community: CommunityEntry, locale: Locale): string {
  return community.name[locale];
}
