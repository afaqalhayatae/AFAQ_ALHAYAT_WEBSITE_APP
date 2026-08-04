import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST, approvalRepository, auditEventRepository } from "./route";

function postRequest(body: unknown) {
  return new NextRequest("http://localhost/api/approvals", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function getRequest(query: string) {
  return new NextRequest(`http://localhost/api/approvals${query}`);
}

const validApproval = {
  action: "work_order.create",
  targetType: "WorkOrder",
  targetId: "wo-1",
  riskLevel: "A2",
  requester: "agent-1",
  evidence: "policy-ref-123",
  expiresAt: "2099-01-01T00:00:00.000Z",
};

describe("POST /api/approvals", () => {
  beforeEach(async () => {
    approvalRepository.clear();
    await auditEventRepository.clear();
  });

  it("requests an approval with decision pending", async () => {
    const response = await POST(postRequest(validApproval));
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.data.decision).toBe("pending");
    expect(approvalRepository.findById(body.data.id)).toBeDefined();
  });

  it("rejects an invalid risk level", async () => {
    const response = await POST(postRequest({ ...validApproval, riskLevel: "A9" }));
    expect(response.status).toBe(400);
  });

  it("rejects a missing targetId", async () => {
    const response = await POST(postRequest({ ...validApproval, targetId: "" }));
    expect(response.status).toBe(400);
  });

  it("rejects an unparsable expiresAt", async () => {
    const response = await POST(postRequest({ ...validApproval, expiresAt: "not-a-date" }));
    expect(response.status).toBe(400);
  });
});

describe("GET /api/approvals", () => {
  beforeEach(async () => {
    approvalRepository.clear();
    await auditEventRepository.clear();
  });

  it("returns 404 for an unknown id", async () => {
    const response = await GET(getRequest("?id=appr_missing"));
    expect(response.status).toBe(404);
  });

  it("finds an approval by target", async () => {
    await POST(postRequest(validApproval));

    const response = await GET(getRequest("?targetType=WorkOrder&targetId=wo-1"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toHaveLength(1);
  });

  it("finds approvals by riskLevel", async () => {
    await POST(postRequest(validApproval));

    const response = await GET(getRequest("?riskLevel=A2"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toHaveLength(1);
  });

  it("requires a query parameter", async () => {
    const response = await GET(getRequest(""));
    expect(response.status).toBe(400);
  });
});
