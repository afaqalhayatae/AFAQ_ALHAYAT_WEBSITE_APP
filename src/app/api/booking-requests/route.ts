/**
 * API boundary for the customer-facing booking form
 * (src/components/booking/booking-form.tsx, via
 * src/lib/booking/submit-booking-request.ts). Distinct from /api/bookings
 * (which expects an already-resolved customerId / SVC-* / LOC-AE-* contract
 * from a caller that already knows those IDs) — this route accepts the
 * form's real fields (name/phone/email/emirateSlug/serviceSlug/date/
 * timeSlot/notes/etc.), resolves the slugs against the same approved
 * catalogs (src/lib/catalog/services.ts, locations.ts), creates a guest
 * Customer record, and delegates to the same requestBooking() service and
 * in-memory repositories /api/bookings already uses — one domain model,
 * not a second parallel one.
 *
 * Service and ServiceArea below are deliberately untouched — still the
 * plain in-memory adapters, and no notification channel (email/CRM/
 * WhatsApp) is configured yet. This is a genuine step up from a
 * client-side fake (real validation, a real generated ID, a real audit
 * trail) but not yet production-durable for those two — do not represent
 * it as such to customers.
 *
 * Customer (Phase 1G), BookingRequest (Phase 1H), and AuditEvent (Phase 1J
 * — the last of the six-entity migration series) all go through the
 * repository factory and are durably Prisma-backed when
 * REPOSITORY_DRIVER=prisma is set against a reachable local database — see
 * 07_WEBSITE/BOOKING_SYSTEM/08_REPOSITORY_SWITCHOVER_PLAN.md. All three read
 * the same process-level env var, so they always resolve to the same
 * driver within one request. In every deployed environment today the flag
 * is unset, so this still behaves exactly as the in-memory version did.
 */

import { NextRequest, NextResponse } from "next/server";
import type { ApiEnvelope, ApiErrorBody } from "@/types/api";
import type { BookingRequest, Customer, ServiceAreaId, ServiceId } from "@/types/domain";
import {
  getAuditEventRepository,
  getBookingRequestRepository,
  getCustomerRepository,
} from "@/lib/adapters/repository-factory";
import { createInMemoryServiceRepository } from "@/lib/adapters/in-memory/service-repository";
import { createInMemoryServiceAreaRepository } from "@/lib/adapters/in-memory/service-area-repository";
import { requestBooking } from "@/lib/services/booking-service";
import { UnknownServiceAreaError, UnknownServiceError } from "@/lib/services/errors";
import { generateId, writeAuditEvent } from "@/lib/services/audit";
import { SERVICES, getServiceBySlug } from "@/lib/catalog/services";
import { ALL_EMIRATES, getEmirateBySlug } from "@/lib/catalog/locations";
import type { BookingRequestPayload } from "@/lib/booking/submit-booking-request";

export const bookingRepository = getBookingRequestRepository();
export const serviceRepository = createInMemoryServiceRepository();
export const serviceAreaRepository = createInMemoryServiceAreaRepository();
export const customerRepository = getCustomerRepository();
export const auditEventRepository = getAuditEventRepository();

/**
 * Extra fields the new booking form collects that the approved
 * BookingRequest entity (DATA_MODEL.md, Status: Draft — Contract Review
 * Required per booking-service.ts) has no field for yet — property type/
 * size, pest type, problem notes, uploaded file names, preferred contact
 * method. Kept as a separate side-table keyed by the generated booking
 * request id rather than widening the approved entity without a real
 * DATA_MODEL.md change. Exported so tests can inspect/clear it.
 */
export const bookingFormDetailsById = new Map<string, BookingRequestPayload>();

// Seed the real approved catalogs once per server instance so
// requestBooking()'s validation has real Service/ServiceArea records to
// check — these repositories start empty otherwise (as /api/bookings's
// own tests already had to do manually).
for (const service of SERVICES) {
  serviceRepository.upsert({ id: service.id as ServiceId });
}
for (const emirate of ALL_EMIRATES) {
  serviceAreaRepository.upsert({ id: emirate.id as ServiceAreaId });
}

