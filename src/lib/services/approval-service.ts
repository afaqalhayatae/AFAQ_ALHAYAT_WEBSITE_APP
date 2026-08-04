/**
 * 08_DIGITAL_SYSTEMS/DATA_MODEL.md (Status: Approved, v0.2). Approval: "id,
 * action, target type, target ID, risk level, requester, decision,
 * evidence, and expiry." AUTONOMY_AND_APPROVAL_MATRIX.md: "Agents cannot
 * approve their own high-risk work."
 *
 * requestApproval always writes decision: "pending" — the input type omits
 * `decision` entirely, so no caller can create an already-approved record.
 * It also requires targetType/targetId (DATA_MODEL.md Rules: "An Approval
 * must match the exact action instance ... that it authorizes") — a
 * request with no target is rejected rather than silently accepted.
 * decideApproval only transitions an existing pending record; it never
 * originates a decision on its own, and nothing in this module calls it
 * with "approved" automatically.
 *
 * ApprovalRepository has no update method (see
 * src/lib/adapters/types.ts). The in-memory adapter's create() is
 * Map-keyed by id, so calling create() again with the same id and a new
 * decision acts as the transition. A future persistent adapter must
 * implement create() as an upsert, or this call must change to an
 * explicit update().
 */

import type { Approval } from "@/types/domain";
import type { ApprovalRepository } from "@/lib/adapters/types";
import type { AsyncAuditEventRepository } from "@/lib/adapters/prisma/types";
import { generateId, writeAuditEvent } from "./audit";
import {
  ApprovalAlreadyDecidedError,
  ApprovalExpiredError,
  UnknownApprovalError,
} from "./errors";

export type RequestApprovalInput = Omit<Approval, "id" | "decision">;

// Async (Database Foundation Phase 1J — AuditEvent switchover). Both
// functions below become async purely as a consequence of writeAuditEvent's
// signature change — no approval-decision logic changed. approvals stays
// the existing synchronous repository, untouched (not in the migration
// priority list).
export async function requestApproval(
  deps: { approvals: ApprovalRepository; auditEvents: AsyncAuditEventRepository },
  input: RequestApprovalInput
): Promise<Approval> {
  if (!input.targetType || !input.targetId) {
    throw new Error("targetType and targetId are required");
  }

  const approval: Approval = {
    id: generateId("appr"),
    action: input.action,
    targetType: input.targetType,
    targetId: input.targetId,
    riskLevel: input.riskLevel,
    requester: input.requester,
    decision: "pending",
    evidence: input.evidence,
    expiresAt: input.expiresAt,
  };

  deps.approvals.create(approval);
  await writeAuditEvent(deps.auditEvents, {
    actor: input.requester,
    action: "approval.requested",
    target: approval.id,
    outcome: "success",
  });

  return approval;
}

export interface DecideApprovalInput {
  approvalId: string;
  decision: "approved" | "rejected";
  decidedBy: string;
}

export async function decideApproval(
  deps: { approvals: ApprovalRepository; auditEvents: AsyncAuditEventRepository },
  input: DecideApprovalInput
): Promise<Approval> {
  const approval = deps.approvals.findById(input.approvalId);
  if (!approval) {
    throw new UnknownApprovalError(input.approvalId);
  }
  if (approval.decision !== "pending") {
    throw new ApprovalAlreadyDecidedError(input.approvalId);
  }
  if (Date.now() > Date.parse(approval.expiresAt)) {
    const expired: Approval = { ...approval, decision: "expired" };
    deps.approvals.create(expired);
    throw new ApprovalExpiredError(input.approvalId);
  }

  const decided: Approval = { ...approval, decision: input.decision };
  deps.approvals.create(decided);
  await writeAuditEvent(deps.auditEvents, {
    actor: input.decidedBy,
    action: `approval.${input.decision}`,
    target: approval.id,
    outcome: "success",
  });

  return decided;
}
