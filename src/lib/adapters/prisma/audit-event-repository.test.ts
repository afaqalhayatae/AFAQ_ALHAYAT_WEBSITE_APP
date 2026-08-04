import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest";
import { createPrismaAuditEventRepository } from "./audit-event-repository";
import { prisma } from "./client";
import type { AuditEvent } from "@/types/domain";
import type { AsyncAuditEventRepository } from "./types";

// Mirrors in-memory/audit-event-repository.test.ts's contract, adapted for
// the real async database call and the DateTime<->ISO string round-trip on
// timestamp. Skipped without a reachable DATABASE_URL.
const sample: AuditEvent = {
  id: "audit-prisma-1",
  actor: "AGT-WEB",
  action: "test-action",
  target: "test-target",
  outcome: "success",
  timestamp: "2026-07-26T00:00:00.000Z",
  correlationId: "corr-prisma-1",
};

describe.skipIf(!process.env.DATABASE_URL)("Prisma AuditEventRepository", () => {
  let repo: AsyncAuditEventRepository;

  beforeEach(() => {
    repo = createPrismaAuditEventRepository();
  });

  afterEach(async () => {
    await repo.clear();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("records and finds events by actor", async () => {
    await repo.record(sample);
    await expect(repo.findByActor("AGT-WEB")).resolves.toEqual([sample]);
    await expect(repo.findByActor("other")).resolves.toEqual([]);
  });

  it("clears all events", async () => {
    await repo.record(sample);
    await repo.clear();
    await expect(repo.findByActor("AGT-WEB")).resolves.toEqual([]);
  });
});
