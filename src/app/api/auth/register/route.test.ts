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
import {
  auditEventRepository,
  credentialRepository,
  sessionRepository,
  userRepository,
} from "../_lib/container";
import { SESSION_COOKIE_NAME } from "../_lib/session-cookie";

function postRequest(body: unknown) {
  return new NextRequest("http://localhost/api/auth/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = {
  displayName: "Jane Doe",
  channel: "phone",
  contactValue: "0501234567",
  password: "correct-horse-battery-staple",
  actor: "test-actor",
};

describe("POST /api/auth/register", () => {
  beforeEach(async () => {
    cookieJar.clear();
    userRepository.clear();
    credentialRepository.clear();
    sessionRepository.clear();
    await auditEventRepository.clear();
  });

  it("creates a user, sets a session cookie, and never returns credential fields", async () => {
    const response = await POST(postRequest(validBody));
    expect(response.status).toBe(201);

    const body = await response.json();
    expect(body.data.status).toBe("active");
    expect(body.data).not.toHaveProperty("passwordHash");
    expect(cookieJar.get(SESSION_COOKIE_NAME)).toBeTruthy();
    expect(credentialRepository.findByUserId(body.data.id)).toBeDefined();
  });

  it("rejects registering the same contact twice", async () => {
    await POST(postRequest(validBody));
    const response = await POST(postRequest(validBody));

    expect(response.status).toBe(409);
  });

  it("rejects a password shorter than the minimum length", async () => {
    const response = await POST(postRequest({ ...validBody, password: "short" }));
    expect(response.status).toBe(400);
  });

  it("rejects an invalid contact channel", async () => {
    const response = await POST(postRequest({ ...validBody, channel: "carrier-pigeon" }));
    expect(response.status).toBe(400);
  });
});
