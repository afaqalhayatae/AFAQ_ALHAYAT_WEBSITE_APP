/**
 * API boundary for Approval per 08_DIGITAL_SYSTEMS/API_CONTRACTS.md.
 * Validates input, delegates to the approval service, and returns API
 * envelopes. No Prisma queries or database connections here — the
 * repository is the in-memory adapter from src/lib/adapters/in-memory,
 * exported so tests (and the nested decision route) can share the same
 * store.
 */

import { NextRequest, NextResponse } from "next/server";
import type { ApiEnvelope, ApiErrorBody } from "@/types/api";
import type { ApprovalRiskLevel } from "@/types/domain";
import { createInMemoryApprovalRepository } from "@/lib/adapters/in-memory/approval-repository";
import { createInMemoryAuditEventRepository } from "@/lib/adapters/in-memory/audit-event-repository";
import { requestApproval } from "@/lib/services/approval-service";

export const approvalRepository = createInMemoryApprovalRepository();
export const auditEventRepository = createInMemoryAuditEventRepository();

const API_VERSION = "v1";
const RISK_LEVELS: ApprovalRiskLevel[] = ["A0", "A1", "A2", "A3", "A4"];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

export function envelope<T>(data: T): ApiEnvelope<T> {
  return { apiVersion: API_VERSION, correlationId: crypto.randomUUID(), data };
}

export function errorResponse(
  status: number,
  code: string,
  message: string,
  retryable = false
) {
  const body: ApiErrorBody = {
    apiVersion: API_VERSION,
    correlationId: crypto.randomUUID(),
    error: { code, message, retryable },
  };
  return NextResponse.json(body, { status });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "invalid_json", "Request body must be valid JSON");
  }
  if (typeof body !== "object" || body === null) {
    return errorResponse(400, "invalid_body", "Request body must be a JSON object");
  }

  const { action, targetType, targetId, riskLevel, requester, evidence, expiresAt } =
    body as Record<string, unknown>;

  if (
    !isNonEmptyString(action) ||
    !isNonEmptyString(targetType) ||
    !isNonEmptyString(targetId) ||
    !RISK_LEVELS.includes(riskLevel as ApprovalRiskLevel) ||
    !isNonEmptyString(requester) ||
    !isNonEmptyString(evidence) ||
    !isNonEmptyString(expiresAt) ||
    Number.isNaN(Date.parse(expiresAt as string))
  ) {
    return errorResponse(
      400,
      "validation_error",
      "action, targetType, targetId, riskLevel (A0-A4), requester, evidence, and a valid expiresAt timestamp are required"
    );
  }

  try {
    const approval = requestApproval(
      { approvals: approvalRepository, auditEvents: auditEventRepository },
      {
        action,
        targetType,
        targetId,
        riskLevel: riskLevel as ApprovalRiskLevel,
        requester,
        evidence,
        expiresAt,
      }
    );
    return NextResponse.json(envelope(approval), { status: 201 });
  } catch (error) {
    return errorResponse(
      400,
      "validation_error",
      error instanceof Error ? error.message : "Invalid request"
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  const riskLevel = searchParams.get("riskLevel");
  const targetType = searchParams.get("targetType");
  const targetId = searchParams.get("targetId");

  if (id) {
    const approval = approvalRepository.findById(id);
    if (!approval) {
      return errorResponse(404, "not_found", `Approval ${id} not found`);
    }
    return NextResponse.json(envelope(approval));
  }

  if (targetType && targetId) {
    return NextResponse.json(
      envelope(approvalRepository.findByTarget(targetType, targetId))
    );
  }

  if (riskLevel) {
    if (!RISK_LEVELS.includes(riskLevel as ApprovalRiskLevel)) {
      return errorResponse(400, "validation_error", "riskLevel is not a recognized value");
    }
    return NextResponse.json(
      envelope(approvalRepository.findByRiskLevel(riskLevel as ApprovalRiskLevel))
    );
  }

  return errorResponse(
    400,
    "validation_error",
    "id, riskLevel, or targetType+targetId query parameters are required"
  );
}
