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
 *
 * The actual turn logic (LLM-first/rule-based-fallback, lead recording)
 * lives in src/lib/chat/engine.ts, shared with the WhatsApp webhook
 * (src/app/api/whatsapp/webhook/route.ts) added 2026-08-06 — this route
 * is now just the HTTP contract for the website widget.
 */
import { NextRequest, NextResponse } from "next/server";
import type { ApiEnvelope, ApiErrorBody } from "@/types/api";
import { getOrCreateSession, saveSession } from "@/lib/chat/session";
import { runChatTurn } from "@/lib/chat/engine";

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
  const result = await runChatTurn({ state, message, source: "chat-widget-ai" });
  saveSession(sessionId, result.state);

  return NextResponse.json(
    envelope({
      replies: result.replies,
      options: result.options ?? [],
      complete: result.complete,
      escalated: result.escalated,
      submission: result.submission,
    })
  );
}

export async function GET() {
  return errorResponse(405, "method_not_allowed", "Use POST with { sessionId, message }");
}
