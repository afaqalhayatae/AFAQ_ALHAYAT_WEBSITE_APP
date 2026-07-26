import { beforeEach, describe, expect, it } from "vitest";
import { decideApproval, requestApproval } from "./approval-service";
import {
  ApprovalAlreadyDecidedError,
  ApprovalExpiredError,
  UnknownApprovalError,
} from "./errors";
import { createInMemoryApprovalRepository } from "@/lib/adapters/in-memory/approval-repository";
import { createInMemoryAuditEventRepository } from "@/lib/adapters/in-memory/audit-event-repository";
import type {
  ApprovalRepository,
  AuditEventRepository,
} from "@/lib/adapters/types";

describe("requestApproval", () => {
  let approvals: ApprovalRepository;
  let auditEvents: AuditEventRepository;

  beforeEach(() => {
    approvals = createInMemoryApprovalRepository();
    auditEvents = createInMemoryAuditEventRepository();
  });

  it("always creates a pending approval", () => {
    const approval = requestApproval(
      { approvals, auditEvents },
      {
        action: "test-action",
        riskLevel: "A4",
        requester: "test-agent",
        evidence: "test-fixture",
        expiresAt: "2099-01-01T00:00:00.000Z",
      }
    );

    expect(approval.decision).toBe("pending");
    expect(approvals.findById(approval.id)).toEqual(approval);
  });
});

describe("decideApproval", () => {
  let approvals: ApprovalRepository;
  let auditEvents: AuditEventRepository;

  beforeEach(() => {
    approvals = createInMemoryApprovalRepository();
    auditEvents = createInMemoryAuditEventRepository();
  });

  it("transitions a pending approval to approved", () => {
    const pending = requestApproval(
      { approvals, auditEvents },
      {
        action: "test-action",
        riskLevel: "A4",
        requester: "test-agent",
        evidence: "test-fixture",
        expiresAt: "2099-01-01T00:00:00.000Z",
      }
    );

    const decided = decideApproval(
      { approvals, auditEvents },
      { approvalId: pending.id, decision: "approved", decidedBy: "owner" }
    );

    expect(decided.decision).toBe("approved");
    expect(approvals.findById(pending.id)?.decision).toBe("approved");
  });

  it("rejects deciding an unknown approval", () => {
    expect(() =>
      decideApproval(
        { approvals, auditEvents },
        { approvalId: "missing", decision: "approved", decidedBy: "owner" }
      )
    ).toThrow(UnknownApprovalError);
  });

  it("rejects re-deciding an already-decided approval", () => {
    const pending = requestApproval(
      { approvals, auditEvents },
      {
        action: "test-action",
        riskLevel: "A4",
        requester: "test-agent",
        evidence: "test-fixture",
        expiresAt: "2099-01-01T00:00:00.000Z",
      }
    );
    decideApproval(
      { approvals, auditEvents },
      { approvalId: pending.id, decision: "approved", decidedBy: "owner" }
    );

    expect(() =>
      decideApproval(
        { approvals, auditEvents },
        { approvalId: pending.id, decision: "rejected", decidedBy: "owner" }
      )
    ).toThrow(ApprovalAlreadyDecidedError);
  });

  it("rejects deciding an expired approval and marks it expired", () => {
    const pending = requestApproval(
      { approvals, auditEvents },
      {
        action: "test-action",
        riskLevel: "A4",
        requester: "test-agent",
        evidence: "test-fixture",
        expiresAt: "2020-01-01T00:00:00.000Z",
      }
    );

    expect(() =>
      decideApproval(
        { approvals, auditEvents },
        { approvalId: pending.id, decision: "approved", decidedBy: "owner" }
      )
    ).toThrow(ApprovalExpiredError);
    expect(approvals.findById(pending.id)?.decision).toBe("expired");
  });
});
