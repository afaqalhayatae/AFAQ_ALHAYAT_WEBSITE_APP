import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST, enquiryRepository, auditEventRepository } from "./route";

function postRequest(body: unknown) {
  return new NextRequest("http://localhost/api/enquiries", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function getRequest(query: string) {
  return new NextRequest(`http://localhost/api/enquiries${query}`);
}

describe("POST /api/enquiries", () => {
  beforeEach(() => {
    enquiryRepository.clear();
    auditEventRepository.clear();
  });

  it("creates an enquiry and returns an API envelope", async () => {
    const response = await POST(
      postRequest({
        customerId: "cust-1",
        need: "AC repair",
        source: "web",
        actor: "test-actor",
      })
    );
    expect(response.status).toBe(201);

    const body = await response.json();
    expect(body.apiVersion).toBe("v1");
    expect(body.correlationId).toBeTruthy();
    expect(body.data.status).toBe("new");
    expect(body.data.customerId).toBe("cust-1");
    expect(enquiryRepository.findById(body.data.id)).toBeDefined();
  });

  it("rejects a missing required field with a 400 envelope", async () => {
    const response = await POST(
      postRequest({ customerId: "cust-1", need: "", source: "web", actor: "test-actor" })
    );
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.error.code).toBe("validation_error");
  });

  it("rejects invalid JSON", async () => {
    const request = new NextRequest("http://localhost/api/enquiries", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{not-json",
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error.code).toBe("invalid_json");
  });
});

describe("GET /api/enquiries", () => {
  beforeEach(() => {
    enquiryRepository.clear();
    auditEventRepository.clear();
  });

  it("returns 404 for an unknown id", async () => {
    const response = await GET(getRequest("?id=enq_missing"));
    expect(response.status).toBe(404);
  });

  it("returns an enquiry by id", async () => {
    const created = await POST(
      postRequest({
        customerId: "cust-2",
        need: "Plumbing",
        source: "phone",
        actor: "test-actor",
      })
    );
    const { data } = await created.json();

    const response = await GET(getRequest(`?id=${data.id}`));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data.id).toBe(data.id);
  });

  it("lists enquiries by customerId", async () => {
    await POST(
      postRequest({ customerId: "cust-3", need: "A", source: "web", actor: "a" })
    );
    await POST(
      postRequest({ customerId: "cust-3", need: "B", source: "web", actor: "a" })
    );

    const response = await GET(getRequest("?customerId=cust-3"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toHaveLength(2);
  });

  it("requires an id or customerId query parameter", async () => {
    const response = await GET(getRequest(""));
    expect(response.status).toBe(400);
  });
});
