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
import {
  bookingRepository,
  serviceAreaRepository,
  serviceRepository,
} from "@/app/api/bookings/route";
import { requestBooking } from "@/lib/services/booking-service";

describe("GET /api/account/bookings", () => {
  beforeEach(async () => {
    cookieJar.clear();
    userRepository.clear();
    credentialRepository.clear();
    sessionRepository.clear();
    await auditEventRepository.clear();
    await bookingRepository.clear();
    serviceRepository.clear();
    serviceAreaRepository.clear();
    serviceRepository.upsert({ id: "SVC-ac-repair" });
    serviceAreaRepository.upsert({ id: "LOC-AE-dubai" });
  });

  it("returns 401 without a valid session", async () => {
    const response = await GET();
    expect(response.status).toBe(401);
  });

  it("returns only the booking requests submitted under the signed-in user's contact value", async () => {
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

    await requestBooking(
      {
        bookings: bookingRepository,
        services: serviceRepository,
        serviceAreas: serviceAreaRepository,
        auditEvents: auditEventRepository,
      },
      {
        customerId: "0501234567",
        serviceId: "SVC-ac-repair",
        serviceAreaId: "LOC-AE-dubai",
        schedulePreference: "weekday-morning",
        actor: "website-visitor",
      }
    );
    await requestBooking(
      {
        bookings: bookingRepository,
        services: serviceRepository,
        serviceAreas: serviceAreaRepository,
        auditEvents: auditEventRepository,
      },
      {
        customerId: "0509999999",
        serviceId: "SVC-ac-repair",
        serviceAreaId: "LOC-AE-dubai",
        schedulePreference: "weekend",
        actor: "website-visitor",
      }
    );

    const response = await GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toHaveLength(1);
    expect(body.data[0].schedulePreference).toBe("weekday-morning");
  });
});
