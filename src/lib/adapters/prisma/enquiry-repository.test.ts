import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest";
import { createPrismaEnquiryRepository } from "./enquiry-repository";
import { prisma } from "./client";
import type { Enquiry } from "@/types/domain";
import type { AsyncEnquiryRepository } from "./types";

// Mirrors in-memory/enquiry-repository.test.ts's contract, adapted for the
// real async database call. Skipped without a reachable DATABASE_URL.
const sample: Enquiry = {
  id: "enquiry-prisma-1",
  customerId: "cust-prisma-1",
  need: "test need",
  source: "test",
  status: "new",
};

describe.skipIf(!process.env.DATABASE_URL)("Prisma EnquiryRepository", () => {
  let repo: AsyncEnquiryRepository;

  beforeEach(() => {
    repo = createPrismaEnquiryRepository();
  });

  afterEach(async () => {
    await repo.clear();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates and finds an enquiry by id", async () => {
    await repo.create(sample);
    await expect(repo.findById("enquiry-prisma-1")).resolves.toEqual(sample);
    await expect(repo.findById("missing")).resolves.toBeUndefined();
  });

  it("finds enquiries by customer", async () => {
    await repo.create(sample);
    await expect(repo.findByCustomer("cust-prisma-1")).resolves.toEqual([sample]);
    await expect(repo.findByCustomer("cust-other")).resolves.toEqual([]);
  });

  it("clears all enquiries", async () => {
    await repo.create(sample);
    await repo.clear();
    await expect(repo.findById("enquiry-prisma-1")).resolves.toBeUndefined();
  });
});
