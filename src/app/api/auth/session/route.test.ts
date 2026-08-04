import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

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

import { GET, PATCH } from "./route";
import { registerWithPassword } from "@/lib/services/identity-service";
import { createSession } from "@/lib/services/session-service";
import {
  auditEventRepository,
  credentialRepository,
  passwordProvider,
  sessionRepository,
  userRepository,
} from "../_lib/container";
import { SESSION_COOKIE_NAME } from "../_lib/session-cookie";
import type { User } from "@/types/identity";

function patchRequest(body: unknown) {
  return new NextRequest("http://localhost/api/auth/session", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("/api/auth/session", () => {
  let user: User;

  beforeEach(async () => {
    cookieJar.clear();
    userRepository.clear();
    credentialRepository.clear();
    sessionRepository.clear();
    await auditEventRepository.clear();

    user = await registerWithPassword(
      { users: userRepository, credentials: credentialRepository, passwordProvider, auditEvents: auditEventRepository },
      {
        displayName: "Jane Doe",
        channel: "phone",
        contactValue: "0501234567",
        password: "correct-horse-battery-staple",
        actor: "test-setup",
      }
    );
  });

  describe("GET", () => {
    it("returns 401 when there is no session cookie", async () => {
      const response = await GET();
      expect(response.status).toBe(401);
    });

    it("returns the current user for a valid session", async () => {
      const session = createSession({ sessions: sessionRepository }, user.id);
      cookieJar.set(SESSION_COOKIE_NAME, session.id);

      const response = await GET();
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.data.id).toBe(user.id);
    });

    it("returns 401 and clears the cookie for an unknown session id", async () => {
      cookieJar.set(SESSION_COOKIE_NAME, "sess_missing");

      const response = await GET();
      expect(response.status).toBe(401);
      expect(cookieJar.has(SESSION_COOKIE_NAME)).toBe(false);
    });
  });

  describe("PATCH", () => {
    it("updates the display name for the signed-in user", async () => {
      const session = createSession({ sessions: sessionRepository }, user.id);
      cookieJar.set(SESSION_COOKIE_NAME, session.id);

      const response = await PATCH(patchRequest({ displayName: "Jane Smith" }));
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.data.displayName).toBe("Jane Smith");
    });

    it("returns 401 without a valid session", async () => {
      const response = await PATCH(patchRequest({ displayName: "Jane Smith" }));
      expect(response.status).toBe(401);
    });
  });
});
