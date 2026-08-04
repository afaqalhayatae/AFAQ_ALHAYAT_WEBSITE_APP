/**
 * Auth API boundary — current session / profile foundation
 * (JOB-AGT-WEB-20260726-M2.1). GET resolves who is signed in from the
 * httpOnly session cookie; PATCH updates the signed-in user's profile.
 * Neither reads the session id from anywhere but the cookie — it is never
 * accepted from the request body or query string.
 */

import { NextRequest, NextResponse } from "next/server";
import { updateProfile } from "@/lib/services/identity-service";
import { auditEventRepository, userRepository } from "../_lib/container";
import { envelope, errorResponse, isNonEmptyString } from "../_lib/http";
import { resolveCurrentUser } from "../_lib/require-user";
import { logError } from "@/lib/logging/logger";

export async function GET() {
  const user = await resolveCurrentUser();
  if (!user) {
    return errorResponse(401, "not_authenticated", "No active session");
  }
  return NextResponse.json(envelope(user), { status: 200 });
}

export async function PATCH(request: NextRequest) {
  const user = await resolveCurrentUser();
  if (!user) {
    return errorResponse(401, "not_authenticated", "No active session");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "invalid_json", "Request body must be valid JSON");
  }
  if (typeof body !== "object" || body === null) {
    return errorResponse(400, "invalid_body", "Request body must be a JSON object");
  }

  const { displayName } = body as Record<string, unknown>;
  if (!isNonEmptyString(displayName)) {
    return errorResponse(400, "validation_error", "displayName is required");
  }

  try {
    const updated = await updateProfile(
      { users: userRepository, auditEvents: auditEventRepository },
      { userId: user.id, displayName, actor: user.id }
    );
    return NextResponse.json(envelope(updated), { status: 200 });
  } catch (error) {
    logError("Unexpected error in PATCH /api/auth/session", error, {
      route: "auth/session",
      method: "PATCH",
    });
    return errorResponse(500, "internal_error", "An unexpected error occurred. Please try again.");
  }
}
