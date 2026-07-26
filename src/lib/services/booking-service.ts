/**
 * PROVISIONAL (M1.1) — 08_DIGITAL_SYSTEMS/DATA_MODEL.md is Status: Draft —
 * Contract Review Required. Booking Request: "requested service, location,
 * schedule preference, and status."
 *
 * Scope limit: only the "requested" transition is implemented.
 * AUTONOMY_AND_APPROVAL_MATRIX.md gates "Confirm booking availability" on
 * live capacity rules, which no adapter provides yet — confirming,
 * rescheduling, or cancelling a booking is out of scope for this job.
 */

import type { BookingRequest } from "@/types/domain";
import type {
  AuditEventRepository,
  BookingRequestRepository,
  ServiceAreaRepository,
  ServiceRepository,
} from "@/lib/adapters/types";
import { generateId, writeAuditEvent } from "./audit";
import { UnknownServiceAreaError, UnknownServiceError } from "./errors";

export interface RequestBookingInput {
  serviceId: BookingRequest["serviceId"];
  serviceAreaId: BookingRequest["serviceAreaId"];
  schedulePreference: string;
  actor: string;
}

export function requestBooking(
  deps: {
    bookings: BookingRequestRepository;
    services: ServiceRepository;
    serviceAreas: ServiceAreaRepository;
    auditEvents: AuditEventRepository;
  },
  input: RequestBookingInput
): BookingRequest {
  if (!deps.services.findById(input.serviceId)) {
    throw new UnknownServiceError(input.serviceId);
  }
  if (!deps.serviceAreas.findById(input.serviceAreaId)) {
    throw new UnknownServiceAreaError(input.serviceAreaId);
  }
  if (!input.schedulePreference) {
    throw new Error("schedulePreference is required");
  }

  const bookingRequest: BookingRequest = {
    id: generateId("book"),
    serviceId: input.serviceId,
    serviceAreaId: input.serviceAreaId,
    schedulePreference: input.schedulePreference,
    status: "requested",
  };

  deps.bookings.create(bookingRequest);
  writeAuditEvent(deps.auditEvents, {
    actor: input.actor,
    action: "booking_request.requested",
    target: bookingRequest.id,
    outcome: "success",
  });

  return bookingRequest;
}
