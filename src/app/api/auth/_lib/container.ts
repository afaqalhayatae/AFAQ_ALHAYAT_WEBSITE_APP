/**
 * Shared adapter instances for the Auth API boundary
 * (JOB-AGT-WEB-20260726-M2.1). A private folder (`_lib`) per Next.js
 * convention — not a route — so every sibling route under src/app/api/auth
 * shares the same repositories and password provider.
 *
 * user/credential/session repositories are deliberately untouched — still
 * the plain in-memory adapters (User/Session/PasswordCredential are not in
 * the six-entity migration priority list, though a schema now exists for
 * them per 06_DATABASE_FOUNDATION_IMPLEMENTATION_PLAN.md §1.3). AuditEvent
 * (Phase 1J — the last of the six-entity migration series) goes through
 * the repository factory — see
 * 07_WEBSITE/BOOKING_SYSTEM/08_REPOSITORY_SWITCHOVER_PLAN.md.
 */

import { createInMemoryUserRepository } from "@/lib/adapters/in-memory/user-repository";
import { createInMemoryCredentialRepository } from "@/lib/adapters/in-memory/credential-repository";
import { createInMemorySessionRepository } from "@/lib/adapters/in-memory/session-repository";
import { getAuditEventRepository } from "@/lib/adapters/repository-factory";
import { createPasswordAuthProvider } from "@/lib/adapters/password/password-provider";
import { createGoogleOAuthProvider } from "@/lib/adapters/google/google-oauth-provider";
import type { GoogleAuthProviderAdapter } from "@/lib/adapters/types";

export const userRepository = createInMemoryUserRepository();
export const credentialRepository = createInMemoryCredentialRepository();
export const sessionRepository = createInMemorySessionRepository();
export const auditEventRepository = getAuditEventRepository();
export const passwordProvider = createPasswordAuthProvider();

/**
 * Google Login upgrade. undefined unless both GOOGLE_CLIENT_ID and
 * GOOGLE_CLIENT_SECRET are set — real by default in every environment
 * today (`.env.example` ships both empty), so /api/auth/google/* routes
 * must check for undefined and respond with a clear "not configured"
 * error rather than assume this is always present.
 */
export function getGoogleOAuthProvider(): GoogleAuthProviderAdapter | undefined {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return undefined;
  }
  return createGoogleOAuthProvider({ clientId, clientSecret });
}
