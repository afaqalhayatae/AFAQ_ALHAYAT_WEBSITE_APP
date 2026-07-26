import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import {
  GET,
  POST,
  quoteRepository,
  serviceRepository,
  auditEventRepository,
} from "./route";

function postRequest(body: unknown) {
  return new NextRequest("http://localhost/api/quotes", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function getRequest(query: string) {
  return new NextRequest(`http://localhost/api/quotes${query}`);
}

describe("POST /api/quotes", () => {
  beforeEach(() => {
    quoteRepository.clear();
    serviceRepository.clear();
    auditEventRepository.clear();
    serviceRepository.upsert({ id: "SVC-deep-clean" });
  });

  it("creates a quote request and returns an API envelope", async () => {
    const response = await POST(
      postRequest({
        customerId: "cust-1",
        serviceId: "SVC-deep-clean",
        requirements: "3-bedroom villa",
        evidence: ["photo-1.jpg"],
        actor: "test-actor",
      })
    );
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.data.requirements).toBe("3-bedroom villa");
    expect(body.data.customerId).toBe("cust-1");
    expect(body.data.price).toBeUndefined();
    expect(quoteRepository.findById(body.data.id)).toBeDefined();
  });

  it("returns 404 for an unknown service", async () => {
    const response = await POST(
      postRequest({
        customerId: "cust-1",
        serviceId: "SVC-unknown",
        requirements: "3-bedroom villa",
        evidence: [],
        actor: "test-actor",
      })
    );
    expect(response.status).toBe(404);
  });

  it("rejects a non-array evidence field", async () => {
    const response = await POST(
      postRequest({
        customerId: "cust-1",
        serviceId: "SVC-deep-clean",
        requirements: "3-bedroom villa",
        evidence: "not-an-array",
        actor: "test-actor",
      })
    );
    expect(response.status).toBe(400);
  });

  it("rejects a missing customerId", async () => {
    const response = await POST(
      postRequest({
        serviceId: "SVC-deep-clean",
        requirements: "3-bedroom villa",
        evidence: [],
        actor: "test-actor",
      })
    );
    expect(response.status).toBe(400);
  });
});

describe("GET /api/quotes", () => {
  beforeEach(() => {
    quoteRepository.clear();
    serviceRepository.clear();
    auditEventRepository.clear();
    serviceRepository.upsert({ id: "SVC-deep-clean" });
  });

  it("returns 404 for an unknown id", async () => {
    const response = await GET(getRequest("?id=quote_missing"));
    expect(response.status).toBe(404);
  });

  it("lists quotes by serviceId", async () => {
    await POST(
      postRequest({
        customerId: "cust-1",
        serviceId: "SVC-deep-clean",
        requirements: "3-bedroom villa",
        evidence: [],
        actor: "test-actor",
      })
    );

    const response = await GET(getRequest("?serviceId=SVC-deep-clean"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toHaveLength(1);
  });

  it("requires an id or serviceId query parameter", async () => {
    const response = await GET(getRequest(""));
    expect(response.status).toBe(400);
  });
});
