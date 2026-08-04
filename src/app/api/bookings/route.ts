/**
 * API boundary for Booking Request per 08_DIGITAL_SYSTEMS/API_CONTRACTS.md.
 * Validates input, delegates to the booking service, and returns API
 * envelopes.
 *
 * BookingRequest persistence goes through the repository factory (Database
 * Foundation Phase 1H — fourth controlled switchover, after Consent,
 * Enquiry, and Customer, see
 * 07_WEBSITE/BOOKING_SYSTEM/08_REPOSITORY_SWITCHOVER_PLAN.md). Driver is
 * selected by REPOSITORY_DRIVER (default "memory" — unset in every
 * deployed environment today, so production behavior is unchanged).
 * Service and ServiceArea are deliberately untouched — still the plain
 * in-memory adapters, exported so tests can seed/inspect them. AuditEvent
 * (Phase 1J — the last of the six-entity migration series) also now goes
 * through the factory.
 */

import { NextRequest, NextResponse } from "next/server";
import type { ApiEnvelope, ApiErrorBody } from "@/types/api";
import type { ServiceAreaId, ServiceId } from "@/types/domain";
import {
  getAuditEventRepository,
  getBookingRequestRepository,
} from "@/lib/adapters/repository-factory";
import { createInMemoryServiceRepository } from "@/lib/adapters/in-memory/service-repository";
import { createInMemoryServiceAreaRepository } from "@/lib/adapters/in-memory/service-area-repository";
import { requestBooking } from "@/lib/services/booking-service";
import { UnknownServiceAreaError, UnknownServiceError } from "@/lib/services/errors";
import { logError } from "@/lib/logging/logger";

export const bookingRepository = getBookingRequestRepository();
export const serviceRepository = createInMemoryServiceRepository();
export const serviceAreaRepository = createInMemoryServiceAreaRepository();
export const auditEventRepository = getAuditEventRepository();

const API_VERSION = "v1";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isServiceId(value: unknown): value is ServiceId {
  return typeof value === "string" && value.startsWith("SVC-");
}

function isServiceAreaId(value: unknown): value is ServiceAreaId {
  return typeof value === "string" && value.startsWith("LOC-AE-");
}

function envelope<T>(data: T): ApiEnvelope<T> {
  return { apiVersion: API_VERSION, correlationId: crypto.randomUUID(), data };
}

function errorResponse(
  status: number,
  code: string,
  message: string,
  retryable = false
) {
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

  const { customerId, serviceId, serviceAreaId, schedulePreference, actor } =
    body as Record<string, unknown>;

  if (
    !isNonEmptyString(customerId) ||
    !isServiceId(serviceId) ||
    !isServiceAreaId(serviceAreaId) ||
    !isNonEmptyString(schedulePreference) ||
    !isNonEmptyString(actor)
  ) {
    return errorResponse(
      400,
      "validation_error",
      "customerId, serviceId (SVC-*), serviceAreaId (LOC-AE-*), schedulePreference, and actor are required"
    );
  }

  try {
    const bookingRequest = await requestBooking(
      {
        bookings: bookingRepository,
        services: serviceRepository,
        serviceAreas: serviceAreaRepository,
        auditEvents: auditEventRepository,
      },
      {
        customerId,
        serviceId,
        serviceAreaId,
        schedulePreference,
        actor,
      }
    );
    return NextResponse.json(envelope(bookingRequest), { status: 201 });
  } catch (error) {
    if (error instanceof UnknownServiceError || error instanceof UnknownServiceAreaError) {
      return errorResponse(404, "not_found", error.message);
    }
    logError("Unexpected error in POST /api/bookings", error, { route: "bookings", method: "POST" });
    return errorResponse(500, "internal_error", "An unexpected error occurred. Please try again.");
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  const serviceId = searchParams.get("serviceId");

  if (id) {
    const bookingRequest = await bookingRepository.findById(id);
    if (!bookingRequest) {
      return errorResponse(404, "not_found", `Booking request ${id} not found`);
    }
    return NextResponse.json(envelope(bookingRequest));
  }

  if (serviceId) {
    if (!isServiceId(serviceId)) {
      return errorResponse(400, "validation_error", "serviceId is not a valid Service id");
    }
    return NextResponse.json(envelope(await bookingRepository.findByService(serviceId)));
  }

  return errorResponse(
    400,
    "validation_error",
    "id or serviceId query parameter is required"
  );
}
