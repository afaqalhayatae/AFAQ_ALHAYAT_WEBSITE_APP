import { beforeEach, describe, expect, it } from "vitest";
import { createInMemoryApprovalRepository } from "./approval-repository";
import type { Approval } from "@/types/domain";
import type { ApprovalRepository } from "@/lib/adapters/types";

const sample: Approval = {
  id: "appr-1",
  action: "test-action",
  targetType: "BookingRequest",
  targetId: "book-1",
  riskLevel: "A4",
  requester: "test-agent",
  decision: "pending",
  evidence: "test-fixture",
  expiresAt: "2026-08-01T00:00:00.000Z",
};

describe("in-memory ApprovalRepository", () => {
  let repo: ApprovalRepository;

  beforeEach(() => {
    repo = createInMemoryApprovalRepository();
  });

  it("creates and finds an approval by id", () => {
    repo.create(sample);
    expect(repo.findById("appr-1")).toEqual(sample);
    expect(repo.findById("missing")).toBeUndefined();
  });

  it("finds approvals by risk level", () => {
    repo.create(sample);
    expect(repo.findByRiskLevel("A4")).toEqual([sample]);
    expect(repo.findByRiskLevel("A1")).toEqual([]);
  });

  it("finds approvals by target", () => {
    repo.create(sample);
    expect(repo.findByTarget("BookingRequest", "book-1")).toEqual([sample]);
    expect(repo.findByTarget("BookingRequest", "book-2")).toEqual([]);
    expect(repo.findByTarget("WorkOrder", "book-1")).toEqual([]);
  });

  it("clears all approvals", () => {
    repo.create(sample);
    repo.clear();
    expect(repo.findById("appr-1")).toBeUndefined();
  });
});
