import { beforeEach, describe, expect, it } from "vitest";
import { createInMemoryBookingRequestRepository } from "./booking-request-repository";
import type { BookingRequest } from "@/types/domain";
import type { BookingRequestRepository } from "@/lib/adapters/types";

const sample: BookingRequest = {
  id: "book-1",
  customerId: "cust-1",
  serviceId: "SVC-TEST-SERVICE",
  serviceAreaId: "LOC-AE-TEST",
  schedulePreference: "test preference",
  status: "requested",
};

describe("in-memory BookingRequestRepository", () => {
  let repo: BookingRequestRepository;

  beforeEach(() => {
    repo = createInMemoryBookingRequestRepository();
  });

  it("creates and finds a booking request by id", () => {
    repo.create(sample);
    expect(repo.findById("book-1")).toEqual(sample);
    expect(repo.findById("missing")).toBeUndefined();
  });

  it("finds booking requests by service", () => {
    repo.create(sample);
    expect(repo.findByService("SVC-TEST-SERVICE")).toEqual([sample]);
    expect(repo.findByService("SVC-OTHER")).toEqual([]);
  });

  it("finds booking requests by customer", () => {
    repo.create(sample);
    expect(repo.findByCustomer("cust-1")).toEqual([sample]);
    expect(repo.findByCustomer("cust-other")).toEqual([]);
  });

  it("clears all booking requests", () => {
    repo.create(sample);
    repo.clear();
    expect(repo.findById("book-1")).toBeUndefined();
  });
});
