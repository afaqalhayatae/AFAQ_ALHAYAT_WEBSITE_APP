import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getAuditEventRepository,
  getConsentStore,
  getCustomerRepository,
  getEnquiryRepository,
} from "./repository-factory";
import { prisma } from "./prisma/client";
import type { AuditEvent, Consent, Customer, Enquiry } from "@/types/domain";

// Confirms the factory's default ("memory", REPOSITORY_DRIVER unset) behaves
// exactly like the wrapped in-memory repository it delegates to — this is
// the driver every production route still uses (Phase 1D does not change
// that). The "prisma" driver is exercised separately, gated on a reachable
// DATABASE_URL, to confirm the same factory call returns a working async
// repository for both backends without any caller-visible difference.

describe("repository-factory (memory driver, default)", () => {
  const originalDriver = process.env.REPOSITORY_DRIVER;

  beforeEach(() => {
    delete process.env.REPOSITORY_DRIVER;
  });

  afterEach(() => {
    if (originalDriver === undefined) {
      delete process.env.REPOSITORY_DRIVER;
    } else {
      process.env.REPOSITORY_DRIVER = originalDriver;
    }
  });

  it("returns an async-wrapped in-memory ConsentStore by default", async () => {
    const store = getConsentStore();
    const sample: Consent = {
      id: "consent-factory-1",
      channel: "email",
      purpose: "test",
      status: "granted",
      source: "test",
      evidence: "test-fixture",
      recordedAt: "2026-08-04T00:00:00.000Z",
    };

    await store.record(sample);
    await expect(store.findById("consent-factory-1")).resolves.toEqual(sample);
    await store.clear();
    await expect(store.findById("consent-factory-1")).resolves.toBeUndefined();
  });

  it("returns an async-wrapped in-memory EnquiryRepository by default", async () => {
    const repo = getEnquiryRepository();
    const sample: Enquiry = {
      id: "enquiry-factory-1",
      customerId: "cust-factory-1",
      need: "test need",
      source: "test",
      status: "new",
    };

    await repo.create(sample);
    await expect(repo.findByCustomer("cust-factory-1")).resolves.toEqual([sample]);
    await repo.clear();
    await expect(repo.findById("enquiry-factory-1")).resolves.toBeUndefined();
  });

  it("returns an async-wrapped in-memory CustomerRepository by default", async () => {
    const repo = getCustomerRepository();
    const sample: Customer = {
      id: "cust-factory-1",
      contactPoints: [{ channel: "phone", value: "+971500000001" }],
    };

    await repo.create(sample);
    await expect(repo.findById("cust-factory-1")).resolves.toEqual(sample);
    await repo.clear();
    await expect(repo.findById("cust-factory-1")).resolves.toBeUndefined();
  });

  it("returns an async-wrapped in-memory AuditEventRepository by default", async () => {
    const repo = getAuditEventRepository();
    const sample: AuditEvent = {
      id: "audit-factory-1",
      actor: "factory-test-actor",
      action: "test.action",
      target: "target",
      outcome: "success",
      timestamp: "2026-08-04T00:00:00.000Z",
      correlationId: "corr-factory-1",
    };

    await repo.record(sample);
    await expect(repo.findByActor("factory-test-actor")).resolves.toEqual([sample]);
    await repo.clear();
    await expect(repo.findByActor("factory-test-actor")).resolves.toEqual([]);
  });
});

