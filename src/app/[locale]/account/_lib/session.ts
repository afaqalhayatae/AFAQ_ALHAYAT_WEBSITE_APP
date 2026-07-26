/**
 * Server-side helpers for the /account section (JOB-AGT-WEB-20260726-M2.2).
 * Pages and layouts under /account must never import
 * src/lib/services/** or src/lib/adapters/** directly — per the approved
 * architecture, UI only talks to the API Boundary. These helpers do exactly
 * that: they call the existing Auth/Account API routes over HTTP,
 * forwarding the incoming request's cookies, from a Server Component.
 */

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { User } from "@/types/identity";

async function apiOrigin(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol =
    headersList.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "production" ? "https" : "http");
  return `${protocol}://${host}`;
}

async function fetchFromApi(path: string): Promise<Response> {
  const cookieHeader = (await cookies()).toString();
  return fetch(`${await apiOrigin()}${path}`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });
}

/** Redirects to /{locale}/login when there is no valid session. */
export async function requireUser(locale: Locale): Promise<User> {
  const response = await fetchFromApi("/api/auth/session");
  if (!response.ok) {
    redirect(`/${locale}/login`);
  }
  const body = await response.json();
  return body.data as User;
}

export async function fetchAccountData<T>(path: string): Promise<T> {
  const response = await fetchFromApi(path);
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body?.error?.message ?? "Request failed");
  }
  return body.data as T;
}
