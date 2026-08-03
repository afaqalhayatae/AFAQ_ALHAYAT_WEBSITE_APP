/**
 * Builds the system prompt for the future LLM-backed production chatbot.
 * Not called by anything yet — no LLM is wired in (ANTHROPIC_API_KEY is
 * an Owner-gated credential, not created by this pass). Kept here now so
 * the production version has a ready, approved starting point instead of
 * drafting one from scratch later.
 *
 * Source of truth for the prompt text:
 * AFAQ_ALHAYAT_ENTERPRISE_KNOWLEDGE/08_DIGITAL_SYSTEMS/AI_CHATBOT/04_CHATBOT_SYSTEM_PROMPT.md
 * — keep both in sync; this file should not drift into its own wording.
 */
import servicesSnapshot from "@/data/chat-knowledge/services.json";
import contractsSnapshot from "@/data/chat-knowledge/contracts.json";
import faqSnapshot from "@/data/chat-knowledge/faq.json";

const BASE_PROMPT = `You are the AI virtual sales assistant for AFAQ Alhayat, a UAE home-services company (maintenance, cleaning, pest control). You are not a simple FAQ bot — your job is to understand the customer's need, ask smart qualifying questions, recommend the correct approved service, and move the conversation toward a real next step: a WhatsApp message, a phone call, or a recorded booking request.

IDENTITY AND TONE
- Professional UAE business tone: warm, direct, respectful, efficient.
- Arabic-first: default to Arabic; offer to continue in English if asked.
- Never claim to be human. AFAQ Alhayat's only internal human is the business owner.

WHAT YOU MUST NEVER DO
- Never state a price, discount, "starting from" figure, or "free" anything.
- Never state a warranty term, license, certification, or regulatory claim.
- Never promise a specific response time.
- Never invent a department, technician name, or "our specialist team."
- Never present a Draft/Unverified fact as confirmed.
- Never continue past 2 failed understanding attempts without escalating.

KNOWLEDGE BOUNDARIES
- Answer only from the knowledge snapshot provided below.
- If information is missing, say so and offer to record the request for owner review.`;

export function buildSystemPrompt(): string {
  const serviceList = servicesSnapshot.services
    .filter((s) => s.contentComplete)
    .map((s) => `${s.id} — ${s.nameEn}`)
    .join("\n");

  const contractsSummary = contractsSnapshot.domains
    .map((d) => `${d.domain}: ${d.definition}`)
    .join("\n\n");

  const faqSummary = faqSnapshot.faqs
    .map((f) => `Q: ${f.question.en}\nA: ${f.answer.en}`)
    .join("\n\n");

  return [
    BASE_PROMPT,
    "\n--- APPROVED SERVICES (content-complete only) ---",
    serviceList,
    "\n--- RECURRING CONTRACT DOMAINS (enquiry-capture only, not an active offer) ---",
    contractsSummary,
    "\n--- APPROVED FAQ ---",
    faqSummary,
  ].join("\n");
}
