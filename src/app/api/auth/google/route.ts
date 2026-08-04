/**
 * Google Login upgrade — initiates the Authorization Code + PKCE flow.
 * GET (not POST) because this route's entire job is to redirect the
 * browser to Google's consent screen — the "Continue with Google" button
 * is a plain link/navigation, not a fetch() call, unlike every other auth
 * route in this app.
 */

import { NextRequest, NextResponse } from "next/server";
import { getGoogleOAuthProvider } from "../_lib/container";
import { errorResponse } from "../_lib/http";
import { generatePkcePair, signOAuthState } from "@/lib/services/oauth-state";
import { defaultLocale, isLocale } from "@/i18n/config";

export async function GET(request: NextRequest) {
  const provider = getGoogleOAuthProvider();
  if (!provider) {
    return errorResponse(
      503,
      "not_configured",
      "Google sign-in is not configured yet (GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET unset)"
    );
  }
  if (!process.env.AUTH_SECRET) {
    return errorResponse(
      503,
      "not_configured",
      "Google sign-in is not configured yet (AUTH_SECRET unset)"
    );
  }

  const localeParam = request.nextUrl.searchParams.get("locale");
  const locale = localeParam && isLocale(localeParam) ? localeParam : defaultLocale;

  const { codeVerifier, codeChallenge } = generatePkcePair();
  const state = signOAuthState(codeVerifier, locale);

  const authorizationUrl = provider.getAuthorizationUrl({ state, codeChallenge });
  return NextResponse.redirect(authorizationUrl);
}
