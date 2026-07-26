import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import {
  GET,
  POST,
  bookingRepository,
  serviceRepository,
  serviceAreaRepository,
  auditEventRepository,
} from "./route";

function postRequest(body: unknown) {
  return new NextRequest("http://localhost/api/bookings", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function getRequest(query: string) {
  return new NextRequest(`http://localhost/api/bookings${query}`);
}

describe("POST /api/bookings", () => {
  beforeEach(() => {
    bookingRepository.clear();
    serviceRepository.clear();
    serviceAreaRepository.clear();
    auditEventRepository.clear();
    serviceRepository.upsert({ id: "SVC-ac-repair" });
    serviceAreaRepository.upsert({ id: "LOC-AE-dubai" });
  });

  it("creates a booking request and returns an API envelope", async () => {
    const response = await POST(
      postRequest({
        customerId: "cust-1",
        serviceId: "SVC-ac-repair",
        serviceAreaId: "LOC-AE-dubai",
        schedulePreference: "weekday-morning",
        actor: "test-actor",
      })
    );
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.data.status).toBe("requested");
    expect(body.data.customerId).toBe("cust-1");
    expect(bookingRepository.findById(body.data.id)).toBeDefined();
  });

  it("returns 404 for an unknown service", async () => {
    const response = await POST(
      postRequest({
        customerId: "cust-1",
        serviceId: "SVC-unknown",
        serviceAreaId: "LOC-AE-dubai",
        schedulePreference: "weekday-morning",
        actor: "test-actor",
      })
    );
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error.code).toBe("not_found");
  });

  it("returns 404 for an unknown service area", async () => {
    const response = await POST(
      postRequest({
        customerId: "cust-1",
        serviceId: "SVC-ac-repair",
        serviceAreaId: "LOC-AE-unknown",
        schedulePreference: "weekday-morning",
        actor: "test-actor",
      })
    );
    expect(response.status).toBe(404);
  });

  it("rejects a malformed serviceId", async () => {
    const response = await POST(
      postRequest({
        customerId: "cust-1",
        serviceId: "not-a-service-id",
        serviceAreaId: "LOC-AE-dubai",
        schedulePreference: "weekday-morning",
        actor: "test-actor",
      })
    );
    expect(response.status).toBe(400);
  });

  it("rejects a missing customerId", async () => {
    const response = await POST(
      postRequest({
        serviceId: "SVC-ac-repair",
        serviceAreaId: "LOC-AE-dubai",
        schedulePreference: "weekday-morning",
        actor: "test-actor",
      })
    );
    expect(response.status).toBe(400);
  });
});

describe("GET /api/bookings", () => {
  beforeEach(() => {
    bookingRepository.clear();
    serviceRepository.clear();
    serviceAreaRepository.clear();
    auditEventRepository.clear();
    serviceRepository.upsert({ id: "SVC-ac-repair" });
    serviceAreaRepository.upsert({ id: "LOC-AE-dubai" });
  });

  it("returns 404 for an unknown id", async () => {
    const response = await GET(getRequest("?id=book_missing"));
    expect(response.status).toBe(404);
  });

  it("lists bookings by serviceId", async () => {
    await POST(
      postRequest({
        customerId: "cust-1",
        serviceId: "SVC-ac-repair",
        serviceAreaId: "LOC-AE-dubai",
        schedulePreference: "weekday-morning",
        actor: "test-actor",
      })
    );

    const response = await GET(getRequest("?serviceId=SVC-ac-repair"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toHaveLength(1);
  });

  it("requires an id or serviceId query parameter", async () => {
    const response = await GET(getRequest(""));
    expect(response.status).toBe(400);
  });
});
