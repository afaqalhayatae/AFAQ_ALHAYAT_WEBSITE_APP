import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import {
  approvalRepository,
  auditEventRepository,
  POST as requestApprovalPost,
} from "../../route";

function decisionRequest(id: string, body: unknown) {
  return new NextRequest(`http://localhost/api/approvals/${id}/decision`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function createApproval(overrides: Partial<Record<string, unknown>> = {}) {
  return requestApprovalPost(
    new NextRequest("http://localhost/api/approvals", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "work_order.create",
        targetType: "WorkOrder",
        targetId: "wo-1",
        riskLevel: "A2",
        requester: "agent-1",
        evidence: "policy-ref-123",
        expiresAt: "2099-01-01T00:00:00.000Z",
        ...overrides,
      }),
    })
  );
}

describe("POST /api/approvals/[id]/decision", () => {
  beforeEach(async () => {
    approvalRepository.clear();
    await auditEventRepository.clear();
  });

  it("approves a pending approval", async () => {
    const created = await createApproval();
    const { data } = await created.json();

    const response = await POST(decisionRequest(data.id, { decision: "approved", decidedBy: "manager-1" }), {
      params: Promise.resolve({ id: data.id }),
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data.decision).toBe("approved");
  });

  it("returns 404 for an unknown approval id", async () => {
    const response = await POST(decisionRequest("appr_missing", { decision: "approved", decidedBy: "manager-1" }), {
      params: Promise.resolve({ id: "appr_missing" }),
    });
    expect(response.status).toBe(404);
  });

  it("returns 409 when the approval was already decided", async () => {
    const created = await createApproval();
    const { data } = await created.json();

    await POST(decisionRequest(data.id, { decision: "approved", decidedBy: "manager-1" }), {
      params: Promise.resolve({ id: data.id }),
    });
    const response = await POST(decisionRequest(data.id, { decision: "rejected", decidedBy: "manager-1" }), {
      params: Promise.resolve({ id: data.id }),
    });
    expect(response.status).toBe(409);
  });

  it("rejects an invalid decision value", async () => {
    const created = await createApproval();
    const { data } = await created.json();

    const response = await POST(decisionRequest(data.id, { decision: "maybe", decidedBy: "manager-1" }), {
      params: Promise.resolve({ id: data.id }),
    });
    expect(response.status).toBe(400);
  });
});
