/**
 * Signed OAuth `state` parameter (Google Login upgrade) — the CSRF defense
 * required by 08_AUTHENTICATION_ARCHITECTURE.md §14.3 ("state parameter
 * against CSRF on the callback"). Also carries the PKCE code_verifier
 * across the redirect, since this app has no server-side session storage
 * for the handshake itself (sessions only exist *after* login succeeds).
 *
 * HMAC-SHA256 over the payload using AUTH_SECRET — not a JWT library and
 * not a new dependency, matching password-provider.ts's existing "use
 * Node's built-in crypto, don't wait on a library approval" precedent.
 * The verifier travels inside a signed, expiring token, never in a
 * separate cookie or server-side store — an attacker without AUTH_SECRET
 * cannot forge or tamper with it, and a stale/replayed state is rejected
 * by the expiry check below.
 */

import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { OAuthStateInvalidError } from "./errors";

const STATE_TTL_MS = 10 * 60 * 1000;

/**
 * PKCE pair (RFC 7636, S256 method) — provider-agnostic OAuth2 mechanics,
 * not Google-specific, so it lives here rather than in the Google adapter.
 * Reusable as-is for a future Apple Sign In adapter (Apple also supports
 * PKCE), per the "keep the system expandable" requirement.
 */
export function generatePkcePair(): { codeVerifier: string; codeChallenge: string } {
  const codeVerifier = randomBytes(32).toString("base64url");
  const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");
  return { codeVerifier, codeChallenge };
}

interface OAuthStatePayload {
  nonce: string;
  codeVerifier: string;
  locale: string;
  issuedAt: number;
}

function base64url(input: Buffer): string {
  return input.toString("base64url");
}

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET is not set — required to sign/verify the OAuth state parameter. See .env.example."
    );
  }
  return secret;
}

function sign(payloadB64: string): string {
  return base64url(createHmac("sha256", getAuthSecret()).update(payloadB64).digest());
}

/** Produces a signed state string embedding a fresh PKCE code_verifier and the initiating locale. */
export function signOAuthState(codeVerifier: string, locale: string): string {
  const payload: OAuthStatePayload = {
    nonce: randomBytes(16).toString("hex"),
    codeVerifier,
    locale,
    issuedAt: Date.now(),
  };
  const payloadB64 = base64url(Buffer.from(JSON.stringify(payload)));
  return `${payloadB64}.${sign(payloadB64)}`;
}

/**
 * Verifies signature + freshness and returns the embedded code_verifier
 * and locale. Throws OAuthStateInvalidError on any failure — malformed,
 * tampered, or expired — never falls back to trusting an
 * unsigned/unverified value.
 */
export function verifyOAuthState(state: string): { codeVerifier: string; locale: string } {
  const parts = state.split(".");
  if (parts.length !== 2) {
    throw new OAuthStateInvalidError();
  }
  const [payloadB64, signature] = parts;

  const expectedSignature = sign(payloadB64);
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    throw new OAuthStateInvalidError();
  }

  let payload: OAuthStatePayload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString());
  } catch {
    throw new OAuthStateInvalidError();
  }

  if (
    typeof payload.codeVerifier !== "string" ||
    typeof payload.locale !== "string" ||
    typeof payload.issuedAt !== "number" ||
    Date.now() - payload.issuedAt > STATE_TTL_MS
  ) {
    throw new OAuthStateInvalidError();
  }

  return { codeVerifier: payload.codeVerifier, locale: payload.locale };
}
