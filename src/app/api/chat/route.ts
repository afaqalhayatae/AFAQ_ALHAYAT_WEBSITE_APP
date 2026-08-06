/**
 * Chat API route — website-integrated version of the standalone MVP
 * (src/lib/chat-mvp/*), now with a real LLM path layered on top.
 * Per 08_DIGITAL_SYSTEMS/AI_CHATBOT/06_WEBSITE_INTEGRATION_PLAN.md.
 *
 * When OPENAI_API_KEY is set (checkLlmAvailability()), every turn goes
 * through the real model (src/lib/chat/llm-adapter.ts) instead of the
 * rule-based qualification state machine — it can answer open-ended
 * questions, not just the fixed question sequence, and still lands leads
 * in the exact same Enquiry/Quote/Consent service layer via
 * src/lib/chat/tools.ts. Any LLM failure (bad key, network, rate limit)
 * falls back to the rule-based engine for that turn rather than
 * surfacing a raw error — the rule-based path is never removed.
 */
import { NextRequest, NextResponse } from "next/server";
import type { ApiEnvelope, ApiErrorBody } from "@/types/api";
import { handleMessage, type ConversationState } from "@/lib/chat-mvp/qualification-flow";
import { getOrCreateSession, saveSession } from "@/lib/chat/session";
import { recordChatConsent, submitChatEnquiry, submitChatQuoteRequest } from "@/lib/chat/tools";
import { checkLlmAvailability, runLlmTurn, type RecordLeadArgs } from "@/lib/chat/llm-adapter";
import { buildSystemPrompt } from "@/lib/chat/system-prompt";

const API_VERSION = "v1";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function envelope<T>(data: T): ApiEnvelope<T> {
  return { apiVersion: API_VERSION, correlationId: crypto.randomUUID(), data };
}

function errorResponse(status: number, code: string, message: string, retryable = false) {
  const body: ApiErrorBody = {
    apiVersion: API_VERSION,
    correlationId: crypto.randomUUID(),
    error: { code, message, retryable },
  };
  return NextResponse.json(body, { status });
}

/**
 * The MVP's "contact" question captures one free-text answer (e.g.
 * "Ahmed, 0501234567") rather than separate name/phone fields — kept
 * as-is per the "do not restructure the MVP" instruction. This extracts
 * a phone-like substring and treats the remainder as the name, which is
 * good enough for a first integrated pass; a dedicated name+phone
 * question pair is a small, separate follow-up if this proves too
 * lossy in practice.
 */
function parseContact(raw: string): { name: string; phoneE164: string } | null {
  const phoneMatch = raw.match(/(\+?\d[\d\s-]{6,}\d)/);
  if (!phoneMatch) return null;
  const phoneDigits = phoneMatch[0].replace(/[\s-]/g, "");
  const phoneE164 = phoneDigits.startsWith("+") ? phoneDigits : `+971${phoneDigits.replace(/^0/, "")}`;
  const name = raw.replace(phoneMatch[0], "").replace(/[,;]/g, "").trim() || "Website chat customer";
  return { name, phoneE164 };
}

async function trySubmit(
  state: ConversationState
): Promise<{ recorded: boolean; reference?: string }> {
  const contactRaw = state.answers.contact;
  if (!contactRaw) return { recorded: false };
  const contact = parseContact(contactRaw);
  if (!contact) return { recorded: false };

  await recordChatConsent({
    channel: "phone",
    purpose: "chatbot_lead_contact",
    source: "chat-widget",
    evidence: `Customer provided contact details and completed qualification via chat widget: "${contactRaw}"`,
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

  // Enquiry has no dedicated evidence field (unlike QuoteRequest) — append
  // as plain text so uploaded photos/location still reach the team.
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
 * above), so an LLM-captured lead lands in the exact same place. Any
 * uploaded attachments/shared location already on the session are folded
 * in as evidence, same as the rule-based path.
 */
async function recordLlmLead(
  state: ConversationState,
  args: RecordLeadArgs
): Promise<{ recorded: boolean; reference?: string }> {
  const evidence = [...state.attachments, ...(state.locationLink ? [state.locationLink] : [])];

  await recordChatConsent({
    channel: "phone",
    purpose: "chatbot_lead_contact",
    source: "chat-widget-ai",
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

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "invalid_json", "Request body must be valid JSON");
  }
  if (typeof body !== "object" || body === null) {
    return errorResponse(400, "invalid_body", "Request body must be a JSON object");
  }

  const { sessionId, message } = body as Record<string, unknown>;
  if (!isNonEmptyString(sessionId) || !isNonEmptyString(message)) {
    return errorResponse(400, "validation_error", "sessionId and message are required non-empty strings");
  }

  const state = getOrCreateSession(sessionId);

  if (checkLlmAvailability().available) {
    try {
      let submission: { recorded: boolean; reference?: string } = { recorded: false };
      const result = await runLlmTurn({
        systemPrompt: buildSystemPrompt(),
        conversationHistory: state.messageHistory,
        message,
        onRecordLead: async (args) => {
          try {
            submission = await recordLlmLead(state, args);
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
      saveSession(sessionId, nextState);

      return NextResponse.json(
        envelope({
          replies: [{ en: result.reply, ar: result.reply }],
          options: [],
          complete: result.leadRecorded,
          escalated: false,
          submission,
        })
      );
    } catch (err) {
      console.error("[chat] LLM turn failed, falling back to rule-based engine:", err);
      // Any LLM failure (bad key, network, rate limit) falls back to the
      // rule-based engine below for this turn — never a raw error to the
      // customer, and never a silently dropped message.
    }
  }

  const { state: nextState, replies, options } = handleMessage(state, message);
  saveSession(sessionId, nextState);

  let submission: { recorded: boolean; reference?: string } = { recorded: false };
  if (nextState.complete) {
    try {
      submission = await trySubmit(nextState);
    } catch {
      // A submission failure must never surface as a fabricated success —
      // the conversation reply already summarized the request; the
      // customer can still be reached via the phone/WhatsApp CTA even if
      // the in-memory write failed for some reason.
      submission = { recorded: false };
    }
  }

  return NextResponse.json(
    envelope({
      replies,
      options: options ?? [],
      complete: nextState.complete,
      escalated: nextState.escalated,
      submission,
    })
  );
}

export async function GET() {
  return errorResponse(405, "method_not_allowed", "Use POST with { sessionId, message }");
}