describe.skipIf(!process.env.DATABASE_URL)("repository-factory (prisma driver, opt-in)", () => {
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
    await prisma.consent.deleteMany();
    await prisma.enquiry.deleteMany();
    await prisma.contactPoint.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.auditEvent.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("returns a real Prisma-backed ConsentStore when REPOSITORY_DRIVER=prisma", async () => {
    const store = getConsentStore();
    const sample: Consent = {
      id: "consent-factory-prisma-1",
      channel: "phone",
      purpose: "test",
      status: "granted",
      source: "test",
      evidence: "test-fixture",
      recordedAt: "2026-08-04T00:00:00.000Z",
    };

    await store.record(sample);
    await expect(store.findById("consent-factory-prisma-1")).resolves.toEqual(sample);

    const raw = await prisma.consent.findUnique({ where: { id: sample.id } });
    expect(raw).not.toBeNull();
  });

  it("returns a real Prisma-backed EnquiryRepository when REPOSITORY_DRIVER=prisma", async () => {
    const repo = getEnquiryRepository();
    const sample: Enquiry = {
      id: "enquiry-factory-prisma-1",
      customerId: "cust-factory-prisma-1",
      need: "test need",
      source: "test",
      status: "new",
    };

    await repo.create(sample);
    await expect(repo.findByCustomer("cust-factory-prisma-1")).resolves.toEqual([sample]);

    const raw = await prisma.enquiry.findUnique({ where: { id: sample.id } });
    expect(raw).not.toBeNull();
  });

  it("returns a real Prisma-backed CustomerRepository when REPOSITORY_DRIVER=prisma", async () => {
    const repo = getCustomerRepository();
    const sample: Customer = {
      id: "cust-factory-prisma-1",
      contactPoints: [
        { channel: "phone", value: "+971500000002" },
        { channel: "email", value: "factory-prisma@example.test" },
      ],
    };

    await repo.create(sample);
    await expect(repo.findById("cust-factory-prisma-1")).resolves.toEqual(sample);

    const raw = await prisma.customer.findUnique({ where: { id: sample.id } });
    expect(raw).not.toBeNull();
  });

  it("returns a real Prisma-backed AuditEventRepository when REPOSITORY_DRIVER=prisma", async () => {
    const repo = getAuditEventRepository();
    const sample: AuditEvent = {
      id: "audit-factory-prisma-1",
      actor: "factory-prisma-actor",
      action: "test.action",
      target: "target",
      outcome: "success",
      timestamp: "2026-08-04T00:00:00.000Z",
      correlationId: "corr-factory-prisma-1",
    };

    await repo.record(sample);
    await expect(repo.findByActor("factory-prisma-actor")).resolves.toEqual([sample]);

    const raw = await prisma.auditEvent.findUnique({ where: { id: sample.id } });
    expect(raw).not.toBeNull();
  });
});

// Data consistency check: the same input, created once per driver,
// round-trips to an identical Customer shape from both backends — proves
// the Customer/ContactPoint relation mapping in the Prisma repository
// (Phase 1C) doesn't silently diverge from the in-memory shape the rest of
// the app already depends on (contactPoints order and content in
// particular, since that's the one entity here with a real Prisma relation
// rather than a flat row).
describe.skipIf(!process.env.DATABASE_URL)("Customer data consistency across drivers", () => {
  const originalDriver = process.env.REPOSITORY_DRIVER;

  afterEach(async () => {
    if (originalDriver === undefined) {
      delete process.env.REPOSITORY_DRIVER;
    } else {
      process.env.REPOSITORY_DRIVER = originalDriver;
    }
    await prisma.contactPoint.deleteMany();
    await prisma.customer.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("produces the same Customer shape from memory and prisma for identical input", async () => {
    const contactPoints: Customer["contactPoints"] = [
      { channel: "phone", value: "+971500000003" },
      { channel: "email", value: "consistency@example.test" },
    ];

    process.env.REPOSITORY_DRIVER = "memory";
    const memoryRepo = getCustomerRepository();
    const memoryCustomer: Customer = { id: "cust-consistency-memory", contactPoints };
    await memoryRepo.create(memoryCustomer);
    const memoryResult = await memoryRepo.findById("cust-consistency-memory");

    process.env.REPOSITORY_DRIVER = "prisma";
    const prismaRepo = getCustomerRepository();
    const prismaCustomer: Customer = { id: "cust-consistency-prisma", contactPoints };
    await prismaRepo.create(prismaCustomer);
    const prismaResult = await prismaRepo.findById("cust-consistency-prisma");

    // ids differ (assigned explicitly above to keep the two records
    // distinct across drivers within the same test run), so compare the
    // actual shape a caller receives: contactPoints content.
    expect(memoryResult?.contactPoints).toEqual(contactPoints);
    expect(prismaResult?.contactPoints).toEqual(contactPoints);
  });
});
