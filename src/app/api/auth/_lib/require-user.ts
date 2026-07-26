/**
 * Shared "who is signed in" resolution for the Auth API boundary
 * (JOB-AGT-WEB-20260726-M2.1, extended M2.2). Reads the session id only
 * from the httpOnly cookie, validates it through the Identity Service, and
 * clears the cookie if the session is missing or expired. Used by every
 * route that needs to know the current user — auth/session and, in M2.2,
 * the account API boundary.
 */

import { getCurrentUser } from "@/lib/services/identity-service";
import { SessionExpiredError, SessionNotFoundError } from "@/lib/services/errors";
import { sessionRepository, userRepository } from "./container";
import { clearSessionCookie, readSessionId } from "./session-cookie";
import type { User } from "@/types/identity";

export async function resolveCurrentUser(): Promise<User | null> {
  const sessionId = await readSessionId();
  if (!sessionId) {
    return null;
  }
  try {
    return getCurrentUser({ users: userRepository, sessions: sessionRepository }, sessionId);
  } catch (error) {
    if (error instanceof SessionNotFoundError || error instanceof SessionExpiredError) {
      await clearSessionCookie();
      return null;
    }
    throw error;
  }
}
