import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest";
import { createPrismaBookingRequestRepository } from "./booking-request-repository";
import { prisma } from "./client";
import type { BookingRequest } from "@/types/domain";
import type { AsyncBookingRequestRepository } from "./types";

// Mirrors in-memory/booking-request-repository.test.ts's contract, adapted
// for the real async database call. Skipped without a reachable DATABASE_URL.
const sample: BookingRequest = {
  id: "book-prisma-1",
  customerId: "cust-prisma-1",
  serviceId: "SVC-TEST-SERVICE",
  serviceAreaId: "LOC-AE-TEST",
  schedulePreference: "test preference",
  status: "requested",
};

describe.skipIf(!process.env.DATABASE_URL)("Prisma BookingRequestRepository", () => {
  let repo: AsyncBookingRequestRepository;

  beforeEach(() => {
    repo = createPrismaBookingRequestRepository();
  });

  afterEach(async () => {
    await repo.clear();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates and finds a booking request by id", async () => {
    await repo.create(sample);
    await expect(repo.findById("book-prisma-1")).resolves.toEqual(sample);
    await expect(repo.findById("missing")).resolves.toBeUndefined();
  });

  it("finds booking requests by service", async () => {
    await repo.create(sample);
    await expect(repo.findByService("SVC-TEST-SERVICE")).resolves.toEqual([sample]);
    await expect(repo.findByService("SVC-OTHER")).resolves.toEqual([]);
  });

  it("finds booking requests by customer", async () => {
    await repo.create(sample);
    await expect(repo.findByCustomer("cust-prisma-1")).resolves.toEqual([sample]);
    await expect(repo.findByCustomer("cust-other")).resolves.toEqual([]);
  });

  it("clears all booking requests", async () => {
    await repo.create(sample);
    await repo.clear();
    await expect(repo.findById("book-prisma-1")).resolves.toBeUndefined();
  });
});
