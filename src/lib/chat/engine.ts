/**
 * Shared conversational-turn engine — extracted 2026-08-06 when the
 * WhatsApp channel was added, so the website chat widget
 * (src/app/api/chat/route.ts) and the official WhatsApp Business webhook
 * (src/app/api/whatsapp/webhook/route.ts) run the exact same LLM-first/
 * rule-based-fallback logic and the exact same lead-recording tools
 * (src/lib/chat/tools.ts) — a lead captured on either channel lands in
 * the same Enquiry/QuoteRequest pipeline, not two parallel copies of it.
 */
import { handleMessage, type ConversationState } from "@/lib/chat-mvp/qualification-flow";
import type { Bilingual } from "@/lib/chat-mvp/responses";
import { recordChatConsent, submitChatEnquiry, submitChatQuoteRequest } from "@/lib/chat/tools";
import { checkLlmAvailability, runLlmTurn, type RecordLeadArgs } from "@/lib/chat/llm-adapter";
import { buildSystemPrompt } from "@/lib/chat/system-prompt";

export type ChatTurnResult = {
  state: ConversationState;
  /** Bilingual for the rule-based path (both fields genuinely differ);
   *  the LLM path already replies in the customer's own language, so both
   *  fields hold the same text — same contract src/app/api/chat/route.ts
   *  already returned before this extraction. */
  replies: Bilingual[];
  options?: Bilingual[];
  complete: boolean;
  escalated: boolean;
  submission: { recorded: boolean; reference?: string };
};

/**
 * The MVP's "contact" question captures one free-text answer (e.g.
 * "Ahmed, 0501234567") rather than separate name/phone fields — kept
 * as-is per the "do not restructure the MVP" instruction. This extracts
 * a phone-like substring and treats the remainder as the name.
 */
function parseContact(raw: string): { name: string; phoneE164: string } | null {
  const phoneMatch = raw.match(/(\+?\d[\d\s-]{6,}\d)/);
  if (!phoneMatch) return null;
  const phoneDigits = phoneMatch[0].replace(/[\s-]/g, "");
  const phoneE164 = phoneDigits.startsWith("+") ? phoneDigits : `+971${phoneDigits.replace(/^0/, "")}`;
  const name = raw.replace(phoneMatch[0], "").replace(/[,;]/g, "").trim() || "Chat customer";
  return { name, phoneE164 };
}

async function trySubmit(state: ConversationState): Promise<{ recorded: boolean; reference?: string }> {
  const contactRaw = state.answers.contact;
  if (!contactRaw) return { recorded: false };
  const contact = parseContact(contactRaw);
  if (!contact) return { recorded: false };

  await recordChatConsent({
    channel: "phone",
    purpose: "chatbot_lead_contact",
    source: "chat-widget",
    evidence: `Customer provided contact details and completed qualification via chat: "${contactRaw}"`,
  });

  const need = state.answers.problem ?? state.serviceMatch?.label ?? "General enquiry via chat";
  const evidence = [...state.attachments, ...(state.locationLink ? [state.locationLink] : [])];

  if (state.serviceMatch) {
    const record = await submitChatQuoteRequest({
      name: contact.name,
      phoneE164: contact.phoneE164,
      serviceId: state.serviceMatch.serviceId as `SVC-${string}`,
      requirements: need,
      evidence,
    });
    return { recorded: true, reference: record.id };
  }

  const needWithEvidence = evidence.length > 0 ? `${need}\n\nAttachments: ${evidence.join(", ")}` : need;
  const record = await submitChatEnquiry({
    name: contact.name,
    phoneE164: contact.phoneE164,
    need: needWithEvidence,
  });
  return { recorded: true, reference: record.id };
}

/**
 * Records a lead the LLM path captured via its record_lead tool call —
 * same underlying tools.ts functions the rule-based path uses (trySubmit
 * above), so an LLM-captured lead lands in the exact same place.
 */
async function recordLlmLead(
  state: ConversationState,
  args: RecordLeadArgs,
  source: string
): Promise<{ recorded: boolean; reference?: string }> {
  const evidence = [...state.attachments, ...(state.locationLink ? [state.locationLink] : [])];

  await recordChatConsent({
    channel: "phone",
    purpose: "chatbot_lead_contact",
    source,
    evidence: `Customer provided contact details and a need via the AI chat assistant: name="${args.name}", need="${args.need}"`,
  });

  const needWithEvidence = evidence.length > 0 ? `${args.need}\n\nAttachments: ${evidence.join(", ")}` : args.need;
  const record = await submitChatEnquiry({
    name: args.name,
    phoneE164: args.phoneE164,
    need: needWithEvidence,
  });
  return { recorded: true, reference: record.id };
}

export type ChatTurnParams = {
  state: ConversationState;
  message: string;
  /** Identifies which channel is calling, purely for the Consent record's
   *  `source` field (audit trail) — "chat-widget-ai" for the website,
   *  "whatsapp" for the WhatsApp channel. */
  source: string;
};

/**
 * Advances a conversation by exactly one customer message, trying the
 * real LLM first (if OPENAI_API_KEY is set) and falling back to the
 * rule-based qualification flow on any LLM failure — never a raw error
 * surfaced to the customer, and never a silently dropped message.
 */
export async function runChatTurn(params: ChatTurnParams): Promise<ChatTurnResult> {
  const { state, message, source } = params;

  if (checkLlmAvailability().available) {
    try {
      let submission: { recorded: boolean; reference?: string } = { recorded: false };
      const result = await runLlmTurn({
        systemPrompt: buildSystemPrompt(),
        conversationHistory: state.messageHistory,
        message,
        onRecordLead: async (args) => {
          try {
            submission = await recordLlmLead(state, args, source);
            return submission.recorded
              ? `Recorded successfully. Reference: ${submission.reference}.`
              : "Could not be recorded due to a system error — apologize and give the customer the phone/WhatsApp number instead.";
          } catch {
            submission = { recorded: false };
            return "Could not be recorded due to a system error — apologize and give the customer the phone/WhatsApp number instead.";
          }
        },
      });

      const nextState: ConversationState = {
        ...state,
        messageHistory: [
          ...state.messageHistory,
          { role: "user", content: message },
          { role: "assistant", content: result.reply },
        ],
        complete: result.leadRecorded,
      };

      return {
        state: nextState,
        replies: [{ en: result.reply, ar: result.reply }],
        complete: result.leadRecorded,
        escalated: false,
        submission,
      };
    } catch (err) {
      console.error("[chat] LLM turn failed, falling back to rule-based engine:", err);
      // Any LLM failure (bad key, network, rate limit) falls back to the
      // rule-based engine below for this turn.
    }
  }

  const { state: nextState, replies, options } = handleMessage(state, message);

  let submission: { recorded: boolean; reference?: string } = { recorded: false };
  if (nextState.complete) {
    try {
      submission = await trySubmit(nextState);
    } catch {
      submission = { recorded: false };
    }
  }

  return {
    state: nextState,
    replies,
    options,
    complete: nextState.complete,
    escalated: nextState.escalated,
    submission,
  };
}
