/**
 * Auth API boundary — login (JOB-AGT-WEB-20260726-M2.1). Validates input,
 * delegates credential verification to the Identity Service, and returns an
 * API envelope. Only sets an httpOnly session cookie — the session id is
 * never present in the JSON body.
 */

import { NextRequest, NextResponse } from "next/server";
import type { ContactPoint } from "@/types/domain";
import { loginWithPassword } from "@/lib/services/identity-service";
import { AccountDisabledError, InvalidCredentialsError } from "@/lib/services/errors";
import {
  auditEventRepository,
  credentialRepository,
  passwordProvider,
  sessionRepository,
  userRepository,
} from "../_lib/container";
import { envelope, errorResponse, isNonEmptyString } from "../_lib/http";
import { setSessionCookie } from "../_lib/session-cookie";
import { logError } from "@/lib/logging/logger";

const CHANNELS: ContactPoint["channel"][] = ["phone", "whatsapp", "email"];

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

  const { channel, contactValue, password, actor } = body as Record<string, unknown>;

  if (
    !CHANNELS.includes(channel as ContactPoint["channel"]) ||
    !isNonEmptyString(contactValue) ||
    !isNonEmptyString(password) ||
    !isNonEmptyString(actor)
  ) {
    return errorResponse(
      400,
      "validation_error",
      "channel (phone|whatsapp|email), contactValue, password, and actor are required"
    );
  }

  try {
    const { user, session } = await loginWithPassword(
      {
        users: userRepository,
        credentials: credentialRepository,
        sessions: sessionRepository,
        passwordProvider,
        auditEvents: auditEventRepository,
      },
      { channel: channel as ContactPoint["channel"], contactValue, password, actor }
    );

    await setSessionCookie(session.id);

    return NextResponse.json(envelope(user), { status: 200 });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return errorResponse(401, "unauthorized", error.message);
    }
    if (error instanceof AccountDisabledError) {
      return errorResponse(403, "forbidden", error.message);
    }
    logError("Unexpected error in POST /api/auth/login", error, { route: "auth/login", method: "POST" });
    return errorResponse(500, "internal_error", "An unexpected error occurred. Please try again.");
  }
}
