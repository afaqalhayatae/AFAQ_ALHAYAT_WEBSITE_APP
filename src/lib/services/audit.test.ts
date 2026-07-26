import { describe, expect, it } from "vitest";
import { generateId, writeAuditEvent } from "./audit";
import { createInMemoryAuditEventRepository } from "@/lib/adapters/in-memory/audit-event-repository";

describe("generateId", () => {
  it("prefixes the id and produces distinct values", () => {
    const a = generateId("enq");
    const b = generateId("enq");
    expect(a).toMatch(/^enq_/);
    expect(a).not.toBe(b);
  });
});

describe("writeAuditEvent", () => {
  it("records an event with generated id, timestamp, and correlationId", () => {
    const auditEvents = createInMemoryAuditEventRepository();

    writeAuditEvent(auditEvents, {
      actor: "test-actor",
      action: "test.action",
      target: "test-target",
      outcome: "success",
    });

    const [event] = auditEvents.findByActor("test-actor");
    expect(event).toBeDefined();
    expect(event?.action).toBe("test.action");
    expect(event?.target).toBe("test-target");
    expect(event?.outcome).toBe("success");
    expect(event?.id).toMatch(/^audit_/);
    expect(() => new Date(event!.timestamp).toISOString()).not.toThrow();
    expect(event?.correlationId).toBeTruthy();
  });
});
