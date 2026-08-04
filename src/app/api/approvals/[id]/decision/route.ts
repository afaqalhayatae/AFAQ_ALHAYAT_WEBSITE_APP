/**
 * API boundary for deciding an Approval per
 * 08_DIGITAL_SYSTEMS/API_CONTRACTS.md. Validates input, delegates to the
 * approval service, and returns API envelopes. Shares the in-memory
 * Approval repository exported by the parent route so a decision applies
 * to the same record a prior POST /api/approvals created.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  approvalRepository,
  auditEventRepository,
  envelope,
  errorResponse,
} from "../../route";
import { decideApproval } from "@/lib/services/approval-service";
import {
  ApprovalAlreadyDecidedError,
  ApprovalExpiredError,
  UnknownApprovalError,
} from "@/lib/services/errors";

const DECISIONS = ["approved", "rejected"] as const;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "invalid_json", "Request body must be valid JSON");
  }
  if (typeof body !== "object" || body === null) {
    return errorResponse(400, "invalid_body", "Request body must be a JSON object");
  }

  const { decision, decidedBy } = body as Record<string, unknown>;
  if (
    !DECISIONS.includes(decision as (typeof DECISIONS)[number]) ||
    !isNonEmptyString(decidedBy)
  ) {
    return errorResponse(
      400,
      "validation_error",
      "decision (approved|rejected) and decidedBy are required"
    );
  }

  try {
    const approval = await decideApproval(
      { approvals: approvalRepository, auditEvents: auditEventRepository },
      {
        approvalId: id,
        decision: decision as "approved" | "rejected",
        decidedBy,
      }
    );
    return NextResponse.json(envelope(approval), { status: 200 });
  } catch (error) {
    if (error instanceof UnknownApprovalError) {
      return errorResponse(404, "not_found", error.message);
    }
    if (
      error instanceof ApprovalAlreadyDecidedError ||
      error instanceof ApprovalExpiredError
    ) {
      return errorResponse(409, "conflict", error.message);
    }
    return errorResponse(
      400,
      "validation_error",
      error instanceof Error ? error.message : "Invalid request"
    );
  }
}
