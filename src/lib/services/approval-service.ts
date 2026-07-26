/**
 * PROVISIONAL (M1.1) — 08_DIGITAL_SYSTEMS/DATA_MODEL.md is Status: Draft —
 * Contract Review Required. Approval: "action, risk level, requester,
 * decision, evidence, and expiry." AUTONOMY_AND_APPROVAL_MATRIX.md:
 * "Agents cannot approve their own high-risk work."
 *
 * requestApproval always writes decision: "pending" — the input type omits
 * `decision` entirely, so no caller can create an already-approved record.
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
import type {
  ApprovalRepository,
  AuditEventRepository,
} from "@/lib/adapters/types";
import { generateId, writeAuditEvent } from "./audit";
import {
  ApprovalAlreadyDecidedError,
  ApprovalExpiredError,
  UnknownApprovalError,
} from "./errors";

export type RequestApprovalInput = Omit<Approval, "id" | "decision">;

export function requestApproval(
  deps: { approvals: ApprovalRepository; auditEvents: AuditEventRepository },
  input: RequestApprovalInput
): Approval {
  const approval: Approval = {
    id: generateId("appr"),
    action: input.action,
    riskLevel: input.riskLevel,
    requester: input.requester,
    decision: "pending",
    evidence: input.evidence,
    expiresAt: input.expiresAt,
  };

  deps.approvals.create(approval);
  writeAuditEvent(deps.auditEvents, {
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

export function decideApproval(
  deps: { approvals: ApprovalRepository; auditEvents: AuditEventRepository },
  input: DecideApprovalInput
): Approval {
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
  writeAuditEvent(deps.auditEvents, {
    actor: input.decidedBy,
    action: `approval.${input.decision}`,
    target: approval.id,
    outcome: "success",
  });

  return decided;
}
