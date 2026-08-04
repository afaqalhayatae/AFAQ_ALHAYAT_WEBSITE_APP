/**
 * PROVISIONAL (M1.1) — 08_DIGITAL_SYSTEMS/DATA_MODEL.md is Status: Draft —
 * Contract Review Required. Booking Request: "requested service, location,
 * schedule preference, and status." customerId added in DATA_MODEL.md v0.3
 * (M2.3 Customer Ownership Domain Amendment) — required and validated like
 * every other field here, so a booking request can always be attributed to
 * the customer who made it.
 *
 * Scope limit: only the "requested" transition is implemented.
 * AUTONOMY_AND_APPROVAL_MATRIX.md gates "Confirm booking availability" on
 * live capacity rules, which no adapter provides yet — confirming,
 * rescheduling, or cancelling a booking is out of scope for this job.
 */

import type { BookingRequest } from "@/types/domain";
import type { ServiceAreaRepository, ServiceRepository } from "@/lib/adapters/types";
import type {
  AsyncBookingRequestRepository,
  AsyncAuditEventRepository,
} from "@/lib/adapters/prisma/types";
import { generateId, writeAuditEvent } from "./audit";
import { UnknownServiceAreaError, UnknownServiceError } from "./errors";

export interface RequestBookingInput {
  customerId: BookingRequest["customerId"];
  serviceId: BookingRequest["serviceId"];
  serviceAreaId: BookingRequest["serviceAreaId"];
  schedulePreference: string;
  actor: string;
}

// bookings (Phase 1H) and auditEvents (Phase 1J) are both now async-typed —
// both are awaited below. services/serviceAreas stay the existing
// synchronous repositories, untouched (not in the migration priority list)
// — their .findById calls are unchanged, not awaited. No business logic
// changed at any point, only the repository contract each dependency
// satisfies.
export async function requestBooking(
  deps: {
    bookings: AsyncBookingRequestRepository;
    services: ServiceRepository;
    serviceAreas: ServiceAreaRepository;
    auditEvents: AsyncAuditEventRepository;
  },
  input: RequestBookingInput
): Promise<BookingRequest> {
  if (!input.customerId) {
    throw new Error("customerId is required");
  }
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
    customerId: input.customerId,
    serviceId: input.serviceId,
    serviceAreaId: input.serviceAreaId,
    schedulePreference: input.schedulePreference,
    status: "requested",
  };

  await deps.bookings.create(bookingRequest);
  await writeAuditEvent(deps.auditEvents, {
    actor: input.actor,
    action: "booking_request.requested",
    target: bookingRequest.id,
    outcome: "success",
  });

  return bookingRequest;
}
