/**
 * "Session Management" layer (JOB-AGT-WEB-20260726-M2.1) — the layer beneath
 * every Auth Provider Adapter in the approved architecture. Once any
 * provider (password today; Google or phone OTP later) confirms an
 * identity, this module is the single place that issues, validates, and
 * revokes sessions.
 */

import type { Session } from "@/types/identity";
import type { SessionRepository } from "@/lib/adapters/types";
import { generateId } from "./audit";
import { SessionExpiredError, SessionNotFoundError } from "./errors";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function createSession(
  deps: { sessions: SessionRepository },
  userId: Session["userId"]
): Session {
  const now = Date.now();
  const session: Session = {
    id: generateId("sess"),
    userId,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_TTL_MS).toISOString(),
  };
  deps.sessions.create(session);
  return session;
}

export function validateSession(
  deps: { sessions: SessionRepository },
  sessionId: Session["id"]
): Session {
  const session = deps.sessions.findById(sessionId);
  if (!session) {
    throw new SessionNotFoundError(sessionId);
  }
  if (Date.now() > Date.parse(session.expiresAt)) {
    deps.sessions.revoke(sessionId);
    throw new SessionExpiredError(sessionId);
  }
  return session;
}

export function revokeSession(
  deps: { sessions: SessionRepository },
  sessionId: Session["id"]
): void {
  deps.sessions.revoke(sessionId);
}
