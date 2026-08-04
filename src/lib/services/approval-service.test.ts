import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { decideApproval, requestApproval } from "./approval-service";
import {
  ApprovalAlreadyDecidedError,
  ApprovalExpiredError,
  UnknownApprovalError,
} from "./errors";
import { createInMemoryApprovalRepository } from "@/lib/adapters/in-memory/approval-repository";
import { getAuditEventRepository } from "@/lib/adapters/repository-factory";
import type { ApprovalRepository } from "@/lib/adapters/types";
import type { AsyncAuditEventRepository } from "@/lib/adapters/prisma/types";

// Database Foundation Phase 1J — AuditEvent switchover. Both functions in
// approval-service.ts became async purely as a consequence of
// writeAuditEvent's signature change — no approval-decision logic changed.
// approvals stays the existing synchronous repository, untouched (not in
// the migration priority list).
describe("requestApproval", () => {
  let approvals: ApprovalRepository;
  let auditEvents: AsyncAuditEventRepository;

  beforeEach(() => {
    approvals = createInMemoryApprovalRepository();
    auditEvents = getAuditEventRepository();
  });

  afterEach(async () => {
    await auditEvents.clear();
  });

  it("always creates a pending approval", async () => {
    const approval = await requestApproval(
      { approvals, auditEvents },
      {
        action: "test-action",
        targetType: "BookingRequest",
        targetId: "book-1",
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
  let auditEvents: AsyncAuditEventRepository;

  beforeEach(() => {
    approvals = createInMemoryApprovalRepository();
    auditEvents = getAuditEventRepository();
  });

  afterEach(async () => {
    await auditEvents.clear();
  });

  it("transitions a pending approval to approved", async () => {
    const pending = await requestApproval(
      { approvals, auditEvents },
      {
        action: "test-action",
        targetType: "BookingRequest",
        targetId: "book-1",
        riskLevel: "A4",
        requester: "test-agent",
        evidence: "test-fixture",
        expiresAt: "2099-01-01T00:00:00.000Z",
      }
    );

    const decided = await decideApproval(
      { approvals, auditEvents },
      { approvalId: pending.id, decision: "approved", decidedBy: "owner" }
    );

    expect(decided.decision).toBe("approved");
    expect(approvals.findById(pending.id)?.decision).toBe("approved");
  });

  it("rejects deciding an unknown approval", async () => {
    await expect(
      decideApproval(
        { approvals, auditEvents },
        { approvalId: "missing", decision: "approved", decidedBy: "owner" }
      )
    ).rejects.toThrow(UnknownApprovalError);
  });

  it("rejects re-deciding an already-decided approval", async () => {
    const pending = await requestApproval(
      { approvals, auditEvents },
      {
        action: "test-action",
        targetType: "BookingRequest",
        targetId: "book-1",
        riskLevel: "A4",
        requester: "test-agent",
        evidence: "test-fixture",
        expiresAt: "2099-01-01T00:00:00.000Z",
      }
    );
    await decideApproval(
      { approvals, auditEvents },
      { approvalId: pending.id, decision: "approved", decidedBy: "owner" }
    );

    await expect(
      decideApproval(
        { approvals, auditEvents },
        { approvalId: pending.id, decision: "rejected", decidedBy: "owner" }
      )
    ).rejects.toThrow(ApprovalAlreadyDecidedError);
  });

  it("rejects deciding an expired approval and marks it expired", async () => {
    const pending = await requestApproval(
      { approvals, auditEvents },
      {
        action: "test-action",
        targetType: "BookingRequest",
        targetId: "book-1",
        riskLevel: "A4",
        requester: "test-agent",
        evidence: "test-fixture",
        expiresAt: "2020-01-01T00:00:00.000Z",
      }
    );

    await expect(
      decideApproval(
        { approvals, auditEvents },
        { approvalId: pending.id, decision: "approved", decidedBy: "owner" }
      )
    ).rejects.toThrow(ApprovalExpiredError);
    expect(approvals.findById(pending.id)?.decision).toBe("expired");
  });
});

describe("requestApproval target binding", () => {
  let approvals: ApprovalRepository;
  let auditEvents: AsyncAuditEventRepository;

  beforeEach(() => {
    approvals = createInMemoryApprovalRepository();
    auditEvents = getAuditEventRepository();
  });

  afterEach(async () => {
    await auditEvents.clear();
  });

  it("rejects a request with no targetType", async () => {
    await expect(
      requestApproval(
        { approvals, auditEvents },
        {
          action: "test-action",
          targetType: "",
          targetId: "book-1",
          riskLevel: "A4",
          requester: "test-agent",
          evidence: "test-fixture",
          expiresAt: "2099-01-01T00:00:00.000Z",
        }
      )
    ).rejects.toThrow();
  });

  it("rejects a request with no targetId", async () => {
    await expect(
      requestApproval(
        { approvals, auditEvents },
        {
          action: "test-action",
          targetType: "BookingRequest",
          targetId: "",
          riskLevel: "A4",
          requester: "test-agent",
          evidence: "test-fixture",
          expiresAt: "2099-01-01T00:00:00.000Z",
        }
      )
    ).rejects.toThrow();
  });
});
