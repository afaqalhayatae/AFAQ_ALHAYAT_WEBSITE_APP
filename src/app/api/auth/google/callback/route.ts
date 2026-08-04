/**
 * Google Login upgrade — Authorization Code + PKCE callback. Verifies the
 * signed state (CSRF + PKCE code_verifier carrier), exchanges the code,
 * verifies the ID token, then finds-or-creates a User and issues a session
 * through the exact same createSession/setSessionCookie path every other
 * login already uses — no parallel session mechanism.
 *
 * Any failure here redirects back to the login page rather than returning
 * a JSON error — this route is only ever reached via a top-level browser
 * navigation (the redirect from Google), never a fetch() call, so a JSON
 * error body would just be a broken-looking page, not a usable response.
 */

import { NextRequest, NextResponse } from "next/server";
import { getGoogleOAuthProvider, sessionRepository, userRepository, auditEventRepository } from "../../_lib/container";
import { setSessionCookie } from "../../_lib/session-cookie";
import { verifyOAuthState } from "@/lib/services/oauth-state";
import { loginOrRegisterWithGoogle } from "@/lib/services/identity-service";
import { defaultLocale } from "@/i18n/config";
import { SITE_URL } from "@/lib/brand/links";

const ACTOR = "google-oauth";

function siteOrigin(): string {
  return process.env.NODE_ENV === "production" ? SITE_URL : "http://localhost:3000";
}

export async function GET(request: NextRequest) {
  const origin = siteOrigin();
  const loginFallback = (locale: string) => NextResponse.redirect(`${origin}/${locale}/login`);

  const provider = getGoogleOAuthProvider();
  if (!provider) {
    return loginFallback(defaultLocale);
  }

  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const consentError = searchParams.get("error");

  if (!state) {
    return loginFallback(defaultLocale);
  }

  let codeVerifier: string;
  let locale: string;
  try {
    ({ codeVerifier, locale } = verifyOAuthState(state));
  } catch {
    return loginFallback(defaultLocale);
  }

  // User denied consent on Google's screen, or Google returned no code —
  // a normal, expected outcome, not a system error.
  if (consentError || !code) {
    return loginFallback(locale);
  }

  try {
    const idToken = await provider.exchangeCodeForIdToken({ code, codeVerifier });
    const identity = await provider.verifyIdToken(idToken);

    const { session } = await loginOrRegisterWithGoogle(
      { users: userRepository, sessions: sessionRepository, auditEvents: auditEventRepository },
      {
        providerAccountId: identity.providerAccountId,
        email: identity.email,
        emailVerified: identity.emailVerified,
        displayName: identity.displayName,
        avatarUrl: identity.avatarUrl,
        actor: ACTOR,
      }
    );

    await setSessionCookie(session.id);
    return NextResponse.redirect(`${origin}/${locale}/account`);
  } catch {
    // Deliberately generic — never reflect provider/internal error detail
    // into a redirect target, matching the same no-account-enumeration,
    // no-detail-leak posture already used throughout this identity layer.
    return loginFallback(locale);
  }
}
