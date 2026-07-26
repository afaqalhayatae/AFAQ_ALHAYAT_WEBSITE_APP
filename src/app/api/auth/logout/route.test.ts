import { beforeEach, describe, expect, it, vi } from "vitest";

const cookieJar = new Map<string, string>();

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      cookieJar.has(name) ? { name, value: cookieJar.get(name)! } : undefined,
    set: (name: string, value: string) => {
      cookieJar.set(name, value);
    },
    delete: (name: string) => {
      cookieJar.delete(name);
    },
  }),
}));

import { POST } from "./route";
import { createSession } from "@/lib/services/session-service";
import { auditEventRepository, sessionRepository } from "../_lib/container";
import { SESSION_COOKIE_NAME } from "../_lib/session-cookie";

describe("POST /api/auth/logout", () => {
  beforeEach(() => {
    cookieJar.clear();
    sessionRepository.clear();
    auditEventRepository.clear();
  });

  it("revokes the active session and clears the cookie", async () => {
    const session = createSession({ sessions: sessionRepository }, "user_1");
    cookieJar.set(SESSION_COOKIE_NAME, session.id);

    const response = await POST();

    expect(response.status).toBe(200);
    expect(sessionRepository.findById(session.id)).toBeUndefined();
    expect(cookieJar.has(SESSION_COOKIE_NAME)).toBe(false);
  });

  it("is idempotent when there is no active session", async () => {
    const response = await POST();

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data.loggedOut).toBe(true);
  });
});
