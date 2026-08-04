import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest";
import { createPrismaQuoteRequestRepository } from "./quote-request-repository";
import { prisma } from "./client";
import type { QuoteRequest } from "@/types/domain";
import type { AsyncQuoteRequestRepository } from "./types";

// Mirrors in-memory/quote-request-repository.test.ts's contract, adapted
// for the real async database call and the Json<->string[] evidence
// round-trip (schema.prisma stores evidence as Json; the domain contract
// types it as string[] — see quote-request-repository.ts's comment).
// Skipped without a reachable DATABASE_URL.
const sample: QuoteRequest = {
  id: "quote-prisma-1",
  customerId: "cust-prisma-1",
  serviceId: "SVC-TEST-SERVICE",
  requirements: "test requirements",
  evidence: ["test-fixture.jpg"],
};

describe.skipIf(!process.env.DATABASE_URL)("Prisma QuoteRequestRepository", () => {
  let repo: AsyncQuoteRequestRepository;

  beforeEach(() => {
    repo = createPrismaQuoteRequestRepository();
  });

  afterEach(async () => {
    await repo.clear();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates and finds a quote request by id", async () => {
    await repo.create(sample);
    await expect(repo.findById("quote-prisma-1")).resolves.toEqual(sample);
    await expect(repo.findById("missing")).resolves.toBeUndefined();
  });

  it("finds quote requests by service", async () => {
    await repo.create(sample);
    await expect(repo.findByService("SVC-TEST-SERVICE")).resolves.toEqual([sample]);
    await expect(repo.findByService("SVC-OTHER")).resolves.toEqual([]);
  });

  it("finds quote requests by customer", async () => {
    await repo.create(sample);
    await expect(repo.findByCustomer("cust-prisma-1")).resolves.toEqual([sample]);
    await expect(repo.findByCustomer("cust-other")).resolves.toEqual([]);
  });

  it("clears all quote requests", async () => {
    await repo.create(sample);
    await repo.clear();
    await expect(repo.findById("quote-prisma-1")).resolves.toBeUndefined();
  });
});
