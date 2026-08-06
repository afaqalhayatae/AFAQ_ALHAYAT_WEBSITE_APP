/**
 * Server-side, in-memory, cookie-keyed conversation state store for the
 * chat API route. Per 08_DIGITAL_SYSTEMS/AI_CHATBOT/06_WEBSITE_INTEGRATION_PLAN.md
 * §3: ephemeral scaffolding, not the Customer/Enquiry record itself, and
 * shares the same "lost on server restart" caveat as every other
 * in-memory store in this app today (not a new gap introduced by chat).
 */
import { createInitialState, type ConversationState } from "@/lib/chat-mvp/qualification-flow";

const sessions = new Map<string, ConversationState>();

export function getOrCreateSession(sessionId: string): ConversationState {
  const existing = sessions.get(sessionId);
  if (existing) return existing;
  const fresh = createInitialState();
  sessions.set(sessionId, fresh);
  return fresh;
}

export function saveSession(sessionId: string, state: ConversationState): void {
  sessions.set(sessionId, state);
}

export function clearSession(sessionId: string): void {
  sessions.delete(sessionId);
}

/** Appends an uploaded file's public URL to the session's evidence list —
 *  see src/app/api/chat/upload/route.ts. */
export function appendAttachment(sessionId: string, url: string): void {
  const state = getOrCreateSession(sessionId);
  state.attachments = [...state.attachments, url];
  saveSession(sessionId, state);
}

/** Records a customer-shared location link on the session — see
 *  src/app/api/chat/location/route.ts. Overwrites any previous value;
 *  only the most recent shared location is kept. */
export function setSessionLocation(sessionId: string, locationLink: string): void {
  const state = getOrCreateSession(sessionId);
  state.locationLink = locationLink;
  saveSession(sessionId, state);
}

/** Exported for tests only — mirrors the pattern the existing in-memory
 * repositories already use ("exported so tests can seed and inspect
 * state directly"). */
export const _sessionStoreForTests = sessions;
