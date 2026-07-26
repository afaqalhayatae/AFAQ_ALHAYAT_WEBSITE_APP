import { beforeEach, describe, expect, it } from "vitest";
import { createInMemoryAuditEventRepository } from "./audit-event-repository";
import type { AuditEvent } from "@/types/domain";
import type { AuditEventRepository } from "@/lib/adapters/types";

const sample: AuditEvent = {
  id: "audit-1",
  actor: "AGT-WEB",
  action: "test-action",
  target: "test-target",
  outcome: "success",
  timestamp: "2026-07-26T00:00:00.000Z",
  correlationId: "corr-1",
};

describe("in-memory AuditEventRepository", () => {
  let repo: AuditEventRepository;

  beforeEach(() => {
    repo = createInMemoryAuditEventRepository();
  });

  it("records and finds events by actor", () => {
    repo.record(sample);
    expect(repo.findByActor("AGT-WEB")).toEqual([sample]);
    expect(repo.findByActor("other")).toEqual([]);
  });

  it("clears all events", () => {
    repo.record(sample);
    repo.clear();
    expect(repo.findByActor("AGT-WEB")).toEqual([]);
  });
});
