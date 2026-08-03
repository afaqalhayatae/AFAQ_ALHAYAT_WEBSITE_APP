/**
 * Chat API route — website-integrated version of the standalone MVP
 * (src/lib/chat-mvp/*). Runs the same tested qualification state machine
 * as the CLI demo, but now callable from a real widget and wired to the
 * real Enquiry/Quote/Consent service layer via src/lib/chat/tools.ts.
 * Per 08_DIGITAL_SYSTEMS/AI_CHATBOT/06_WEBSITE_INTEGRATION_PLAN.md.
 *
 * No LLM call here yet — ANTHROPIC_API_KEY is an Owner-gated credential
 * (AUTONOMY_AND_APPROVAL_MATRIX.md, A4) not created by this pass. This
 * route runs the rule-based MVP engine today; swapping the intent-
 * detection step for a real LLM call later does not require changing
 * this route's request/response contract (06_WEBSITE_INTEGRATION_PLAN.md
 * §6 — the qualification state machine is reused as-is).
 */
import { NextRequest, NextResponse } from "next/server";
import type { ApiEnvelope, ApiErrorBody } from "@/types/api";
import { handleMessage, type ConversationState } from "@/lib/chat-mvp/qualification-flow";
import { getOrCreateSession, saveSession } from "@/lib/chat/session";
import { recordChatConsent, submitChatEnquiry, submitChatQuoteRequest } from "@/lib/chat/tools";

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

function trySubmit(state: ConversationState): { recorded: boolean; reference?: string } {
  const contactRaw = state.answers.contact;
  if (!contactRaw) return { recorded: false };
  const contact = parseContact(contactRaw);
  if (!contact) return { recorded: false };

  recordChatConsent({
    channel: "phone",
    purpose: "chatbot_lead_contact",
    source: "chat-widget",
    evidence: `Customer provided contact details and completed qualification via chat widget: "${contactRaw}"`,
  });

  const need = state.answers.problem ?? state.serviceMatch?.label ?? "General enquiry via chat";

  if (state.serviceMatch) {
    const record = submitChatQuoteRequest({
      name: contact.name,
      phoneE164: contact.phoneE164,
      serviceId: state.serviceMatch.serviceId as `SVC-${string}`,
      requirements: need,
      evidence: [],
    });
    return { recorded: true, reference: record.id };
  }

  const record = submitChatEnquiry({ name: contact.name, phoneE164: contact.phoneE164, need });
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
  const { state: nextState, replies } = handleMessage(state, message);
  saveSession(sessionId, nextState);

  let submission: { recorded: boolean; reference?: string } = { recorded: false };
  if (nextState.complete) {
    try {
      submission = trySubmit(nextState);
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
      complete: nextState.complete,
      escalated: nextState.escalated,
      submission,
    })
  );
}

export async function GET() {
  return errorResponse(405, "method_not_allowed", "Use POST with { sessionId, message }");
}
