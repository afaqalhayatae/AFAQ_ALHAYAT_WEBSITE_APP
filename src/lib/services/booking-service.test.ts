import { beforeEach, describe, expect, it } from "vitest";
import { requestBooking } from "./booking-service";
import { UnknownServiceAreaError, UnknownServiceError } from "./errors";
import { createInMemoryServiceRepository } from "@/lib/adapters/in-memory/service-repository";
import { createInMemoryServiceAreaRepository } from "@/lib/adapters/in-memory/service-area-repository";
import { createInMemoryBookingRequestRepository } from "@/lib/adapters/in-memory/booking-request-repository";
import { createInMemoryAuditEventRepository } from "@/lib/adapters/in-memory/audit-event-repository";
import type {
  ServiceRepository,
  ServiceAreaRepository,
  BookingRequestRepository,
  AuditEventRepository,
} from "@/lib/adapters/types";

describe("requestBooking", () => {
  let services: ServiceRepository;
  let serviceAreas: ServiceAreaRepository;
  let bookings: BookingRequestRepository;
  let auditEvents: AuditEventRepository;

  beforeEach(() => {
    services = createInMemoryServiceRepository();
    serviceAreas = createInMemoryServiceAreaRepository();
    bookings = createInMemoryBookingRequestRepository();
    auditEvents = createInMemoryAuditEventRepository();
    services.upsert({ id: "SVC-TEST-SERVICE" });
    serviceAreas.upsert({ id: "LOC-AE-TEST" });
  });

  it("creates a booking request at status 'requested'", () => {
    const bookingRequest = requestBooking(
      { services, serviceAreas, bookings, auditEvents },
      {
        serviceId: "SVC-TEST-SERVICE",
        serviceAreaId: "LOC-AE-TEST",
        schedulePreference: "weekday mornings",
        actor: "test-actor",
      }
    );

    expect(bookingRequest.status).toBe("requested");
    expect(bookings.findById(bookingRequest.id)).toEqual(bookingRequest);
  });

  it("rejects an unknown service", () => {
    expect(() =>
      requestBooking(
        { services, serviceAreas, bookings, auditEvents },
        {
          serviceId: "SVC-MISSING",
          serviceAreaId: "LOC-AE-TEST",
          schedulePreference: "weekday mornings",
          actor: "test-actor",
        }
      )
    ).toThrow(UnknownServiceError);
  });

  it("rejects an unknown service area", () => {
    expect(() =>
      requestBooking(
        { services, serviceAreas, bookings, auditEvents },
        {
          serviceId: "SVC-TEST-SERVICE",
          serviceAreaId: "LOC-AE-MISSING",
          schedulePreference: "weekday mornings",
          actor: "test-actor",
        }
      )
    ).toThrow(UnknownServiceAreaError);
  });
});
