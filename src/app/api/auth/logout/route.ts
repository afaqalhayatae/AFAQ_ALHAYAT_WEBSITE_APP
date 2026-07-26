/**
 * Auth API boundary — logout (JOB-AGT-WEB-20260726-M2.1). Revokes the
 * session referenced by the httpOnly cookie (if any) and clears it.
 * Idempotent: calling it with no active session still succeeds.
 */

import { NextResponse } from "next/server";
import { logout } from "@/lib/services/identity-service";
import { auditEventRepository, sessionRepository } from "../_lib/container";
import { envelope } from "../_lib/http";
import { clearSessionCookie, readSessionId } from "../_lib/session-cookie";

export async function POST() {
  const sessionId = await readSessionId();

  if (sessionId) {
    const session = sessionRepository.findById(sessionId);
    logout(
      { sessions: sessionRepository, auditEvents: auditEventRepository },
      { sessionId, actor: session?.userId ?? sessionId }
    );
  }

  await clearSessionCookie();

  return NextResponse.json(envelope({ loggedOut: true }), { status: 200 });
}
