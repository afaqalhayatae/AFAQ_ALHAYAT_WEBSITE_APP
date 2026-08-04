/**
 * Auth API boundary — registration (JOB-AGT-WEB-20260726-M2.1). Validates
 * input, delegates every rule (password policy, contact uniqueness) to the
 * Identity Service, and returns an API envelope. Only sets an httpOnly
 * session cookie — the session id is never present in the JSON body.
 */

import { NextRequest, NextResponse } from "next/server";
import type { ContactPoint } from "@/types/domain";
import { registerWithPassword } from "@/lib/services/identity-service";
import { createSession } from "@/lib/services/session-service";
import { ContactAlreadyRegisteredError, WeakPasswordError } from "@/lib/services/errors";
import {
  auditEventRepository,
  credentialRepository,
  passwordProvider,
  sessionRepository,
  userRepository,
} from "../_lib/container";
import { envelope, errorResponse, isNonEmptyString } from "../_lib/http";
import { setSessionCookie } from "../_lib/session-cookie";

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

  const { displayName, channel, contactValue, password, actor } = body as Record<
    string,
    unknown
  >;

  if (
    !isNonEmptyString(displayName) ||
    !CHANNELS.includes(channel as ContactPoint["channel"]) ||
    !isNonEmptyString(contactValue) ||
    !isNonEmptyString(password) ||
    !isNonEmptyString(actor)
  ) {
    return errorResponse(
      400,
      "validation_error",
      "displayName, channel (phone|whatsapp|email), contactValue, password, and actor are required"
    );
  }

  try {
    const user = await registerWithPassword(
      {
        users: userRepository,
        credentials: credentialRepository,
        passwordProvider,
        auditEvents: auditEventRepository,
      },
      {
        displayName,
        channel: channel as ContactPoint["channel"],
        contactValue,
        password,
        actor,
      }
    );

    const session = createSession({ sessions: sessionRepository }, user.id);
    await setSessionCookie(session.id);

    return NextResponse.json(envelope(user), { status: 201 });
  } catch (error) {
    if (error instanceof ContactAlreadyRegisteredError) {
      return errorResponse(409, "conflict", error.message);
    }
    if (error instanceof WeakPasswordError) {
      return errorResponse(400, "validation_error", error.message);
    }
    return errorResponse(
      400,
      "validation_error",
      error instanceof Error ? error.message : "Invalid request"
    );
  }
}
