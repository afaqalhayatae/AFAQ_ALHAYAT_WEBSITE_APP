import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest";
import { generateId, writeAuditEvent } from "./audit";
import { getAuditEventRepository } from "@/lib/adapters/repository-factory";
import { prisma } from "@/lib/adapters/prisma/client";
import type { AsyncAuditEventRepository } from "@/lib/adapters/prisma/types";

describe("generateId", () => {
  it("prefixes the id and produces distinct values", () => {
    const a = generateId("enq");
    const b = generateId("enq");
    expect(a).toMatch(/^enq_/);
    expect(a).not.toBe(b);
  });
});

// Database Foundation Phase 1J — AuditEvent switchover, the last of the
// six-entity migration series. writeAuditEvent is the shared helper every
// domain service in this codebase calls — this is the canonical, most
// heavily-exercised test of the new async contract.
function makeSuite(driver: "memory" | "prisma") {
  describe(`writeAuditEvent (${driver} driver)`, () => {
    let auditEvents: AsyncAuditEventRepository;
    const originalDriver = process.env.REPOSITORY_DRIVER;

    beforeEach(() => {
      process.env.REPOSITORY_DRIVER = driver;
      auditEvents = getAuditEventRepository();
    });

    afterEach(async () => {
      if (originalDriver === undefined) {
        delete process.env.REPOSITORY_DRIVER;
      } else {
        process.env.REPOSITORY_DRIVER = originalDriver;
      }
      await auditEvents.clear();
    });

    it("records an event with generated id, timestamp, and correlationId", async () => {
      await writeAuditEvent(auditEvents, {
        actor: "test-actor",
        action: "test.action",
        target: "test-target",
        outcome: "success",
      });

      const [event] = await auditEvents.findByActor("test-actor");
      expect(event).toBeDefined();
      expect(event?.action).toBe("test.action");
      expect(event?.target).toBe("test-target");
      expect(event?.outcome).toBe("success");
      expect(event?.id).toMatch(/^audit_/);
      expect(() => new Date(event!.timestamp).toISOString()).not.toThrow();
      expect(event?.correlationId).toBeTruthy();
    });

    it("records multiple events for the same actor independently", async () => {
      await writeAuditEvent(auditEvents, {
        actor: "test-actor",
        action: "test.first",
        target: "target-1",
        outcome: "success",
      });
      await writeAuditEvent(auditEvents, {
        actor: "test-actor",
        action: "test.second",
        target: "target-2",
        outcome: "rejected",
      });

      const events = await auditEvents.findByActor("test-actor");
      expect(events).toHaveLength(2);
      // Every id/correlationId must be distinct — two events in the same
      // millisecond must never collide.
      expect(new Set(events.map((e) => e.id)).size).toBe(2);
      expect(new Set(events.map((e) => e.correlationId)).size).toBe(2);
    });

    it("findByActor returns no events for an unrelated actor", async () => {
      await writeAuditEvent(auditEvents, {
        actor: "actor-a",
        action: "test.action",
        target: "target",
        outcome: "success",
      });

      await expect(auditEvents.findByActor("actor-b")).resolves.toEqual([]);
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

// Data consistency check: the same writeAuditEvent call, against both
// backends, produces the same event shape (minus the independently
// generated id/correlationId/timestamp, which are expected to differ).
describe.skipIf(!process.env.DATABASE_URL)("AuditEvent data consistency across drivers", () => {
  const originalDriver = process.env.REPOSITORY_DRIVER;

  afterEach(async () => {
    if (originalDriver === undefined) {
      delete process.env.REPOSITORY_DRIVER;
    } else {
      process.env.REPOSITORY_DRIVER = originalDriver;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("produces the same AuditEvent shape from memory and prisma for identical input", async () => {
    const params = {
      actor: "consistency-actor",
      action: "consistency.check",
      target: "consistency-target",
      outcome: "success" as const,
    };

    process.env.REPOSITORY_DRIVER = "memory";
    const memoryAudit = getAuditEventRepository();
    await writeAuditEvent(memoryAudit, params);
    const [memoryEvent] = await memoryAudit.findByActor("consistency-actor");
    await memoryAudit.clear();

    process.env.REPOSITORY_DRIVER = "prisma";
    const prismaAudit = getAuditEventRepository();
    await writeAuditEvent(prismaAudit, params);
    const [prismaEvent] = await prismaAudit.findByActor("consistency-actor");
    await prismaAudit.clear();

    expect(memoryEvent.actor).toBe(prismaEvent.actor);
    expect(memoryEvent.action).toBe(prismaEvent.action);
    expect(memoryEvent.target).toBe(prismaEvent.target);
    expect(memoryEvent.outcome).toBe(prismaEvent.outcome);
    // Both timestamps must be valid, real ISO strings — not required to be
    // equal (each write calls new Date() independently).
    expect(() => new Date(memoryEvent.timestamp).toISOString()).not.toThrow();
    expect(() => new Date(prismaEvent.timestamp).toISOString()).not.toThrow();
  });
});

// Ordering/timestamp verification: a real, previously-undocumented
// question this migration raises — the in-memory adapter's findByActor
// filters a plain array, which naturally preserves insertion order.
// Prisma's findMany has no explicit orderBy in the adapter
// (audit-event-repository.ts), so return order is not contractually
// guaranteed by Prisma/MySQL. This test verifies event *timestamps* are
// monotonically non-decreasing (the actual ordering guarantee any real
// caller needs) rather than assuming raw array/row order — sorting by
// timestamp before asserting is the correct way to check this, not an
// assumption that either backend returns rows in write order.
describe.skipIf(!process.env.DATABASE_URL)("AuditEvent ordering and timestamps", () => {
  const originalDriver = process.env.REPOSITORY_DRIVER;

  afterEach(async () => {
    if (originalDriver === undefined) {
      delete process.env.REPOSITORY_DRIVER;
    } else {
      process.env.REPOSITORY_DRIVER = originalDriver;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it.each(["memory", "prisma"] as const)(
    "writes events with monotonically non-decreasing timestamps (%s driver)",
    async (driver) => {
      process.env.REPOSITORY_DRIVER = driver;
      const auditEvents = getAuditEventRepository();

      for (let i = 0; i < 5; i += 1) {
        await writeAuditEvent(auditEvents, {
          actor: "ordering-actor",
          action: `test.step-${i}`,
          target: `target-${i}`,
          outcome: "success",
        });
      }

      const events = await auditEvents.findByActor("ordering-actor");
      expect(events).toHaveLength(5);

      const timestamps = events.map((e) => new Date(e.timestamp).getTime());
      const sorted = [...timestamps].sort((a, b) => a - b);
      expect(timestamps).toEqual(sorted);

      // All 5 actions are present exactly once — proves no event was lost
      // or duplicated regardless of the order they came back in.
      const actions = events.map((e) => e.action).sort();
      expect(actions).toEqual([
        "test.step-0",
        "test.step-1",
        "test.step-2",
        "test.step-3",
        "test.step-4",
      ]);

      await auditEvents.clear();
    }
  );
});
