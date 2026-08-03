/**
 * LLM adapter interface — completes the "production transition" readiness
 * described in 08_DIGITAL_SYSTEMS/AI_CHATBOT/06_WEBSITE_INTEGRATION_PLAN.md
 * §6, without adding a new npm dependency or touching any credential.
 *
 * Why no SDK dependency yet: adding `@anthropic-ai/sdk` is a real
 * technology-decision-adjacent change (a new third-party runtime
 * dependency, package.json/package-lock.json diff) — left for an explicit
 * go-ahead alongside the ANTHROPIC_API_KEY credential itself (both are
 * needed together; there's no useful "half-wired" state). This file
 * defines the contract src/app/api/chat/route.ts will call once both
 * exist, so wiring the real SDK later is a single, contained change to
 * this file's function body — not a redesign of the route or the
 * qualification state machine, which stay exactly as they are.
 */

export type LlmAvailability =
  | { available: true }
  | { available: false; reason: "no_api_key" | "not_implemented" };

/**
 * Cheap, side-effect-free check the route can call before deciding
 * whether to use the LLM path or fall back to the rule-based MVP engine
 * (src/lib/chat-mvp/*, unchanged either way). Reading env var presence
 * is not the same as using a credential — no request is made here.
 */
export function checkLlmAvailability(): LlmAvailability {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { available: false, reason: "no_api_key" };
  }
  return { available: false, reason: "not_implemented" };
}

export type LlmTurnInput = {
  systemPrompt: string;
  conversationHistory: { role: "user" | "assistant"; content: string }[];
  message: string;
};

export type LlmTurnResult = {
  reply: string;
  /** Populated once tool-calling is implemented — the route will map
   * these to src/lib/chat/tools.ts's submitChatEnquiry/submitChatQuoteRequest/
   * recordChatConsent, per 06_WEBSITE_INTEGRATION_PLAN.md §6. */
  toolCalls: never[];
};

/**
 * Not implemented — throws deliberately rather than silently returning a
 * fabricated response. src/app/api/chat/route.ts must check
 * checkLlmAvailability() first and use the rule-based MVP path whenever
 * this would throw; it must never be called speculatively.
 */
export async function runLlmTurn(input: LlmTurnInput): Promise<LlmTurnResult> {
  void input; // signature kept for the future real implementation; unused until then
  throw new Error(
    "LLM adapter not implemented — requires the @anthropic-ai/sdk dependency and an Owner-approved ANTHROPIC_API_KEY (AUTONOMY_AND_APPROVAL_MATRIX.md, A4). The rule-based MVP engine (src/lib/chat-mvp/*) remains the production path until both are approved together."
  );
}
