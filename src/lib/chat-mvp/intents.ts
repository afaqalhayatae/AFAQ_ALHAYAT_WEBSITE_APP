/**
 * Rule-based intent detection for the chatbot MVP — no LLM, no external
 * calls. Implements 08_DIGITAL_SYSTEMS/AI_CHATBOT/03_SERVICE_QUALIFICATION_RULES.md
 * §1 in the AFAQ_ALHAYAT_ENTERPRISE_KNOWLEDGE repo — keep both in sync.
 *
 * EMERGENCY and PRICE_INQUIRY are checked before the three service
 * intents, since they change the flow regardless of which service is
 * mentioned in the same message.
 */

import { matchesAnyKeyword } from "./keyword-match";

export type Intent =
  | "EMERGENCY"
  | "PRICE_INQUIRY"
  | "MAINTENANCE"
  | "CLEANING"
  | "PEST_CONTROL"
  | "BOOKING_REQUEST"
  | "UNKNOWN";

type KeywordSet = { intent: Intent; keywords: string[] };

const KEYWORD_SETS: KeywordSet[] = [
  {
    intent: "EMERGENCY",
    keywords: [
      "emergency",
      "urgent",
      "flooding",
      "flood",
      "burst",
      "sparking",
      "fire",
      "gas smell",
      "طوارئ",
      "عاجل",
      "غرق",
      "انفجار",
      "شرارة",
      "حريق",
      "رايحة غاز",
    ],
  },
  {
    intent: "PRICE_INQUIRY",
    keywords: [
      "how much",
      "cost",
      "price",
      "cheap",
      "expensive",
      "quote",
      "كام",
      "السعر",
      "سعر",
      "تكلفة",
      "بكام",
      "عرض سعر",
    ],
  },
  {
    intent: "MAINTENANCE",
    keywords: [
      // "maintenance" added for the chat widget's Phase 2 service-selection
      // shortcut (chat-widget.tsx SHORTCUTS) — the literal word wasn't
      // previously matched by any keyword here.
      "maintenance",
      "ac",
      "air condition",
      "cooling",
      "repair",
      "plumb",
      "electric",
      "leak",
      "paint",
      "handyman",
      "drain",
      "تكييف",
      "صيانة",
      "سباك",
      "كهرب",
      "تسريب",
      "دهان",
      "صحي",
      "مصرف",
    ],
  },
  {
    intent: "CLEANING",
    keywords: [
      "clean",
      "housekeeping",
      "maid",
      "تنظيف",
      "نظافة",
      "عاملة",
    ],
  },
  {
    intent: "PEST_CONTROL",
    keywords: [
      "pest",
      "cockroach",
      "roach",
      "ant",
      "bed bug",
      "bedbug",
      "termite",
      "rodent",
      "mice",
      "mouse",
      "rat",
      "حشرات",
      "صرصور",
      "نمل",
      "بق",
      "أرضة",
      "فئران",
      "قوارض",
    ],
  },
  {
    intent: "BOOKING_REQUEST",
    keywords: ["book", "schedule an appointment", "reserve", "احجز", "حجز", "موعد"],
  },
];

/**
 * Detects every intent whose keywords match, in priority order. Returns
 * an ordered list so the caller can decide how to handle multiple
 * matches (03_SERVICE_QUALIFICATION_RULES.md §1: ask which to start with,
 * never silently pick one) instead of losing that information here.
 */
export function detectIntents(message: string): Intent[] {
  const normalized = message.toLowerCase();
  const matched: Intent[] = [];

  for (const { intent, keywords } of KEYWORD_SETS) {
    if (matchesAnyKeyword(normalized, keywords)) {
      matched.push(intent);
    }
  }

  return matched.length > 0 ? matched : ["UNKNOWN"];
}

/**
 * Convenience wrapper for callers that only care about the primary
 * intent (EMERGENCY/PRICE_INQUIRY always win when present, since they
 * override the normal qualification flow regardless of co-mentioned
 * services — 02_CONVERSATION_FLOWS.md §2).
 */
export function detectPrimaryIntent(message: string): Intent {
  const intents = detectIntents(message);
  if (intents.includes("EMERGENCY")) return "EMERGENCY";
  if (intents.includes("PRICE_INQUIRY")) return "PRICE_INQUIRY";
  return intents[0];
}

export function hasMultipleServiceIntents(message: string): boolean {
  const serviceIntents: Intent[] = ["MAINTENANCE", "CLEANING", "PEST_CONTROL"];
  const matched = detectIntents(message).filter((intent) => serviceIntents.includes(intent));
  return matched.length > 1;
}
