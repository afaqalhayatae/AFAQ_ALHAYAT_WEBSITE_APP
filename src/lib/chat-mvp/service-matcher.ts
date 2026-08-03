/**
 * Maps free-text customer messages to a real, approved SVC- id.
 * Implements 08_DIGITAL_SYSTEMS/AI_CHATBOT/03_SERVICE_QUALIFICATION_RULES.md
 * §3 in the AFAQ_ALHAYAT_ENTERPRISE_KNOWLEDGE repo — never returns an
 * invented service; returns null when nothing matches so the caller can
 * ask a clarifying question instead of guessing.
 */

import { matchesKeyword } from "./keyword-match";

export type ServiceMatch = {
  serviceId: string;
  label: string;
  /** Set only for Pest Control, where the catalog has one service ID
   * covering many pest-type sub-topics (SERVICE_DATABASE.json subServices). */
  subTopic?: string;
};

type Rule = { pattern: string; match: ServiceMatch };

// Order matters: more specific patterns (e.g. "deep clean") must be
// checked before the generic fallback ("clean") that would otherwise
// shadow them.
const RULES: Rule[] = [
  { pattern: "deep clean", match: { serviceId: "SVC-DEEP-CLEANING", label: "Deep Cleaning" } },
  { pattern: "تنظيف عميق", match: { serviceId: "SVC-DEEP-CLEANING", label: "Deep Cleaning" } },
  { pattern: "villa clean", match: { serviceId: "SVC-VILLA-CLEANING", label: "Villa Cleaning" } },
  { pattern: "تنظيف فيلا", match: { serviceId: "SVC-VILLA-CLEANING", label: "Villa Cleaning" } },
  { pattern: "office clean", match: { serviceId: "SVC-OFFICE-CLEANING", label: "Office Cleaning" } },
  { pattern: "تنظيف مكتب", match: { serviceId: "SVC-OFFICE-CLEANING", label: "Office Cleaning" } },
  {
    pattern: "cockroach",
    match: { serviceId: "SVC-PEST-CONTROL", label: "Pest Control", subTopic: "Cockroach Control" },
  },
  {
    pattern: "roach",
    match: { serviceId: "SVC-PEST-CONTROL", label: "Pest Control", subTopic: "Cockroach Control" },
  },
  {
    pattern: "صرصور",
    match: { serviceId: "SVC-PEST-CONTROL", label: "Pest Control", subTopic: "Cockroach Control" },
  },
  {
    pattern: "bed bug",
    match: { serviceId: "SVC-PEST-CONTROL", label: "Pest Control", subTopic: "Bed Bug" },
  },
  { pattern: "بق", match: { serviceId: "SVC-PEST-CONTROL", label: "Pest Control", subTopic: "Bed Bug" } },
  {
    pattern: "termite",
    match: { serviceId: "SVC-PEST-CONTROL", label: "Pest Control", subTopic: "Termite Control" },
  },
  {
    pattern: "أرضة",
    match: { serviceId: "SVC-PEST-CONTROL", label: "Pest Control", subTopic: "Termite Control" },
  },
  { pattern: "ant", match: { serviceId: "SVC-PEST-CONTROL", label: "Pest Control", subTopic: "Ant Control" } },
  { pattern: "نمل", match: { serviceId: "SVC-PEST-CONTROL", label: "Pest Control", subTopic: "Ant Control" } },
  {
    pattern: "rodent",
    match: { serviceId: "SVC-PEST-CONTROL", label: "Pest Control", subTopic: "Rodent Control" },
  },
  { pattern: "mice", match: { serviceId: "SVC-PEST-CONTROL", label: "Pest Control", subTopic: "Rodent Control" } },
  {
    pattern: "mouse",
    match: { serviceId: "SVC-PEST-CONTROL", label: "Pest Control", subTopic: "Rodent Control" },
  },
  { pattern: "rat", match: { serviceId: "SVC-PEST-CONTROL", label: "Pest Control", subTopic: "Rodent Control" } },
  { pattern: "فئران", match: { serviceId: "SVC-PEST-CONTROL", label: "Pest Control", subTopic: "Rodent Control" } },
  { pattern: "قوارض", match: { serviceId: "SVC-PEST-CONTROL", label: "Pest Control", subTopic: "Rodent Control" } },
  { pattern: "حشرات", match: { serviceId: "SVC-PEST-CONTROL", label: "Pest Control" } },
  { pattern: "pest", match: { serviceId: "SVC-PEST-CONTROL", label: "Pest Control" } },
  { pattern: "ac", match: { serviceId: "SVC-AC-MAINTENANCE", label: "AC Maintenance" } },
  { pattern: "air condition", match: { serviceId: "SVC-AC-MAINTENANCE", label: "AC Maintenance" } },
  { pattern: "cooling", match: { serviceId: "SVC-AC-MAINTENANCE", label: "AC Maintenance" } },
  { pattern: "تكييف", match: { serviceId: "SVC-AC-MAINTENANCE", label: "AC Maintenance" } },
  { pattern: "plumb", match: { serviceId: "SVC-PLUMBING", label: "Plumbing" } },
  { pattern: "سباك", match: { serviceId: "SVC-PLUMBING", label: "Plumbing" } },
  { pattern: "electric", match: { serviceId: "SVC-ELECTRICAL-MAINTENANCE", label: "Electrical Maintenance" } },
  { pattern: "كهرب", match: { serviceId: "SVC-ELECTRICAL-MAINTENANCE", label: "Electrical Maintenance" } },
  { pattern: "clean", match: { serviceId: "SVC-GENERAL-CLEANING", label: "General Cleaning" } },
  { pattern: "نظافة", match: { serviceId: "SVC-GENERAL-CLEANING", label: "General Cleaning" } },
  { pattern: "تنظيف", match: { serviceId: "SVC-GENERAL-CLEANING", label: "General Cleaning" } },
];

export function matchService(message: string): ServiceMatch | null {
  const normalized = message.toLowerCase();
  for (const rule of RULES) {
    if (matchesKeyword(normalized, rule.pattern)) {
      return rule.match;
    }
  }
  return null;
}
