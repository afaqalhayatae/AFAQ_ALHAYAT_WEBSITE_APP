import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest";
import { submitEnquiry } from "./enquiry-service";
import { getAuditEventRepository, getEnquiryRepository } from "@/lib/adapters/repository-factory";
import { prisma } from "@/lib/adapters/prisma/client";
import type { AsyncAuditEventRepository, AsyncEnquiryRepository } from "@/lib/adapters/prisma/types";

// Runs the real submitEnquiry service function against both drivers the
// repository factory can select (Database Foundation Phase 1F). The
// "memory" block below is what every deployed environment uses today,
// unchanged; the "prisma" block proves the same service function produces
// identical results against a real database, gated on a reachable local
// DATABASE_URL so this suite still runs without Docker.
function makeSuite(driver: "memory" | "prisma") {
  describe(`submitEnquiry (${driver} driver)`, () => {
    let enquiries: AsyncEnquiryRepository;
    let auditEvents: AsyncAuditEventRepository;
    const originalDriver = process.env.REPOSITORY_DRIVER;

    beforeEach(() => {
      process.env.REPOSITORY_DRIVER = driver;
      enquiries = getEnquiryRepository();
      auditEvents = getAuditEventRepository();
    });

    afterEach(async () => {
      if (originalDriver === undefined) {
        delete process.env.REPOSITORY_DRIVER;
      } else {
        process.env.REPOSITORY_DRIVER = originalDriver;
      }
      await enquiries.clear();
      await auditEvents.clear();
    });

    it("creates a new enquiry with status 'new' and an audit event", async () => {
      const enquiry = await submitEnquiry(
        { enquiries, auditEvents },
        {
          customerId: "cust-1",
          need: "test need",
          source: "test",
          actor: "test-actor",
        }
      );

      expect(enquiry.status).toBe("new");
      await expect(enquiries.findById(enquiry.id)).resolves.toEqual(enquiry);
      const events = await auditEvents.findByActor("test-actor");
      expect(events).toHaveLength(1);
      expect(events[0].action).toBe("enquiry.submitted");
    });

    it("rejects a missing need", async () => {
      await expect(
        submitEnquiry(
          { enquiries, auditEvents },
          { customerId: "cust-1", need: "", source: "test", actor: "test-actor" }
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

// Data consistency check: the same input, submitted once per driver,
// round-trips to an identical Enquiry shape from both backends — proves
// the Prisma repository (Phase 1C) doesn't silently diverge from the
// in-memory shape the rest of the app already depends on.
describe.skipIf(!process.env.DATABASE_URL)("Enquiry data consistency across drivers", () => {
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

  it("produces the same Enquiry shape from memory and prisma for identical input", async () => {
    const input = {
      customerId: "cust-consistency-1",
      need: "consistency-check need",
      source: "test",
      actor: "test-actor",
    };

    process.env.REPOSITORY_DRIVER = "memory";
    const memoryRepo = getEnquiryRepository();
    const memoryEnquiry = await submitEnquiry({ enquiries: memoryRepo, auditEvents }, input);

    process.env.REPOSITORY_DRIVER = "prisma";
    const prismaRepo = getEnquiryRepository();
    const prismaEnquiry = await submitEnquiry({ enquiries: prismaRepo, auditEvents }, input);
    await prismaRepo.clear();

    // ids are independently generated (generateId), so compare everything
    // else — the actual shape a caller (the /api/enquiries route) receives.
    expect(memoryEnquiry.customerId).toBe(prismaEnquiry.customerId);
    expect(memoryEnquiry.need).toBe(prismaEnquiry.need);
    expect(memoryEnquiry.source).toBe(prismaEnquiry.source);
    expect(memoryEnquiry.status).toBe(prismaEnquiry.status);
  });
});
