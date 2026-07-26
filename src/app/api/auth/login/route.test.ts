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

import { POST } from "./route";
import { registerWithPassword } from "@/lib/services/identity-service";
import {
  auditEventRepository,
  credentialRepository,
  passwordProvider,
  sessionRepository,
  userRepository,
} from "../_lib/container";
import { SESSION_COOKIE_NAME } from "../_lib/session-cookie";

function postRequest(body: unknown) {
  return new NextRequest("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const CONTACT = { channel: "phone" as const, contactValue: "0501234567" };
const PASSWORD = "correct-horse-battery-staple";

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    cookieJar.clear();
    userRepository.clear();
    credentialRepository.clear();
    sessionRepository.clear();
    auditEventRepository.clear();

    registerWithPassword(
      { users: userRepository, credentials: credentialRepository, passwordProvider, auditEvents: auditEventRepository },
      {
        displayName: "Jane Doe",
        channel: CONTACT.channel,
        contactValue: CONTACT.contactValue,
        password: PASSWORD,
        actor: "test-setup",
      }
    );
  });

  it("logs in with correct credentials and sets a session cookie", async () => {
    const response = await POST(
      postRequest({ ...CONTACT, password: PASSWORD, actor: "test-actor" })
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data.contact.value).toBe(CONTACT.contactValue);
    expect(cookieJar.get(SESSION_COOKIE_NAME)).toBeTruthy();
  });

  it("rejects an incorrect password with a generic error", async () => {
    const response = await POST(
      postRequest({ ...CONTACT, password: "wrong-password", actor: "test-actor" })
    );
    expect(response.status).toBe(401);
    expect(cookieJar.get(SESSION_COOKIE_NAME)).toBeUndefined();
  });

  it("rejects an unknown contact with the same generic error", async () => {
    const response = await POST(
      postRequest({
        channel: "phone",
        contactValue: "0509999999",
        password: PASSWORD,
        actor: "test-actor",
      })
    );
    expect(response.status).toBe(401);
  });

  it("rejects login for a disabled account", async () => {
    const user = userRepository.findByContact(CONTACT.channel, CONTACT.contactValue)!;
    userRepository.update({ ...user, status: "disabled" });

    const response = await POST(
      postRequest({ ...CONTACT, password: PASSWORD, actor: "test-actor" })
    );
    expect(response.status).toBe(403);
  });
});
