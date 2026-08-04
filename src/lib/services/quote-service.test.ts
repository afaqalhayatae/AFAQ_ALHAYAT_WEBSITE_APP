import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest";
import { requestQuote } from "./quote-service";
import { UnknownServiceError } from "./errors";
import { createInMemoryServiceRepository } from "@/lib/adapters/in-memory/service-repository";
import { getAuditEventRepository, getQuoteRequestRepository } from "@/lib/adapters/repository-factory";
import { prisma } from "@/lib/adapters/prisma/client";
import type { ServiceRepository } from "@/lib/adapters/types";
import type {
  AsyncAuditEventRepository,
  AsyncQuoteRequestRepository,
} from "@/lib/adapters/prisma/types";

// Runs the real requestQuote service function against both drivers the
// repository factory can select (Database Foundation Phase 1I). The
// "memory" block below is what every deployed environment uses today,
// unchanged; the "prisma" block proves the same service function produces
// identical results against a real database, gated on a reachable local
// DATABASE_URL so this suite still runs without Docker. services stays the
// plain in-memory adapter throughout — untouched, out of this phase's scope.
function makeSuite(driver: "memory" | "prisma") {
  describe(`requestQuote (${driver} driver)`, () => {
    let services: ServiceRepository;
    let quotes: AsyncQuoteRequestRepository;
    let auditEvents: AsyncAuditEventRepository;
    const originalDriver = process.env.REPOSITORY_DRIVER;

    beforeEach(() => {
      process.env.REPOSITORY_DRIVER = driver;
      services = createInMemoryServiceRepository();
      quotes = getQuoteRequestRepository();
      auditEvents = getAuditEventRepository();
      services.upsert({ id: "SVC-TEST-SERVICE" });
    });

    afterEach(async () => {
      if (originalDriver === undefined) {
        delete process.env.REPOSITORY_DRIVER;
      } else {
        process.env.REPOSITORY_DRIVER = originalDriver;
      }
      await quotes.clear();
      await auditEvents.clear();
    });

    it("creates a quote request with the given evidence", async () => {
      const quoteRequest = await requestQuote(
        { services, quotes, auditEvents },
        {
          customerId: "cust-1",
          serviceId: "SVC-TEST-SERVICE",
          requirements: "test requirements",
          evidence: ["test-fixture.jpg"],
          actor: "test-actor",
        }
      );

      expect(quoteRequest.customerId).toBe("cust-1");
      await expect(quotes.findById(quoteRequest.id)).resolves.toEqual(quoteRequest);
    });

    it("rejects a missing customerId", async () => {
      await expect(
        requestQuote(
          { services, quotes, auditEvents },
          {
            customerId: "",
            serviceId: "SVC-TEST-SERVICE",
            requirements: "test requirements",
            evidence: [],
            actor: "test-actor",
          }
        )
      ).rejects.toThrow();
    });

    it("rejects an unknown service", async () => {
      await expect(
        requestQuote(
          { services, quotes, auditEvents },
          {
            customerId: "cust-1",
            serviceId: "SVC-MISSING",
            requirements: "test requirements",
            evidence: [],
            actor: "test-actor",
          }
        )
      ).rejects.toThrow(UnknownServiceError);
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

// Data consistency check: the same input, requested once per driver,
// round-trips to an identical QuoteRequest shape from both backends.
describe.skipIf(!process.env.DATABASE_URL)(
  "QuoteRequest data consistency across drivers",
  () => {
    const originalDriver = process.env.REPOSITORY_DRIVER;
    const services = createInMemoryServiceRepository();
    const auditEvents = getAuditEventRepository();

    beforeEach(() => {
      services.upsert({ id: "SVC-CONSISTENCY-SERVICE" });
    });

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

    it("produces the same QuoteRequest shape from memory and prisma for identical input", async () => {
      const input = {
        customerId: "cust-consistency-1",
        serviceId: "SVC-CONSISTENCY-SERVICE" as const,
        requirements: "consistency-check requirements",
        evidence: ["photo-1.jpg", "photo-2.jpg"],
        actor: "test-actor",
      };

      process.env.REPOSITORY_DRIVER = "memory";
      const memoryQuotes = getQuoteRequestRepository();
      const memoryQuote = await requestQuote({ services, quotes: memoryQuotes, auditEvents }, input);

      process.env.REPOSITORY_DRIVER = "prisma";
      const prismaQuotes = getQuoteRequestRepository();
      const prismaQuote = await requestQuote({ services, quotes: prismaQuotes, auditEvents }, input);
      await prismaQuotes.clear();

      // ids are independently generated (generateId), so compare
      // everything else — the actual shape a caller (the /api/quotes route)
      // receives.
      expect(memoryQuote.customerId).toBe(prismaQuote.customerId);
      expect(memoryQuote.serviceId).toBe(prismaQuote.serviceId);
      expect(memoryQuote.requirements).toBe(prismaQuote.requirements);
      expect(memoryQuote.evidence).toEqual(prismaQuote.evidence);
    });
  }
);

// Evidence field round-trip: schema.prisma stores evidence as Json (MySQL
// has no scalar array type) while the domain contract types it as
// string[] (quote-request-repository.ts's own comment). This proves that
// conversion survives real cases beyond the single-item fixture already
// covered by the Phase 1C adapter test — empty array, multiple items, and
// values containing characters that could be mishandled by a naive
// JSON round-trip.
describe.skipIf(!process.env.DATABASE_URL)("QuoteRequest.evidence Json <-> string[] round-trip", () => {
  const originalDriver = process.env.REPOSITORY_DRIVER;

  beforeEach(() => {
    process.env.REPOSITORY_DRIVER = "prisma";
  });

  afterEach(async () => {
    if (originalDriver === undefined) {
      delete process.env.REPOSITORY_DRIVER;
    } else {
      process.env.REPOSITORY_DRIVER = originalDriver;
    }
    await prisma.quoteRequest.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it.each([
    ["empty array", []],
    ["single item", ["photo-1.jpg"]],
    ["multiple items", ["photo-1.jpg", "photo-2.jpg", "video-1.mp4"]],
    [
      "items with special characters (quotes, unicode, em-dash)",
      ['file "with quotes".jpg', "ملف-عربي.jpg", "before—after.jpg"],
    ],
  ])("round-trips evidence correctly: %s", async (_label, evidence) => {
    const quotes = getQuoteRequestRepository();
    const sample = {
      id: `quote-evidence-${crypto.randomUUID()}`,
      customerId: "cust-evidence-1",
      serviceId: "SVC-EVIDENCE-TEST" as const,
      requirements: "evidence round-trip check",
      evidence,
    };

    await quotes.create(sample);
    const retrieved = await quotes.findById(sample.id);

    expect(retrieved?.evidence).toEqual(evidence);
    expect(Array.isArray(retrieved?.evidence)).toBe(true);

    // Also confirm the raw stored column really is JSON, not a stringified
    // array masquerading as one — the adapter's toEvidenceArray cast
    // (quote-request-repository.ts) would hide a real storage-shape bug.
    const raw = await prisma.quoteRequest.findUnique({ where: { id: sample.id } });
    expect(raw?.evidence).toEqual(evidence);
  });
});
