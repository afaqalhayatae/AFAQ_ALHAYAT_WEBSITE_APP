import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest";
import { recordConsent } from "./consent-service";
import { getAuditEventRepository, getConsentStore } from "@/lib/adapters/repository-factory";
import { prisma } from "@/lib/adapters/prisma/client";
import type { AsyncAuditEventRepository, AsyncConsentStore } from "@/lib/adapters/prisma/types";

// Runs the real recordConsent service function against both drivers the
// repository factory can select (Database Foundation Phase 1E). The
// "memory" block below is what every deployed environment uses today,
// unchanged; the "prisma" block proves the same service function produces
// identical results against a real database, gated on a reachable local
// DATABASE_URL so this suite still runs without Docker.
function makeSuite(driver: "memory" | "prisma") {
  describe(`recordConsent (${driver} driver)`, () => {
    let consents: AsyncConsentStore;
    let auditEvents: AsyncAuditEventRepository;
    const originalDriver = process.env.REPOSITORY_DRIVER;

    beforeEach(() => {
      process.env.REPOSITORY_DRIVER = driver;
      consents = getConsentStore();
      auditEvents = getAuditEventRepository();
    });

    afterEach(async () => {
      if (originalDriver === undefined) {
        delete process.env.REPOSITORY_DRIVER;
      } else {
        process.env.REPOSITORY_DRIVER = originalDriver;
      }
      await consents.clear();
      await auditEvents.clear();
    });

    it("records a valid consent and an audit event", async () => {
      const consent = await recordConsent(
        { consents, auditEvents },
        {
          channel: "whatsapp",
          purpose: "booking-updates",
          status: "granted",
          source: "test",
          evidence: "test-fixture",
          recordedAt: "2026-07-26T00:00:00.000Z",
          actor: "test-actor",
        }
      );

      expect(consent.id).toMatch(/^consent_/);
      await expect(consents.findById(consent.id)).resolves.toEqual(consent);
      await expect(consents.findByChannel("whatsapp")).resolves.toEqual([consent]);
      await expect(auditEvents.findByActor("test-actor")).resolves.toHaveLength(1);
    });

    it("rejects an invalid recordedAt timestamp", async () => {
      await expect(
        recordConsent(
          { consents, auditEvents },
          {
            channel: "whatsapp",
            purpose: "booking-updates",
            status: "granted",
            source: "test",
            evidence: "test-fixture",
            recordedAt: "not-a-date",
            actor: "test-actor",
          }
        )
      ).rejects.toThrow();
    });
  });
}

makeSuite("memory");
describe.skipIf(!process.env.DATABASE_URL)("prisma driver suite", () => {
  makeSuite("prisma");

  afterAll(async () => {
    await prisma.$disconnect();
  });
});

// Data consistency check: the same input, recorded once per driver,
// round-trips to an identical Consent shape from both backends — proves
// the Json/DateTime/etc. adapter conversions in the Prisma repository
// (Phase 1C) don't silently diverge from the in-memory shape the rest of
// the app already depends on.
describe.skipIf(!process.env.DATABASE_URL)("Consent data consistency across drivers", () => {
  const originalDriver = process.env.REPOSITORY_DRIVER;
  const auditEvents = getAuditEventRepository();

  afterEach(async () => {
    if (originalDriver === undefined) {
      delete process.env.REPOSITORY_DRIVER;
    } else {
      process.env.REPOSITORY_DRIVER = originalDriver;
    }
    await auditEvents.clear();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("produces the same Consent shape from memory and prisma for identical input", async () => {
    const input = {
      channel: "email" as const,
      purpose: "consistency-check",
      status: "granted" as const,
      source: "test",
      evidence: "test-fixture",
      recordedAt: "2026-08-04T00:00:00.000Z",
      actor: "test-actor",
    };

    process.env.REPOSITORY_DRIVER = "memory";
    const memoryStore = getConsentStore();
    const memoryConsent = await recordConsent({ consents: memoryStore, auditEvents }, input);

    process.env.REPOSITORY_DRIVER = "prisma";
    const prismaStore = getConsentStore();
    const prismaConsent = await recordConsent({ consents: prismaStore, auditEvents }, input);
    await prismaStore.clear();

    // ids are independently generated (generateId), so compare everything
    // else — the actual shape a caller (the /api/consents route) receives.
    expect(memoryConsent.channel).toBe(prismaConsent.channel);
    expect(memoryConsent.purpose).toBe(prismaConsent.purpose);
    expect(memoryConsent.status).toBe(prismaConsent.status);
    expect(memoryConsent.source).toBe(prismaConsent.source);
    expect(memoryConsent.evidence).toBe(prismaConsent.evidence);
    expect(memoryConsent.recordedAt).toBe(prismaConsent.recordedAt);
  });
});
