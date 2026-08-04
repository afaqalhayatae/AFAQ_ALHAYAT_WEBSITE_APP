/**
 * Concrete Google Sign-In adapter (Google Login upgrade). Authorization
 * Code + PKCE flow via google-auth-library's OAuth2Client, per
 * 08_AUTHENTICATION_ARCHITECTURE.md §5/§14.3. Requires GOOGLE_CLIENT_ID
 * and GOOGLE_CLIENT_SECRET — both unset by default (`.env.example`), so
 * this adapter is only ever constructed by a route if both are present
 * (see src/app/api/auth/google/route.ts) — nothing Google-related runs
 * without real, Owner-supplied credentials.
 */

import { CodeChallengeMethod, OAuth2Client } from "google-auth-library";
import type { GoogleAuthProviderAdapter } from "@/lib/adapters/types";
import { SITE_URL } from "@/lib/brand/links";

const GOOGLE_OAUTH_SCOPE = ["openid", "email", "profile"];

/**
 * Never derived from request headers (host-header-injection risk, per
 * 08_AUTHENTICATION_ARCHITECTURE.md §14.3) — production uses the fixed
 * canonical domain; local/dev uses localhost, matching the pattern already
 * used by robots.ts for the same production/non-production distinction.
 */
export function googleOAuthRedirectUri(): string {
  const base = process.env.NODE_ENV === "production" ? SITE_URL : "http://localhost:3000";
  return `${base}/api/auth/google/callback`;
}

export function createGoogleOAuthProvider(config: {
  clientId: string;
  clientSecret: string;
}): GoogleAuthProviderAdapter {
  const client = new OAuth2Client({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    redirectUri: googleOAuthRedirectUri(),
  });

  return {
    getAuthorizationUrl({ state, codeChallenge }) {
      return client.generateAuthUrl({
        access_type: "online",
        scope: GOOGLE_OAUTH_SCOPE,
        state,
        code_challenge: codeChallenge,
        code_challenge_method: CodeChallengeMethod.S256,
      });
    },

    async exchangeCodeForIdToken({ code, codeVerifier }) {
      const { tokens } = await client.getToken({ code, codeVerifier });
      if (!tokens.id_token) {
        throw new Error("Google token exchange did not return an id_token");
      }
      return tokens.id_token;
    },

    async verifyIdToken(idToken) {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: config.clientId,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.sub || !payload.email) {
        throw new Error("Google ID token missing required claims (sub/email)");
      }
      return {
        providerAccountId: payload.sub,
        email: payload.email,
        emailVerified: payload.email_verified ?? false,
        displayName: payload.name,
        avatarUrl: payload.picture,
      };
    },
  };
}