const API_VERSION = "v1";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function envelope<T>(data: T): ApiEnvelope<T> {
  return { apiVersion: API_VERSION, correlationId: crypto.randomUUID(), data };
}

function errorResponse(status: number, code: string, message: string, retryable = false) {
  const body: ApiErrorBody = {
    apiVersion: API_VERSION,
    correlationId: crypto.randomUUID(),
    error: { code, message, retryable },
  };
  return NextResponse.json(body, { status });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "invalid_json", "Request body must be valid JSON");
  }
  if (typeof body !== "object" || body === null) {
    return errorResponse(400, "invalid_body", "Request body must be a JSON object");
  }

  const payload = body as Partial<BookingRequestPayload>;
  const name = payload.customer?.name;
  const phoneE164 = payload.customer?.phoneE164;
  const email = payload.customer?.email;
  const emirateSlug = payload.location?.emirateSlug;
  const serviceSlug = payload.service?.serviceSlug;
  const date = payload.appointment?.date;
  const timeSlot = payload.appointment?.timeSlot;

  if (
    !isNonEmptyString(name) ||
    !isNonEmptyString(phoneE164) ||
    !isNonEmptyString(emirateSlug) ||
    !isNonEmptyString(serviceSlug) ||
    !isNonEmptyString(date) ||
    !isNonEmptyString(timeSlot)
  ) {
    return errorResponse(
      400,
      "validation_error",
      "customer.name, customer.phoneE164, location.emirateSlug, service.serviceSlug, appointment.date, and appointment.timeSlot are required"
    );
  }

  const service = getServiceBySlug(serviceSlug);
  const emirate = getEmirateBySlug(emirateSlug);
  if (!service) {
    return errorResponse(404, "not_found", `Unknown service slug "${serviceSlug}"`);
  }
  if (!emirate) {
    return errorResponse(404, "not_found", `Unknown emirate slug "${emirateSlug}"`);
  }

  const customer: Customer = {
    id: generateId("cust"),
    contactPoints: [
      { channel: "phone", value: phoneE164 },
      ...(isNonEmptyString(email) ? [{ channel: "email" as const, value: email }] : []),
    ],
  };
  await customerRepository.create(customer);
  await writeAuditEvent(auditEventRepository, {
    actor: "website-booking-form",
    action: "customer.created_from_booking_form",
    target: customer.id,
    outcome: "success",
  });

  let bookingRequest: BookingRequest;
  try {
    bookingRequest = await requestBooking(
      {
        bookings: bookingRepository,
        services: serviceRepository,
        serviceAreas: serviceAreaRepository,
        auditEvents: auditEventRepository,
      },
      {
        customerId: customer.id,
        serviceId: service.id as ServiceId,
        serviceAreaId: emirate.id as ServiceAreaId,
        schedulePreference: `${date} ${timeSlot}`,
        actor: "website-booking-form",
      }
    );
  } catch (error) {
    if (error instanceof UnknownServiceError || error instanceof UnknownServiceAreaError) {
      return errorResponse(404, "not_found", error.message);
    }
    return errorResponse(400, "validation_error", error instanceof Error ? error.message : "Invalid request");
  }

  bookingFormDetailsById.set(bookingRequest.id, payload as BookingRequestPayload);

  return NextResponse.json(envelope(bookingRequest), { status: 201 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  if (!id) {
    return errorResponse(400, "validation_error", "id query parameter is required");
  }
  const bookingRequest = await bookingRepository.findById(id);
  if (!bookingRequest) {
    return errorResponse(404, "not_found", `Booking request ${id} not found`);
  }
  return NextResponse.json(
    envelope({ ...bookingRequest, formDetails: bookingFormDetailsById.get(id) })
  );
}
