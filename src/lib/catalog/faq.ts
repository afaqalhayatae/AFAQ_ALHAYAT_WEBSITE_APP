/**
 * FAQ content registry (JOB-AGT-WEB-20260726-M4.1).
 *
 * This is architecture, not content: every FAQ source in the knowledge
 * base (per-service FAQ.md files, GENERAL_SERVICE_FAQ_DRAFT.md) is marked
 * Draft / "Not Approved for Publication" today. Per SCHEMA_STRATEGY.md,
 * FAQPage structured data may only describe visible, approved content —
 * so this list stays empty until a specific Q&A is explicitly approved
 * for publication. The FAQ page and its JSON-LD both read from this
 * array directly, so adding an approved entry here is the entire
 * publishing step; no other code changes are needed.
 */

export type FaqCategory = "services" | "booking" | "locations";

export type FaqItem = {
  id: string;
  category: FaqCategory;
  /** Only set on `category: "services"` items — ties a Q&A to one service slug. */
  serviceSlug?: string;
  question: { en: string; ar: string };
  answer: { en: string; ar: string };
};

export const FAQ_CATEGORIES: FaqCategory[] = ["services", "booking", "locations"];

export const APPROVED_FAQS: FaqItem[] = [];

export function getServiceFaqs(slug: string): FaqItem[] {
  return APPROVED_FAQS.filter((item) => item.category === "services" && item.serviceSlug === slug);
}
