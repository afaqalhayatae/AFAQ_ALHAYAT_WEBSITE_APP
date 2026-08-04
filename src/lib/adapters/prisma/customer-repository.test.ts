import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest";
import { createPrismaCustomerRepository } from "./customer-repository";
import { prisma } from "./client";
import type { Customer } from "@/types/domain";
import type { AsyncCustomerRepository } from "./types";

// Mirrors in-memory/customer-repository.test.ts's contract exactly, adapted
// for the real async database call this implementation makes. Requires a
// reachable local dev database (DATABASE_URL) — skipped, not failed, when
// one isn't configured, so the general suite still runs without Docker.
const sample: Customer = {
  id: "cust-prisma-1",
  contactPoints: [{ channel: "email", value: "test@example.test" }],
};

describe.skipIf(!process.env.DATABASE_URL)("Prisma CustomerRepository", () => {
  let repo: AsyncCustomerRepository;

  beforeEach(() => {
    repo = createPrismaCustomerRepository();
  });

  afterEach(async () => {
    await repo.clear();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates and finds a customer by id", async () => {
    await repo.create(sample);
    await expect(repo.findById("cust-prisma-1")).resolves.toEqual(sample);
    await expect(repo.findById("missing")).resolves.toBeUndefined();
  });

  it("clears all customers", async () => {
    await repo.create(sample);
    await repo.clear();
    await expect(repo.findById("cust-prisma-1")).resolves.toBeUndefined();
  });
});
