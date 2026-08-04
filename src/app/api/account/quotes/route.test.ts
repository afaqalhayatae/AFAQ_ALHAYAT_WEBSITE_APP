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

import { GET } from "./route";
import { registerWithPassword } from "@/lib/services/identity-service";
import { createSession } from "@/lib/services/session-service";
import {
  auditEventRepository,
  credentialRepository,
  passwordProvider,
  sessionRepository,
  userRepository,
} from "@/app/api/auth/_lib/container";
import { SESSION_COOKIE_NAME } from "@/app/api/auth/_lib/session-cookie";
import { quoteRepository, serviceRepository } from "@/app/api/quotes/route";
import { requestQuote } from "@/lib/services/quote-service";

describe("GET /api/account/quotes", () => {
  beforeEach(async () => {
    cookieJar.clear();
    userRepository.clear();
    credentialRepository.clear();
    sessionRepository.clear();
    await auditEventRepository.clear();
    await quoteRepository.clear();
    serviceRepository.clear();
    serviceRepository.upsert({ id: "SVC-deep-clean" });
  });

  it("returns 401 without a valid session", async () => {
    const response = await GET();
    expect(response.status).toBe(401);
  });

  it("returns only the quote requests submitted under the signed-in user's contact value", async () => {
    const user = await registerWithPassword(
      {
        users: userRepository,
        credentials: credentialRepository,
        passwordProvider,
        auditEvents: auditEventRepository,
      },
      {
        displayName: "Jane Doe",
        channel: "phone",
        contactValue: "0501234567",
        password: "correct-horse-battery-staple",
        actor: "test-setup",
      }
    );
    const session = createSession({ sessions: sessionRepository }, user.id);
    cookieJar.set(SESSION_COOKIE_NAME, session.id);

    await requestQuote(
      { quotes: quoteRepository, services: serviceRepository, auditEvents: auditEventRepository },
      {
        customerId: "0501234567",
        serviceId: "SVC-deep-clean",
        requirements: "3-bedroom villa",
        evidence: [],
        actor: "website-visitor",
      }
    );
    await requestQuote(
      { quotes: quoteRepository, services: serviceRepository, auditEvents: auditEventRepository },
      {
        customerId: "0509999999",
        serviceId: "SVC-deep-clean",
        requirements: "someone else's villa",
        evidence: [],
        actor: "website-visitor",
      }
    );

    const response = await GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toHaveLength(1);
    expect(body.data[0].requirements).toBe("3-bedroom villa");
  });
});
