import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST, consentStore, auditEventRepository } from "./route";

function postRequest(body: unknown) {
  return new NextRequest("http://localhost/api/consents", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function getRequest(query: string) {
  return new NextRequest(`http://localhost/api/consents${query}`);
}

const validConsent = {
  channel: "whatsapp",
  purpose: "marketing",
  status: "granted",
  source: "web-form",
  evidence: "checkbox-timestamp-123",
  recordedAt: "2026-01-01T00:00:00.000Z",
  actor: "test-actor",
};

describe("POST /api/consents", () => {
  beforeEach(async () => {
    await consentStore.clear();
    await auditEventRepository.clear();
  });

  it("records a consent and returns an API envelope", async () => {
    const response = await POST(postRequest(validConsent));
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.data.status).toBe("granted");
    expect(body.data.channel).toBe("whatsapp");
    await expect(consentStore.findById(body.data.id)).resolves.toBeDefined();
  });

  it("rejects an invalid channel", async () => {
    const response = await POST(postRequest({ ...validConsent, channel: "carrier-pigeon" }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error.code).toBe("validation_error");
  });

  it("rejects a missing evidence field", async () => {
    const response = await POST(postRequest({ ...validConsent, evidence: "" }));
    expect(response.status).toBe(400);
  });
});

describe("GET /api/consents", () => {
  beforeEach(async () => {
    await consentStore.clear();
    await auditEventRepository.clear();
  });

  it("returns 404 for an unknown id", async () => {
    const response = await GET(getRequest("?id=consent_missing"));
    expect(response.status).toBe(404);
  });

  it("returns a consent by id", async () => {
    const created = await POST(postRequest(validConsent));
    const { data } = await created.json();

    const response = await GET(getRequest(`?id=${data.id}`));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data.id).toBe(data.id);
  });

  it("lists consents by channel", async () => {
    await POST(postRequest(validConsent));
    await POST(postRequest({ ...validConsent, channel: "email" }));

    const response = await GET(getRequest("?channel=whatsapp"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toHaveLength(1);
  });

  it("requires an id or channel query parameter", async () => {
    const response = await GET(getRequest(""));
    expect(response.status).toBe(400);
  });
});
