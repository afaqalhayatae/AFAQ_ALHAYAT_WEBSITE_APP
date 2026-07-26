/**
 * Session cookie helpers (JOB-AGT-WEB-20260726-M2.1). The session id is an
 * httpOnly, sameSite=lax cookie only — it is never returned in a JSON
 * response body, so client-side JavaScript (and therefore localStorage)
 * never has access to it. This is the one place that decides how the
 * session token crosses the wire.
 */

import { cookies } from "next/headers";
import type { Session } from "@/types/identity";

export const SESSION_COOKIE_NAME = "afaq_session";
const SESSION_COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export async function setSessionCookie(sessionId: Session["id"]): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function readSessionId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}
