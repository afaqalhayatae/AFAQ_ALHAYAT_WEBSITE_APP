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
import { enquiryRepository } from "@/app/api/enquiries/route";
import { submitEnquiry } from "@/lib/services/enquiry-service";

describe("GET /api/account/requests", () => {
  beforeEach(async () => {
    cookieJar.clear();
    userRepository.clear();
    credentialRepository.clear();
    sessionRepository.clear();
    await auditEventRepository.clear();
    await enquiryRepository.clear();
  });

  it("returns 401 without a valid session", async () => {
    const response = await GET();
    expect(response.status).toBe(401);
  });

  it("returns only the enquiries submitted under the signed-in user's contact value", async () => {
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

    await submitEnquiry(
      { enquiries: enquiryRepository, auditEvents: auditEventRepository },
      { customerId: "0501234567", need: "AC repair", source: "website", actor: "website-visitor" }
    );
    await submitEnquiry(
      { enquiries: enquiryRepository, auditEvents: auditEventRepository },
      { customerId: "0509999999", need: "Someone else's enquiry", source: "website", actor: "website-visitor" }
    );

    const response = await GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toHaveLength(1);
    expect(body.data[0].need).toBe("AC repair");
  });
});
